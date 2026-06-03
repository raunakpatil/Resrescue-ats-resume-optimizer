import { useState, useCallback } from "react";
import { runOptimizationPipeline } from "../agents/orchestrator";
import { initGemini } from "../utils/geminiClient";
import { AGENTS } from "../utils/constants";

const initialAgentStates = AGENTS.map((a) => ({
  ...a,
  status: "pending", // pending | processing | complete | error | skipped
  currentMessage: a.messages[0],
}));

export function useResumeOptimizer() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [agentStates, setAgentStates] = useState(initialAgentStates);
  const [overallProgress, setOverallProgress] = useState(0);
  const [result, setResult] = useState(null);
  const [errors, setErrors] = useState([]);
  const [currentAgentId, setCurrentAgentId] = useState(null);

  const resetStates = useCallback(() => {
    setAgentStates(initialAgentStates.map((a) => ({ ...a, status: "pending" })));
    setOverallProgress(0);
    setResult(null);
    setErrors([]);
    setCurrentAgentId(null);
  }, []);

  const optimize = useCallback(
    async (apiKey, jobDescription, resumeText, optimizationMode = "god") => {
      resetStates();
      setIsProcessing(true);

      // Initialize Gemini
      initGemini(apiKey);

      // Message cycling intervals per agent
      const messageIntervals = {};

      const onProgress = (agentId, agentName, status, progress) => {
        setCurrentAgentId(agentId);
        setOverallProgress(progress);

        setAgentStates((prev) =>
          prev.map((a) => {
            if (a.id === agentId) {
              // Clear existing interval
              if (messageIntervals[agentId]) {
                clearInterval(messageIntervals[agentId]);
                delete messageIntervals[agentId];
              }

              // Start cycling messages if processing
              if (status === "processing" && a.messages.length > 1) {
                let msgIdx = 0;
                messageIntervals[agentId] = setInterval(() => {
                  msgIdx = (msgIdx + 1) % a.messages.length;
                  setAgentStates((prev2) =>
                    prev2.map((a2) =>
                      a2.id === agentId
                        ? { ...a2, currentMessage: a2.messages[msgIdx] }
                        : a2
                    )
                  );
                }, 2500);
              }

              return {
                ...a,
                status,
                currentMessage: status === "processing" ? a.messages[0] : a.currentMessage,
              };
            }
            return a;
          })
        );
      };

      try {
        const pipelineResult = await runOptimizationPipeline(
          jobDescription,
          resumeText,
          optimizationMode,
          onProgress
        );
        setResult(pipelineResult);
        setErrors(pipelineResult.errors || []);
      } catch (err) {
        setErrors([{ agent: "Pipeline", error: err.message }]);
      } finally {
        // Clear all intervals
        Object.values(messageIntervals).forEach(clearInterval);
        setIsProcessing(false);
        setOverallProgress(100);
      }
    },
    [resetStates]
  );

  return {
    optimize,
    isProcessing,
    agentStates,
    overallProgress,
    result,
    errors,
    currentAgentId,
    resetStates,
  };
}
