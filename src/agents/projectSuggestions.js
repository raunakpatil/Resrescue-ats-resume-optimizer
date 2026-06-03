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
- CLEAR ASK: Have a "foot in the door" ask. Do NOT directly ask for a role. Ask for a quick 10-15 minute chat to learn more, or a 10 minute review of work to see alignment. End with "A simple yes/no works perfectly."
- SHOW VALUE: Focus heavily on what the candidate can do for the company to directly solve a pain point. 
- RESEARCH/INSIGHTS: Mention that you have researched the company, identified a specific pain point (extrapolate a likely pain point from the JD), and mention you have attached a slide deck or have a few insights on how you can help solve it.
- Keep it short, punchy, and highly actionable.

Example format for the email:
"Hi [Name],
I came across your [Job Title] opening at [Company] and wanted to reach out because my background aligns quite closely with the [Core Skill 1] and [Core Skill 2] requirements in the role.
I've attached my CV. Most recently, I worked on [Achievement related to pain point] that [Quantifiable Result]. I also noticed [Company] might be focusing on [Pain Point], and I've put together a short slide deck with a few insights on how I could help solve that.

Would you be open to a quick 10-minute conversation this week to see if there could be a fit?
A simple yes/no works perfectly.
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
