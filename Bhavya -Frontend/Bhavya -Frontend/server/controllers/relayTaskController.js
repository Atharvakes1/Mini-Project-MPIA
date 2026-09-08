import RelayTask from '../models/RelayTask.js';

// @route  POST /api/relay
// @desc   Create a relay task with 4 members
export const createRelayTask = async (req, res) => {
  try {
    const { title, description, assignedMembers, chatId, stageTitles, stageDescriptions } = req.body;

    if (!assignedMembers || assignedMembers.length !== 4) {
      return res
        .status(400)
        .json({ message: 'Relay task requires exactly 4 assigned members' });
    }

    const task = await RelayTask.create({
      title,
      description: description || '',
      assignedMembers,
      chat: chatId,
      stageTitles: stageTitles || ['UI Design', 'AI Integration', 'Backend Dev', 'Deploy & Test'],
      stageDescriptions: stageDescriptions || ['', '', '', ''],
    });

    const populated = await task.populate('assignedMembers', 'name avatarUrl email');
    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route  GET /api/relay
// @desc   Get relay tasks for current user
export const getRelayTasks = async (req, res) => {
  try {
    const tasks = await RelayTask.find({
      assignedMembers: { $in: [req.user._id] },
    })
      .populate('assignedMembers', 'name avatarUrl email')
      .sort({ updatedAt: -1 });

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route  PUT /api/relay/:id/advance
// @desc   Mark current stage complete and advance to next
export const advanceRelayTask = async (req, res) => {
  try {
    const task = await RelayTask.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const currentIndex = task.currentStage - 1;

    // Verify the current user is the assigned member for the active stage
    if (task.assignedMembers[currentIndex].toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: 'Only the assigned member can advance this stage' });
    }

    // Mark current stage as complete
    task.stageStatus[currentIndex] = true;

    // Advance to next stage if not already at the last stage
    if (task.currentStage < 4) {
      task.currentStage += 1;
    }

    task.markModified('stageStatus');
    await task.save();

    const populated = await task.populate('assignedMembers', 'name avatarUrl email');
    res.json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
