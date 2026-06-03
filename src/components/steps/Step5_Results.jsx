import { useState, lazy, Suspense, useEffect, useRef } from "react";
import { pdf } from "@react-pdf/renderer";
import { useApp } from "../../context/AppContext";
import { ATSScoreRing } from "../ui/ATSScoreRing";
import { KeywordChips } from "../ui/KeywordChips";
import { BeforeAfterToggle } from "../ui/BeforeAfterToggle";
import { SkillsDiffView } from "../ui/SkillsDiffView";
import { InterviewTips } from "../ui/InterviewTips";
import { downloadResumePDF } from "../../utils/pdfGenerator";
import { generatePlainText, copyToClipboard, downloadTextFile } from "../../utils/textExport";
import { generateDocx } from "../../utils/docxGenerator";
import { TEMPLATES } from "../../utils/constants";
import { getScoreConfig } from "../../utils/constants";
import { GlassCard } from "../ui/glass/GlassCard";
import { GlassButton } from "../ui/glass/GlassButton";
import { FileText, BarChart3, ArrowLeftRight, Mail, Lightbulb, MessageSquare, Target, Download, FileType, Copy, RefreshCw, Sparkles, PlusCircle, Archive, Trash2 } from "lucide-react";
import { toast } from "sonner";

// Lazy load template components and PDFViewer
const TemplateClassic = lazy(() => import("../../templates/TemplateClassic").then(m => ({ default: m.TemplateClassic })));
const TemplateModern = lazy(() => import("../../templates/TemplateModern").then(m => ({ default: m.TemplateModern })));
const TemplateExecutive = lazy(() => import("../../templates/TemplateExecutive").then(m => ({ default: m.TemplateExecutive })));
const TemplateTech = lazy(() => import("../../templates/TemplateTech").then(m => ({ default: m.TemplateTech })));
const TemplateCreative = lazy(() => import("../../templates/TemplateCreative").then(m => ({ default: m.TemplateCreative })));

const TEMPLATE_COMPONENTS = {
  classic: TemplateClassic,
  modern: TemplateModern,
  executive: TemplateExecutive,
  tech: TemplateTech,
  creative: TemplateCreative,
};

// Maps templateId -> dynamic import function (returns the real component, not a lazy wrapper)
const TEMPLATE_IMPORTERS = {
  classic:   () => import("../../templates/TemplateClassic").then(m => m.TemplateClassic),
  modern:    () => import("../../templates/TemplateModern").then(m => m.TemplateModern),
  executive: () => import("../../templates/TemplateExecutive").then(m => m.TemplateExecutive),
  tech:      () => import("../../templates/TemplateTech").then(m => m.TemplateTech),
  creative:  () => import("../../templates/TemplateCreative").then(m => m.TemplateCreative),
};

// Live PDF preview — resolves real component then generates blob outside React render
function PDFLivePreview({ resumeData, templateId }) {
  const [blobUrl, setBlobUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [previewError, setPreviewError] = useState(null);
  const prevUrlRef = useRef(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setPreviewError(null);

    const generate = async () => {
      try {
        // Resolve the REAL component (not a lazy wrapper)
        const importer = TEMPLATE_IMPORTERS[templateId] || TEMPLATE_IMPORTERS.classic;
        const RealComponent = await importer();

        if (cancelled) return;

        // Now pdf() can render it correctly
        const element = <RealComponent resumeData={resumeData} />;
        const blob = await pdf(element).toBlob();

        if (cancelled) return;
        const url = URL.createObjectURL(blob);
        if (prevUrlRef.current) URL.revokeObjectURL(prevUrlRef.current);
        prevUrlRef.current = url;
        setBlobUrl(url);
      } catch (err) {
        if (!cancelled) {
          console.error("[Preview] PDF render error:", err?.message || err);
          setPreviewError(err?.message || String(err));
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    generate();
    return () => { cancelled = true; };
  }, [resumeData, templateId]);

  useEffect(() => {
    return () => { if (prevUrlRef.current) URL.revokeObjectURL(prevUrlRef.current); };
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-3 text-gray-500">
        <div className="spinner" style={{ borderColor: "#6366f1", borderTopColor: "transparent" }} />
        <span className="text-sm">Rendering PDF preview...</span>
      </div>
    );
  }
  if (previewError || !blobUrl) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-2 text-gray-400 px-4 text-center">
        <span className="text-2xl">⚠️</span>
        <span className="text-sm">Preview failed — use Download PDF button</span>
        {previewError && <span className="text-xs text-red-400 mt-1 max-w-xs">{previewError}</span>}
      </div>
    );
  }
  return (
    <iframe
      src={blobUrl}
      title="Resume PDF Preview"
      width="100%"
      height="100%"
      style={{ border: "none", display: "block" }}
    />
  );
}

function ScoreBar({ label, score, color }) {
  return (
    <div className="mb-3">
      <div className="flex justify-between items-center mb-1">
        <span className="text-xs text-text-secondary">{label}</span>
        <span className="font-mono text-xs font-semibold" style={{ color }}>{score}/100</span>
      </div>
      <div className="progress-bar">
        <div
          className="progress-bar-fill transition-all duration-1000"
          style={{ width: `${score}%`, background: color }}
        />
      </div>
    </div>
  );
}

function ResumeTab({ result, selectedTemplate, onDownloadPDF, onCopyText, isDownloading, handleDownloadDOCX, isDownloadingDocx }) {
  const finalResume = result?.finalResume || result?.assembledResume;
  const atsScore = result?.atsScore;
  const scoreConfig = getScoreConfig(atsScore?.overall_score || 0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
      {/* PDF Preview - passes templateId so PDFLivePreview can do a real dynamic import */}
      <div className="lg:col-span-3">
        <GlassCard className="overflow-hidden">
          <div className="p-3 border-b border-[var(--glass-border)] flex items-center justify-between">
            <span className="text-sm font-medium text-text-primary">Resume Preview</span>
            <span className="badge badge-accent text-[10px]">{TEMPLATES.find(t => t.id === selectedTemplate)?.name}</span>
          </div>
          <div className="bg-[#f0f0f0]" style={{ height: "842px" }}>
            {finalResume ? (
              <PDFLivePreview resumeData={finalResume} templateId={selectedTemplate} />
            ) : (
              <p className="text-gray-400 text-sm flex items-center justify-center h-full">No resume data available</p>
            )}
          </div>
        </GlassCard>
      </div>

      {/* Right panel */}
      <div className="lg:col-span-2 space-y-4">
        {/* ATS Score */}
        <GlassCard className="p-5 text-center">
          <p className="section-label mb-3">ATS Score</p>
          <div className="flex justify-center mb-3">
            <ATSScoreRing score={atsScore?.overall_score || 0} size={120} strokeWidth={10} />
          </div>
          <p className="text-sm font-semibold" style={{ color: scoreConfig.color }}>
            {scoreConfig.label}
          </p>
          {atsScore?.estimated_ranking && (
            <p className="text-xs text-text-secondary mt-1">{atsScore.estimated_ranking}</p>
          )}
          {atsScore?.ats_pass_likelihood && (
            <div className="mt-2">
              <span className={`badge text-[10px] ${
                atsScore.ats_pass_likelihood === "high" ? "badge-success" :
                atsScore.ats_pass_likelihood === "medium" ? "badge-warning" : "badge-error"
              }`}>
                ATS Pass: {atsScore.ats_pass_likelihood}
              </span>
            </div>
          )}
        </GlassCard>

        {/* Quick stats */}
        {atsScore?.breakdown && (
          <GlassCard className="p-4">
            <p className="section-label mb-3">Score Breakdown</p>
            <ScoreBar label="Keyword Match" score={atsScore.breakdown.keyword_match?.score || 0} color="#6366f1" />
            <ScoreBar label="Skills Alignment" score={atsScore.breakdown.skills_alignment?.score || 0} color="#22d3ee" />
            <ScoreBar label="Experience Relevance" score={atsScore.breakdown.experience_relevance?.score || 0} color="#22c55e" />
            <ScoreBar label="Content Quality" score={atsScore.breakdown.content_quality?.score || 0} color="#f59e0b" />
          </GlassCard>
        )}

        {/* Top improvements */}
        {atsScore?.top_3_improvements && (
          <GlassCard className="p-4">
            <p className="section-label mb-3">Top Improvements to Make</p>
            <ul className="space-y-2">
              {atsScore.top_3_improvements.map((imp, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-text-secondary">
                  <span className="w-4 h-4 rounded-full bg-warning/15 text-warning flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  {imp}
                </li>
              ))}
            </ul>
          </GlassCard>
        )}

        {/* Download buttons */}
        <div className="space-y-2">
          <GlassButton
            variant="primary"
            onClick={onDownloadPDF}
            disabled={isDownloading || !finalResume}
            className="w-full justify-center"
          >
            {isDownloading ? (
              <><span className="spinner" /> Generating PDF...</>
            ) : (
              <>
                <Download className="w-4 h-4" />
                Download PDF
              </>
            )}
          </GlassButton>
          
          <GlassButton
            variant="primary"
            onClick={handleDownloadDOCX}
            disabled={isDownloadingDocx || !finalResume}
            className="w-full justify-center bg-blue-600 hover:bg-blue-700"
          >
            {isDownloadingDocx ? (
              <><span className="spinner" /> Generating DOCX...</>
            ) : (
              <>
                <FileType className="w-4 h-4" />
                Download DOCX
              </>
            )}
          </GlassButton>

          <GlassButton
            variant="secondary"
            onClick={onCopyText}
            disabled={!finalResume}
            className="w-full justify-center"
          >
            <Copy className="w-4 h-4" />
            Copy Plain Text
          </GlassButton>
        </div>
      </div>
    </div>
  );
}

function ATSAnalysisTab({ result }) {
  const atsScore = result?.atsScore;
  const gapAnalysis = result?.gapAnalysis;
  if (!atsScore) return <div className="text-center py-8 text-text-secondary">ATS analysis not available</div>;

  const matched = atsScore.breakdown?.keyword_match?.matched_keywords || [];
  const missing = atsScore.breakdown?.keyword_match?.missing_keywords || [];
  const initialScore = gapAnalysis?.initial_match_score || 0;
  const optimizedScore = atsScore.overall_score || 0;

  return (
    <div className="space-y-6">
      {/* Score comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <GlassCard className="p-5 text-center">
          <p className="section-label mb-3">Original Score</p>
          <ATSScoreRing score={initialScore} size={100} animated={false} />
          <p className="text-xs text-[var(--text-secondary)] mt-2">Before optimization</p>
        </GlassCard>
        <GlassCard className="p-5 border-[var(--accent-primary)]/20 bg-[var(--accent-primary)]/5 text-center">
          <p className="section-label mb-3 text-[var(--accent-primary)]">Optimized Score</p>
          <ATSScoreRing score={optimizedScore} size={100} />
          <p className="text-xs text-[var(--text-secondary)] mt-2">After optimization</p>
        </GlassCard>
      </div>

      {/* Improvement */}
      {optimizedScore > initialScore && (
        <GlassCard className="p-4 border-emerald-500/20 bg-emerald-500/5">
          <div className="flex items-center gap-3">
            <Sparkles className="w-8 h-8 text-emerald-500" />
            <div>
              <p className="font-semibold text-emerald-500">+{optimizedScore - initialScore} point improvement</p>
              <p className="text-xs text-[var(--text-secondary)]">Your resume is now significantly stronger for this role</p>
            </div>
          </div>
        </GlassCard>
      )}

      {/* Breakdown scores */}
      {atsScore.breakdown && (
        <GlassCard className="p-5">
          <p className="section-label mb-4">Detailed Breakdown</p>
          <ScoreBar label="Keyword Match" score={atsScore.breakdown.keyword_match?.score || 0} color="#6366f1" />
          <ScoreBar label="Skills Alignment" score={atsScore.breakdown.skills_alignment?.score || 0} color="#22d3ee" />
          <ScoreBar label="Experience Relevance" score={atsScore.breakdown.experience_relevance?.score || 0} color="#22c55e" />
          <ScoreBar label="Formatting Compliance" score={atsScore.breakdown.formatting_compliance?.score || 0} color="#f59e0b" />
          <ScoreBar label="Content Quality" score={atsScore.breakdown.content_quality?.score || 0} color="#a78bfa" />

          {atsScore.verdict && (
            <div className="mt-4 p-3 rounded-lg bg-[var(--bg-secondary)] border border-[var(--glass-border)]">
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed italic">{atsScore.verdict}</p>
            </div>
          )}
        </GlassCard>
      )}

      {/* Keyword chips */}
      <GlassCard className="p-5">
        <p className="section-label mb-4">Keyword Analysis</p>
        <KeywordChips matched={matched} missing={missing} />
      </GlassCard>
    </div>
  );
}

function BeforeAfterTab({ result }) {
  const parsedResume = result?.parsedResume;
  const finalResume = result?.finalResume || result?.assembledResume;
  const gapAnalysis = result?.gapAnalysis;

  // Compute original skills list
  const originalSkills = parsedResume?.skills
    ? [...(parsedResume.skills.technical || []), ...(parsedResume.skills.frameworks || []), ...(parsedResume.skills.tools || [])]
    : [];

  const finalSkillsList = Array.isArray(finalResume?.skills)
    ? finalResume.skills.flatMap(c => c.skills || [])
    : finalResume?.skills?.categories?.flatMap(c => c.skills || []) || [];

  const added = gapAnalysis?.skills_to_add || [];
  const removed = gapAnalysis?.skills_to_remove || [];
  const kept = finalSkillsList.filter(s => !added.includes(s) && originalSkills.includes(s));

  return (
    <div className="space-y-6">
      {/* Summary comparison */}
      <GlassCard className="p-5">
        <p className="section-label mb-4">Professional Summary</p>
        <BeforeAfterToggle
          before={parsedResume?.summary}
          after={finalResume?.summary}
          label="Summary"
        />
      </GlassCard>

      {/* Skills diff */}
      <GlassCard className="p-5">
        <p className="section-label mb-4">Skills Changes</p>
        <SkillsDiffView added={added} removed={removed} kept={kept} />
      </GlassCard>

      {/* Experience bullets comparison */}
      {parsedResume?.experience?.length > 0 && (
        <GlassCard className="p-5">
          <p className="section-label mb-4">Experience Rewrites</p>
          <div className="space-y-6">
            {parsedResume.experience.slice(0, 2).map((orig, i) => {
              const optimized = finalResume?.experience?.[i];
              return (
                <div key={i} className="border border-white/6 rounded-xl p-4">
                  <p className="font-semibold text-sm text-text-primary mb-3">
                    {orig.title} @ {orig.company}
                  </p>
                  <BeforeAfterToggle
                    before={(orig.bullets || []).join("\n• ")}
                    after={(optimized?.bullets || []).join("\n• ")}
                    label="Experience"
                  />
                </div>
              );
            })}
          </div>
        </GlassCard>
      )}
    </div>
  );
}

function CoverLetterTab({ result, onDownloadCoverLetter }) {
  const [editing, setEditing] = useState(false);
  const [letterText, setLetterText] = useState(result?.coverLetter || "");
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await copyToClipboard(letterText);
      setCopied(true);
      toast.success("Copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy");
    }
  };

  const handleDownload = () => {
    downloadTextFile(letterText, "Cover_Letter.txt");
    toast.success("Cover letter downloaded!");
  };

  if (!result?.coverLetter) {
    return (
      <div className="text-center py-12 text-text-secondary">
        <p className="text-4xl mb-3">📝</p>
        <p>Cover letter not generated. This may happen if some agents failed.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="section-label">Cover Letter</p>
        <div className="flex gap-2">
          <GlassButton
            variant="secondary"
            onClick={() => setEditing((v) => !v)}
            className="py-1.5 px-3 text-xs"
          >
            {editing ? "Done Editing" : "Edit"}
          </GlassButton>
          <GlassButton
            variant="secondary"
            onClick={handleCopy}
            className="py-1.5 px-3 text-xs"
          >
            {copied ? "✓ Copied!" : "Copy"}
          </GlassButton>
          <GlassButton
            variant="primary"
            onClick={handleDownload}
            className="py-1.5 px-3 text-xs"
          >
            Download
          </GlassButton>
        </div>
      </div>

      {editing ? (
        <textarea
          value={letterText}
          onChange={(e) => setLetterText(e.target.value)}
          className="textarea-field min-h-[400px] font-body text-sm"
        />
      ) : (
        <GlassCard className="p-6">
          <div className="prose prose-sm text-[var(--text-secondary)] leading-relaxed whitespace-pre-wrap text-sm">
            {letterText}
          </div>
        </GlassCard>
      )}
    </div>
  );
}

function ProjectSuggestionsTab({ result }) {
  const projectSuggestions = result?.projectSuggestions;

  if (!projectSuggestions || !projectSuggestions.suggestedProjects) {
    return (
      <div className="text-center py-12 text-text-secondary">
        <p className="text-4xl mb-3">💡</p>
        <p>Project suggestions not generated. This may happen if some agents failed.</p>
      </div>
    );
  }

  const handleCopyProjects = async () => {
    try {
      const textToCopy = projectSuggestions.suggestedProjects.map(p => 
        `Project: ${p.title}\nDescription: ${p.description}\nTech Stack: ${(p.technologies || []).join(", ")}\nWhy it works: ${p.reasoning}\n`
      ).join("\n---\n\n");
      await navigator.clipboard.writeText(textToCopy);
      toast.success("Project ideas copied to clipboard!");
    } catch (err) {
      toast.error("Failed to copy projects");
    }
  };

  return (
    <div className="space-y-6">
      <GlassCard className="p-6">
        <div className="flex justify-between items-center mb-4">
          <p className="section-label mb-0">Suggested Side Projects to Boost Your Resume</p>
          <button onClick={handleCopyProjects} className="btn-secondary py-1.5 px-3 text-xs">
            <Copy className="w-3.5 h-3.5 mr-1.5" /> Copy Ideas
          </button>
        </div>
        <div className="grid gap-4">
          {projectSuggestions.suggestedProjects.map((project, i) => (
            <div key={i} className="p-5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--glass-border)] hover:border-[var(--accent-primary)]/50 transition-colors">
              <h4 className="font-semibold text-lg text-[var(--text-primary)] mb-2">{project.title}</h4>
              <p className="text-sm text-[var(--text-secondary)] mb-3 leading-relaxed">{project.description}</p>
              
              <div className="mb-4 flex flex-wrap gap-1.5">
                {(project.technologies || []).map((tech, j) => (
                  <span key={j} className="badge badge-accent text-[10px]">{tech}</span>
                ))}
              </div>
              
              <div className="bg-[var(--glass-surface)] p-3 rounded-lg border border-[var(--glass-border)]">
                <p className="text-xs text-[var(--text-secondary)]"><span className="font-semibold text-[var(--accent-primary)]">Why this works: </span>{project.reasoning}</p>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}

function RecruiterMessageTab({ result }) {
  const projectSuggestions = result?.projectSuggestions;

  if (!projectSuggestions || !projectSuggestions.recruiterMessage) {
    return (
      <div className="text-center py-12 text-text-secondary">
        <p className="text-4xl mb-3">🤝</p>
        <p>Recruiter message not generated. This may happen if some agents failed.</p>
      </div>
    );
  }

  const handleCopyMessage = async () => {
    try {
      const textToCopy = `Subject: ${projectSuggestions.recruiterMessage?.subjectLine}\n\n${projectSuggestions.recruiterMessage?.body}`;
      await navigator.clipboard.writeText(textToCopy);
      toast.success("Message copied to clipboard!");
    } catch {
      toast.error("Failed to copy");
    }
  };

  return (
    <div className="space-y-6">
      <GlassCard className="p-6 relative">
        <div className="flex justify-between items-center mb-4">
          <p className="section-label">Recruiter Outreach Message</p>
          <GlassButton variant="secondary" onClick={handleCopyMessage} className="py-1.5 px-3 text-xs">
            <Copy className="w-3.5 h-3.5" />
            Copy Message
          </GlassButton>
        </div>
        <div className="p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--glass-border)]">
          <p className="font-medium text-[var(--text-primary)] mb-2 text-sm">Subject: {projectSuggestions.recruiterMessage?.subjectLine}</p>
          <div className="w-full h-[1px] bg-[var(--glass-border)] mb-3" />
          <p className="text-sm text-[var(--text-secondary)] whitespace-pre-wrap leading-relaxed">
            {projectSuggestions.recruiterMessage?.body}
          </p>
        </div>
      </GlassCard>
    </div>
  );
}

const TABS = [
  { id: "resume", label: "Optimized Resume", icon: <FileText className="w-5 h-5"/> },
  { id: "analysis", label: "ATS Analysis", icon: <BarChart3 className="w-5 h-5"/> },
  { id: "before-after", label: "Before / After", icon: <ArrowLeftRight className="w-5 h-5"/> },
  { id: "cover-letter", label: "Cover Letter", icon: <Mail className="w-5 h-5"/> },
  { id: "recruiter-msg", label: "Recruiter Message", icon: <MessageSquare className="w-5 h-5"/> },
  { id: "project-suggestions", label: "Project Suggestions", icon: <Lightbulb className="w-5 h-5"/> },
  { id: "interview", label: "Interview Prep", icon: <Target className="w-5 h-5"/> },
  { id: "history", label: "Previous Resumes", icon: <Archive className="w-5 h-5"/> },
];

function ResumeHistoryTab() {
  const { history, deleteHistoryItem, deleteMultipleHistory, clearAllHistory } = useApp();
  const [selectedIds, setSelectedIds] = useState([]);
  const [isDownloadingId, setIsDownloadingId] = useState(null);

  const handleSelect = (id) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };
  
  const handleSelectAll = () => {
    if (selectedIds.length === history.length) setSelectedIds([]);
    else setSelectedIds(history.map(item => item.id));
  };

  const handleDeleteSelected = () => {
    if (window.confirm(`Delete ${selectedIds.length} previous resumes?`)) {
      deleteMultipleHistory(selectedIds);
      setSelectedIds([]);
      toast.success("Deleted selected resumes");
    }
  };

  const handleDeleteAll = () => {
    if (window.confirm("Are you sure you want to delete ALL previous resumes? This cannot be undone.")) {
      clearAllHistory();
      setSelectedIds([]);
      toast.success("All resumes deleted");
    }
  };

  const handleDeleteItem = (id) => {
    deleteHistoryItem(id);
    setSelectedIds(prev => prev.filter(i => i !== id));
    toast.success("Resume deleted");
  };

  const handleDownloadPDF = async (item) => {
    if (!item.finalResume) { toast.error("No resume data available"); return; }
    setIsDownloadingId(item.id + "_pdf");
    try {
      const importer = TEMPLATE_IMPORTERS[item.selectedTemplate] || TEMPLATE_IMPORTERS.modern;
      const TemplateComponent = await importer();
      await downloadResumePDF(item.finalResume, TemplateComponent);
      toast.success("PDF downloaded!");
    } catch (err) {
      console.error(err);
      toast.error(`Failed to generate PDF: ${err?.message || "Unknown error"}`);
    } finally {
      setIsDownloadingId(null);
    }
  };

  const handleDownloadDOCX = async (item) => {
    if (!item.finalResume) { toast.error("No resume data available"); return; }
    setIsDownloadingId(item.id + "_docx");
    try {
      const blob = await generateDocx(item.finalResume);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const nameStr = item.finalResume?.contact?.name ? item.finalResume.contact.name.replace(/[^a-zA-Z0-9]/g, "_") : "Candidate";
      const titleStr = item.jobTitle ? item.jobTitle.replace(/[^a-zA-Z0-9]/g, "_") : "Role";
      const fileName = `${nameStr}_${titleStr}_Resume`.replace(/_+/g, "_") + ".docx";
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success("DOCX downloaded!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to generate DOCX");
    } finally {
      setIsDownloadingId(null);
    }
  };

  if (!history || history.length === 0) {
    return (
      <div className="text-center py-12 text-text-secondary">
        <Archive className="w-12 h-12 mx-auto mb-4 opacity-50" />
        <p>No previous resumes yet. Generate a resume and it will appear here!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <p className="section-label">Your Previous Resumes ({history.length})</p>
        <div className="flex gap-2">
          {selectedIds.length > 0 && (
            <GlassButton variant="secondary" onClick={handleDeleteSelected} className="py-1.5 px-3 text-xs text-red-400 hover:text-red-300 border-red-500/20 hover:border-red-500/40">
              <Trash2 className="w-3.5 h-3.5" /> Delete Selected ({selectedIds.length})
            </GlassButton>
          )}
          <GlassButton variant="secondary" onClick={handleDeleteAll} className="py-1.5 px-3 text-xs text-red-400 hover:text-red-300 border-red-500/20 hover:border-red-500/40">
            <Trash2 className="w-3.5 h-3.5" /> Delete All
          </GlassButton>
        </div>
      </div>

      <GlassCard className="overflow-x-auto">
        <table className="w-full text-left text-sm text-[var(--text-secondary)]">
          <thead className="bg-[#151520] border-b border-[var(--glass-border)] text-xs uppercase">
            <tr>
              <th className="p-4 w-12 text-center">
                <input type="checkbox" className="rounded border-white/20 bg-black/20 text-[var(--accent-primary)] focus:ring-[var(--accent-primary)]" 
                  checked={selectedIds.length === history.length && history.length > 0} 
                  onChange={handleSelectAll} 
                />
              </th>
              <th className="p-4 font-semibold text-[var(--text-primary)]">Company</th>
              <th className="p-4 font-semibold text-[var(--text-primary)]">Job Title</th>
              <th className="p-4 font-semibold text-[var(--text-primary)]">Date</th>
              <th className="p-4 font-semibold text-[var(--text-primary)] text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--glass-border)]">
            {history.map((item) => (
              <tr key={item.id} className="hover:bg-white/5 transition-colors group">
                <td className="p-4 text-center">
                  <input type="checkbox" className="rounded border-white/20 bg-black/20 text-[var(--accent-primary)] focus:ring-[var(--accent-primary)]" 
                    checked={selectedIds.includes(item.id)} 
                    onChange={() => handleSelect(item.id)} 
                  />
                </td>
                <td className="p-4 font-medium text-[var(--text-primary)]">{item.companyName}</td>
                <td className="p-4">{item.jobTitle}</td>
                <td className="p-4 text-xs whitespace-nowrap">{new Date(item.timestamp).toLocaleDateString()}</td>
                <td className="p-4 text-right flex justify-end gap-2 items-center">
                  <GlassButton 
                    variant="secondary" 
                    onClick={() => handleDownloadPDF(item)} 
                    disabled={isDownloadingId === item.id + "_pdf"}
                    className="py-1 px-2 text-[11px] h-7"
                  >
                    {isDownloadingId === item.id + "_pdf" ? <span className="spinner w-3 h-3" /> : <Download className="w-3 h-3" />} PDF
                  </GlassButton>
                  <GlassButton 
                    variant="secondary" 
                    onClick={() => handleDownloadDOCX(item)} 
                    disabled={isDownloadingId === item.id + "_docx"}
                    className="py-1 px-2 text-[11px] h-7"
                  >
                    {isDownloadingId === item.id + "_docx" ? <span className="spinner w-3 h-3" /> : <FileType className="w-3 h-3" />} DOCX
                  </GlassButton>
                  <button onClick={() => handleDeleteItem(item.id)} className="p-1.5 text-red-400 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-400/10 rounded-md">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </GlassCard>
    </div>
  );
}

export function Step5_Results() {
  const { pipelineResult, selectedTemplate, optimizationMode, setStep, reset, resetForNewJD } = useApp();
  const [activeTab, setActiveTab] = useState("resume");
  const [isDownloading, setIsDownloading] = useState(false);
  const [isDownloadingDocx, setIsDownloadingDocx] = useState(false);

  const result = pipelineResult;
  const finalResume = result?.finalResume || result?.assembledResume;

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

  const handleDownloadPDF = async () => {
    if (!finalResume) { toast.error("No resume data available"); return; }
    setIsDownloading(true);
    try {
      const TemplateComponent = await getTemplateForPDF();
      await downloadResumePDF(finalResume, TemplateComponent);
      toast.success("PDF downloaded successfully!");
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed to generate PDF");
    } finally {
      setIsDownloading(false);
    }
  };

  const handleDownloadDOCX = async () => {
    if (!finalResume) { toast.error("No resume data available"); return; }
    setIsDownloadingDocx(true);
    try {
      const blob = await generateDocx(finalResume);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const nameStr = finalResume?.contact?.name
        ? finalResume.contact.name.replace(/[^a-zA-Z0-9]/g, "_")
        : "Candidate";
      const titleStr = finalResume?.contact?.jobTitle
        ? finalResume.contact.jobTitle.replace(/[^a-zA-Z0-9]/g, "_")
        : (result?.jdAnalysis?.job_title ? result.jdAnalysis.job_title.replace(/[^a-zA-Z0-9]/g, "_") : "Role");
      const fileName = `${nameStr}_${titleStr}_Resume`.replace(/_+/g, "_") + ".docx";
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success("DOCX downloaded successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to generate DOCX");
    } finally {
      setIsDownloadingDocx(false);
    }
  };

  const handleCopyText = async () => {
    if (!finalResume) { toast.error("No resume data available"); return; }
    try {
      const text = generatePlainText(finalResume);
      await copyToClipboard(text);
      toast.success("Resume copied as plain text!");
    } catch {
      toast.error("Failed to copy to clipboard");
    }
  };

  const handleStartOver = () => {
    reset();
    setStep(1);
  };

  if (!result) {
    return (
      <div className="text-center py-20">
        <p className="text-text-secondary">No results available. Please run the optimization first.</p>
        <button onClick={() => setStep(1)} className="btn-primary mt-4">Start Over</button>
      </div>
    );
  }

  return (
    <div className="max-w-[1600px] 2xl:max-w-[2000px] mx-auto px-4 xl:px-8 2xl:px-16 py-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 pb-6 border-b border-[#1e1e2e]">
        <div>
          <h2 className="font-display text-[2rem] font-bold text-white tracking-tight">
            {optimizationMode === "pro" 
              ? "Your Optimized Pro Resume 🎉" 
              : "Your Optimized God-Like Resume ⚡"}
          </h2>
          <p className="text-[#94a3b8] text-[15px] mt-1.5">
            {result?.jdAnalysis?.job_title && (
              <>Tailored for: <span className="text-[#a5b4fc] font-semibold">{result.jdAnalysis.job_title}</span></>
            )}
          </p>
        </div>
        <div className="flex gap-3">
          <GlassButton
            variant="secondary"
            onClick={resetForNewJD}
            className="border-[var(--accent-primary)]/30 text-indigo-400"
          >
            <RefreshCw className="w-4 h-4" />
            Tailor to New Job
          </GlassButton>
          <GlassButton
            variant="secondary"
            onClick={handleStartOver}
          >
            <PlusCircle className="w-4 h-4" />
            Start Over
          </GlassButton>
        </div>
      </div>

      {/* Main Layout Grid */}
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        
        {/* Left Sidebar Navigation */}
        <div className="w-full lg:w-[260px] flex-shrink-0 lg:sticky lg:top-8 z-20">
          <GlassCard className="p-3 flex flex-row lg:flex-col gap-1.5 overflow-x-auto lg:overflow-visible pb-2 lg:pb-3 hide-scrollbar">
            {TABS.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  id={`tab-${tab.id}`}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-xl text-[14.5px] font-medium transition-all duration-300 text-left whitespace-nowrap lg:whitespace-normal group outline-none
                    ${isActive 
                      ? "bg-[var(--accent-primary)]/10 text-[var(--text-primary)] shadow-[inset_0_1px_0_var(--glass-highlight)] border border-[var(--glass-border)] ring-1 ring-[var(--accent-primary)]/50" 
                      : "text-[var(--text-secondary)] hover:bg-[var(--glass-surface)] hover:text-[var(--text-primary)] border border-transparent"
                    }
                  `}
                >
                  <span className={`transition-transform duration-300 ${isActive ? "text-[var(--accent-primary)] scale-110 drop-shadow-md" : "group-hover:scale-110 group-hover:text-[var(--text-primary)]"}`}>
                    {tab.icon}
                  </span>
                  {tab.label}
                </button>
              );
            })}
          </GlassCard>
        </div>

        {/* Right Tab Content */}
        <div className="flex-1 w-full min-w-0 animate-fade-in relative z-10">
          <GlassCard className="p-6 md:p-8">
            {activeTab === "resume" && (
              <ResumeTab
                result={result}
                selectedTemplate={selectedTemplate}
                onDownloadPDF={handleDownloadPDF}
                onCopyText={handleCopyText}
                isDownloading={isDownloading}
                handleDownloadDOCX={handleDownloadDOCX}
                isDownloadingDocx={isDownloadingDocx}
              />
            )}
            {activeTab === "analysis" && <ATSAnalysisTab result={result} />}
            {activeTab === "before-after" && <BeforeAfterTab result={result} />}
            {activeTab === "cover-letter" && <CoverLetterTab result={result} />}
            {activeTab === "project-suggestions" && <ProjectSuggestionsTab result={result} />}
            {activeTab === "recruiter-msg" && <RecruiterMessageTab result={result} />}
            {activeTab === "interview" && (
              <div className="max-w-3xl">
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-white mb-2">Interview Preparation Tips</h3>
                  <p className="text-[#94a3b8] text-[15px]">
                    Personalized based on your profile and {result?.jdAnalysis?.job_title || "target role"}
                  </p>
                </div>
                <InterviewTips tips={result?.interviewTips || []} />
              </div>
            )}
            {activeTab === "history" && <ResumeHistoryTab />}
          </GlassCard>
        </div>

      </div>
    </div>
  );
}
