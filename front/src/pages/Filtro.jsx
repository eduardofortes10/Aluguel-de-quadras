// src/pages/Filtro.jsx
import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import MobileNav from "../components/MobileNav";
import { toast } from "react-hot-toast";

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
      tipo: filtros.tipo.map(normalizarTipo), // ex.: ["Futebol","Basquete"]
      precoMaximo: precoMax,                   // number | null
      avaliacaoMinima: avaliacaoMin,           // number | null
      local: filtros.local.trim(),             // string
    };

    // navega passando state (Resultados.jsx pode consumir e decidir
    // se chama o backend com ?tipo= quando houver só 1 tipo, e filtra o resto no front)
    navigate("/resultados", { state: payload });
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100">
      {/* Sidebar para desktop */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* MobileNav fixo no topo */}
      <div className="md:hidden fixed top-0 left-0 w-full z-50">
        <MobileNav />
      </div>

      <div className="flex-1 pt-24 md:pt-12 px-6 md:pl-16">
        <div className="max-w-4xl mx-auto bg-white/80 backdrop-blur-md shadow-2xl rounded-3xl p-8 border border-gray-200">
          <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
            <h1 className="text-3xl font-bold text-green-800">Filtrar Quadras</h1>
            <button
              type="button"
              onClick={selecionarTodosOuLimpar}
              className="text-sm px-3 py-2 rounded-lg border border-gray-300 hover:bg-gray-50"
            >
              {todosSelecionados ? "Limpar tipos" : "Selecionar todos os tipos"}
            </button>
          </div>

          <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={aplicarFiltros}>
            {/* Tipo de quadra */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Tipo de Quadra
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {opcoesTipo.map((tipo) => (
                  <label
                    key={tipo}
                    className="flex items-center gap-3 p-2 rounded-md hover:bg-green-50 cursor-pointer border border-transparent hover:border-green-200"
                  >
                    <input
                      type="checkbox"
                      checked={filtros.tipo.includes(tipo)}
                      onChange={() => toggleTipo(tipo)}
                      className="accent-green-700 w-4 h-4"
                    />
                    <span className="text-gray-800 text-sm">{tipo}</span>
                  </label>
                ))}
              </div>
              {filtros.tipo.length > 0 && (
                <p className="text-xs text-gray-500 mt-2">
                  {filtros.tipo.length} {filtros.tipo.length === 1 ? "tipo selecionado" : "tipos selecionados"}
                </p>
              )}
            </div>

            {/* Local */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Local (cidade ou bairro)
              </label>
              <input
                type="text"
                value={filtros.local}
                onChange={(e) => setFiltros({ ...filtros, local: e.target.value })}
                placeholder="Ex: Campinas, Centro..."
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                Dica: você também pode digitar uma rua ou referência.
              </p>
            </div>

            {/* Preço Máximo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Preço Máximo (R$)
              </label>
              <input
                type="number"
                min="0"
                value={filtros.precoMaximo}
                onChange={(e) => setFiltros({ ...filtros, precoMaximo: e.target.value })}
                placeholder="Ex: 100"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            {/* Avaliação mínima */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Avaliação mínima (0 a 5)
              </label>
              <input
                type="number"
                min="0"
                max="5"
                step="0.1"
                value={filtros.avaliacaoMinima}
                onChange={(e) => setFiltros({ ...filtros, avaliacaoMinima: e.target.value })}
                placeholder="Ex: 4.0"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            {/* Ações */}
            <div className="md:col-span-2 flex items-center justify-center gap-4 mt-2">
              <button
                type="button"
                onClick={limparFiltros}
                className="px-6 py-3 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Limpar
              </button>
              <button
                type="submit"
                className="bg-green-700 hover:bg-green-800 text-white font-semibold px-8 py-3 rounded-xl shadow-lg transition transform hover:scale-105"
              >
                Aplicar Filtros
              </button>
            </div>
          </form>

          {/* Observação sobre como o back pode ser usado pelo Resultados */}
          <div className="mt-6 text-xs text-gray-500">
            <p>
              Observação: quando houver <strong>apenas 1 tipo</strong> selecionado, a página de resultados pode
              consultar o backend com <code>?tipo=&lt;Tipo&gt;</code> para otimizar. Com vários tipos, traga as quadras e filtre no front.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
