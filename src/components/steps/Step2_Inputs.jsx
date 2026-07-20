import { useState } from "react";
import { useApp } from "../../context/AppContext";
import { validateInputs } from "../../utils/validators";
import { SAMPLE_JD, SAMPLE_RESUME } from "../../utils/sampleData";
import { MAX_INPUT_LENGTH, MIN_JD_LENGTH, MIN_RESUME_LENGTH } from "../../utils/constants";
import { parseFileToText } from "../../utils/fileParser";
import { GlassCard } from "../ui/glass/GlassCard";
import { GlassButton } from "../ui/glass/GlassButton";
import { toast } from "sonner";
import { Briefcase, User, Lightbulb, Shield, Zap, Heart, ArrowLeft, ArrowRight, Loader2, UploadCloud, TestTube, Lock, ExternalLink, Search, Globe, Clock, FileText, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function Step2_Inputs() {
  const { jobDescription, resumeText, setJD, setJobUrl, setResume, setStep } = useApp();
  const [errors, setErrors] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  
  // High-level path
  const [path, setPath] = useState("manual"); // 'manual' | 'jobspy'

  // JobSpy states
  const [searchRole, setSearchRole] = useState("");
  const [searchLocation, setSearchLocation] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [scrapedJobs, setScrapedJobs] = useState([]);
  
  // Advanced Filter states
  const [isRemote, setIsRemote] = useState(false);
  const [easyApply, setEasyApply] = useState(false);
  const [jobType, setJobType] = useState("any");
  const [hoursOld, setHoursOld] = useState("any");
  const [sites, setSites] = useState({ linkedin: true, indeed: true, glassdoor: false, zip_recruiter: false });

  const toggleSite = (site) => setSites(prev => ({ ...prev, [site]: !prev[site] }));

  const handleSearchJobs = async () => {
    if (!searchRole) return;
    setIsSearching(true);
    try {
      toast.info("Scraping job boards...", { id: "scraping" });
      
      const selectedSites = Object.keys(sites).filter(k => sites[k]);
      if (selectedSites.length === 0) selectedSites.push("linkedin", "indeed");

      const config = {
        role: searchRole,
        location: searchLocation,
        is_remote: isRemote,
        easy_apply: easyApply,
        job_type: jobType === "any" ? "" : jobType,
        hours_old: hoursOld === "any" ? "" : hoursOld,
        sites: selectedSites
      };

      const jobs = await window.electronAPI.scrapeJobs(config);
      setScrapedJobs(jobs);
      
      if (jobs.length === 0) {
        toast.error("No jobs found with these filters.", { id: "scraping" });
      } else {
        toast.success(`Found ${jobs.length} jobs!`, { id: "scraping" });
      }
    } catch (err) {
      toast.error(err.message || "Failed to scrape jobs", { id: "scraping" });
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectJob = (job) => {
    if (job.url) setJobUrl(job.url);
    
    if (!job.description || job.description.trim().length < MIN_JD_LENGTH) {
      setJD(job.description || "");
      toast.warning("Job description was hidden. Please click the link to open the job, copy the description, and paste it here manually.", { duration: 6000 });
      if (job.url) window.open(job.url, "_blank", "noopener,noreferrer");
      setPath("manual");
    } else {
      setJD(job.description);
      toast.success("Job selected! Don't forget to upload your resume.");
      setPath("manual");
    }
  };

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
    <div className="max-w-[1600px] 2xl:max-w-[2000px] mx-auto px-4 xl:px-8 2xl:px-16 pt-4 pb-12 w-full flex flex-col min-h-screen">
      
      {/* Dynamic Header */}
      <motion.div custom={0} initial="hidden" animate="visible" variants={stagger} className="flex flex-col items-center mb-8">
        <h2 className="font-display text-[1.5rem] md:text-[2rem] font-bold text-[var(--text-primary)] mb-2 tracking-tight">
          Let's find your perfect match.
        </h2>
        <p className="text-[var(--text-secondary)] text-[14px] text-center max-w-lg mb-6">
          Choose your path below. You can either paste an existing job description, or use our Advanced JobSpy Console to find and scrape jobs instantly.
        </p>

        {/* The Dual Path Fork */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-3xl">
          <div 
            onClick={() => setPath("manual")}
            className={`p-5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col items-center text-center ${path === 'manual' ? 'border-indigo-500 bg-indigo-500/10 shadow-[0_0_30px_-5px_rgba(99,102,241,0.3)]' : 'border-[var(--glass-border)] bg-[var(--bg-secondary)] hover:border-indigo-500/50'}`}
          >
            <div className={`p-3 rounded-full mb-3 ${path === 'manual' ? 'bg-indigo-500 text-white' : 'bg-[var(--bg-primary)] text-[var(--text-secondary)]'}`}>
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-[15px] text-[var(--text-primary)] mb-1">I have a Job Description</h3>
            <p className="text-[12px] text-[var(--text-secondary)]">Paste the text manually</p>
          </div>

          <div 
            onClick={() => setPath("jobspy")}
            className={`p-5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col items-center text-center ${path === 'jobspy' ? 'border-purple-500 bg-purple-500/10 shadow-[0_0_30px_-5px_rgba(168,85,247,0.3)]' : 'border-[var(--glass-border)] bg-[var(--bg-secondary)] hover:border-purple-500/50'}`}
          >
            <div className={`p-3 rounded-full mb-3 ${path === 'jobspy' ? 'bg-purple-500 text-white' : 'bg-[var(--bg-primary)] text-[var(--text-secondary)]'}`}>
              <Globe className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-[15px] text-[var(--text-primary)] mb-1">Find me a Job (JobSpy)</h3>
            <p className="text-[12px] text-[var(--text-secondary)]">Search LinkedIn, Indeed & more</p>
          </div>
        </div>
      </motion.div>

      {/* Main Content Area */}
      <AnimatePresence mode="wait">
        {path === "manual" ? (
          <motion.div 
            key="manual"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 flex-1"
          >
            {/* Left Card: Job Description */}
            <GlassCard className="p-6 lg:p-8 flex flex-col h-full relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[var(--accent-primary)] to-transparent opacity-30" />
              
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="flex items-center gap-2 text-[18px] font-bold text-[var(--text-primary)] mb-1">
                    <Briefcase className="w-5 h-5 text-indigo-400" /> What They Want
                  </h3>
                  <p className="text-[var(--text-secondary)] text-[13px]">
                    Paste the job description.
                  </p>
                </div>
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
              </div>
            </GlassCard>

            {/* Right Card: Resume */}
            <GlassCard className="p-6 lg:p-8 flex flex-col h-full relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-400 to-transparent opacity-30" />
              
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="flex items-center gap-2 text-[18px] font-bold text-[var(--text-primary)] mb-1">
                    <User className="w-5 h-5 text-purple-400" /> Your Resume
                  </h3>
                  <p className="text-[var(--text-secondary)] text-[13px]">
                    Paste or upload your current resume.
                  </p>
                </div>
                <GlassButton variant="secondary" onClick={handleUseSample} className="py-1 text-xs">
                  <TestTube className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
                  Load Sample
                </GlassButton>
              </div>

              <div className="relative flex-1 mt-4">
                <textarea
                  value={resumeText}
                  onChange={(e) => setResume(e.target.value)}
                  placeholder="Paste your resume as plain text here..."
                  className="textarea-field h-[320px] pt-12"
                  spellCheck={false}
                />
                
                <div className="absolute top-3 left-4 right-4 flex justify-between items-center pb-2 border-b border-[var(--glass-border)]">
                  <span className="text-[var(--text-secondary)] text-[11px] font-medium italic">Supports PDF, DOCX, TXT</span>
                  <label className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[var(--bg-secondary)] border border-[var(--glass-border)] text-[var(--text-primary)] text-[11px] font-bold uppercase tracking-wider cursor-pointer hover:bg-[var(--glass-surface-hover)] transition-colors shadow-sm">
                    {isUploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <UploadCloud className="w-3.5 h-3.5" />}
                    {isUploading ? "Extracting..." : "Upload File"}
                    <input 
                      type="file" className="hidden" accept=".pdf,.docx,.txt"
                      onChange={handleFileUpload} disabled={isUploading}
                    />
                  </label>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        ) : (
          <motion.div 
            key="jobspy"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="flex flex-col flex-1 w-full gap-6 mb-8"
          >
            {/* Advanced Search Console */}
            <GlassCard className="p-6 relative overflow-visible border-purple-500/20 bg-gradient-to-b from-purple-500/5 to-transparent">
              <div className="flex flex-col gap-4">
                
                {/* Search Bar Row */}
                <div className="flex gap-3">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-secondary)]" />
                    <input 
                      type="text" placeholder="Role (e.g. Data Scientist, Frontend)" 
                      value={searchRole} onChange={(e) => setSearchRole(e.target.value)}
                      className="w-full pl-9 pr-3 py-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--glass-border)] text-[14px] text-[var(--text-primary)] outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all shadow-inner"
                    />
                  </div>
                  <div className="relative w-1/3">
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-secondary)]" />
                    <input 
                      type="text" placeholder="Location" 
                      value={searchLocation} onChange={(e) => setSearchLocation(e.target.value)}
                      className="w-full pl-9 pr-3 py-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--glass-border)] text-[14px] text-[var(--text-primary)] outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all shadow-inner"
                    />
                  </div>
                  <button 
                    onClick={handleSearchJobs} disabled={isSearching || !searchRole} 
                    className="px-8 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(147,51,234,0.3)]"
                  >
                    {isSearching ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
                    Search
                  </button>
                </div>

                {/* Filter Strip Row */}
                <div className="flex flex-wrap gap-3 items-center">
                  {/* Toggles */}
                  <button 
                    onClick={() => setIsRemote(!isRemote)}
                    className={`px-3 py-1.5 rounded-full text-[12px] font-medium border transition-colors flex items-center gap-1.5 ${isRemote ? 'bg-purple-500/20 border-purple-500/50 text-purple-400' : 'bg-[var(--bg-primary)] border-[var(--glass-border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
                  >
                    <Globe className="w-3.5 h-3.5" /> Remote Only
                  </button>
                  <button 
                    onClick={() => setEasyApply(!easyApply)}
                    className={`px-3 py-1.5 rounded-full text-[12px] font-medium border transition-colors flex items-center gap-1.5 ${easyApply ? 'bg-purple-500/20 border-purple-500/50 text-purple-400' : 'bg-[var(--bg-primary)] border-[var(--glass-border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
                  >
                    <Zap className="w-3.5 h-3.5" /> Easy Apply
                  </button>

                  <div className="w-px h-6 bg-[var(--glass-border)] mx-1" />

                  {/* Dropdowns */}
                  <select 
                    value={hoursOld} onChange={(e) => setHoursOld(e.target.value)}
                    className="px-3 py-1.5 rounded-full text-[12px] font-medium border bg-[var(--bg-primary)] border-[var(--glass-border)] text-[var(--text-primary)] outline-none focus:border-purple-500/50"
                  >
                    <option value="any">Any Time</option>
                    <option value="24">Past 24 Hours</option>
                    <option value="72">Past 3 Days</option>
                    <option value="168">Past 1 Week</option>
                  </select>

                  <select 
                    value={jobType} onChange={(e) => setJobType(e.target.value)}
                    className="px-3 py-1.5 rounded-full text-[12px] font-medium border bg-[var(--bg-primary)] border-[var(--glass-border)] text-[var(--text-primary)] outline-none focus:border-purple-500/50"
                  >
                    <option value="any">Any Job Type</option>
                    <option value="fulltime">Full-Time</option>
                    <option value="parttime">Part-Time</option>
                    <option value="contract">Contract</option>
                    <option value="internship">Internship</option>
                  </select>

                  <div className="w-px h-6 bg-[var(--glass-border)] mx-1" />

                  {/* Platforms */}
                  <div className="flex items-center gap-2 text-[12px]">
                    <span className="text-[var(--text-secondary)] font-medium">Boards:</span>
                    {["linkedin", "indeed", "glassdoor", "zip_recruiter"].map(site => (
                      <label key={site} className="flex items-center gap-1.5 cursor-pointer">
                        <input type="checkbox" checked={sites[site]} onChange={() => toggleSite(site)} className="accent-purple-500" />
                        <span className="text-[var(--text-primary)] capitalize">{site.replace('_', ' ')}</span>
                      </label>
                    ))}
                  </div>

                </div>
              </div>
            </GlassCard>

            {/* Results & Resume Columns */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 h-[400px]">
              
              {/* Left Column: Job Results Grid */}
              <div className="lg:col-span-2 flex flex-col bg-[var(--bg-primary)] rounded-2xl border border-[var(--glass-border)] overflow-hidden">
                <div className="p-4 border-b border-[var(--glass-border)] bg-[var(--bg-secondary)] flex justify-between items-center">
                  <h3 className="font-bold text-[14px] text-[var(--text-primary)]">Search Results</h3>
                  <span className="text-[12px] text-[var(--text-secondary)]">{scrapedJobs.length} jobs found</span>
                </div>
                
                <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                  {scrapedJobs.length === 0 && !isSearching && (
                    <div className="flex flex-col items-center justify-center h-full text-[var(--text-secondary)]">
                      <Search className="w-10 h-10 mb-3 opacity-20" />
                      <p className="text-[14px]">Run a search to see jobs here</p>
                    </div>
                  )}
                  {scrapedJobs.map((job, idx) => (
                    <div 
                      key={idx} 
                      onClick={() => handleSelectJob(job)}
                      className={`p-4 rounded-xl border-2 transition-all cursor-pointer group ${jobDescription === job.description ? "bg-purple-500/10 border-purple-500 shadow-md" : "bg-[var(--bg-secondary)] border-[var(--glass-border)] hover:border-purple-500/30"}`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="text-[15px] font-bold text-[var(--text-primary)]">{job.title}</h4>
                            {jobDescription === job.description && (
                              <CheckCircle2 className="w-4 h-4 text-purple-500" />
                            )}
                          </div>
                          <p className="text-[13px] text-[var(--text-secondary)] mb-2">{job.company} • {job.location}</p>
                          <p className="text-[11px] text-[var(--text-secondary)] line-clamp-2 opacity-80">{job.description}</p>
                        </div>
                        {job.url && (
                          <a 
                            href={job.url} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}
                            className="p-2 rounded-lg bg-[var(--bg-primary)] border border-[var(--glass-border)] text-[var(--text-secondary)] hover:text-purple-400 hover:border-purple-500/50 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                            title="View Job on Platform"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column: Mini Resume Uploader */}
              <div className="flex flex-col bg-[var(--bg-primary)] rounded-2xl border border-[var(--glass-border)] overflow-hidden">
                <div className="p-4 border-b border-[var(--glass-border)] bg-[var(--bg-secondary)]">
                  <h3 className="font-bold text-[14px] text-[var(--text-primary)]">Your Resume</h3>
                </div>
                <div className="p-4 flex-1 flex flex-col relative">
                  <textarea
                    value={resumeText}
                    onChange={(e) => setResume(e.target.value)}
                    placeholder="Paste your resume as plain text here..."
                    className="textarea-field flex-1 h-full pt-14 text-[12px]"
                    spellCheck={false}
                  />
                  <div className="absolute top-6 left-6 right-6">
                    <label className="flex w-full items-center justify-center gap-2 px-3 py-2 rounded-lg bg-indigo-500 hover:bg-indigo-600 text-white text-[12px] font-bold uppercase tracking-wider cursor-pointer transition-colors shadow-lg">
                      {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <UploadCloud className="w-4 h-4" />}
                      {isUploading ? "Extracting..." : "Upload File"}
                      <input type="file" className="hidden" accept=".pdf,.docx,.txt" onChange={handleFileUpload} disabled={isUploading} />
                    </label>
                  </div>
                </div>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Validation errors */}
      <AnimatePresence>
        {errors.length > 0 && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mb-6">
            <GlassCard className="p-4 border-red-500/50 bg-red-500/10 flex items-start gap-3">
              <Shield className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <div className="space-y-1">
                {errors.map((err, i) => <p key={i} className="text-red-500 text-[13px] font-medium">{err}</p>)}
              </div>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Navigation Strip */}
      <motion.div custom={4} initial="hidden" animate="visible" variants={stagger} className="flex justify-between items-center mt-auto pt-6 border-t border-[var(--glass-border)]">
        <GlassButton variant="secondary" onClick={handleBack} className="px-6">
          <ArrowLeft className="w-4 h-4" /> Back
        </GlassButton>
        <GlassButton variant="primary" onClick={handleContinue} className="px-8 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-400 hover:to-purple-400 shadow-[0_0_20px_rgba(99,102,241,0.4)]">
          Optimize Resume <ArrowRight className="w-4 h-4" />
        </GlassButton>
      </motion.div>

    </div>
  );
}
