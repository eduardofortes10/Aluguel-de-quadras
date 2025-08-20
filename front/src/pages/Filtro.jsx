// src/pages/Filtro.jsx
import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import MobileNav from "../components/MobileNav";
import { toast } from "react-hot-toast";
import {
  SlidersHorizontal,
  Filter,
  X as IconX,
  MapPin,
  Star,
  CircleDollarSign,
  ChevronLeft,
} from "lucide-react";

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

export default function Filtro() {
  const navigate = useNavigate();

  const opcoesTipo = useMemo(
    () => [
      "Futebol",
      "Futsal",
      "Basquete",
      "Vôlei",
      "Tênis",
      "Poliesportiva",
      "Campo",
      "Golfe",
    ],
    []
  );

  const [filtros, setFiltros] = useState({
    tipo: [],
    precoMaximo: "",
    avaliacaoMinima: "",
    local: "",
  });

  const todosSelecionados =
    filtros.tipo.length > 0 && filtros.tipo.length === opcoesTipo.length;

  const toggleTipo = (tipoSelecionado) => {
    setFiltros((prev) => ({
      ...prev,
      tipo: prev.tipo.includes(tipoSelecionado)
        ? prev.tipo.filter((t) => t !== tipoSelecionado)
        : [...prev.tipo, tipoSelecionado],
    }));
  };

  const selecionarTodosOuLimpar = () => {
    setFiltros((prev) => ({
      ...prev,
      tipo: todosSelecionados ? [] : [...opcoesTipo],
    }));
  };

  const limparFiltros = () => {
    setFiltros({
      tipo: [],
      precoMaximo: "",
      avaliacaoMinima: "",
      local: "",
    });
    toast.success("Filtros limpos");
  };

  const aplicarFiltros = (e) => {
    e?.preventDefault();

    // validações leves
    const precoMax = toNumberOrNull(filtros.precoMaximo);
    const avaliacaoMin = toNumberOrNull(filtros.avaliacaoMinima);

    if (precoMax != null && precoMax < 0) {
      toast.error("Preço máximo não pode ser negativo.");
      return;
    }
    if (avaliacaoMin != null && (avaliacaoMin < 0 || avaliacaoMin > 5)) {
      toast.error("Avaliação mínima deve estar entre 0 e 5.");
      return;
    }

    const payload = {
      tipo: filtros.tipo.map(normalizarTipo),
      precoMaximo: precoMax,
      avaliacaoMinima: avaliacaoMin,
      local: filtros.local.trim(),
    };

    navigate("/resultados", { state: payload });
  };

  // Views auxiliares
  const TipoChip = ({ label, active, onClick }) => (
    <button
      type="button"
      onClick={onClick}
      className={[
        "px-3 py-2 rounded-full text-sm font-medium transition",
        active
          ? "bg-emerald-600 text-white shadow-sm hover:bg-emerald-700"
          : "bg-white/70 text-zinc-700 hover:bg-white border border-zinc-200",
      ].join(" ")}
    >
      {label}
    </button>
  );

  const ChipSelecionado = ({ label, onRemove }) => (
    <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-1 rounded-full text-xs">
      {label}
      <button
        type="button"
        onClick={onRemove}
        aria-label={`Remover ${label}`}
        className="hover:text-emerald-900"
      >
        <IconX size={14} />
      </button>
    </span>
  );

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-100">
      {/* Sidebar desktop */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* MobileNav fixa */}
      <div className="md:hidden fixed top-0 left-0 w-full z-50">
        <MobileNav />
      </div>

      {/* Conteúdo */}
      <div className="flex-1 pt-24 md:pt-12 px-4 md:pl-16 pb-28 md:pb-12">
        {/* Header interno */}
        <div className="max-w-6xl mx-auto mb-4 flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-emerald-700 hover:text-emerald-900 font-medium"
          >
            <ChevronLeft size={18} />
            Voltar
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={limparFiltros}
              className="hidden sm:inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-zinc-300 text-zinc-700 hover:bg-zinc-50"
            >
              <IconX size={16} />
              Limpar tudo
            </button>
            <button
              type="button"
              onClick={aplicarFiltros}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 shadow"
            >
              <Filter size={16} />
              Ver resultados
            </button>
          </div>
        </div>

        {/* Card principal */}
        <div className="max-w-6xl mx-auto bg-white/80 backdrop-blur-md shadow-xl rounded-3xl border border-zinc-200 overflow-hidden">
          {/* Título */}
          <div className="flex items-center justify-between gap-3 px-6 py-5 border-b border-zinc-200">
            <div className="flex items-center gap-3">
              <SlidersHorizontal className="text-emerald-600" />
              <h1 className="text-2xl font-bold text-zinc-900">Filtrar Quadras</h1>
            </div>
            <button
              type="button"
              onClick={selecionarTodosOuLimpar}
              className="text-sm px-3 py-2 rounded-lg border border-zinc-300 hover:bg-zinc-50"
            >
              {todosSelecionados ? "Limpar tipos" : "Selecionar todos os tipos"}
            </button>
          </div>

          {/* Resumo selecionado */}
          <div className="px-6 pt-4">
            {filtros.tipo.length > 0 ? (
              <div className="flex flex-wrap items-center gap-2 pb-2">
                {filtros.tipo.map((t) => (
                  <ChipSelecionado
                    key={t}
                    label={t}
                    onRemove={() => toggleTipo(t)}
                  />
                ))}
              </div>
            ) : (
              <p className="text-sm text-zinc-500">Nenhum tipo selecionado.</p>
            )}
          </div>

          {/* Form */}
          <form onSubmit={aplicarFiltros} className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
            {/* Coluna 1: Tipos */}
            <section className="lg:col-span-1">
              <h2 className="text-sm font-semibold text-zinc-700 mb-3">Tipo de quadra</h2>
              <div className="flex flex-wrap gap-2">
                {opcoesTipo.map((tipo) => (
                  <TipoChip
                    key={tipo}
                    label={tipo}
                    active={filtros.tipo.includes(tipo)}
                    onClick={() => toggleTipo(tipo)}
                  />
                ))}
              </div>
              {filtros.tipo.length > 0 && (
                <p className="text-xs text-zinc-500 mt-2">
                  {filtros.tipo.length} {filtros.tipo.length === 1 ? "tipo selecionado" : "tipos selecionados"}
                </p>
              )}
            </section>

            {/* Coluna 2: Local e Avaliação */}
            <section className="lg:col-span-1">
              {/* Local */}
              <label className="block text-sm font-semibold text-zinc-700 mb-2">
                Local (cidade ou bairro)
              </label>
              <div className="relative mb-4">
                <input
                  type="text"
                  value={filtros.local}
                  onChange={(e) => setFiltros({ ...filtros, local: e.target.value })}
                  placeholder="Ex: Campinas, Centro..."
                  className="w-full border border-zinc-300 rounded-xl px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <MapPin className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
              </div>

              {/* Avaliação mínima */}
              <label className="block text-sm font-semibold text-zinc-700 mb-2">
                Avaliação mínima
              </label>
              <div className="rounded-xl border border-zinc-200 p-4">
                <div className="flex items-center justify-between text-sm text-zinc-600 mb-2">
                  <span className="inline-flex items-center gap-2">
                    <Star className="text-amber-500" size={16} />
                    0 – 5
                  </span>
                  <span className="font-medium text-zinc-900">
                    {filtros.avaliacaoMinima || "—"}
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="5"
                  step="0.5"
                  value={filtros.avaliacaoMinima || 0}
                  onChange={(e) => setFiltros({ ...filtros, avaliacaoMinima: e.target.value })}
                  className="w-full accent-emerald-600"
                />
                <p className="text-[11px] text-zinc-500 mt-1">
                  Dica: 4.0+ mostra quadras muito bem avaliadas.
                </p>
              </div>
            </section>

            {/* Coluna 3: Preço */}
            <section className="lg:col-span-1">
              <label className="block text-sm font-semibold text-zinc-700 mb-2">
                Preço máximo por hora (R$)
              </label>
              <div className="rounded-xl border border-zinc-200 p-4">
                <div className="flex items-center justify-between text-sm text-zinc-600 mb-2">
                  <span className="inline-flex items-center gap-2">
                    <CircleDollarSign className="text-emerald-600" size={16} />
                    0 – 500
                  </span>
                  <span className="font-medium text-zinc-900">
                    {filtros.precoMaximo !== "" ? `R$ ${filtros.precoMaximo}` : "—"}
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="500"
                  step="10"
                  value={filtros.precoMaximo || 0}
                  onChange={(e) => setFiltros({ ...filtros, precoMaximo: e.target.value })}
                  className="w-full accent-emerald-600"
                />
                <div className="mt-3">
                  <input
                    type="number"
                    min="0"
                    max="500"
                    step="10"
                    value={filtros.precoMaximo}
                    onChange={(e) => setFiltros({ ...filtros, precoMaximo: e.target.value })}
                    placeholder="Ex: 120"
                    className="w-full border border-zinc-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <p className="text-[11px] text-zinc-500 mt-1">
                  Use o slider ou digite um valor.
                </p>
              </div>
            </section>

            {/* CTA desktop */}
            <div className="hidden md:flex lg:col-span-3 items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={limparFiltros}
                className="px-6 py-3 rounded-xl border border-zinc-300 text-zinc-700 hover:bg-zinc-50"
              >
                Limpar
              </button>
              <button
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-8 py-3 rounded-xl shadow transition"
              >
                Aplicar filtros
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Barra de ação fixa (mobile) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50">
        <div className="mx-4 mb-4 rounded-2xl bg-white shadow-xl border border-zinc-200 overflow-hidden">
          <div className="flex items-center justify-between px-3 py-2 text-xs text-zinc-600 border-b border-zinc-200">
            <span>{filtros.tipo.length} tipo(s) • Preço: {filtros.precoMaximo || "—"} • Nota: {filtros.avaliacaoMinima || "—"}</span>
            <button
              onClick={limparFiltros}
              className="text-zinc-500 hover:text-zinc-700"
            >
              Limpar
            </button>
          </div>
          <div className="flex gap-2 p-2">
            <button
              onClick={limparFiltros}
              className="flex-1 px-4 py-3 rounded-xl border border-zinc-300 text-zinc-700"
            >
              Limpar
            </button>
            <button
              onClick={aplicarFiltros}
              className="flex-1 px-4 py-3 rounded-xl bg-emerald-600 text-white font-semibold"
            >
              Ver resultados
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
