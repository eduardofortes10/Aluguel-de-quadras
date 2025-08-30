import React, { useState } from "react";
import { useTheme } from "../theme/ThemeProvider";

const OPTIONS = [
  { id: "theme-emerald", label: "Verde"   , dot: "#059669" },
  { id: "theme-indigo" , label: "Índigo"  , dot: "#4f46e5" },
  { id: "theme-purple" , label: "Roxo"    , dot: "#8b5cf6" },
  { id: "theme-orange" , label: "Laranja" , dot: "#f59e0b" },
];

export default function ThemeSwitcher({ compact = false }) {
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);

  const current = OPTIONS.find(o => o.id === theme) || OPTIONS[0];

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-full bg-white/10 px-3 py-2 ring-1 ring-white/20 text-white hover:bg-white/15"
        title="Trocar tema"
      >
        <span className="w-3.5 h-3.5 rounded-full" style={{ background: current.dot }} />
        <span className="text-sm">{compact ? "" : current.label}</span>
        <svg className="w-4 h-4 opacity-80" viewBox="0 0 20 20" fill="currentColor"><path d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"/></svg>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-40 rounded-xl bg-white/95 backdrop-blur p-2 shadow-lg ring-1 ring-black/10 z-50">
          {OPTIONS.map((o) => (
            <button
              key={o.id}
              onClick={() => { setTheme(o.id); setOpen(false); }}
              className={`w-full flex items-center gap-2 px-2 py-2 rounded-lg text-sm hover:bg-black/5 ${theme===o.id ? "font-semibold" : ""}`}
            >
              <span className="w-3.5 h-3.5 rounded-full" style={{ background: o.dot }} />
              {o.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
