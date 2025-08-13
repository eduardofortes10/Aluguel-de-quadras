import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import { useNavigate, Link } from "react-router-dom";
import { quadras, quadrasCarrossel } from "../data/quadras";
import UserDropdown from "../components/DropdownUser";
import MobileNav from "../components/MobileNav";
import Sidebar from "../components/Sidebar";
import { api } from "../services/api";
import {
  Search,
  SlidersHorizontal,
  Bell,
  Star,
  MapPin,
  Heart,
  ChevronRight,
} from "lucide-react";

export default function Home() {
  const navigate = useNavigate();

  // ---- State ----
  const [nomeUsuario, setNomeUsuario] = useState("");
  const [mostrarCookies, setMostrarCookies] = useState(false);
  const [notificacoesNaoLidas, setNotificacoesNaoLidas] = useState(0);

  // ---- Slider ----
  const [sliderRef, instanceRef] = useKeenSlider({
    loop: true,
    breakpoints: {
      "(max-width: 480px)": { slides: { perView: 1.1, spacing: 10 } },
      "(min-width: 481px)": { slides: { perView: 2, spacing: 12 } },
      "(min-width: 768px)": { slides: { perView: 3, spacing: 14 } },
      "(min-width: 1024px)": { slides: { perView: 4, spacing: 16 } },
      "(min-width: 1280px)": { slides: { perView: 5, spacing: 18 } },
    },
    slides: { perView: 5, spacing: 18 },
  });

  // Autoplay do carrossel com cleanup correto
  useEffect(() => {
    if (!instanceRef.current) return;
    const id = setInterval(() => instanceRef.current?.next(), 5000);
    return () => clearInterval(id);
  }, [instanceRef]);

  // ---- Notificações ----
  useEffect(() => {
    const usuario = JSON.parse(localStorage.getItem("usuario"));
    if (!usuario?.id) return;

    const buscarTodasNotificacoes = async () => {
      try {
        const { data } = await api.get(`/notificacoes/${usuario.id}`);
        const total = Array.isArray(data) ? data.filter((n) => !n.lida).length : 0;
        setNotificacoesNaoLidas(total);
      } catch (err) {
        console.error("Erro ao buscar notificações:", err);
      }
    };

    buscarTodasNotificacoes();
    const intervalo = setInterval(buscarTodasNotificacoes, 15000);
    return () => clearInterval(intervalo);
  }, []);

  // ---- Inicializações ----
  useEffect(() => {
    const nome = localStorage.getItem("nomeUsuario") || "Usuário(a)";
    setNomeUsuario(nome);
  }, []);

  useEffect(() => {
    const cookiesAceitos = localStorage.getItem("cookiesAceitos");
    setMostrarCookies(cookiesAceitos !== "true");
  }, []);

  // ---- Navegação para detalhes ----
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

  // ---- UI helpers ----
  const categorias = useMemo(
    () => [
      { nome: "Futebol", img: "/quadras/Imagem2logo.png" },
      { nome: "Basquete", img: "/quadras/imagem1logo.png" },
      { nome: "Vôlei", img: "/quadras/imagem4logo.png" },
      { nome: "Tênis", img: "/quadras/imagem3logo.png" },
    ],
    []
  );

  return (
    <div className="flex min-h-screen overflow-x-hidden bg-neutral-50">
      {/* Sidebar - Desktop */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* Navbar Mobile */}
      <div className="md:hidden fixed top-0 left-0 w-full z-50">
        <MobileNav />
      </div>

      {/* Conteúdo */}
      <div className="flex-1 px-4 md:pl-16 lg:pl-20">
        {/* Hero */}
        <section className="relative rounded-b-3xl overflow-hidden shadow-sm">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-700 via-emerald-600 to-emerald-800" />
          <div className="relative z-10 px-4 md:px-8 py-6 md:py-8 text-white">
            {/* Ações topo */}
            <div className="flex items-center justify-between">
              <Link to="/notificacao" className="group relative">
                <div className="w-11 h-11 rounded-full bg-white shadow flex items-center justify-center group-hover:scale-105 transition">
                  <Bell className="w-5 h-5 text-emerald-700" />
                </div>
                {notificacoesNaoLidas > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-semibold px-1.5 py-[1px] rounded-full shadow">
                    {notificacoesNaoLidas}
                  </span>
                )}
              </Link>

              <div className="fixed top-4 right-4 z-[9999]">
                <UserDropdown />
              </div>
            </div>

            {/* Saudações */}
            <div className="mt-2 text-center md:text-left">
              <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
                Olá, {nomeUsuario}
              </h1>
              <p className="text-white/80 text-sm md:text-base">Sua quadra, seu jogo!</p>
            </div>

            {/* Busca + Filtro */}
            <div className="mt-5 flex items-center justify-center md:justify-start">
              <div className="flex items-center bg-white/95 backdrop-blur rounded-full px-4 py-2 shadow-lg ring-1 ring-black/5">
                <Search className="w-5 h-5 text-gray-400 mr-2" />
                <input
                  type="text"
                  placeholder="Procure sua quadra aqui"
                  className="outline-none text-gray-700 w-64 sm:w-80 bg-transparent placeholder:text-gray-400"
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

            {/* Categorias */}
            <div className="mt-6 flex gap-4 md:gap-6 justify-center md:justify-start flex-wrap">
              {categorias.map(({ nome, img }) => (
                <button
                  key={nome}
                  onClick={() =>
                    navigate("/resultados", {
                      state: { tipo: [nome] },
                    })
                  }
                  className="group relative overflow-hidden rounded-2xl bg-white text-left w-[150px] md:w-[170px] shadow-lg ring-1 ring-black/5 hover:-translate-y-0.5 transition"
                >
                  <div className="aspect-[16/10] overflow-hidden">
                    <img
                      src={img}
                      alt={nome}
                      className="h-full w-full object-cover group-hover:scale-105 transition"
                      loading="lazy"
                    />
                  </div>
                  <div className="px-3 py-2">
                    <span className="text-sm font-medium text-gray-800">{nome}</span>
                    <ChevronRight className="inline w-4 h-4 text-gray-400 ml-1" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Carrossel */}
        <section className="relative mt-8">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg md:text-xl font-semibold text-gray-900">
              Descubra quadras por aqui
            </h2>
            <Link to="/resultados" className="text-emerald-700 text-sm hover:underline">
              Ver todas
            </Link>
          </div>

          <div ref={sliderRef} className="keen-slider">
            {quadrasCarrossel.map((q) => (
              <div key={q.id} className="keen-slider__slide">
                <button
                  onClick={() => handleQuadraClick(q)}
                  className="w-full h-full group block"
                >
                  <article className="overflow-hidden rounded-2xl bg-white shadow-md ring-1 ring-black/5">
                    <div className="relative aspect-[4/3]">
                      <img
                        src={q.imagem}
                        alt={q.nome}
                        className="h-full w-full object-cover group-hover:scale-105 transition"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                      <div className="absolute bottom-2 left-2 flex items-center gap-2">
                        <span className="bg-white/90 text-emerald-800 text-xs font-semibold px-2 py-1 rounded">
                          {q.tipo}
                        </span>
                        <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2 py-1 rounded inline-flex items-center gap-1">
                          <Star className="w-3.5 h-3.5" />
                          {q.avaliacao}
                        </span>
                      </div>
                    </div>
                    <div className="p-3">
                      <h3 className="font-semibold text-gray-900 line-clamp-1">{q.nome}</h3>
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

        {/* Quadras em destaque */}
        <section className="mt-10 mb-16">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg md:text-xl font-semibold text-gray-900">
              Quadras em destaque
            </h2>
            <div className="text-xs text-gray-500">Atualizado diariamente</div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
            {quadras.map((q) => (
              <article
                key={q.id}
                className="group relative rounded-2xl overflow-hidden bg-white shadow-md ring-1 ring-black/5 hover:shadow-lg transition"
              >
                <button
                  onClick={() => handleQuadraClick(q)}
                  className="text-left w-full"
                >
                  <div className="relative aspect-[16/10]">
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
                        // Apenas visual por enquanto – lógica de favoritar já existe em outras páginas
                      }}
                    >
                      <Heart className="w-4.5 h-4.5 text-rose-500" />
                    </button>

                    <div className="absolute bottom-2 left-2 flex items-center gap-2">
                      <span className="bg-white/90 text-emerald-800 text-xs font-semibold px-2 py-1 rounded">
                        {q.tipo}
                      </span>
                      <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2 py-1 rounded inline-flex items-center gap-1">
                        <Star className="w-3.5 h-3.5" />
                        {q.avaliacao}
                      </span>
                    </div>
                  </div>

                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 line-clamp-1">{q.nome}</h3>
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

        {/* Cookies */}
        {mostrarCookies && (
          <section className="fixed bottom-6 left-4 right-4 md:left-10 md:right-auto z-50">
            <div className="max-w-md rounded-2xl bg-emerald-700 text-white p-4 shadow-2xl ring-1 ring-black/10">
              <h3 className="font-semibold text-base mb-1">🍪 Nós usamos cookies!</h3>
              <p className="text-sm/5 text-white/90 mb-3">
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

        {/* Rodapé */}
        <footer className="mt-6 mb-8">
          <div className="rounded-2xl overflow-hidden bg-gradient-to-br from-emerald-800 via-emerald-700 to-emerald-900 text-white p-6">
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
      </div>
    </div>
  );
}
