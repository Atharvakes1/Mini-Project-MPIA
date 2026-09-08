import express from 'express';
import {
  accessChat,
  fetchChats,
  createGroupChat,
  updateGroupChat,
  addToGroup,
  removeFromGroup,
  searchUsers,
} from '../controllers/chatController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').post(protect, accessChat).get(protect, fetchChats);
router.get('/users', protect, searchUsers);
router.post('/group', protect, createGroupChat);
router.put('/group/:id', protect, updateGroupChat);
router.put('/group/:id/add', protect, addToGroup);
router.put('/group/:id/remove', protect, removeFromGroup);

export default router;
