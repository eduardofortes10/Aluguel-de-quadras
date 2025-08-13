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

/* =======================
   ÍCONES DE ESPORTE (SVG)
   Todos com mesma caixa (viewBox 0 0 48 48) e traço simples
======================= */
function IconSoccer({ className }) {
  // bola de futebol estilizada
  return (
    <svg viewBox="0 0 48 48" className={className} fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="24" cy="24" r="18" />
      <polygon points="24,14 18,18 20,24 28,24 30,18" />
      <path d="M12 24c2 2 6 4 12 4s10-2 12-4" />
      <path d="M16 34c2-2 5-3 8-3s6 1 8 3" />
    </svg>
  );
}
function IconBasketball({ className }) {
  return (
    <svg viewBox="0 0 48 48" className={className} fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="24" cy="24" r="18" />
      <path d="M6 24h36" />
      <path d="M24 6v36" />
      <path d="M12 12c10 6 14 18 12 30" />
      <path d="M36 12c-10 6-14 18-12 30" />
    </svg>
  );
}
function IconVolleyball({ className }) {
  return (
    <svg viewBox="0 0 48 48" className={className} fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="24" cy="24" r="18" />
      <path d="M12 18c8-6 16-6 24 0" />
      <path d="M10 28c8 4 18 4 28 0" />
      <path d="M18 8c-4 10-4 20 0 32" />
      <path d="M30 8c4 10 4 20 0 32" />
    </svg>
  );
}
function IconTennis({ className }) {
  return (
    <svg viewBox="0 0 48 48" className={className} fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="24" cy="24" r="18" />
      <path d="M9 20c10-8 20-8 30 0" />
      <path d="M9 28c10 8 20 8 30 0" />
    </svg>
  );
}

/* =======================
   COMPONENTE: Botão de Categoria
======================= */
function CategoryButton({ label, onClick, Icon, tint }) {
  return (
    <button
      onClick={onClick}
      className={`group w-28 h-28 md:w-32 md:h-32 rounded-2xl ring-1 ring-black/5 shadow-sm bg-white hover:-translate-y-0.5 transition grid place-items-center relative overflow-hidden ${tint}`}
      aria-label={label}
    >
      {/* halo sutil */}
      <div className="absolute inset-0 opacity-10 group-hover:opacity-20 transition bg-[radial-gradient(ellipse_at_center,white_0%,transparent_60%)]" />
      <Icon className="w-16 h-16 text-emerald-800" />
      <span className="absolute bottom-2 left-0 right-0 text-center text-xs font-medium text-gray-700">
        {label}
      </span>
    </button>
  );
}

export default function Home() {
  const navigate = useNavigate();
  const [nomeUsuario, setNomeUsuario] = useState("Usuário");
  const [mostrarCookies, setMostrarCookies] = useState(false);
  const [notificacoesNaoLidas, setNotificacoesNaoLidas] = useState(0);

  // Carrossel
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

  // Nome / Cookies
  useEffect(() => {
    setNomeUsuario(localStorage.getItem("nomeUsuario") || "Usuário");
    setMostrarCookies(localStorage.getItem("cookiesAceitos") !== "true");
  }, []);

  // Notificações
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

  // Navegação detalhe
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

  const categorias = useMemo(
    () => [
      { nome: "Futebol", Icon: IconSoccer, tint: "after:absolute after:inset-0 after:bg-emerald-50 after:opacity-60" },
      { nome: "Basquete", Icon: IconBasketball, tint: "after:absolute after:inset-0 after:bg-amber-50 after:opacity-60" },
      { nome: "Vôlei", Icon: IconVolleyball, tint: "after:absolute after:inset-0 after:bg-indigo-50 after:opacity-60" },
      { nome: "Tênis", Icon: IconTennis, tint: "after:absolute after:inset-0 after:bg-lime-50 after:opacity-60" },
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
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          {/* HERO */}
          <section className="relative overflow-hidden rounded-b-3xl mt-12 md:mt-4">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-700 via-emerald-600 to-emerald-800" />
            <div className="relative z-10 py-5 md:py-8">
              {/* Linha do topo */}
              <div className="flex items-center justify-between">
                <Link to="/notificacao" className="relative group">
                  <div className="w-11 h-11 rounded-full bg-white grid place-items-center shadow">
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
              <div className="mt-2 text-center md:text-left">
                <h1 className="text-2xl md:text-3xl font-semibold text-white">
                  Olá, {nomeUsuario}
                </h1>
                <p className="text-white/85 text-sm md:text-base">Sua quadra, seu jogo!</p>
              </div>

              {/* Busca + Filtro */}
              <div className="mt-4 md:mt-5 flex items-center justify-center md:justify-start">
                <div className="flex items-center bg-white/95 backdrop-blur rounded-full px-4 py-2 shadow-lg ring-1 ring-black/5 w-full max-w-xl">
                  <Search className="w-5 h-5 text-gray-400 mr-2" />
                  <input
                    type="text"
                    placeholder="Procure sua quadra aqui"
                    className="outline-none text-gray-700 flex-1 bg-transparent placeholder:text-gray-400 text-sm md:text-base"
                  />
                </div>
                <button
                  className="ml-2 p-3 bg-white rounded-xl shadow-lg ring-1 ring-black/5 hover:bg-emerald-50 transition"
                  onClick={() => navigate("/filtro")}
                  aria-label="Abrir filtros"
                >
                  <SlidersHorizontal className="w-5 h-5 text-emerald-700" />
                </button>
              </div>

              {/* Categorias – proporção fixa (quadrados) */}
              <div className="mt-5 md:mt-6 grid grid-cols-4 gap-3 sm:gap-4">
                {categorias.map(({ nome, Icon, tint }) => (
                  <CategoryButton
                    key={nome}
                    label={nome}
                    Icon={Icon}
                    tint={tint}
                    onClick={() => navigate("/resultados", { state: { tipo: [nome] } })}
                  />
                ))}
              </div>
            </div>
          </section>

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
                      {/* 3:2 */}
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
                    {/* 16:10 */}
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
