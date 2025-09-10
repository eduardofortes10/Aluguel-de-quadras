// src/pages/Favoritos.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import UserDropdown from "../components/DropdownUser";
import MobileNav from "../components/MobileNav";
import { FaHome } from "react-icons/fa";
import { api, fileURL } from "../services/api";

// ---- helpers ----
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

function normalizarFavorito(f) {
  const hasNestedQuadra = f?.quadra && typeof f.quadra === "object";

  const favoritoId =
    f.favorito_id ??
    (hasNestedQuadra ? f.id : undefined) ??
    (f.quadra_id ? f.id : undefined) ??
    f.id;

  const quadraId =
    f.quadra_id ??
    (hasNestedQuadra ? f.quadra.id : undefined) ??
    f.id_quadra ??
    f.quadraId ??
    f.id;

  const nome = f.nome ?? (hasNestedQuadra ? f.quadra.nome : undefined) ?? "Quadra";
  const preco = f.preco ?? (hasNestedQuadra ? f.quadra.preco : undefined) ?? 0;
  const local = f.local ?? (hasNestedQuadra ? f.quadra.local : undefined) ?? "";
  const tipo = f.tipo ?? (hasNestedQuadra ? f.quadra.tipo : undefined) ?? "Quadra esportiva";
  const nota =
    f.nota ??
    f.avaliacao ??
    (hasNestedQuadra ? f.quadra.nota ?? f.quadra.avaliacao : undefined) ??
    4.5;

  const imagem_url =
    f.imagem_url ??
    (hasNestedQuadra ? f.quadra.imagem_url ?? f.quadra.imagem : undefined) ??
    "sem-imagem.png";

  return { favoritoId, quadraId, nome, preco, local, tipo, nota, imagem_url, _raw: f };
}

// garante URL correta para imagem
function renderImagem(item) {
  const url = item.imagem_url || "sem-imagem.png";

  if (url.startsWith("http")) return url;
  if (url.startsWith("/uploads/") || url.startsWith("/avatars/")) {
    return fileURL(url);
  }
  // caso seja apenas o nome do arquivo
  return fileURL(`/uploads/${url}`);
}

export default function Favoritos() {
  const [favoritos, setFavoritos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let cancelado = false;
    async function carregar() {
      try {
        setCarregando(true);
        const uid = await getUsuarioIdSeguro();
        if (!uid) {
          setCarregando(false);
          navigate("/login", { replace: true });
          return;
        }
        const { data } = await api.get("/favoritos");
        const arr = Array.isArray(data) ? data : [];
        const normalizados = arr.map(normalizarFavorito);
        if (!cancelado) setFavoritos(normalizados);
      } catch (err) {
        console.error("❌ Erro ao buscar favoritos:", err?.response?.data || err?.message);
      } finally {
        if (!cancelado) setCarregando(false);
      }
    }
    carregar();
    return () => { cancelado = true; };
  }, [navigate]);

  const removerFavorito = async (item) => {
    try {
      if (item.favoritoId) {
        await api.delete(`/favoritos/${item.favoritoId}`);
      } else {
        const uid = await getUsuarioIdSeguro();
        if (uid && item.quadraId) {
          await api.delete(`/favoritos/usuario/${uid}/quadra/${item.quadraId}`);
        }
      }
      setFavoritos((prev) => prev.filter((q) => q.favoritoId !== item.favoritoId));
    } catch (err) {
      console.error("Erro ao remover favorito:", err?.response?.data || err?.message);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="hidden md:block">
        <Sidebar />
      </div>

      <div className="md:hidden block w-full fixed top-0 left-0 z-50">
        <MobileNav />
      </div>

      <div className="absolute top-4 right-4 z-50">
        <UserDropdown />
      </div>

      <div className="flex-1 p-6 md:pl-20 max-w-7xl mx-auto">
        <div className="flex items-center text-sm text-gray-500 mb-6 space-x-2">
          <Link to="/home" className="hover:underline hover:text-green-600 flex items-center">
            <FaHome className="w-4 h-4 mr-1" /> Início
          </Link>
          <span>/</span>
          <span className="text-green-700 font-semibold">Favoritos</span>
        </div>

        <h1 className="text-2xl font-bold mb-6 text-green-700">Favoritos</h1>

        {carregando ? (
          <p className="animate-pulse text-gray-500">Carregando quadras favoritas...</p>
        ) : favoritos.length === 0 ? (
          <p className="text-center text-gray-500 text-sm mt-10">
            💤 Você ainda não adicionou nenhuma quadra aos favoritos.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {favoritos.map((item) => (
              <div
                key={item.favoritoId ?? item.quadraId}
                className="bg-white rounded-xl shadow-md overflow-hidden relative hover:shadow-lg hover:scale-[1.01] transition-transform duration-300"
              >
                <img
                  src={renderImagem(item)}
                  alt={item.nome}
                  className="w-full h-48 object-cover"
                  onError={(e) => { e.currentTarget.src = "/quadras/sem-imagem.png"; }}
                />

                <div className="p-4">
                  <h2 className="text-lg font-semibold text-gray-800">{item.nome}</h2>
                  <p className="text-sm text-gray-600">{item.local}</p>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-green-700 font-bold">
                      {String(item.preco).toString().includes("R$")
                        ? item.preco
                        : `R$ ${item.preco}`}
                    </span>
                    <span className="text-yellow-500">⭐ {item.nota || "4.5"}</span>
                  </div>
                  <div className="mt-2">
                    <p className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full w-max">
                      Tipo: {item.tipo}
                    </p>
                  </div>

                  <button
                    onClick={() =>
                      navigate(`/quadra/${item.quadraId}`, {
                        state: {
                          quadra: {
                            id: item.quadraId,
                            nome: item.nome,
                            preco: item.preco,
                            local: item.local,
                            imagem: renderImagem(item),
                            avaliacao: item.nota,
                            tipo: item.tipo,
                          },
                        },
                      })
                    }
                    className="mt-3 text-sm text-blue-600 hover:underline"
                  >
                    Ver detalhes
                  </button>
                </div>

                <button
                  onClick={() => removerFavorito(item)}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600 hover:ring-2 ring-offset-1 ring-red-300"
                  title="Remover dos favoritos"
                  aria-label="Remover dos favoritos"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
