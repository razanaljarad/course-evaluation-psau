const express = require('express');
const router = express.Router();
const { getAllUsers, enrollStudent, deleteUser } = require('../controllers/user.controller');
const { authenticate, authorize } = require('../middleware/auth.middleware');

router.get('/', authenticate, authorize('ADMIN'), getAllUsers);
router.post('/enroll', authenticate, authorize('ADMIN'), enrollStudent);
router.delete('/:id', authenticate, authorize('ADMIN'), deleteUser);

module.exports = router;
