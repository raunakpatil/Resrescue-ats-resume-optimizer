import { createContext, useContext, useReducer, useEffect, useState } from "react";

const AppContext = createContext(null);

const initialState = {
  currentStep: 1,
  apiKey: "",
  jobDescription: "",
  resumeText: "",
  selectedTemplate: "classic",
  optimizationMode: "god", // "god" | "pro"
  pipelineResult: null,
  history: [], 
};

function appReducer(state, action) {
  switch (action.type) {
    case "SET_STEP":
      return { ...state, currentStep: action.payload };
    case "SET_API_KEY":
      return { ...state, apiKey: action.payload };
    case "SET_JD":
      return { ...state, jobDescription: action.payload };
    case "SET_RESUME":
      return { ...state, resumeText: action.payload };
    case "SET_TEMPLATE":
      return { ...state, selectedTemplate: action.payload };
    case "SET_MODE":
      return { ...state, optimizationMode: action.payload };
    case "SET_RESULT":
      return { ...state, pipelineResult: action.payload };
    case "SET_FULL_HISTORY":
      return { ...state, history: action.payload };
    case "ADD_HISTORY": {
      // Prepend the new history entry (no size limit)
      return { ...state, history: [action.payload, ...state.history] };
    }
    case "DELETE_HISTORY_ITEM": {
      return { ...state, history: state.history.filter(item => item.id !== action.payload) };
    }
    case "DELETE_MULTIPLE_HISTORY": {
      return { ...state, history: state.history.filter(item => !action.payload.includes(item.id)) };
    }
    case "CLEAR_ALL_HISTORY": {
      return { ...state, history: [] };
    }
    case "RESET":
      return {
        ...initialState,
        apiKey: state.apiKey, // preserve API key
        history: state.history, // preserve history
      };
    case "RESET_FOR_NEW_JD":
      return {
        ...state,
        jobDescription: "",
        pipelineResult: null,
        currentStep: 2, // Go back to inputs
      };
    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState, (init) => {
    // Hydrate synchronous things only (API key)
    try {
      const savedKey = localStorage.getItem("ats_api_key") || "";
      return { ...init, apiKey: savedKey };
    } catch {
      return init;
    }
  });

  const [historyLoaded, setHistoryLoaded] = useState(false);

  useEffect(() => {
    // Async load history
    if (window.electronAPI && window.electronAPI.loadHistory) {
      window.electronAPI.loadHistory().then(savedHistory => {
        if (Array.isArray(savedHistory)) dispatch({ type: "SET_FULL_HISTORY", payload: savedHistory });
        setHistoryLoaded(true);
      });
    } else {
      try {
        const savedHistory = JSON.parse(localStorage.getItem("ats_history") || "[]");
        dispatch({ type: "SET_FULL_HISTORY", payload: savedHistory });
      } catch {}
      setHistoryLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!historyLoaded) return;
    if (window.electronAPI && window.electronAPI.saveHistory) {
      window.electronAPI.saveHistory(state.history);
    } else {
      try { localStorage.setItem("ats_history", JSON.stringify(state.history)); } catch {}
    }
  }, [state.history, historyLoaded]);

  const setStep = (step) => dispatch({ type: "SET_STEP", payload: step });
  const setApiKey = (key) => {
    dispatch({ type: "SET_API_KEY", payload: key });
    try { localStorage.setItem("ats_api_key", key); } catch {}
  };
  const setJD = (jd) => dispatch({ type: "SET_JD", payload: jd });
  const setResume = (r) => dispatch({ type: "SET_RESUME", payload: r });
  const setTemplate = (t) => dispatch({ type: "SET_TEMPLATE", payload: t });
  const setOptimizationMode = (m) => dispatch({ type: "SET_MODE", payload: m });
  const setResult = (r) => dispatch({ type: "SET_RESULT", payload: r });
  const addHistory = (resultPayload) => {
    const entry = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 5),
      timestamp: Date.now(),
      jobTitle: resultPayload.jdAnalysis?.job_title || resultPayload.finalResume?.contact?.jobTitle || "Custom Role",
      companyName: resultPayload.jdAnalysis?.company_name || "Unknown Company",
      selectedTemplate: state.selectedTemplate,
      ...resultPayload
    };
    dispatch({ type: "ADD_HISTORY", payload: entry });
  };
  const deleteHistoryItem = (id) => dispatch({ type: "DELETE_HISTORY_ITEM", payload: id });
  const deleteMultipleHistory = (ids) => dispatch({ type: "DELETE_MULTIPLE_HISTORY", payload: ids });
  const clearAllHistory = () => dispatch({ type: "CLEAR_ALL_HISTORY" });
  const reset = () => dispatch({ type: "RESET" });
  const resetForNewJD = () => dispatch({ type: "RESET_FOR_NEW_JD" });

  return (
    <AppContext.Provider
      value={{
        ...state,
        setStep,
        setApiKey,
        setJD,
        setResume,
        setTemplate,
        setOptimizationMode,
        setResult,
        addHistory,
        deleteHistoryItem,
        deleteMultipleHistory,
        clearAllHistory,
        reset,
        resetForNewJD,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
