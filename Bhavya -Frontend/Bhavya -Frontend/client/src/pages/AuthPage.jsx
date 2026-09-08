import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mail, Lock, User, Eye, EyeOff, LogIn, UserPlus,
  Shield, CheckCircle, Zap, ArrowLeft
} from 'lucide-react';
import GlowingButton from '../components/UI/GlowingButton';
import GlassCard from '../components/UI/GlassCard';
import { useAuth } from '../context/AuthContext';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [showVerify, setShowVerify] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    studentId: '',
  });

  const { login, register, verifyStudent } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        await login(formData.email, formData.password, rememberMe);
      } else {
        await register(formData.name, formData.email, formData.password);
      }
      navigate('/chat');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await verifyStudent(formData.studentId);
      setShowVerify(false);
      navigate('/chat');
    } catch (err) {
      setError(err.response?.data?.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-deep-zinc flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse animation-delay-400" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-500/5 rounded-full blur-3xl" />

        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(168,85,247,0.3) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(168,85,247,0.3) 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Back button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-zinc-400 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft size={18} />
          <span className="text-sm">Back to Home</span>
        </motion.button>

        {/* Logo & Title */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center">
              <Zap size={24} className="text-white" />
            </div>
            <h1 className="text-3xl font-display font-bold text-white">
              Campus<span className="gradient-text">Vibe</span>
            </h1>
          </div>
          <p className="text-zinc-400 text-sm">
            {isLogin ? 'Welcome back! Sign in to continue.' : 'Create your campus account.'}
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {showVerify ? (
            /* iSim Verification */
            <motion.div
              key="verify"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <GlassCard className="p-8" animate={false}>
                <div className="flex items-center gap-3 mb-6">
                  <Shield className="text-emerald-400" size={24} />
                  <h2 className="text-xl font-semibold text-white">iSim Verification</h2>
                </div>
                <p className="text-zinc-400 text-sm mb-6">
                  Enter your Student ID to verify your enrollment and unlock your verified badge.
                </p>
                <form onSubmit={handleVerify}>
                  <div className="relative mb-4">
                    <CheckCircle className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                    <input
                      type="text"
                      name="studentId"
                      placeholder="Student ID (e.g., GLBITM2024001)"
                      value={formData.studentId}
                      onChange={handleChange}
                      className="input-dark pl-10"
                      required
                    />
                  </div>
                  {error && <p className="text-red-400 text-sm mb-4">{error}</p>}
                  <GlowingButton
                    type="submit"
                    variant="emerald"
                    className="w-full"
                    disabled={loading}
                  >
                    {loading ? 'Verifying...' : 'Verify & Continue'}
                  </GlowingButton>
                  <button
                    type="button"
                    onClick={() => { setShowVerify(false); setError(''); }}
                    className="w-full mt-3 text-sm text-zinc-400 hover:text-white transition-colors"
                  >
                    Skip for now
                  </button>
                </form>
              </GlassCard>
            </motion.div>
          ) : (
            /* Login / Register Form */
            <motion.div
              key={isLogin ? 'login' : 'register'}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <GlassCard className="p-8" animate={false}>
                {/* Tab Switcher */}
                <div className="flex bg-zinc-800/50 rounded-xl p-1 mb-6">
                  <button
                    onClick={() => { setIsLogin(true); setError(''); }}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${
                      isLogin
                        ? 'bg-purple-600 text-white shadow-glow-purple'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    <LogIn size={16} /> Sign In
                  </button>
                  <button
                    onClick={() => { setIsLogin(false); setError(''); }}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${
                      !isLogin
                        ? 'bg-purple-600 text-white shadow-glow-purple'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    <UserPlus size={16} /> Register
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Name field (register only) */}
                  <AnimatePresence>
                    {!isLogin && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                          <input
                            type="text"
                            name="name"
                            placeholder="Full Name"
                            value={formData.name}
                            onChange={handleChange}
                            className="input-dark pl-10"
                            required={!isLogin}
                          />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Email */}
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                    <input
                      type="email"
                      name="email"
                      placeholder="you@glbitm.ac.in"
                      value={formData.email}
                      onChange={handleChange}
                      className="input-dark pl-10"
                      required
                    />
                  </div>

                  {/* Password */}
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      placeholder="Password"
                      value={formData.password}
                      onChange={handleChange}
                      className="input-dark pl-10 pr-10"
                      required
                      minLength={6}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>

                  {/* Remember Me (login only) */}
                  {isLogin && (
                    <div className="flex items-center justify-between">
                      <label className="flex items-center gap-2 cursor-pointer group">
                        <div
                          onClick={() => setRememberMe(!rememberMe)}
                          className={`w-5 h-5 rounded-md border-2 transition-all flex items-center justify-center ${
                            rememberMe
                              ? 'bg-purple-600 border-purple-500'
                              : 'border-zinc-600 group-hover:border-zinc-400'
                          }`}
                        >
                          {rememberMe && <CheckCircle size={12} className="text-white" />}
                        </div>
                        <span className="text-sm text-zinc-400 group-hover:text-zinc-300">
                          Remember me
                        </span>
                      </label>
                    </div>
                  )}

                  {/* Error */}
                  {error && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-red-400 text-sm bg-red-500/10 px-4 py-2 rounded-lg border border-red-500/20"
                    >
                      {error}
                    </motion.p>
                  )}

                  {/* Submit */}
                  <GlowingButton
                    type="submit"
                    variant="purple"
                    className="w-full"
                    disabled={loading}
                  >
                    {loading
                      ? 'Please wait...'
                      : isLogin
                      ? 'Sign In'
                      : 'Create Account'}
                  </GlowingButton>
                </form>

                {/* Divider */}
                <div className="flex items-center gap-3 my-6">
                  <div className="flex-1 h-px bg-zinc-800" />
                  <span className="text-xs text-zinc-500">OR</span>
                  <div className="flex-1 h-px bg-zinc-800" />
                </div>

                {/* Google OAuth */}
                <GlowingButton
                  variant="ghost"
                  className="w-full"
                  onClick={() => {
                    setError('Configure GOOGLE_CLIENT_ID in .env to enable Google OAuth');
                  }}
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                  Continue with Google
                </GlowingButton>

                {/* Domain note */}
                <p className="text-center text-xs text-zinc-500 mt-4">
                  Only <span className="text-purple-400">@glbitm.ac.in</span> emails are accepted
                </p>
              </GlassCard>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AuthPage;
