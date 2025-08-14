// src/pages/HomeLocador.jsx
import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import UserDropdown from "../components/DropdownUser";
import MobileNav from "../components/MobileNav";
import { api, fileURL } from "../services/api";
import { FaStar, FaTrashAlt } from "react-icons/fa";

export default function HomeLocador() {
  const navigate = useNavigate();
  const usuarioId = useMemo(() => localStorage.getItem("usuario_id"), []);

  const [quadras, setQuadras] = useState([]);
  const [loading, setLoading] = useState(true);
  const [kpis, setKpis] = useState({
    total: 0,
    ocupacao: null, // deixe null => mostra “—”
    reservasMes: null,
    faturamento: null,
  });

  useEffect(() => {
    if (!usuarioId) {
      navigate("/login");
      return;
    }
    fetchQuadras(usuarioId);
  }, [usuarioId, navigate]);

  async function fetchQuadras(id) {
    setLoading(true);
    try {
      // 1) tenta rota /quadras/dono/:id
      let res;
      try {
        res = await api.get(`/quadras/dono/${id}`);
      } catch {
        // 2) fallback para /quadras?dono_id=:id
        res = await api.get(`/quadras`, { params: { dono_id: id } });
      }

      const data = Array.isArray(res.data) ? res.data : (res.data?.quadras || []);
      const list = data.map((q) => normalizeQuadra(q));
      setQuadras(list);

      // KPIs simples (ajuste se depois vierem do backend)
      setKpis({
        total: list.length,
        ocupacao: null,          // se tiver campo de ocupação, calcule aqui
        reservasMes: null,       // idem
        faturamento: null,       // idem
      });
    } catch (e) {
      console.error("Erro ao buscar quadras do locador:", e);
      setQuadras([]);
    } finally {
      setLoading(false);
    }
  }

  function normalizeQuadra(raw) {
    // unifica campos prováveis do backend
    const id = raw.id || raw.quadra_id || raw.imagem_id || raw.ID;
    const nome = raw.nome || raw.titulo || "Quadra";
    const preco = raw.preco ?? raw.valor ?? raw.preco_hora ?? 0;
    const local =
      raw.local ||
      raw.endereco ||
      [raw.rua, raw.numero, raw.bairro, raw.cidade, raw.uf].filter(Boolean).join(", ");
    const avaliacao = Number(raw.avaliacao || raw.rating || 0);

    return {
      ...raw,
      _id: id,
      _nome: nome,
      _preco: preco,
      _local: local,
      _avaliacao: isNaN(avaliacao) ? 0 : avaliacao,
      _imagemUrl: resolveImagem(raw),
    };
  }

  function resolveImagem(quadra) {
    const candidates = [];

    // 1) pode vir array ou string (inclui JSON serializado)
    if (Array.isArray(quadra?.imagens)) {
      candidates.push(...quadra.imagens);
    } else if (typeof quadra?.imagens === "string") {
      try {
        const arr = JSON.parse(quadra.imagens);
        if (Array.isArray(arr)) candidates.push(...arr);
        else candidates.push(quadra.imagens);
      } catch {
        candidates.push(quadra.imagens);
      }
    }

    // 2) “legados”
    candidates.push(quadra?.imagem_url, quadra?.imagem);

    // 3) pega a primeira válida
    for (let c of candidates) {
      if (!c) continue;
      const s = String(c).trim().replace(/\\/g, "/"); // normaliza path Windows

      if (!s) continue;
      if (/^https?:\/\//i.test(s)) return s;  // já é absoluta
      if (s.includes("/uploads/") || s.startsWith("/"))
        return fileURL(s);                  // serve do domínio do backend
      return `/quadras/${s}`;               // imagem local do /public/quadras
    }

    // 4) fallback que existe no projeto
    return "/quadras/quadra1.png";
  }

  async function handleExcluir(quadraId) {
    if (!confirm("Tem certeza que deseja excluir esta quadra?")) return;
    try {
      await api.delete(`/quadras/${quadraId}`);
      setQuadras((prev) => prev.filter((q) => q._id !== quadraId));
      setKpis((k) => ({ ...k, total: (k.total || 1) - 1 }));
    } catch (e) {
      console.error("Erro ao excluir quadra:", e);
      alert("Não foi possível excluir. Tente novamente.");
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar desktop */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* Conteúdo */}
      <div className="flex-1 flex flex-col md:ml-64">
        {/* Top bar */}
        <div className="flex items-center justify-between p-4 md:p-6">
          <h1 className="text-2xl md:text-3xl font-semibold text-green-700">
            Quadras Cadastradas
          </h1>

          <div className="flex items-center gap-3">
            <Link
              to="/cadastrarquadra"
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-full transition"
            >
              + Nova Quadra
            </Link>
            <div className="hidden md:block">
              <UserDropdown />
            </div>
            <div className="md:hidden">
              <MobileNav />
            </div>
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 px-4 md:px-6">
          <KpiCard title="Quadras" value={kpis.total || 0} />
          <KpiCard title="Ocupação (indicativa)" value={kpis.ocupacao ?? "—"} />
          <KpiCard title="Reservas no mês" value={kpis.reservasMes ?? "—"} />
          <KpiCard title="Faturamento" value={kpis.faturamento ?? "—"} />
        </div>

        {/* Lista */}
        <div className="p-4 md:p-6">
          {loading ? (
            <div className="text-gray-500">Carregando suas quadras…</div>
          ) : quadras.length === 0 ? (
            <div className="text-gray-500">
              Você ainda não cadastrou nenhuma quadra.
              <Link className="text-green-700 underline ml-1" to="/cadastrarquadra">
                Cadastrar agora
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {quadras.map((q) => (
                <article
                  key={q._id}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
                >
                  <div className="relative">
                    <img
                      src={q._imagemUrl}
                      alt={q._nome}
                      loading="lazy"
                      onError={(e) => (e.currentTarget.src = "/quadras/quadra1.png")}
                      className="w-full h-44 object-cover"
                    />
                    <span className="absolute top-3 left-3 bg-emerald-100 text-emerald-700 text-xs font-medium px-3 py-1 rounded-full shadow">
                      Ativa
                    </span>
                  </div>

                  <div className="p-4 md:p-5">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-800">
                        {q._nome}
                      </h3>
                      <div className="flex items-center gap-1 text-yellow-500">
                        <FaStar className="text-sm" />
                        <span className="text-sm text-gray-700">
                          {Number(q._avaliacao || 0).toFixed(1)}
                        </span>
                      </div>
                    </div>

                    {q._local && (
                      <p className="text-sm text-gray-500 mt-1">{q._local}</p>
                    )}

                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-green-700 font-semibold">
                        {Number(q._preco || 0).toLocaleString("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        })}
                      </span>

                      <div className="flex items-center gap-4 text-sm">
                        <Link
                          to={`/detalhes-quadra-locador/${q._id}`}
                          className="text-blue-600 hover:text-blue-700"
                        >
                          Ver detalhes
                        </Link>
                        <button
                          onClick={() => handleExcluir(q._id)}
                          className="inline-flex items-center gap-1 text-red-600 hover:text-red-700"
                          title="Excluir"
                        >
                          <FaTrashAlt className="text-xs" />
                          Excluir
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function KpiCard({ title, value }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4 md:p-5 shadow-sm">
      <div className="text-sm text-gray-500">{title}</div>
      <div className="mt-2 text-2xl font-semibold text-gray-800">
        {value ?? "—"}
      </div>
    </div>
  );
}
