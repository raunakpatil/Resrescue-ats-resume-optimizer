import { callGemini } from "../utils/geminiClient";

export async function parseResume(resumeText) {
  const prompt = `You are an expert resume parser. Convert the following resume text into a clean, structured JSON object.
Preserve ALL information — do not discard anything. Be precise with dates, titles, and details.

RESUME TEXT:
${resumeText}

Return ONLY a valid JSON object with this exact structure:
{
  "contact": {
    "name": "",
    "email": "",
    "phone": "",
    "location": "City, State/Country",
    "linkedin": "",
    "github": "",
    "portfolio": "",
    "other_links": []
  },
  "summary": "the full existing summary or objective, or empty string if none",
  "experience": [
    {
      "id": "exp_1",
      "company": "",
      "title": "",
      "location": "",
      "start_date": "Mon YYYY or YYYY",
      "end_date": "Mon YYYY or Present",
      "is_current": false,
      "bullets": ["exact bullet point 1", "exact bullet point 2"],
      "technologies": ["tech stack mentioned in this role"]
    }
  ],
  "skills": {
    "technical": [],
    "soft": [],
    "tools": [],
    "languages": [],
    "frameworks": [],
    "platforms": [],
    "other": []
  },
  "education": [
    {
      "institution": "",
      "degree": "",
      "field": "",
      "location": "",
      "graduation_year": "",
      "gpa": "",
      "honors": [],
      "relevant_coursework": []
    }
  ],
  "certifications": [
    {
      "name": "",
      "issuer": "",
      "date": "",
      "expiry": "",
      "credential_id": ""
    }
  ],
  "projects": [
    {
      "name": "",
      "description": "",
      "technologies": [],
      "link": "",
      "date": ""
    }
  ],
  "publications": [],
  "volunteer": [],
  "awards": [],
  "languages_spoken": []
}

If a section doesn't exist in the resume, use an empty array or empty string.
Do NOT infer or fabricate any information. Only extract what is explicitly stated.`;

  return await callGemini(prompt, { jsonMode: true, temperature: 0.1 });
}
