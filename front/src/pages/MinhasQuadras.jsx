// src/pages/MinhasQuadras.jsx
import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import MobileNav from "../components/MobileNav";
import { api, fileURL } from "../services/api";

function MinhasQuadras() {
  const [alugueis, setAlugueis] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const usuario = JSON.parse(localStorage.getItem("usuario") || "{}");

  useEffect(() => {
    const carregar = async () => {
      if (!usuario?.id) {
        setCarregando(false);
        return;
      }
      try {
        const { data } = await api.get(`/alugueis/minhas-quadras/${usuario.id}`);
        setAlugueis(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Erro ao buscar aluguéis:", err);
      } finally {
        setCarregando(false);
      }
    };
    carregar();
  }, [usuario?.id]);

  const formatarData = (data) => {
    return new Date(data).toLocaleDateString("pt-BR");
  };

  const srcImagem = (a) => {
    // Se vier do backend como "/uploads/xyz.jpg"
    if (a?.imagem_url?.startsWith("/")) return fileURL(a.imagem_url);
    // Se vier só o nome do arquivo (usa /public/quadras)
    return `/quadras/${a?.imagem_url || "sem-imagem.png"}`;
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

          {carregando ? (
            <p className="text-gray-600">Carregando...</p>
          ) : alugueis.length === 0 ? (
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
                    src={srcImagem(a)}
                    alt={a.nome}
                    onError={(e) => {
                      e.currentTarget.src = "/quadras/sem-imagem.png";
                    }}
                    className="md:w-1/3 w-full h-48 object-cover"
                  />

                  {/* Informações da quadra */}
                  <div className="p-4 flex flex-col justify-between flex-1">
                    <div>
                      <h2 className="text-xl font-bold text-green-700 mb-2">
                        {a.nome || "Quadra"}
                      </h2>

                      <p className="text-gray-600 flex items-center mb-1">
                        📅 <span className="ml-2 font-medium">Data:</span>{" "}
                        {a.data ? formatarData(a.data) : "--/--/----"}
                      </p>

                      <p className="text-gray-600 flex items-center mb-1">
                        ⏰ <span className="ml-2 font-medium">Horário:</span>{" "}
                        {a.hora_inicio} às {a.hora_fim}
                      </p>

                      {a.valor_pago && (
                        <p className="text-gray-600 flex items-center mb-1">
                          💰 <span className="ml-2 font-medium">Valor pago:</span>{" "}
                          R$ {parseFloat(a.valor_pago).toFixed(2)}
                        </p>
                      )}

                      {a.observacoes && (
                        <p className="text-gray-600 flex items-start mb-1">
                          📝 <span className="ml-2 font-medium">Obs:</span> {a.observacoes}
                        </p>
                      )}
                    </div>

                    {/* Área de ações futura */}
                    <div className="mt-4">{/* botões/links aqui se precisar */}</div>
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
