import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard, Brain, Sparkles, ArrowLeft, Plus,
  MessageCircle, Users, Zap, ChevronRight
} from 'lucide-react';
import GlassCard from '../components/UI/GlassCard';
import GlowingButton from '../components/UI/GlowingButton';
import TaskRelayBoard from '../components/Classroom/TaskRelayBoard';
import AssignmentCard from '../components/Classroom/AssignmentCard';
import FloatingAiBot from '../components/AI/FloatingAiBot';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { splitTask } from '../services/gemini';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState(null);

  const fetchTasks = async () => {
    try {
      const { data } = await api.get('/relay');
      setTasks(data);
    } catch (err) {
      console.error('Failed to fetch tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleAdvance = async (taskId) => {
    try {
      const { data } = await api.put(`/relay/${taskId}/advance`);
      setTasks((prev) =>
        prev.map((t) => (t._id === taskId ? data : t))
      );
    } catch (err) {
      console.error('Failed to advance task:', err);
    }
  };

  const handleAiSplit = async () => {
    if (!aiPrompt.trim()) return;
    setAiLoading(true);
    try {
      const milestones = await splitTask(aiPrompt);
      setAiResult(milestones);
    } catch {
      setAiResult(null);
      alert('AI task splitting failed. Check your API key.');
    } finally {
      setAiLoading(false);
    }
  };

  const stats = [
    {
      icon: LayoutDashboard,
      label: 'Active Tasks',
      value: tasks.filter((t) => !t.stageStatus.every(Boolean)).length,
      color: 'purple',
    },
    {
      icon: Users,
      label: 'Completed',
      value: tasks.filter((t) => t.stageStatus.every(Boolean)).length,
      color: 'emerald',
    },
    {
      icon: Zap,
      label: 'Your Stage',
      value: tasks.filter(
        (t) =>
          t.assignedMembers[t.currentStage - 1]?._id === user?._id &&
          !t.stageStatus[t.currentStage - 1]
      ).length,
      color: 'cyan',
    },
  ];

  return (
    <div className="min-h-screen bg-deep-zinc">
      {/* Top Bar */}
      <div className="bg-zinc-900/80 backdrop-blur-md border-b border-zinc-800/50 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/chat')}
              className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors"
            >
              <ArrowLeft size={18} />
            </button>
            <div className="flex items-center gap-2">
              <LayoutDashboard size={20} className="text-purple-400" />
              <h1 className="text-lg font-display font-bold text-white">
                Workspace
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <GlowingButton
              variant="ghost"
              size="sm"
              icon={MessageCircle}
              onClick={() => navigate('/chat')}
            >
              Chat
            </GlowingButton>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {stats.map((stat) => (
            <GlassCard key={stat.label} className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-zinc-500 mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                </div>
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    stat.color === 'purple'
                      ? 'bg-purple-600/20 text-purple-400'
                      : stat.color === 'cyan'
                      ? 'bg-cyan-600/20 text-cyan-400'
                      : 'bg-emerald-600/20 text-emerald-400'
                  }`}
                >
                  <stat.icon size={20} />
                </div>
              </div>
            </GlassCard>
          ))}
        </div>

        {/* AI Task Splitter */}
        <GlassCard className="p-6 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Brain size={20} className="text-cyan-400" />
            <h2 className="text-lg font-semibold text-white">AI Task Splitter</h2>
            <span className="badge-cyan text-[10px]">Gemini</span>
          </div>
          <p className="text-sm text-zinc-400 mb-4">
            Paste a project prompt and AI will break it into 4 sequential relay milestones.
          </p>
          <div className="flex gap-3">
            <textarea
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              placeholder="e.g., Build a campus event management app with user registration, event listing, QR check-in, and analytics dashboard..."
              className="flex-1 input-dark min-h-[80px] resize-none"
              rows={3}
            />
          </div>
          <div className="mt-3 flex items-center gap-3">
            <GlowingButton
              variant="cyan"
              size="sm"
              icon={Sparkles}
              onClick={handleAiSplit}
              disabled={aiLoading || !aiPrompt.trim()}
            >
              {aiLoading ? 'Splitting...' : 'Split into Milestones'}
            </GlowingButton>
          </div>

          {/* AI Result */}
          {aiResult && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 grid sm:grid-cols-4 gap-3"
            >
              {aiResult.map((milestone, i) => (
                <div
                  key={i}
                  className="p-4 bg-zinc-800/40 border border-zinc-700/50 rounded-xl"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs text-zinc-500">Stage {i + 1}</span>
                    <span
                      className={`w-2 h-2 rounded-full ${
                        i === 0
                          ? 'bg-purple-400'
                          : i === 1
                          ? 'bg-cyan-400'
                          : i === 2
                          ? 'bg-emerald-400'
                          : 'bg-purple-400'
                      }`}
                    />
                  </div>
                  <h4 className="text-sm font-medium text-white mb-1">
                    {milestone.title}
                  </h4>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    {milestone.description}
                  </p>
                </div>
              ))}
            </motion.div>
          )}
        </GlassCard>

        {/* Active Relay Tasks */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">Active Relay Tasks</h2>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : tasks.length === 0 ? (
            <GlassCard className="p-12 text-center">
              <Zap size={32} className="text-zinc-700 mx-auto mb-3" />
              <p className="text-zinc-500 mb-2">No relay tasks yet</p>
              <p className="text-xs text-zinc-600">
                Create a relay task or ask AI to split a project for your team.
              </p>
            </GlassCard>
          ) : (
            <div className="space-y-4">
              {tasks.map((task) => (
                <TaskRelayBoard
                  key={task._id}
                  task={task}
                  currentUserId={user?._id}
                  onAdvance={handleAdvance}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Floating AI Bot */}
      <FloatingAiBot />
    </div>
  );
};

export default Dashboard;
