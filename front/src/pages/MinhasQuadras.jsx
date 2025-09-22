// src/pages/MinhasQuadras.jsx
import React, { useEffect, useMemo, useState } from "react";
import Sidebar from "../components/Sidebar";
import MobileNav from "../components/MobileNav";
import { api, fileURL } from "../services/api";
import { useNavigate } from "react-router-dom";

// ===== Helpers =====
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

const FALLBACK_BY_TIPO = {
  Futebol: "/quadras/futebol.png",
  "Futebol Society": "/quadras/futebol.png",
  Futsal: "/quadras/futsal.png",
  Basquete: "/quadras/basquete.png",
  Vôlei: "/quadras/volei.png",
  Tenis: "/quadras/tenis.png",
  Tênis: "/quadras/tenis.png",
  Poliesportiva: "/quadras/poliesportiva.png",
};

function getFileName(s) {
  if (!s) return "";
  const clean = String(s).split("?")[0].split("#")[0].replace(/\\/g, "/");
  return clean.split("/").filter(Boolean).pop() || "";
}

function resolveImagemPreferindoLocal(any) {
  // 1) filename explícito (preferir /public/quadras)
  const candidatos = [
    any?.imagem_url,
    any?.imagem,
    any?.quadra?.imagem_url,
    any?.quadra?.imagem,
  ].filter(Boolean);

  for (const c of candidatos) {
    const file = getFileName(c);
    if (file) return `/quadras/${file}`;
  }

  // 2) caminhos absolutos/relativos do backend
  for (const c of candidatos) {
    const s = String(c).trim().replace(/\\/g, "/");
    if (/^https?:\/\//i.test(s)) return s;
    if (s.includes("/uploads/") || s.startsWith("/avatars/")) return fileURL(s);
    if (s.startsWith("/")) return fileURL(s);
  }

  // 3) fallback por tipo
  const tipo = any?.tipo || any?.quadra?.tipo;
  if (tipo && FALLBACK_BY_TIPO[tipo]) return FALLBACK_BY_TIPO[tipo];

  // 4) fallback final
  return "/quadras/sem-imagem.png";
}

function brDate(d) {
  try {
    return new Date(d).toLocaleDateString("pt-BR");
  } catch {
    return "--/--/----";
  }
}
function brMoney(n) {
  const num = Number(n);
  if (!Number.isFinite(num)) return "R$ 0,00";
  return num.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default function MinhasQuadras() {
  const [alugueis, setAlugueis] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let cancel = false;
    (async () => {
      const uid = await getUsuarioIdSeguro();
      if (!uid) {
        setCarregando(false);
        navigate("/login", { replace: true });
        return;
      }
      try {
        setCarregando(true);
        const { data } = await api.get(`/alugueis/minhas`);
        const arr = Array.isArray(data) ? data : [];

        const normalizados = arr.map((a) => {
          const q = a?.quadra || {};
          return {
            id: a.id,
            nome: a.nome || q.nome || "Quadra",
            local: a.local || q.local || "",
            tipo: a.tipo || q.tipo || "",
            data: a.data,
            hora_inicio: a.hora_inicio,
            hora_fim: a.hora_fim,
            valor_pago: a.valor_pago,
            observacoes: a.observacoes,
            imagem: resolveImagemPreferindoLocal(a),
          };
        });

        if (!cancel) setAlugueis(normalizados);
      } catch (err) {
        console.error("Erro ao buscar aluguéis:", err?.response?.data || err?.message);
      } finally {
        if (!cancel) setCarregando(false);
      }
    })();
    return () => { cancel = true; };
  }, [navigate]);

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
                <div
                  key={a.id}
                  className="bg-white border rounded-xl shadow-lg overflow-hidden flex flex-col md:flex-row"
                >
                  <img
                    src={a.imagem}
                    alt={a.nome}
                    onError={(e) => { e.currentTarget.src = "/quadras/sem-imagem.png"; }}
                    className="md:w-1/3 w-full h-48 object-cover"
                  />
                  <div className="p-4 flex flex-col justify-between flex-1">
                    <div>
                      <h2 className="text-xl font-bold text-green-700 mb-2">
                        {a.nome}
                      </h2>
                      <p className="text-gray-600 mb-1">
                        📍 <span className="font-medium">Local:</span> {a.local || "—"}
                      </p>
                      <p className="text-gray-600 mb-1">
                        📅 <span className="font-medium">Data:</span> {brDate(a.data)}
                      </p>
                      <p className="text-gray-600 mb-1">
                        ⏰ <span className="font-medium">Horário:</span> {a.hora_inicio} às {a.hora_fim}
                      </p>
                      {a.valor_pago != null && (
                        <p className="text-gray-600 mb-1">
                          💰 <span className="font-medium">Valor pago:</span> {brMoney(a.valor_pago)}
                        </p>
                      )}
                      {a.observacoes && (
                        <p className="text-gray-600 mb-1">
                          📝 <span className="font-medium">Obs:</span> {a.observacoes}
                        </p>
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
