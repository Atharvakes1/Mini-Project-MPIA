import { motion } from 'framer-motion';

const GlassCard = ({
  children,
  className = '',
  hover = false,
  glowColor = null,
  onClick,
  animate = true,
  ...props
}) => {
  const glowStyles = {
    cyan: 'hover:border-cyan-500/40 hover:shadow-glow-cyan',
    purple: 'hover:border-purple-500/40 hover:shadow-glow-purple',
    emerald: 'hover:border-emerald-500/40 hover:shadow-glow-emerald',
  };

  const Component = animate ? motion.div : 'div';
  const motionProps = animate
    ? {
        initial: { opacity: 0, y: 20 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true },
        transition: { duration: 0.5 },
        ...(hover && { whileHover: { y: -4 } }),
      }
    : {};

  return (
    <Component
      onClick={onClick}
      className={`
        bg-zinc-900/70 backdrop-blur-md border border-zinc-800 rounded-2xl
        transition-all duration-300
        ${hover ? 'cursor-pointer hover:bg-zinc-900/80 hover:border-zinc-700' : ''}
        ${glowColor && glowStyles[glowColor] ? glowStyles[glowColor] : ''}
        ${className}
      `}
      {...motionProps}
      {...props}
    >
      {children}
    </Component>
  );
};

export default GlassCard;
