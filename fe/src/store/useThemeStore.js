import { create } from "zustand";

export const useThemeStore = create((set) => ({
  theme: localStorage.getItem("TalkIn-theme") || "dark",
  setTheme: (theme) => {
    localStorage.setItem("TalkIn-theme", theme);
    set({ theme });
  },
}));
