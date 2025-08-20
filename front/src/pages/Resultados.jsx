// src/pages/Resultados.jsx
import React, { useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import MobileNav from "../components/MobileNav";
import { quadras, quadrasCarrossel } from "../data/quadras";
import CourtCard from "../components/CourtCard"; // ⬅️ NOVO

function normalizarTipo(v) {
  if (!v) return "";
  const s = String(v).trim().toLowerCase();
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : "";
}

function toNumberOrNull(v) {
  if (v == null || v === "") return null;
  const n = Number(String(v).replace(",", "."));
  return Number.isFinite(n) ? n : null;
}

function parsePreco(str) {
  if (str == null) return NaN;
  // extrai números com , ou . (ex.: "R$ 200 /hora" -> 200)
  const cleaned = String(str).replace(/[^\d.,-]/g, "").replace(/\./g, "").replace(",", ".");
  const num = parseFloat(cleaned);
  return Number.isFinite(num) ? num : NaN;
}

export default function Resultados() {
  const { state: filtros } = useLocation();
  const navigate = useNavigate();

  // normaliza filtros vindos do Filtro.jsx
  const filtrosNorm = useMemo(() => {
    if (!filtros) return null;
    return {
      tipos: Array.isArray(filtros.tipo) ? filtros.tipo.map(normalizarTipo) : [],
      precoMaximo: toNumberOrNull(filtros.precoMaximo),
      avaliacaoMinima: toNumberOrNull(filtros.avaliacaoMinima),
      local: (filtros.local || "").trim().toLowerCase(),
    };
  }, [filtros]);

  // catálogo local (somente data/quadras.js)
  const catalogo = useMemo(() => {
    const base = [...quadrasCarrossel, ...quadras];
    // dedup por id, mantendo o primeiro que aparecer
    const seen = new Set();
    const dedup = [];
    for (const q of base) {
      if (seen.has(q.id)) continue;
      seen.add(q.id);
      dedup.push({
        ...q,
        tipoNorm: normalizarTipo(q.tipo),
        localNorm: String(q.local || "").toLowerCase(),
        precoNumber: parsePreco(q.preco),
        avaliacaoNumber: Number(q.avaliacao || q.nota || 0),
      });
    }
    return dedup;
  }, []);

  const resultados = useMemo(() => {
    if (!filtrosNorm) return [];

    const tiposSet = filtrosNorm.tipos.length ? new Set(filtrosNorm.tipos) : null;

    const filtrado = catalogo.filter((q) => {
      if (tiposSet && !tiposSet.has(q.tipoNorm)) return false;

      if (filtrosNorm.local) {
        const alvo = filtrosNorm.local;
        const matchLocal =
          q.localNorm.includes(alvo) ||
          String(q.nome || "").toLowerCase().includes(alvo);
        if (!matchLocal) return false;
      }

      if (filtrosNorm.precoMaximo != null) {
        if (!Number.isFinite(q.precoNumber) || q.precoNumber > filtrosNorm.precoMaximo) return false;
      }

      if (filtrosNorm.avaliacaoMinima != null) {
        if (!Number.isFinite(q.avaliacaoNumber) || q.avaliacaoNumber < filtrosNorm.avaliacaoMinima) return false;
      }

      return true;
    });

    // ordena: maior avaliação → menor preço
    filtrado.sort((a, b) => {
      const nb = b.avaliacaoNumber - a.avaliacaoNumber;
      if (nb !== 0) return nb;
      const pa = Number.isFinite(a.precoNumber) ? a.precoNumber : Infinity;
      const pb = Number.isFinite(b.precoNumber) ? b.precoNumber : Infinity;
      return pa - pb;
    });

    return filtrado;
  }, [catalogo, filtrosNorm]);

  const handleCliqueQuadra = (q) => {
    // mantém sua navegação atual e dados via state
    navigate(`/quadra/${q.id}`, { state: { fromStatic: true, quadra: q } });
  };

  if (!filtrosNorm) {
    // acesso direto à página sem passar pelo Filtro
    navigate("/filtro", { replace: true });
    return null;
  }

  return (
    <div className="flex min-h-screen bg-white">
      {/* Sidebar desktop */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* Nav mobile fixa */}
      <div className="md:hidden fixed top-0 left-0 w-full z-50">
        <MobileNav />
      </div>

      <div className="flex-1 pt-24 md:pt-12 px-4 md:pl-16">
        <button
          onClick={() => navigate("/filtro")}
          className="mb-6 inline-flex items-center text-green-700 hover:text-green-900 font-medium transition"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Voltar para filtros
        </button>

        <h1 className="text-2xl font-bold text-green-800 mb-4">Resultados da Busca</h1>

        {/* Resumo dos filtros (mantive seu texto) */}
        <div className="text-sm text-gray-600 mb-6">
          {filtrosNorm.tipos.length > 0 && (
            <span className="mr-4">
              Tipos: <strong>{filtrosNorm.tipos.join(", ")}</strong>
            </span>
          )}
          {filtrosNorm.local && (
            <span className="mr-4">
              Local: <strong>{filtrosNorm.local}</strong>
            </span>
          )}
          {filtrosNorm.precoMaximo != null && (
            <span className="mr-4">
              Até:{" "}
              <strong>
                {filtrosNorm.precoMaximo.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
              </strong>
            </span>
          )}
          {filtrosNorm.avaliacaoMinima != null && (
            <span>
              Nota mínima: <strong>{filtrosNorm.avaliacaoMinima}</strong>
            </span>
          )}
        </div>

        {/* Lista com CourtCard */}
        {!resultados.length ? (
          <p className="text-gray-600">Nenhuma quadra encontrada com os filtros selecionados.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {resultados.map((q) => (
              <CourtCard
                key={q.id}
                quadra={q}
                variant="default"
                onClick={() => handleCliqueQuadra(q)}
                onFavorite={(quadra, fav) => {
                  // Integração futura de favoritos: api.post/delete
                  // console.log("Fav resultados:", quadra.id, fav);
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
