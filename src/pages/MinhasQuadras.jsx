// src/pages/MinhasQuadras.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import MobileNav from "../components/MobileNav";
const API_URL = import.meta.env.VITE_API_URL;

function MinhasQuadras() {
  const [alugueis, setAlugueis] = useState([]);
  const usuario = JSON.parse(localStorage.getItem("usuario"));

  useEffect(() => {
    if (usuario?.id) {
    axios.get(`${API_URL}/api/alugueis/minhas-quadras/${usuario.id}`)

        .then((res) => setAlugueis(res.data))
        .catch((err) => console.error("Erro ao buscar aluguéis:", err));
    }
  }, []);

  const formatarData = (data) => {
    return new Date(data).toLocaleDateString("pt-BR");
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
        <div className="p-6 max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold mb-6 text-green-700">Minhas Quadras</h1>

          {alugueis.length === 0 ? (
            <p className="text-gray-600">Você ainda não tem quadras agendadas.</p>
          ) : (
            <div className="grid gap-6">
              {alugueis.map((a) => (
                <div
                  key={a.id}
                  className="bg-white border rounded-xl shadow-lg overflow-hidden flex flex-col md:flex-row"
                >
                  {/* Imagem da quadra */}
                  <img
                    src={`/quadras/${a.imagem_url}`}
                    alt={a.nome}
                    onError={(e) => {
                      e.target.src = "/quadras/sem-imagem.png";
                    }}
                    className="md:w-1/3 w-full h-48 object-cover"
                  />

                  {/* Informações da quadra */}
                  <div className="p-4 flex flex-col justify-between flex-1">
                    <div>
                      <h2 className="text-xl font-bold text-green-700 mb-2">{a.nome || "Quadra"}</h2>

                      <p className="text-gray-600 flex items-center mb-1">
                        📅 <span className="ml-2 font-medium">Data:</span> {formatarData(a.data)}
                      </p>

                      <p className="text-gray-600 flex items-center mb-1">
                        ⏰ <span className="ml-2 font-medium">Horário:</span> {a.hora_inicio} às {a.hora_fim}
                      </p>

                      {a.valor_pago && (
                        <p className="text-gray-600 flex items-center mb-1">
                          💰 <span className="ml-2 font-medium">Valor pago:</span> R$ {parseFloat(a.valor_pago).toFixed(2)}
                        </p>
                      )}

                      {a.observacoes && (
                        <p className="text-gray-600 flex items-start mb-1">
                          📝 <span className="ml-2 font-medium">Obs:</span> {a.observacoes}
                        </p>
                      )}
                    </div>

                    {/* Botão (pode virar "ver detalhes" ou "cancelar") */}
                    <div className="mt-4">
                      
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MinhasQuadras;
