const prisma = require('../lib/prisma');

const getLeaderboard = async (req, res) => {
  try {
    const leaderboard = await prisma.evaluation.groupBy({
      by: ['studentId'],
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
      take: 10,
    });

    const studentIds = leaderboard.map(l => l.studentId);
    const students = await prisma.user.findMany({
      where: { id: { in: studentIds } },
      select: { id: true, name: true, studentId: true },
    });

    const result = leaderboard.map((l, index) => {
      const student = students.find(s => s.id === l.studentId);
      return {
        rank: index + 1,
        studentId: l.studentId,
        name: student?.name || 'غير معروف',
        universityId: student?.studentId,
        evaluationCount: l._count.id,
      };
    });

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getDashboardStats = async (req, res) => {
  try {
    const totalStudents = await prisma.user.count({ where: { role: 'STUDENT' } });
    const totalCourses = await prisma.course.count();
    const totalEvaluations = await prisma.evaluation.count();
    const activeSemester = await prisma.semester.findFirst({ where: { isActive: true } });

    // Evaluations per course
    const evaluationsPerCourse = await prisma.evaluation.groupBy({
      by: ['courseId'],
      _count: { id: true },
    });

    // Average rating per course
    const courseRatings = await prisma.answer.groupBy({
      by: ['evaluationId'],
      _avg: { rating: true },
    });

    // Evaluations per semester
    const evalsBySemester = await prisma.evaluation.groupBy({
      by: ['semesterId'],
      _count: { id: true },
    });

    // Category averages
    const categoryAverages = await prisma.answer.findMany({
      include: { question: { select: { category: true } } },
    });

    const categoryStats = {};
    categoryAverages.forEach(a => {
      const cat = a.question.category;
      if (!categoryStats[cat]) categoryStats[cat] = { total: 0, count: 0 };
      categoryStats[cat].total += a.rating;
      categoryStats[cat].count += 1;
    });

    const categoryResult = Object.entries(categoryStats).map(([cat, val]) => ({
      category: cat,
      average: (val.total / val.count).toFixed(2),
    }));

    res.json({
      totalStudents,
      totalCourses,
      totalEvaluations,
      activeSemester,
      evaluationsPerCourse,
      categoryAverages: categoryResult,
      evalsBySemester,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getCourseAnalytics = async (req, res) => {
  try {
    const courses = await prisma.course.findMany({
      include: {
        evaluations: {
          include: { answers: true },
        },
        semester: true,
      },
    });

    const result = courses.map(course => {
      const totalEvals = course.evaluations.length;
      let totalRating = 0;
      let ratingCount = 0;
      course.evaluations.forEach(ev => {
        ev.answers.forEach(ans => {
          totalRating += ans.rating;
          ratingCount++;
        });
      });
      return {
        courseId: course.id,
        courseCode: course.code,
        courseName: course.name,
        semester: course.semester.name,
        totalEvaluations: totalEvals,
        averageRating: ratingCount > 0 ? (totalRating / ratingCount).toFixed(2) : null,
      };
    });

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getDashboardStats, getCourseAnalytics, getLeaderboard };
