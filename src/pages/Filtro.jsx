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

  // Filtros compatíveis com o backend
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
    <div className="flex min-h-screen bg-white">
      {/* Sidebar para PC */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* MobileNav para celular */}
      <div className="md:hidden fixed top-0 left-0 w-full z-50">
        <MobileNav />
      </div>

      <div className="flex-1 px-6 pt-24 md:pt-12 md:pl-16">
        <h1 className="text-2xl font-bold text-green-800 mb-6">Filtrar Quadras</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl">
          {/* Tipo de quadra */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Quadra</label>
            <div className="grid grid-cols-2 gap-2">
              {opcoesTipo.map((tipo) => (
                <label key={tipo} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={filtros.tipo.includes(tipo)}
                    onChange={() => handleCheckbox(tipo)}
                    className="accent-green-700"
                  />
                  <span className="text-sm text-gray-700">{tipo}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Local */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Local (cidade ou bairro)</label>
            <input
              type="text"
              value={filtros.local}
              onChange={(e) => setFiltros({ ...filtros, local: e.target.value })}
              placeholder="Ex: Campinas, Centro..."
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-green-600"
            />
          </div>

          {/* Preço Máximo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Preço Máximo (R$)</label>
            <input
              type="number"
              value={filtros.precoMaximo}
              onChange={(e) => setFiltros({ ...filtros, precoMaximo: e.target.value })}
              placeholder="Ex: 100"
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-green-600"
            />
          </div>

          {/* Avaliação mínima */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Avaliação Mínima</label>
            <input
              type="number"
              min="0"
              max="5"
              step="0.1"
              value={filtros.avaliacaoMinima}
              onChange={(e) => setFiltros({ ...filtros, avaliacaoMinima: e.target.value })}
              placeholder="Ex: 4.0"
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-green-600"
            />
          </div>
        </div>

        {/* Botão aplicar */}
        <div className="mt-10">
          <button
            onClick={aplicarFiltros}
            className="bg-green-700 hover:bg-green-800 text-white font-semibold px-6 py-3 rounded-lg shadow-md transition"
          >
            Aplicar Filtros
          </button>
        </div>
      </div>
    </div>
  );
}
