import { callGemini } from "../utils/geminiClient";

export async function analyzeJD(jobDescription) {
  const prompt = `You are an expert talent acquisition specialist and ATS system analyst.
Analyze the following job description and extract ALL information needed to optimize a resume for it.

JOB DESCRIPTION:
${jobDescription}

CRITICAL EXTRACTION RULES:
1. ATS systems are literal. Extract raw, exact keywords exactly as written in the text.
2. If the text says "React.js", extract "React.js", NOT "React". If it says "Node JS", extract "Node JS".
3. Extract specific nouns, proper names, and exact phrases (e.g. "Agile Methodologies", "Object-Oriented Programming"). Do not summarize them into overarching concepts.


Return ONLY a valid JSON object with this exact structure:
{
  "job_title": "exact job title from the posting",
  "company_name": "exact name of the hiring company (or null if hidden)",
  "normalized_title": "standardized version (e.g., 'Software Engineer' not 'Rockstar Coder')",
  "seniority_level": "entry|junior|mid|senior|lead|principal|director|executive",
  "industry": "e.g., FinTech, Healthcare, SaaS, E-commerce, etc.",
  "company_type": "startup|mid-size|enterprise|agency|nonprofit",
  "required_skills": ["list", "of", "hard", "required", "skills"],
  "preferred_skills": ["list", "of", "nice-to-have", "skills"],
  "technical_skills": ["specific", "technologies", "tools", "languages"],
  "soft_skills": ["communication", "leadership", "etc"],
  "ats_keywords": [
    { "term": "exact term from JD", "weight": "critical|important|bonus", "frequency": 1 }
  ],
  "experience_years_required": "e.g., 3-5, 5+, 2+ (or null if not specified)",
  "education_required": "e.g., Bachelor's in CS or null",
  "certifications_mentioned": ["any certs mentioned"],
  "key_responsibilities": ["top 5 responsibilities as brief phrases"],
  "success_metrics": ["what success looks like in this role"],
  "company_values": ["any values/culture signals detected"],
  "tone": "formal|casual|technical|creative",
  "red_flags_to_avoid": ["overused buzzwords to avoid or phrases that would hurt"],
  "power_phrases": ["specific phrases from JD to mirror in resume"]
}

Be thorough. Include every skill, technology, and keyword. Miss nothing.`;

  return await callGemini(prompt, { jsonMode: true, temperature: 0.1 });
}
