import { callGemini } from "../utils/geminiClient";

export async function rewriteExperience(parsedResume, jdAnalysis, gapAnalysis, optimizationMode = "god") {
  const experienceToRewrite = (parsedResume.experience || []).slice(0, 4).map(exp => {
    let tenureYears = 1; // Default
    try {
      const start = new Date(exp.start_date || new Date());
      const end = exp.end_date && exp.end_date.toLowerCase() !== "present" ? new Date(exp.end_date) : new Date();
      if (!isNaN(start.getTime()) && !isNaN(end.getTime())) {
        tenureYears = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 365);
      }
    } catch (e) {}

    let requiredBullets = 3;
    if (tenureYears > 2) requiredBullets = 5;
    else if (tenureYears > 1) requiredBullets = 4;

    return {
      ...exp,
      tenure_years: parseFloat(tenureYears.toFixed(1)),
      required_bullet_count: requiredBullets
    };
  });

  const allKeywords = (jdAnalysis.ats_keywords || []).map((k) => k.term).join(", ");
  const powerPhrases = (jdAnalysis.power_phrases || []).join(", ");

  const prompt = `You are an elite resume writer specializing in ATS optimization and compelling achievement-based content.
Rewrite the work experience bullet points to be perfectly tailored for this job application.

TARGET JOB: ${jdAnalysis.job_title} at a ${jdAnalysis.company_type} company
JD KEYWORDS: ${allKeywords}
POWER PHRASES FROM JD: ${powerPhrases}

EXPERIENCE REWRITING STRATEGY:
${JSON.stringify(gapAnalysis.experience_strategy || [], null, 2)}

CURRENT EXPERIENCE TO REWRITE:
${JSON.stringify(experienceToRewrite, null, 2)}

REWRITING RULES:
1. THE ATOS FORMULA (STRICT): Every single bullet MUST follow this formula: Action (strong verb) + Tool/Platform + Outcome + Scale/Number. No exceptions.
2. BANNED VERBS: You MUST NEVER use weak verbs: "Assisted", "Supported", "Helped", "Contributed", "Worked on", "Participated in". Every bullet must open with a strong ownership verb.
3. MANDATORY METRICS: Every bullet MUST have at least one number or scale reference (e.g. "5+ systems", "reduced by 36%"). Do not invent metrics—reframe existing ones or use qualitative scale.
4. KEYWORD TIERING: Plant keywords deliberately. The most recent/relevant role gets the most Tier-1 JD keywords. Earlier roles get Tier-2 keywords.
${optimizationMode === "god" 
  ? '5. MAXIMUM AGGRESSIVE KEYWORD INJECTION: You MUST use the EXACT string match for keywords (e.g., "React.js").'
  : '5. EXACT-MATCH KEYWORD INJECTION: You MUST inject the exact, verbatim ATS keywords. DO NOT paraphrase.'}
6. CONCISENESS: Each bullet MUST be a single line ONLY. Max 2 lines per bullet. If it needs 3 lines, split it into two bullets or cut it.
7. CUT FILLER WORDS: completely remove generic phrases like "ensuring", "leveraging", "within the codebase", "responsible for".
8. CRITICAL KEYWORD RETENTION: NEVER delete an existing technical keyword from the original bullets.
9. DYNAMIC BULLET COUNT BASED ON TENURE: You MUST write the exact number of bullets specified in 'required_bullet_count' for each job.
10. FABRICATE KEYWORDS IN EXPERIENCE ONLY: You may fabricate the usage of required JD tools/keywords into the work experience bullets if needed to pass ATS, but NEVER fabricate them into a Certification or Degree title.

Return ONLY a valid JSON array with this structure:
[
  {
    "exp_id": "exp_1",
    "optimized_bullets": [
      "Strong action verb + specific action + quantified result with relevant keyword"
    ],
    "keywords_added": ["which JD keywords were naturally integrated"],
    "change_summary": "brief note on what was improved"
  }
]

Rewrite ALL ${experienceToRewrite.length} experience entries.`;

  return await callGemini(prompt, { jsonMode: true, temperature: 0.4, maxTokens: 4096 });
}
