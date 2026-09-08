import express from 'express';
import { aiChat, translateMessage, splitTask } from '../controllers/aiController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/chat', aiChat);
router.post('/translate', protect, translateMessage);
router.post('/split-task', protect, splitTask);

export default router;
