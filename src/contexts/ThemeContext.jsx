import React, { createContext, useContext, useState, useEffect } from "react";

// Create a context
const ThemeContext = createContext();

// Create a provider component
export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState("light"); // Correctly initialize as a string

  // This effect applies the theme to the whole app
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// Create a custom hook to use the theme context easily
export function useTheme() {
  return useContext(ThemeContext);
}
