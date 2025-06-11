import { create } from "zustand";
import daisyui from "daisyui";

const initialTheme = localStorage.getItem("chat-theme") || "coffee";

// Apply it immediately on load
if (typeof document !== "undefined") {
  document.documentElement.setAttribute("data-theme", initialTheme); // This applies the theme
}

export const useThemeStore = create((set, get) => ({
  theme: initialTheme,
  setTheme: (theme) => {
    localStorage.setItem("chat-theme", theme);

    // Apply the theme change immediately
    if (typeof document !== "undefined") {
      document.documentElement.setAttribute("data-theme", theme); // This applies the theme
    }

    // Update the state
    set({ theme });
  },
}));