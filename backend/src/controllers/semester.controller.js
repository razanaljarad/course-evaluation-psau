const prisma = require('../lib/prisma');

const getAllSemesters = async (req, res) => {
  try {
    const semesters = await prisma.semester.findMany({ orderBy: { year: 'desc' } });
    res.json(semesters);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getActiveSemester = async (req, res) => {
  try {
    const semester = await prisma.semester.findFirst({ where: { isActive: true } });
    res.json(semester);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const createSemester = async (req, res) => {
  try {
    const { name, year, term, isActive } = req.body;
    if (isActive) {
      await prisma.semester.updateMany({ data: { isActive: false } });
    }
    const semester = await prisma.semester.create({
      data: { name, year, term, isActive: isActive || false },
    });
    res.status(201).json(semester);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateSemester = async (req, res) => {
  try {
    const { name, year, term, isActive } = req.body;
    if (isActive) {
      await prisma.semester.updateMany({ data: { isActive: false } });
    }
    const semester = await prisma.semester.update({
      where: { id: parseInt(req.params.id) },
      data: { name, year, term, isActive },
    });
    res.json(semester);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getAllSemesters, getActiveSemester, createSemester, updateSemester };
