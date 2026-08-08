const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const bcrypt = require('bcryptjs');

const adapter = new PrismaPg({ connectionString: 'postgresql://postgres:10203040@localhost:5432/course_evaluation_db' });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Seeding database...');

  // Create Admin
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@university.edu' },
    update: {},
    create: {
      name: 'System Admin',
      email: 'admin@university.edu',
      password: adminPassword,
      role: 'ADMIN',
    },
  });

  // Create Instructor
  const instructorPassword = await bcrypt.hash('instructor123', 10);
  const instructor = await prisma.user.upsert({
    where: { email: 'instructor@university.edu' },
    update: {},
    create: {
      name: 'Dr. Ahmed Al-Farsi',
      email: 'instructor@university.edu',
      password: instructorPassword,
      role: 'INSTRUCTOR',
    },
  });

  // Create Students
  const studentPassword = await bcrypt.hash('student123', 10);
  const student1 = await prisma.user.upsert({
    where: { email: 'student1@university.edu' },
    update: {},
    create: {
      name: 'Mohammed Ali',
      email: 'student1@university.edu',
      password: studentPassword,
      role: 'STUDENT',
      studentId: 'S20210001',
    },
  });

  const student2 = await prisma.user.upsert({
    where: { email: 'student2@university.edu' },
    update: {},
    create: {
      name: 'Sara Hassan',
      email: 'student2@university.edu',
      password: studentPassword,
      role: 'STUDENT',
      studentId: 'S20210002',
    },
  });

  // Create Semester
  const semester = await prisma.semester.upsert({
    where: { name: 'الفصل الأول 2024-2025' },
    update: {},
    create: {
      name: 'الفصل الأول 2024-2025',
      year: 2024,
      term: 'الأول',
      isActive: true,
    },
  });

  // Create Courses
  const course1 = await prisma.course.upsert({
    where: { code_semesterId: { code: 'CS101', semesterId: semester.id } },
    update: {},
    create: {
      code: 'CS101',
      name: 'مقدمة في علوم الحاسب',
      description: 'مقرر تمهيدي في أساسيات علوم الحاسب',
      instructorId: instructor.id,
      semesterId: semester.id,
    },
  });

  const course2 = await prisma.course.upsert({
    where: { code_semesterId: { code: 'CS201', semesterId: semester.id } },
    update: {},
    create: {
      code: 'CS201',
      name: 'هياكل البيانات',
      description: 'دراسة هياكل البيانات الأساسية والخوارزميات',
      instructorId: instructor.id,
      semesterId: semester.id,
    },
  });

  const course3 = await prisma.course.upsert({
    where: { code_semesterId: { code: 'MATH101', semesterId: semester.id } },
    update: {},
    create: {
      code: 'MATH101',
      name: 'رياضيات متقطعة',
      description: 'مقرر في الرياضيات المتقطعة لطلاب الحاسب',
      instructorId: instructor.id,
      semesterId: semester.id,
    },
  });

  // Enroll students
  await prisma.enrollment.upsert({
    where: { studentId_courseId: { studentId: student1.id, courseId: course1.id } },
    update: {},
    create: { studentId: student1.id, courseId: course1.id },
  });

  await prisma.enrollment.upsert({
    where: { studentId_courseId: { studentId: student1.id, courseId: course2.id } },
    update: {},
    create: { studentId: student1.id, courseId: course2.id },
  });

  await prisma.enrollment.upsert({
    where: { studentId_courseId: { studentId: student2.id, courseId: course1.id } },
    update: {},
    create: { studentId: student2.id, courseId: course1.id },
  });

  await prisma.enrollment.upsert({
    where: { studentId_courseId: { studentId: student2.id, courseId: course3.id } },
    update: {},
    create: { studentId: student2.id, courseId: course3.id },
  });

  // Create Questions
  const questions = [
    { text: 'مدى وضوح المحتوى العلمي للمقرر', category: 'المحتوى', order: 1 },
    { text: 'مدى ارتباط المقرر بالتخصص', category: 'المحتوى', order: 2 },
    { text: 'مدى توافر المراجع والمصادر التعليمية', category: 'المحتوى', order: 3 },
    { text: 'مدى وضوح طريقة التدريس', category: 'التدريس', order: 4 },
    { text: 'مدى تفاعل المدرس مع الطلاب', category: 'التدريس', order: 5 },
    { text: 'مدى الالتزام بالجدول الزمني للمقرر', category: 'التدريس', order: 6 },
    { text: 'مدى عدالة نظام التقييم والاختبارات', category: 'التقييم', order: 7 },
    { text: 'مدى وضوح معايير التقييم', category: 'التقييم', order: 8 },
    { text: 'مدى ملاءمة عبء العمل للمقرر', category: 'التقييم', order: 9 },
    { text: 'التقييم العام للمقرر', category: 'عام', order: 10 },
  ];

  for (const q of questions) {
    await prisma.question.upsert({
      where: { id: q.order },
      update: {},
      create: q,
    });
  }

  console.log('✅ Database seeded successfully!');
  console.log('\n📋 Test Accounts:');
  console.log('Admin:      admin@university.edu      / admin123');
  console.log('Instructor: instructor@university.edu / instructor123');
  console.log('Student 1:  student1@university.edu   / student123');
  console.log('Student 2:  student2@university.edu   / student123');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
