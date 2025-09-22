// src/pages/Favoritos.jsx
import { useEffect, useState, useMemo } from "react";
import { toast } from "react-hot-toast";
import { Heart, Loader2 } from "lucide-react";
import api from "../services/api";
import CourtCard from "../components/CourtCard";
import { quadras, quadrasCarrossel } from "../data/quadras";

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

function sanitize(str) {
  return (str || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
}

function basename(path = "") {
  try {
    const clean = path.split("?")[0].split("#")[0];
    return clean.split("/").filter(Boolean).pop() || "";
  } catch {
    return "";
  }
}

export default function Favoritos() {
  const [loading, setLoading] = useState(true);
  const [favoritos, setFavoritos] = useState([]);

  // Catálogo local igual ao Resultados.jsx
  const catalogo = useMemo(() => {
    const base = [...quadrasCarrossel, ...quadras];
    // índices auxiliares por id e por nome (normalizado)
    const byId = new Map(base.filter(x => x?.id != null).map(x => [String(x.id), x]));
    const byName = new Map(base.filter(x => x?.nome).map(x => [sanitize(x.nome), x]));
    return { base, byId, byName };
  }, []);

  // Resolve a melhor imagem LOCAL possível para o item
  const resolveImagemLocal = (fav) => {
    // 1) Tentar por id de quadra
    const idsPossiveis = [
      fav?.quadra_id,
      fav?.quadra?.id,
      fav?.id_quadra,
      fav?.id, // em alguns dumps favoritos herdavam o id da quadra
    ]
      .map(v => (v != null ? String(v) : null))
      .filter(Boolean);

    for (const id of idsPossiveis) {
      const hit = catalogo.byId.get(id);
      if (hit?.imagem && hit.imagem.startsWith("/quadras/")) {
        return hit.imagem;
      }
    }

    // 2) Tentar por nome de quadra
    const nomesPossiveis = [
      fav?.quadra?.nome,
      fav?.nome_quadra,
      fav?.nome,
      fav?.titulo,
    ].filter(Boolean);

    for (const n of nomesPossiveis) {
      const hit = catalogo.byName.get(sanitize(n));
      if (hit?.imagem && hit.imagem.startsWith("/quadras/")) {
        return hit.imagem;
      }
    }

    // 3) Tentar extrair um arquivo válido e apontar para /quadras/<arquivo>
    const candidatosArquivo = [
      fav?.imagem_url,
      fav?.quadra?.imagem,
      fav?.imagem,
      fav?.foto,
    ].filter(Boolean);

    for (const c of candidatosArquivo) {
      const file = basename(c);
      if (file) {
        // Você precisa garantir que esse arquivo exista em /public/quadras/
        return `/quadras/${file}`;
      }
    }

    // 4) Fallback por tipo
    const tipos = [
      fav?.quadra?.tipo,
      fav?.tipo,
      fav?.categoria,
    ].filter(Boolean);

    for (const t of tipos) {
      const img = FALLBACK_BY_TIPO[t] || FALLBACK_BY_TIPO[t?.charAt(0).toUpperCase() + t?.slice(1)];
      if (img) return img;
    }

    // 5) Último fallback
    return "/quadras/sem-imagem.png";
  };

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const { data } = await api.get("/favoritos"); // mantém a origem dinâmica (DB)
        if (!mounted) return;

        // Normaliza cada favorito + injeta a imagem LOCAL
        const list = (Array.isArray(data) ? data : []).map((f) => {
          const quadra = f?.quadra || {};
          const localImg = resolveImagemLocal(f);

          return {
            id: f.id || `${quadra.id || f.quadra_id || Math.random()}`,
            nome: quadra.nome || f.nome_quadra || f.nome || "Quadra",
            local: quadra.local || f.local || "",
            tipo: quadra.tipo || f.tipo || "",
            preco: quadra.preco ?? f.preco ?? null,
            avaliacao: quadra.avaliacao ?? f.avaliacao ?? null,
            dono: quadra.dono || f.dono || "",
            imagem: localImg, // <- sempre local agora ("/quadras/..")
            raw: f,
          };
        });

        setFavoritos(list);
      } catch (err) {
        console.error(err);
        toast.error("Não foi possível carregar seus favoritos.");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => (mounted = false);
  }, []); // sem deps

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16 text-zinc-300">
        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
        Carregando seus favoritos...
      </div>
    );
  }

  if (!favoritos.length) {
    return (
      <div className="py-16 text-center">
        <Heart className="mx-auto mb-3 h-8 w-8 opacity-70" />
        <p className="text-zinc-300">Você ainda não favoritou nenhuma quadra.</p>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6">
      <h1 className="mb-4 text-xl font-semibold">Meus Favoritos</h1>

      {/* grid de cards reaproveitando o CourtCard (ele aceita src começando com /quadras/ normalmente) */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {favoritos.map((q) => (
          <CourtCard
            key={q.id}
            id={q.raw?.quadra_id || q.raw?.quadra?.id || q.id}
            nome={q.nome}
            local={q.local}
            tipo={q.tipo}
            preco={q.preco}
            avaliacao={q.avaliacao}
            imagem={q.imagem} // sempre um caminho local (/quadras/...)
            dono={q.dono}
            // Se o seu CourtCard espera outras props (onUnfavorite, etc.), adicione aqui
          />
        ))}
      </div>
    </div>
  );
}
