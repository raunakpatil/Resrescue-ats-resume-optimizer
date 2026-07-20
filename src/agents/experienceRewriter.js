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
4. KEYWORD TIERING & TERMINOLOGY: Plant keywords deliberately. Match the JD's exact terminology where the user has real experience with the underlying concept (e.g. if they used 'vector databases' and JD says 'RAG'). NEVER claim a named tool/technology the user hasn't explicitly used.
5. EXTREME AGGRESSIVENESS (STRUCTURAL REWRITE): For each bullet, you MUST change at least the leading verb and the framing angle to match the JD's language — not just insert a keyword into the existing sentence. A rewrite that only adds a word to the original sentence structure is a FAILED rewrite. Rebuild the sentence around the same underlying fact, told through the JD's lens.
  - STEP A: Extract the core action taken, the tool/method used, and the measurable outcome from the original bullet. These three facts are FIXED and must not be invented.
  - STEP B: Extract the 5-8 most important action verbs/phrases from the JD (e.g. "build," "ship," "deploy," "operate").
  - STEP C: Rebuild the sentence from scratch. Everything else (verb choice, sentence structure, terminology) is FLEXIBLE. Every rewritten bullet should use at least one JD verb where truthfully applicable.
${optimizationMode === "god" 
  ? '  - GOD MODE: MAXIMUM AGGRESSIVE KEYWORD INJECTION: You MUST use the EXACT string match for keywords.'
  : '  - STANDARD MODE: EXACT-MATCH KEYWORD INJECTION: You MUST inject the exact, verbatim ATS keywords.'}
6. CONCISENESS: Each bullet MUST be a single line ONLY. Max 2 lines per bullet. If it needs 3 lines, split it into two bullets or cut it.
7. CUT FILLER WORDS: completely remove generic phrases like "ensuring", "leveraging", "within the codebase", "responsible for".
8. CRITICAL KEYWORD RETENTION: NEVER delete an existing technical keyword from the original bullets.
9. DYNAMIC BULLET COUNT & REORDERING: You MUST write the exact number of bullets specified in 'required_bullet_count' for each job. Reorder or trim bullets so the most JD-relevant experience is first in each role. Shorten low-relevance roles rather than cutting them entirely.
10. BUILD OVER MONITOR: Prioritize "build/ship/deploy" framing over "monitor/audit/QA" framing wherever both are defensible from the same experience.
11. AVOID EXCLUDED WORK: If the JD explicitly excludes a type of work (e.g. "not a model-training role", "not a sales role"), do not lead with bullets that read as that excluded work, even if technically related.
12. OPTIMIZED TITLE: Suggest an 'optimized_title' for the role that bridges the gap between their original title and the target JD title, making it more relevant without lying or deviating too far from the original title.
13. FINAL SET REVIEW: After rewriting all bullets, review them as a set. If more than half still closely resemble the original sentence structure, revise further. Prioritize structural rewrites for bullets tied to skills explicitly named in the JD.

Return ONLY a valid JSON array with this structure:
[
  {
    "exp_id": "exp_1",
    "optimized_title": "The slightly adjusted, highly relevant job title",
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
