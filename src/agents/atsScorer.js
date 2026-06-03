import { callGemini } from "../utils/geminiClient";

export async function scoreResume(finalResume, jdAnalysis, gapAnalysis) {
  const prompt = `You are an ATS system simulator. Score this resume against the job description exactly as modern ATS systems do.

JOB ANALYSIS:
${JSON.stringify(jdAnalysis, null, 2)}

ORIGINAL RESUME SCORE (For Reference): ${gapAnalysis?.initial_match_score || 0}/100

OPTIMIZED RESUME (After adding missing keywords):
${JSON.stringify(finalResume, null, 2)}

CRITICAL SCORING RULES (LIKE JOBSCAN):
1. DUMB EXACT MATCHING: ATS systems are literal. If the JD says "React.js" and the resume says "React", that is a MISSING keyword. You must do a literal, exact string search.
2. CONSISTENT RELATIVE SCORING: The optimized resume has been heavily tailored to include missing keywords. Your new score MUST logically reflect these improvements. If keywords were added (which they were), the new score MUST be significantly higher than the Original Resume Score.
3. Treat the "keyword_match" and "skills_alignment" heavily in the overall_score.


Score the resume and return ONLY a valid JSON object:
{
  "overall_score": 0,
  "breakdown": {
    "keyword_match": {
      "score": 0,
      "matched_keywords": ["keywords from JD found in resume"],
      "missing_keywords": ["critical JD keywords still missing"]
    },
    "skills_alignment": {
      "score": 0,
      "matched_skills": [],
      "missing_required_skills": []
    },
    "experience_relevance": {
      "score": 0,
      "notes": "assessment of experience alignment"
    },
    "formatting_compliance": {
      "score": 0,
      "issues": ["any formatting concerns for ATS parsing"]
    },
    "content_quality": {
      "score": 0,
      "notes": "assessment of bullet quality, quantification, action verbs"
    }
  },
  "top_3_improvements": [
    "Most impactful remaining improvement",
    "Second improvement",
    "Third improvement"
  ],
  "ats_pass_likelihood": "high|medium|low",
  "human_recruiter_appeal": "high|medium|low",
  "estimated_ranking": "top 10%|top 25%|top 50%|below 50%",
  "verdict": "2-sentence honest assessment of this resume's chances"
}`;

  return await callGemini(prompt, { jsonMode: true, temperature: 0.1 });
}
