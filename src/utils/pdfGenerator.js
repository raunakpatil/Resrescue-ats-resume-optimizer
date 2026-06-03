import { pdf } from "@react-pdf/renderer";
import React from "react";

export async function downloadResumePDF(resumeData, TemplateComponent) {
  try {
    const element = React.createElement(TemplateComponent, { resumeData });
    const blob = await pdf(element).toBlob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    const nameStr = resumeData?.contact?.name
      ? resumeData.contact.name.replace(/[^a-zA-Z0-9]/g, "_")
      : "Candidate";
    const titleStr = resumeData?.contact?.jobTitle
      ? resumeData.contact.jobTitle.replace(/[^a-zA-Z0-9]/g, "_")
      : "Role";
    const fileName = `${nameStr}_${titleStr}_Resume`.replace(/_+/g, "_") + ".pdf";
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    return true;
  } catch (err) {
    console.error("PDF generation error:", err);
    throw new Error("Failed to generate PDF. Please try again.");
  }
}

export async function getPDFBlob(resumeData, TemplateComponent) {
  const element = React.createElement(TemplateComponent, { resumeData });
  return await pdf(element).toBlob();
}
