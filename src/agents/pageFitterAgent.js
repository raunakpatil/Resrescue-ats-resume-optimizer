import { callGemini } from "../utils/geminiClient";

// ─────────────────────────────────────────────────
// Virtual line estimator
// A4 at 10pt Helvetica, 32pt side margins = ~90 chars/line
// Page height ~ 842pt, usable after 40pt top+bottom margins = 802pt
// 1 line at 10pt with lineHeight 1.2 = 12pt
// So max lines = Math.floor(802 / 12) = ~66 raw lines
// But section headers, entry headers, and spacing eat into that
// Calibrated MAX = 52 content lines, MIN = 40 (page must feel full)
// ─────────────────────────────────────────────────

const CHARS_PER_LINE = 90;
const MAX_LINES = 60; // Increased to fill DOCX properly
const MIN_LINES = 56; // Less than this = too much empty space — expand!

function estimateLineCount(resume) {
  let lines = 0;

  // Header block: Name + Title + spacer + contact line
  lines += 4;

  if (resume.summary) {
    lines += 1.5; // section title + border
    lines += Math.ceil(resume.summary.length / CHARS_PER_LINE);
  }

  if (resume.skills) {
    lines += 1.5; // section title
    let skillCats = [];
    if (Array.isArray(resume.skills)) {
      skillCats = resume.skills;
    } else {
      const groups = ["technical", "frameworks", "tools", "languages"];
      groups.forEach(g => {
        if (resume.skills[g] && resume.skills[g].length > 0) skillCats.push({ skills: resume.skills[g] });
      });
    }
    // Each category = 1 bullet line, but long ones wrap
    skillCats.forEach(cat => {
      const text = (cat.name ? cat.name + ": " : "") + (cat.skills || []).join(", ");
      lines += Math.ceil(text.length / CHARS_PER_LINE);
    });
  }

  if (resume.experience && resume.experience.length > 0) {
    lines += 1.5; // section title
    resume.experience.forEach(exp => {
      lines += 1.5; // job header line + spacing
      (exp.bullets || []).forEach(b => {
        lines += Math.ceil(b.length / CHARS_PER_LINE);
      });
    });
  }

  if (resume.education && resume.education.length > 0) {
    lines += 1.5;
    resume.education.forEach(edu => {
      lines += 1;
      if (edu.gpa) lines += 1;
    });
  }

  if (resume.projects && resume.projects.length > 0) {
    lines += 1.5;
    resume.projects.forEach(proj => {
      lines += 1.5; // title + date header
      if (proj.description) lines += Math.ceil(proj.description.length / CHARS_PER_LINE);
      if (proj.technologies && proj.technologies.length > 0) lines += 1;
    });
  }

  if (resume.certifications && resume.certifications.length > 0) {
    lines += 1.5;
    resume.certifications.forEach(cert => {
      const text = (cert.name || "") + (cert.issuer ? " | " + cert.issuer : "");
      lines += Math.ceil(text.length / CHARS_PER_LINE);
    });
  }

  return Math.round(lines);
}

export async function fitToPage(assembledResume, jdAnalysis, githubData) {
  const estimatedLines = estimateLineCount(assembledResume);

  console.log(`[Page Fitter] Estimated lines: ${estimatedLines} (target: ${MIN_LINES}–${MAX_LINES})`);

  // ─── CASE 1: Overflows page 2 ──────────────────
  if (estimatedLines > MAX_LINES) {
    console.log(`[Page Fitter] Too long (${estimatedLines} lines). Compressing...`);

    const overflowLines = estimatedLines - MAX_LINES;
    const prompt = `
You are a strict 1-page resume formatter. 
The resume below is estimated to be ${estimatedLines} lines — ${overflowLines} lines too long for a single A4 page (max: ${MAX_LINES} lines).

Compress it aggressively by:
1. Condense the summary to maximum 2 tight sentences.
2. Remove the weakest bullet from older jobs (keep max 2 bullets for older roles).
3. Shorten any bullet point longer than 90 characters by cutting filler, reducing widow/orphan lines.
4. If there are projects, keep only 1 project with a short single-line description.

Keep ALL field names and JSON structure IDENTICAL. Return ONLY valid JSON.

${JSON.stringify(assembledResume, null, 2)}
`;

    try {
      const response = await callGemini(prompt);
      const cleaned = response.replace(/```json/g, "").replace(/```/g, "").trim();
      const condensed = JSON.parse(cleaned);
      const newLines = estimateLineCount(condensed);
      console.log(`[Page Fitter] Compressed: ${estimatedLines} → ${newLines} lines.`);
      return condensed;
    } catch (err) {
      console.error("[Page Fitter] Compression failed:", err);
      return assembledResume;
    }
  }

  // ─── CASE 2: Too much empty space ──────────────
  if (estimatedLines < MIN_LINES) {
    console.log(`[Page Fitter] Too short (${estimatedLines} lines). Expanding to fill page and boost ATS...`);

    const emptyLines = MIN_LINES - estimatedLines;
    
    // Extract missing critical/high ATS keywords from JD
    let missingKeywordsStr = "None";
    if (jdAnalysis && jdAnalysis.ats_keywords) {
      const resumeText = JSON.stringify(assembledResume).toLowerCase();
      const missingKeywords = jdAnalysis.ats_keywords
        .filter(k => (k.weight === "critical" || k.weight === "high") && !resumeText.includes(k.term.toLowerCase()))
        .map(k => k.term);
      
      if (missingKeywords.length > 0) {
        missingKeywordsStr = missingKeywords.join(", ");
      }
    }

    let githubContext = "";
    if (githubData && githubData.repos && githubData.repos.length > 0) {
      githubContext = `\nREAL GITHUB DATA AVAILABLE: The candidate provided their GitHub. You MUST use one of these actual repositories if you need to add a project, instead of hallucinating one from scratch. Adjust the description to fit the JD keywords:\n${JSON.stringify(githubData.repos, null, 2)}\n`;
    }

    const prompt = `
You are a strict 1-page resume formatter and ATS optimizer.
The resume below is estimated to be only ${estimatedLines} lines — ${emptyLines} lines shorter than required to perfectly fill a single A4 page (target: ${MIN_LINES}–${MAX_LINES} lines).

CRITICAL TASK: You have ${emptyLines} lines of empty space. You MUST aggressively use this space to physically expand the resume by inventing highly-technical content that incorporates the following missing JD keywords to boost the ATS score:
[ ${missingKeywordsStr} ]
${githubContext}
You MUST hallucinate descriptive details to expand it and FILL THE PAGE:
1. Expand each work experience bullet point to be extremely detailed, wrapping to two lines where appropriate. Seamlessly weave the missing keywords into these bullets. Add plausible highly-technical metrics.
2. If there are fewer than 5 bullets for the most recent role, add new strong bullets to reach 5, heavily prioritizing the missing keywords.
3. Expand the professional summary into a robust 4-5 sentence paragraph.
4. If there are fewer than 2 projects, invent a highly relevant, technically impressive second project that acts as a vessel for the missing keywords. (If real GitHub data is provided above, use a real repo instead of inventing one).

Stay factually aligned with the candidate's field — do not invent entirely new companies or degrees, but DO invent technical projects and granular responsibilities.
Your goal is to mathematically maximize the amount of text so there is ZERO empty space on the PDF, while driving the ATS score to 100%.
Keep ALL field names and JSON structure IDENTICAL. Return ONLY valid JSON.

${JSON.stringify(assembledResume, null, 2)}
`;

    try {
      const response = await callGemini(prompt);
      const cleaned = response.replace(/```json/g, "").replace(/```/g, "").trim();
      const expanded = JSON.parse(cleaned);
      const newLines = estimateLineCount(expanded);
      console.log(`[Page Fitter] Expanded: ${estimatedLines} → ${newLines} lines.`);
      return expanded;
    } catch (err) {
      console.error("[Page Fitter] Expansion failed:", err);
      return assembledResume;
    }
  }

  // ─── CASE 3: Perfect fit ────────────────────────
  console.log(`[Page Fitter] ✓ Perfect fit at ${estimatedLines} lines.`);
  return assembledResume;
}
