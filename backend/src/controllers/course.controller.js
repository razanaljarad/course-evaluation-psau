const prisma = require('../lib/prisma');

const getAllCourses = async (req, res) => {
  try {
    const courses = await prisma.course.findMany({
      include: { semester: true },
    });
    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getCourseById = async (req, res) => {
  try {
    const course = await prisma.course.findUnique({
      where: { id: parseInt(req.params.id) },
      include: { semester: true },
    });
    if (!course) return res.status(404).json({ message: 'Course not found' });
    res.json(course);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const createCourse = async (req, res) => {
  try {
    const { code, name, description, instructorId, semesterId } = req.body;
    const course = await prisma.course.create({
      data: { code, name, description, instructorId, semesterId },
    });
    res.status(201).json(course);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateCourse = async (req, res) => {
  try {
    const { code, name, description, instructorId, semesterId } = req.body;
    const course = await prisma.course.update({
      where: { id: parseInt(req.params.id) },
      data: { code, name, description, instructorId, semesterId },
    });
    res.json(course);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteCourse = async (req, res) => {
  try {
    await prisma.course.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ message: 'Course deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getMyCourses = async (req, res) => {
  try {
    const enrollments = await prisma.enrollment.findMany({
      where: { studentId: req.user.id },
      include: { course: { include: { semester: true } } },
    });
    res.json(enrollments.map(e => e.course));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getAllCourses, getCourseById, createCourse, updateCourse, deleteCourse, getMyCourses };
