export function KeywordChips({ matched = [], missing = [], neutral = [] }) {
  return (
    <div className="space-y-3">
      {matched.length > 0 && (
        <div>
          <div className="section-label mb-2">
            ✓ Matched Keywords ({matched.length})
          </div>
          <div className="flex flex-wrap gap-2">
            {matched.map((kw, i) => (
              <span
                key={i}
                className="px-2.5 py-1 rounded-full text-xs font-medium bg-success/10 text-success border border-success/25 transition-all hover:bg-success/20"
              >
                {kw}
              </span>
            ))}
          </div>
        </div>
      )}
      {missing.length > 0 && (
        <div>
          <div className="section-label mb-2 text-error">
            ✗ Missing Keywords ({missing.length})
          </div>
          <div className="flex flex-wrap gap-2">
            {missing.map((kw, i) => (
              <span
                key={i}
                className="px-2.5 py-1 rounded-full text-xs font-medium bg-error/10 text-error border border-error/25 transition-all hover:bg-error/20"
              >
                {kw}
              </span>
            ))}
          </div>
        </div>
      )}
      {neutral.length > 0 && (
        <div>
          <div className="section-label mb-2">Other Keywords</div>
          <div className="flex flex-wrap gap-2">
            {neutral.map((kw, i) => (
              <span
                key={i}
                className="px-2.5 py-1 rounded-full text-xs font-medium bg-white/5 text-text-secondary border border-white/8"
              >
                {kw}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
