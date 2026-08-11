const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const bcrypt = require('bcryptjs');

const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:10203040@localhost:5432/course_evaluation_db';
const adapter = new PrismaPg({ connectionString, ssl: connectionString.includes('render.com') ? { rejectUnauthorized: false } : false });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Starting seed...');

  // Semesters
  const sem1 = await prisma.semester.upsert({
    where: { name: 'الفصل الأول 2024-2025' },
    update: {},
    create: { name: 'الفصل الأول 2024-2025', year: 2024, term: 'الأول', isActive: true },
  });
  const sem2 = await prisma.semester.upsert({
    where: { name: 'الفصل الثاني 2023-2024' },
    update: {},
    create: { name: 'الفصل الثاني 2023-2024', year: 2023, term: 'الثاني', isActive: false },
  });

  // Users
  const adminPass = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@university.edu' },
    update: {},
    create: { name: 'مسؤول النظام', email: 'admin@university.edu', password: adminPass, role: 'ADMIN' },
  });

  const student1Pass = await bcrypt.hash('student123', 10);
  const student1 = await prisma.user.upsert({
    where: { email: 'student1@university.edu' },
    update: {},
    create: { name: 'محمد علي السالم', email: 'student1@university.edu', password: student1Pass, role: 'STUDENT', studentId: 'S20210001' },
  });

  const student2Pass = await bcrypt.hash('student123', 10);
  const student2 = await prisma.user.upsert({
    where: { email: 'student2@university.edu' },
    update: {},
    create: { name: 'سارة أحمد العتيبي', email: 'student2@university.edu', password: student2Pass, role: 'STUDENT', studentId: 'S20210002' },
  });

  // Courses
  const course1 = await prisma.course.upsert({
    where: { code_semesterId: { code: 'CS101', semesterId: sem1.id } },
    update: {},
    create: { code: 'CS101', name: 'مقدمة في علوم الحاسب', description: 'أساسيات البرمجة وعلوم الحاسب', instructorId: admin.id, semesterId: sem1.id },
  });
  const course2 = await prisma.course.upsert({
    where: { code_semesterId: { code: 'MATH201', semesterId: sem1.id } },
    update: {},
    create: { code: 'MATH201', name: 'التفاضل والتكامل', description: 'الرياضيات المتقدمة', instructorId: admin.id, semesterId: sem1.id },
  });
  const course3 = await prisma.course.upsert({
    where: { code_semesterId: { code: 'ENG101', semesterId: sem1.id } },
    update: {},
    create: { code: 'ENG101', name: 'اللغة الإنجليزية', description: 'مهارات اللغة الإنجليزية', instructorId: admin.id, semesterId: sem1.id },
  });

  // Questions
  const questions = [
    { text: 'مدى وضوح شرح الدكتور للمادة', category: 'التدريس', order: 1 },
    { text: 'مدى التزام الدكتور بالدوام والحضور', category: 'التدريس', order: 2 },
    { text: 'مدى توفر الدكتور للرد على الاستفسارات', category: 'التدريس', order: 3 },
    { text: 'مدى ملاءمة المحتوى للأهداف التعليمية', category: 'المحتوى', order: 4 },
    { text: 'مدى حداثة المواد والمراجع المستخدمة', category: 'المحتوى', order: 5 },
    { text: 'مدى عدالة التقييم والاختبارات', category: 'التقييم', order: 6 },
    { text: 'مدى تنوع أساليب التقييم', category: 'التقييم', order: 7 },
    { text: 'مدى توفر بيئة تعليمية مناسبة', category: 'البيئة التعليمية', order: 8 },
    { text: 'مدى استفادتك الشاملة من المقرر', category: 'التقييم العام', order: 9 },
    { text: 'مدى توصيتك بهذا المقرر لزملائك', category: 'التقييم العام', order: 10 },
  ];

  for (const q of questions) {
    await prisma.question.upsert({
      where: { id: q.order },
      update: {},
      create: q,
    });
  }

  // Enrollments
  for (const courseId of [course1.id, course2.id, course3.id]) {
    await prisma.enrollment.upsert({
      where: { studentId_courseId: { studentId: student1.id, courseId } },
      update: {},
      create: { studentId: student1.id, courseId },
    });
    await prisma.enrollment.upsert({
      where: { studentId_courseId: { studentId: student2.id, courseId } },
      update: {},
      create: { studentId: student2.id, courseId },
    });
  }

  console.log('✅ Seed completed successfully!');
  console.log('👤 Admin: admin@university.edu / admin123');
  console.log('👤 Student1: student1@university.edu / student123');
  console.log('👤 Student2: student2@university.edu / student123');
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
