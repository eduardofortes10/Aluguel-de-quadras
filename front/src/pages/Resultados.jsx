import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import MobileNav from "../components/MobileNav";
import { api } from "../services/api";

export default function Resultados() {
  const { state: filtros } = useLocation();
  const [quadrasFiltradas, setQuadrasFiltradas] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const buscarQuadras = async () => {
      try {
        const { data } = await api.post("/quadras/imagens", filtros || {});
        setQuadrasFiltradas(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Erro ao buscar quadras filtradas:", error);
        setQuadrasFiltradas([]);
      }
    };

    if (filtros) buscarQuadras();
  }, [filtros]);

  const handleCliqueQuadra = (quadra) => {
    navigate(`/quadra/${quadra.id}`, {
      state: {
        quadra: {
          ...quadra,
          imagem: `/quadras/${quadra.nome_arquivo}`,
          dono: {
            nome: quadra.dono_nome,
            email: quadra.dono_email,
            telefone: quadra.dono_telefone,
            foto: quadra.dono_foto || "https://i.imgur.com/ZvWYkBa.png",
          },
        },
      },
    });
  };

  return (
    <div className="flex min-h-screen bg-white">
      <div className="hidden md:block">
        <Sidebar />
      </div>

      <div className="md:hidden fixed top-0 left-0 w-full z-50">
        <MobileNav />
      </div>

      <div className="flex-1 pt-24 md:pt-12 px-4 md:pl-16">
        <button
          onClick={() => navigate("/filtro")}
          className="mb-6 inline-flex items-center text-green-700 hover:text-green-900 font-medium transition"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Voltar para filtros
        </button>

        <h1 className="text-2xl font-bold text-green-800 mb-6">
          Resultados da Busca
        </h1>

        {(!filtros || quadrasFiltradas.length === 0) ? (
          <p className="text-gray-600">
            Nenhuma quadra encontrada com os filtros selecionados.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {quadrasFiltradas.map((quadra) => (
              <div
                key={quadra.id}
                onClick={() => handleCliqueQuadra(quadra)}
                className="cursor-pointer bg-white rounded-xl shadow-md hover:shadow-xl hover:scale-[1.02] transition-transform duration-300 p-4 flex gap-4"
              >
                <img
                  src={`/quadras/${quadra.nome_arquivo}`}
                  alt={quadra.nome}
                  className="w-24 h-24 object-cover rounded-lg border border-gray-200"
                  onError={(e) => (e.currentTarget.src = "/quadras/sem-imagem.png")}
                />
                <div className="flex flex-col justify-between">
                  <h3 className="font-semibold text-lg text-gray-900">
                    {quadra.nome}
                  </h3>
                  <p className="text-sm text-gray-600">{quadra.local}</p>
                  <p className="text-green-700 font-bold text-sm">
                    R$ {quadra.preco}
                  </p>
                  <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2 py-0.5 rounded w-max">
                    ★ {quadra.avaliacao}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
