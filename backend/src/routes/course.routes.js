const express = require('express');
const router = express.Router();
const { getAllCourses, getCourseById, createCourse, updateCourse, deleteCourse, getMyCourses } = require('../controllers/course.controller');
const { authenticate, authorize } = require('../middleware/auth.middleware');

router.get('/', authenticate, getAllCourses);
router.get('/my', authenticate, authorize('STUDENT'), getMyCourses);
router.get('/:id', authenticate, getCourseById);
router.post('/', authenticate, authorize('ADMIN'), createCourse);
router.put('/:id', authenticate, authorize('ADMIN'), updateCourse);
router.delete('/:id', authenticate, authorize('ADMIN'), deleteCourse);

module.exports = router;
