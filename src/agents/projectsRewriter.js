import { callGemini } from "../utils/geminiClient";

export async function rewriteProjects(parsedResume, jdAnalysis, gapAnalysis) {
  // Try to use the Strategizer's curated list of projects (from Resume + GitHub)
  let projectsToRewrite = gapAnalysis?.project_strategy;
  
  // Fallback to original resume projects if Strategizer didn't provide any
  if (!projectsToRewrite || projectsToRewrite.length === 0) {
    projectsToRewrite = parsedResume.projects || [];
  }
  
  if (projectsToRewrite.length === 0) {
    return [];
  }

  const allKeywords = (jdAnalysis.ats_keywords || []).map((k) => k.term).join(", ");

  const prompt = `You are an elite resume writer specializing in ATS optimization.
Rewrite the Projects section of this resume to be highly compelling and perfectly tailored for this job application.

TARGET JOB: ${jdAnalysis.job_title}
JD KEYWORDS TO INJECT: ${allKeywords}

STRATEGIZER PROJECT PLAN:
The AI Strategizer has curated the following projects (sourced from either the original resume or real GitHub repos) and provided specific instructions on how to frame them.

${JSON.stringify(projectsToRewrite, null, 2)}

REWRITING RULES:
1. Execute the "rewrite_focus" strategy flawlessly for each project.
2. EXTREME AGGRESSIVENESS (STRUCTURAL REWRITE): For each bullet, you MUST change at least the leading verb and the framing angle to match the JD's language — not just insert a keyword into the existing sentence. A rewrite that only adds a word to the original sentence structure is a FAILED rewrite. Rebuild the sentence around the same underlying fact, told through the JD's lens.
  - STEP A: Extract the core action taken, the tool/method used, and the measurable outcome from the original bullet. These three facts are FIXED and must not be invented.
  - STEP B: Extract the 5-8 most important action verbs/phrases from the JD (e.g. "build," "ship," "deploy," "operate").
  - STEP C: Rebuild the sentence from scratch. Everything else (verb choice, sentence structure, terminology) is FLEXIBLE. Every rewritten bullet should use at least one JD verb where truthfully applicable.
3. PRESERVE TECHNICAL DETAILS: Do NOT reduce project descriptions or bullets to generic one-line summaries. Preserve all specific technical details, actions, and outcomes from the original bullets. Rewriting means changing framing/verbs, not deleting content.
4. ADD REALISTIC IMPACT METRICS or TECHNICAL DETAILS (e.g., load times, user counts, deployment methods, performance gains). Make them sound realistic based on the technologies used.
5. Integrate the JD ATS keywords NATURALLY into the descriptions where relevant.
6. Keep the technology stack lists clean and comma-separated.
7. Emphasize what the candidate built, how they built it, and the business/technical value it provided.
8. FINAL SET REVIEW: After rewriting all bullets, review them as a set. If more than half still closely resemble the original sentence structure, revise further. Prioritize structural rewrites for bullets tied to skills explicitly named in the JD.

Return ONLY a valid JSON array with this structure:
[
  {
    "name": "Project Name",
    "organisation": "Optional Organisation/Location or Context (e.g., 'University of Liverpool', 'Hackathon 2023')",
    "date": "Optional Date (e.g., '2023' or 'May 2022 - Aug 2022')",
    "description": "Short 1-line overview of the project.",
    "bullets": ["Action + outcome + metric 1", "Action + outcome + metric 2"],
    "technologies": ["React", "Node.js", "etc"]
  }
]`;

  return await callGemini(prompt, { jsonMode: true, temperature: 0.5, maxTokens: 4096 });
}
