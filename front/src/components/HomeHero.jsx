// front/src/components/HomeHero.jsx
// Visual 2025 – vidro + gradiente, responsivo e leve
import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Bell, ChevronDown, Search, SlidersHorizontal, SoccerBall } from "lucide-react";
import DropdownUser from "./DropdownUser";

export default function HomeHero({
  nomeUsuario = "Usuário",
  notificacoesNaoLidas = 0,
}) {
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const [enableFx, setEnableFx] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia?.("(pointer: fine)")?.matches;
    const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
    setEnableFx(Boolean(fine && !reduced));
  }, []);

  function onSubmit(e) {
    e.preventDefault();
    const termo = inputRef.current?.value?.trim();
    if (termo) navigate(`/resultados?buscar=${encodeURIComponent(termo)}`);
  }

  return (
    <section className="mx-auto max-w-[1152px] px-4 sm:px-6">
      {/* Card principal */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-700 via-emerald-600 to-emerald-800 p-1 shadow-[0_10px_30px_rgba(0,0,0,.20)]">
        <div className="rounded-[22px] glass-panel p-5 sm:p-7">
          {/* brilho decorativo */}
          <div
            aria-hidden
            className="pointer-events-none absolute -top-24 -right-24 size-[320px] rounded-full bg-emerald-400/30 blur-3xl"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-20 -left-16 size-[260px] rounded-full bg-teal-300/20 blur-3xl"
          />

          {/* Cabeçalho do card */}
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-white/80 text-sm">Olá,</p>
              <h1 className="text-white font-black tracking-tight text-[28px] leading-[1.1] sm:text-[34px]">
                {nomeUsuario}
              </h1>
              <p className="text-white/80 text-sm">Sua quadra, seu jogo!</p>
            </div>

            {/* Ações topo: sininho + usuário */}
            <div className="flex items-center gap-2">
              <Link
                to="/notificacao"
                className="relative inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/15 transition"
                title="Notificações"
              >
                <Bell className="h-5 w-5" />
                {Number(notificacoesNaoLidas) > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-500 text-[11px] font-bold text-white px-1">
                    {notificacoesNaoLidas}
                  </span>
                )}
              </Link>

              <DropdownUser>
                <button className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-2 text-white hover:bg-white/15 transition">
                  <div className="size-6 rounded-full bg-white/20 ring-2 ring-white/30" />
                  <span className="hidden sm:inline text-sm font-medium">
                    {String(nomeUsuario).split(" ")[0] || "Perfil"}
                  </span>
                  <ChevronDown className="h-4 w-4" />
                </button>
              </DropdownUser>
            </div>
          </div>

          {/* Busca */}
          <form onSubmit={onSubmit} className="mt-5 sm:mt-6">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/70" />
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Buscar por bairro, quadra ou esporte..."
                  className="h-12 w-full rounded-xl bg-white/10 pl-10 pr-3 text-white placeholder:text-white/70 outline-none ring-1 ring-white/20 focus:ring-2 focus:ring-white/50"
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="h-12 px-5 rounded-xl bg-white text-emerald-800 font-semibold hover:bg-white/90 transition"
                >
                  Buscar
                </button>
                <Link
                  to="/filtro"
                  className="h-12 px-4 rounded-xl bg-white/10 text-white hover:bg-white/15 transition inline-flex items-center gap-2"
                >
                  <SlidersHorizontal className="h-5 w-5" />
                  <span className="hidden sm:inline">Filtros</span>
                </Link>
              </div>
            </div>
          </form>

          {/* Categorias */}
          <div className="mt-4 flex flex-wrap items-center gap-2">
            {[
              { nome: "Futebol", icon: <SoccerBall className="h-4 w-4" /> },
              { nome: "Basquete" },
              { nome: "Vôlei" },
              { nome: "Tênis" },
              { nome: "Society" },
            ].map((c) => (
              <button
                key={c.nome}
                type="button"
                className="chip"
                onClick={() => navigate(`/resultados?tipo=${encodeURIComponent(c.nome)}`)}
              >
                {c.icon}
                {c.nome}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
