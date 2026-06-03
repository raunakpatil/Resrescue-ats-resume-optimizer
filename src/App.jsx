import { useApp } from "./context/AppContext";
import { Header } from "./components/layout/Header";
import { Step1_ApiKey } from "./components/steps/Step1_ApiKey";
import { Step2_Inputs } from "./components/steps/Step2_Inputs";
import { Step3_Templates } from "./components/steps/Step3_Templates";
import { Step4_Processing } from "./components/steps/Step4_Processing";
import { Step5_Results } from "./components/steps/Step5_Results";
import { Toaster } from "sonner";
import { Component, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, info) {
    console.error("App crashed:", error, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ minHeight: "100vh", background: "#0a0a0f", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
          <div style={{ background: "#13131f", border: "1px solid rgba(239,68,68,0.3)", borderRadius: "16px", padding: "2rem", maxWidth: "600px", width: "100%" }}>
            <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>⚠️</div>
            <h2 style={{ color: "#f0f0f5", fontFamily: "Inter, sans-serif", marginBottom: "0.5rem" }}>Something went wrong</h2>
            <p style={{ color: "#9999b3", fontFamily: "Inter, sans-serif", fontSize: "0.875rem", marginBottom: "1rem" }}>
              Open browser DevTools (F12 → Console) to see the error details.
            </p>
            <pre style={{ background: "#0a0a0f", color: "#ef4444", padding: "1rem", borderRadius: "8px", fontSize: "0.75rem", overflow: "auto", maxHeight: "200px" }}>
              {this.state.error?.message || String(this.state.error)}
            </pre>
            <button
              onClick={() => window.location.reload()}
              style={{ marginTop: "1rem", background: "#6366f1", color: "white", border: "none", borderRadius: "8px", padding: "0.5rem 1.25rem", cursor: "pointer", fontFamily: "Inter, sans-serif" }}
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}


function StepContent() {
  const { currentStep } = useApp();

  const stepComponents = {
    1: Step1_ApiKey,
    2: Step2_Inputs,
    3: Step3_Templates,
    4: Step4_Processing,
    5: Step5_Results,
  };

  const StepComponent = stepComponents[currentStep] || Step1_ApiKey;

  return (
    <main className="flex-1 relative overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, y: 20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.98 }}
          transition={{ duration: 0.5, type: "spring", bounce: 0.2 }}
          className="w-full h-full"
        >
          <StepComponent />
        </motion.div>
      </AnimatePresence>
    </main>
  );
}

function SeamlessVideoBackground() {
  const [activeVideo, setActiveVideo] = useState(0);
  const video0Ref = useRef(null);
  const video1Ref = useRef(null);

  const handleTimeUpdate = (index) => {
    if (index !== activeVideo) return;
    
    const video = index === 0 ? video0Ref.current : video1Ref.current;
    if (!video) return;

    if (video.duration && video.duration - video.currentTime < 2.0) {
      const nextIndex = index === 0 ? 1 : 0;
      const nextVideo = nextIndex === 0 ? video0Ref.current : video1Ref.current;
      nextVideo.currentTime = 0;
      nextVideo.play().catch(e => console.log("Play failed", e));
      setActiveVideo(nextIndex);
    }
  };

  return (
    <>
      <video
        ref={video0Ref}
        onTimeUpdate={() => handleTimeUpdate(0)}
        className="video-bg"
        style={{ transition: "opacity 2s ease-in-out", opacity: activeVideo === 0 ? 1 : 0 }}
        autoPlay
        muted
        playsInline
      >
        <source src="./bg-video.mp4" type="video/mp4" />
      </video>
      <video
        ref={video1Ref}
        onTimeUpdate={() => handleTimeUpdate(1)}
        className="video-bg"
        style={{ transition: "opacity 2s ease-in-out", opacity: activeVideo === 1 ? 1 : 0 }}
        muted
        playsInline
      >
        <source src="./bg-video.mp4" type="video/mp4" />
      </video>
    </>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      {/* Video Background */}
      <SeamlessVideoBackground />
      <div className="video-bg-overlay"></div>

      <div className="min-h-screen gradient-bg flex flex-col relative z-0 pt-8 content-wrapper">
        {/* Custom Draggable Titlebar Region */}
        <div className="titlebar-drag-region"></div>

        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "#1c1c2e",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "#f0f0f5",
              fontFamily: "Inter, sans-serif",
              fontSize: "13px",
            },
            duration: 3000,
          }}
          richColors
        />
        <Header />
        <StepContent />
        {/* Footer */}
        <footer className="border-t border-white/5 py-6 px-4 text-center">
          <a href="https://github.com/raunakpatil" target="_blank" rel="noopener noreferrer" className="inline-block text-[14px] text-text-secondary mb-3 font-semibold hover:text-[var(--text-primary)] transition-colors group">
            Developed with ❤️ by <span className="text-fuchsia-400 font-bold group-hover:text-fuchsia-300 transition-colors">raunakpatil</span>
          </a>
          <div className="text-center text-[var(--text-secondary)] text-[11px] flex flex-col items-center gap-2">
            <div className="flex items-center gap-3 text-[10px] text-[var(--text-tertiary)] bg-white/5 px-4 py-2 rounded-full border border-white/10">
              <span>· 100% Client-side Processing</span>
              <span>· Your data never leaves your computer</span>
              <span>· Built with care for lazy jobseekers</span>
            </div>
          </div>
        </footer>
      </div>
    </ErrorBoundary>
  );
}
