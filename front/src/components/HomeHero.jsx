// src/components/HomeHero.jsx
import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import UserDropdown from "./DropdownUser";

export default function HomeHero({ nomeUsuario = "Usuário", notificacoesNaoLidas = 0 }) {
  const navigate = useNavigate();
  const inputRef = useRef(null);

  // ativa efeitos só para mouse e sem reduced-motion
  const [enableFx, setEnableFx] = useState(false);
  useEffect(() => {
    const fine = window.matchMedia?.("(pointer: fine)")?.matches;
    const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
    setEnableFx(Boolean(fine && !reduced));
  }, []);

  // refs do efeito
  const heroRef = useRef(null);
  const glowTR = useRef(null);
  const glowBL = useRef(null);
  const spotRef = useRef(null);
  const innerRef = useRef(null);
  const rafRef = useRef(0);

  useEffect(() => {
    if (!enableFx || !heroRef.current) return;
    const el = heroRef.current;

    const onMove = (e) => {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width;
        const y = (e.clientY - r.top) / r.height;
        const dx = (x - 0.5) * 2;
        const dy = (y - 0.5) * 2;

        el.style.setProperty("--mx", `${(x * 100).toFixed(2)}%`);
        el.style.setProperty("--my", `${(y * 100).toFixed(2)}%`);
        if (spotRef.current) spotRef.current.style.opacity = "1";

        if (glowTR.current) glowTR.current.style.transform = `translate(${(-dx * 28).toFixed(1)}px, ${(-dy * 24).toFixed(1)}px)`;
        if (glowBL.current) glowBL.current.style.transform = `translate(${(dx * 34).toFixed(1)}px, ${(dy * 28).toFixed(1)}px)`;

        if (innerRef.current) {
          innerRef.current.style.transform = `perspective(1000px) rotateX(${(dy * 2).toFixed(2)}deg) rotateY(${(-dx * 2).toFixed(2)}deg)`;
        }
      });
    };

    const onLeave = () => {
      cancelAnimationFrame(rafRef.current);
      if (spotRef.current) spotRef.current.style.opacity = "0";
      if (glowTR.current) glowTR.current.style.transform = `translate(0,0)`;
      if (glowBL.current) glowBL.current.style.transform = `translate(0,0)`;
      if (innerRef.current) innerRef.current.style.transform = `none`;
    };

    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
      cancelAnimationFrame(rafRef.current);
    };
  }, [enableFx]);

  const categorias = [
    { nome: "Futebol",  img: "/quadras/Imagem2logo.png" },
    { nome: "Basquete", img: "/quadras/imagem1logo.png" },
    { nome: "Vôlei",    img: "/quadras/imagem4logo.png" },
    { nome: "Tênis",    img: "/quadras/imagem3logo.png" },
  ];

  const buscar = () => {
    const val = inputRef.current?.value?.trim() || "";
    navigate("/resultados", { state: { query: val } });
  };

  const irParaCategoria = (nome) => {
    navigate("/resultados", { state: { tipo: [nome], precoMaximo: "", avaliacaoMinima: "", local: "" } });
  };

  return (
   <section
  ref={heroRef}
className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[var(--grad-from)] via-[var(--grad-via)] to-[var(--grad-to)] text-white p-4 sm:p-6 shadow-xl"
  style={{ "--mx": "50%", "--my": "50%" }}
>

      {/* brilhos de fundo (z-0) */}
      <div ref={glowTR} className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-white/10 blur-3xl transition-transform duration-200 will-change-transform z-0" />
      <div ref={glowBL} className="pointer-events-none absolute -bottom-28 -left-20 h-80 w-80 rounded-full bg-emerald-400/10 blur-3xl transition-transform duration-200 will-change-transform z-0" />

      {/* spotlight do mouse (entre fundo e conteúdo) */}
      <div
  ref={spotRef}
  aria-hidden
  className="pointer-events-none absolute inset-0 z-[1] opacity-0 transition-opacity duration-150"
  style={{
    backgroundImage:
      "radial-gradient(700px circle at var(--mx) var(--my), rgba(255,255,255,0.36), rgba(255,255,255,0.18) 35%, transparent 60%)",
    mixBlendMode: "screen",   // troquei p/ garantir contraste
  }}
/>


      {/* conteúdo (z-10) */}
      <div ref={innerRef} className="relative z-10 will-change-transform transition-transform duration-150">
        {/* topo: saudação + ações */}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs text-white/80">Olá,</p>
            <h1 className="text-2xl sm:text-3xl font-bold leading-tight truncate">{nomeUsuario}</h1>
            <p className="text-xs sm:text-sm text-white/85">Sua quadra, seu jogo!</p>
          </div>

          <div className="shrink-0 flex items-center gap-2">
            <Link
              to="/notificacao"
              className="relative rounded-full bg-white/10 p-2 hover:bg-white/15 backdrop-blur-md ring-1 ring-white/20 transition group"
              aria-label="Notificações"
              title="Notificações"
            >
              <svg className="h-5 w-5 group-hover:rotate-6 transition-transform" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 2a6 6 0 00-6 6v2.586l-.707.707A1 1 0 004 13h12a1 1 0 00.707-1.707L16 10.586V8a6 6 0 00-6-6zm0 16a2 2 0 001.995-1.85L12 16H8a2 2 0 001.85 1.995L10 18z" />
              </svg>
              {notificacoesNaoLidas > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-bold px-1.5 rounded-full">
                  {notificacoesNaoLidas}
                </span>
              )}
            </Link>

            <div className="rounded-full bg-white/10 px-2 py-1 backdrop-blur-md ring-1 ring-white/20 max-w-[150px] overflow-hidden">
              <UserDropdown />
            </div>
          </div>
        </div>

        {/* busca */}
        <div className="mt-4">
          <div className="flex items-center bg-white/15 hover:bg-white/20 backdrop-blur-md ring-1 ring-white/30 rounded-2xl pl-3 pr-2 h-12 transition">
            <svg className="w-5 h-5 mr-2 opacity-90" viewBox="0 0 24 24" fill="currentColor">
              <path d="M10 4a6 6 0 014.472 9.944l4.292 4.292a1 1 0 01-1.414 1.414l-4.292-4.292A6 6 0 1110 4zm0 2a4 4 0 100 8 4 4 0 000-8z" />
            </svg>
            <input
              ref={inputRef}
              type="text"
              placeholder="Buscar por bairro, quadra ou esporte…"
              className="w-full bg-transparent placeholder-white/75 text-white text-sm outline-none"
              onKeyDown={(e) => e.key === "Enter" && buscar()}
            />
            <button onClick={buscar} className="ml-2 bg-white text-emerald-700 px-3 py-2 rounded-lg text-sm font-medium hover:shadow-md transition active:scale-[.98]">
              Buscar
            </button>
            <button
              onClick={() => navigate("/filtro")}
              className="ml-2 bg-white/15 hover:bg-white/25 text-white p-2 rounded-lg ring-1 ring-white/40 transition active:scale-[.98]"
              title="Filtros"
              aria-label="Abrir filtros"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3 4h18l-6.2 7.6V18l-2 1.5V11.6L3 4z" />
              </svg>
            </button>
          </div>
        </div>

        {/* categorias rápidas (mantidas) */}
        <div className="mt-3 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <ul className="flex gap-3 min-w-max">
            {categorias.map(({ nome, img }) => (
              <li key={nome}>
                <button
                  onClick={() => irParaCategoria(nome)}
                  className="group inline-flex items-center gap-2 h-11 px-3 pr-4 rounded-full outline outline-1 outline-white/25 -outline-offset-1 bg-white/10 hover:bg-white/15 transition hover:-translate-y-0.5 hover:shadow-[0_12px_24px_rgba(0,0,0,0.15)]"
                  style={{ WebkitTapHighlightColor: "transparent" }}
                  title={nome}
                >
                  <span className="relative shrink-0 w-9 h-9 rounded-full overflow-hidden bg-white/0">
                    <img
                      src={img}
                      alt={nome}
                      className="absolute inset-0 w-full h-full object-cover scale-[1.35] md:scale-[1.25] transition-transform group-hover:scale-[1.45] group-hover:translate-x-[1px] group-hover:-translate-y-[1px]"
                      draggable={false}
                    />
                  </span>
                  <span className="text-sm font-medium">{nome}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
