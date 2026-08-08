const express = require('express');
const router = express.Router();
const { getAllSemesters, getActiveSemester, createSemester, updateSemester } = require('../controllers/semester.controller');
const { authenticate, authorize } = require('../middleware/auth.middleware');

router.get('/', authenticate, getAllSemesters);
router.get('/active', authenticate, getActiveSemester);
router.post('/', authenticate, authorize('ADMIN'), createSemester);
router.put('/:id', authenticate, authorize('ADMIN'), updateSemester);

module.exports = router;
