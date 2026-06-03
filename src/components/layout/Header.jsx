import { StepIndicator } from "./StepIndicator";
import { useApp } from "../../context/AppContext";
import wideLogoUrl from "../../assets/wide-logo.png";

export function Header() {
  const { currentStep } = useApp();

  if (currentStep === 1) return null;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-white/5 backdrop-blur-2xl shadow-lg">
      <div className="max-w-[1600px] 2xl:max-w-[2000px] mx-auto px-4 xl:px-8 2xl:px-16 py-3">
        <div className="flex flex-col md:flex-row items-center gap-3 md:gap-8">
          {/* Logo */}
          <div className="flex items-center gap-2.5 shrink-0 z-50 relative">
            <div className="h-10 flex items-center justify-center">
              <img 
                src={wideLogoUrl} 
                alt="Raunak's ResRescue Logo" 
                className="h-full w-auto object-contain scale-[2] sm:scale-[2.2] origin-left drop-shadow-[0_15px_15px_rgba(0,0,0,0.6)]" 
              />
            </div>
          </div>

          {/* Step Indicator */}
          {currentStep > 1 && currentStep <= 5 && (
            <div className="flex-1 flex justify-center">
              <StepIndicator />
            </div>
          )}

          {/* Right badges */}
          <div className="hidden md:flex items-center gap-3 shrink-0">
            <span className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0d2a1f] border border-[#144230] text-[#4ade80] text-[11px] font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-[#4ade80]" />
              Free Forever
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#181825] border border-[#313248] text-[#9999b3] text-[11px] font-medium">
              <svg className="w-3.5 h-3.5 text-[#9999b3]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              100% Client-Side
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
