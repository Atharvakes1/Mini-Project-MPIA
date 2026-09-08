import mongoose from 'mongoose';

const relayTaskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Task title is required'],
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    chat: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Chat',
    },
    currentStage: {
      type: Number,
      min: 1,
      max: 4,
      default: 1,
    },
    assignedMembers: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
      ],
      validate: {
        validator: function (arr) {
          return arr.length === 4;
        },
        message: 'Relay task must have exactly 4 assigned members',
      },
    },
    stageStatus: {
      type: [Boolean],
      default: [false, false, false, false],
      validate: {
        validator: function (arr) {
          return arr.length === 4;
        },
        message: 'Stage status must have exactly 4 entries',
      },
    },
    stageTitles: {
      type: [String],
      default: ['UI Design', 'AI Integration', 'Backend Dev', 'Deploy & Test'],
    },
    stageDescriptions: {
      type: [String],
      default: ['', '', '', ''],
    },
  },
  { timestamps: true }
);

const RelayTask = mongoose.model('RelayTask', relayTaskSchema);
export default RelayTask;
