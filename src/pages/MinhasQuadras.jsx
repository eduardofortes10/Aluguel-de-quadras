// src/pages/MinhasQuadras.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import MobileNav from "../components/MobileNav";
import { quadras, quadrasCarrossel } from "../data/quadras";

function MinhasQuadras() {
  const [alugueis, setAlugueis] = useState([]);
  const usuario = JSON.parse(localStorage.getItem("usuario"));

  useEffect(() => {
    if (usuario?.id) {
      axios
        .get(`/api/quadras/minhas-quadras/${usuario.id}`)
        .then((res) => setAlugueis(res.data))
        .catch((err) => console.error("Erro ao buscar aluguéis:", err));
    }
  }, []);

  const formatarData = (data) => {
    return new Date(data).toLocaleDateString("pt-BR");
  };

  const encontrarQuadra = (id) => {
    return (
      quadras.find((q) => q.id === id) ||
      quadrasCarrossel.find((q) => q.id === id)
    );
  };

  return (
    <div className="flex bg-gray-100 min-h-screen">
      {/* Sidebar Desktop */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* Conteúdo principal */}
      <div className="flex-1">
        {/* Navbar Mobile */}
        <div className="md:hidden">
          <MobileNav />
        </div>

        {/* Conteúdo */}
        <div className="p-6 max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6 text-green-700">Minhas Quadras</h1>

          {alugueis.length === 0 ? (
            <p className="text-gray-600">Você ainda não tem quadras agendadas.</p>
          ) : (
            <div className="grid gap-4">
              {alugueis.map((a) => {
                const quadraInfo = encontrarQuadra(a.quadra_id);

                return (
                  <div key={a.id} className="bg-white border rounded-lg p-4 shadow-md">
                    {quadraInfo?.imagem && (
                      <img
                        src={quadraInfo.imagem}
                        alt={quadraInfo.nome}
                        className="w-full h-40 object-cover rounded-md mb-3"
                      />
                    )}

                    <p><span className="font-semibold">Quadra:</span> {quadraInfo?.nome || "Nome não encontrado"}</p>
                    <p><span className="font-semibold">Local:</span> {quadraInfo?.local || "Local não disponível"}</p>
                    <p><span className="font-semibold">Data:</span> {formatarData(a.data)}</p>
                    <p><span className="font-semibold">Horário:</span> {a.hora_inicio} às {a.hora_fim}</p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MinhasQuadras;
