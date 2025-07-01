import { create } from "zustand";

export const useThemeStore = create((set) => ({
  theme: localStorage.getItem("TalkIn-theme") || "coffee",
  setTheme: (theme) => {
    localStorage.setItem("TalkIn-theme", theme);
    set({ theme });
  },
}));
