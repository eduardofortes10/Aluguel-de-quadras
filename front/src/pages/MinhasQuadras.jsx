// src/pages/MinhasQuadras.jsx
import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import MobileNav from "../components/MobileNav";
import { api, fileURL } from "../services/api";
import { useNavigate } from "react-router-dom";

// helper para obter o id do usuário
async function getUsuarioIdSeguro() {
  try {
    const raw = localStorage.getItem("usuario");
    if (raw) {
      const u = JSON.parse(raw);
      if (u?.id) return Number(u.id);
      if (u?.usuario_id) return Number(u.usuario_id);
    }
    const uidStr = localStorage.getItem("usuario_id");
    if (uidStr && /^\d+$/.test(uidStr)) return Number(uidStr);
    try {
      const { data } = await api.get("/auth/me");
      if (data?.id) return Number(data.id);
      if (data?.usuario_id) return Number(data.usuario_id);
    } catch {}
  } catch {}
  return null;
}

// garante URL correta para imagem
function renderImagem(item) {
  const url = item?.imagem_url || "sem-imagem.png";

  if (url.startsWith("http")) return url;
  if (url.startsWith("/uploads/") || url.startsWith("/avatars/")) {
    return fileURL(url);
  }
  return fileURL(`/uploads/${url}`);
}

function MinhasQuadras() {
  const [alugueis, setAlugueis] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let cancelado = false;

    async function carregar() {
      const uid = await getUsuarioIdSeguro();
      if (!uid) {
        setCarregando(false);
        navigate("/login", { replace: true });
        return;
      }
      try {
        const { data } = await api.get(`/alugueis/minhas`);
        if (!cancelado) setAlugueis(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Erro ao buscar aluguéis:", err?.response?.data || err?.message);
      } finally {
        if (!cancelado) setCarregando(false);
      }
    }

    carregar();
    return () => { cancelado = true; };
  }, [navigate]);

  const formatarData = (data) => new Date(data).toLocaleDateString("pt-BR");

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <div className="hidden md:block">
        <Sidebar />
      </div>
      <div className="flex-1">
        <div className="md:hidden">
          <MobileNav />
        </div>

        <div className="p-6 max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold mb-6 text-green-700">Minhas Quadras</h1>

          {carregando ? (
            <p className="text-gray-600">Carregando...</p>
          ) : alugueis.length === 0 ? (
            <p className="text-gray-600">Você ainda não tem quadras agendadas.</p>
          ) : (
            <div className="grid gap-6">
              {alugueis.map((a) => (
                <div key={a.id} className="bg-white border rounded-xl shadow-lg overflow-hidden flex flex-col md:flex-row">
                  <img
                    src={renderImagem(a)}
                    alt={a.nome || "Quadra"}
                    onError={(e) => { e.currentTarget.src = "/quadras/sem-imagem.png"; }}
                    className="md:w-1/3 w-full h-48 object-cover"
                  />
                  <div className="p-4 flex flex-col justify-between flex-1">
                    <div>
                      <h2 className="text-xl font-bold text-green-700 mb-2">{a.nome || "Quadra"}</h2>
                      <p className="text-gray-600 flex items-center mb-1">📅 <span className="ml-2 font-medium">Data:</span> {a.data ? formatarData(a.data) : "--/--/----"}</p>
                      <p className="text-gray-600 flex items-center mb-1">⏰ <span className="ml-2 font-medium">Horário:</span> {a.hora_inicio} às {a.hora_fim}</p>
                      {a.valor_pago && (
                        <p className="text-gray-600 flex items-center mb-1">💰 <span className="ml-2 font-medium">Valor pago:</span> R$ {parseFloat(a.valor_pago).toFixed(2)}</p>
                      )}
                      {a.observacoes && (
                        <p className="text-gray-600 flex items-start mb-1">📝 <span className="ml-2 font-medium">Obs:</span> {a.observacoes}</p>
                      )}
                    </div>
                    <div className="mt-4">{/* ações futuras */}</div>
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
