import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';

const SplineHero = () => {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* 3D CSS animated hero — serves as placeholder for Spline integration */}
      <div className="relative" style={{ perspective: '1000px' }}>
        {/* Outer rotating ring */}
        <motion.div
          animate={{ rotateY: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-0 w-72 h-72 md:w-96 md:h-96 rounded-full border-2 border-purple-500/20"
          style={{ transformStyle: 'preserve-3d' }}
        />

        {/* Middle ring */}
        <motion.div
          animate={{ rotateX: 360 }}
          transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-4 w-64 h-64 md:w-80 md:h-80 rounded-full border-2 border-cyan-500/20"
          style={{ transformStyle: 'preserve-3d' }}
        />

        {/* Inner ring */}
        <motion.div
          animate={{ rotateZ: -360 }}
          transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-8 w-56 h-56 md:w-72 md:h-72 rounded-full border border-emerald-500/20"
          style={{ transformStyle: 'preserve-3d' }}
        />

        {/* Center badge */}
        <motion.div
          animate={{ y: [-10, 10, -10] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className="relative w-72 h-72 md:w-96 md:h-96 flex items-center justify-center"
        >
          {/* Glowing core */}
          <div className="w-32 h-32 md:w-40 md:h-40 rounded-2xl bg-gradient-to-br from-purple-600/40 via-cyan-600/30 to-emerald-600/40 backdrop-blur-xl border border-purple-500/30 flex items-center justify-center shadow-glow-purple-lg">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 5, repeat: Infinity }}
            >
              <Zap size={48} className="text-purple-400 md:w-16 md:h-16" />
            </motion.div>
          </div>

          {/* Orbiting dots */}
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <motion.div
              key={i}
              animate={{ rotate: 360 }}
              transition={{
                duration: 8 + i * 2,
                repeat: Infinity,
                ease: 'linear',
              }}
              className="absolute inset-0"
              style={{ transformOrigin: 'center center' }}
            >
              <div
                className={`absolute w-2 h-2 md:w-3 md:h-3 rounded-full ${
                  i % 3 === 0
                    ? 'bg-purple-400 shadow-glow-purple'
                    : i % 3 === 1
                    ? 'bg-cyan-400 shadow-glow-cyan'
                    : 'bg-emerald-400 shadow-glow-emerald'
                }`}
                style={{
                  top: `${15 + i * 8}%`,
                  left: `${50 + (i % 2 === 0 ? 30 : -30)}%`,
                }}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Ambient glow */}
        <div className="absolute inset-0 bg-purple-500/5 rounded-full blur-3xl scale-150" />
      </div>
    </div>
  );
};

export default SplineHero;
