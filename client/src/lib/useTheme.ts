"use client";

import { useState, useEffect } from "react";

export function useTheme() {
  const [theme, setTheme] = useState("zinc");
  const [mode, setMode] = useState("light");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedTheme = localStorage.getItem("theme") || "zinc";
      const storedMode = localStorage.getItem("mode") || "light";
      setTheme(storedTheme);
      setMode(storedMode);
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      document.documentElement.setAttribute("data-theme", `${theme}-${mode}`);
      localStorage.setItem("theme", theme);
      localStorage.setItem("mode", mode);
    }
  }, [theme, mode]);

  return { theme, setTheme, mode, setMode };
}
