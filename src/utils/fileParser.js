import mammoth from 'mammoth/mammoth.browser.js';

/**
 * Extracts raw text from an uploaded File (PDF, DOCX, or TXT).
 * Runs entirely locally in the browser.
 * 
 * @param {File} file 
 * @returns {Promise<string>}
 */
export async function parseFileToText(file) {
  const extension = file.name.split('.').pop().toLowerCase();
  
  if (extension === 'pdf') {
    return await parsePDF(file);
  } else if (extension === 'docx') {
    return await parseDOCX(file);
  } else if (extension === 'txt') {
    return await file.text();
  } else {
    throw new Error('Unsupported file type. Please upload a PDF, DOCX, or TXT file.');
  }
}

async function parsePDF(file) {
  try {
    if (!window.electronAPI || !window.electronAPI.parsePdf) {
      throw new Error("Electron API is missing");
    }
    const arrayBuffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);
    return await window.electronAPI.parsePdf(uint8Array);
  } catch (error) {
    console.error("PDF Parsing error:", error);
    throw new Error("PDF Error: " + (error.message || error));
  }
}

async function parseDOCX(file) {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    return result.value.trim();
  } catch (error) {
    console.error("DOCX Parsing error:", error);
    throw new Error("Failed to extract text from DOCX document.");
  }
}
