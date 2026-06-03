import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  // 'light', 'dark', 'system'
  const [themeSource, setThemeSource] = useState(() => {
    return localStorage.getItem("ats_theme_source") || "system";
  });
  
  // 'light', 'dark' (actual resolved theme)
  const [resolvedTheme, setResolvedTheme] = useState("dark");
  const [isFocused, setIsFocused] = useState(true);

  useEffect(() => {
    // 1. Initial resolution of theme from OS
    const resolveInitialTheme = async () => {
      if (window.electronAPI?.getTheme) {
        const osTheme = await window.electronAPI.getTheme();
        if (themeSource === "system") {
          setResolvedTheme(osTheme);
        } else {
          setResolvedTheme(themeSource);
        }
      } else {
        // Fallback for web mode
        const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        setResolvedTheme(themeSource === "system" ? (isDark ? "dark" : "light") : themeSource);
      }
    };
    resolveInitialTheme();

    // 2. Listen to OS theme changes via IPC
    const removeThemeListener = window.electronAPI?.onThemeChanged?.((newOsTheme) => {
      if (themeSource === "system") {
        setResolvedTheme(newOsTheme);
      }
    });

    // 3. Listen to Window Focus events
    const removeBlurListener = window.electronAPI?.onWindowBlur?.(() => setIsFocused(false));
    const removeFocusListener = window.electronAPI?.onWindowFocus?.(() => setIsFocused(true));

    return () => {
      // Note: we can't easily remove IPC listeners without modifying preload to return a removal func.
      // Since ThemeProvider lives at root, it rarely unmounts, but keeping it clean is good practice.
    };
  }, [themeSource]);

  useEffect(() => {
    // Apply resolved theme to HTML root
    const root = document.documentElement;
    if (resolvedTheme === "dark") {
      root.classList.add("dark");
      root.classList.remove("light");
    } else {
      root.classList.add("light");
      root.classList.remove("dark");
    }
  }, [resolvedTheme]);

  useEffect(() => {
    // Apply focus state class to root for dimming effects
    const root = document.documentElement;
    if (isFocused) {
      root.classList.add("window-focused");
      root.classList.remove("window-blurred");
    } else {
      root.classList.add("window-blurred");
      root.classList.remove("window-focused");
    }
  }, [isFocused]);

  const changeTheme = (newSource) => {
    setThemeSource(newSource);
    localStorage.setItem("ats_theme_source", newSource);
    if (window.electronAPI?.setThemeSource) {
      window.electronAPI.setThemeSource(newSource);
    }
    
    // Optimistic UI update
    if (newSource !== "system") {
      setResolvedTheme(newSource);
    } else {
      // Re-resolve system theme
      if (window.electronAPI?.getTheme) {
        window.electronAPI.getTheme().then(setResolvedTheme);
      }
    }
  };

  return (
    <ThemeContext.Provider value={{ themeSource, resolvedTheme, isFocused, changeTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
