import { createContext, useState, useEffect, useContext } from "react";
import PropTypes from "prop-types";

export const DarkModeContext = createContext();

export const DarkModeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    try {
      const stored = localStorage.getItem("isDarkMode");
      return stored ? JSON.parse(stored) : false;
    } catch {
      return false;
    }
  });
  useEffect(() => {
    if (typeof document !== "undefined") {
      if (isDarkMode) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }

    try {
      localStorage.setItem("isDarkMode", JSON.stringify(isDarkMode));
    } catch {}
  }, [isDarkMode]);

  const applyTransition = (duration = 300) => {
    if (typeof document === "undefined") return;
    try {
      const el = document.documentElement;
      el.classList.add("theme-transition");
      if (typeof window !== "undefined") {
        window.setTimeout(
          () => el.classList.remove("theme-transition"),
          duration,
        );
      }
    } catch {}
  };

  const toggleDarkMode = () => {
    applyTransition(300);
    setIsDarkMode((prev) => !prev);
  };

  return (
    <DarkModeContext.Provider
      value={{ isDarkMode, setIsDarkMode, toggleDarkMode }}
    >
      {children}
    </DarkModeContext.Provider>
  );
};

DarkModeProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useDarkMode = () => {
  const context = useContext(DarkModeContext);
  if (context === undefined) {
    throw new Error("useDarkMode must be used within a DarkModeProvider");
  }
  return context;
};
