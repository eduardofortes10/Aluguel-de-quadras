// src/pages/Landing.jsx
import React, { useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { quadrasCarrossel as todas } from "../data/quadras";

function CardPublico({ q, onClick }) {
  return (
    <button
      onClick={onClick}
      className="group w-full text-left rounded-2xl overflow-hidden bg-white border border-gray-200 shadow-sm hover:shadow-lg transition"
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
    // pega até 6 itens não repetidos
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Header simples */}
      <header className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-xl bg-emerald-600"></div>
          <span className="font-semibold text-gray-900">QuadraFlex</span>
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
            className="px-4 py-2 text-sm font-semibold bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
          >
            Criar conta
          </Link>
        </nav>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 grid md:grid-cols-2 gap-10">
          <div className="flex flex-col justify-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
              Encontre e agende sua{" "}
              <span className="text-emerald-600">quadra perfeita</span> em minutos.
            </h1>
            <p className="mt-4 text-lg text-gray-600">
              Compare preços, tipos e avaliações. Simples, rápido e seguro.
            </p>

            {/* “Busca” leva para /filtro */}
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => navigate("/filtro")}
                className="flex-1 px-4 py-3 rounded-xl border border-gray-300 bg-white text-gray-700 hover:border-gray-400"
              >
                Procurar quadras
              </button>
              <Link
                to="/register"
                className="px-5 py-3 rounded-xl bg-emerald-600 text-white font-semibold hover:bg-emerald-700"
              >
                Começar agora
              </Link>
            </div>

            <div className="mt-4 text-xs text-gray-500">
              Dica: faça login para ver recomendações personalizadas.
            </div>
          </div>

          {/* Mock screenshot / grid de imagens */}
          <div className="grid grid-cols-2 gap-3">
            {vitrine.slice(0, 4).map((q) => (
              <div key={q.id} className="rounded-2xl overflow-hidden shadow bg-gray-100">
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
      <section className="py-10 md:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Destaques perto de você</h2>
            <button
              onClick={() => navigate("/filtro")}
              className="text-sm font-medium text-emerald-700 hover:text-emerald-800"
            >
              Ver todas
            </button>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {vitrine.map((q) => (
              <CardPublico
                key={q.id}
                q={q}
                onClick={() => navigate("/login")}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Como funciona */}
      <section className="py-12 bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-3 gap-8">
          {[
            { t: "1. Busque", d: "Filtre por tipo, preço, avaliação e localização." },
            { t: "2. Escolha", d: "Veja fotos, detalhes e avaliações reais." },
            { t: "3. Agende", d: "Finalize em poucos cliques e receba confirmação." },
          ].map((s, i) => (
            <div key={i} className="p-6 rounded-2xl border border-gray-200 bg-gray-50">
              <div className="text-emerald-600 font-bold">{s.t}</div>
              <p className="mt-2 text-gray-600">{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Depoimentos simples */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-xl font-semibold text-gray-900">O que dizem por aí</h3>
          <p className="mt-3 text-gray-600">
            “Consegui reservar uma quadra de futsal pro meu time em 2 minutos. Interface muito fácil!”
          </p>
          <p className="mt-2 text-gray-600">“Preço justo e confirmação rápida. Recomendo.”</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-sm text-gray-500 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>© {new Date().getFullYear()} QuadraFlex — Todos os direitos reservados</div>
          <div className="flex items-center gap-4">
            <Link to="/sobre" className="hover:text-gray-700">Sobre</Link>
            <Link to="/login" className="hover:text-gray-700">Entrar</Link>
            <Link to="/register" className="hover:text-gray-700">Criar conta</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
