// src/pages/Favoritos.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { Heart, Loader2 } from "lucide-react";

import Sidebar from "../components/Sidebar";
import MobileNav from "../components/MobileNav";
import CourtCard from "../components/CourtCard";

import { api } from "../services/api";
import { quadras, quadrasCarrossel } from "../data/quadras";

/* ================= Helpers ================= */

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

function sanitize(str) {
  return (str || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function getImagemNome(obj) {
  const tryList = [
    obj?.imagem_url,
    obj?.imagem,
    ...(Array.isArray(obj?.imagens) ? obj.imagens : []),
  ].filter(Boolean);

  for (const raw of tryList) {
    const clean = String(raw).split("?")[0].split("#")[0].replace(/\\/g, "/");
    const file = clean.split("/").filter(Boolean).pop();
    if (file) return file;
  }
  return "sem-imagem.png";
}

function toLocalImagem(any) {
  const name = getImagemNome(any);
  return `/quadras/${name}`;
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

function precoSemSufixoBRL(v) {
  if (typeof v === "number") {
    return v.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
      maximumFractionDigits: 0,
    });
  }
  let s = String(v || "").trim();
  s = s.replace(/\s*\/\s*hora\b/gi, "");
  s = s.replace(/\s*\/\s*h\b/gi, "");
  s = s.trim();
  if (!/^R\$\s?/.test(s)) {
    const num = parseFloat(
      s.replace(/[^\d.,]/g, "").replace(/\./g, "").replace(",", ".")
    );
    if (Number.isFinite(num)) {
      s = num.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
        maximumFractionDigits: 0,
      });
    }
  }
  return s;
}

function precoToNumberAny(v) {
  if (typeof v === "number") return v;
  const n = parseFloat(
    String(v || "").replace(/[^\d.,-]/g, "").replace(/\./g, "").replace(",", ".")
  );
  return Number.isFinite(n) ? n : 0;
}

/* ============== Componente ============== */

export default function Favoritos() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]); // { favoritoId, quadra: {...} }
  const [favSet, setFavSet] = useState(() => new Set());
  const [favIdByQuadra, setFavIdByQuadra] = useState(() => new Map());
  const [uid, setUid] = useState(null);

  // Catálogo local (serve para casar id/nome e pegar imagem local)
  const catalogo = useMemo(() => {
    const baseRaw = [...quadrasCarrossel, ...quadras];
    const base = baseRaw.map((q) => ({
      ...q,
      imagem: toLocalImagem(q),
    }));
    const byId = new Map(
      base.filter((x) => x?.id != null).map((x) => [String(x.id), x])
    );
    const byName = new Map(
      base.filter((x) => x?.nome).map((x) => [sanitize(x.nome), x])
    );
    return { base, byId, byName };
  }, []);

  function resolveImagemLocal(f) {
    // 1) por id
    const ids = [
      f?.quadra_id,
      f?.quadra?.id,
      f?.id_quadra,
      f?.id, // alguns dumps antigos
    ]
      .map((v) => (v != null ? String(v) : null))
      .filter(Boolean);

    for (const id of ids) {
      const hit = catalogo.byId.get(id);
      if (hit?.imagem?.startsWith("/quadras/")) return hit.imagem;
    }

    // 2) por nome
    const nomes = [f?.quadra?.nome, f?.nome_quadra, f?.nome, f?.titulo].filter(
      Boolean
    );
    for (const n of nomes) {
      const hit = catalogo.byName.get(sanitize(n));
      if (hit?.imagem?.startsWith("/quadras/")) return hit.imagem;
    }

    // 3) por arquivo salvo
    const candidatos = [f?.imagem_url, f?.quadra?.imagem, f?.imagem, f?.foto].filter(
      Boolean
    );
    for (const c of candidatos) {
      const name = getImagemNome({ imagem: c });
      if (name) return `/quadras/${name}`;
    }

    // 4) por tipo
    const tipos = [f?.quadra?.tipo, f?.tipo, f?.categoria].filter(Boolean);
    for (const t of tipos) {
      const img =
        FALLBACK_BY_TIPO[t] ||
        FALLBACK_BY_TIPO[t?.charAt(0).toUpperCase() + t?.slice(1)];
      if (img) return img;
    }

    // 5) fallback final
    return "/quadras/sem-imagem.png";
  }

  // Carrega favoritos do backend + normaliza
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const userId = await getUsuarioIdSeguro();
        if (mounted) setUid(userId);

        const { data } = await api.get("/favoritos");
        const arr = Array.isArray(data) ? data : [];

        const normalizados = arr.map((f) => {
          const qDb = f?.quadra || {};
          const imagemLocal = resolveImagemLocal(f);

          const precoBase =
            qDb.preco ?? f.preco ?? 0;

          const quadraLoc = {
            id: qDb.id ?? f.quadra_id ?? f.id,
            nome: qDb.nome ?? f.nome_quadra ?? f.nome ?? "Quadra",
            local: qDb.local ?? f.local ?? "",
            tipo: qDb.tipo ?? f.tipo ?? "Quadra esportiva",
            preco: precoSemSufixoBRL(precoBase),
            avaliacao: qDb.avaliacao ?? f.avaliacao ?? f.nota ?? 4.5,
            imagem: imagemLocal, // sempre local
            imagem_url: getImagemNome({ imagem: imagemLocal }),
          };

          return {
            favoritoId: f.id ?? f.favorito_id ?? null,
            quadra: quadraLoc,
            raw: f,
          };
        });

        if (!mounted) return;

        // set auxiliar (ids favoritados) e map quadraId -> favoritoId
        const setIds = new Set(
          normalizados
            .map((x) => (x.quadra?.id != null ? Number(x.quadra.id) : null))
            .filter((v) => v != null)
        );
        const mapIds = new Map();
        for (const it of normalizados) {
          const qid = Number(it.quadra?.id);
          if (qid && it.favoritoId != null) mapIds.set(qid, Number(it.favoritoId));
        }

        setItems(normalizados);
        setFavSet(setIds);
        setFavIdByQuadra(mapIds);
      } catch (err) {
        console.error("Erro ao carregar favoritos:", err?.response?.data || err?.message);
        toast.error("Não foi possível carregar seus favoritos.");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [catalogo]);

  // Navegar p/ detalhe
  const handleQuadraClick = (q) => {
    const nome = getImagemNome(q);
    navigate(`/quadra/${q.id}`, {
      state: { quadra: { ...q, imagem_url: nome, imagem: `/quadras/${nome}` } },
    });
  };

  // Toggle de favorito (mesma assinatura da Home)
  const handleFavorite = async (quadra, isNowFav) => {
    const userId = uid ?? (await getUsuarioIdSeguro());
    if (!userId) {
      toast.error("Faça login para favoritar.");
      return;
    }

    try {
      if (isNowFav) {
        // adicionar (caso usuário desfaça e refaça dentro da página)
        const precoNumber = precoToNumberAny(quadra?.preco);
        const payload = {
          usuario_id: userId,
          quadra_id: quadra?.id || 0,
          nome: quadra?.nome,
          preco: precoNumber,
          local: quadra?.local,
          imagem_url: getImagemNome(quadra),
          nota: quadra?.avaliacao || quadra?.nota || 4.5,
        };
        await api.post("/favoritos", payload);
        toast.success("Adicionada aos favoritos!");
      } else {
        // remover
        const favId = favIdByQuadra.get(Number(quadra.id));
        if (favId) {
          await api.delete(`/favoritos/${favId}`);
        } else {
          await api.delete(`/favoritos/usuario/${userId}/quadra/${quadra.id}`);
        }
        toast("Removida dos favoritos.", { icon: "🗑️" });

        // Atualiza a lista localmente
        setItems((prev) =>
          prev.filter((it) => Number(it.quadra?.id) !== Number(quadra.id))
        );
        setFavSet((prev) => {
          const n = new Set(prev);
          n.delete(Number(quadra.id));
          return n;
        });
        setFavIdByQuadra((prev) => {
          const m = new Map(prev);
          m.delete(Number(quadra.id));
          return m;
        });
      }
    } catch (err) {
      console.error("Erro ao atualizar favorito:", err?.response?.data || err?.message);
      toast.error(err?.response?.data?.erro || "Não foi possível atualizar favorito.");
    }
  };

  /* ================= Render ================= */

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-zinc-500">
        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
        Carregando seus favoritos...
      </div>
    );
  }

  return (
    <div className="flex min-h-screen overflow-x-hidden bg-white">
      {/* Sidebar desktop */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* Mobile nav fixa no topo */}
      <div className="md:hidden fixed top-0 left-0 w-full z-50">
        <MobileNav />
      </div>

      <main className="flex-1 text-black transition-colors px-3 sm:px-4 md:pl-16 overflow-hidden">
        <div className="pt-16 md:pt-6 max-w-6xl mx-auto">
          <header className="mb-6 sm:mb-8">
            <h1 className="text-xl sm:text-2xl font-semibold">Meus Favoritos</h1>
            <p className="text-sm text-zinc-500 mt-1">
              Suas quadras salvas para reservar mais rápido.
            </p>
          </header>

          {items.length === 0 ? (
            <div className="py-16 text-center text-zinc-500">
              <Heart className="mx-auto mb-3 h-8 w-8 opacity-70" />
              Você ainda não favoritou nenhuma quadra.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {items.map(({ favoritoId, quadra }) => {
                const isFav = favSet.has(Number(quadra.id));
                const qSan = {
                  ...quadra,
                  preco: precoSemSufixoBRL(quadra.preco),
                  imagem: toLocalImagem(quadra),
                };
                return (
                  <CourtCard
                    key={favoritoId ?? quadra.id}
                    quadra={qSan}
                    variant="default"
                    isFavorited={!!isFav}
                    onFavorite={handleFavorite}
                    onClick={() => handleQuadraClick(qSan)}
                  />
                );
              })}
            </div>
          )}
        </div>

        {/* Rodapé simples */}
        <footer className="bg-[#0f3d26] text-white mt-12">
          <div className="max-w-6xl mx-auto px-4 py-8 sm:py-10">
            <div className="text-sm text-white/80">
              <p>© {new Date().getFullYear()} Aluguel de Quadras — Todos os direitos reservados.</p>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
