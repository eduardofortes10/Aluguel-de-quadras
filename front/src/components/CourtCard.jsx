// front/src/components/CourtCard.jsx
import React, { useState } from "react";
import { MapPin, Star, Heart } from "lucide-react";
import { fileURL, api } from "../services/api";

const tipoClasses = {
  Futebol: "bg-emerald-600 text-white",
  Futsal: "bg-emerald-600 text-white",
  Vôlei: "bg-indigo-600 text-white",
  Basquete: "bg-orange-600 text-white",
  Tênis: "bg-teal-600 text-white",
  Society: "bg-lime-600 text-white",
  Poliesportiva: "bg-fuchsia-600 text-white",
};

export default function CourtCard({
  quadra,            // { id, imagem, nome, local, preco, avaliacao/nota, tipo }
  variant = "default",
  isFavorited = false,
  onClick,
  onFavorite,        // (quadra, isNowFav) => Promise<void> | void
}) {
  const {
    id,
    imagem,
    imagem_url,
    nome,
    local,
    preco,
    avaliacao,
    nota,
    tipo,
  } = quadra || {};

  const [fav, setFav] = useState(Boolean(isFavorited));
  const rating = typeof avaliacao === "number" ? avaliacao : (typeof nota === "number" ? nota : null);
  const badge = tipo && (tipoClasses[tipo] || "bg-slate-700 text-white");
  const imgSrc = imagem_url
    ? fileURL(imagem_url)
    : imagem
    ? imagem
    : "/quadras/sem-imagem.png";

  async function toggleFav(e) {
    e.stopPropagation();
    const next = !fav;
    setFav(next);
    try {
      if (onFavorite) await onFavorite({ ...quadra, id }, next);
      else await api.post("/favoritos/toggle", { quadra_id: id });
    } catch (err) {
      setFav(!next); // rollback
      console.error(err);
    }
  }

  return (
    <article
      onClick={onClick}
      className="group cursor-pointer rounded-2xl ring-1 ring-black/10 bg-white shadow-sm hover:shadow-lg transition overflow-hidden"
    >
      {/* Imagem com proporção fixa (4:3 mobile, 16:10 desktop) */}
      <div className="relative">
        <div className="aspect-[4/3] sm:aspect-[16/10] overflow-hidden">
          <img
            src={imgSrc}
            alt={nome || "Quadra"}
            className="h-full w-full object-cover group-hover:scale-[1.02] transition-transform"
            loading="lazy"
            onError={(e) => (e.currentTarget.src = "/quadras/sem-imagem.png")}
          />
        </div>

        {/* badges topo */}
        <div className="absolute left-3 top-3 flex items-center gap-2">
          {rating != null && (
            <span className="inline-flex items-center gap-1 rounded-full bg-black/55 text-white px-2 py-1 backdrop-blur">
              <Star className="h-3.5 w-3.5 fill-current" />
              <span className="text-xs font-semibold">{Number(rating).toFixed(1)}</span>
            </span>
          )}
          {tipo && (
            <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-semibold ${badge}`}>
              {tipo}
            </span>
          )}
        </div>

        {/* coração */}
        <button
          onClick={toggleFav}
          className={`absolute right-3 top-3 grid place-items-center h-9 w-9 rounded-full bg-white/90 text-slate-800 hover:bg-white transition ${fav ? "ring-2 ring-rose-500" : "ring-1 ring-black/10"}`}
          aria-label={fav ? "Remover dos favoritos" : "Adicionar aos favoritos"}
        >
          <Heart className={`h-5 w-5 ${fav ? "fill-rose-500 text-rose-500" : ""}`} />
        </button>

        {/* preço */}
        {preco && (
          <span className="absolute left-3 bottom-3 rounded-lg bg-black/60 px-2 py-1 text-white text-xs backdrop-blur">
            {String(preco)}
          </span>
        )}
      </div>

      {/* corpo */}
      <div className={`p-4 ${variant === "compact" ? "pb-4" : "pb-5"}`}>
        <h3 className="line-clamp-1 text-[15px] sm:text-base font-semibold text-slate-900">
          {nome || "Quadra"}
        </h3>
        {local && (
          <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-600">
            <MapPin className="h-4 w-4" />
            <span className="line-clamp-1">{local}</span>
          </p>
        )}
      </div>
    </article>
  );
}
