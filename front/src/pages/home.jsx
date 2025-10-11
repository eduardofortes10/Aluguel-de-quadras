// src/pages/Home.jsx
import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import MobileNav from "../components/MobileNav";
import HomeHero from "../components/HomeHero";
import CountCard from "../components/CountCard";

// Dados mock — troque pela sua API quando quiser
const MOCK_QUADRAS = [
  {
    id: 1,
    nome: "Quadra de Futsal",
    imagem:
      "https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=1280&auto=format&fit=crop",
    local: "Jardins, São Paulo",
    preco: "R$200/h",
    tipo: "Futsal",
    avaliacao: 4.9,
  },
  {
    id: 2,
    nome: "Campo de Golfe",
    imagem:
      "https://images.unsplash.com/photo-1508766206392-8bd5cf550d1b?q=80&w=1280&auto=format&fit=crop",
    local: "Alphaville, SP",
    preco: "R$200/h",
    tipo: "Golfe",
    avaliacao: 4.9,
  },
  {
    id: 3,
    nome: "Quadra Poliesportiva",
    imagem:
      "https://images.unsplash.com/photo-1504600770771-fb03a6961d33?q=80&w=1280&auto=format&fit=crop",
    local: "Centro, São Paulo",
    preco: "R$180/h",
    tipo: "Poliesportiva",
    avaliacao: 4.6,
  },
  {
    id: 4,
    nome: "Quadra Society",
    imagem:
      "https://images.unsplash.com/photo-1517646287270-5f3e0f2a2b36?q=80&w=1280&auto=format&fit=crop",
    local: "Moema, São Paulo",
    preco: "R$220/h",
    tipo: "Society",
    avaliacao: 4.1,
  },
];

export default function Home() {
  const navigate = useNavigate();

  const quadrasParaVoce = useMemo(() => MOCK_QUADRAS, []);
  const quadrasEmDestaque = useMemo(() => MOCK_QUADRAS.slice().reverse(), []);

  const abrirFiltro = () => navigate("/filtro");
  const abrirDetalhe = (id) => navigate(`/quadra/${id}`);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-neutral-950 dark:to-neutral-900 text-gray-900 dark:text-gray-100">
      {/* Sidebar: apenas desktop (sem width aqui!) */}
      <aside className="hidden lg:block fixed inset-y-0 left-0 z-50">
        <Sidebar />
      </aside>

      {/* MobileNav: apenas mobile */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40">
        <MobileNav />
      </nav>

      {/* Conteúdo: desloca só 56px (w-14), que é a largura colapsada do Sidebar */}
      <main className="relative lg:ml-14 min-h-screen pb-20 lg:pb-0">
        {/* Cabeçalho/Hero */}
        <section className="px-4 sm:px-6 lg:px-8 pt-5 sm:pt-6 lg:pt-8 max-w-7xl mx-auto">
          <HomeHero />
        </section>

        {/* Métricas rápidas */}
        <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <CountCard title="Quadras próximas" value="12" subtitle="no seu bairro" />
          <CountCard title="Melhor avaliadas" value="4.9★" subtitle="média Top 10" />
          <CountCard title="Promoções" value="3" subtitle="esta semana" />
          <CountCard title="Favoritas" value="8" subtitle="salvas por você" />
        </section>

        {/* Barra de ações */}
        <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mt-4 flex items-center justify-between">
          <h2 className="text-lg sm:text-xl font-semibold tracking-tight">Para você</h2>

          <button
            onClick={abrirFiltro}
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-sm sm:text-base px-4 py-2 shadow-sm transition"
          >
            <span>Filtrar</span>
            <span className="block h-1 w-1 rounded-full bg-white shadow-[0_0_0_2px_rgba(255,255,255,0.35)]" />
          </button>
        </section>

        {/* Grid — Para você */}
        <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {quadrasParaVoce.map((q) => (
              <article
                key={q.id}
                className="group rounded-2xl bg-white dark:bg-neutral-900 ring-1 ring-black/5 dark:ring-white/10 overflow-hidden shadow-sm hover:shadow-md transition-all"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img
                    src={q.imagem}
                    alt={q.nome}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute left-3 top-3 flex items-center gap-2">
                    <span className="inline-flex items-center rounded-full bg-black/70 text-white text-xs px-2 py-1 backdrop-blur">
                      ★ {q.avaliacao}
                    </span>
                    <span className="inline-flex items-center rounded-full bg-emerald-600 text-white text-xs px-2 py-1">
                      {q.tipo}
                    </span>
                  </div>
                  <button
                    title="Favoritar"
                    className="absolute right-3 top-3 h-9 w-9 rounded-full bg-white/90 hover:bg-white shadow grid place-items-center"
                  >
                    <span className="text-emerald-600">♥</span>
                  </button>
                  <span className="absolute left-3 bottom-3 rounded-md bg-black/70 text-white text-xs px-2 py-1 backdrop-blur">
                    {q.preco}
                  </span>
                </div>

                <div className="p-4">
                  <h3 className="font-semibold text-base sm:text-lg leading-tight line-clamp-1">
                    {q.nome}
                  </h3>
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-300 line-clamp-1">
                    {q.local}
                  </p>

                  <div className="mt-4 flex items-center justify-between">
                    <button
                      onClick={() => abrirDetalhe(q.id)}
                      className="rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-sm px-4 py-2 transition"
                    >
                      Ver detalhes
                    </button>
                    <button
                      onClick={() => abrirDetalhe(q.id)}
                      className="text-emerald-700 dark:text-emerald-400 text-sm hover:underline"
                    >
                      Alugar agora
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Seção destaque */}
        <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mt-10">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg sm:text-xl font-semibold tracking-tight">
              Quadras em destaque
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {quadrasEmDestaque.map((q) => (
              <article
                key={`d-${q.id}`}
                className="group rounded-2xl bg-white dark:bg-neutral-900 ring-1 ring-black/5 dark:ring-white/10 overflow-hidden shadow-sm hover:shadow-md transition-all"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img
                    src={q.imagem}
                    alt={q.nome}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute left-3 top-3 flex items-center gap-2">
                    <span className="inline-flex items-center rounded-full bg-black/70 text-white text-xs px-2 py-1 backdrop-blur">
                      ★ {q.avaliacao}
                    </span>
                    <span className="inline-flex items-center rounded-full bg-emerald-600 text-white text-xs px-2 py-1">
                      {q.tipo}
                    </span>
                  </div>
                  <button
                    title="Favoritar"
                    className="absolute right-3 top-3 h-9 w-9 rounded-full bg-white/90 hover:bg-white shadow grid place-items-center"
                  >
                    <span className="text-emerald-600">♥</span>
                  </button>
                  <span className="absolute left-3 bottom-3 rounded-md bg-black/70 text-white text-xs px-2 py-1 backdrop-blur">
                    {q.preco}
                  </span>
                </div>

                <div className="p-4">
                  <h3 className="font-semibold text-base sm:text-lg leading-tight line-clamp-1">
                    {q.nome}
                  </h3>
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-300 line-clamp-1">
                    {q.local}
                  </p>

                  <div className="mt-4 flex items-center justify-between">
                    <button
                      onClick={() => abrirDetalhe(q.id)}
                      className="rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-sm px-4 py-2 transition"
                    >
                      Ver detalhes
                    </button>
                    <button
                      onClick={() => abrirDetalhe(q.id)}
                      className="text-emerald-700 dark:text-emerald-400 text-sm hover:underline"
                    >
                      Alugar agora
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Espaço final para não colidir com MobileNav no celular */}
        <div className="h-4 sm:h-6 lg:h-10" />
      </main>
    </div>
  );
}
