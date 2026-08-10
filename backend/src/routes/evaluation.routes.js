const express = require('express');
const router = express.Router();
const { submitEvaluation, getMyEvaluations, getCourseEvaluations } = require('../controllers/evaluation.controller');
const { authenticate, authorize } = require('../middleware/auth.middleware');

router.post('/', authenticate, authorize('STUDENT'), submitEvaluation);
router.get('/my', authenticate, authorize('STUDENT'), getMyEvaluations);
router.get('/course/:courseId', authenticate, getCourseEvaluations);

module.exports = router;
