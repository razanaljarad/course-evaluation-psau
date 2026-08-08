const express = require('express');
const router = express.Router();
const { getDashboardStats, getCourseAnalytics, getLeaderboard } = require('../controllers/analytics.controller');
const { authenticate, authorize } = require('../middleware/auth.middleware');

router.get('/dashboard', authenticate, authorize('ADMIN'), getDashboardStats);
router.get('/courses', authenticate, authorize('ADMIN', 'INSTRUCTOR'), getCourseAnalytics);
router.get('/leaderboard', authenticate, getLeaderboard);

module.exports = router;
