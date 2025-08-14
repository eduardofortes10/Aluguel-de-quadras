// src/pages/HomeLocador.jsx
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import LocadorLayout from "../layouts/LocadorLayout";
import { FaPlus, FaTrash } from "react-icons/fa";
import { toast } from "react-hot-toast";
import { api, fileURL } from "../services/api";

// Lê usuário do localStorage (o RequireAuth já garante token + usuario)
function getUsuarioLocal() {
  try {
    const raw = localStorage.getItem("usuario");
    const u = raw ? JSON.parse(raw) : null;
    const id = u?.id ?? u?.usuario_id ?? null;
    const tipo = (u?.tipo || u?.tipo_usuario || "").toLowerCase() || null;
    if (id) return { id: Number(id), tipo };
  } catch {}
  // fallback: alguns projetos guardam separadamente
  const uidStr = localStorage.getItem("usuario_id");
  if (uidStr && /^\d+$/.test(uidStr)) return { id: Number(uidStr), tipo: null };
  return { id: null, tipo: null };
}

function formatPreco(v) {
  if (v == null) return "R$ 0,00";
  if (typeof v === "string" && v.trim().startsWith("R$")) return v;
  const n = Number(String(v).replace(",", "."));
  if (isNaN(n)) return "R$ 0,00";
  return n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

// ✅ Resolve imagem em TODOS os formatos comuns e usa fallback que existe
function resolveImagem(quadra) {
  const candidates = [];

  // 1) Pode vir como array
  if (Array.isArray(quadra?.imagens)) candidates.push(...quadra.imagens);

  // 2) Pode vir como string ou string JSON
  if (typeof quadra?.imagens === "string") {
    try {
      const arr = JSON.parse(quadra.imagens);
      if (Array.isArray(arr)) candidates.push(...arr);
      else candidates.push(quadra.imagens);
    } catch {
      candidates.push(quadra.imagens);
    }
  }

  // 3) Campos únicos "legados"
  if (quadra?.imagem_url) candidates.push(quadra.imagem_url);
  if (quadra?.imagem) candidates.push(quadra.imagem);

  // 4) Normaliza e decide a URL final
  for (let c of candidates) {
    if (!c) continue;
    const s = String(c).trim().replace(/\\/g, "/"); // Windows -> /
    if (!s) continue;

    // URL absoluta já pronta
    if (/^https?:\/\//i.test(s)) return s;

    // Caminhos servidos pelo back
    if (s.includes("/uploads/") || s.startsWith("/")) return fileURL(s);

    // Imagem local em /public/quadras
    return `/quadras/${s}`;
  }

  // 5) Fallback REAL do projeto
  return "/quadras/quadra1.png";
}

function StatusPill({ active = true }) {
  return (
    <span
      className={`px-2 py-0.5 text-xs rounded-full border ${
        active
          ? "bg-green-50 text-green-700 border-green-200"
          : "bg-gray-100 text-gray-600 border-gray-300"
      }`}
    >
      {active ? "Ativa" : "Inativa"}
    </span>
  );
}

function QuadraCard({ quadra, onExcluir }) {
  const imagemUrl = resolveImagem(quadra);
  const ativa = quadra?.status !== "inativa";

  return (
    <div className="bg-white rounded-2xl shadow-sm border hover:shadow-md transition overflow-hidden flex flex-col">
      <div className="relative">
        <img
          src={imagemUrl}
          alt={quadra.nome}
          loading="lazy"
          onError={(e) => (e.currentTarget.src = "/quadras/quadra1.png")} // ✅ fallback existe
          className="w-full h-44 object-cover"
        />
        <div className="absolute top-3 left-3">
          <StatusPill active={ativa} />
        </div>
      </div>
      <div className="p-4 flex-1 flex flex-col">
        <div className="flex items-start justify-between gap-3">
          <h2 className="text-base font-semibold text-gray-900 line-clamp-1">{quadra.nome}</h2>
          <span className="text-yellow-500 text-sm shrink-0">⭐ {quadra.nota || "4.5"}</span>
        </div>
        <p className="text-sm text-gray-600 mt-1 line-clamp-1">{quadra.local}</p>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-green-700 font-bold">{formatPreco(quadra.preco)}</span>
          <div className="flex items-center gap-3 text-sm">
            <Link to={`/quadra-locador/${quadra.id}`} className="text-blue-600 hover:underline">
              Ver detalhes
            </Link>
            <button
              onClick={() => onExcluir(quadra.id)}
              className="text-red-600 hover:underline flex items-center gap-1"
            >
              <FaTrash className="text-[12px]" /> Excluir
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function CardSkeleton() {
  return (
    <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
      <div className="w-full h-44 bg-gray-200 animate-pulse" />
      <div className="p-4 space-y-2">
        <div className="h-4 bg-gray-200 rounded w-2/3" />
        <div className="h-3 bg-gray-200 rounded w-1/2" />
        <div className="h-4 bg-gray-200 rounded w-1/3" />
      </div>
    </div>
  );
}

export default function HomeLocador() {
  const navigate = useNavigate();
  const [carregando, setCarregando] = useState(true);
  const [quadras, setQuadras] = useState([]);

  useEffect(() => {
    let cancelado = false;
    async function carregar() {
      // RequireAuth já barrou quem não é locador, aqui só pegamos o id
      const { id } = getUsuarioLocal();
      if (!id) {
        toast.error("Sessão expirada. Faça login novamente.");
        navigate("/login", { replace: true });
        return;
      }
      try {
        setCarregando(true);
        // ✅ mantém sua rota atual
        const { data } = await api.get("/quadras", { params: { dono_id: id } });
        if (!cancelado) setQuadras(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Erro ao carregar quadras:", err?.response?.data || err?.message);
        toast.error("Erro ao carregar suas quadras.");
        if (!cancelado) setQuadras([]);
      } finally {
        if (!cancelado) setCarregando(false);
      }
    }
    carregar();
    return () => {
      cancelado = true;
    };
  }, [navigate]);

  const handleNovaQuadra = () => navigate("/cadastrarquadra");

  const handleExcluirQuadra = async (id) => {
    if (!confirm("Tem certeza que deseja excluir esta quadra?")) return;
    try {
      await api.delete(`/quadras/${id}`);
      setQuadras((prev) => prev.filter((q) => q.id !== id));
      toast.success("Quadra excluída.");
    } catch (err) {
      toast.error(err?.response?.data?.erro || "Não foi possível excluir.");
    }
  };

  const actions = (
    <button
      onClick={handleNovaQuadra}
      className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-xl hover:bg-green-700 transition"
    >
      <FaPlus /> Nova Quadra
    </button>
  );

  return (
    <LocadorLayout title="Quadras Cadastradas" breadcrumb="Quadras" actions={actions}>
      {/* KPIs simples */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <div className="bg-white rounded-2xl border p-4">
          <p className="text-xs text-gray-500">Quadras</p>
          <p className="text-2xl font-bold">{quadras.length}</p>
        </div>
        <div className="bg-white rounded-2xl border p-4">
          <p className="text-xs text-gray-500">Ocupação (indicativa)</p>
          <p className="text-2xl font-bold">—</p>
        </div>
        <div className="bg-white rounded-2xl border p-4">
          <p className="text-xs text-gray-500">Reservas no mês</p>
          <p className="text-2xl font-bold">—</p>
        </div>
        <div className="bg-white rounded-2xl border p-4">
          <p className="text-xs text-gray-500">Faturamento</p>
          <p className="text-2xl font-bold">—</p>
        </div>
      </div>

      {/* Lista */}
      {carregando ? (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : quadras.length === 0 ? (
        <div className="bg-white border rounded-2xl p-10 text-center">
          <p className="text-gray-600 mb-4">Você ainda não cadastrou nenhuma quadra.</p>
          <button
            onClick={handleNovaQuadra}
            className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-xl hover:bg-green-700 transition"
          >
            <FaPlus /> Cadastrar a primeira quadra
          </button>
        </div>
      ) : (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {quadras.map((q) => (
            <QuadraCard key={q.id} quadra={q} onExcluir={handleExcluirQuadra} />
          ))}
        </div>
      )}
    </LocadorLayout>
  );
}
