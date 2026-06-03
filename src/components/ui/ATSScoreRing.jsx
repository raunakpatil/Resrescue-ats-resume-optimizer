import { useEffect, useRef } from "react";
import { getScoreConfig } from "../../utils/constants";

export function ATSScoreRing({ score = 0, size = 140, strokeWidth = 10, animated = true }) {
  const config = getScoreConfig(score);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (score / 100) * circumference;

  const ringRef = useRef(null);

  useEffect(() => {
    if (!animated || !ringRef.current) return;
    const el = ringRef.current;
    // Animate stroke-dashoffset from circumference to dashOffset
    el.style.strokeDashoffset = circumference;
    el.style.transition = "none";
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        el.style.transition = "stroke-dashoffset 1.4s cubic-bezier(0.4, 0, 0.2, 1)";
        el.style.strokeDashoffset = dashOffset;
      });
    });
  }, [score, circumference, dashOffset, animated]);

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        className="-rotate-90"
        aria-label={`ATS Score: ${score} out of 100`}
      >
        {/* Background track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth={strokeWidth}
        />
        {/* Score ring */}
        <circle
          ref={ringRef}
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={config.color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={animated ? circumference : dashOffset}
          style={{
            filter: `drop-shadow(0 0 6px ${config.color}80)`,
          }}
        />
      </svg>
      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          className="font-mono font-bold leading-none"
          style={{ fontSize: size * 0.22, color: config.color }}
        >
          {score}
        </span>
        <span className="text-text-secondary font-mono" style={{ fontSize: size * 0.09 }}>
          / 100
        </span>
      </div>
    </div>
  );
}
