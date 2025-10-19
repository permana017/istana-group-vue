import { defineStore } from "pinia";

const STORAGE_KEY = "visitor_mode";

export const useModeStore = defineStore("mode", {
  state: () => ({
    // null until user picks a mode on Home or persisted value exists
    /** @type {null | 'user' | 'admin'} */
    mode: (localStorage.getItem(STORAGE_KEY) || null),
  }),
  getters: {
    isAdmin: (s) => s.mode === "admin",
    isUser: (s) => s.mode === "user",
  },
  actions: {
    setMode(newMode) {
      if (newMode !== "user" && newMode !== "admin") return;
      this.mode = newMode;
      localStorage.setItem(STORAGE_KEY, newMode);
    },
    toggle() {
      this.setMode(this.mode === "admin" ? "user" : "admin");
    },
    clear() {
      this.mode = null;
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch (_) {
        /* noop */
      }
    },
  },
});
