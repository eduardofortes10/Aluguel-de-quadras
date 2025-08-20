// src/components/chat/MessageBubble.jsx
import React from "react";
import { CheckCheck } from "lucide-react";

function parseDateSafe(ts) {
  if (!ts) return null;
  // aceita Date, número, ISO ou "YYYY-MM-DD HH:mm:ss"
  if (ts instanceof Date) return isNaN(ts) ? null : ts;
  const d1 = new Date(ts);
  if (!isNaN(d1)) return d1;
  const d2 = new Date(String(ts).replace(" ", "T"));
  return isNaN(d2) ? null : d2;
}

function formatHora(ts) {
  const d = parseDateSafe(ts);
  if (!d) return "";
  return d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
}

export default function MessageBubble({
  text,
  timestamp,      // Date | string | number
  isOwn = false,  // se a msg é do usuário logado
  seen = false,   // só use true para a ÚLTIMA msg própria visualizada
}) {
  return (
    <div className={`flex w-full ${isOwn ? "justify-end" : "justify-start"} mb-2`}>
      <div className={`max-w-[78%] sm:max-w-[65%]`}>
        {/* Bolha */}
        <div
          className={[
            "px-3 py-2 rounded-2xl shadow-sm",
            "break-words whitespace-pre-wrap",
            isOwn
              ? "bg-emerald-600 text-white rounded-br-md"
              : "bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100 rounded-bl-md",
          ].join(" ")}
          title={parseDateSafe(timestamp)?.toLocaleString("pt-BR") || ""}
        >
          {text}
        </div>

        {/* Linha de status abaixo da bolha */}
        <div className={`mt-1 flex items-center gap-2 ${isOwn ? "justify-end" : "justify-start"}`}>
          <span className="text-xs text-zinc-500">{formatHora(timestamp)}</span>

          {isOwn && seen && (
            <span className="inline-flex items-center gap-1 text-xs text-emerald-600">
              <CheckCheck size={14} />
              visto
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
