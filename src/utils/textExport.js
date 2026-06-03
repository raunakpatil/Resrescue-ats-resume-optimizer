export function generatePlainText(resumeData) {
  if (!resumeData) return "";
  let text = "";
  const divider = "─".repeat(50);

  // Contact block
  const contact = resumeData.contact || {};
  if (contact.name) text += `${contact.name}\n`;
  const contactLine = [contact.email, contact.phone, contact.location]
    .filter(Boolean)
    .join(" | ");
  if (contactLine) text += `${contactLine}\n`;
  if (contact.linkedin) text += `LinkedIn: ${contact.linkedin}\n`;
  if (contact.github) text += `GitHub: ${contact.github}\n`;
  if (contact.portfolio) text += `Portfolio: ${contact.portfolio}\n`;
  text += "\n";

  // Summary
  if (resumeData.summary) {
    text += `PROFESSIONAL SUMMARY\n${divider}\n`;
    text += `${resumeData.summary}\n\n`;
  }

  // Skills
  const skills = resumeData.skills;
  if (skills) {
    text += `SKILLS\n${divider}\n`;
    if (Array.isArray(skills)) {
      // categories format from skillsCurator
      skills.forEach((cat) => {
        if (cat.name && cat.skills?.length) {
          text += `${cat.name}: ${cat.skills.join(", ")}\n`;
        }
      });
    } else if (skills.categories) {
      skills.categories.forEach((cat) => {
        if (cat.name && cat.skills?.length) {
          text += `${cat.name}: ${cat.skills.join(", ")}\n`;
        }
      });
    } else {
      // legacy object format
      const skillGroups = [
        { key: "technical", label: "Technical Skills" },
        { key: "frameworks", label: "Frameworks & Libraries" },
        { key: "tools", label: "Tools & Platforms" },
        { key: "soft", label: "Soft Skills" },
        { key: "languages", label: "Languages" },
      ];
      skillGroups.forEach(({ key, label }) => {
        if (skills[key]?.length) {
          text += `${label}: ${skills[key].join(", ")}\n`;
        }
      });
    }
    text += "\n";
  }

  // Experience
  if (resumeData.experience?.length) {
    text += `PROFESSIONAL EXPERIENCE\n${divider}\n`;
    resumeData.experience.forEach((exp) => {
      text += `\n${exp.title || ""} | ${exp.company || ""} | ${exp.location || ""}\n`;
      text += `${exp.start_date || ""} – ${exp.end_date || "Present"}\n`;
      (exp.bullets || []).forEach((b) => {
        text += `• ${b}\n`;
      });
    });
    text += "\n";
  }

  // Education
  if (resumeData.education?.length) {
    text += `EDUCATION\n${divider}\n`;
    resumeData.education.forEach((edu) => {
      const degree = [edu.degree, edu.field ? `in ${edu.field}` : ""]
        .filter(Boolean)
        .join(" ");
      text += `${degree} | ${edu.institution || ""} | ${edu.graduation_year || ""}\n`;
      if (edu.gpa) text += `GPA: ${edu.gpa}\n`;
    });
    text += "\n";
  }

  // Certifications
  if (resumeData.certifications?.length) {
    text += `CERTIFICATIONS\n${divider}\n`;
    resumeData.certifications.forEach((cert) => {
      text += `${cert.name || ""}`;
      if (cert.issuer) text += ` — ${cert.issuer}`;
      if (cert.date) text += ` (${cert.date})`;
      text += "\n";
    });
    text += "\n";
  }

  // Projects
  if (resumeData.projects?.length) {
    text += `PROJECTS\n${divider}\n`;
    resumeData.projects.forEach((proj) => {
      text += `\n${proj.name || ""}\n`;
      if (proj.description) text += `${proj.description}\n`;
      if (proj.technologies?.length) {
        text += `Technologies: ${proj.technologies.join(", ")}\n`;
      }
      if (proj.link) text += `Link: ${proj.link}\n`;
    });
    text += "\n";
  }

  return text.trim();
}

export function copyToClipboard(text) {
  return navigator.clipboard.writeText(text);
}

export function downloadTextFile(text, filename) {
  const blob = new Blob([text], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
