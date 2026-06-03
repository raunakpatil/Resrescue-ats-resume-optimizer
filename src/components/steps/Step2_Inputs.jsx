import { useState } from "react";
import { useApp } from "../../context/AppContext";
import { validateInputs } from "../../utils/validators";
import { SAMPLE_JD, SAMPLE_RESUME } from "../../utils/sampleData";
import { MAX_INPUT_LENGTH, MIN_JD_LENGTH, MIN_RESUME_LENGTH } from "../../utils/constants";
import { parseFileToText } from "../../utils/fileParser";
import { GlassCard } from "../ui/glass/GlassCard";
import { GlassButton } from "../ui/glass/GlassButton";
import { toast } from "sonner";
import { Briefcase, User, Lightbulb, Shield, Zap, Heart, ArrowLeft, ArrowRight, Loader2, UploadCloud, TestTube, Lock } from "lucide-react";
import { motion } from "framer-motion";

export function Step2_Inputs() {
  const { jobDescription, resumeText, setJD, setResume, setStep } = useApp();
  const [errors, setErrors] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

  const handleUseSample = () => {
    setJD(SAMPLE_JD);
    setResume(SAMPLE_RESUME);
    toast.success("Sample data loaded! You can now click Continue.");
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      toast.info("Extracting text...", { id: "uploading" });
      const extractedText = await parseFileToText(file);
      setResume(extractedText);
      toast.success("Text extracted successfully!", { id: "uploading" });
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Failed to extract text from file.", { id: "uploading" });
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  const handleContinue = () => {
    const validationErrors = validateInputs(jobDescription, resumeText);
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      toast.error(validationErrors[0]);
      return;
    }
    setErrors([]);
    setStep(3);
  };

  const handleBack = () => setStep(1);

  const stagger = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1, duration: 0.5, type: "spring" }
    })
  };

  return (
    <div className="max-w-[1600px] 2xl:max-w-[2000px] mx-auto px-4 xl:px-8 2xl:px-16 pt-4 pb-12 w-full">
      
      {/* Header Area Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center mb-6">
        
        {/* Decorative graphic / spacer for Left */}
        <motion.div custom={0} initial="hidden" animate="visible" variants={stagger} className="hidden md:flex justify-center relative">
          <div className="absolute w-48 h-48 bg-[var(--accent-primary)] rounded-full blur-[80px] opacity-20 pointer-events-none" />
          <img 
            src="./graphic-step2.png" 
            alt="AI Resume Optimizer Graphic" 
            className="relative z-10 w-48 lg:w-56 h-auto object-contain animate-float-slow drop-shadow-2xl mix-blend-screen scale-110 opacity-80"
          />
        </motion.div>

        {/* Center Header */}
        <motion.div custom={1} initial="hidden" animate="visible" variants={stagger} className="text-center md:col-span-1 flex flex-col items-center">
          <h2 className="font-display text-[1.5rem] md:text-[1.75rem] font-bold text-[var(--text-primary)] mb-2 tracking-tight">
            Let's see what we're working with.
          </h2>
          <p className="text-[var(--text-secondary)] text-[14px] mb-4 leading-relaxed">
            Paste your job description and resume below.<br/>
            <span className="text-[var(--accent-primary)] font-medium">Our AI agents will handle the rest. 🚀</span>
          </p>
          <GlassButton variant="secondary" onClick={handleUseSample} className="py-1.5 text-xs">
            <TestTube className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
            Load sample data (for testing)
          </GlassButton>
        </motion.div>

        {/* Right Pro Tip */}
        <motion.div custom={2} initial="hidden" animate="visible" variants={stagger} className="hidden md:flex justify-end">
          <GlassCard className="p-3 max-w-xs relative overflow-hidden border-amber-500/30">
            <div className="absolute top-0 left-0 w-1 h-full bg-amber-500 opacity-50" />
            <h4 className="flex items-center gap-1.5 text-amber-500 font-bold text-[12px] mb-1">
              <Lightbulb className="w-3.5 h-3.5" /> Pro tip
            </h4>
            <p className="text-[var(--text-secondary)] text-[11px] leading-relaxed">
              The more details you provide, the better we can optimize.<br/>
              Don't hold back! 😉
            </p>
          </GlassCard>
        </motion.div>
      </div>

      {/* Inputs Grid */}
      <motion.div custom={3} initial="hidden" animate="visible" variants={stagger} className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        
        {/* Left Card: Job Description */}
        <GlassCard className="p-6 lg:p-8 flex flex-col h-full relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[var(--accent-primary)] to-transparent opacity-30" />
          
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="flex items-center gap-2 text-[18px] font-bold text-[var(--text-primary)] mb-1">
                <Briefcase className="w-5 h-5 text-indigo-400" /> What They Want
              </h3>
              <p className="text-[var(--text-secondary)] text-[13px]">
                Paste the job description.<br/>We'll decode the corporate jargon. 😎
              </p>
            </div>
            <span className="px-3 py-1 rounded-full bg-[var(--bg-secondary)] border border-[var(--glass-border)] text-[var(--accent-primary)] text-[10px] font-bold uppercase tracking-wider">
              Job Description
            </span>
          </div>

          <div className="relative flex-1 mt-4">
            <textarea
              value={jobDescription}
              onChange={(e) => setJD(e.target.value)}
              placeholder="Paste the complete job posting here — including all requirements, responsibilities, and qualifications..."
              className="textarea-field h-[320px]"
              spellCheck={false}
            />
            <div className="absolute bottom-4 right-4 text-[10px] font-mono text-[var(--text-secondary)] bg-[var(--bg-primary)] px-2 py-1 rounded">
              {jobDescription.length.toLocaleString()} / {MAX_INPUT_LENGTH.toLocaleString()}
            </div>
            {jobDescription.length > 0 && jobDescription.length < MIN_JD_LENGTH && (
              <div className="absolute bottom-4 left-4 text-[11px] text-amber-500 flex items-center gap-1 bg-[var(--bg-primary)] px-2 py-0.5 rounded border border-amber-500/20">
                ⚠️ Minimum {MIN_JD_LENGTH} chars required
              </div>
            )}
          </div>
        </GlassCard>

        {/* Right Card: Resume */}
        <GlassCard className="p-6 lg:p-8 flex flex-col h-full relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-400 to-transparent opacity-30" />
          
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="flex items-center gap-2 text-[18px] font-bold text-[var(--text-primary)] mb-1">
                <User className="w-5 h-5 text-purple-400" /> What You've Got
              </h3>
              <p className="text-[var(--text-secondary)] text-[13px]">
                Paste your resume.<br/>We'll make it ATS-friendly and recruiter-approved. ✨
              </p>
            </div>
            <span className="px-3 py-1 rounded-full bg-[var(--bg-secondary)] border border-[var(--glass-border)] text-purple-400 text-[10px] font-bold uppercase tracking-wider">
              Your Resume
            </span>
          </div>

          <div className="relative flex-1 mt-4">
            <textarea
              value={resumeText}
              onChange={(e) => setResume(e.target.value)}
              placeholder="Paste your resume as plain text here. Don't worry about formatting — just copy all the text content..."
              className="textarea-field h-[320px] pt-12"
              spellCheck={false}
            />
            
            {/* Upload Button overlayed inside the textarea top right */}
            <div className="absolute top-3 left-4 right-4 flex justify-between items-center pb-2 border-b border-[var(--glass-border)]">
              <span className="text-[var(--text-secondary)] text-[11px] font-medium italic">Supports PDF, DOCX, TXT</span>
              <label className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[var(--bg-secondary)] border border-[var(--glass-border)] text-[var(--text-primary)] text-[11px] font-bold uppercase tracking-wider cursor-pointer hover:bg-[var(--glass-surface-hover)] transition-colors shadow-sm">
                {isUploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <UploadCloud className="w-3.5 h-3.5" />}
                {isUploading ? "Extracting..." : "Upload File"}
                <input 
                  type="file" 
                  className="hidden" 
                  accept=".pdf,.docx,.txt"
                  onChange={handleFileUpload}
                  disabled={isUploading}
                />
              </label>
            </div>

            <div className="absolute bottom-4 right-4 text-[10px] font-mono text-[var(--text-secondary)] bg-[var(--bg-primary)] px-2 py-1 rounded">
              {resumeText.length.toLocaleString()} / {MAX_INPUT_LENGTH.toLocaleString()}
            </div>
            {resumeText.length > 0 && resumeText.length < MIN_RESUME_LENGTH && (
              <div className="absolute bottom-4 left-4 text-[11px] text-amber-500 flex items-center gap-1 bg-[var(--bg-primary)] px-2 py-0.5 rounded border border-amber-500/20">
                ⚠️ Minimum {MIN_RESUME_LENGTH} chars required
              </div>
            )}
          </div>
        </GlassCard>

      </motion.div>

      {/* Validation errors */}
      <AnimatePresence>
        {errors.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6"
          >
            <GlassCard className="p-4 border-red-500/50 bg-red-500/10 flex items-start gap-3">
              <Shield className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <div className="space-y-1">
                {errors.map((err, i) => (
                  <p key={i} className="text-red-500 text-[13px] font-medium">{err}</p>
                ))}
              </div>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Navigation Strip */}
      <motion.div custom={4} initial="hidden" animate="visible" variants={stagger} className="flex flex-col lg:flex-row justify-between items-center gap-6 mt-4">
        
        <GlassButton variant="secondary" onClick={handleBack} className="w-full lg:w-auto">
          <ArrowLeft className="w-4 h-4" />
          Back
        </GlassButton>

        <div className="flex flex-wrap justify-center gap-6 lg:gap-12">
          <div className="flex items-center gap-2 mt-4 px-4 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <Lock className="w-4 h-4" />
            <div className="flex-1">
              <p className="text-[12px] font-medium leading-tight">100% Secure & Private</p>
              <p className="text-[var(--text-secondary)] text-[11px]">Your data never leaves your computer</p>
            </div>
          </div>
          
          <div className="hidden sm:block w-px h-10 bg-[var(--glass-border)]" />
          
          <div className="flex items-center gap-3">
            <Zap className="w-6 h-6 text-amber-400" />
            <div>
              <h4 className="text-[var(--text-primary)] text-[13px] font-bold">Super Fast</h4>
              <p className="text-[var(--text-secondary)] text-[11px]">AI agents start working in seconds</p>
            </div>
          </div>

          <div className="hidden sm:block w-px h-10 bg-[var(--glass-border)]" />
          
          <div className="flex items-center gap-3">
            <Heart className="w-6 h-6 text-rose-400" />
            <div>
              <h4 className="text-[var(--text-primary)] text-[13px] font-bold">Made for You</h4>
              <p className="text-[var(--text-secondary)] text-[11px]">Better matches. More interviews.</p>
            </div>
          </div>
        </div>

        <GlassButton 
          variant="primary" 
          onClick={handleContinue} 
          className="w-full lg:w-auto"
        >
          Continue to Templates
          <ArrowRight className="w-4 h-4" />
        </GlassButton>

      </motion.div>

    </div>
  );
}

// Add AnimatePresence to imports
import { AnimatePresence } from "framer-motion";
