const prisma = require('../lib/prisma');

const getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, name: true, email: true, role: true, studentId: true, createdAt: true },
    });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const enrollStudent = async (req, res) => {
  try {
    const { studentId, courseId } = req.body;
    const enrollment = await prisma.enrollment.create({
      data: { studentId, courseId },
    });
    res.status(201).json(enrollment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    await prisma.user.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getAllUsers, enrollStudent, deleteUser };
