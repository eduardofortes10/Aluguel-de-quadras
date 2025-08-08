import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import UserDropdown from "../components/DropdownUser";
import MobileNav from "../components/MobileNav";
import { FaPlus, FaTrash } from "react-icons/fa";
import { toast } from "react-hot-toast";
import { api, fileURL } from "../services/api";

export default function HomeLocador() {
  const [quadras, setQuadras] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const usuario = JSON.parse(localStorage.getItem("usuario"));
    if (!usuario?.id) {
      toast.error("Usuário não autenticado.");
      return;
    }

    const carregar = async () => {
      try {
        const { data } = await api.get("/quadras", { params: { dono_id: usuario.id } });
        if (Array.isArray(data)) {
          setQuadras(data);
        } else {
          console.warn("⚠️ Resposta inesperada:", data);
          setQuadras([]);
        }
      } catch (err) {
        console.error("❌ Erro ao carregar quadras:", err);
        toast.error("Erro ao carregar quadras.");
      }
    };

    carregar();
  }, []);

  const handleNovaQuadra = () => {
    navigate("/cadastrarquadra");
  };

  const handleExcluirQuadra = async (id) => {
    if (!window.confirm("Tem certeza que deseja excluir esta quadra?")) return;

    try {
      await api.delete(`/quadras/${id}`);
      setQuadras((prev) => prev.filter((q) => q.id !== id));
      toast.success("Quadra excluída com sucesso!");
    } catch (error) {
      console.error("❌ Erro na exclusão:", error);
      toast.error("Erro na conexão com o servidor.");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100 relative">
      <div className="hidden md:block">
        <Sidebar />
      </div>

      <MobileNav />

      <div className="flex-1 md:ml-64 p-4 pb-24 relative">
        <div className="hidden md:flex justify-end mb-4">
          <UserDropdown />
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h1 className="text-2xl font-bold text-green-700">Quadras Cadastradas</h1>
          <button
            onClick={handleNovaQuadra}
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition w-full sm:w-auto"
          >
            <FaPlus /> Nova Quadra
          </button>
        </div>

        {Array.isArray(quadras) && quadras.length === 0 ? (
          <p className="text-gray-500">Você ainda não cadastrou nenhuma quadra.</p>
        ) : (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {quadras.map((quadra) => {
              // imagens pode vir como array (recomendado) ou string JSON
              let imagens = [];
              if (Array.isArray(quadra.imagens)) {
                imagens = quadra.imagens;
              } else if (typeof quadra.imagens === "string") {
                try {
                  imagens = JSON.parse(quadra.imagens);
                } catch (e) {
                  console.warn("⚠️ Erro ao processar imagens:", quadra.imagens);
                }
              }

              // Usa fileURL para montar a URL de uploads do backend
              const imagemUrl =
                imagens.length > 0 && typeof imagens[0] === "string"
                  ? fileURL(imagens[0])
                  : "/quadras/default.png";

              return (
                <div key={quadra.id} className="bg-white rounded shadow overflow-hidden">
                  <img
                    src={imagemUrl}
                    alt={quadra.nome}
                    className="w-full h-48 object-cover"
                    onError={(e) => (e.currentTarget.src = "/quadras/default.png")}
                  />
                  <div className="p-4">
                    <h2 className="text-lg font-bold text-gray-800">{quadra.nome}</h2>
                    <p className="text-sm text-gray-600">{quadra.local}</p>
                    <div className="mt-2 flex justify-between items-center">
                      <span className="text-green-600 font-bold">R${quadra.preco}</span>
                      <span className="text-yellow-500">⭐ {quadra.nota || "4.5"}</span>
                    </div>
                    <div className="mt-4 flex justify-between text-sm">
                      <Link to={`/quadra-locador/${quadra.id}`} className="text-blue-600 hover:underline">
                        Ver detalhes
                      </Link>
                      <button
                        onClick={() => handleExcluirQuadra(quadra.id)}
                        className="text-red-600 flex items-center gap-1 hover:underline"
                      >
                        <FaTrash className="text-sm" /> Excluir
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
