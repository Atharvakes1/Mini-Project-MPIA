import express from 'express';
import {
  createRelayTask,
  getRelayTasks,
  advanceRelayTask,
} from '../controllers/relayTaskController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').post(protect, createRelayTask).get(protect, getRelayTasks);
router.put('/:id/advance', protect, advanceRelayTask);

export default router;
