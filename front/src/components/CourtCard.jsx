// src/components/CourtCard.jsx
import React, { useMemo, useState } from "react";
import { MapPin, Star, Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";

function cx(...cls) {
  return cls.filter(Boolean).join(" ");
}

const tipoClasses = {
  Futebol: "bg-emerald-600/90 text-white",
  Futsal: "bg-emerald-600/90 text-white",
  Vôlei: "bg-indigo-600/90 text-white",
  Basquete: "bg-orange-600/90 text-white",
  Tênis: "bg-cyan-600/90 text-white",
  Poliesportiva: "bg-fuchsia-600/90 text-white",
  Golfe: "bg-lime-600/90 text-white",
};

const formatBRL = (valor) => {
  if (valor == null) return "—";
  if (typeof valor === "string") {
    // já vem formatado (ex.: "R$ 90")
    if (valor.trim().startsWith("R$")) return valor;
    const n = Number(valor.replace(/[^\d]/g, "")) / 100;
    if (!isNaN(n)) return n.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });
  }
  if (typeof valor === "number") {
    return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });
  }
  return String(valor);
};

export default function CourtCard({
  quadra,
  onFavorite,          // (quadra, isNowFav) => void
  isFavorited = false,
  onClick,              // opcional: override do clique
  variant = "default",  // "default" | "compact" (útil p/ slider)
  showOwner = false,
}) {
  const navigate = useNavigate();
  const [fav, setFav] = useState(!!isFavorited);

  const {
    id,
    nome,
    imagem,    // string: "/quadras/quadra3.png" etc.
    local,
    preco,
    avaliacao, // number | string
    tipo,
    dono,      // string opcional
    distancia, // opcional: "1.2 km"
  } = quadra || {};

  const badgeTipoClass = tipoClasses[tipo] || "bg-zinc-800/80 text-white";
  const precoFmt = useMemo(() => (preco ? `${formatBRL(preco)}/h` : "—"), [preco]);
  const ratingFmt = useMemo(() => {
    const n = Number(avaliacao);
    if (isNaN(n)) return null;
    return n.toFixed(1);
  }, [avaliacao]);

  const handleFav = (e) => {
    e.stopPropagation();
    const newVal = !fav;
    setFav(newVal);
    onFavorite?.(quadra, newVal);
  };

  const handleClick = () => {
    if (onClick) return onClick(quadra);
    if (id != null) navigate(`/quadra/${id}`);
  };

  // tamanhos por variante
  const sizes = {
    default: {
      card: "w-full",
      aspect: "aspect-[4/3]",
      title: "text-base md:text-lg",
      meta: "text-xs md:text-sm",
    },
    compact: {
      card: "w-full",
      aspect: "aspect-[16/10]",
      title: "text-sm md:text-base",
      meta: "text-[11px] md:text-xs",
    },
  }[variant];

  return (
    <article
      onClick={handleClick}
      className={cx(
        "group relative overflow-hidden rounded-2xl border border-zinc-200/70 dark:border-zinc-800",
        "bg-white dark:bg-zinc-900 shadow-sm hover:shadow-xl transition-all duration-300",
        "hover:-translate-y-0.5 cursor-pointer",
        sizes.card
      )}
      aria-label={nome || "Quadra"}
    >
      {/* Media */}
      <div className={cx("relative w-full", sizes.aspect)}>
        <img
          src={imagem}
          alt={nome || "Quadra"}
          loading="lazy"
          decoding="async"
          className={cx(
            "absolute inset-0 h-full w-full object-cover",
            "transition-transform duration-500 group-hover:scale-[1.03]"
          )}
          onError={(e) => {
            // fallback simples
            e.currentTarget.src = "https://via.placeholder.com/800x600?text=Quadra";
          }}
        />

        {/* Top badges */}
        <div className="absolute left-3 top-3 flex items-center gap-2">
          {ratingFmt && (
            <span className="inline-flex items-center gap-1 rounded-full bg-black/55 text-white px-2 py-1 backdrop-blur-md">
              <Star size={14} className="fill-current" />
              <span className="text-xs font-medium">{ratingFmt}</span>
            </span>
          )}
          {tipo && (
            <span className={cx("inline-flex items-center rounded-full px-2 py-1", "text-xs font-medium", badgeTipoClass)}>
              {tipo}
            </span>
          )}
        </div>

        {/* Favorite */}
        <button
          onClick={handleFav}
          aria-label={fav ? "Desfavoritar" : "Favoritar"}
          className={cx(
            "absolute right-3 top-3 inline-flex items-center justify-center rounded-full",
            "backdrop-blur-md bg-white/70 dark:bg-zinc-900/60 border border-zinc-200/70 dark:border-zinc-800",
            "h-9 w-9 transition-all duration-300 hover:scale-105 active:scale-95"
          )}
        >
          <Heart
            size={18}
            className={cx(
              "transition-transform duration-300",
              fav ? "fill-rose-500 text-rose-500 scale-110" : "text-zinc-700 dark:text-zinc-200"
            )}
          />
        </button>

        {/* Price chip */}
        <div className="absolute bottom-3 left-3">
          <span className="inline-flex items-center rounded-full bg-black/55 text-white px-2.5 py-1.5 backdrop-blur-md text-xs font-semibold">
            {precoFmt}
          </span>
        </div>

        {/* Gradient bottom for legibility */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/55 to-transparent" />
      </div>

      {/* Info */}
      <div className="p-3 md:p-4">
        <h3 className={cx("line-clamp-1 font-semibold text-zinc-900 dark:text-zinc-100", sizes.title)}>
          {nome || "Quadra sem nome"}
        </h3>

        <div className={cx("mt-1 flex items-center gap-1.5 text-zinc-600 dark:text-zinc-300", sizes.meta)}>
          <MapPin size={14} className="shrink-0" />
          <span className="line-clamp-1">
            {local || "Local não informado"}
            {distancia ? <span className="text-zinc-400"> • {distancia}</span> : null}
          </span>
        </div>

        {showOwner && dono && (
          <div className={cx("mt-1 text-zinc-500 dark:text-zinc-400", sizes.meta)}>
            Proprietário: <span className="font-medium text-zinc-700 dark:text-zinc-200">{dono}</span>
          </div>
        )}
      </div>
    </article>
  );
}
