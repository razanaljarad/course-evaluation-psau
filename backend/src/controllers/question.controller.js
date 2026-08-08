const prisma = require('../lib/prisma');

const getAllQuestions = async (req, res) => {
  try {
    const questions = await prisma.question.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
    });
    res.json(questions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const createQuestion = async (req, res) => {
  try {
    const { text, category, order } = req.body;
    const question = await prisma.question.create({
      data: { text, category, order },
    });
    res.status(201).json(question);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateQuestion = async (req, res) => {
  try {
    const { text, category, order, isActive } = req.body;
    const question = await prisma.question.update({
      where: { id: parseInt(req.params.id) },
      data: { text, category, order, isActive },
    });
    res.json(question);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteQuestion = async (req, res) => {
  try {
    await prisma.question.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ message: 'Question deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getAllQuestions, createQuestion, updateQuestion, deleteQuestion };
