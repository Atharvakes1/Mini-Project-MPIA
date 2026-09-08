import { motion } from 'framer-motion';
import { Calendar, Clock, User, FileText, ChevronRight } from 'lucide-react';

const AssignmentCard = ({ title, description, dueDate, status, assignee, onClick }) => {
  const statusColors = {
    pending: 'badge-purple',
    active: 'badge-cyan',
    completed: 'badge-emerald',
    overdue: 'bg-red-500/20 text-red-400 border border-red-500/30',
  };

  return (
    <motion.div
      whileHover={{ y: -2, borderColor: 'rgba(168, 85, 247, 0.3)' }}
      onClick={onClick}
      className="glass-card p-5 cursor-pointer transition-all group"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-purple-600/20 flex items-center justify-center">
            <FileText size={16} className="text-purple-400" />
          </div>
          <h4 className="text-sm font-semibold text-white">{title}</h4>
        </div>
        <span className={`badge text-[10px] ${statusColors[status] || statusColors.pending}`}>
          {status}
        </span>
      </div>

      {description && (
        <p className="text-xs text-zinc-500 mb-3 line-clamp-2">{description}</p>
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {dueDate && (
            <div className="flex items-center gap-1 text-xs text-zinc-500">
              <Calendar size={12} />
              {new Date(dueDate).toLocaleDateString()}
            </div>
          )}
          {assignee && (
            <div className="flex items-center gap-1 text-xs text-zinc-500">
              <User size={12} />
              {assignee}
            </div>
          )}
        </div>
        <ChevronRight
          size={14}
          className="text-zinc-600 group-hover:text-purple-400 transition-colors"
        />
      </div>
    </motion.div>
  );
};

export default AssignmentCard;
