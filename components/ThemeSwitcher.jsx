"use client";

import { useSyncExternalStore } from "react";
import { Moon, Sun } from "lucide-react";
import { THEME_KEY } from "@/lib/theme";

function subscribe(onChange) {
  function syncStorage(event) {
    if (event.key !== THEME_KEY && event.key !== null) return;
    document.documentElement.setAttribute("data-theme", event.newValue === "dark" ? "dark" : "light");
    onChange();
  }
  window.addEventListener("storage", syncStorage);
  window.addEventListener("jobhunt-theme-change", onChange);
  return () => {
    window.removeEventListener("storage", syncStorage);
    window.removeEventListener("jobhunt-theme-change", onChange);
  };
}

const getTheme = () => document.documentElement.dataset.theme === "dark" ? "dark" : "light";
const getServerTheme = () => "light";

// Keep other tabs in sync even when the account dropdown is closed.
export function ThemeSync() {
  useSyncExternalStore(subscribe, getTheme, getServerTheme);
  return null;
}

export default function ThemeSwitcher() {
  const theme = useSyncExternalStore(subscribe, getTheme, getServerTheme);

  function selectTheme(value) {
    document.documentElement.setAttribute("data-theme", value);
    try { localStorage.setItem(THEME_KEY, value); } catch { /* Selection still works when storage is blocked. */ }
    window.dispatchEvent(new Event("jobhunt-theme-change"));
  }

  return (
    <div role="group" aria-label="Color theme" className="theme-switcher">
      {[{ value: "light", label: "Light", Icon: Sun }, { value: "dark", label: "Dark", Icon: Moon }].map(({ value, label, Icon }) => (
        <button key={value} type="button" aria-label={`${label} theme`} aria-pressed={theme === value} onClick={() => selectTheme(value)}>
          <Icon size={16} aria-hidden="true" />
          <span>{label}</span>
        </button>
      ))}
    </div>
  );
}
