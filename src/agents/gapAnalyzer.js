import { callGemini } from "../utils/geminiClient";

export async function analyzeGaps(parsedResume, jdAnalysis, githubData) {
  const prompt = `You are a senior career coach and ATS optimization expert.
Compare the candidate's resume against the job requirements and devise a precise rewriting strategy.

JOB ANALYSIS:
${JSON.stringify(jdAnalysis, null, 2)}

CANDIDATE'S CURRENT RESUME DATA:
${JSON.stringify(parsedResume, null, 2)}

CANDIDATE'S REAL GITHUB DATA (Use these to replace weak resume projects if they are a better fit):
${githubData ? JSON.stringify(githubData, null, 2) : "No GitHub data provided"}

Perform a thorough gap analysis and return ONLY a valid JSON object:
{
  "initial_match_score": 0,
  "projected_optimized_score": 0,
  "strengths": [
    { "area": "what candidate already has that's relevant", "how_to_amplify": "how to highlight it better" }
  ],
  "keyword_gaps": [
    { "keyword": "missing keyword from JD", "priority": "critical|important|bonus", "where_to_add": "summary|experience|skills" }
  ],
  "hard_gaps": ["critical JD keywords the candidate absolutely lacks and cannot be inferred from their history"],
  "skills_to_add": ["skills from JD the candidate likely has but didn't list, or transferable skills"],
  "skills_to_remove": ["skills that are irrelevant to this role and waste space"],
  "skills_to_emphasize": ["skills candidate has that are critical to this JD"],
  "experience_strategy": [
    {
      "exp_id": "exp_1",
      "company": "company name",
      "current_title": "their title",
      "rewrite_focus": "what angle to take for this role",
      "keywords_to_inject": ["specific keywords from JD to add to this experience"],
      "metrics_needed": "what quantification would strengthen this",
      "bullets_to_expand": [0, 1],
      "bullets_to_cut": [],
      "new_bullets_to_add": ["description of new bullet to add if this experience is very relevant"]
    }
  ],
  "project_strategy": [
    {
      "source": "resume or github",
      "name": "Project Name",
      "description_to_use": "Short description of what the project is",
      "technologies": ["Tech1", "Tech2"],
      "rewrite_focus": "Specific instructions on how the rewriter should frame this project to perfectly match the JD keywords"
    }
  ],
  "summary_strategy": {
    "target_persona": "how to position the candidate for this role",
    "top_3_selling_points": ["point 1", "point 2", "point 3"],
    "keywords_to_open_with": ["first keywords recruiter + ATS should see"],
    "years_of_experience_to_highlight": "X years in Y",
    "tone": "matches job description tone"
  },
  "education_notes": "any notes about how to present education for this role",
  "certifications_to_highlight": ["which existing certs are relevant"],
  "certifications_to_mention_acquiring": [],
  "overall_strategy": "1-2 sentence summary of the optimization approach",
  "title_recommendation": "suggested title/headline for the resume",
  "honest_assessment": {
    "is_good_fit": true,
    "fit_percentage": 0,
    "biggest_gap": "most critical missing qualification",
    "can_be_bridged": true,
    "how_to_bridge": "how to frame it"
  }
}

CRITICAL RULES:
- Never suggest adding skills the candidate has zero evidence of having
- Focus on re-framing and amplifying existing experience, not fabricating it
- Every rewrite must be based on the candidate's actual history
- For "project_strategy", evaluate both the Resume Projects and the GitHub Repos. Select the TOP 2 most impressive and relevant projects overall. If a GitHub repo is far more relevant to the Job Description than a listed resume project, swap it in! Provide detailed instructions in "rewrite_focus" for how to frame it.
- If there's a significant skills gap, note it but focus on transferable skills
- CRITICAL KEYWORD RETENTION: NEVER suggest removing a skill or cutting a bullet if it contains a technical term, tool, or keyword. Jobscan penalizes removing skills. Retain all original keywords.`;

  return await callGemini(prompt, { jsonMode: true, temperature: 0.2 });
}
