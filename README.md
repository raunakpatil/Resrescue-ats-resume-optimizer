# 🚀 Raunak's ResRescue (ATS Resume Optimizer)

Welcome to **Raunak's ResRescue**, a next-generation desktop application designed to beat Applicant Tracking Systems (ATS) and help you land interviews. Built with a stunning liquid-glass user interface, this tool leverages the power of the Google Gemini API to analyze, restructure, and supercharge your resume against any target Job Description (JD).

![Raunak's ResRescue UI](src/assets/wide-logo.png)

## ✨ Core Features

*   **📊 Deep ATS Analysis**: Get a brutal, honest ATS score out of 100. Uncover hidden requirements, identify "hard gaps" vs "soft gaps", and see exactly which Tier-1 keywords your resume is missing.
*   **🔄 AI-Powered Resume Rewrite**: Automatically rewrite your bullet points to match the JD's exact phrasing without fabricating experience. Includes a side-by-side "Before & After" diff viewer.
*   **🎨 Multi-Template Exports**: Generate production-ready resumes instantly. Export to both **PDF** and **DOCX** formats using 5 distinct templates (Classic, Modern, Executive, Creative, and Tech).
*   **✉️ Cover Letter & Recruiter Emails**: Instantly generate targeted cover letters and highly-optimized "cold emails" for recruiters with a clear "foot-in-the-door" ask.
*   **💡 Project Suggestions**: Lacking experience? The AI acts as a Senior Tech Lead to suggest 3 highly relevant side projects (including tech stacks and strategic reasoning) to bridge the gap.
*   **🎯 Interview Prep**: Prepare for the battle. Generates behavioral, technical, and situational interview questions based specifically on your newly optimized resume.
*   **🗄️ Local History & Privacy**: Your data stays yours. Past optimizations and PDFs are saved directly to your local machine for easy access and re-downloading.

## 🏗️ How It Works

The optimization pipeline runs 6 specialized AI agents sequentially to rebuild your resume and outreach strategy:

```text
Upload PDF ──► ATS Audit ──► Gap Analysis ──► Experience Rewrite ──► Template Engine ──► PDF / DOCX
                                  │
                                  └──► Project Suggestions & Recruiter Outreach
```

| Phase | Agent / Module | What it does |
|---|---|---|
| **1 · Parse & Audit** | `atsScorer.js` | Parses the uploaded PDF, extracts current text, and brutally scores it against the Job Description. |
| **2 · Gap Analysis** | `gapAnalyzer.js` | Identifies missing Tier-1 keywords, "hard gaps" (missing skills), and "soft gaps" (poorly framed skills). |
| **3 · Rewrite** | `experienceRewriter.js` | Reframes existing bullet points to naturally integrate missing keywords without fabricating data. |
| **4 · Suggestions** | `projectSuggestions.js` | Acts as a Senior Tech Lead to suggest 3 high-impact portfolio projects to bridge your "hard gaps". |
| **5 · Outreach** | `coverLetterAgent.js` | Generates a tailored cover letter and a punchy, targeted cold email for the hiring manager. |
| **6 · Export** | `pdfGenerator.js` | Injects the optimized data into React-PDF templates to instantly render pixel-perfect resumes locally. |

## 🛠️ Technology Stack

*   **Frontend UI**: React 18, Vite, TailwindCSS (v3)
*   **Animations**: Framer Motion (Liquid Glassmorphism Design System)
*   **Desktop Framework**: Electron, electron-builder
*   **Document Generation**: `@react-pdf/renderer` (PDFs), `docx` (Word Documents)
*   **AI Engine**: `@google/generative-ai` (Gemini 1.5 Pro/Flash)
*   **Icons**: Lucide React

## 🚀 Getting Started

### Prerequisites
*   Node.js (v18 or higher recommended)
*   A Google Gemini API Key (Grab one for free from Google AI Studio)

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/raunakpatil/Resrescue-ats-resume-optimizer.git
    cd Resrescue-ats-resume-optimizer
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Run in Development Mode**
    Start both the Vite development server and the Electron wrapper:
    ```bash
    npm run dev
    ```

4.  **Build for Production**
    Compile the React app and package it into a standalone Windows `.exe` installer:
    ```bash
    npm run electron:build
    ```
    *The generated installer will be located in the `release/` directory.*

## 💎 Design Philosophy

ResRescue is built around Apple's latest Human Interface Design principles, specifically mimicking a "Liquid Glass" aesthetic. It features real-time background blurs, frosted glass panels, subtle refractions, and fluid micro-interactions, ensuring that the desktop application feels incredibly premium and native.

## 🤝 Contributing

Contributions, issues, and feature requests are always welcome! Feel free to check the issues page or submit a Pull Request.

## 📝 License

This project is open-source and free to use. 

---
*Built with ❤️ by Raunak Patil.*
