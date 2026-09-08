import { motion } from 'framer-motion';

const variants = {
  cyan: 'bg-cyan-600 hover:bg-cyan-500 hover:shadow-glow-cyan border-cyan-500/50 text-white',
  purple: 'bg-purple-600 hover:bg-purple-500 hover:shadow-glow-purple border-purple-500/50 text-white',
  emerald: 'bg-emerald-600 hover:bg-emerald-500 hover:shadow-glow-emerald border-emerald-500/50 text-white',
  ghost: 'bg-transparent hover:bg-zinc-800/60 hover:text-white border-zinc-700 text-zinc-300',
  danger: 'bg-red-600/80 hover:bg-red-500 hover:shadow-[0_0_20px_rgba(239,68,68,0.5)] border-red-500/50 text-white',
};

const sizes = {
  sm: 'px-4 py-2 text-xs',
  md: 'px-6 py-3 text-sm',
  lg: 'px-8 py-4 text-base',
};

const GlowingButton = ({
  children,
  variant = 'purple',
  size = 'md',
  className = '',
  disabled = false,
  onClick,
  type = 'button',
  icon: Icon,
  ...props
}) => {
  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        inline-flex items-center justify-center gap-2
        rounded-xl font-semibold border
        transition-all duration-200
        ${variants[variant]}
        ${sizes[size]}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
      {...props}
    >
      {Icon && <Icon size={size === 'sm' ? 14 : size === 'lg' ? 20 : 16} />}
      {children}
    </motion.button>
  );
};

export default GlowingButton;
