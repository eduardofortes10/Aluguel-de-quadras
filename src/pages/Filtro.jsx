import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import MobileNav from "../components/MobileNav";

export default function Filtro() {
  const navigate = useNavigate();

  const [filtros, setFiltros] = useState({
    tipo: [],
    precoMaximo: "",
    avaliacaoMinima: "",
    local: "",
  });

  const opcoesTipo = [
    "Futsal",
    "Basquete",
    "Vôlei",
    "Tênis",
    "Poliesportiva",
    "Campo",
    "Futebol",
    "Golfe"
  ];

  const handleCheckbox = (tipoSelecionado) => {
    setFiltros((prev) => ({
      ...prev,
      tipo: prev.tipo.includes(tipoSelecionado)
        ? prev.tipo.filter((t) => t !== tipoSelecionado)
        : [...prev.tipo, tipoSelecionado],
    }));
  };

  const aplicarFiltros = () => {
    if (filtros.tipo.length === 0) {
      alert("Selecione ao menos um tipo de quadra.");
      return;
    }
    navigate("/resultados", { state: filtros });
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100">
      {/* Sidebar para PC */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* MobileNav para celular */}
      <div className="md:hidden fixed top-0 left-0 w-full z-50">
        <MobileNav />
      </div>

      <div className="flex-1 pt-24 md:pt-12 px-6 md:pl-16">
        <div className="max-w-4xl mx-auto bg-white/80 backdrop-blur-md shadow-2xl rounded-3xl p-8 border border-gray-200">
          <h1 className="text-3xl font-bold text-green-800 mb-8 text-center">Filtrar Quadras</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Tipo de quadra */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Tipo de Quadra</label>
              <div className="grid grid-cols-2 gap-2">
                {opcoesTipo.map((tipo) => (
                  <label key={tipo} className="flex items-center gap-3 p-2 rounded-md hover:bg-green-50">
                    <input
                      type="checkbox"
                      checked={filtros.tipo.includes(tipo)}
                      onChange={() => handleCheckbox(tipo)}
                      className="accent-green-700 w-4 h-4"
                    />
                    <span className="text-gray-800 text-sm">{tipo}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Local */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Local (cidade ou bairro)</label>
              <input
                type="text"
                value={filtros.local}
                onChange={(e) => setFiltros({ ...filtros, local: e.target.value })}
                placeholder="Ex: Campinas, Centro..."
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            {/* Preço Máximo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Preço Máximo (R$)</label>
              <input
                type="number"
                value={filtros.precoMaximo}
                onChange={(e) => setFiltros({ ...filtros, precoMaximo: e.target.value })}
                placeholder="Ex: 100"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            {/* Avaliação mínima */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Avaliação Mínima</label>
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
          </div>

          {/* Botão aplicar */}
          <div className="mt-10 text-center">
            <button
              onClick={aplicarFiltros}
              className="bg-green-700 hover:bg-green-800 text-white font-semibold px-8 py-3 rounded-xl shadow-lg transition transform hover:scale-105"
            >
              Aplicar Filtros
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
