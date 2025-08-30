import React, { createContext, useContext, useEffect, useState } from "react";

const ThemeCtx = createContext({ theme: "theme-emerald", setTheme: () => {} });
export const useTheme = () => useContext(ThemeCtx);

export default function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "theme-emerald");

  useEffect(() => {
    const html = document.documentElement;
    // remove classes antigas theme-*
    [...html.classList].forEach(c => c.startsWith("theme-") && html.classList.remove(c));
    html.classList.add(theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  return <ThemeCtx.Provider value={{ theme, setTheme }}>{children}</ThemeCtx.Provider>;
}
