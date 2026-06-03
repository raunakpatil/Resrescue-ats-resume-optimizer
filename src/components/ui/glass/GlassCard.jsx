import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import { useTheme } from "../../../context/ThemeContext";

export function GlassCard({ children, className = "", hoverEffect = true, ...props }) {
  const { isFocused } = useTheme();
  
  // Mouse tracking for dynamic highlight
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }) {
    if (!hoverEffect) return;
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      className={`relative overflow-hidden rounded-2xl border border-[var(--glass-border)] shadow-[var(--glass-shadow)] transition-all duration-300 isolate glass-shine-effect ${className}`}
      whileHover={hoverEffect ? { y: -2, scale: 1.01 } : {}}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      {...props}
    >
      {/* Base Background Layer */}
      <div className={`absolute inset-0 bg-[var(--glass-surface)] backdrop-blur-[40px] pointer-events-none -z-10 transition-opacity duration-300 ${isFocused ? 'opacity-100' : 'opacity-90'}`} />

      {/* Interactive hover highlight layer */}
      {hoverEffect && (
        <motion.div
          className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition duration-300 group-hover:opacity-100 -z-10"
          style={{
            background: useMotionTemplate`
              radial-gradient(
                450px circle at ${mouseX}px ${mouseY}px,
                var(--glass-highlight),
                transparent 80%
              )
            `,
          }}
        />
      )}
      
      {/* Static inner rim light to simulate glass thickness */}
      <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/10 pointer-events-none -z-10" />
      
      {/* Children are rendered natively in the container, allowing flex/grid to work on the parent */}
      {children}
    </motion.div>
  );
}
