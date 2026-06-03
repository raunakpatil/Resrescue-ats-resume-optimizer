import { motion } from "framer-motion";

export function GlassButton({ children, variant = "primary", className = "", ...props }) {
  const baseClasses = "relative overflow-hidden rounded-xl font-medium flex items-center justify-center gap-2 outline-none transition-colors duration-200";
  
  const variants = {
    primary: "bg-[var(--accent-primary)] text-white shadow-[0_4px_15px_rgba(99,102,241,0.3)] hover:bg-[var(--accent-primary-hover)] px-5 py-2.5 text-sm",
    secondary: "bg-[var(--glass-surface)] border border-[var(--glass-border)] text-[var(--text-primary)] hover:bg-[var(--glass-surface-hover)] shadow-[inset_0_1px_0_var(--glass-highlight),var(--glass-shadow)] px-5 py-2.5 text-sm",
    ghost: "bg-transparent text-[var(--text-secondary)] hover:bg-[var(--glass-surface)] hover:text-[var(--text-primary)] px-4 py-2 text-sm"
  };

  return (
    <motion.button
      className={`${baseClasses} ${variants[variant]} ${className}`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.96 }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
      {...props}
    >
      {/* Inner highlight for 3D effect */}
      {variant !== 'ghost' && (
        <div className="absolute inset-0 rounded-xl ring-1 ring-inset ring-white/20 pointer-events-none" />
      )}
      <span className="relative z-10 flex items-center gap-2">{children}</span>
    </motion.button>
  );
}
