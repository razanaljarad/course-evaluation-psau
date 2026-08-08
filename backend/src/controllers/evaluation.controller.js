const prisma = require('../lib/prisma');

const submitEvaluation = async (req, res) => {
  try {
    const { courseId, semesterId, answers, comment } = req.body;
    const studentId = req.user.id;

    // Check if already evaluated
    const existing = await prisma.evaluation.findUnique({
      where: { studentId_courseId: { studentId, courseId } },
    });
    if (existing) return res.status(400).json({ message: 'You have already evaluated this course' });

    // Check enrollment
    const enrollment = await prisma.enrollment.findUnique({
      where: { studentId_courseId: { studentId, courseId } },
    });
    if (!enrollment) return res.status(403).json({ message: 'You are not enrolled in this course' });

    const evaluation = await prisma.evaluation.create({
      data: {
        studentId,
        courseId,
        semesterId,
        comment: comment || null,
        answers: {
          create: answers.map(a => ({
            questionId: a.questionId,
            rating: a.rating,
          })),
        },
      },
      include: { answers: true },
    });

    res.status(201).json({ message: 'Evaluation submitted successfully', evaluation });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getMyEvaluations = async (req, res) => {
  try {
    const evaluations = await prisma.evaluation.findMany({
      where: { studentId: req.user.id },
      include: { course: true, answers: { include: { question: true } } },
    });
    res.json(evaluations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getCourseEvaluations = async (req, res) => {
  try {
    const courseId = parseInt(req.params.courseId);
    const evaluations = await prisma.evaluation.findMany({
      where: { courseId },
      include: { answers: { include: { question: true } } },
    });

    // Aggregate ratings per question (anonymous)
    const questionStats = {};
    evaluations.forEach(ev => {
      ev.answers.forEach(ans => {
        if (!questionStats[ans.questionId]) {
          questionStats[ans.questionId] = {
            questionId: ans.questionId,
            questionText: ans.question.text,
            category: ans.question.category,
            total: 0,
            count: 0,
          };
        }
        questionStats[ans.questionId].total += ans.rating;
        questionStats[ans.questionId].count += 1;
      });
    });

    const stats = Object.values(questionStats).map(q => ({
      ...q,
      average: (q.total / q.count).toFixed(2),
    }));

    res.json({ courseId, totalEvaluations: evaluations.length, stats });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { submitEvaluation, getMyEvaluations, getCourseEvaluations };
