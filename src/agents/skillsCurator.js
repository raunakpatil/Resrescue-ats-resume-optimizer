import { callGemini } from "../utils/geminiClient";

export async function curateSkills(parsedResume, jdAnalysis, gapAnalysis) {
  const prompt = `You are a technical recruiter and skills taxonomy expert.
Curate the perfect skills section for this resume targeting this specific role.

TARGET ROLE: ${jdAnalysis.job_title} | ${jdAnalysis.seniority_level} level
REQUIRED SKILLS FROM JD: ${(jdAnalysis.required_skills || []).join(", ")}
PREFERRED SKILLS FROM JD: ${(jdAnalysis.preferred_skills || []).join(", ")}
TECHNICAL SKILLS FROM JD: ${(jdAnalysis.technical_skills || []).join(", ")}

CANDIDATE'S CURRENT SKILLS:
${JSON.stringify(parsedResume.skills, null, 2)}

SKILLS STRATEGY:
- Skills to ADD (Transferable): ${(gapAnalysis.skills_to_add || []).join(", ")}
- HARD GAPS (Candidate lacks completely): ${(gapAnalysis.hard_gaps || []).join(", ")}
- Skills to REMOVE (Generic/Irrelevant): ${(gapAnalysis.skills_to_remove || []).join(", ")}
- Skills to EMPHASIZE: ${(gapAnalysis.skills_to_emphasize || []).join(", ")}

RULES:
1. REBUILD INTO EXACTLY 3 CATEGORIES mirroring the JD's structure: "Technical" (platforms/tools/languages), "Domain" (industry-specific knowledge), and "Functional" (competencies).
2. NEVER CLAIM UNUSED TOOLS: If the candidate has a "HARD GAP" for a specific named tool/technology they haven't used, DO NOT add it to the skills list. You may only align terminology for underlying concepts they already know (e.g. mapping "vector databases" to "RAG" if the JD requires it).
3. REMOVE GENERIC DILUTION: Remove anything not in the JD's universe (e.g., Microsoft Word, generic soft skills). Every skill listed must earn its place.
4. ORDER matters for ATS: Put JD-required skills FIRST within each category.
5. NO MORE THAN 6-8 ITEMS per category to maintain high signal-to-noise ratio.
6. EXACT STRING MATCHING (CRITICAL): You MUST use the EXACT string from the Job Description. If the JD says "Agile Methodologies", DO NOT output "Agile". ATS bots like Jobscan will fail the resume if it is not a 100% literal exact match.

Return ONLY a valid JSON object:
{
  "categories": [
    {
      "name": "Technical",
      "skills": ["skill1", "skill2"]
    },
    {
      "name": "Domain",
      "skills": ["skill1", "skill2"]
    },
    {
      "name": "Functional",
      "skills": ["skill1", "skill2"]
    }
  ],
  "skills_added": ["skills that were added and why"],
  "skills_removed": ["skills removed to declutter"],
  "top_skills_for_headline": ["top 3-5 skills to potentially use in a headline"]
}`;

  return await callGemini(prompt, { jsonMode: true, temperature: 0.2 });
}
