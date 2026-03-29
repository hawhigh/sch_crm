import { PrismaClient, Role, LessonStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';
import "dotenv/config";
import pg from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL as string });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Seeding Talkin CRM v2 — full institutional dataset...');

  // --- 1. Cleanup (ordered by FK deps) ---
  await prisma.material.deleteMany();
  await prisma.curriculum.deleteMany();
  await prisma.lesson.deleteMany();
  await prisma.course.deleteMany();
  await prisma.libraryContent.deleteMany();
  await prisma.subject.deleteMany();
  await prisma.student.deleteMany();
  await prisma.class.deleteMany();
  await prisma.school.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await bcrypt.hash('admin', 10);

  // --- 2. Create All Users (6 roles) ---
  console.log('👤 Creating users...');

  const owner = await prisma.user.create({
    data: {
      email: 'owner@talkin.sk',
      name: 'Viktor Novák',
      passwordHash,
      role: Role.OWNER,
      avatar: 'https://i.pravatar.cc/150?u=owner',
    },
  });

  const coordinator = await prisma.user.create({
    data: {
      email: 'coordinator@talkin.sk',
      name: 'Jana Kováčová',
      passwordHash,
      role: Role.COORDINATOR,
      avatar: 'https://i.pravatar.cc/150?u=coordinator',
    },
  });

  const supervisor = await prisma.user.create({
    data: {
      email: 'supervisor@talkin.sk',
      name: 'Marek Šimko',
      passwordHash,
      role: Role.SUPERVISOR,
      avatar: 'https://i.pravatar.cc/150?u=supervisor',
    },
  });

  const lector = await prisma.user.create({
    data: {
      email: 'lector@talkin.sk',
      name: 'Viktor Lector',
      passwordHash,
      role: Role.LECTOR,
      avatar: 'https://i.pravatar.cc/150?u=lector',
    },
  });

  const lector2 = await prisma.user.create({
    data: {
      email: 'lector2@talkin.sk',
      name: 'Sofia Hrubá',
      passwordHash,
      role: Role.LECTOR,
      avatar: 'https://i.pravatar.cc/150?u=lector2',
    },
  });

  const parent = await prisma.user.create({
    data: {
      email: 'parent@talkin.sk',
      name: 'Leo Parent',
      passwordHash,
      role: Role.PARENT,
      avatar: 'https://i.pravatar.cc/150?u=parent',
    },
  });

  const parent2 = await prisma.user.create({
    data: {
      email: 'parent2@talkin.sk',
      name: 'Mária Horáček',
      passwordHash,
      role: Role.PARENT,
      avatar: 'https://i.pravatar.cc/150?u=parent2',
    },
  });

  // STUDENT user – future portal account (not yet active)
  const studentUser = await prisma.user.create({
    data: {
      email: 'student@talkin.sk',
      name: 'Leo Odyssey',
      passwordHash,
      role: Role.STUDENT,
      avatar: 'https://i.pravatar.cc/150?u=student',
    },
  });

  // --- 3. Create Schools ---
  console.log('🏫 Creating schools...');

  const school1 = await prisma.school.create({
    data: {
      name: 'Talkin Academy Center',
      address: 'Obchodná 5, Bratislava, Slovakia',
      ownerId: owner.id,
    },
  });

  const school2 = await prisma.school.create({
    data: {
      name: 'BIS Bratislava International School',
      address: 'Karlovská 12, Bratislava, Slovakia',
      ownerId: owner.id,
    },
  });

  // --- 4. Create Classes ---
  console.log('📚 Creating classes...');

  const class1A = await prisma.class.create({
    data: {
      name: '1st Grade — Alpha',
      schoolId: school1.id,
      coordinatorId: coordinator.id,
      supervisorId: supervisor.id,
    },
  });

  const class2B = await prisma.class.create({
    data: {
      name: '2nd Grade — Beta',
      schoolId: school1.id,
      coordinatorId: coordinator.id,
      supervisorId: supervisor.id,
    },
  });

  const class3A_BIS = await prisma.class.create({
    data: {
      name: '3rd Grade — BIS Alpha',
      schoolId: school2.id,
      coordinatorId: coordinator.id,
    },
  });

  // --- 5. Create Students (8 students) ---
  console.log('🎒 Creating students...');

  const student1 = await prisma.student.create({
    data: {
      firstName: 'Leo',
      lastName: 'Odyssey',
      classId: class1A.id,
      parentId: parent.id,
      userId: studentUser.id, // Future portal link
    },
  });

  await prisma.student.createMany({
    data: [
      { firstName: 'Anna',   lastName: 'Horáček',  classId: class1A.id, parentId: parent2.id },
      { firstName: 'Matej',  lastName: 'Blaho',    classId: class1A.id },
      { firstName: 'Sara',   lastName: 'Fišerová', classId: class2B.id, parentId: parent.id },
      { firstName: 'Tomáš',  lastName: 'Gál',      classId: class2B.id },
      { firstName: 'Nina',   lastName: 'Pálffy',   classId: class2B.id, parentId: parent2.id },
      { firstName: 'Jakub',  lastName: 'Varga',    classId: class3A_BIS.id },
      { firstName: 'Elena',  lastName: 'Mináč',    classId: class3A_BIS.id },
    ],
  });

  // --- 6. Create Subjects ---
  console.log('📖 Creating subjects...');

  const subjectNames = [
    'English',
    'Mathematics',
    'Science',
    'Art & Creativity',
    'Physical Education',
    'Music',
  ];
  const subjects = await Promise.all(
    subjectNames.map((name) => prisma.subject.create({ data: { name } }))
  );

  const english  = subjects.find(s => s.name === 'English')!;
  const math     = subjects.find(s => s.name === 'Mathematics')!;
  const science  = subjects.find(s => s.name === 'Science')!;

  // --- 7. Create Courses (multi-subject, multi-class) ---
  console.log('🗂️ Creating courses...');

  const englishCourse1A = await prisma.course.create({
    data: {
      title: 'English Foundations — Grade 1 Alpha',
      classId: class1A.id,
      subjectId: english.id,
      targetLessons: 12,
    },
  });

  const mathCourse1A = await prisma.course.create({
    data: {
      title: 'Mathematics Foundations — Grade 1 Alpha',
      classId: class1A.id,
      subjectId: math.id,
      targetLessons: 12,
    },
  });

  const englishCourse2B = await prisma.course.create({
    data: {
      title: 'English Intermediate — Grade 2 Beta',
      classId: class2B.id,
      subjectId: english.id,
      targetLessons: 12,
    },
  });

  const scienceCourse3A = await prisma.course.create({
    data: {
      title: 'Science Discovery — Grade 3 BIS Alpha',
      classId: class3A_BIS.id,
      subjectId: science.id,
      targetLessons: 12,
    },
  });

  // --- 8. Create Lessons (38/year for main English course) ---
  console.log('📅 Creating 38 lessons for English 1A...');

  const lessonTitles = [
    'Alphabet & Sounds', 'Basic Greetings', 'Colors & Shapes', 'Numbers 1–10',
    'Animals & Pets', 'My Family', 'Food & Drinks', 'Seasons & Weather',
    'Body Parts', 'In the Classroom', 'Clothing', 'Conversational Foundations', // ← lesson 12: milestone
    'Transport', 'The City', 'Daily Routines', 'Time & Calendar',
    'Sports & Hobbies', 'Nature & Environment', 'At the Doctor', 'Shopping',
    'Storytelling: Part 1', 'Storytelling: Part 2', 'Music & Art', 'Special Days',
    'Reading Comprehension 1', 'Reading Comprehension 2', 'Writing Workshop',
    'Debate & Discussion', 'Grammar Review', 'Advanced Conversation',
    'Presentation Skills', 'Creative Writing', 'Cultural Awareness',
    'Project Showcase', 'Revision Week 1', 'Revision Week 2', 'Final Assessment', 'Year-End Celebration',
  ];

  for (let i = 0; i < 38; i++) {
    const lessonDate = new Date();
    lessonDate.setDate(lessonDate.getDate() + (i * 7));

    let status: LessonStatus = LessonStatus.SCHEDULED;
    if (i < 4) status = LessonStatus.COMPLETED;
    if (i === 10) status = LessonStatus.CANCELLED;

    const lesson = await prisma.lesson.create({
      data: {
        title: `L${i + 1}: ${lessonTitles[i] ?? 'Advanced Topics'}`,
        date: lessonDate,
        courseId: englishCourse1A.id,
        lectorId: i % 3 === 0 ? lector2.id : lector.id,
        status,
      },
    });

    // Add curriculum + materials for first 12 lessons
    if (i < 12) {
      await prisma.curriculum.create({
        data: {
          lessonId: lesson.id,
          content: `# ${lessonTitles[i]}\n\nLesson ${i + 1} focuses on building core vocabulary and conversational skills. Students engage in group activities, role-play, and worksheet exercises.\n\n## Session Flow\n1. Warmup (10min)\n2. Vocabulary Introduction (20min)\n3. Practice Activity (30min)\n4. Group Discussion (15min)\n5. Homework Briefing (5min)`,
          goals: `• Understand and use ${Math.max(8, 10 + i)} new vocabulary words\n• Participate confidently in guided conversation\n• Complete worksheet independently`,
          published: i < 4,
          materials: {
            create: [
              { title: `Worksheet Unit ${i + 1}`, url: `https://storage.talkin.sk/ws/unit${i + 1}.pdf`, type: 'PDF' },
              { title: `Video Masterclass ${i + 1}`, url: `https://storage.talkin.sk/vid/v${i + 1}.mp4`, type: 'VIDEO' },
              ...(i % 2 === 0 ? [{ title: `Slide Deck ${i + 1}`, url: `https://storage.talkin.sk/slides/s${i + 1}.pptx`, type: 'SLIDES' }] : []),
            ],
          },
        },
      });
    }
  }

  // --- 9. Knowledge Library (Grades 1–9, all subjects) ---
  console.log('📚 Seeding Knowledge Library...');

  const libraryTopics: Record<string, string[]> = {
    'English':      ['Alphabet & Phonics', 'Basic Sentences', 'Simple Stories', 'Paragraph Writing', 'Storytelling', 'Essay Basics', 'Literary Analysis', 'Advanced Grammar', 'Creative Expression'],
    'Mathematics':  ['Counting & Numbers', 'Addition & Subtraction', 'Multiplication', 'Fractions', 'Geometry', 'Ratios & Proportions', 'Algebra Intro', 'Advanced Algebra', 'Statistics & Probability'],
    'Science':      ['Living Things', 'Matter & Materials', 'Forces & Motion', 'Plants & Animals', 'Ecosystems', 'Chemical Reactions', 'Energy & Physics', 'Earth & Climate', 'Scientific Method'],
    'Art & Creativity': ['Drawing Basics', 'Color Theory', 'Collage', 'Sculpture', 'Painting', 'Design Thinking', 'Graphic Art', 'Portfolio Building', 'Artistic Expression'],
    'Physical Education': ['Basic Movement', 'Teamwork Games', 'Ball Sports', 'Athletics', 'Swimming Intro', 'Fitness Training', 'Advanced Sports', 'Coaching Basics', 'Sports Leadership'],
    'Music':        ['Rhythm & Beat', 'Simple Melodies', 'Singing Basics', 'Instruments Overview', 'Music Theory', 'Composition', 'Ensemble Playing', 'Music History', 'Performance Skills'],
  };

  for (const subject of subjects) {
    const topics = libraryTopics[subject.name] ?? [];
    for (let grade = 1; grade <= 9; grade++) {
      const topicIndex = grade - 1;
      await prisma.libraryContent.create({
        data: {
          title: `Grade ${grade}: ${topics[topicIndex] ?? `Advanced ${subject.name} ${grade}`}`,
          content: `Standardized educational content for Grade ${grade} — ${subject.name}.\n\nThis unit covers core competencies aligned with the Slovak national curriculum framework. Topics include structured practice, collaborative activities, and formative assessment strategies.`,
          grade,
          subjectId: subject.id,
          authorId: owner.id,
        },
      });
    }
  }

  console.log('✅ Talkin CRM v2 — Seed Complete!');
  console.log('');
  console.log('📋 Seeded Users:');
  console.log('  owner@talkin.sk       → OWNER');
  console.log('  coordinator@talkin.sk → COORDINATOR');
  console.log('  supervisor@talkin.sk  → SUPERVISOR');
  console.log('  lector@talkin.sk      → LECTOR');
  console.log('  lector2@talkin.sk     → LECTOR');
  console.log('  parent@talkin.sk      → PARENT');
  console.log('  parent2@talkin.sk     → PARENT');
  console.log('  student@talkin.sk     → STUDENT (future portal)');
  console.log('  Password for all: admin');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
