export function SkillsDiffView({ added = [], removed = [], kept = [] }) {
  return (
    <div className="space-y-4">
      {added.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-5 h-5 rounded-full bg-success/15 flex items-center justify-center text-success text-xs font-bold">+</span>
            <span className="text-xs font-semibold text-success uppercase tracking-wider">Added ({added.length})</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {added.map((skill, i) => (
              <span
                key={i}
                className="px-3 py-1 rounded-full text-xs font-medium bg-success/10 text-success border border-success/25 flex items-center gap-1"
              >
                <span className="font-bold">+</span>
                {typeof skill === "string" ? skill : skill.name || skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {removed.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-5 h-5 rounded-full bg-error/15 flex items-center justify-center text-error text-xs font-bold">−</span>
            <span className="text-xs font-semibold text-error uppercase tracking-wider">Removed ({removed.length})</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {removed.map((skill, i) => (
              <span
                key={i}
                className="px-3 py-1 rounded-full text-xs font-medium bg-error/10 text-error border border-error/25 flex items-center gap-1 line-through opacity-70"
              >
                {typeof skill === "string" ? skill : skill.name || skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {kept.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-5 h-5 rounded-full bg-white/8 flex items-center justify-center text-text-secondary text-xs font-bold">○</span>
            <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Kept ({kept.length})</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {kept.map((skill, i) => (
              <span
                key={i}
                className="px-3 py-1 rounded-full text-xs font-medium bg-white/5 text-text-secondary border border-white/8"
              >
                {typeof skill === "string" ? skill : skill.name || skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {added.length === 0 && removed.length === 0 && kept.length === 0 && (
        <p className="text-text-secondary text-sm text-center py-4">No skills diff data available</p>
      )}
    </div>
  );
}
