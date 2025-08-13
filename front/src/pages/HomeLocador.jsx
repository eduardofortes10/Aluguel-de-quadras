// src/pages/HomeLocador.jsx
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import UserDropdown from "../components/DropdownUser";
import MobileNav from "../components/MobileNav";
import { FaPlus, FaTrash } from "react-icons/fa";
import { toast } from "react-hot-toast";
import { api, fileURL } from "../services/api";

// helper: resolve id do usuário e confirma papel locador
async function getUsuarioAtual() {
  try {
    const raw = localStorage.getItem("usuario");
    if (raw) {
      const u = JSON.parse(raw);
      const tipo = u?.tipo || u?.tipo_usuario || null;
      const id = u?.id ?? u?.usuario_id ?? null;
      if (id) return { id: Number(id), tipo };
    }
    const uidStr = localStorage.getItem("usuario_id");
    if (uidStr && /^\d+$/.test(uidStr)) {
      // papel ainda pode estar no objeto
      let tipo = null;
      try {
        const raw2 = localStorage.getItem("usuario");
        if (raw2) {
          const u2 = JSON.parse(raw2);
          tipo = u2?.tipo || u2?.tipo_usuario || null;
        }
      } catch {}
      return { id: Number(uidStr), tipo };
    }
    // tenta /auth/me
    const { data } = await api.get("/auth/me");
    const id = data?.id ?? data?.usuario_id ?? null;
    const tipo = data?.tipo || data?.tipo_usuario || null;
    if (id) return { id: Number(id), tipo };
  } catch {}
  return { id: null, tipo: null };
}

// formata preço (aceita número ou string)
function formatPreco(v) {
  if (v == null) return "R$ 0,00";
  if (typeof v === "string" && v.trim().startsWith("R$")) return v;
  const n = Number(String(v).replace(",", "."));
  if (isNaN(n)) return "R$ 0,00";
  return n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

// resolve primeira imagem
function resolveImagem(quadra) {
  // se vier um array de strings
  if (Array.isArray(quadra?.imagens) && quadra.imagens.length > 0) {
    const first = quadra.imagens[0];
    if (typeof first === "string") {
      return first.startsWith("/") ? fileURL(first) : `/quadras/${first}`;
    }
  }
  // se vier string JSON
  if (typeof quadra?.imagens === "string") {
    try {
      const arr = JSON.parse(quadra.imagens);
      if (Array.isArray(arr) && arr.length > 0) {
        const first = arr[0];
        if (typeof first === "string") {
          return first.startsWith("/") ? fileURL(first) : `/quadras/${first}`;
        }
      }
    } catch {}
  }
  // se vier campo único
  const single = quadra?.imagem_url || quadra?.imagem;
  if (typeof single === "string") {
    return single.startsWith("/") ? fileURL(single) : `/quadras/${single}`;
  }
  // fallback
  return "/quadras/default.png";
}

export default function HomeLocador() {
  const [quadras, setQuadras] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let cancelado = false;

    async function carregar() {
      const { id, tipo } = await getUsuarioAtual();

      if (!id) {
        toast.error("Usuário não autenticado.");
        navigate("/login", { replace: true });
        return;
      }
      if (tipo !== "locador") {
        toast("Redirecionando para a sua home.", { icon: "↩️" });
        navigate("/home", { replace: true });
        return;
      }

      try {
        setCarregando(true);
        // busca quadras do locador
        const { data } = await api.get("/quadras", { params: { dono_id: id } });
        if (!cancelado) {
          setQuadras(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        console.error("❌ Erro ao carregar quadras:", err?.response?.data || err?.message);
        toast.error("Erro ao carregar quadras.");
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
      console.error("❌ Erro na exclusão:", error?.response?.data || error?.message);
      toast.error("Erro na conexão com o servidor.");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100 relative">
      {/* Sidebar desktop */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* Nav mobile */}
      <div className="md:hidden fixed bottom-14 left-0 w-full bg-[#14532d] p-4 flex justify-between items-center z-50 shadow-inner">
        <MobileNav />
      </div>

      <div className="flex-1 md:ml-64 p-4 pb-24 relative">
        {/* Dropdown usuário (desktop) */}
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

        {carregando ? (
          <p className="text-gray-500">Carregando suas quadras...</p>
        ) : Array.isArray(quadras) && quadras.length === 0 ? (
          <p className="text-gray-500">Você ainda não cadastrou nenhuma quadra.</p>
        ) : (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {quadras.map((quadra) => {
              const imagemUrl = resolveImagem(quadra);
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
                      <span className="text-green-600 font-bold">{formatPreco(quadra.preco)}</span>
                      <span className="text-yellow-500">⭐ {quadra.nota || "4.5"}</span>
                    </div>
                    <div className="mt-4 flex justify-between text-sm">
                      <Link
                        to={`/quadra-locador/${quadra.id}`}
                        className="text-blue-600 hover:underline"
                      >
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
