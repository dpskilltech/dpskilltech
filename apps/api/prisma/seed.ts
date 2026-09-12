import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding DP Skilltech PostgreSQL Database...');

  const defaultPasswordHash = bcrypt.hashSync('password123', 10);

  // 1. Seed Instructor / Teacher
  const teacherUser = await prisma.user.upsert({
    where: { email: 'instructor@dpskilltech.in' },
    update: {},
    create: {
      id: 'usr_teacher_01',
      email: 'instructor@dpskilltech.in',
      passwordHash: defaultPasswordHash,
      role: Role.TEACHER,
      fullName: 'Dr. Rajesh Verma',
      phone: '+91 98765 11223',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      bio: 'Principal Software Architect & Lead Instructor for Python + AI tracks with 12+ years industry experience.',
      isActive: true,
      teacherProfile: {
        create: {
          id: 'prof_teacher_01',
          specialization: 'Python, Distributed Systems & Deep Learning',
          totalStudentsMentored: 75,
          rating: 4.9,
          mockInterviewSlotsAvailable: 4
        }
      }
    },
    include: { teacherProfile: true }
  });

  console.log(`✓ Teacher seeded: ${teacherUser.email} (ID: ${teacherUser.id})`);

  // 2. Seed Platform Batches (15-student cap rule)
  const batchPy = await prisma.batch.upsert({
    where: { name: 'Batch PY-2026-01 (Max 15 Students)' },
    update: {},
    create: {
      id: 'batch_py_2026_01',
      name: 'Batch PY-2026-01 (Max 15 Students)',
      courseId: 'full-stack-python-ai',
      courseName: 'Full Stack Python + AI Architecture',
      trainerId: teacherUser.teacherProfile?.id,
      maxCapacity: 15,
      studentCount: 14,
      status: 'ACTIVE',
      schedule: 'Mon - Sat | 07:00 PM IST',
      nextTopic: 'Async I/O & FastAPI Concurrency Patterns'
    }
  });

  await prisma.batch.upsert({
    where: { name: 'Batch DS-2026-01 (Max 15 Students)' },
    update: {},
    create: {
      id: 'batch_ds_2026_01',
      name: 'Batch DS-2026-01 (Max 15 Students)',
      courseId: 'data-science-machine-learning',
      courseName: 'Data Science & Machine Learning',
      trainerId: teacherUser.teacherProfile?.id,
      maxCapacity: 15,
      studentCount: 12,
      status: 'ACTIVE',
      schedule: 'Mon - Sat | 08:30 PM IST',
      nextTopic: 'PyTorch Neural Network Tuning'
    }
  });

  await prisma.batch.upsert({
    where: { name: 'Batch JV-2026-01 (Capped, Max 15)' },
    update: {},
    create: {
      id: 'batch_jv_2026_01',
      name: 'Batch JV-2026-01 (Capped, Max 15)',
      courseId: 'full-stack-java-ai',
      courseName: 'Full Stack Java + Spring AI',
      maxCapacity: 15,
      studentCount: 15,
      status: 'FULL (Capped)',
      schedule: 'Mon - Sat | 06:00 PM IST',
      nextTopic: 'Spring Boot 3 Reactive Microservices'
    }
  });

  console.log(`✓ Batches initialized with strict 15-student cap`);

  // 3. Seed Student
  const studentUser = await prisma.user.upsert({
    where: { email: 'student@dpskilltech.in' },
    update: {},
    create: {
      id: 'usr_student_01',
      email: 'student@dpskilltech.in',
      passwordHash: defaultPasswordHash,
      role: Role.STUDENT,
      fullName: 'Aarav Sharma',
      phone: '+91 98765 43210',
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
      bio: 'Aspiring Full-Stack & AI Engineer. Currently learning Python, FastAPI, and Transformers.',
      isActive: true,
      studentProfile: {
        create: {
          id: 'prof_student_01',
          batchId: batchPy.id,
          enrolledCourseId: 'full-stack-python-ai',
          enrolledCourseName: 'Full Stack Python + AI Architecture',
          attendanceRate: 94,
          completedLessons: 24,
          totalLessons: 48,
          submittedAssignments: 7,
          totalAssignments: 8,
          mockInterviewCredits: 2,
          mockInterviewsCompleted: 1
        }
      }
    }
  });

  console.log(`✓ Student seeded: ${studentUser.email} (ID: ${studentUser.id})`);

  // 4. Seed Platform Administrator
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@dpskilltech.in' },
    update: {},
    create: {
      id: 'usr_admin_01',
      email: 'admin@dpskilltech.in',
      passwordHash: defaultPasswordHash,
      role: Role.ADMIN,
      fullName: 'Siddharth Patel',
      phone: '+91 98765 99887',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      bio: 'Academic Operations & Platform Director at DP Skilltech.',
      isActive: true,
      adminProfile: {
        create: {
          id: 'prof_admin_01',
          department: 'Academic Operations & Engineering Leadership',
          accessLevel: 'SUPERADMIN'
        }
      }
    }
  });

  console.log(`✓ Admin seeded: ${adminUser.email} (ID: ${adminUser.id})`);
}

main()
  .catch((e) => {
    console.error('Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
