import { PrismaClient, Role, LessonStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';
import pg from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import * as dotenv from 'dotenv';

dotenv.config();

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL as string });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const passwordHash = await bcrypt.hash('admin', 10);

  // 1. CLEAR PREVIOUS DATA
  console.log('🗑️ Clearing institutional ledger...');
  await prisma.engagementUpdate.deleteMany();
  await prisma.message.deleteMany();
  await prisma.conversation.deleteMany();
  await prisma.libraryContent.deleteMany();
  await prisma.material.deleteMany();
  await prisma.curriculum.deleteMany();
  await prisma.lesson.deleteMany();
  await prisma.course.deleteMany();
  await prisma.subject.deleteMany();
  await prisma.student.deleteMany();
  await prisma.class.deleteMany();
  await prisma.school.deleteMany();
  await prisma.user.deleteMany();

  // 2. CREATE INSTITUTIONAL USERS (8 CURATORS)
  console.log('👤 Creating specialized curators...');
  const owner = await prisma.user.create({
    data: { email: 'owner@talkin.sk', name: 'Viktor Novák', role: Role.OWNER, passwordHash }
  });

  const coordinator = await prisma.user.create({
    data: { email: 'coordinator@talkin.sk', name: 'Jana Kováčová', role: Role.COORDINATOR, passwordHash }
  });

  const supervisor1 = await prisma.user.create({
    data: { email: 'supervisor1@talkin.sk', name: 'Marek Šimko', role: Role.SUPERVISOR, passwordHash }
  });
  const supervisor2 = await prisma.user.create({
    data: { email: 'supervisor2@talkin.sk', name: 'Sofia Hrubá', role: Role.SUPERVISOR, passwordHash }
  });

  const lectors = await Promise.all([
    prisma.user.create({ data: { email: 'lector1@talkin.sk', name: 'Viktor Lector', role: Role.LECTOR, passwordHash } }),
    prisma.user.create({ data: { email: 'lector2@talkin.sk', name: 'Lucia K.', role: Role.LECTOR, passwordHash } }),
    prisma.user.create({ data: { email: 'lector3@talkin.sk', name: 'Peter M.', role: Role.LECTOR, passwordHash } }),
    prisma.user.create({ data: { email: 'lector4@talkin.sk', name: 'Elena R.', role: Role.LECTOR, passwordHash } }),
  ]);

  // 3. CREATE SUBJECTS
  console.log('📚 Creating institutional subjects...');
  const subjects = await Promise.all([
    prisma.subject.create({ data: { name: 'English' } }),
    prisma.subject.create({ data: { name: 'Conversation' } }),
    prisma.subject.create({ data: { name: 'Grammar' } }),
    prisma.subject.create({ data: { name: 'Business B2' } }),
    prisma.subject.create({ data: { name: 'Creative Arts' } }),
    prisma.subject.create({ data: { name: 'Digital Fluency' } }),
  ]);

  // 4. CREATE SCHOOLS (8 HUBS)
  console.log('🏛️ Architecting 8 hubs...');
  const hubNames = [
    'Bratislava Center Hub', 'BIS International Hub', 'Dúbravka Campus', 
    'Aupark Hub', 'Eurovea Digital Node', 'Ružinov Hub', 'Nivy Center', 'Petržalka South'
  ];
  const schools = await Promise.all(hubNames.map(name => 
    prisma.school.create({ data: { name, address: name, ownerId: owner.id } })
  ));

  // 5. CREATE CLASSES (12 CLASSES ACROSS HUBS)
  console.log('🏫 Initializing 12 classes...');
  const classesData = [
    { name: '1st Grade — Alpha', hub: 0 }, { name: '1st Grade — Beta', hub: 0 },
    { name: '2nd Grade — Gamma', hub: 1 }, { name: '3rd Grade — Delta', hub: 2 },
    { name: '4th Grade — Epsilon', hub: 3 }, { name: '4th Grade — Zeta', hub: 4 },
    { name: '5th Grade — Theta', hub: 5 }, { name: '6th Grade — Iota', hub: 6 },
    { name: '7th Grade — Kappa', hub: 7 }, { name: '8th Grade — Lambda', hub: 0 },
    { name: '9th Grade — Sigma', hub: 1 }, { name: 'Business Elite — Rho', hub: 2 }
  ];

  const classes = await Promise.all(classesData.map((c, i) => 
    prisma.class.create({ 
      data: { 
        name: c.name, 
        schoolId: schools[c.hub].id,
        supervisorId: i % 2 === 0 ? supervisor1.id : supervisor2.id,
        coordinatorId: coordinator.id
      } 
    })
  ));

  // 6. CREATE COURSES & LESSONS
  console.log('📅 Synchronizing temporal ledger (Lessons)...');
  for (const cls of classes) {
    const mainSubject = subjects[Math.floor(Math.random() * subjects.length)];
    const course = await prisma.course.create({
      data: {
        title: `${cls.name} ${mainSubject.name}`,
        classId: cls.id,
        subjectId: mainSubject.id,
        targetLessons: 12
      }
    });

    // Create 5 lessons per course
    for (let i = 1; i <= 5; i++) {
        const lesson = await prisma.lesson.create({
          data: {
            title: `Lesson ${i}: ${mainSubject.name} Mastery`,
            date: new Date(Date.now() + i * 86400000), // Next 5 days
            courseId: course.id,
            lectorId: lectors[i % 4].id,
            status: i === 1 ? LessonStatus.COMPLETED : LessonStatus.SCHEDULED
          }
        });

        // Add Curriculum for completed lessons
        if (i === 1) {
            await prisma.curriculum.create({
                data: {
                    lessonId: lesson.id,
                    content: 'Institutional excellence requires a clear focus on the Grammar Matrix and Oral Mastery.',
                    goals: 'Master the B2 journalism syntax and conversational flow.',
                    published: true,
                    materials: {
                        create: [
                            { title: 'The Grammar Matrix PDF', url: '#', type: 'WORKSHEET' },
                            { title: 'Oral Mastery Audio', url: '#', type: 'AUDIO' }
                        ]
                    }
                }
            });
        }
    }
  }

  // 7. CREATE LIBRARY CONTENT (GRADES 1-9)
  console.log('📑 Archiving 1-9 Knowledge Library...');
  for (let grade = 1; grade <= 9; grade++) {
    for (const sub of subjects) {
        await prisma.libraryContent.create({
            data: {
                title: `${grade}th Grade ${sub.name}: The Core Document`,
                content: `Advanced curriculum node for ${sub.name} at Grade ${grade} level.`,
                grade: grade,
                subjectId: sub.id,
                authorId: coordinator.id
            }
        });
    }
  }

  // 8. ADD SOME ENGAGEMENT UPDATES (PULSES)
  console.log('💓 Generating Institutional Pulses...');
  await prisma.engagementUpdate.createMany({
    data: [
      { type: 'INSIGHT', content: 'Completed Session 12 with group #SIGMA. 94% Mastery.', tag: 'Positive', variant: 'secondary', authorId: lectors[0].id },
      { type: 'PULSE', content: 'Flagging potential bottleneck in Dúbravka Hub room allocation.', tag: 'Action Required', variant: 'primary', authorId: supervisor1.id },
      { type: 'INSIGHT', content: 'Grade 1 Alpha attendance is at institutional record high.', tag: 'Growth', variant: 'dark', authorId: coordinator.id }
    ]
  });

  console.log('✅ Institutional Ledger synchronized. 12 classes across 8 hubs activated.');
}

main()
  .catch((e) => {
    console.error('❌ Institutional Seed failure:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
