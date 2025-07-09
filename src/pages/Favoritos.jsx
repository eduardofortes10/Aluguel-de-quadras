import React, { useState } from "react";
import { Link } from "react-router-dom";
import quadra1 from "../assets/quadras1.png";
import quadra2 from "../assets/quadras2.png";
import quadra3 from "../assets/quadras3.png";
import Sidebar from "../components/Sidebar";
export default function Favoritos() {
  const [favoritos, setFavoritos] = useState([
    {
      id: 1,
      nome: "Quadra de Areia",
      local: "Itoupava, Blumenau",
      preco: "R$140",
      nota: 4.5,
      imagem: quadra1,
    },
    {
      id: 2,
      nome: "Quadra de Grama",
      local: "Velha, Blumenau",
      preco: "R$200",
      nota: 4.7,
      imagem: quadra2,
    },
    {
      id: 3,
      nome: "Quadra Coberta",
      local: "Garcia, Blumenau",
      preco: "R$180",
      nota: 4.6,
      imagem: quadra3,
    },
  ]);

  const removerFavorito = (id) => {
    setFavoritos(favoritos.filter((quadra) => quadra.id !== id));
  };

  return (
 <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar fixa */}
      <div className="w-16 bg-[#1E8449] text-white flex flex-col items-center py-4 space-y-4 fixed h-full">
        <div className="w-8 h-8 rounded-full bg-white" />

        {/* Ícone Home */}
        <Link to="/home" title="Home" className="p-2 rounded-lg hover:bg-green-700 transition">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 10.5L12 4l9 6.5M4.5 10.5v9a.5.5 0 00.5.5h4.5v-6h5v6H19a.5.5 0 00.5-.5v-9" />
          </svg>
        </Link>

        {/* Ícone Favoritos */}
        <Link to="/favoritos" title="Favoritos" className="p-2 rounded-lg hover:bg-green-700 transition">
          <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="w-6 h-6" viewBox="0 0 24 24">
            <path d="M6 4a4 4 0 00-4 4c0 5 10 12 10 12s10-7 10-12a4 4 0 00-4-4c-1.6 0-3 .9-4 2.09C13 4.9 11.6 4 10 4z" />
          </svg>
        </Link>

        {/* Outros ícones exemplo */}
        <button title="Chat" className="p-2 rounded-lg hover:bg-green-700 transition">
          <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="w-6 h-6" viewBox="0 0 24 24">
            <path d="M2 5a2 2 0 012-2h16a2 2 0 012 2v11a2 2 0 01-2 2H6l-4 4V5z" />
          </svg>
        </button>

        <Link to="/perfil" title="Perfil" className="p-2 rounded-lg hover:bg-green-700 transition">
          <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="w-6 h-6" viewBox="0 0 24 24">
            <path d="M12 12a5 5 0 100-10 5 5 0 000 10zm0 2c-3.3 0-10 1.7-10 5v1h20v-1c0-3.3-6.7-5-10-5z" />
          </svg>
        </Link>
      </div>

      {/* Conteúdo principal */}
      <div className="flex-1 pl-16 p-6">
{/* Breadcrumb dentro da área principal */}
<div className="mb-4 flex items-center py-4 overflow-x-auto whitespace-nowrap text-sm text-gray-500">
  <Link to="/home" className="text-gray-600 flex items-center hover:underline">
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
      <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
    </svg>
    Home
  </Link>

  <span className="mx-2">/</span>

  <span className="text-blue-600 font-medium">Favoritos</span>
</div>

<h1 className="text-2xl font-bold mb-6 text-green-700">Favoritos</h1>

        {favoritos.length === 0 ? (
          <div className="text-center text-gray-500 mt-20">
            <p className="text-lg">Você ainda não possui favoritos.</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {favoritos.map((quadra) => (
              <div key={quadra.id} className="bg-white rounded-xl shadow-md overflow-hidden relative">
                <img src={quadra.imagem} alt={quadra.nome} className="w-full h-48 object-cover" />
                <div className="p-4">
                  <h2 className="text-lg font-semibold">{quadra.nome}</h2>
                  <p className="text-sm text-gray-600">{quadra.local}</p>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-green-700 font-bold">{quadra.preco}</span>
                    <span className="text-yellow-500">⭐ {quadra.nota}</span>
                  </div>
                </div>
                <button
                  onClick={() => removerFavorito(quadra.id)}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600"
                  title="Remover dos favoritos"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
    </div>
  );
}
