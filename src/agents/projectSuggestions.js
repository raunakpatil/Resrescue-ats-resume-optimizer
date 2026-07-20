import { callGemini } from "../utils/geminiClient";

export async function generateProjectSuggestions(parsedResume, jdAnalysis) {
  const prompt = `You are a Senior Technical Lead and Expert Recruiter.
Your goal is to analyze the candidate's resume and the target job description to provide:
1. Exactly 3 high-impact side projects the candidate could build to significantly increase their chances of landing this specific job.
2. A cold email to the recruiter or hiring manager.

PROJECTS CRITERIA:
- Directly address a core requirement or implicit pain point in the Job Description.
- Utilize the key technologies mentioned in the JD.
- Be realistic to build within a few weeks, but impressive enough to stand out (e.g., avoid generic "Todo apps").

EMAIL CRITERIA:
- FOLLOW INSTRUCTIONS: If the JD lists explicit "how to apply" instructions, answer them directly and in order.
- CONCRETE NEXT STEP: Keep it short, punchy, and highly actionable. End with a concrete, specific next step tied to the JD's actual ask (e.g., submitting a portfolio, discussing a specific project). 
- NO SALES TACTICS: AVOID cold-sales phrasing like "quick 10-min chat" or "simple yes/no works". This is a job application, not a sales outreach. Do NOT use vague phrases like "let's connect".
- SHOW VALUE: Focus heavily on what the candidate can do for the company to directly solve a pain point. Mention that you have researched the company and have insights on how you can help.
- SAFE FALLBACKS: Never leave placeholder text like [Name] or [Company] unresolved. If you do not have the real value, use a safe generic fallback (e.g. "Hiring Manager" or "Your Team").

Example format for the email:
"Hi Hiring Manager,
I came across your [Job Title] opening at your company and wanted to reach out because my background aligns quite closely with the [Core Skill 1] and [Core Skill 2] requirements in the role.
I've attached my CV. Most recently, I worked on [Achievement related to pain point] that [Quantifiable Result]. I also noticed your team might be focusing on [Pain Point], and I've put together a short slide deck with a few insights on how I could help solve that.

I would love to share this deck with you if you are open to reviewing it as part of my application.
Thanks,
[Candidate Name]"

CANDIDATE RESUME:
${JSON.stringify(parsedResume, null, 2)}

TARGET JOB DESCRIPTION ANALYSIS:
${JSON.stringify(jdAnalysis, null, 2)}

OUTPUT FORMAT (JSON ONLY):
{
  "suggestedProjects": [
    {
      "title": "Project Name",
      "description": "A 1-2 sentence description of what the project is and the core problem it solves.",
      "technologies": ["Tech 1", "Tech 2", "Tech 3"],
      "reasoning": "A 1-2 sentence explanation of exactly why this project proves they are perfect for this specific role."
    }
  ],
  "recruiterMessage": {
    "subjectLine": "Suggested subject line for email/LinkedIn",
    "body": "The full text of the personalized message."
  }
}`;

  return await callGemini(prompt, { jsonMode: true });
}
