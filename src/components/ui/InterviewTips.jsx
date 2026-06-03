import { useState } from "react";

const categoryColors = {
  Behavioral: { bg: "bg-blue-500/10", text: "text-blue-400", border: "border-blue-500/25" },
  Technical: { bg: "bg-green-500/10", text: "text-green-400", border: "border-green-500/25" },
  Situational: { bg: "bg-purple-500/10", text: "text-purple-400", border: "border-purple-500/25" },
  "Culture Fit": { bg: "bg-amber-500/10", text: "text-amber-400", border: "border-amber-500/25" },
  Salary: { bg: "bg-rose-500/10", text: "text-rose-400", border: "border-rose-500/25" },
};

function TipCard({ tip, index }) {
  const [expanded, setExpanded] = useState(false);
  const colors = categoryColors[tip.category] || categoryColors.Behavioral;

  return (
    <div className="glass-card border-white/8 overflow-hidden transition-all duration-300 hover:border-white/15">
      <div
        className="p-4 cursor-pointer"
        onClick={() => setExpanded((v) => !v)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && setExpanded((v) => !v)}
        aria-expanded={expanded}
        id={`interview-tip-${index}`}
      >
        <div className="flex items-start gap-3">
          <div className={`w-8 h-8 rounded-lg ${colors.bg} border ${colors.border} flex items-center justify-center flex-shrink-0 text-sm font-bold ${colors.text}`}>
            {index + 1}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2 mb-1">
              <span className={`badge text-[10px] ${colors.bg} ${colors.text} border ${colors.border}`}>
                {tip.category}
              </span>
              <svg
                className={`w-4 h-4 text-text-secondary flex-shrink-0 transition-transform duration-300 ${expanded ? "rotate-180" : ""}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
            <p className="text-sm font-medium text-text-primary leading-snug">
              {tip.tip}
            </p>
          </div>
        </div>
      </div>

      {expanded && (
        <div className="px-4 pb-4 border-t border-white/5 pt-3 space-y-3">
          {tip.sample_question && (
            <div className="glass-card p-3 bg-white/3 border-white/5 rounded-lg">
              <p className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1">
                Likely Question
              </p>
              <p className="text-sm text-text-primary italic">"{tip.sample_question}"</p>
            </div>
          )}
          {tip.suggested_approach && (
            <div>
              <p className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1">
                Suggested Approach
              </p>
              <p className="text-sm text-text-secondary leading-relaxed">{tip.suggested_approach}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function InterviewTips({ tips = [] }) {
  if (!tips.length) {
    return (
      <div className="text-center py-8 text-text-secondary">
        <p>No interview tips available</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {tips.map((tip, i) => (
        <TipCard key={i} tip={tip} index={i} />
      ))}
    </div>
  );
}
