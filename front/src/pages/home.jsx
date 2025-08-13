// src/pages/Home.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import { Link, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import MobileNav from "../components/MobileNav";
import UserDropdown from "../components/DropdownUser";
import { api } from "../services/api";
import { Search, SlidersHorizontal, Bell, Star, MapPin, Heart, ChevronRight } from "lucide-react";
import { quadras, quadrasCarrossel } from "../data/quadras";

/* ===== ÍCONES MINI (16px) — viewBox padronizado ===== */
function IconSoccerMini({ className = "w-4 h-4" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.6">
      <circle cx="12" cy="12" r="9" />
      <polygon points="12,6.5 9,8.5 10,12 14,12 15,8.5" />
      <path d="M6.5 12c1.1 1.1 3.3 2.2 5.5 2.2s4.4-1.1 5.5-2.2" />
    </svg>
  );
}
function IconBasketMini({ className = "w-4 h-4" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.6">
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18" />
      <path d="M12 3v18" />
      <path d="M6.5 6.5c5 3 7 9 6 15" />
      <path d="M17.5 6.5c-5 3-7 9-6 15" />
    </svg>
  );
}
function IconVolleyMini({ className = "w-4 h-4" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.6">
      <circle cx="12" cy="12" r="9" />
      <path d="M6.5 9.5c4-3 7-3 11 0" />
      <path d="M5.5 14c4 2 9 2 13 0" />
      <path d="M9 4.5c-2 5-2 10 0 15" />
      <path d="M15 4.5c2 5 2 10 0 15" />
    </svg>
  );
}
function IconTennisMini({ className = "w-4 h-4" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.6">
      <circle cx="12" cy="12" r="9" />
      <path d="M4.5 10c5-4 10-4 15 0" />
      <path d="M4.5 14c5 4 10 4 15 0" />
    </svg>
  );
}

/* ===== Chip de categoria ===== */
function CategoryChip({ label, onClick, Icon }) {
  return (
    <button
      onClick={onClick}
      className="shrink-0 inline-flex items-center gap-2 px-3 py-2 rounded-full border border-gray-200 bg-white hover:bg-emerald-50 transition ring-1 ring-black/5"
      aria-label={label}
    >
      <span className="grid place-items-center rounded-full bg-gray-100 w-7 h-7">
        <Icon className="w-4 h-4 text-emerald-800" />
      </span>
      <span className="text-sm font-medium text-gray-700">{label}</span>
    </button>
  );
}

export default function Home() {
  const navigate = useNavigate();
  const [nomeUsuario, setNomeUsuario] = useState("Usuário");
  const [mostrarCookies, setMostrarCookies] = useState(false);
  const [notificacoesNaoLidas, setNotificacoesNaoLidas] = useState(0);

  /* ===== Carrossel ===== */
  const [sliderRef, instanceRef] = useKeenSlider({
    loop: true,
    renderMode: "performance",
    rubberband: true,
    breakpoints: {
      "(max-width: 480px)": { slides: { perView: 1.1, spacing: 10 } },
      "(min-width: 481px)": { slides: { perView: 1.6, spacing: 12 } },
      "(min-width: 768px)": { slides: { perView: 2.5, spacing: 14 } },
      "(min-width: 1024px)": { slides: { perView: 3.5, spacing: 16 } },
      "(min-width: 1280px)": { slides: { perView: 4.5, spacing: 18 } },
    },
    slides: { perView: 3.5, spacing: 16 },
  });

  useEffect(() => {
    if (!instanceRef.current) return;
    const id = setInterval(() => instanceRef.current?.next(), 4500);
    return () => clearInterval(id);
  }, [instanceRef]);

  /* ===== Inicialização ===== */
  useEffect(() => {
    setNomeUsuario(localStorage.getItem("nomeUsuario") || "Usuário");
    setMostrarCookies(localStorage.getItem("cookiesAceitos") !== "true");
  }, []);

  /* ===== Notificações ===== */
  useEffect(() => {
    const usuario = JSON.parse(localStorage.getItem("usuario"));
    if (!usuario?.id) return;
    const buscar = async () => {
      try {
        const { data } = await api.get(`/notificacoes/${usuario.id}`);
        const total = Array.isArray(data) ? data.filter((n) => !n.lida).length : 0;
        setNotificacoesNaoLidas(total);
      } catch (e) {
        console.error("Erro ao buscar notificações:", e);
      }
    };
    buscar();
    const t = setInterval(buscar, 15000);
    return () => clearInterval(t);
  }, []);

  /* ===== Navegação detalhe ===== */
  const handleQuadraClick = (quadra) => {
    const imagem_nome = quadra.imagem?.split("/").pop();
    navigate(`/quadra/${quadra.id}`, {
      state: {
        quadra: {
          ...quadra,
          imagem_url: imagem_nome,
          imagem: `/quadras/${imagem_nome}`,
        },
      },
    });
  };

  /* ===== Categorias ===== */
  const categorias = useMemo(
    () => [
      { nome: "Futebol", Icon: IconSoccerMini },
      { nome: "Basquete", Icon: IconBasketMini },
      { nome: "Vôlei", Icon: IconVolleyMini },
      { nome: "Tênis", Icon: IconTennisMini },
    ],
    []
  );

  return (
    <div className="flex min-h-screen bg-neutral-50">
      {/* Sidebar Desktop */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* Mobile Topbar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40">
        <MobileNav />
      </div>

      {/* Conteúdo */}
      <main className="flex-1 w-full">
        {/* === HERO FULL-BLEED (sem corte nas laterais) ===
            A mágica está nas margens negativas abaixo, que “anulam” o padding do container
            e deixam o gradiente ocupar toda a largura útil. Também removi overflow-hidden. */}
        <section className="relative mt-12 md:mt-4 -mx-3 sm:-mx-4 md:-mx-6 lg:-mx-8">
          <div className="relative rounded-b-3xl shadow-sm">
            <div className="absolute inset-0 rounded-b-3xl bg-gradient-to-br from-emerald-700 via-emerald-600 to-emerald-800" />
            <div className="relative px-3 sm:px-4 md:px-6 lg:px-8 py-4 md:py-6">
              {/* Topo */}
              <div className="flex items-center justify-between">
                <Link to="/notificacao" className="relative group">
                  <div className="w-10 h-10 rounded-full bg-white grid place-items-center shadow">
                    <Bell className="w-5 h-5 text-emerald-700" />
                  </div>
                  {notificacoesNaoLidas > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-semibold px-1.5 py-[1px] rounded-full shadow">
                      {notificacoesNaoLidas}
                    </span>
                  )}
                </Link>

                <div className="relative z-50">
                  <UserDropdown />
                </div>
              </div>

              {/* Saudação */}
              <div className="mt-1 text-center md:text-left text-white">
                <h1 className="text-xl md:text-2xl font-semibold">Olá, {nomeUsuario}</h1>
                <p className="text-white/85 text-sm">Sua quadra, seu jogo!</p>
              </div>

              {/* Busca + Filtro */}
              <div className="mt-3 md:mt-4 flex items-center justify-center md:justify-start">
                <div className="flex items-center bg-white/95 backdrop-blur rounded-full px-3 py-2 shadow-lg ring-1 ring-black/5 w-full max-w-xl">
                  <Search className="w-5 h-5 text-gray-400 mr-2" />
                  <input
                    type="text"
                    placeholder="Procure sua quadra aqui"
                    className="outline-none text-gray-700 flex-1 bg-transparent placeholder:text-gray-400 text-sm md:text-base"
                  />
                </div>
                <button
                  className="ml-2 p-2.5 bg-white rounded-xl shadow-lg ring-1 ring-black/5 hover:bg-emerald-50 transition"
                  onClick={() => navigate("/filtro")}
                  aria-label="Abrir filtros"
                >
                  <SlidersHorizontal className="w-5 h-5 text-emerald-700" />
                </button>
              </div>

              {/* Categorias — chips (mini) */}
              <div className="mt-3">
                {/* Mobile: rolagem horizontal sem cortes */}
                <div className="flex gap-2 overflow-x-auto md:hidden py-1 -mx-1 px-1">
                  {categorias.map(({ nome, Icon }) => (
                    <CategoryChip
                      key={nome}
                      label={nome}
                      Icon={Icon}
                      onClick={() => navigate("/resultados", { state: { tipo: [nome] } })}
                    />
                  ))}
                </div>
                {/* Desktop: grade compacta */}
                <div className="hidden md:grid grid-cols-4 gap-3 mt-1">
                  {categorias.map(({ nome, Icon }) => (
                    <button
                      key={nome}
                      onClick={() => navigate("/resultados", { state: { tipo: [nome] } })}
                      className="group w-full rounded-xl border border-gray-200 bg-white hover:bg-emerald-50 transition ring-1 ring-black/5 px-3 py-3 flex items-center gap-3"
                    >
                      <span className="grid place-items-center rounded-full bg-gray-100 w-8 h-8">
                        <Icon className="w-4 h-4 text-emerald-800" />
                      </span>
                      <span className="text-sm font-medium text-gray-700">{nome}</span>
                      <ChevronRight className="w-4 h-4 text-gray-400 ml-auto opacity-0 group-hover:opacity-100 transition" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Container central para o restante da página */}
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          {/* CARROSSEL */}
          <section className="mt-6 md:mt-8">
            <div className="flex items-center justify-between mb-2 md:mb-3">
              <h2 className="text-base md:text-lg lg:text-xl font-semibold text-gray-900">
                Descubra quadras por aqui
              </h2>
              <Link to="/resultados" className="text-emerald-700 text-xs md:text-sm hover:underline">
                Ver todas
              </Link>
            </div>

            <div ref={sliderRef} className="keen-slider">
              {quadrasCarrossel.map((q) => (
                <div key={q.id} className="keen-slider__slide">
                  <button onClick={() => handleQuadraClick(q)} className="block group w-full h-full">
                    <article className="overflow-hidden rounded-2xl bg-white shadow-md ring-1 ring-black/5">
                      <div className="relative" style={{ aspectRatio: "3 / 2" }}>
                        <img
                          src={q.imagem}
                          alt={q.nome}
                          className="h-full w-full object-cover group-hover:scale-105 transition"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />
                        <div className="absolute bottom-2 left-2 flex items-center gap-2">
                          <span className="bg-white/90 text-emerald-800 text-[11px] font-semibold px-2 py-1 rounded">
                            {q.tipo}
                          </span>
                          <span className="bg-yellow-100 text-yellow-800 text-[11px] font-medium px-2 py-1 rounded inline-flex items-center gap-1">
                            <Star className="w-3.5 h-3.5" />
                            {q.avaliacao}
                          </span>
                        </div>
                      </div>
                      <div className="p-3">
                        <h3 className="font-semibold text-gray-900 truncate">{q.nome}</h3>
                        <p className="text-xs text-gray-500 mt-1 inline-flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5" />
                          {q.local}
                        </p>
                        <div className="mt-2 text-sm font-medium text-emerald-700">{q.preco}</div>
                      </div>
                    </article>
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* DESTAQUES */}
          <section className="mt-8 md:mt-10 mb-16">
            <div className="flex items-center justify-between mb-2 md:mb-3">
              <h2 className="text-base md:text-lg lg:text-xl font-semibold text-gray-900">
                Quadras em destaque
              </h2>
              <div className="text-[11px] md:text-xs text-gray-500">Atualizado diariamente</div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-5">
              {quadras.map((q) => (
                <article
                  key={q.id}
                  className="group relative rounded-2xl overflow-hidden bg-white shadow-md ring-1 ring-black/5 hover:shadow-lg transition"
                >
                  <button onClick={() => handleQuadraClick(q)} className="text-left w-full">
                    <div className="relative" style={{ aspectRatio: "16 / 10" }}>
                      <img
                        src={q.imagem}
                        alt={q.nome}
                        className="h-full w-full object-cover group-hover:scale-105 transition"
                        loading="lazy"
                      />
                      <button
                        type="button"
                        className="absolute top-2 right-2 rounded-full bg-white/90 backdrop-blur p-2 shadow hover:scale-105 transition"
                        aria-label="Favoritar"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                        }}
                      >
                        <Heart className="w-4 h-4 text-rose-500" />
                      </button>

                      <div className="absolute bottom-2 left-2 flex items-center gap-2">
                        <span className="bg-white/90 text-emerald-800 text-[11px] font-semibold px-2 py-1 rounded">
                          {q.tipo}
                        </span>
                        <span className="bg-yellow-100 text-yellow-800 text-[11px] font-medium px-2 py-1 rounded inline-flex items-center gap-1">
                          <Star className="w-3.5 h-3.5" />
                          {q.avaliacao}
                        </span>
                      </div>
                    </div>

                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 truncate">{q.nome}</h3>
                      <p className="text-xs text-gray-500 mt-1 inline-flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" />
                        {q.local}
                      </p>
                      <div className="mt-2 text-sm font-medium text-emerald-700">{q.preco}</div>
                    </div>
                  </button>
                </article>
              ))}
            </div>
          </section>
        </div>

        {/* COOKIES */}
        {mostrarCookies && (
          <section className="fixed bottom-6 left-4 right-4 md:left-10 md:right-auto z-50">
            <div className="max-w-md rounded-2xl bg-emerald-700 text-white p-4 shadow-2xl ring-1 ring-black/10">
              <h3 className="font-semibold text-base mb-1">🍪 Nós usamos cookies!</h3>
              <p className="text-sm text-white/90 mb-3">
                Usamos cookies para melhorar sua experiência e analisar o tráfego do site.
              </p>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => {
                    localStorage.setItem("cookiesAceitos", "true");
                    setMostrarCookies(false);
                  }}
                  className="bg-white text-emerald-800 px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-50 transition"
                >
                  Aceitar todos
                </button>
                <button
                  onClick={() => {
                    localStorage.setItem("cookiesAceitos", "true");
                    setMostrarCookies(false);
                  }}
                  className="bg-emerald-800/40 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-800/60 transition"
                >
                  Preferências
                </button>
              </div>
            </div>
          </section>
        )}

        {/* RODAPÉ */}
        <footer className="mt-6 mb-8 px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto rounded-2xl overflow-hidden bg-gradient-to-br from-emerald-800 via-emerald-700 to-emerald-900 text-white p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">Aluguel de Quadras</h3>
                <p className="text-sm text-white/90">
                  Encontre e agende quadras com facilidade. Mais esporte, menos burocracia.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Navegação</h3>
                <ul className="space-y-1.5 text-sm text-white/90">
                  <li><Link to="/home" className="hover:underline">Início</Link></li>
                  <li><Link to="/favoritos" className="hover:underline">Favoritos</Link></li>
                  <li><Link to="/sobre" className="hover:underline">Sobre</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Contato</h3>
                <p className="text-sm text-white/90 mb-1">📧 eduardo_fortes@gmail.com</p>
                <p className="text-sm text-white/90">📞 +55 (19) 99938-7274</p>
              </div>
            </div>
            <div className="mt-6 text-center text-xs border-t border-white/20 pt-4">
              © {new Date().getFullYear()} Aluguel de Quadras — Todos os direitos reservados.
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
