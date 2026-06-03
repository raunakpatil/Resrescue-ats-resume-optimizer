import { useState, useEffect } from "react";
import { useApp } from "../../context/AppContext";
import { validateApiKey, getApiKeyError } from "../../utils/validators";
import { initGemini } from "../../utils/geminiClient";
import { GlassCard } from "../ui/glass/GlassCard";
import { GlassButton } from "../ui/glass/GlassButton";
import { toast } from "sonner";
import { KeyRound, Eye, EyeOff, Bot, Target, FileText, Download, Star, Shield, Zap, Sparkles, Search, Layout, LineChart, Brain, BadgeCheck, AlignLeft, CheckCircle2 } from "lucide-react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";

const DataStream = ({ className, direction = "right", duration = 2, delay = 0 }) => {
  const isVertical = direction === "down" || direction === "up";
  const animProp = isVertical ? "y" : "x";
  
  let animValues;
  if (direction === "right") animValues = ["-100%", "400%"];
  if (direction === "left") animValues = ["400%", "-100%"];
  if (direction === "down") animValues = ["-100%", "400%"];
  if (direction === "up") animValues = ["400%", "-100%"];

  const sizeClass = isVertical ? "h-1/3 w-full" : "w-1/3 h-full";

  return (
    <div className={`${className} relative overflow-hidden`}>
      <motion.div 
        animate={{ [animProp]: animValues }} 
        transition={{ duration, repeat: Infinity, ease: "linear", delay }} 
        className={`absolute ${sizeClass} bg-cyan-300 blur-[1px] opacity-80 rounded-full`} 
        style={isVertical ? { left: 0 } : { top: 0 }}
      />
    </div>
  );
};

export function Step1_ApiKey() {
  const { apiKey, setApiKey, setStep } = useApp();
  const [showKey, setShowKey] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [localKey, setLocalKey] = useState(apiKey || "");

  const score = useMotionValue(0);
  const roundedScore = useTransform(score, (v) => Math.round(v));
  const progressWidth = useTransform(score, (v) => `${v}%`);
  
  const lift = useTransform(score, [0, 99], [0, 69]);
  const roundedLift = useTransform(lift, (v) => `+${Math.round(v)}%`);

  useEffect(() => {
    const controls = animate(score, 99, { duration: 4, ease: "easeOut", delay: 0.5 });
    return controls.stop;
  }, []);

  // 3D Drag Rotation
  const dragX = useMotionValue(0);
  const dragY = useMotionValue(0);
  const rotateX = useTransform(dragY, [-50, 50], [45, -45]);
  const rotateY = useTransform(dragX, [-50, 50], [-45, 45]);

  const isFormatValid = validateApiKey(localKey);
  const formatError = getApiKeyError(localKey);

  const handleContinue = async () => {
    if (!isFormatValid) {
      toast.error("Please enter a valid Gemini API key");
      return;
    }
    setIsValidating(true);
    try {
      initGemini(localKey);
      setApiKey(localKey);
      toast.success("API key saved!");
      setStep(2);
    } catch (err) {
      toast.error("Failed to initialize API client");
    } finally {
      setIsValidating(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleContinue();
  };

  const stagger = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1, duration: 0.5, type: "spring" }
    })
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] pt-6 pb-12 px-4 xl:px-8 2xl:px-16 max-w-[1600px] 2xl:max-w-[2000px] mx-auto w-full">
      
      {/* 2-Column Hero Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center mb-8">
        
        {/* Left Col: Text & Features */}
        <div className="pr-0 lg:pr-8">
          <motion.div custom={0} initial="hidden" animate="visible" variants={stagger} className="mb-4">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--glass-surface)] border border-[var(--glass-border)] text-[var(--text-secondary)] text-[10px] font-bold tracking-widest uppercase shadow-[var(--glass-shadow)] backdrop-blur-[var(--blur-intensity)]">
              <Bot className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
              POWERED BY 10 SPECIALIZED AI AGENTS
            </span>
          </motion.div>

          <motion.h1 custom={1} initial="hidden" animate="visible" variants={stagger} className="font-display text-[2.8rem] md:text-[3.5rem] leading-[1.1] font-bold text-[var(--text-primary)] mb-4 tracking-tight flex flex-wrap items-center">
            <span className="w-full">Your resume.</span>
            <span className="text-[var(--accent-primary)] flex items-center gap-3">
              Perfected
              <BadgeCheck className="w-10 h-10 md:w-12 md:h-12 text-blue-500 drop-shadow-[0_0_12px_rgba(59,130,246,0.8)] animate-pulse" />
            </span>
          </motion.h1>
          
          <motion.p custom={2} initial="hidden" animate="visible" variants={stagger} className="text-[var(--text-secondary)] text-[15px] mb-8 leading-relaxed max-w-lg">
            Our 10 AI agents analyze, optimize, and supercharge your resume for ATS systems and recruiters.
          </motion.p>

          <motion.div custom={3} initial="hidden" animate="visible" variants={stagger} className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div>
              <div className="text-[var(--accent-primary)] mb-2">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="text-[var(--text-primary)] text-sm font-bold mb-1">Smart. Fast.</h3>
              <p className="text-[var(--text-secondary)] text-[11px] leading-snug">Results in under<br/>30 seconds</p>
            </div>
            
            <div>
              <div className="text-[var(--accent-primary)] mb-2">
                <Shield className="w-5 h-5" />
              </div>
              <h3 className="text-[var(--text-primary)] text-sm font-bold mb-1">Private by design</h3>
              <p className="text-[var(--text-secondary)] text-[11px] leading-snug">100% client-side.<br/>Your data stays with you.</p>
            </div>

            <div>
              <div className="text-[var(--accent-primary)] mb-2">
                <Star className="w-5 h-5" />
              </div>
              <h3 className="text-[var(--text-primary)] text-sm font-bold mb-1">Free forever</h3>
              <p className="text-[var(--text-secondary)] text-[11px] leading-snug">No credit card.<br/>No limits.</p>
            </div>
          </motion.div>
        </div>

        {/* Right Col: Glowing Graphic (Liquid Glass Replica) */}
        <motion.div custom={4} initial="hidden" animate="visible" variants={stagger} className="relative h-[400px] w-full flex items-center justify-center mt-10 lg:mt-0 perspective-1000">
          {/* Background glows removed */}

          {/* Inner Wrapper for Relative Positioning */}
          <motion.div 
            className="relative w-48 h-64 cursor-grab active:cursor-grabbing" 
            drag
            dragConstraints={{ top: 0, left: 0, right: 0, bottom: 0 }}
            dragElastic={0.1}
            style={{ x: dragX, y: dragY, rotateX, rotateY, transformStyle: "preserve-3d", top: "-1rem" }}
          >
            
            {/* Center Glass Card */}
            <GlassCard className="absolute inset-0 flex flex-col p-4 transition-transform duration-500 hover:-translate-y-2 overflow-hidden ring-1 ring-[var(--accent-primary)] z-10 shadow-2xl">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[var(--accent-primary)] to-transparent opacity-50" />
              <p className="text-[var(--text-secondary)] text-[9px] uppercase tracking-wider mb-2">ATS Score</p>
              <div className="flex items-baseline gap-2 mb-4">
                <motion.span className="text-[var(--text-primary)] text-4xl font-bold font-display">{roundedScore}</motion.span>
                <motion.span className="text-emerald-400 text-sm font-semibold">{roundedLift}</motion.span>
              </div>
              
              <div className="w-full h-1.5 bg-black/20 rounded-full mb-6 relative overflow-hidden">
                <motion.div 
                  className="absolute left-0 top-0 h-full bg-[var(--accent-primary)] rounded-full shadow-[0_0_10px_rgba(129,140,248,0.8)]"
                  style={{ width: progressWidth }}
                />
              </div>

              <div className="flex-1 space-y-3">
                <div className="w-full h-2 bg-black/10 rounded-full opacity-50" />
                <div className="w-3/4 h-2 bg-black/10 rounded-full opacity-50" />
                <div className="w-5/6 h-2 bg-black/10 rounded-full opacity-50" />
                <div className="w-1/2 h-2 bg-black/10 rounded-full opacity-50" />
              </div>

              <div className="absolute bottom-4 right-4 w-10 h-10 rounded-full bg-[var(--glass-surface)] border border-[var(--glass-border)] flex items-center justify-center shadow-[var(--glass-shadow)]">
                <Shield className="w-5 h-5 text-[var(--accent-primary)]" />
              </div>
            </GlassCard>

            {/* Left Floating Chips (4) */}
            <motion.div animate={{ y: [0, -6, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0 }} className="absolute right-full top-2 flex items-center gap-2 pr-1 z-0" style={{ transformStyle: "preserve-3d", transform: "translateZ(20px)" }}>
              <motion.div animate={{ boxShadow: ["0 0 0px rgba(99,102,241,0)", "0 0 15px rgba(99,102,241,0.6)", "0 0 0px rgba(99,102,241,0)"] }} transition={{ duration: 3, repeat: Infinity, delay: 0.2 }} className="w-7 h-7 rounded-lg bg-[#151520] border border-white/5 flex items-center justify-center shadow-lg shrink-0">
                <Search className="w-3.5 h-3.5 text-blue-400" />
              </motion.div>
              <div className="text-[9px] text-[var(--text-secondary)] leading-tight font-medium whitespace-nowrap">Keyword<br/>Agent</div>
              <DataStream className="w-10 h-[1px] bg-gradient-to-l from-[var(--accent-primary)] to-transparent opacity-30" direction="right" duration={1.5} delay={0.2} />
            </motion.div>

            <motion.div animate={{ y: [0, 6, 0] }} transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }} className="absolute right-full top-[30%] -translate-y-1/2 flex items-center gap-2 pr-1 z-0" style={{ transformStyle: "preserve-3d", transform: "translateZ(30px)" }}>
              <motion.div animate={{ boxShadow: ["0 0 0px rgba(99,102,241,0)", "0 0 15px rgba(99,102,241,0.6)", "0 0 0px rgba(99,102,241,0)"] }} transition={{ duration: 2.5, repeat: Infinity, delay: 1.5 }} className="w-7 h-7 rounded-lg bg-[#151520] border border-white/5 flex items-center justify-center shadow-lg shrink-0">
                <FileText className="w-3.5 h-3.5 text-white" />
              </motion.div>
              <div className="text-[9px] text-[var(--text-secondary)] leading-tight font-medium whitespace-nowrap">Content<br/>Agent</div>
              <DataStream className="w-14 h-[1px] bg-gradient-to-l from-[var(--accent-primary)] to-transparent opacity-30" direction="right" duration={1.8} delay={0.8} />
            </motion.div>

            <motion.div animate={{ y: [0, -4, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 2 }} className="absolute right-full bottom-[30%] translate-y-1/2 flex items-center gap-2 pr-1 z-0" style={{ transformStyle: "preserve-3d", transform: "translateZ(10px)" }}>
              <motion.div animate={{ boxShadow: ["0 0 0px rgba(99,102,241,0)", "0 0 15px rgba(99,102,241,0.6)", "0 0 0px rgba(99,102,241,0)"] }} transition={{ duration: 3.2, repeat: Infinity, delay: 0.5 }} className="w-7 h-7 rounded-lg bg-[#151520] border border-white/5 flex items-center justify-center shadow-lg shrink-0">
                <Layout className="w-3.5 h-3.5 text-orange-400" />
              </motion.div>
              <div className="text-[9px] text-[var(--text-secondary)] leading-tight font-medium whitespace-nowrap">Structure<br/>Agent</div>
              <DataStream className="w-16 h-[1px] bg-gradient-to-l from-[var(--accent-primary)] to-transparent opacity-30" direction="right" duration={2} delay={1.2} />
            </motion.div>

            <motion.div animate={{ y: [0, 5, 0] }} transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut", delay: 1.5 }} className="absolute right-full bottom-2 flex items-center gap-2 pr-1 z-0" style={{ transformStyle: "preserve-3d", transform: "translateZ(25px)" }}>
              <motion.div animate={{ boxShadow: ["0 0 0px rgba(99,102,241,0)", "0 0 15px rgba(99,102,241,0.6)", "0 0 0px rgba(99,102,241,0)"] }} transition={{ duration: 2.8, repeat: Infinity, delay: 1.1 }} className="w-7 h-7 rounded-lg bg-[#151520] border border-white/5 flex items-center justify-center shadow-lg shrink-0">
                <AlignLeft className="w-3.5 h-3.5 text-teal-400" />
              </motion.div>
              <div className="text-[9px] text-[var(--text-secondary)] leading-tight font-medium whitespace-nowrap">Formatting<br/>Agent</div>
              <DataStream className="w-12 h-[1px] bg-gradient-to-l from-[var(--accent-primary)] to-transparent opacity-30" direction="right" duration={1.6} delay={0.4} />
            </motion.div>

            {/* Right Floating Chips (4) */}
            <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }} className="absolute left-full top-4 flex items-center gap-2 pl-1 z-0" style={{ transformStyle: "preserve-3d", transform: "translateZ(15px)" }}>
              <DataStream className="w-12 h-[1px] bg-gradient-to-r from-[var(--accent-primary)] to-transparent opacity-30" direction="left" duration={1.7} delay={0.6} />
              <div className="text-[9px] text-[var(--text-secondary)] leading-tight font-medium text-right whitespace-nowrap">ATS<br/>Scanner</div>
              <motion.div animate={{ boxShadow: ["0 0 0px rgba(99,102,241,0)", "0 0 15px rgba(99,102,241,0.6)", "0 0 0px rgba(99,102,241,0)"] }} transition={{ duration: 3.1, repeat: Infinity, delay: 0.3 }} className="w-7 h-7 rounded-lg bg-[#151520] border border-white/5 flex items-center justify-center shadow-lg shrink-0">
                <Shield className="w-3.5 h-3.5 text-blue-300" />
              </motion.div>
            </motion.div>

            <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 7.5, repeat: Infinity, ease: "easeInOut", delay: 1.5 }} className="absolute left-full top-[35%] -translate-y-1/2 flex items-center gap-2 pl-1 z-0" style={{ transformStyle: "preserve-3d", transform: "translateZ(35px)" }}>
              <DataStream className="w-16 h-[1px] bg-gradient-to-r from-[var(--accent-primary)] to-transparent opacity-30" direction="left" duration={2.1} delay={1.4} />
              <div className="text-[9px] text-[var(--text-secondary)] leading-tight font-medium text-right whitespace-nowrap">Relevance<br/>Agent</div>
              <motion.div animate={{ boxShadow: ["0 0 0px rgba(99,102,241,0)", "0 0 15px rgba(99,102,241,0.6)", "0 0 0px rgba(99,102,241,0)"] }} transition={{ duration: 2.7, repeat: Infinity, delay: 1.8 }} className="w-7 h-7 rounded-lg bg-[#151520] border border-white/5 flex items-center justify-center shadow-lg shrink-0">
                <Target className="w-3.5 h-3.5 text-red-400" />
              </motion.div>
            </motion.div>

            <motion.div animate={{ y: [0, 6, 0] }} transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 2.5 }} className="absolute left-full bottom-[35%] translate-y-1/2 flex items-center gap-2 pl-1 z-0" style={{ transformStyle: "preserve-3d", transform: "translateZ(5px)" }}>
              <DataStream className="w-14 h-[1px] bg-gradient-to-r from-[var(--accent-primary)] to-transparent opacity-30" direction="left" duration={1.9} delay={0.7} />
              <div className="text-[9px] text-[var(--text-secondary)] leading-tight font-medium text-right whitespace-nowrap">Impact<br/>Agent</div>
              <motion.div animate={{ boxShadow: ["0 0 0px rgba(99,102,241,0)", "0 0 15px rgba(99,102,241,0.6)", "0 0 0px rgba(99,102,241,0)"] }} transition={{ duration: 3.5, repeat: Infinity, delay: 1.2 }} className="w-7 h-7 rounded-lg bg-[#151520] border border-white/5 flex items-center justify-center shadow-lg shrink-0">
                <LineChart className="w-3.5 h-3.5 text-indigo-300" />
              </motion.div>
            </motion.div>

            <motion.div animate={{ y: [0, -5, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1.2 }} className="absolute left-full bottom-4 flex items-center gap-2 pl-1 z-0" style={{ transformStyle: "preserve-3d", transform: "translateZ(20px)" }}>
              <DataStream className="w-10 h-[1px] bg-gradient-to-r from-[var(--accent-primary)] to-transparent opacity-30" direction="left" duration={1.4} delay={0.9} />
              <div className="text-[9px] text-[var(--text-secondary)] leading-tight font-medium text-right whitespace-nowrap">Grammar<br/>Agent</div>
              <motion.div animate={{ boxShadow: ["0 0 0px rgba(99,102,241,0)", "0 0 15px rgba(99,102,241,0.6)", "0 0 0px rgba(99,102,241,0)"] }} transition={{ duration: 2.6, repeat: Infinity, delay: 0.4 }} className="w-7 h-7 rounded-lg bg-[#151520] border border-white/5 flex items-center justify-center shadow-lg shrink-0">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              </motion.div>
            </motion.div>

            {/* Top Center Floating Chip (1) */}
            <motion.div animate={{ y: [0, -4, 0] }} transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 0.8 }} className="absolute bottom-full left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 z-0 pb-1" style={{ transformStyle: "preserve-3d", transform: "translateZ(15px)" }}>
              <motion.div animate={{ boxShadow: ["0 0 0px rgba(99,102,241,0)", "0 0 15px rgba(99,102,241,0.6)", "0 0 0px rgba(99,102,241,0)"] }} transition={{ duration: 3, repeat: Infinity, delay: 1.6 }} className="px-3 py-1.5 rounded-full bg-[#151520] border border-white/5 flex items-center gap-1.5 shadow-lg">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-[9px] text-[var(--text-secondary)] font-medium tracking-wide whitespace-nowrap">Tone Agent</span>
              </motion.div>
              <DataStream className="w-[1px] h-8 bg-gradient-to-t from-[var(--accent-primary)] to-transparent opacity-30" direction="down" duration={1.5} delay={0.5} />
            </motion.div>

            {/* Bottom Center Floating Chip (1) */}
            <motion.div animate={{ y: [0, -3, 0] }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }} className="absolute top-full left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 z-0 pt-1" style={{ transformStyle: "preserve-3d", transform: "translateZ(15px)" }}>
              <DataStream className="w-[1px] h-8 bg-gradient-to-b from-[var(--accent-primary)] to-transparent opacity-30" direction="up" duration={1.6} delay={1.1} />
              <motion.div animate={{ boxShadow: ["0 0 0px rgba(99,102,241,0)", "0 0 15px rgba(99,102,241,0.6)", "0 0 0px rgba(99,102,241,0)"] }} transition={{ duration: 2.9, repeat: Infinity, delay: 0.8 }} className="px-3 py-1.5 rounded-full bg-[#151520] border border-white/5 flex items-center gap-1.5 shadow-lg">
                <Brain className="w-3.5 h-3.5 text-pink-400" />
                <span className="text-[9px] text-[var(--text-secondary)] font-medium tracking-wide whitespace-nowrap">Semantics Agent</span>
              </motion.div>
            </motion.div>

          </motion.div>

        </motion.div>
      </div>

      {/* Main Split Card (API Key Input) */}
      <motion.div custom={5} initial="hidden" animate="visible" variants={stagger}>
        <GlassCard className="w-full p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12 mb-6 border-[var(--glass-border)]">
          
          {/* Left Col (Input) */}
          <div className="lg:col-span-3">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-16 h-16 rounded-2xl bg-[var(--bg-secondary)] flex items-center justify-center shrink-0 shadow-inner border border-[var(--glass-border)]">
                <KeyRound className="w-8 h-8 text-[var(--accent-primary)]" />
              </div>
              <div className="pt-1">
                <h2 className="text-[20px] font-bold text-[var(--text-primary)] mb-1.5">Connect Your Free Gemini API Key</h2>
                <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
                  ResRescue uses your API key to generate insights locally in your browser. Your key is never stored or shared.
                </p>
              </div>
            </div>

            <div className="mt-8 pl-[5rem]">
              <label className="block text-[13px] font-semibold text-[var(--text-primary)] mb-2">
                Gemini API Key
              </label>
              <div className="relative mb-3">
                <input
                  type={showKey ? "text" : "password"}
                  value={localKey}
                  onChange={(e) => setLocalKey(e.target.value.trim())}
                  onKeyDown={handleKeyDown}
                  placeholder="Paste your Gemini API key here"
                  className="input-field pr-12 font-mono"
                  autoComplete="off"
                  spellCheck={false}
                />
                <button
                  type="button"
                  onClick={() => setShowKey(!showKey)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                >
                  {showKey ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              
              {localKey && !isFormatValid && formatError && (
                <p className="text-red-400 text-xs mb-3 flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5" />
                  {formatError}
                </p>
              )}

              <a href="https://aistudio.google.com" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-[var(--accent-primary)] hover:text-[var(--accent-primary-hover)] text-xs mb-8 transition-colors">
                <KeyRound className="w-3.5 h-3.5" />
                Get your free API key from Google AI Studio
              </a>

              <GlassButton
                onClick={handleContinue}
                disabled={!isFormatValid || isValidating}
                className="w-full mb-4 py-3.5"
              >
                {isValidating ? (
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>Continue <Zap className="w-4 h-4 ml-1" /></>
                )}
              </GlassButton>

              <div className="flex items-center justify-center gap-6 text-[11px] text-[var(--text-secondary)]">
                <span className="flex items-center gap-1"><Shield className="w-3 h-3 text-emerald-500" /> Free to get</span>
                <span className="flex items-center gap-1"><Zap className="w-3 h-3 text-[var(--accent-primary)]" /> Takes 30 sec</span>
                <span className="flex items-center gap-1"><Star className="w-3 h-3 text-emerald-500" /> No credit card</span>
              </div>
            </div>
          </div>

          {/* Right Col (Instructions) */}
          <div className="lg:col-span-2 bg-[var(--bg-secondary)] rounded-xl border border-[var(--glass-border)] p-6 shadow-inner">
            <h3 className="text-[var(--text-primary)] font-semibold text-sm mb-5">How to get your free API key</h3>
            
            <div className="space-y-4 text-[13px] text-[var(--text-secondary)]">
              <div className="flex gap-3">
                <span className="w-5 h-5 rounded-full bg-[var(--accent-primary)] text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">1</span>
                <span>Go to <a href="https://aistudio.google.com" target="_blank" rel="noopener noreferrer" className="text-[var(--accent-primary)] hover:underline">aistudio.google.com</a></span>
              </div>
              <div className="flex gap-3">
                <span className="w-5 h-5 rounded-full bg-[var(--accent-primary)] text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">2</span>
                <span>Sign in with your Google account</span>
              </div>
              <div className="flex gap-3">
                <span className="w-5 h-5 rounded-full bg-[var(--accent-primary)] text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">3</span>
                <span>Click "Get API key" → "Create API key"</span>
              </div>
              <div className="flex gap-3">
                <span className="w-5 h-5 rounded-full bg-[var(--accent-primary)] text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">4</span>
                <span>Copy and paste the key here</span>
              </div>
            </div>

            <div className="mt-8 bg-[var(--glass-surface)] border border-[var(--glass-border)] rounded-lg p-4 flex gap-3 items-start">
              <Star className="w-4 h-4 text-[var(--accent-primary)] shrink-0 mt-0.5" />
              <div>
                <p className="text-[12px] font-semibold text-[var(--accent-primary)]">Free tier includes 1,500 requests/day</p>
                <p className="text-[11px] text-[var(--text-secondary)] mt-1 leading-snug">More than enough to optimize multiple resumes!</p>
              </div>
            </div>
          </div>
        </GlassCard>
      </motion.div>

      {/* Unified Bottom Features Strip */}
      <motion.div custom={6} initial="hidden" animate="visible" variants={stagger}>
        <GlassCard className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-[var(--glass-border)]">
          <div className="p-5 flex items-start gap-4 hover:bg-[var(--glass-surface-hover)] transition-colors">
            <Bot className="w-6 h-6 text-[var(--accent-primary)]" />
            <div>
              <h4 className="text-[var(--text-primary)] text-[13px] font-bold mb-1">10 Specialized<br/>AI Agents</h4>
              <p className="text-[var(--text-secondary)] text-[10px] leading-relaxed">Each agent reviews a<br/>key aspect of your resume</p>
            </div>
          </div>

          <div className="p-5 flex items-start gap-4 hover:bg-[var(--glass-surface-hover)] transition-colors">
            <Target className="w-6 h-6 text-[var(--accent-primary)]" />
            <div>
              <h4 className="text-[var(--text-primary)] text-[13px] font-bold mb-1">ATS Score<br/>Improvement</h4>
              <p className="text-[var(--text-secondary)] text-[10px] leading-relaxed">Avg. improvement<br/>of 20%+</p>
            </div>
          </div>

          <div className="p-5 flex items-start gap-4 hover:bg-[var(--glass-surface-hover)] transition-colors">
            <FileText className="w-6 h-6 text-[var(--accent-primary)]" />
            <div>
              <h4 className="text-[var(--text-primary)] text-[13px] font-bold mb-1">Pro Templates<br/>&nbsp;</h4>
              <p className="text-[var(--text-secondary)] text-[10px] leading-relaxed">5 professional templates<br/>built for ATS success</p>
            </div>
          </div>

          <div className="p-5 flex items-start gap-4 hover:bg-[var(--glass-surface-hover)] transition-colors">
            <Download className="w-6 h-6 text-[var(--accent-primary)]" />
            <div>
              <h4 className="text-[var(--text-primary)] text-[13px] font-bold mb-1">Export Ready<br/>PDF</h4>
              <p className="text-[var(--text-secondary)] text-[10px] leading-relaxed">One-click download<br/>for your applications</p>
            </div>
          </div>
        </GlassCard>
      </motion.div>

    </div>
  );
}
