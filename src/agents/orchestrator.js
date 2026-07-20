import { analyzeJD } from "./jdAnalyzer";
import { parseResume } from "./resumeParser";
import { scrapeGithub } from "../utils/githubScraper";
import { analyzeGaps } from "./gapAnalyzer";
import { writeSummary } from "./summaryWriter";
import { rewriteExperience } from "./experienceRewriter";
import { rewriteProjects } from "./projectsRewriter";
import { curateSkills } from "./skillsCurator";
import { fitToPage } from "./pageFitterAgent";
import { scoreResume } from "./atsScorer";
import { runQA } from "./qaAgent";
import { generateCoverLetter } from "./coverLetterAgent";
import { generateInterviewTips } from "./interviewTipsAgent";
import { generateProjectSuggestions } from "./projectSuggestions";

export async function runOptimizationPipeline(
  jobDescription,
  resumeText,
  optimizationMode,
  onProgress // callback: (agentId, agentName, status, progress%) => void
) {
  const result = {
    jdAnalysis: null,
    parsedResume: null,
    githubData: null,
    gapAnalysis: null,
    optimizedSummary: null,
    optimizedExperience: null,
    curatedSkills: null,
    assembledResume: null,
    atsScore: null,
    finalResume: null,
    coverLetter: null,
    interviewTips: null,
    errors: [],
  };

  const steps = [
    {
      id: "jdAnalyzer",
      name: "JD Analyzer",
      fn: () => analyzeJD(jobDescription),
      key: "jdAnalysis",
      progress: 10,
    },
    {
      id: "resumeParser",
      name: "Resume Parser",
      fn: () => parseResume(resumeText),
      key: "parsedResume",
      progress: 20,
    },
    {
      id: "githubScraper",
      name: "GitHub Scraper",
      fn: async () => {
        const match = resumeText.match(/github\.com\/([a-zA-Z0-9-]+)/i);
        if (!match) return null;
        return await scrapeGithub(match[0]);
      },
      key: "githubData",
      progress: 25,
    },

    {
      id: "projectSuggestions",
      name: "Project Suggestions",
      fn: () => generateProjectSuggestions(result.parsedResume, result.jdAnalysis),
      key: "projectSuggestions",
      progress: 82,
      requires: ["parsedResume", "jdAnalysis"],
    },
    {
      id: "gapAnalyzer",
      name: "Gap Analyzer",
      fn: () => analyzeGaps(result.parsedResume, result.jdAnalysis, result.githubData),
      key: "gapAnalysis",
      progress: 35,
      requires: ["parsedResume", "jdAnalysis"],
    },
    {
      id: "summaryWriter",
      name: "Summary Writer",
      fn: () => writeSummary(result.parsedResume, result.jdAnalysis, result.gapAnalysis, optimizationMode),
      key: "optimizedSummary",
      progress: 50,
      requires: ["parsedResume", "jdAnalysis", "gapAnalysis"],
    },
    {
      id: "experienceRewriter",
      name: "Experience Rewriter",
      fn: () => rewriteExperience(result.parsedResume, result.jdAnalysis, result.gapAnalysis, optimizationMode),
      key: "optimizedExperience",
      progress: 65,
      requires: ["parsedResume", "jdAnalysis", "gapAnalysis"],
    },
    {
      id: "projectsRewriter",
      name: "Projects Rewriter",
      fn: () => rewriteProjects(result.parsedResume, result.jdAnalysis, result.gapAnalysis),
      key: "optimizedProjects",
      progress: 70,
      requires: ["parsedResume", "jdAnalysis", "gapAnalysis"],
    },
    {
      id: "skillsCurator",
      name: "Skills Curator",
      fn: () => curateSkills(result.parsedResume, result.jdAnalysis, result.gapAnalysis),
      key: "curatedSkills",
      progress: 75,
      requires: ["parsedResume", "jdAnalysis", "gapAnalysis"],
    },
    {
      id: "assembler",
      name: "Assembling Resume",
      fn: () => Promise.resolve(assembleResume(result, optimizationMode)),
      key: "assembledResume",
      progress: 80,
    },
    {
      id: "pageFitter",
      name: "Page Fitter",
      fn: () => fitToPage(result.assembledResume, result.jdAnalysis, result.githubData),
      key: "assembledResume", // Overwrite assembledResume if condensed
      progress: 85,
      requires: ["assembledResume", "jdAnalysis"],
    },
    {
      id: "atsScorer",
      name: "ATS Scorer",
      fn: () => scoreResume(result.assembledResume, result.jdAnalysis, result.gapAnalysis),
      key: "atsScore",
      progress: 88,
      requires: ["assembledResume", "jdAnalysis", "gapAnalysis"],
    },
    {
      id: "qaAgent",
      name: "QA Review",
      fn: () => runQA(result.assembledResume, result.parsedResume, result.jdAnalysis),
      key: "finalResume",
      progress: 95,
      requires: ["assembledResume", "parsedResume", "jdAnalysis"],
    },
    {
      id: "coverLetter",
      name: "Cover Letter Agent",
      fn: () => generateCoverLetter(result.finalResume || result.assembledResume, result.jdAnalysis),
      key: "coverLetter",
      progress: 97,
      requires: ["assembledResume", "jdAnalysis"],
    },
    {
      id: "interviewTips",
      name: "Interview Coach",
      fn: () => generateInterviewTips(result.finalResume || result.assembledResume, result.jdAnalysis, result.gapAnalysis),
      key: "interviewTips",
      progress: 99,
      requires: ["assembledResume", "jdAnalysis", "gapAnalysis"],
    },
  ];

  for (const step of steps) {
    // Check if required dependencies failed
    const missingDeps = (step.requires || []).filter((dep) => result[dep] === null);
    if (missingDeps.length > 0) {
      onProgress(step.id, step.name, "skipped", step.progress);
      result.errors.push({
        agent: step.name,
        error: `Skipped because required data is missing: ${missingDeps.join(", ")}`,
      });
      continue;
    }

    onProgress(step.id, step.name, "processing", step.progress - 5);
    try {
      // Throttle: Wait 3.5s before each agent to respect the 15 RPM Free Tier limit
      // Skip wait for the first step
      if (step !== steps[0]) {
        await new Promise((r) => setTimeout(r, 3500));
      }
      
      const output = await step.fn();
      result[step.key] = output;
      onProgress(step.id, step.name, "complete", step.progress);
    } catch (err) {
      result.errors.push({ agent: step.name, error: err.message });
      onProgress(step.id, step.name, "error", step.progress);
      console.error(`Agent ${step.name} failed:`, err);
      // Non-fatal: continue pipeline with partial data
    }
  }

  // Ensure finalResume has something
  if (!result.finalResume && result.assembledResume) {
    result.finalResume = result.assembledResume;
  }

  return result;
}

function assembleResume(result, optimizationMode) {
  const { parsedResume, optimizedSummary, optimizedExperience, optimizedProjects, curatedSkills } = result;

  if (!parsedResume) {
    throw new Error("No parsed resume data available to assemble");
  }

  // Build experience array with optimized bullets and titles merged in
  const experienceMap = {};
  const titleMap = {};
  (optimizedExperience || []).forEach((e) => {
    if (e.exp_id) {
      if (e.optimized_bullets) experienceMap[e.exp_id] = e.optimized_bullets;
      if (e.optimized_title) titleMap[e.exp_id] = e.optimized_title;
    }
  });

  const targetTitle = result?.jdAnalysis?.job_title;

  // OVERWRITE: Dynamically set the global header job title to match the JD exactly
  if (targetTitle) {
    parsedResume.contact.jobTitle = targetTitle;
  }

  const optimizedExperienceArray = (parsedResume.experience || []).map((exp, i) => {
    const expId = exp.id || `exp_${i + 1}`;
    let expTitle = exp.title || "";
    
    // Apply AI-optimized title if available and in god mode
    if (optimizationMode === "god" && titleMap[expId]) {
      expTitle = titleMap[expId];
    }
    
    return {
      ...exp,
      title: expTitle,
      bullets: experienceMap[expId] || exp.bullets || [],
    };
  });

  // Normalize skills format
  let skills = [];
  if (curatedSkills?.categories) {
    skills = JSON.parse(JSON.stringify(curatedSkills.categories));
  } else if (parsedResume.skills) {
    skills = JSON.parse(JSON.stringify(parsedResume.skills));
  }

  // --- AGGRESSIVE KEYWORD INJECTION & CORE COMPETENCIES ---
  const optimizedSummaryStr = (optimizedSummary || parsedResume.summary || "").trim();
  const projects = optimizedProjects && optimizedProjects.length > 0 ? optimizedProjects : parsedResume.projects;
  
  if (result.jdAnalysis && result.jdAnalysis.ats_keywords) {
    // 1. Create a powerful Core Competencies block with the top JD keywords
    const topKeywords = result.jdAnalysis.ats_keywords
      .filter(k => k.weight === "critical" || k.weight === "high")
      .map(k => k.term);
    
    // 2. Identify any remaining missing keywords
    const resumeTextStr = JSON.stringify({
      summary: optimizedSummaryStr,
      experience: optimizedExperienceArray,
      projects: projects,
      skills: skills
    }).toLowerCase();
    
    const missing = [];
    result.jdAnalysis.ats_keywords.forEach(kw => {
      if (kw && kw.term && !resumeTextStr.includes(kw.term.toLowerCase())) {
        missing.push(kw.term);
      }
    });

    const allToInject = [...new Set([...topKeywords, ...missing])];

    if (allToInject.length > 0) {
      if (optimizationMode === "god") {
        if (Array.isArray(skills)) {
          if (skills.length > 0 && typeof skills[0] === 'object' && skills[0].name) {
            skills = skills.filter(cat => !cat.name.match(/core competenc/i));
            skills.unshift({ name: "Core Competencies", skills: allToInject });
          } else if (skills.length > 0 && typeof skills[0] === 'string') {
            skills = [...new Set([...allToInject, ...skills])];
          } else {
            skills.unshift({ name: "Core Competencies", skills: allToInject });
          }
        } else {
           skills = [{ name: "Core Competencies", skills: allToInject }];
        }
      } else {
        // Pro mode: just gently insert into a keyword section or at the end
        if (Array.isArray(skills)) {
          if (skills.length > 0 && typeof skills[0] === 'object' && skills[0].name) {
            let cat = skills.find(c => c.name.match(/keyword|core|competenc|other|additional|technolog/i));
            if (!cat) cat = skills[skills.length - 1]; // fallback to the last category
            if (cat && Array.isArray(cat.skills)) {
              cat.skills.push(...missing);
              cat.skills = [...new Set(cat.skills)]; // deduplicate
            }
          } else if (skills.length > 0 && typeof skills[0] === 'string') {
            skills.push(...missing);
            skills = [...new Set(skills)];
          } else {
            skills.push({ name: "Targeted Keywords", skills: missing });
          }
        } else {
           skills = [{ name: "Targeted Keywords", skills: missing }];
        }
      }
    }
  }
  // --- END AGGRESSIVE INJECTION ---

  return {
    ...parsedResume,
    summary: optimizedSummaryStr,
    experience: optimizedExperienceArray,
    projects: projects,
    skills,
  };
}
