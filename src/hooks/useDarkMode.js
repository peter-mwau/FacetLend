import { createContext, useState, useEffect, useContext } from "react";

const DarkModeContext = createContext();

export const DarkModeProvider = ({ children }) => {
    const [isDarkMode, setIsDarkMode] = useState(() => {
        try {
            const stored = localStorage.getItem("facetlend-theme");
            // Default to dark theme (Diamond Protocol default)
            return stored ? JSON.parse(stored) : true;
        } catch {
            return true; // Default to dark theme
        }
    });

    useEffect(() => {
        if (typeof document !== "undefined") {
            if (isDarkMode) {
                document.documentElement.classList.add("dark");
                document.documentElement.classList.remove("light");
            } else {
                document.documentElement.classList.add("light");
                document.documentElement.classList.remove("dark");
            }
        }

        try {
            localStorage.setItem("facetlend-theme", JSON.stringify(isDarkMode));
        } catch (e) {
            // Fail silently if localStorage is not available
            console.log("Could not save theme preference:", e);
        }
    }, [isDarkMode]);

    const applyTransition = (duration = 300) => {
        if (typeof document === "undefined") return;
        try {
            const el = document.documentElement;
            el.style.transition = `background-color ${duration}ms ease, color ${duration}ms ease`;
            if (typeof window !== "undefined") {
                window.setTimeout(() => {
                    el.style.transition = "";
                }, duration);
            }
        } catch (error) {
            // Fail silently if document is not available or if any error occurs
            console.log("Could not apply theme transition:", error);
        }
    };

    const toggleDarkMode = () => {
        applyTransition(300);
        setIsDarkMode((prev) => !prev);
    };

    return (
        <DarkModeContext.Provider value={{ isDarkMode, setIsDarkMode, toggleDarkMode }}>
            {children}
        </DarkModeContext.Provider>
    );
};

// Export the hook for easy consumption
export const useDarkMode = () => {
    const context = useContext(DarkModeContext);
    if (context === undefined) {
        throw new Error("useDarkMode must be used within a DarkModeProvider");
    }
    return context;
};