// src/pages/Resultados.jsx
import React, { useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import MobileNav from "../components/MobileNav";
import { quadras, quadrasCarrossel } from "../data/quadras";
import CourtCard from "../components/CourtCard";
import { X, Filter, ChevronLeft } from "lucide-react";

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
  const cleaned = String(str).replace(/[^\d.,-]/g, "").replace(/\./g, "").replace(",", ".");
  const num = parseFloat(cleaned);
  return Number.isFinite(num) ? num : NaN;
}
function formatBRL(n) {
  if (n == null || !Number.isFinite(Number(n))) return "—";
  return Number(n).toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });
}

export default function Resultados() {
  const { state: filtros } = useLocation();
  const navigate = useNavigate();

  // Normaliza filtros vindos do Filtro.jsx
  const filtrosNorm = useMemo(() => {
    if (!filtros) return null;
    return {
      tipos: Array.isArray(filtros.tipo) ? filtros.tipo.map(normalizarTipo) : [],
      precoMaximo: toNumberOrNull(filtros.precoMaximo),
      avaliacaoMinima: toNumberOrNull(filtros.avaliacaoMinima),
      local: (filtros.local || "").trim().toLowerCase(),
    };
  }, [filtros]);

  // Catálogo local (data/quadras.js)
  const catalogo = useMemo(() => {
    const base = [...quadrasCarrossel, ...quadras];
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
    navigate(`/quadra/${q.id}`, { state: { fromStatic: true, quadra: q } });
  };

  if (!filtrosNorm) {
    navigate("/filtro", { replace: true });
    return null;
  }

  // Helpers para atualizar/remover chips
  const pushState = (payload) => navigate("/resultados", { state: payload, replace: true });
  const payloadBase = {
    tipo: filtrosNorm.tipos,                 // já normalizado
    precoMaximo: filtrosNorm.precoMaximo,    // number | null
    avaliacaoMinima: filtrosNorm.avaliacaoMinima, // number | null
    local: filtrosNorm.local,                // string (lowercase)
  };

  const removeTipo = (t) => {
    const novos = filtrosNorm.tipos.filter((x) => x !== t);
    pushState({ ...payloadBase, tipo: novos });
  };
  const removeLocal = () => pushState({ ...payloadBase, local: "" });
  const removePreco = () => pushState({ ...payloadBase, precoMaximo: null });
  const removeAvaliacao = () => pushState({ ...payloadBase, avaliacaoMinima: null });
  const limparTudo = () =>
    pushState({ tipo: [], precoMaximo: null, avaliacaoMinima: null, local: "" });

  // UI: Chips
  const Chip = ({ children, onRemove }) => (
    <span className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1.5 rounded-full text-xs">
      {children}
      <button
        aria-label="Remover filtro"
        onClick={onRemove}
        className="hover:text-emerald-900"
        type="button"
      >
        <X size={14} />
      </button>
    </span>
  );

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
        {/* Header/ações */}
        <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
          <button
            onClick={() => navigate("/home")}
            className="inline-flex items-center text-emerald-700 hover:text-emerald-900 font-medium transition"
          >
            <ChevronLeft className="mr-2" size={18} />
            Voltar para o menu
          </button>

          <div className="flex items-center gap-2">
            <span className="text-sm text-zinc-600">
              {resultados.length} resultado{resultados.length !== 1 ? "s" : ""}
            </span>
            <button
              onClick={limparTudo}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-zinc-300 text-zinc-700 hover:bg-zinc-50 text-sm"
              title="Limpar todos filtros"
            >
              <X size={16} />
              Limpar tudo
            </button>
            <button
              onClick={() => navigate("/filtro")}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 shadow text-sm"
            >
              <Filter size={16} />
              Ajustar
            </button>
          </div>
        </div>

        <h1 className="text-2xl font-bold text-green-800 mb-2">Resultados da Busca</h1>

        {/* Resumo em chips */}
        <div className="mb-6 flex flex-wrap items-center gap-2">
          {filtrosNorm.tipos.map((t) => (
            <Chip key={t} onRemove={() => removeTipo(t)}>
              {t}
            </Chip>
          ))}

          {filtrosNorm.local && (
            <Chip onRemove={removeLocal}>
              Local: <span className="font-semibold">{filtrosNorm.local}</span>
            </Chip>
          )}

          {filtrosNorm.precoMaximo != null && (
            <Chip onRemove={removePreco}>
              Até <span className="font-semibold">{formatBRL(filtrosNorm.precoMaximo)}</span>
            </Chip>
          )}

          {filtrosNorm.avaliacaoMinima != null && (
            <Chip onRemove={removeAvaliacao}>
              Nota mínima:{" "}
              <span className="font-semibold">{Number(filtrosNorm.avaliacaoMinima).toFixed(1)}</span>
            </Chip>
          )}

          {filtrosNorm.tipos.length === 0 &&
            filtrosNorm.local === "" &&
            filtrosNorm.precoMaximo == null &&
            filtrosNorm.avaliacaoMinima == null && (
              <span className="text-sm text-zinc-500">Sem filtros ativos.</span>
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
                  // Integração futura de favoritos
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
