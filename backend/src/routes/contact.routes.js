const express = require('express');
const router = express.Router();
const { sendMessage, getAllMessages, getMyMessages, replyMessage, markAsRead } = require('../controllers/contact.controller');
const { authenticate, authorize } = require('../middleware/auth.middleware');

router.post('/', authenticate, authorize('STUDENT'), sendMessage);
router.get('/my', authenticate, authorize('STUDENT'), getMyMessages);
router.get('/', authenticate, authorize('ADMIN'), getAllMessages);
router.put('/:id/reply', authenticate, authorize('ADMIN'), replyMessage);
router.put('/:id/read', authenticate, authorize('ADMIN'), markAsRead);

module.exports = router;
