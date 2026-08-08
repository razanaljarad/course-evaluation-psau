const express = require('express');
const router = express.Router();
const { register, login, getMe } = require('../controllers/auth.controller');
const { authenticate } = require('../middleware/auth.middleware');

/**
 * @route POST /api/auth/register
 * @desc Register new user
 */
router.post('/register', register);

/**
 * @route POST /api/auth/login
 * @desc Login user
 */
router.post('/login', login);

/**
 * @route GET /api/auth/me
 * @desc Get current user
 */
router.get('/me', authenticate, getMe);

module.exports = router;
