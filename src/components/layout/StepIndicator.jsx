import { useApp } from "../../context/AppContext";

const steps = [
  { number: 1, label: "API Key" },
  { number: 2, label: "Inputs" },
  { number: 3, label: "Mode" },
  { number: 4, label: "Processing" },
  { number: 5, label: "Results" },
];

export function StepIndicator() {
  const { currentStep } = useApp();

  return (
    <div className="flex items-center justify-center gap-0">
      {steps.map((step, idx) => {
        const isCompleted = currentStep > step.number;
        const isActive = currentStep === step.number;
        const isLast = idx === steps.length - 1;

        return (
          <div key={step.number} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={`
                  w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold
                  transition-all duration-300
                  ${isCompleted
                    ? "bg-success text-white shadow-[0_0_12px_rgba(34,197,94,0.4)]"
                    : isActive
                    ? "bg-accent-primary text-white shadow-[0_0_12px_rgba(99,102,241,0.5)] scale-110"
                    : "bg-bg-elevated text-text-secondary border border-white/10"
                  }
                `}
              >
                {isCompleted ? (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  step.number
                )}
              </div>
              <span
                className={`
                  mt-1 text-xs font-medium transition-all duration-300
                  ${isActive ? "text-accent-primary" : isCompleted ? "text-success" : "text-text-secondary"}
                `}
              >
                {step.label}
              </span>
            </div>
            {!isLast && (
              <div
                className={`
                  h-px w-10 md:w-16 mx-1 mb-4 transition-all duration-500
                  ${isCompleted ? "bg-success" : "bg-white/10"}
                `}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
