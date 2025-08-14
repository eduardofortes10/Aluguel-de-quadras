// src/pages/Resultados.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import MobileNav from "../components/MobileNav";
import { api, fileURL } from "../services/api";

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

// Resolve a melhor imagem para exibir (1ª válida); fallback local
function resolveImagem(quadra) {
  const list = Array.isArray(quadra?.imagens) ? quadra.imagens : [];
  for (let c of list) {
    if (!c) continue;
    const s = String(c).trim().replace(/\\/g, "/");
    if (!s) continue;
    if (/^https?:\/\//i.test(s)) return s;              // URL absoluta
    if (s.includes("/uploads/") || s.startsWith("/"))   // servido pelo back
      return fileURL(s);
    return `/quadras/${s}`;                              // arquivo local em /public/quadras
  }
  return "/quadras/quadra1.png";                         // fallback real do projeto
}

export default function Resultados() {
  const { state: filtros } = useLocation();
  const navigate = useNavigate();

  const [carregando, setCarregando] = useState(true);
  const [quadras, setQuadras] = useState([]); // resultado final já filtrado

  // Normaliza filtros recebidos
  const filtrosNorm = useMemo(() => {
    if (!filtros) return null;
    return {
      tipos: Array.isArray(filtros.tipo) ? filtros.tipo.map(normalizarTipo) : [],
      precoMaximo: toNumberOrNull(filtros.precoMaximo),
      avaliacaoMinima: toNumberOrNull(filtros.avaliacaoMinima),
      local: (filtros.local || "").trim(),
    };
  }, [filtros]);

  // Guarda/retorna se não veio filtro (acesso direto à página)
  useEffect(() => {
    if (!filtrosNorm) {
      navigate("/filtro", { replace: true });
    }
  }, [filtrosNorm, navigate]);

  useEffect(() => {
    if (!filtrosNorm) return;

    let cancel = false;

    async function buscar() {
      try {
        setCarregando(true);

        // Monta params para o backend
        const params = { limit: 100 };
        if (filtrosNorm.local) params.q = filtrosNorm.local;

        // Se houver APENAS 1 tipo, pedimos já filtrado no back
        if (filtrosNorm.tipos.length === 1) {
          params.tipo = filtrosNorm.tipos[0];
        }

        const { data } = await api.get("/quadras", { params });
        const base = Array.isArray(data) ? data : [];

        // Filtro adicional no front:
        // - quando houver 0 ou vários tipos
        // - preço máximo
        // - avaliação mínima (usa 'nota' que é o campo do back)
        const tiposSet =
          filtrosNorm.tipos.length > 1
            ? new Set(filtrosNorm.tipos.map(normalizarTipo))
            : null;

        const filtrado = base
          .filter((q) => {
            if (tiposSet) {
              const t = normalizarTipo(q.tipo);
              if (!tiposSet.has(t)) return false;
            }
            if (filtrosNorm.precoMaximo != null) {
              const precoNum = Number(q.preco);
              if (!Number.isFinite(precoNum) || precoNum > filtrosNorm.precoMaximo) return false;
            }
            if (filtrosNorm.avaliacaoMinima != null) {
              const nota = Number(q.nota || 0);
              if (!Number.isFinite(nota) || nota < filtrosNorm.avaliacaoMinima) return false;
            }
            return true;
          })
          // ordena por melhor avaliação e depois menor preço (opcional)
          .sort((a, b) => {
            const na = Number(a.nota || 0), nb = Number(b.nota || 0);
            if (nb !== na) return nb - na;
            const pa = Number(a.preco || 0), pb = Number(b.preco || 0);
            return pa - pb;
          });

        if (!cancel) setQuadras(filtrado);
      } catch (err) {
        console.error("Erro ao buscar quadras:", err?.response?.data || err?.message || err);
        if (!cancel) setQuadras([]);
      } finally {
        if (!cancel) setCarregando(false);
      }
    }

    buscar();
    return () => { cancel = true; };
  }, [filtrosNorm]);

  const handleCliqueQuadra = (q) => {
    // Deixa o detalhe buscar do backend pelo ID
    navigate(`/quadra/${q.id}`);
  };

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

        {/* Resumo dos filtros */}
        {filtrosNorm && (
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
        )}

        {/* Lista */}
        {carregando ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm border p-4">
                <div className="w-full h-36 bg-gray-200 animate-pulse rounded-lg mb-3" />
                <div className="h-4 bg-gray-200 rounded w-2/3 mb-2" />
                <div className="h-3 bg-gray-200 rounded w-1/2 mb-2" />
                <div className="h-4 bg-gray-200 rounded w-1/3" />
              </div>
            ))}
          </div>
        ) : !quadras.length ? (
          <p className="text-gray-600">Nenhuma quadra encontrada com os filtros selecionados.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {quadras.map((q) => {
              const img = resolveImagem(q);
              return (
                <div
                  key={q.id}
                  onClick={() => handleCliqueQuadra(q)}
                  className="cursor-pointer bg-white rounded-xl shadow-md hover:shadow-xl hover:scale-[1.02] transition-transform duration-300 overflow-hidden border"
                >
                  <img
                    src={img}
                    alt={q.nome}
                    className="w-full h-44 object-cover"
                    onError={(e) => (e.currentTarget.src = "/quadras/quadra1.png")}
                    loading="lazy"
                  />

                  <div className="p-4 space-y-1">
                    <h3 className="font-semibold text-lg text-gray-900 line-clamp-1">{q.nome}</h3>
                    <p className="text-sm text-gray-600 line-clamp-1">{q.local}</p>

                    <div className="flex items-center justify-between mt-2">
                      <span className="text-green-700 font-bold">
                        {Number(q.preco || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                      </span>
                      <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2 py-0.5 rounded">
                        ★ {Number(q.nota || 0).toFixed(1)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
