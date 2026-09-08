import { motion } from 'framer-motion';
import { CheckCircle, Circle, ArrowRight, User, Clock, Zap } from 'lucide-react';

const stageColors = [
  { bg: 'bg-purple-600/20', border: 'border-purple-500/30', text: 'text-purple-400', glow: 'shadow-glow-purple' },
  { bg: 'bg-cyan-600/20', border: 'border-cyan-500/30', text: 'text-cyan-400', glow: 'shadow-glow-cyan' },
  { bg: 'bg-emerald-600/20', border: 'border-emerald-500/30', text: 'text-emerald-400', glow: 'shadow-glow-emerald' },
  { bg: 'bg-purple-600/20', border: 'border-purple-500/30', text: 'text-purple-400', glow: 'shadow-glow-purple' },
];

const TaskRelayBoard = ({ task, currentUserId, onAdvance }) => {
  if (!task) return null;

  const isAllComplete = task.stageStatus.every((s) => s);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-6"
    >
      {/* Title */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-white">{task.title}</h3>
          {task.description && (
            <p className="text-sm text-zinc-400 mt-1">{task.description}</p>
          )}
        </div>
        <div
          className={`badge ${
            isAllComplete ? 'badge-emerald' : 'badge-purple'
          }`}
        >
          {isAllComplete ? '✅ Complete' : `Stage ${task.currentStage}/4`}
        </div>
      </div>

      {/* Pipeline */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
        {task.assignedMembers.map((member, i) => {
          const isComplete = task.stageStatus[i];
          const isActive = task.currentStage === i + 1 && !isComplete;
          const isLocked = task.currentStage < i + 1;
          const canAdvance =
            isActive && member._id === currentUserId;
          const color = stageColors[i];

          return (
            <div key={i} className="relative">
              <motion.div
                whileHover={canAdvance ? { scale: 1.02 } : {}}
                className={`
                  p-4 rounded-xl border transition-all
                  ${isComplete
                    ? 'bg-zinc-800/40 border-emerald-500/20'
                    : isActive
                    ? `${color.bg} ${color.border} ${color.glow}`
                    : 'bg-zinc-800/20 border-zinc-800 opacity-50'
                  }
                `}
              >
                {/* Stage indicator */}
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] text-zinc-500 uppercase tracking-wider">
                    Stage {i + 1}
                  </span>
                  {isComplete ? (
                    <CheckCircle size={16} className="text-emerald-400" />
                  ) : isActive ? (
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Zap size={16} className={color.text} />
                    </motion.div>
                  ) : (
                    <Circle size={16} className="text-zinc-600" />
                  )}
                </div>

                {/* Stage title */}
                <h4 className="text-sm font-medium text-white mb-2">
                  {task.stageTitles?.[i] || `Stage ${i + 1}`}
                </h4>

                {/* Assigned member */}
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-6 h-6 rounded-md bg-zinc-700/50 flex items-center justify-center">
                    {member.avatarUrl ? (
                      <img
                        src={member.avatarUrl}
                        alt=""
                        className="w-6 h-6 rounded-md object-cover"
                      />
                    ) : (
                      <User size={12} className="text-zinc-400" />
                    )}
                  </div>
                  <span className="text-xs text-zinc-400 truncate">
                    {member.name}
                  </span>
                </div>

                {/* Action button */}
                {canAdvance && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onAdvance(task._id)}
                    className={`w-full py-2 rounded-lg text-xs font-medium ${color.bg} ${color.border} ${color.text} border hover:brightness-125 transition-all`}
                  >
                    Mark Complete →
                  </motion.button>
                )}

                {isComplete && (
                  <div className="text-[10px] text-emerald-400/60 text-center">
                    Completed ✓
                  </div>
                )}

                {isLocked && (
                  <div className="text-[10px] text-zinc-600 text-center flex items-center justify-center gap-1">
                    <Clock size={10} />
                    Waiting...
                  </div>
                )}
              </motion.div>

              {/* Connector arrow */}
              {i < 3 && (
                <div className="hidden sm:flex absolute top-1/2 -right-2.5 z-10 text-zinc-700">
                  <ArrowRight size={14} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default TaskRelayBoard;
