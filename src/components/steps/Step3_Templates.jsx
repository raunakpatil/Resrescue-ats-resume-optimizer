import { useApp } from "../../context/AppContext";
import { GlassCard } from "../ui/glass/GlassCard";
import { GlassButton } from "../ui/glass/GlassButton";
import clsx from "clsx";
import { Wrench, Zap, ArrowLeft, BrainCircuit } from "lucide-react";
import { motion } from "framer-motion";

export function Step3_Templates() {
  const { optimizationMode, setOptimizationMode, setStep } = useApp();

  const handleContinue = () => setStep(4);
  const handleBack = () => setStep(2);

  const stagger = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1, duration: 0.5, type: "spring" }
    })
  };

  return (
    <div className="max-w-6xl 2xl:max-w-[1600px] mx-auto px-4 xl:px-8 2xl:px-16 py-8 relative">
      {/* Background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-2xl h-64 bg-[var(--accent-primary)] rounded-full blur-[150px] opacity-10 pointer-events-none" />
      
      {/* Header */}
      <motion.div custom={0} initial="hidden" animate="visible" variants={stagger} className="text-center mb-10 relative z-10">
        <div className="w-16 h-16 rounded-full bg-[var(--accent-primary)]/10 flex items-center justify-center mx-auto mb-4 border border-[var(--accent-primary)]/20 shadow-[0_0_30px_rgba(99,102,241,0.15)]">
            <BrainCircuit className="w-8 h-8 text-[var(--accent-primary)]" />
        </div>
        <h2 className="font-display text-2xl md:text-4xl font-bold text-[var(--text-primary)] mb-3 tracking-tight">
          Choose Optimization Mode
        </h2>
        <p className="text-[var(--text-secondary)] text-[15px] max-w-xl mx-auto">
          How aggressively should our AI agents rewrite your resume? Choose your strategy.
        </p>
      </motion.div>

      {/* Mode Selection */}
      <motion.div custom={1} initial="hidden" animate="visible" variants={stagger} className="mb-12 max-w-5xl 2xl:max-w-[1400px] mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <GlassCard
            onClick={() => setOptimizationMode("pro")}
            className={clsx(
              "p-6 text-left transition-all cursor-pointer h-full flex flex-col",
              optimizationMode === "pro"
                ? "ring-2 ring-[var(--accent-primary)] bg-[var(--accent-primary)]/10 shadow-[0_0_30px_rgba(99,102,241,0.2)]"
                : "border-[var(--glass-border)] hover:bg-[var(--glass-surface-hover)]"
            )}
          >
            <div className="flex items-center gap-4 mb-4">
              <div className={clsx("w-12 h-12 rounded-xl flex items-center justify-center transition-colors", optimizationMode === "pro" ? "bg-[var(--accent-primary)] text-white shadow-lg shadow-[var(--accent-primary)]/30" : "bg-[var(--bg-secondary)] border border-[var(--glass-border)] text-[var(--text-primary)]")}>
                <Wrench className="w-6 h-6" />
              </div>
              <h4 className={clsx("font-bold text-xl", optimizationMode === "pro" ? "text-[var(--accent-primary)]" : "text-[var(--text-primary)]")}>
                Pro Mode
              </h4>
            </div>
            <p className="text-[14px] text-[var(--text-secondary)] leading-relaxed flex-1">
              Standard ATS optimization. Enhances your existing points with natural phrasing, strictly adheres to factual formatting, and injects missing keywords contextually.
            </p>
            {optimizationMode === "pro" && (
                <div className="mt-4 text-xs font-bold text-[var(--accent-primary)] bg-[var(--accent-primary)]/10 px-3 py-1.5 rounded-md inline-block self-start border border-[var(--accent-primary)]/20">
                    Safe & Reliable
                </div>
            )}
          </GlassCard>

          <GlassCard
            onClick={() => setOptimizationMode("god")}
            className={clsx(
              "p-6 text-left transition-all cursor-pointer h-full flex flex-col",
              optimizationMode === "god"
                ? "ring-2 ring-red-500 bg-red-500/10 shadow-[0_0_30px_rgba(239,68,68,0.2)]"
                : "border-[var(--glass-border)] hover:bg-[var(--glass-surface-hover)]"
            )}
          >
            <div className="flex items-center gap-4 mb-4">
              <div className={clsx("w-12 h-12 rounded-xl flex items-center justify-center transition-colors", optimizationMode === "god" ? "bg-red-500 text-white shadow-[0_0_15px_rgba(239,68,68,0.5)]" : "bg-[var(--bg-secondary)] border border-[var(--glass-border)] text-[var(--text-primary)]")}>
                <Zap className="w-6 h-6" />
              </div>
              <h4 className={clsx("font-bold text-xl", optimizationMode === "god" ? "text-red-500" : "text-[var(--text-primary)]")}>
                God Mode
              </h4>
            </div>
            <p className="text-[14px] text-[var(--text-secondary)] leading-relaxed flex-1">
              Aggressive ATS targeting. Deeply rewrites bullet points, infers realistic metrics, expands on project scope, and forces 100% keyword injection to maximize ATS scores.
            </p>
            {optimizationMode === "god" && (
                <div className="mt-4 text-xs font-bold text-red-500 bg-red-500/10 px-3 py-1.5 rounded-md inline-block self-start border border-red-500/20">
                    High Risk, High Reward
                </div>
            )}
          </GlassCard>
        </div>
      </motion.div>

      {/* Navigation */}
      <motion.div custom={2} initial="hidden" animate="visible" variants={stagger} className="flex justify-between items-center relative z-10 pt-4 border-t border-[var(--glass-border)]">
        <GlassButton variant="secondary" onClick={handleBack}>
          <ArrowLeft className="w-4 h-4" />
          Back
        </GlassButton>
        <GlassButton
          variant="primary"
          onClick={handleContinue}
          className="px-8 bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] text-white border-0 shadow-[0_0_20px_rgba(99,102,241,0.4)]"
        >
          <Zap className="w-4 h-4 fill-white" />
          Start Optimization
        </GlassButton>
      </motion.div>
    </div>
  );
}
