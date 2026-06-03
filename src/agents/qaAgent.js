import { callGemini } from "../utils/geminiClient";

export async function runQA(assembledResume, originalResume, jdAnalysis) {
  const prompt = `You are a meticulous quality assurance specialist for a premium resume writing service.
Perform a final review of this optimized resume for accuracy, consistency, and professionalism.

ORIGINAL RESUME DATA:
${JSON.stringify(originalResume, null, 2)}

OPTIMIZED RESUME TO REVIEW:
${JSON.stringify(assembledResume, null, 2)}

TARGET ROLE: ${jdAnalysis.job_title}

CHECK FOR AND FIX:
1. FABRICATIONS: Does any bullet claim something not supported by the original? If yes, tone it down.
2. CONSISTENCY: Do dates, titles, and company names match originals exactly?
3. VERB TENSE: Past jobs use past tense. Current job uses present tense for ongoing responsibilities.
4. PROFESSIONAL TONE: No casual language, no first person ("I", "my", "we"), no clichés
5. REPETITION: Remove duplicate keywords/phrases within same section
6. COMPLETENESS: Are all sections complete? Nothing cut accidentally?
7. CONTACT INFO: Is all contact info preserved exactly?
8. WORD COUNT: Summary 50-80 words. Each bullet 15-25 words.

Return the FINAL, QA-APPROVED resume JSON — exactly the same structure as the input assembledResume,
but with any issues corrected. Also include a "qa_report" field at the end:

The response must be a JSON object with all resume fields PLUS:
"qa_report": {
  "issues_found": ["list any issues that were corrected"],
  "fabrications_removed": ["any inflated claims that were toned down"],
  "final_word_count": 0,
  "recommended_pages": 1,
  "ready_to_export": true
}

Preserve the exact structure of the assembledResume, only correct issues.`;

  return await callGemini(prompt, { jsonMode: true, temperature: 0.1, maxTokens: 6000 });
}
