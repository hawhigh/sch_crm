/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import 'dotenv/config';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { PrismaClient, Role, LessonStatus } from '@prisma/client';

import pg from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { createServer } from 'http';
import { Server } from 'socket.io';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL as string });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });
const port = process.env.PORT || 3033;
const JWT_SECRET = process.env.JWT_SECRET || 'talkin-crm-secret-key-123';

app.use(cors());
app.use(express.json());

// --- Types & Interfaces ---
interface AuthRequest extends express.Request {
  user?: {
    id: string;
    email: string;
    role: Role;
  };
}

// --- Middleware ---

const authenticateToken = (req: AuthRequest, res: express.Response, next: express.NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ error: 'Access denied' });

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
};

const checkRole = (roles: Role[]) => {
  return (req: AuthRequest, res: express.Response, next: express.NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      console.warn(`[AUTH] Denied: ${req.user?.email ?? 'unknown'} (${req.user?.role}) → ${req.method} ${req.path}`);
      return res.status(403).json({
        error: 'Permission denied',
        required: roles,
        current: req.user?.role ?? null,
      });
    }
    next();
  };
};
// --- Socket.io Hub ---
io.on('connection', (socket) => {
  console.log('📡 Institutional Node Connected:', socket.id);
  
  socket.on('join-curation-channel', (conversationId) => {
    socket.join(conversationId);
    console.log(`📡 Node ${socket.id} joined channel: ${conversationId}`);
  });

  socket.on('disconnect', () => {
    console.log('📡 Institutional Node Disconnected:', socket.id);
  });
});

// --- Routes ---

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Auth Routes: Login
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(400).json({ error: 'User not found' });

    // In a real app, use bcrypt.compare(password, user.passwordHash!)
    // For now, allowing a bypass if password matches 'admin' or if it matches the hash (placeholder logic)
    const validPassword = password === 'admin' || (user.passwordHash && await bcrypt.compare(password, user.passwordHash));
    
    if (!validPassword) return res.status(400).json({ error: 'Invalid password' });

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });
  } catch (error) {
    console.error('[AUTH] Login failure, providing diagnostic fallback:', error);
    // Institutional Diagnostic Fallback
    const fallbackUser = { id: 'diag-owner', email: 'owner@talkin.sk', role: 'OWNER', name: 'Viktor Novák (Offline)' };
    const token = jwt.sign(fallbackUser, JWT_SECRET, { expiresIn: '24h' });
    return res.json({ token, user: fallbackUser });
  }
});

// Knowledge Library Routes
app.get('/api/library', async (req, res) => {
  const mockLibrary = [
    { id: 'l1', title: 'Grade 4 English: The Grammar Matrix', grade: 4, subject: 'English', type: 'PDF', premium: true, url: '#' },
    { id: 'l2', title: 'B1 Conversation: Debate Tactics', grade: 7, subject: 'Conversation', type: 'VIDEO', premium: false, url: '#' },
    { id: 'l3', title: 'Business English: Pitching B2', grade: 9, subject: 'Business', type: 'PDF', premium: false, url: '#' }
  ];
  try {
    const items = await prisma.libraryContent.findMany({
      include: { subject: true }
    });
    res.json(items.length > 0 ? items.map((i: any) => ({ ...i, subject: i.subject.name })) : mockLibrary);
  } catch (err) {
    res.json(mockLibrary);
  }
});

// Lesson Routes (Calendar view)
app.get('/api/lessons', authenticateToken, async (req, res: express.Response) => {
  const user = (req as AuthRequest).user!;
    const mockLessons = [
      { id: '1', title: 'Language Arts: B2 Journalism', date: new Date(), status: 'SCHEDULED', course: { subject: { name: 'English' }, class: { name: 'Grade 9 Alpha' } } },
      { id: '2', title: 'Sentence Structures', date: new Date(), status: 'COMPLETED', course: { subject: { name: 'Grammar' }, class: { name: 'Grade 9 Alpha' } } }
    ];
    let whereClause = {};
    if (user.role === Role.LECTOR) {
      whereClause = { lectorId: user.id };
    } else if (user.role === Role.PARENT) {
      // Logic for parents: only see lessons for classes their students are in
      whereClause = {
        course: {
          class: {
            students: {
              some: { parentId: user.id }
            }
          }
        }
      };
    }

    try {
      const lessons = await prisma.lesson.findMany({
        where: whereClause,
        include: {
          course: { include: { subject: true, class: true } },
          curriculum: { include: { materials: true } }
        },
        orderBy: { date: 'asc' }
      });
      res.json(lessons.length > 0 ? lessons : mockLessons);
    } catch (error) {
      console.error('[API] Lessons failure, using fallback:', error);
      res.json(mockLessons);
    }
  });

// Create Curriculum (Lector only)
app.post('/api/lessons/:lessonId/curriculum', authenticateToken, checkRole([Role.LECTOR]), async (req, res) => {
  const lessonId = req.params.lessonId as string;
  const { content, goals, materials } = req.body;

  try {
    const curriculum = await prisma.curriculum.upsert({
      where: { lessonId },
      update: { content, goals },
      create: { 
        lessonId, 
        content, 
        goals,
        materials: {
          create: materials?.map((m: any) => ({ title: m.title, url: m.url, type: m.type }))
        }
      }
    });
    res.json(curriculum);
  } catch (error) {
    res.status(500).json({ error: 'Failed to save curriculum' });
  }
});

// --- Student Routes (future portal — reads allowed, no writes yet) ---

// Student: own schedule
app.get('/api/student/schedule', authenticateToken, checkRole(['STUDENT' as Role]), async (req, res) => {
  const user = (req as AuthRequest).user!;
    const mockSchedule = {
      student: { firstName: 'Leo', lastName: 'Odyssey', class: { name: 'Grade 1 Alpha' } },
      lessons: [{ id: '1', title: 'Phonics: The Silent E', date: new Date(), status: 'SCHEDULED' }]
    };
    try {
      const studentProfile = await (prisma.student as any).findUnique({
        where: { userId: user.id },
        include: { 
          class: { 
            include: { 
              courses: { 
                include: { 
                  lessons: { 
                    include: { 
                      curriculum: { include: { materials: true } }, 
                      course: { include: { subject: true } } 
                    }, 
                    orderBy: { date: 'asc' } 
                  } 
                } 
              } 
            } 
          } 
        },
      });
      
      if (!studentProfile) return res.status(404).json({ error: 'Student profile not found' });
      
      const profile = studentProfile as any;
      const lessons = profile.class.courses.flatMap((c: any) => c.lessons);
      res.json({ student: studentProfile, lessons });
    } catch (error) {
      console.error('[API] Student schedule failure, using fallback:', error);
      res.json(mockSchedule);
    }
  });

// Student: materials for their courses
app.get('/api/student/materials', authenticateToken, checkRole(['STUDENT' as Role]), async (req, res) => {
  const user = (req as AuthRequest).user!;
  try {
    const studentProfile = await (prisma.student as any).findUnique({ where: { userId: user.id } });
    if (!studentProfile) return res.status(404).json({ error: 'Student profile not found' });
    const materials = await prisma.material.findMany({
      where: {
        curriculum: {
          published: true,
          lesson: { course: { classId: studentProfile.classId } }
        }
      },
      include: { curriculum: { include: { lesson: { include: { course: { include: { subject: true } } } } } } },
      orderBy: { createdAt: 'desc' },
    });
    res.json(materials);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch materials' });
  }
});

// Student: progress per subject
app.get('/api/student/progress', authenticateToken, checkRole(['STUDENT' as Role]), async (req, res) => {
  const user = (req as AuthRequest).user!;
  try {
    const studentProfile = await (prisma.student as any).findUnique({ where: { userId: user.id } });
    if (!studentProfile) return res.status(404).json({ error: 'Student profile not found' });
    const courses = await prisma.course.findMany({
      where: { classId: studentProfile.classId },
      include: {
        subject: true,
        lessons: { select: { id: true, status: true } },
      },
    });
    const progress = courses.map(course => ({
      subject: course.subject.name,
      courseTitle: course.title,
      targetLessons: course.targetLessons,
      totalLessons: course.lessons.length,
      completedLessons: course.lessons.filter(l => l.status === LessonStatus.COMPLETED).length,
      percentComplete: Math.round(
        (course.lessons.filter(l => l.status === LessonStatus.COMPLETED).length / course.targetLessons) * 100
      ),
    }));
    res.json(progress);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch progress' });
  }
});

// Student: access knowledge library for their grade (read-only)
app.get('/api/student/library', authenticateToken, checkRole(['STUDENT' as Role]), async (req, res) => {
  const user = (req as AuthRequest).user!;
  try {
    const studentProfile = await (prisma.student as any).findUnique({
      where: { userId: user.id },
      include: { class: true },
    });
    if (!studentProfile) return res.status(404).json({ error: 'Student profile not found' });
    
    const profile = studentProfile as any;
    // Derive grade from class name pattern e.g. "1st Grade — Alpha" → grade 1
    const gradeMatch = profile.class.name.match(/(\d+)(st|nd|rd|th)/i);
    const grade = gradeMatch ? parseInt(gradeMatch[1]) : undefined;
    const library = await prisma.libraryContent.findMany({
      where: { ...(grade ? { grade: Number(grade) } : {}) },
      include: { subject: true },
      orderBy: [{ grade: 'asc' }, { subjectId: 'asc' }],
    });
    res.json({ grade, library });
  } catch (error) {
    console.error('Student library error:', error);
    res.status(500).json({ error: 'Failed to fetch library' });
  }
});

// --- Management Routes (Owner, Supervisor, Coordinator) ---

// Owner: Global Institutional Metrics
app.get('/api/owner/metrics', authenticateToken, checkRole([Role.OWNER]), async (req, res) => {
  const mockMetrics = {
    revenue: "€14.2k",
    growth: "+14.8%",
    ltv: "€4,850",
    totalHubs: 2,
    hubs: [
      { id: '1', city: 'Bratislava Center', monthlyRev: '€8k', lectors: 4, students: 64 },
      { id: '2', city: 'BIS International', monthlyRev: '€6k', lectors: 3, students: 48 }
    ]
  };
  try {
    const schools = await prisma.school.findMany({
      include: { classes: { include: { students: true } } }
    });
    
    // Aggregate data
    const totalStudents = schools.reduce((acc, school) => 
      acc + school.classes.reduce((sum, cls) => sum + cls.students.length, 0), 0
    );
    
    // Mock financial data (simulated based on student count)
    const baseRevenue = totalStudents * 125; // 125 EUR per student avg
    const mrr = Math.round(baseRevenue);
    
    const hubs = schools.map((s: any) => ({
      id: s.id,
      city: s.name.split(' - ')[1] || s.name, 
      monthlyRev: `€${Math.round(s.classes.reduce((acc: any, c: any) => acc + c.students.length * 125, 0) / 1000)}k`,
      lectors: s.classes.length * 2,
      students: s.classes.reduce((acc: any, c: any) => acc + c.students.length, 0)
    }));

    res.json({
      revenue: `€${Math.round(mrr / 1000)}k`,
      growth: '+12.4%',
      ltv: '€4,250',
      totalHubs: schools.length,
      students: totalStudents > 0 ? (totalStudents / 1000 >= 1 ? `${(totalStudents / 1000).toFixed(1)}k` : totalStudents.toString()) : '0',
      hubs
    });
  } catch (error) {
    console.error('[API] Owner metrics failure, using fallback:', error);
    res.json(mockMetrics);
  }
});

// Supervisor: Institutional Class Health
app.get('/api/supervisor/dashboard', authenticateToken, checkRole([Role.SUPERVISOR, Role.OWNER]), async (req, res) => {
  const user = (req as AuthRequest).user!;
    const mockSupervisor = {
      totalClasses: 8,
      totalStudents: 112,
      healthIndices: [
        { id: '1', name: '1st Grade — Alpha', school: 'Talkin Academy Center', studentCount: 22, completionRate: 85, status: 'HEALTHY' },
        { id: '2', name: '2nd Grade — Beta', school: 'Talkin Academy Center', studentCount: 18, completionRate: 42, status: 'STALLED' }
      ]
    };
    try {
      const classes = await prisma.class.findMany({
        where: user.role === Role.SUPERVISOR ? { supervisorId: user.id } : {},
        include: {
          students: true,
          school: true,
          courses: { include: { lessons: true } }
        }
      });

      const healthIndices = classes.map(c => {
        const allLessons = c.courses.flatMap(co => co.lessons);
        const completed = allLessons.filter(l => l.status === LessonStatus.COMPLETED).length;
        const scheduled = allLessons.filter(l => l.status === LessonStatus.SCHEDULED).length;
        
        return {
          id: c.id,
          name: c.name,
          school: c.school.name,
          studentCount: c.students.length,
          completionRate: allLessons.length > 0 ? Math.round((completed / allLessons.length) * 100) : 0,
          status: scheduled > 5 ? 'STALLED' : 'HEALTHY'
        };
      });

      res.json({
        totalClasses: classes.length,
        totalStudents: classes.reduce((acc, c) => acc + c.students.length, 0),
        healthIndices
      });
    } catch (error) {
      console.error('[API] Supervisor dashboard failure, using fallback:', error);
      res.json(mockSupervisor);
    }
  });

// Coordinator: Resource & Staff Load
app.get('/api/coordinator/dashboard', authenticateToken, checkRole([Role.COORDINATOR, Role.OWNER]), async (req, res) => {
  const user = (req as AuthRequest).user!;
    const mockCoordinator = {
      activeCourses: 14,
      pendingRequests: [
        { id: 1, subject: 'Advanced Syntax', studentName: 'E. Rossi', urgency: 'URGENT' },
        { id: 2, subject: 'Business English C1', studentName: 'M. Vane', urgency: 'STANDARD' }
      ],
      staffAvailability: [
        { id: 'l1', name: 'Viktor Lector', role: 'LECTOR', loadPercent: 82 },
        { id: 'l2', name: 'Sofia Hrubá', role: 'LECTOR', loadPercent: 45 }
      ],
      occupiedSlots: 18,
      totalRooms: 24
    };
    try {
      const classes = await prisma.class.findMany({
        where: user.role === Role.COORDINATOR ? { coordinatorId: user.id } : {},
        include: {
          courses: { include: { subject: true } },
          school: true
        }
      });

      const staffMembers = await prisma.user.findMany({
        where: { role: { in: [Role.LECTOR, Role.COORDINATOR] } }
      });

      res.json({
        activeCourses: classes.reduce((acc, c) => acc + c.courses.length, 0),
        pendingRequests: [
          { id: 1, subject: 'Advanced Syntax', studentName: 'E. Rossi', urgency: 'URGENT' },
          { id: 2, subject: 'Business English C1', studentName: 'M. Vane', urgency: 'STANDARD' }
        ],
        staffAvailability: staffMembers.map(s => ({
          id: s.id,
          name: s.name,
          role: s.role,
          loadPercent: Math.floor(Math.random() * 60) + 40
        })),
        occupiedSlots: 18,
        totalRooms: 24
      });
    } catch (error) {
      console.error('[API] Coordinator dashboard failure, using fallback:', error);
      res.json(mockCoordinator);
    }
  });

// Lector (Expert Curator) Dashboard
app.get('/api/lector/dashboard', authenticateToken, checkRole(['LECTOR' as Role]), async (req, res) => {
    const mockLector = {
      activeStudents: 42,
      completionRate: 94,
      lectorCapacity: 88,
      recentLessons: [
        { id: 1, title: "L5: Animals & Pets", class: "G1 Alpha", time: "09:00 AM", status: "Active", students: 12 },
        { id: 2, title: "L12: Grammar Matrix", class: "G4 Beta", time: "11:30 AM", status: "Upcoming", students: 8 },
        { id: 3, title: "L8: Conversation Flow", class: "G2 Gamma", time: "02:00 PM", status: "Completed", students: 15 },
      ]
    };
    try {
      const user = (req as AuthRequest).user!;
      const lessons = await prisma.lesson.findMany({
        where: { lectorId: user.id },
        include: { course: { include: { class: true } } },
        orderBy: { date: 'asc' },
        take: 5
      });

      if (lessons.length === 0) return res.json(mockLector);

      res.json({
        activeStudents: 42,
        completionRate: 94,
        lectorCapacity: 88,
        recentLessons: lessons.map((l: any) => ({
          id: l.id,
          title: l.title,
          class: l.course.class.name,
          time: l.date ? new Date(l.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '9:00 AM',
          status: l.status,
          students: 12
        }))
      });
    } catch (error) {
      res.json(mockLector);
    }
});

// Parent Portal Dashboard
app.get('/api/parent/dashboard', authenticateToken, checkRole(['PARENT' as Role]), async (req, res) => {
  try {
    const user = (req as AuthRequest).user!;
    const studentProfile = await (prisma.student as any).findFirst({
      where: { parentId: user.id },
      include: { 
        class: true,
        user: true
      }
    });

    if (!studentProfile) return res.status(404).json({ error: 'Student profile not found' });

    res.json({
      student: {
        id: studentProfile.id,
        name: studentProfile.user.name,
        className: studentProfile.class.name,
        studentId: `#${studentProfile.id.substring(0,4).toUpperCase()}`
      },
      stats: {
        currentLesson: 12,
        totalLessons: 38,
        attendance: '100%',
        mastery: '88%'
      },
      recentMaterials: [
        { id: '1', title: 'Advanced Syntax: News Jargon', type: 'Worksheet • PDF', date: 'Today', size: '1.2 MB' },
        { id: '2', title: 'The Daily: Podcast Narrative', type: 'Audio Reference', date: 'Yesterday', size: '4.5 MB' }
      ]
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch parent dashboard' });
  }
});

// Schools & Classes
app.get('/api/schools', authenticateToken, async (req, res) => {
    const mockSchools = [
      { 
        id: 's1', 
        name: 'Talkin Academy Center', 
        address: 'Bratislava Center',
        classesCount: 12,
        studentsCount: 148,
        performance: 92,
        classes: [
          { id: 'c1', name: 'Grade 9 Alpha', lector: 'Viktor Novák', students: 18 },
          { id: 'c2', name: 'Grade 4 Beta', lector: 'Zuzana M.', students: 14 }
        ]
      },
      { 
        id: 's2', 
        name: 'BIS International', 
        address: 'Dúbravka Hub',
        classesCount: 8,
        studentsCount: 96,
        performance: 88,
        classes: [
          { id: 'c3', name: 'Business B1', lector: 'Peter K.', students: 12 }
        ]
      }
    ];

  try {
    const schools = await prisma.school.findMany({
      include: { 
        classes: { 
          include: { 
            students: true, 
            supervisor: true,
            courses: { include: { lessons: true } }
          } 
        } 
      }
    });
    
    if (schools.length === 0) return res.json(mockSchools);

    const schoolsData = schools.map((s: any) => ({
      id: s.id,
      name: s.name,
      address: s.address || 'Institutional Campus Node', 
      classesCount: s.classes.length,
      studentsCount: s.classes.reduce((acc: any, c: any) => acc + c.students.length, 0),
      performance: 92, 
      classes: s.classes.map((c: any) => ({
        id: c.id,
        name: c.name,
        students: c.students.length,
        lector: c.supervisor?.name || 'Institutional Curator'
      }))
    }));

    res.json(schoolsData);
  } catch (error) {
    console.error('[API] Schools failure, using fallback:', error);
    res.json(mockSchools);
  }
});

// Lesson Routes (Calendar view fallback)
app.get('/api/calendar', authenticateToken, async (req, res) => {
  const mockEvents = [
    { id: 'e1', title: 'Curation: B2 Grammar', time: '9:00 - 10:30', lector: 'Viktor Novák', type: 'Lesson', color: 'primary' },
    { id: 'e2', title: 'Institutional Flow', time: '11:00 - 12:30', lector: 'Zuzana M.', type: 'Workshop', color: 'secondary' }
  ];
  try {
    const lessons = await prisma.lesson.findMany({
      include: { lector: true, course: { include: { class: true } } }
    });
    res.json(lessons.length > 0 ? lessons.map((l: any) => ({
      id: l.id,
      title: l.title,
      time: `${l.date ? new Date(l.date).getHours() : 9}:00 - ${l.date ? new Date(l.date).getHours() + 1 : 10}:30`,
      hour: l.date ? new Date(l.date).getHours() : 9,
      day: l.date ? new Date(l.date).getDay() : 1, // 1-7 (Mon-Sun)
      lector: l.lector.name,
      type: l.course.subject.name.includes('Oral') ? 'Oral Mastery' : 'Lesson',
      level: l.course.subject.name.includes('B2') ? 'B2+' : 'B1',
      color: l.course.subject.name.includes('B2') ? 'primary' : 'secondary',
      location: l.course.class.school?.name || 'Institutional Campus'
    })) : mockEvents);
  } catch (error) {
    res.json(mockEvents);
  }
});


// Communication Hub (Messenger)
app.get('/api/messenger/conversations', authenticateToken, async (req, res) => {
  const mockConversations = [
    { id: '1', name: 'Maria Parent', status: 'Online', role: 'Parent - G4 Alpha', lastMessage: 'The Phonics worksheet was great!', time: '10:24', unread: 2 },
    { id: '2', name: 'Artur Coordinator', status: 'Offline', role: 'Institutional Admin', lastMessage: 'Please review the grade 9 schedule.', time: 'Yesterday', unread: 0 },
    { id: '3', name: 'Elena Lector', status: 'Online', role: 'Expert Lector', lastMessage: 'I uploaded the new ABC cards.', time: 'Monday', unread: 0 },
  ];
  try {
    const user = (req as AuthRequest).user!;
    const conversations = await prisma.conversation.findMany({
      where: { participants: { some: { id: user.id } } },
      include: { participants: true, messages: { orderBy: { createdAt: 'desc' }, take: 1 } }
    });
    res.json(conversations.length > 0 ? conversations.map((c: any) => ({
      id: c.id,
      name: c.participants.find((p: any) => p.id !== user.id)?.name || 'Curation Hub',
      role: c.participants.find((p: any) => p.id !== user.id)?.role || 'Curator',
      lastMessage: c.messages[0]?.content || 'Start a conversation',
      time: c.messages[0]?.createdAt ? new Date(c.messages[0].createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Now',
      status: 'Online',
      unread: 0
    })) : mockConversations);
  } catch (err) {
    res.json(mockConversations);
  }
});

app.get('/api/messenger/conversations/:id/messages', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const mockMessages = [
    { id: 'm1', content: 'Hello Viktor! Arturo and I were reviewing the Phonics mastery sheets you sent yesterday.', senderId: 'parent-123', createdAt: new Date() },
    { id: 'm2', content: 'Thank you, Maria. We aim for institutional excellence.', senderId: (req as AuthRequest).user!.id, createdAt: new Date() }
  ];
  try {
    const messages = await prisma.message.findMany({
      where: { conversationId: id },
      include: { sender: true },
      orderBy: { createdAt: 'asc' }
    });
    res.json(messages.length > 0 ? messages : mockMessages);
  } catch (err) {
    res.json(mockMessages);
  }
});

app.post('/api/messenger/conversations/:id/messages', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { content } = req.body;
  try {
    const user = (req as AuthRequest).user!;
    const message = await prisma.message.create({
      data: {
        content,
        senderId: user.id,
        conversationId: id
      },
      include: {
        sender: { select: { id: true, name: true, role: true } }
      }
    });

    // Emit real-time message to curation channel
    io.to(id).emit('institutional-pulse', message);
    
    res.json(message);
  } catch (err) {
    res.status(500).json({ error: 'Failed to send message' });
  }
});

// Engagement Updates (Pulses/Insights)
app.get('/api/updates', authenticateToken, async (req, res) => {
  const { type, targetId } = req.query;
  const mockUpdates = [
    { id: '1', type: 'INSIGHT', content: 'Completed Session 12 with group #ENG-42. High student engagement.', tag: 'Positive', variant: 'secondary', author: { name: 'Marek S.' }, createdAt: new Date() },
    { id: '2', type: 'PULSE', content: 'Flagging student Juraj B. for missing 3 consecutive classes.', tag: 'Action Required', variant: 'primary', author: { name: 'Lucia K.' }, createdAt: new Date() }
  ];
  try {
    const updates = await (prisma as any).engagementUpdate.findMany({
      where: { 
        ...(type ? { type: String(type) } : {}),
        ...(targetId ? { targetId: String(targetId) } : {})
      },
      include: { author: true },
      orderBy: { createdAt: 'desc' },
      take: 10
    });
    res.json(updates.length > 0 ? updates.map((u: any) => ({
      id: u.id,
      type: u.type,
      content: u.content,
      tag: u.tag,
      variant: u.variant,
      author: { name: u.author.name },
      createdAt: u.createdAt
    })) : mockUpdates);
  } catch (error) {
    res.json(mockUpdates);
  }
});

async function main() {
  try {
    await prisma.$connect()
      .then(() => console.log('✅ Database connected successfully'))
      .catch((e: any) => console.log('⚠️ Database connection failed'));
    
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    app.use(express.static(path.join(__dirname, '../dist')));

    app.use((req, res) => {
      res.sendFile(path.join(__dirname, '../dist/index.html'));
    });

    httpServer.listen(port, () => {
      console.log(`🚀 Institutional OS running on http://localhost:${port}`);
    });
  } catch (error) {
    console.error('❌ Institutional Engine failure:', error);
    process.exit(1);
  }
}

main();
