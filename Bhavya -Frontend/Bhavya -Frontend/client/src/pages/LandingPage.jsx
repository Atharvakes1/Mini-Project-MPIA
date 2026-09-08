import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Zap, Shield, Users, Brain, Calendar, ChevronDown, ChevronUp,
  ArrowRight, Megaphone, Sparkles
} from 'lucide-react';
import GlowingButton from '../components/UI/GlowingButton';
import GlassCard from '../components/UI/GlassCard';
import SplineHero from '../components/3D/SplineHero';
import FloatingAiBot from '../components/AI/FloatingAiBot';
import { useAuth } from '../context/AuthContext';

const features = [
  {
    icon: Megaphone,
    title: 'Campus Announcements',
    description: 'Official college channels with admin-controlled posting. Stay updated with verified announcements.',
    color: 'cyan',
    gradient: 'from-cyan-500/20 to-cyan-600/5',
  },
  {
    icon: Brain,
    title: 'AI Workspace & Tasks',
    description: 'Gemini-powered task splitting and relay workflow engine for seamless team collaboration.',
    color: 'purple',
    gradient: 'from-purple-500/20 to-purple-600/5',
  },
  {
    icon: Calendar,
    title: 'Clubs & Fests Hub',
    description: 'Real-time club channels, event management, and fest coordination all in one place.',
    color: 'emerald',
    gradient: 'from-emerald-500/20 to-emerald-600/5',
  },
  {
    icon: Shield,
    title: 'Verified & Secure',
    description: 'College-domain-locked authentication with student verification and end-to-end data safety.',
    color: 'cyan',
    gradient: 'from-cyan-500/20 to-blue-600/5',
  },
];

const faqs = [
  {
    q: 'How do I join CampusVibe?',
    a: 'Simply sign up with your @glbitm.ac.in college email. Google OAuth makes it instant — just one click to get started!',
  },
  {
    q: 'What is the Relay Task system?',
    a: 'Relay Tasks let teams work in sequence: Member 1 completes their part, then it auto-assigns to Member 2, and so on. Perfect for group projects!',
  },
  {
    q: 'Can I create my own club channel?',
    a: 'Yes! Club leads can create dedicated channels for their communities. Request club_lead access from an admin to get started.',
  },
  {
    q: 'Is my data secure?',
    a: 'Absolutely. We use JWT authentication, bcrypt password hashing, and role-based access control. Only verified students can join.',
  },
  {
    q: 'What AI features are available?',
    a: 'We offer a campus AI chatbot (powered by Gemini), real-time message translation, and an AI task splitter that breaks assignments into milestones.',
  },
];

const LandingPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [openFaq, setOpenFaq] = useState(null);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen bg-deep-zinc overflow-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-40 bg-deep-zinc/80 backdrop-blur-lg border-b border-zinc-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center shadow-glow-purple">
              <Zap size={18} className="text-white" />
            </div>
            <span className="text-xl font-display font-bold text-white">
              Campus<span className="text-purple-400">Vibe</span>
            </span>
          </div>
          <div className="flex items-center gap-3">
            {user ? (
              <>
                <span className="text-xs text-zinc-400 hidden sm:inline">
                  Welcome, <span className="text-purple-400 font-semibold">{user.name?.split(' ')[0]}</span>
                </span>
                <GlowingButton
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('/dashboard')}
                >
                  Workspace
                </GlowingButton>
                <GlowingButton
                  variant="purple"
                  size="sm"
                  onClick={() => navigate('/chat')}
                  icon={ArrowRight}
                >
                  Open Chat
                </GlowingButton>
              </>
            ) : (
              <>
                <GlowingButton
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('/auth')}
                >
                  Sign In
                </GlowingButton>
                <GlowingButton
                  variant="purple"
                  size="sm"
                  onClick={() => navigate('/auth')}
                  icon={ArrowRight}
                >
                  Get Started
                </GlowingButton>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4">
        {/* Background effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-1/4 w-[500px] h-[500px] bg-purple-600/8 rounded-full blur-3xl" />
          <div className="absolute top-40 right-1/4 w-[400px] h-[400px] bg-cyan-600/8 rounded-full blur-3xl" />
          <div
            className="absolute inset-0 opacity-[0.02]"
            style={{
              backgroundImage: `linear-gradient(rgba(168,85,247,0.4) 1px, transparent 1px),
                                linear-gradient(90deg, rgba(168,85,247,0.4) 1px, transparent 1px)`,
              backgroundSize: '80px 80px',
            }}
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          {/* Text */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-purple-500/10 border border-purple-500/20 rounded-full mb-6">
              <Sparkles size={14} className="text-purple-400" />
              <span className="text-xs text-purple-300 font-medium">
                AI-Powered Campus Platform
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold leading-tight mb-6">
              Your Campus Life,{' '}
              <span className="gradient-text">Decentralized</span>{' '}
              &amp; Connected
            </h1>

            <p className="text-lg text-zinc-400 leading-relaxed mb-8 max-w-lg">
              Chat in real-time, collaborate with AI-powered tools, manage club events,
              and stay connected with your campus community — all in one vibrant platform.
            </p>

            <div className="flex flex-wrap gap-4">
              <GlowingButton
                variant="purple"
                size="lg"
                icon={user ? ArrowRight : Users}
                onClick={() => navigate(user ? '/chat' : '/auth')}
              >
                {user ? 'Enter Campus Hub' : 'Join with College ID'}
              </GlowingButton>
              <GlowingButton
                variant="ghost"
                size="lg"
                icon={Calendar}
                onClick={() => {
                  document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Explore Features
              </GlowingButton>
            </div>

            {/* Stats */}
            <div className="flex gap-8 mt-10">
              {[
                { value: '100%', label: 'Verified Users' },
                { value: 'Real-time', label: 'Messaging' },
                { value: 'AI', label: 'Powered' },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                  <p className="text-xs text-zinc-500">{stat.label}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* 3D Hero */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="hidden lg:block h-[500px]"
          >
            <SplineHero />
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-white mb-4">
              Everything You Need, <span className="gradient-text">One Platform</span>
            </h2>
            <p className="text-zinc-400 max-w-2xl mx-auto">
              From official announcements to private club chats, AI-powered workspaces to event coordination.
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {features.map((feature) => (
              <motion.div key={feature.title} variants={itemVariants}>
                <GlassCard
                  hover
                  glowColor={feature.color}
                  className="p-6 h-full"
                >
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} border border-zinc-700/50 flex items-center justify-center mb-4`}
                  >
                    <feature.icon
                      size={22}
                      className={
                        feature.color === 'cyan'
                          ? 'text-cyan-400'
                          : feature.color === 'purple'
                          ? 'text-purple-400'
                          : 'text-emerald-400'
                      }
                    />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                  <p className="text-sm text-zinc-400 leading-relaxed">{feature.description}</p>
                </GlassCard>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>



      {/* FAQ */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-white mb-4">
              Frequently Asked <span className="gradient-text">Questions</span>
            </h2>
          </motion.div>

          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <GlassCard animate={false} className="overflow-hidden">
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between px-6 py-4 text-left"
                  >
                    <span className="text-sm font-medium text-white pr-4">{faq.q}</span>
                    {openFaq === i ? (
                      <ChevronUp size={18} className="text-purple-400 flex-shrink-0" />
                    ) : (
                      <ChevronDown size={18} className="text-zinc-500 flex-shrink-0" />
                    )}
                  </button>
                  <motion.div
                    initial={false}
                    animate={{
                      height: openFaq === i ? 'auto' : 0,
                      opacity: openFaq === i ? 1 : 0,
                    }}
                    className="overflow-hidden"
                  >
                    <p className="px-6 pb-4 text-sm text-zinc-400 leading-relaxed">{faq.a}</p>
                  </motion.div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <GlassCard className="p-12 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 via-transparent to-cyan-600/10" />
            <div className="relative z-10">
              <h2 className="text-3xl sm:text-4xl font-display font-bold text-white mb-4">
                Ready to <span className="gradient-text">Vibe</span>?
              </h2>
              <p className="text-zinc-400 mb-8 max-w-lg mx-auto">
                Join your campus community. Chat, collaborate, and create — all with the power of AI.
              </p>
              <GlowingButton
                variant="purple"
                size="lg"
                icon={ArrowRight}
                onClick={() => navigate(user ? '/chat' : '/auth')}
              >
                {user ? 'Launch CampusVibe' : 'Get Started — It\'s Free'}
              </GlowingButton>
            </div>
          </GlassCard>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-800/50 py-8 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Zap size={16} className="text-purple-400" />
            <span className="text-sm text-zinc-500">
              CampusVibe © 2026 — Built for GLBITM
            </span>
          </div>
          <div className="flex items-center gap-4 text-xs text-zinc-600">
            <span>Powered by Gemini AI</span>
            <span>•</span>
            <span>Socket.io Real-time</span>
            <span>•</span>
            <span>MongoDB Atlas</span>
          </div>
        </div>
      </footer>

      {/* Floating AI Bot */}
      <FloatingAiBot />
    </div>
  );
};

export default LandingPage;
