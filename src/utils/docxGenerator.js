import {
  Document, Packer, Paragraph, TextRun,
  AlignmentType, BorderStyle, UnderlineType, TabStopType, LevelFormat
} from "docx";

export async function generateDocx(resumeData) {
  const {
    contact = {}, summary, experience = [],
    skills = [], education = [], projects = [], certifications = []
  } = resumeData;

  const children = [];

  // ── Border utility (fixed: "style" not "value") ──────────────────────────
  const getBorderBottom = () => ({
    bottom: { color: "000000", space: 1, style: BorderStyle.SINGLE, size: 6 },
  });

  // ── Section header: bold, 11pt, bottom border ─────────────────────────────
  const createSectionHeader = (title) =>
    new Paragraph({
      children: [new TextRun({ text: title.toUpperCase(), bold: true, size: 22 })],
      spacing: { before: 100, after: 40 },
      border: getBorderBottom(),
    });

  // ── Bullet paragraph with optional bold prefix before colon ───────────────
  const createBulletedParagraph = (text) => {
    const clean = text.replace(/^[•\-\*]\s*/, "");
    const colonIdx = clean.indexOf(":");
    if (colonIdx > 0 && colonIdx < 50) {
      return new Paragraph({
        children: [
          new TextRun({ text: clean.substring(0, colonIdx + 1), bold: true, size: 20 }),
          new TextRun({ text: clean.substring(colonIdx + 1), size: 20 }),
        ],
        numbering: { reference: "resume-bullets", level: 0 },
        spacing: { before: 10, after: 10 },
      });
    }
    return new Paragraph({
      children: [new TextRun({ text: clean, size: 20 })],
      numbering: { reference: "resume-bullets", level: 0 },
      spacing: { before: 10, after: 10 },
    });
  };

  // ── Two-column row: left bold | right italic date (tab-aligned) ───────────
  const createRoleRow = (leftText, dateText, isFirst) =>
    new Paragraph({
      children: [
        new TextRun({ text: leftText, bold: true, size: 20 }),
        new TextRun({ text: `\t${dateText}`, size: 20, italics: true }),
      ],
      tabStops: [{ type: TabStopType.RIGHT, position: 9746 }],
      spacing: { before: isFirst ? 40 : 80, after: 20 },
    });

  // ══ HEADER ════════════════════════════════════════════════════════════════

  // Name
  if (contact.name) {
    children.push(new Paragraph({
      children: [new TextRun({ text: contact.name.toUpperCase(), bold: true, size: 36 })],
      alignment: AlignmentType.CENTER,
      spacing: { before: 0, after: 20 },
    }));
  }

  // Job title (no border)
  const jobTitleText = contact.jobTitle ||
    (experience.length > 0 ? experience[0].title : "Professional");
  children.push(new Paragraph({
    children: [new TextRun({ text: jobTitleText.toUpperCase(), size: 22 })],
    alignment: AlignmentType.CENTER,
    spacing: { before: 0, after: 20 },
  }));

  // Contact line (WITH bottom border — matches PDF)
  const contactRuns = [];
  const sep = () => contactRuns.push(new TextRun({ text: " | ", size: 20 }));

  [contact.location, contact.phone, contact.email].filter(Boolean).forEach((item, i) => {
    if (i > 0) sep();
    contactRuns.push(new TextRun({ text: item, size: 20 }));
  });

  if (contact.linkedin) {
    sep();
    contactRuns.push(new TextRun({
      text: contact.linkedin, size: 20,
      color: "0563C1", underline: { type: UnderlineType.SINGLE },
    }));
  }
  if (contact.github) {
    sep();
    contactRuns.push(new TextRun({
      text: contact.github, size: 20,
      color: "0563C1", underline: { type: UnderlineType.SINGLE },
    }));
  }

  children.push(new Paragraph({
    children: contactRuns,
    alignment: AlignmentType.CENTER,
    spacing: { before: 0, after: 60 },
    border: getBorderBottom(), // ✅ border is HERE, under contact line
  }));

  // ══ SUMMARY ═══════════════════════════════════════════════════════════════
  if (summary) {
    children.push(createSectionHeader("Summary"));
    children.push(new Paragraph({
      children: [new TextRun({ text: summary, size: 20 })],
      spacing: { before: 40, after: 40 },
    }));
  }

  // ══ TECHNICAL SKILLS ══════════════════════════════════════════════════════
  if (skills && skills.length > 0) {
    children.push(createSectionHeader("Technical Skills"));

    const cats = Array.isArray(skills) ? skills : [
      { name: "Programming", skills: skills.technical },
      { name: "Data Science", skills: skills.frameworks },
      { name: "Tools",        skills: skills.tools },
      { name: "Languages",    skills: skills.languages },
    ].filter(c => c.skills?.length > 0);

    cats.forEach((cat, i) => {
      const catText = (cat.skills || []).join(", ");
      children.push(new Paragraph({
        children: [
          new TextRun({ text: cat.name ? `${cat.name}: ` : "", bold: true, size: 20 }),
          new TextRun({ text: catText, size: 20 }),
        ],
        numbering: { reference: "resume-bullets", level: 0 },
        spacing: { before: i === 0 ? 40 : 10, after: 10 },
      }));
    });
  }

  // ══ WORK EXPERIENCE ═══════════════════════════════════════════════════════
  if (experience && experience.length > 0) {
    children.push(createSectionHeader("Work Experience"));
    experience.forEach((exp, i) => {
      const leftText = [exp.title, exp.company, exp.location].filter(Boolean).join(" | ");
      const dateText = `${exp.start_date || ""} – ${exp.end_date || "Present"}`;
      children.push(createRoleRow(leftText, dateText, i === 0));
      (exp.bullets || []).forEach(b => children.push(createBulletedParagraph(b)));
    });
  }

  // ══ EDUCATION ═════════════════════════════════════════════════════════════
  if (education && education.length > 0) {
    children.push(createSectionHeader("Education"));
    education.forEach((edu, i) => {
      const degree = `${edu.degree || ""}${edu.field ? ` in ${edu.field}` : ""}`;
      const leftText = [degree, edu.institution].filter(Boolean).join(" | ");
      const dateText = edu.graduation_year || "";
      children.push(createRoleRow(leftText, dateText, i === 0));
      if (edu.modules) children.push(createBulletedParagraph(`Modules: ${edu.modules}`));
      if (edu.gpa)     children.push(createBulletedParagraph(`GPA: ${edu.gpa}`));
    });
  }

  // ══ PROJECTS ══════════════════════════════════════════════════════════════
  if (projects && projects.length > 0) {
    children.push(createSectionHeader("Projects"));
    projects.forEach((proj, i) => {
      // Organisation/location row
      if (proj.organisation) {
        children.push(createRoleRow(proj.organisation, proj.date || "", i === 0));
      }
      // Project title on its own line, bold
      children.push(new Paragraph({
        children: [new TextRun({ text: proj.name, bold: true, size: 20 })],
        spacing: { before: 20, after: 20 },
      }));
      if (proj.description) children.push(createBulletedParagraph(proj.description));
      (proj.bullets || []).forEach(b => children.push(createBulletedParagraph(b)));
      if (proj.technologies?.length > 0) {
        children.push(createBulletedParagraph(`Technologies: ${proj.technologies.join(", ")}`));
      }
    });
  }

  // ══ CERTIFICATIONS ════════════════════════════════════════════════════════
  if (certifications && certifications.length > 0) {
    children.push(createSectionHeader("Certifications"));
    certifications.forEach((cert, i) => {
      const certText = [cert.name, cert.issuer, cert.date].filter(Boolean).join(" | ");
      children.push(new Paragraph({
        children: [new TextRun({ text: certText, size: 20 })],
        numbering: { reference: "resume-bullets", level: 0 },
        spacing: { before: i === 0 ? 40 : 10, after: 10 },
      }));
    });
  }

  // ══ DOCUMENT ══════════════════════════════════════════════════════════════
  const doc = new Document({
    numbering: {
      config: [
        {
          reference: "resume-bullets",
          levels: [{
            level: 0,
            format: LevelFormat.BULLET,
            text: "●",
            alignment: AlignmentType.LEFT,
            style: {
              paragraph: {
                indent: { left: 360, hanging: 260 },
              },
            },
          }],
        },
      ],
    },
    styles: {
      default: {
        document: {
          run: { font: "Calibri", color: "000000" },
        },
      },
    },
    sections: [{
      properties: {
        page: {
          size: {
            width: 11906,   // A4 width in DXA
            height: 16838,  // A4 height in DXA
          },
          margin: {
            top: 720,     // 0.5"
            bottom: 720,  // 0.5"
            left: 1080,   // 0.75"
            right: 1080,  // 0.75"
          },
        },
      },
      children,
    }],
  });

  return Packer.toBlob(doc);
}
