const prisma = require('../lib/prisma');

const getMyMessages = async (req, res) => {
  try {
    const messages = await prisma.contactMessage.findMany({
      where: { studentId: req.user.id },
      orderBy: { createdAt: 'desc' },
    });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const sendMessage = async (req, res) => {
  try {
    const { subject, message } = req.body;
    const studentId = req.user.id;
    const msg = await prisma.contactMessage.create({
      data: { studentId, subject, message },
    });
    res.status(201).json({ message: 'تم إرسال رسالتك بنجاح', data: msg });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getAllMessages = async (req, res) => {
  try {
    const messages = await prisma.contactMessage.findMany({
      include: { student: { select: { name: true, email: true, studentId: true } } },
      orderBy: { createdAt: 'desc' },
    });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const replyMessage = async (req, res) => {
  try {
    const { reply } = req.body;
    const msg = await prisma.contactMessage.update({
      where: { id: parseInt(req.params.id) },
      data: { isRead: true, reply, repliedAt: new Date() },
    });
    res.json(msg);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const markAsRead = async (req, res) => {
  try {
    const msg = await prisma.contactMessage.update({
      where: { id: parseInt(req.params.id) },
      data: { isRead: true },
    });
    res.json(msg);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { sendMessage, getAllMessages, getMyMessages, replyMessage, markAsRead };
