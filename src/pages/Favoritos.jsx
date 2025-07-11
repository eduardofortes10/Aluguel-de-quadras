import React, { useState } from "react";
import { Link } from "react-router-dom";
import quadra1 from "../assets/quadras1.png";
import quadra2 from "../assets/quadras2.png";
import quadra3 from "../assets/quadras3.png";
import Sidebar from "../components/Sidebar";
import UserDropdown from "../components/DropdownUser";

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
       {/* Sidebar sempre visível em desktop, oculta no mobile por padrão (ajuste se tiver menu mobile) */}
            <div className="md:block hidden">
              <Sidebar />
            </div>

<div className="absolute top-4 right-4 z-50">
  <UserDropdown />
</div>

    <div className="flex min-h-screen bg-gray-100">
      
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
