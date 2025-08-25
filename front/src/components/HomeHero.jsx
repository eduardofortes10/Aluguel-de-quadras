// src/components/HomeHero.jsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import UserDropdown from "./DropdownUser";

export default function HomeHero({ nomeUsuario = "Usuário(a)", notificacoesNaoLidas = 0 }) {
  const navigate = useNavigate();

  return (
    <section
      className="
        relative overflow-hidden rounded-3xl
        bg-gradient-to-br from-emerald-700 via-emerald-600 to-emerald-800
        text-white p-6 sm:p-10 shadow-2xl
      "
    >
      {/* brilhos radiais e ruído sutil */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-emerald-300/25 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-56 w-56 rounded-full bg-teal-300/20 blur-2xl" />
      </div>
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.08] mix-blend-overlay"
        style={{
          backgroundImage:
            "url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2240%22 height=%2240%22><filter id=%22n%22><feTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%222%22 stitchTiles=%22stitch%22/></filter><rect width=%2240%22 height=%2240%22 filter=%22url(%23n)%22/></svg>')",
        }}
      />

      {/* topo: saudação + ações */}
      <div className="flex items-center justify-between relative z-10">
        <div>
          <h1 className="text-3xl font-bold">Olá, <span className="capitalize">{nomeUsuario}</span></h1>
          <p className="text-sm text-white/90">Sua quadra, seu jogo!</p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/notificacao"
            className="relative rounded-full bg-white/10 p-3 hover:bg-white/15 backdrop-blur-md ring-1 ring-white/20 transition"
            aria-label="Notificações"
          >
            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10 2a6 6 0 00-6 6v2.586l-.707.707A1 1 0 004 13h12a1 1 0 00.707-1.707L16 10.586V8a6 6 0 00-6-6zm0 16a2 2 0 001.995-1.85L12 16H8a2 2 0 001.85 1.995L10 18z" />
            </svg>
            {notificacoesNaoLidas > 0 && (
              <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-xs font-bold px-1.5 rounded-full">
                {notificacoesNaoLidas}
              </span>
            )}
          </Link>
          <div className="rounded-full bg-white/10 px-3 py-2 backdrop-blur-md ring-1 ring-white/20">
            <UserDropdown />
          </div>
        </div>
      </div>

      {/* busca + filtro */}
      <div className="mt-6 relative z-10">
        <div className="flex items-center bg-white/10 backdrop-blur-md rounded-2xl px-4 py-3 ring-1 ring-white/20 focus-within:ring-white/40 transition">
          <svg className="h-5 w-5 text-white/80 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M5 11a6 6 0 1112 0 6 6 0 01-12 0z" />
          </svg>
          <input
            type="text"
            placeholder="Procure sua quadra aqui"
            className="bg-transparent w-full outline-none text-white placeholder-white/70"
            onKeyDown={(e) => {
              if (e.key === "Enter") navigate("/resultados", { state: { query: e.currentTarget.value } });
            }}
          />
          <button
            onClick={(e) => {
              const input = e.currentTarget.parentElement?.querySelector("input");
              const val = input?.value || "";
              navigate("/resultados", { state: { query: val } });
            }}
            className="ml-2 bg-white/15 hover:bg-white/25 text-white px-4 py-2 rounded-xl font-medium transition"
          >
            Buscar
          </button>
          <button
            onClick={() => navigate("/filtro")}
            className="ml-2 bg-white text-emerald-700 px-3 py-2 rounded-xl ring-1 ring-white/60 hover:shadow-md transition"
            title="Filtros"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3 4a1 1 0 011-1h16a1 1 0 01.8 1.6l-6.2 7.9V19a1 1 0 01-1.6.8l-2-1.5a1 1 0 01-.4-.8v-5.8L3.2 5.6A1 1 0 013 4z" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
