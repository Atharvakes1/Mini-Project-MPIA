import express from 'express';
import { sendMessage, getMessages, markAsRead } from '../controllers/messageController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, sendMessage);
router.get('/:chatId', protect, getMessages);
router.put('/:id/read', protect, markAsRead);

export default router;
