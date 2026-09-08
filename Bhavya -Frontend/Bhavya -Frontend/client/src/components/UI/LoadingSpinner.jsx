import { motion } from 'framer-motion';

const LoadingSpinner = ({ size = 'md', color = 'purple' }) => {
  const sizeMap = { sm: 'w-5 h-5', md: 'w-8 h-8', lg: 'w-12 h-12' };
  const colorMap = {
    cyan: 'border-cyan-500',
    purple: 'border-purple-500',
    emerald: 'border-emerald-500',
    white: 'border-white',
  };

  return (
    <div className="flex items-center justify-center">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        className={`
          ${sizeMap[size]}
          border-2 border-t-transparent rounded-full
          ${colorMap[color]}
        `}
      />
    </div>
  );
};

export const FullPageLoader = () => (
  <div className="fixed inset-0 bg-deep-zinc flex items-center justify-center z-50">
    <div className="flex flex-col items-center gap-4">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
        className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full"
      />
      <motion.p
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="text-zinc-400 font-medium"
      >
        Loading CampusVibe...
      </motion.p>
    </div>
  </div>
);

export default LoadingSpinner;
