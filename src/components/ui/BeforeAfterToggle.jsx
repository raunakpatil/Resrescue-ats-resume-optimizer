import { useState } from "react";

export function BeforeAfterToggle({ before, after, label = "Summary" }) {
  const [showAfter, setShowAfter] = useState(true);

  return (
    <div>
      {/* Toggle control */}
      <div className="flex items-center gap-3 mb-3">
        <span className={`text-xs font-medium transition-colors ${!showAfter ? "text-text-primary" : "text-text-secondary"}`}>
          Original
        </span>
        <button
          id="before-after-toggle"
          onClick={() => setShowAfter((v) => !v)}
          className={`
            relative w-12 h-6 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-accent-primary/50
            ${showAfter ? "bg-accent-primary" : "bg-white/15"}
          `}
          aria-label={showAfter ? "Showing optimized version" : "Showing original version"}
        >
          <span
            className={`
              absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all duration-300
              ${showAfter ? "left-7" : "left-1"}
            `}
          />
        </button>
        <span className={`text-xs font-medium transition-colors ${showAfter ? "text-accent-primary" : "text-text-secondary"}`}>
          Optimized
        </span>
        {showAfter && (
          <span className="badge badge-success text-[10px] ml-1">AI Enhanced</span>
        )}
      </div>

      {/* Content */}
      <div className="relative overflow-hidden">
        <div
          className={`
            transition-all duration-500 ease-out
            ${showAfter ? "opacity-0 absolute inset-0 pointer-events-none translate-y-2" : "opacity-100"}
          `}
        >
          {before ? (
            <div className="glass-card p-4 border-white/6">
              <p className="text-sm text-text-secondary leading-relaxed whitespace-pre-wrap">{before}</p>
            </div>
          ) : (
            <div className="glass-card p-4 border-white/6 text-center text-text-secondary text-sm">
              No original {label.toLowerCase()} provided
            </div>
          )}
        </div>
        <div
          className={`
            transition-all duration-500 ease-out
            ${!showAfter ? "opacity-0 absolute inset-0 pointer-events-none translate-y-2" : "opacity-100"}
          `}
        >
          {after ? (
            <div className="glass-card p-4 border-accent-primary/20 bg-accent-primary/5">
              <p className="text-sm text-text-primary leading-relaxed whitespace-pre-wrap">{after}</p>
            </div>
          ) : (
            <div className="glass-card p-4 border-white/6 text-center text-text-secondary text-sm">
              Optimized {label.toLowerCase()} not available
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
