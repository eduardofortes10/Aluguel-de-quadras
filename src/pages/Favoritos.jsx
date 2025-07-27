import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import UserDropdown from "../components/DropdownUser";
import { FaHome } from "react-icons/fa";

export default function Favoritos() {
  const [favoritos, setFavoritos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const usuario_id = localStorage.getItem("usuario_id");
  const navigate = useNavigate();

 useEffect(() => {
  if (!usuario_id) return;

  console.log("🔍 Buscando favoritos do usuário:", usuario_id);

  fetch(`http://localhost:5000/api/favoritos/${usuario_id}`)
    .then((res) => res.json())
    .then((data) => {
      console.log("✅ Dados recebidos:", data);
      setFavoritos(data);
      setCarregando(false);
    })
    .catch((err) => {
      console.error("❌ Erro ao buscar favoritos:", err);
      setCarregando(false);
    });
}, [usuario_id]);


  const removerFavorito = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/favoritos/${id}`, {
        method: "DELETE",
      });
      setFavoritos(favoritos.filter((q) => q.id !== id));
    } catch (err) {
      console.error("Erro ao remover favorito:", err);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="hidden md:block">
        <Sidebar />
      </div>

      <div className="absolute top-4 right-4 z-50">
        <UserDropdown />
      </div>

      <div className="flex-1 p-6 md:pl-20 max-w-7xl mx-auto">
        <div className="flex items-center text-sm text-gray-500 mb-6 space-x-2">
          <Link to="/home" className="hover:underline hover:text-green-600 flex items-center">
            <FaHome className="w-4 h-4 mr-1" />
            Início
          </Link>
          <span>/</span>
          <span className="text-green-700 font-semibold">Favoritos</span>
        </div>

        <h1 className="text-2xl font-bold mb-6 text-green-700">Favoritos</h1>

        {carregando ? (
          <p className="animate-pulse text-gray-500">Carregando quadras favoritas...</p>
        ) : favoritos.length === 0 ? (
          <p className="text-center text-gray-500 text-sm mt-10">
            💤 Você ainda não adicionou nenhuma quadra aos favoritos.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {favoritos.map((quadra) => (
              <div
                key={quadra.id}
                className="bg-white rounded-xl shadow-md overflow-hidden relative hover:shadow-lg hover:scale-[1.01] transition-transform duration-300"
              >
                <img
                  src={
                    quadra.imagem_url?.startsWith("/")
                      ? quadra.imagem_url
                      : `/quadras/${quadra.imagem_url || "sem-imagem.png"}`
                  }
                  alt={quadra.nome}
                  className="w-full h-48 object-cover"
                />

                <div className="p-4">
                  <h2 className="text-lg font-semibold text-gray-800">{quadra.nome}</h2>
                  <p className="text-sm text-gray-600">{quadra.local}</p>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-green-700 font-bold">R$ {quadra.preco}</span>
                    <span className="text-yellow-500">⭐ {quadra.nota || "4.5"}</span>
                  </div>
                  <div className="mt-2">
                    <p className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full w-max">
                      Tipo: {quadra.tipo || "Quadra esportiva"}
                    </p>
                  </div>
                  <button
                    onClick={() => navigate(`/quadra/${quadra.id}`, { state: { quadra } })}
                    className="mt-3 text-sm text-blue-600 hover:underline"
                  >
                    Ver detalhes
                  </button>
                </div>

                <button
                  onClick={() => removerFavorito(quadra.id)}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600 hover:ring-2 ring-offset-1 ring-red-300"
                  title="Remover dos favoritos"
                  aria-label="Remover dos favoritos"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
