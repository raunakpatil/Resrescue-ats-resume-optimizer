import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useApp } from "../../context/AppContext";
import { useResumeOptimizer } from "../../hooks/useResumeOptimizer";
import { GlassCard } from "../ui/glass/GlassCard";
import { CheckCircle2, Loader2, AlertCircle, Sparkles, Target, Zap, FileText } from "lucide-react";
import { toast } from "sonner";
import { getPDFBlob } from "../../utils/pdfGenerator";
import processingGif from "../../assets/processing.gif";

const WITTY_ACTIONS = [
  "Teaching your resume recruiter dialect...",
  "Sprinkling ATS magic dust...",
  "Deep-diving into your GitHub repos...",
  "Translating corporate jargon into actual skills...",
  "Pixel-perfecting your A4 layout...",
  "Brewing the perfect professional summary...",
  "Convincing the robots you're human...",
  "Drafting your personalized cover letter...",
  "Preparing interview cheat sheets...",
];

const CARD_WITTY_ACTIONS = [
  "Analyzing semantic density...",
  "Re-calibrating action verbs...",
  "Negotiating with the ATS algorithm...",
  "Injecting high-impact keywords...",
  "Polishing bullet points to a mirror shine...",
  "Removing passive voice and generic fluff...",
  "Cross-referencing job requirements...",
  "Enhancing your digital first impression...",
  "Calculating optimal buzzword-to-substance ratio...",
  "Ensuring your resume survives the 6-second scan...",
];

const MOCK_DISCOVERIES = [
  "Found 18 hidden ATS keywords",
  "Added leadership framing",
  "Quantified ambiguous achievements",
  "Optimized formatting structure",
  "Fixed 3 passive voice phrases",
];

// Helper to map agent names to icons
const getAgentIcon = (name) => {
  if (name.includes("Keyword") || name.includes("ATS")) return <Target className="w-5 h-5 text-accent-primary" />;
  if (name.includes("Action") || name.includes("Bullet")) return <Zap className="w-5 h-5 text-amber-500" />;
  if (name.includes("Format") || name.includes("Layout")) return <FileText className="w-5 h-5 text-sky-400" />;
  return <Sparkles className="w-5 h-5 text-indigo-400" />;
};

export function Step4_Processing() {
  const { apiKey, jobDescription, resumeText, optimizationMode, setStep, setResult: setGlobalResult, selectedTemplate, addHistory } = useApp();
  const {
    optimize,
    isProcessing,
    agentStates,
    overallProgress,
    result,
    errors,
    currentAgentId,
  } = useResumeOptimizer();

  const [wittyIndex, setWittyIndex] = useState(0);
  const [cardWittyIndex, setCardWittyIndex] = useState(0);
  const [discoveries, setDiscoveries] = useState([]);

  useEffect(() => {
    if (apiKey && jobDescription && resumeText) {
      optimize(apiKey, jobDescription, resumeText, optimizationMode);
    }
  }, []);

  useEffect(() => {
    if (!isProcessing) return;
    const interval = setInterval(() => {
      setWittyIndex((prev) => (prev + 1) % WITTY_ACTIONS.length);
    }, 3500);
    const cardInterval = setInterval(() => {
      setCardWittyIndex((prev) => (prev + 1) % CARD_WITTY_ACTIONS.length);
    }, 2500);
    return () => {
      clearInterval(interval);
      clearInterval(cardInterval);
    };
  }, [isProcessing]);

  useEffect(() => {
    const numDiscoveries = Math.min(
      MOCK_DISCOVERIES.length,
      Math.floor((overallProgress / 100) * MOCK_DISCOVERIES.length)
    );
    setDiscoveries(MOCK_DISCOVERIES.slice(0, numDiscoveries));
  }, [overallProgress]);

  useEffect(() => {
    if (!isProcessing && result && result.finalResume) {
      setGlobalResult(result);
      addHistory(result);

      if (window.electronAPI && window.electronAPI.savePdfToDisk) {
        const getTemplateForPDF = async () => {
          switch (selectedTemplate) {
            case "classic": return (await import("../../templates/TemplateClassic")).TemplateClassic;
            case "executive": return (await import("../../templates/TemplateExecutive")).TemplateExecutive;
            case "tech": return (await import("../../templates/TemplateTech")).TemplateTech;
            case "creative": return (await import("../../templates/TemplateCreative")).TemplateCreative;
            case "modern":
            default:
              return (await import("../../templates/TemplateModern")).TemplateModern;
          }
        };

        (async () => {
          try {
            const TemplateComponent = await getTemplateForPDF();
            const blob = await getPDFBlob(result.finalResume, TemplateComponent);
            const arrayBuffer = await blob.arrayBuffer();
            const nameStr = result.finalResume?.contact?.name ? result.finalResume.contact.name.replace(/[^a-zA-Z0-9]/g, "_") : "Candidate";
            const titleStr = result.jdAnalysis?.job_title ? result.jdAnalysis.job_title.replace(/[^a-zA-Z0-9]/g, "_") : "Role";
            const companyStr = result.jdAnalysis?.company_name ? result.jdAnalysis.company_name.replace(/[^a-zA-Z0-9]/g, "_") : "Company";
            const fileName = `${nameStr}_${titleStr}_${companyStr}_Resume`.replace(/_+/g, "_") + ".pdf";
            await window.electronAPI.savePdfToDisk(arrayBuffer, fileName);
          } catch (e) {
            console.error("Failed background PDF save:", e);
          }
        })();
      }

      const timer = setTimeout(() => {
        toast.success("Optimization complete! 🎉");
        setStep(5);
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [isProcessing, result]);

  const allDone = !isProcessing && !!result;
  const currentIndex = agentStates.findIndex(a => a.id === currentAgentId);
  const safeCurrentIndex = currentIndex >= 0 ? currentIndex : (allDone ? agentStates.length : 0);
  const completedCount = agentStates.filter((a) => a.status === "complete").length;
  const totalCount = agentStates.length;
  const hasErrors = errors.length > 0;
  const estimatedScoreBoost = Math.min(21, Math.floor((overallProgress / 100) * 21));

  return (
    <div className="max-w-[1600px] 2xl:max-w-[2000px] mx-auto px-4 xl:px-8 2xl:px-16 pt-6 pb-20 w-full relative">
      
      {/* Background glow effects */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-full max-w-3xl h-64 bg-[var(--accent-primary)] rounded-full blur-[120px] opacity-[0.15] pointer-events-none" />

      {/* Header Section */}
      <div className="text-center mb-10 relative z-10 animate-fade-in">
        <h2 className="font-display text-[2rem] md:text-[2.5rem] font-bold text-[var(--text-primary)] mb-6 tracking-tight leading-tight">
          {"We're making your resume harder to ignore.".split("").map((char, index) => (
            <motion.span
              key={index}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.05, delay: index * 0.04 }}
            >
              {char}
            </motion.span>
          ))}
        </h2>

        <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16">
          <motion.div
            initial={{ scale: 0.8, opacity: 0, x: -50 }}
            animate={{ scale: 1, opacity: 1, x: 0 }}
            transition={{ duration: 0.5, type: "spring" }}
            className="relative rounded-3xl overflow-hidden shadow-[0_0_80px_rgba(251,146,60,0.35)] border border-[var(--glass-border)]"
          >
            <img 
              src={processingGif} 
              alt="AI Processing Left" 
              className="w-32 h-24 md:w-48 md:h-36 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-white/5 to-transparent pointer-events-none mix-blend-overlay" />
          </motion.div>

          <div className="flex flex-col items-center">
            <p className="text-[var(--text-secondary)] text-[16px] md:text-[18px] mb-6 max-w-xl mx-auto leading-relaxed">
              Finding juicier keywords, sharper achievements, and<br className="hidden md:block" />fewer reasons to get filtered out.
            </p>
            
            {/* Animated Witty Text */}
            <div className="h-8 flex items-center justify-center">
              <p className="text-[var(--accent-primary)] text-[15px] font-medium animate-pulse">
                {allDone ? "Optimization Complete! 🎉" : WITTY_ACTIONS[wittyIndex]}
              </p>
            </div>
          </div>

          <motion.div
            initial={{ scale: 0.8, opacity: 0, x: 50 }}
            animate={{ scale: 1, opacity: 1, x: 0 }}
            transition={{ duration: 0.5, type: "spring" }}
            className="relative rounded-3xl overflow-hidden shadow-[0_0_80px_rgba(251,146,60,0.35)] border border-[var(--glass-border)]"
          >
            <img 
              src={processingGif} 
              alt="AI Processing Right" 
              className="w-32 h-24 md:w-48 md:h-36 object-cover scale-x-[-1]"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-white/5 to-transparent pointer-events-none mix-blend-overlay" />
          </motion.div>
        </div>
      </div>

      {/* Dual Column Layout */}
      <div className="max-w-7xl 2xl:max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 relative z-10">
        
        {/* Left Column: 3D Card Stack */}
        <div className="lg:col-span-7 h-[400px] relative flex justify-center perspective-[1000px]">
          <AnimatePresence mode="popLayout">
            {agentStates.map((agent, i) => {
              // Calculate relative position to current active agent
              const diff = i - safeCurrentIndex;
              
              // Only render cards that are upcoming, active, or just finished
              if (diff < -1 || diff > 4) return null;
              
              const isDone = diff < 0;
              const isActive = diff === 0;
              const isUpcoming = diff > 0;
              
              // 3D positioning logic
              const scale = isDone ? 0.9 : 1 - (diff * 0.06);
              const yOffset = isDone ? -400 : diff * 45; // Completed cards fly UP
              const zIndex = isDone ? 0 : 50 - diff;
              const opacity = isDone ? 0 : 1 - (diff * 0.2);
              
              return (
                <motion.div
                  key={agent.id}
                  className="absolute top-4 w-[95%]"
                  initial={{ opacity: 0, y: yOffset + 50, scale: scale - 0.1 }}
                  animate={{ opacity, y: yOffset, scale, zIndex }}
                  exit={{ opacity: 0, y: -400, scale: 0.9 }}
                  transition={{ type: "spring", stiffness: 300, damping: 25, mass: 1 }}
                  style={{ transformOrigin: "top center" }}
                >
                  <GlassCard 
                    hoverEffect={false} 
                    className={`p-6 md:p-8 bg-[#0a0a0f] backdrop-blur-none h-[220px] flex flex-col justify-center ${isActive ? 'ring-2 ring-[var(--accent-primary)] shadow-[0_0_40px_rgba(99,102,241,0.2)]' : 'border-t border-[var(--glass-border)]'}`}
                  >
                    <div className="flex items-start gap-4">
                      {/* Icon Status */}
                      <div className="mt-1 relative">
                        {isDone ? (
                          <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center">
                            <CheckCircle2 className="w-5 h-5" />
                          </div>
                        ) : isActive ? (
                          <div className="w-8 h-8 rounded-full bg-[var(--accent-primary)]/20 text-[var(--accent-primary)] flex items-center justify-center relative">
                            <Loader2 className="w-5 h-5 animate-spin relative z-10" />
                            <div className="absolute inset-0 rounded-full border-2 border-[var(--accent-primary)] border-t-transparent animate-spin" />
                          </div>
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-[var(--bg-secondary)] flex items-center justify-center opacity-50">
                            {getAgentIcon(agent.name)}
                          </div>
                        )}
                      </div>
                      
                      {/* Text */}
                      <div className="flex-1 overflow-hidden">
                        <h4 className={`text-[24px] md:text-[28px] font-bold mb-2 transition-colors ${isActive ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)]'}`}>
                          {agent.name}
                        </h4>
                        <div className="relative h-12">
                          <AnimatePresence mode="wait">
                            <motion.p
                              key={isActive ? cardWittyIndex : 'static'}
                              initial={{ opacity: 0, y: 5 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -5 }}
                              transition={{ duration: 0.3 }}
                              className="absolute inset-0 text-[14px] md:text-[15px] text-[var(--text-secondary)] opacity-80 leading-relaxed"
                            >
                              {isActive ? CARD_WITTY_ACTIONS[cardWittyIndex] : agent.description}
                            </motion.p>
                          </AnimatePresence>
                        </div>
                      </div>
                    </div>
                    
                    {/* Active agent animated line */}
                    {isActive && (
                      <div className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-[var(--accent-primary)] to-cyan-400 w-full rounded-b-2xl overflow-hidden">
                        <motion.div 
                          className="h-full w-1/3 bg-white/50"
                          animate={{ x: ["-100%", "300%"] }}
                          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                        />
                      </div>
                    )}
                  </GlassCard>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Right Column: Discoveries & Stats */}
        <div className="lg:col-span-5 flex flex-col gap-6 pt-10">
          
          <GlassCard className="p-6">
             <div className="flex justify-between items-center mb-4">
              <h3 className="flex items-center gap-2 text-[var(--text-primary)] font-bold text-[16px]">
                <Sparkles className="w-5 h-5 text-cyan-400" /> Progress
              </h3>
              <span className="text-cyan-400 font-mono font-bold">{Math.round(overallProgress)}%</span>
            </div>
            
            <div className="h-2 w-full bg-black/20 rounded-full overflow-hidden mb-4">
              <div 
                className="h-full bg-gradient-to-r from-[var(--accent-primary)] to-cyan-400 rounded-full transition-all duration-700 ease-out"
                style={{ width: `${overallProgress}%` }}
              />
            </div>
            <p className="text-[var(--text-secondary)] text-[13px]">
              {completedCount} of {totalCount} specialists finished
            </p>
          </GlassCard>

          <GlassCard className="p-6">
            <h3 className="flex items-center gap-2 text-[var(--text-primary)] font-bold text-[16px] mb-5">
              <Target className="w-5 h-5 text-emerald-400" /> Live Discoveries
            </h3>
            
            <div className="space-y-4">
              {discoveries.map((disc, idx) => (
                <motion.div 
                  key={idx} 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-start gap-3"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <p className="text-[var(--text-primary)] text-[14px] leading-relaxed">{disc}</p>
                </motion.div>
              ))}
              
              {!allDone && discoveries.length < MOCK_DISCOVERIES.length && (
                <div className="flex items-center gap-3 opacity-50">
                  <Loader2 className="w-4 h-4 animate-spin text-[var(--text-secondary)]" />
                  <p className="text-[var(--text-secondary)] text-[14px]">Scanning...</p>
                </div>
              )}
            </div>
          </GlassCard>

          {hasErrors && (
            <GlassCard className="p-6 border-red-500/30 bg-red-500/5">
              <h3 className="text-red-400 font-bold text-[14px] mb-2 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" /> {errors.length} issue{errors.length > 1 ? "s" : ""} encountered
              </h3>
              <ul className="text-[12px] text-red-300 space-y-1 mb-3">
                {errors.map((err, i) => (
                  <li key={i}>{err.agent}: {err.error}</li>
                ))}
              </ul>
              {allDone && (
                <button onClick={() => optimize(apiKey, jobDescription, resumeText, optimizationMode)} className="text-red-400 text-[12px] font-bold underline">
                  Retry Failed Optimizations
                </button>
              )}
            </GlassCard>
          )}

        </div>
      </div>

    </div>
  );
}
