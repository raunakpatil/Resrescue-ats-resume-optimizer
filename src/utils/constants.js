export const TEMPLATES = [
  {
    id: "classic",
    name: "Classic Professional",
    bestFor: "Finance, Law, Government",
    atsScore: 99,
    description: "Traditional single-column layout. Maximum ATS compatibility.",
    colors: { primary: "#1a3a5c", accent: "#1a3a5c", bg: "#ffffff" },
    icon: "🏛️",
  }
];

export const AGENTS = [
  {
    id: "jdAnalyzer",
    name: "Job Detective",
    icon: "🔍",
    description: "Finding what recruiters actually care about.",
    messages: [
      "Scanning job description for hidden requirements...",
      "Identifying required vs preferred skills...",
      "Decoding corporate jargon...",
      "Extracting power phrases...",
    ],
  },
  {
    id: "resumeParser",
    name: "Resume Archaeologist",
    icon: "📄",
    description: "Digging through your work history for hidden gems...",
    messages: [
      "Dusting off forgotten achievements...",
      "Extracting your timeline...",
      "Identifying underlying technologies...",
      "Cataloguing your education...",
    ],
  },
  {
    id: "gapAnalyzer",
    name: "Gap Hunter",
    icon: "🎯",
    description: "Spotting missing skills and opportunities.",
    messages: [
      "Calculating keyword match score...",
      "Spotting critical skill gaps...",
      "Planning optimization strategy...",
      "Mapping transferable skills...",
    ],
  },
  {
    id: "summaryWriter",
    name: "Pitch Writer",
    icon: "🚀",
    description: "Crafting a summary recruiters will actually read.",
    messages: [
      "Analyzing your strongest selling points...",
      "Integrating critical keywords...",
      "Matching tone to the job description...",
      "Polishing the opening hook...",
    ],
  },
  {
    id: "experienceRewriter",
    name: "Impact Booster",
    icon: "📊",
    description: "Turning responsibilities into quantified achievements.",
    messages: [
      "Identifying achievement opportunities...",
      "Applying strong action verbs...",
      "Quantifying impact and results...",
      "Injecting relevant keywords naturally...",
    ],
  },
  {
    id: "projectsRewriter",
    name: "Project Expander",
    icon: "🏗️",
    description: "Adding realistic metrics and depth to your projects.",
    messages: [
      "Analyzing project architecture...",
      "Inferring realistic impact metrics...",
      "Expanding technical descriptions...",
      "Injecting relevant ATS keywords...",
    ],
  },
  {
    id: "skillsCurator",
    name: "Skills Curator",
    icon: "🛠️",
    description: "Curating and reordering skills for maximum relevance.",
    messages: [
      "Ranking skills by job relevance...",
      "Removing outdated buzzwords...",
      "Adding demonstrable missing skills...",
      "Organizing into logical categories...",
    ],
  },
  {
    id: "atsScorer",
    name: "ATS Simulator",
    icon: "🤖",
    description: "Running your resume through a strict ATS simulation.",
    messages: [
      "Calculating keyword density...",
      "Checking formatting compliance...",
      "Scoring content quality...",
      "Generating final improvements...",
    ],
  },
  {
    id: "qaAgent",
    name: "QA Review",
    icon: "✅",
    description: "Final accuracy, consistency, and tone check.",
    messages: [
      "Verifying no fabrications are present...",
      "Checking date and title consistency...",
      "Correcting verb tense issues...",
      "Doing a final professional tone review...",
    ],
  },
  {
    id: "extras",
    name: "Bonus Generator",
    icon: "🎁",
    description: "Preparing cover letters and interview tips.",
    messages: [
      "Crafting a personalized cover letter...",
      "Generating interview prep tips...",
      "Identifying likely interview questions...",
      "Packaging all deliverables...",
    ],
  },
];

export const ATS_SCORE_CONFIG = {
  excellent: { min: 90, label: "Excellent — Top Tier", color: "#22c55e" },
  strong: { min: 75, label: "Strong — Well Positioned", color: "#3b82f6" },
  good: { min: 60, label: "Good — Room to Improve", color: "#f59e0b" },
  poor: { min: 0, label: "Needs Work — At Risk", color: "#ef4444" },
};

export function getScoreConfig(score) {
  if (score >= 90) return ATS_SCORE_CONFIG.excellent;
  if (score >= 75) return ATS_SCORE_CONFIG.strong;
  if (score >= 60) return ATS_SCORE_CONFIG.good;
  return ATS_SCORE_CONFIG.poor;
}

export const MAX_INPUT_LENGTH = 15000;
export const MIN_JD_LENGTH = 50;
export const MIN_RESUME_LENGTH = 200;
