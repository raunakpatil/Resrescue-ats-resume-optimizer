export function AgentProgressCard({ agent, isActive }) {
  const { name, icon, description, status, currentMessage } = agent;

  const statusConfig = {
    pending: {
      container: "bg-[#0a0a0f] border-[#1e1e2e]",
      iconBg: "bg-[#11111a] border border-[#232336]",
      title: "text-white",
      desc: "text-[#64748b]",
      badge: null,
    },
    processing: {
      container: "bg-[#1e1b4b]/40 border-[#6366f1] shadow-[0_0_30px_rgba(99,102,241,0.15)]",
      iconBg: "bg-[#312e81]/50 border border-[#4f46e5]",
      title: "text-white font-bold",
      desc: "text-[#818cf8]",
      badge: (
        <span className="flex items-center gap-1.5 text-[11px] text-[#818cf8] font-semibold animate-pulse">
          <span className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
          Processing
        </span>
      ),
    },
    complete: {
      container: "bg-[#0a0a0f] border-[#1e1e2e]",
      iconBg: "bg-[#11111a] border border-[#232336]",
      title: "text-white font-bold",
      desc: "text-[#64748b]",
      badge: (
        <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#064e3b]/50 border border-[#059669]/50 text-[#10b981] text-[11px] font-bold tracking-wide">
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          Done
        </span>
      ),
    },
    error: {
      container: "bg-[#450a0a]/20 border-[#991b1b]/50",
      iconBg: "bg-[#7f1d1d]/30 border border-[#991b1b]",
      title: "text-white",
      desc: "text-[#ef4444]",
      badge: (
        <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#7f1d1d]/50 border border-[#991b1b]/50 text-[#ef4444] text-[11px] font-bold tracking-wide">
          Error
        </span>
      ),
    },
    skipped: {
      container: "bg-[#0a0a0f] border-[#1e1e2e]",
      iconBg: "bg-[#11111a] border border-[#232336]",
      title: "text-[#64748b]",
      desc: "text-[#475569]",
      badge: null,
    },
  };

  const config = statusConfig[status] || statusConfig.pending;

  return (
    <div
      className={`
        relative flex items-center gap-4 px-5 py-4 rounded-xl border transition-all duration-500 overflow-hidden
        ${config.container}
      `}
    >
      {/* Active state background glow */}
      {isActive && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#4f46e5]/10 to-transparent animate-shimmer" />
      )}

      {/* Icon */}
      <div className={`relative z-10 w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 transition-all duration-500 ${config.iconBg}`}>
        {icon}
      </div>

      {/* Content */}
      <div className="relative z-10 flex-1 min-w-0">
        <div className="flex items-center justify-between gap-3 mb-1">
          <h4 className={`text-[15px] tracking-tight ${config.title}`}>{name}</h4>
          {config.badge}
        </div>
        
        {/* Main description */}
        {status !== "processing" && (
          <p className={`text-[13px] truncate ${config.desc}`}>
            {description}
          </p>
        )}

        {/* Processing specific animated text */}
        {status === "processing" && (
          <p className="text-[12.5px] text-[#a5b4fc] flex items-center gap-1.5 animate-pulse">
            <span className="text-[#818cf8]">✨</span> {currentMessage}
          </p>
        )}
      </div>
    </div>
  );
}
