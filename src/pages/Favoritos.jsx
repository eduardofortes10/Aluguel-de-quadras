import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import UserDropdown from "../components/DropdownUser";
import MobileNav from "../components/MobileNav";

export default function Favoritos() {
  const [favoritos, setFavoritos] = useState([]);

  useEffect(() => {
    fetch("/api/favoritos/1")
      .then((res) => {
        console.log("Resposta bruta:", res);
        return res.json();
      })
      .then((data) => {
        console.log("Dados recebidos:", data);
        setFavoritos(data);
      })
      .catch((err) => console.error("Erro ao carregar favoritos:", err));
  }, []);

  const removerFavorito = (id) => {
    setFavoritos(favoritos.filter((quadra) => quadra.id !== id));
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="md:block hidden">
        <Sidebar />
      </div>

      <div className="absolute top-4 right-4 z-50">
        <UserDropdown />
      </div>

      <div className="flex min-h-screen bg-gray-100">
        <div className="flex-1 pl-16 p-6">
          {/* Breadcrumb */}
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

          {favoritos.map((quadra, index) => (
  <div key={`${quadra.id}-${index}`} className="bg-white rounded-xl shadow-md overflow-hidden relative mb-6">
    <img
      src={quadra.imagem_url?.startsWith("/") ? quadra.imagem_url : `/quadras/${quadra.imagem_url}`}
      alt={quadra.nome}
      className="w-full h-48 object-cover"
    />



              <div className="p-4">
                <h2 className="text-lg font-semibold">{quadra.nome}</h2>
                <p className="text-sm text-gray-600">{quadra.local}</p>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-green-700 font-bold">R${quadra.preco}</span>
                  <span className="text-yellow-500">⭐ {quadra.nota || "4.5"}</span>
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
      </div>
    </div>
  );
}
