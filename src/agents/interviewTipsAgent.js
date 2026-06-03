import { callGemini } from "../utils/geminiClient";

export async function generateInterviewTips(finalResume, jdAnalysis, gapAnalysis) {
  const strengths = (gapAnalysis?.strengths || []).map((s) => s.area).join(", ");
  const biggestGap = gapAnalysis?.honest_assessment?.biggest_gap || "general experience";
  const responsibilities = (jdAnalysis.key_responsibilities || []).join(", ");

  const prompt = `Based on this candidate's profile and the job they're applying for, generate 5 targeted interview preparation tips.

TARGET ROLE: ${jdAnalysis.job_title}
CANDIDATE STRENGTHS: ${strengths}
CANDIDATE GAPS: ${biggestGap}
KEY JD RESPONSIBILITIES: ${responsibilities}

For each tip, focus on:
1. Questions they're likely to be asked given their gaps
2. How to bridge experience gaps with transferable skills
3. How to frame their strongest points
4. Behavioral questions using their actual experience
5. Technical/role-specific preparation

Return ONLY a valid JSON array:
[
  {
    "category": "Behavioral|Technical|Situational|Culture Fit|Salary",
    "tip": "specific, actionable advice",
    "sample_question": "likely interview question",
    "suggested_approach": "how to answer it using their background"
  }
]

Return exactly 5 tips, one per category.`;

  return await callGemini(prompt, { jsonMode: true, temperature: 0.5 });
}
