const express = require('express');
const router = express.Router();
const { getAllQuestions, createQuestion, updateQuestion, deleteQuestion } = require('../controllers/question.controller');
const { authenticate, authorize } = require('../middleware/auth.middleware');

router.get('/', authenticate, getAllQuestions);
router.post('/', authenticate, authorize('ADMIN'), createQuestion);
router.put('/:id', authenticate, authorize('ADMIN'), updateQuestion);
router.delete('/:id', authenticate, authorize('ADMIN'), deleteQuestion);

module.exports = router;
