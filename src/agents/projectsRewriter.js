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
2. Expand the project description into 1-2 punchy lines.
3. ADD REALISTIC IMPACT METRICS or TECHNICAL DETAILS (e.g., load times, user counts, deployment methods, performance gains). Make them sound realistic based on the technologies used.
4. Integrate the JD ATS keywords NATURALLY into the descriptions where relevant.
5. Keep the technology stack lists clean and comma-separated.
6. Emphasize what the candidate built, how they built it, and the business/technical value it provided.

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
