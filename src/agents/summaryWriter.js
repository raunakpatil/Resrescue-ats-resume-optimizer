import { callGemini } from "../utils/geminiClient";

export async function writeSummary(parsedResume, jdAnalysis, gapAnalysis, optimizationMode = "god") {
  const expDates = (parsedResume.experience || []).map((e) => ({
    title: e.title,
    start: e.start_date,
    end: e.end_date,
  }));

  const criticalKeywords = (jdAnalysis.ats_keywords || [])
    .filter((k) => k.weight === "critical")
    .map((k) => k.term)
    .join(", ");

  const prompt = `You are a master resume writer who has placed 10,000+ candidates at top companies.
Write a powerful, ATS-optimized professional summary for this candidate targeting this specific role.

CANDIDATE BACKGROUND:
- Current Title: ${parsedResume.experience?.[0]?.title || "Professional"}
- Experience Timeline: ${JSON.stringify(expDates)}
- Existing Summary: ${parsedResume.summary || "None"}

TARGET ROLE:
- Title: ${jdAnalysis.job_title}
- Seniority: ${jdAnalysis.seniority_level}
- Industry: ${jdAnalysis.industry}

STRATEGY:
${JSON.stringify(gapAnalysis.summary_strategy, null, 2)}

CRITICAL ATS KEYWORDS TO INCLUDE:
${criticalKeywords}

RULES FOR THE SUMMARY:
1. STRICT 3-SENTENCE STRUCTURE: The summary MUST be exactly 3 sentences long.
  - Sentence 1 (Identity): Who the candidate is + years of experience + the EXACT intersection the JD needs. (e.g., "Data Strategy & Quality Analyst with 4 years building..."). CRITICAL: You MUST use the exact TARGET TITLE: "${jdAnalysis.job_title}". Do NOT use their old job title if it differs.
  - Sentence 2 (Superpower): The candidate's primary technical superpower / domain expertise, packed with 3-4 top ATS keywords.
  - Sentence 3 (Forward Signal): What they will deliver for THIS specific employer.
2. NEVER use: "results-driven", "passionate about", "detail-oriented", "team player", "self-starter", "dynamic".
3. Write confidently in the third-person implied (e.g. "Data Engineer with 4 years..." instead of "I am a Data Engineer...").
4. ALWAYS inject the highest priority keywords naturally into the text. FORCED KEYWORD INJECTION: The summary MUST contain at least 3 critical ATS keywords from the JD. No exceptions.
5. Max 60 words total. Extremely concise and punchy.

Return ONLY the summary text. No quotes, no labels, no JSON. Just the summary paragraph.`;

  return await callGemini(prompt, { temperature: 0.5, maxTokens: 500 });
}
