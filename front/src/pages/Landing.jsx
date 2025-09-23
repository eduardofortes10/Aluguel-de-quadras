// src/pages/Landing.jsx
import React, { useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { quadrasCarrossel as todas } from "../data/quadras";

function CardPublico({ q, onClick }) {
  return (
    <button
      onClick={onClick}
      className="group w-full text-left rounded-2xl overflow-hidden bg-white/80 backdrop-blur border border-white/40 shadow-sm hover:shadow-xl transition"
    >
      <div className="aspect-[16/10] overflow-hidden bg-gray-100">
        <img
          src={q.imagem}
          alt={q.nome}
          className="w-full h-full object-cover group-hover:scale-[1.03] transition"
          loading="lazy"
        />
      </div>
      <div className="p-4">
        <div className="text-sm text-gray-500">{q.local}</div>
        <h3 className="mt-1 font-semibold text-gray-900">{q.nome}</h3>
        <div className="mt-2 flex items-center justify-between">
          <span className="text-emerald-600 font-semibold">{q.preco}</span>
          <span className="text-xs px-2 py-1 rounded-full bg-emerald-50 text-emerald-700">
            {q.tipo}
          </span>
        </div>
      </div>
    </button>
  );
}

export default function Landing() {
  const navigate = useNavigate();

  const vitrine = useMemo(() => {
    const uniq = [];
    const seen = new Set();
    for (const q of todas) {
      if (!q?.id || seen.has(q.id)) continue;
      uniq.push(q);
      seen.add(q.id);
      if (uniq.length >= 6) break;
    }
    return uniq;
  }, []);

  // leve textura de ruído (data URI) — deixa o fundo mais “vivo”
  const noise =
    "data:image/svg+xml;utf8," +
    encodeURIComponent(
      `<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'>
         <filter id='n'>
           <feTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='2' stitchTiles='stitch'/>
           <feColorMatrix type='saturate' values='0'/>
           <feComponentTransfer><feFuncA type='table' tableValues='0 0 0 0 0 0.03 0'/></feComponentTransfer>
         </filter>
         <rect width='100%' height='100%' filter='url(#n)'/>
       </svg>`
    );

  return (
    <div
      className="relative min-h-screen"
      style={{
        // camadas: gradiente base + grid sutil + noise
        backgroundImage: `
          radial-gradient(1200px 600px at 10% -10%, rgba(16,185,129,0.15), transparent 60%),
          radial-gradient(900px 500px at 90% 0%, rgba(59,130,246,0.12), transparent 55%),
          linear-gradient(180deg, #f8fafc 0%, #eef7f3 35%, #f8fafc 100%),
          url("data:image/svg+xml,%3Csvg width='64' height='64' viewBox='0 0 64 64' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23DDE5E1' stroke-width='1'%3E%3Cpath d='M0 32h64M32 0v64'/%3E%3C/g%3E%3C/svg%3E"),
          url("${noise}")
        `,
        backgroundBlendMode: "normal, normal, normal, multiply, normal",
        backgroundSize: "auto, auto, auto, 64px 64px, 300px 300px",
      }}
    >
      {/* BLOBS decorativos extras (com blur) */}
      <div className="pointer-events-none absolute -top-20 -left-20 h-72 w-72 rounded-full bg-emerald-300/30 blur-3xl" />
      <div className="pointer-events-none absolute top-40 -right-16 h-80 w-80 rounded-full bg-cyan-300/30 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 h-64 w-[36rem] rounded-[999px] bg-emerald-200/20 blur-3xl" />

      {/* Header */}
      <header className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
         <img
  src="/quadras/logo-quadraflex.png"
  alt="QuadraFlex"
  className="h-10 w-auto object-contain rounded-xl drop-shadow-sm"
/>

          <span className="font-semibold text-gray-900 text-lg">QuadraFlex</span>
        </Link>
        <nav className="flex items-center gap-3">
          <Link
            to="/login"
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
          >
            Entrar
          </Link>
          <Link
            to="/register"
            className="px-4 py-2 text-sm font-semibold bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 shadow-sm"
          >
            Criar conta
          </Link>
        </nav>
      </header>

      {/* Hero */}
      <section className="relative z-10 overflow-hidden">
        {/* “faixa” radial atrás do hero para dar destaque */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-x-0 top-0 h-[380px] bg-gradient-to-b from-white/70 to-transparent backdrop-blur-[1px]" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 grid md:grid-cols-2 gap-10">
          <div className="flex flex-col justify-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
              Encontre e agende sua{" "}
              <span className="text-emerald-600">quadra perfeita</span> em minutos.
            </h1>
            <p className="mt-4 text-lg text-gray-600">
              Compare preços, tipos e avaliações. Simples, rápido e seguro.
            </p>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => navigate("/login")}
                className="flex-1 px-4 py-3 rounded-xl border border-white/60 bg-white/80 backdrop-blur text-gray-700 hover:border-gray-300 shadow-sm"
              >
                Procurar quadras
              </button>
              <Link
                to="/register"
                className="px-5 py-3 rounded-xl bg-emerald-600 text-white font-semibold hover:bg-emerald-700 shadow"
              >
                Começar agora
              </Link>
            </div>

            <div className="mt-4 text-xs text-gray-500">
              Dica: faça login para ver recomendações personalizadas.
            </div>
          </div>

          {/* Grid de imagens (vitrine rápida) */}
          <div className="grid grid-cols-2 gap-3">
            {vitrine.slice(0, 4).map((q) => (
              <div
                key={q.id}
                className="rounded-2xl overflow-hidden shadow bg-white/60 backdrop-blur border border-white/50"
              >
                <img
                  src={q.imagem}
                  alt={q.nome}
                  className="w-full h-40 object-cover"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Vitrine */}
      <section className="relative z-10 py-10 md:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Destaques perto de você</h2>
            <button
              onClick={() => navigate("/login")}
              className="text-sm font-medium text-emerald-700 hover:text-emerald-800"
            >
              Ver todas
            </button>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {vitrine.map((q) => (
              <CardPublico key={q.id} q={q} onClick={() => navigate("/login")} />
            ))}
          </div>
        </div>
      </section>

      {/* Como funciona */}
      <section className="relative z-10 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-3 gap-8">
          {[
            { t: "1. Busque", d: "Filtre por tipo, preço, avaliação e localização." },
            { t: "2. Escolha", d: "Veja fotos, detalhes e avaliações reais." },
            { t: "3. Agende", d: "Finalize em poucos cliques e receba confirmação." },
          ].map((s, i) => (
            <div
              key={i}
              className="p-6 rounded-2xl border border-white/50 bg-white/70 backdrop-blur shadow-sm"
            >
              <div className="text-emerald-600 font-bold">{s.t}</div>
              <p className="mt-2 text-gray-600">{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Depoimentos */}
      <section className="relative z-10 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-xl font-semibold text-gray-900">O que dizem por aí</h3>
          <p className="mt-3 text-gray-600">
            “Consegui reservar uma quadra de futsal pro meu time em 2 minutos. Interface muito
            fácil!”
          </p>
          <p className="mt-2 text-gray-600">“Preço justo e confirmação rápida. Recomendo.”</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-8 border-t border-white/50 bg-white/70 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-sm text-gray-500 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>© {new Date().getFullYear()} QuadraFlex — Todos os direitos reservados</div>
          <div className="flex items-center gap-4">
            <Link to="/sobre" className="hover:text-gray-700">
              Sobre
            </Link>
            <Link to="/login" className="hover:text-gray-700">
              Entrar
            </Link>
            <Link to="/register" className="hover:text-gray-700">
              Criar conta
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
