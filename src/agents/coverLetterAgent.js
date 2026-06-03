import { callGemini } from "../utils/geminiClient";

export async function generateCoverLetter(finalResume, jdAnalysis) {
  const today = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  
  const prompt = `Act as a young, highly ambitious, and genuine professional writing a cover letter to a hiring manager. Do NOT write like an "executive copywriter" or an AI. Write like a real, passionate human being who is genuinely excited about this specific opportunity and hungry to prove themselves.

CANDIDATE:
Name: ${finalResume?.contact?.name || "[First Name Last Name]"}
Phone: ${finalResume?.contact?.phone || "[Phone Number]"}
Email: ${finalResume?.contact?.email || "[Email Address]"}
LinkedIn: ${finalResume?.contact?.linkedin || "[LinkedIn URL]"}
GitHub/Portfolio: ${finalResume?.contact?.github || finalResume?.contact?.portfolio || "[Portfolio URL]"}

TARGET ROLE: ${jdAnalysis.job_title} 
TARGET COMPANY: ${jdAnalysis.company_name || "UNKNOWN"}
CANDIDATE SUMMARY: ${finalResume?.summary || ""}
EXPERIENCE: ${JSON.stringify(finalResume?.experience || [])}

JOB REQUIREMENTS:
${(jdAnalysis.required_skills || []).join(", ")}

CRITICAL RULES:
Use the following strict structural framework to generate the cover letter. 
Length MUST be very short: 150–220 words max. Keep it incredibly punchy. Hiring managers are busy.

### HEADER BLOCK (Include exactly this format at the top):
${finalResume?.contact?.name || "[First Name Last Name]"}
${finalResume?.contact?.phone || "[Phone Number]"} | ${finalResume?.contact?.email || "[Email Address]"}
${finalResume?.contact?.linkedin || "[LinkedIn URL]"} | ${finalResume?.contact?.github || finalResume?.contact?.portfolio || ""}

${today}

Hiring Manager
${jdAnalysis.company_name || "Hiring Team"}

Dear Hiring Manager,

### BODY PARAGRAPHS:

**Paragraph 1 (The Human Hook)**
Start by genuinely expressing excitement about the role. Do NOT use corporate jargon. Sound like a real person writing a thoughtful email. Mention one specific thing about the role or industry that genuinely interests the candidate. 
*Fallback rule: If TARGET COMPANY is "UNKNOWN", use "your team" or "your organization".*

**Paragraph 2 (The Short Story)**
Do NOT just rehash the resume or list bullet points of metrics—they can already read the resume. Instead, tell a very brief (2-3 sentences), engaging story about *how* the candidate approaches solving hard problems, learning new things fast, or their attitude toward work. Draw inspiration from their past experience but frame it as a story of growth or determination. Show hunger, curiosity, and technical agility. Relate this directly to a core requirement of the target job.

**Paragraph 3 (The Ask)**
Keep it humble but confident. Don't be overly formal. Just express that you would love the opportunity to prove what you can do and ask for a quick chat.

### WRITING STYLE & ANTI-BUZZWORD CONSTRAINTS:
1. **TONE:** Young, ambitious, conversational, yet professional. Write it as if sending a thoughtful message directly to a respected senior engineer or manager. 
2. **BANNED VERBS/PHRASES:** AI loves over-the-top verbs. Do NOT use words like: "spearheaded", "orchestrated", "engineered", "optimized", "critical inflection point", "track record", "thrilled", "moreover", "furthermore", "in conclusion", "testament to". 
3. **USE NORMAL WORDS:** Use normal human verbs (built, created, fixed, improved, led, figured out, solved).
4. **FORMATTING:** Output the FULL cover letter, including the header block. No markdown wrappers, just the raw text formatted cleanly with line breaks.`;

  return await callGemini(prompt, { temperature: 0.7, maxTokens: 800 });
}
