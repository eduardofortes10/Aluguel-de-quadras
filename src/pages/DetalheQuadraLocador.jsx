import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import MobileNav from "../components/MobileNav";

export default function DetalhesQuadraLocador() {
  const { id } = useParams();
  const [quadra, setQuadra] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:3001/quadras/${id}`)
      .then((res) => res.json())
      .then((data) => setQuadra(data))
      .catch((err) => console.error("Erro ao carregar detalhes da quadra:", err));
  }, [id]);

  if (!quadra) return <p className="p-4">Carregando...</p>;

  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className="hidden md:block">
        <Sidebar />
      </div>

      <MobileNav />

      <div className="flex-1 md:ml-64 p-4 pb-24">
        <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
          <img
            src={`http://localhost:3001${quadra.imagem_url}`}
            alt={quadra.nome}
            className="w-full h-60 object-cover"
          />

          <div className="p-6">
            {/* Nome e nota */}
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-xl font-bold text-gray-800">{quadra.nome}</h1>
              <div className="text-yellow-500 font-semibold">⭐ {quadra.nota || "4.5"}</div>
            </div>

            {/* Local */}
            <div className="text-sm text-gray-600 mb-2">
              📍 {quadra.local || "Localização não informada"}
            </div>

            {/* Descrição */}
            <div className="mb-4">
              <h2 className="font-medium text-gray-700 mb-1">Descrição</h2>
              <p className="text-gray-600 text-sm">{quadra.descricao || "Sem descrição."}</p>
            </div>

            {/* Preço */}
            <div className="flex justify-between items-center mt-6">
              <span className="text-green-700 font-bold text-lg">
                R${quadra.preco} <span className="text-sm font-normal">/hora</span>
              </span>

              <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                Alugar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
