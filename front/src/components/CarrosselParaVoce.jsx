import React from "react";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import { useNavigate } from "react-router-dom";

export default function CarrosselParaVoce({ items = [] }) {
  const navigate = useNavigate();

  const [sliderRef] = useKeenSlider({
    mode: "free-snap",
    rubberband: true,
    slides: { perView: 1.1, spacing: 12 },
    breakpoints: {
      "(min-width: 400px)": { slides: { perView: 1.25, spacing: 14 } },
      "(min-width: 640px)": { slides: { perView: 1.5,  spacing: 16 } },
      "(min-width: 768px)": { slides: { perView: 2.25, spacing: 18 } },
      "(min-width: 1024px)": { slides: { perView: 3,    spacing: 20 } },
    },
  });

  const abrir = (id) => navigate(`/quadra/${id}`);

  return (
    <div className="relative">
      {/* máscara nas bordas p/ dar sensação de “fade” e indicar scroll */}
      <div
        className="keen-slider overflow-visible"
        ref={sliderRef}
        style={{
          WebkitMaskImage:
            "linear-gradient(to right, transparent 0, black 16px, black calc(100% - 16px), transparent 100%)",
          maskImage:
            "linear-gradient(to right, transparent 0, black 16px, black calc(100% - 16px), transparent 100%)",
        }}
      >
        {items.map((q) => (
          <div key={q.id} className="keen-slider__slide">
            <button
              onClick={() => abrir(q.id)}
              className="w-full text-left bg-white rounded-2xl shadow-md hover:shadow-lg transition 
                         overflow-hidden ring-1 ring-black/5"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <img
                  src={q.imagem}
                  alt={q.nome}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
                {/* preço */}
                <div className="absolute top-2 left-2 bg-black/65 text-white text-xs font-semibold px-2 py-1 rounded-lg">
                  {q.preco ? `R$${q.preco}/h` : "R$/h"}
                </div>
                {/* favorito placeholder opcional
                <div className="absolute top-2 right-2 bg-white/80 rounded-full p-1">
                  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-emerald-600">
                    <path d="M12 21s-6.716-4.245-9.193-7.626C1.03 11.72 1 8.99 3.053 7.09 5.106 5.19 7.7 5.74 9 7.21 10.3 5.74 12.894 5.19 14.947 7.09 17 8.99 16.97 11.72 14.193 13.374 12.716 14.27 12 15 12 15z"/>
                  </svg>
                </div> */}
              </div>

              <div className="p-3">
                <h3 className="text-sm font-semibold line-clamp-1">{q.nome}</h3>
                <div className="mt-1 flex items-center gap-1 text-[13px] text-gray-600">
                  {/* ícone localização simples e leve */}
                  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current opacity-70">
                    <path d="M12 2a7 7 0 017 7c0 5-7 13-7 13S5 14 5 9a7 7 0 017-7zm0 9.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z"/>
                  </svg>
                  <span className="line-clamp-1">{q.local || "—"}</span>
                </div>

                <div className="mt-2 flex items-center justify-between">
                  <span className="text-xs px-2 py-1 bg-emerald-50 text-emerald-700 rounded-full">
                    {q.tipo || "Poliesportiva"}
                  </span>
                  {q.avaliacao && (
                    <span className="text-xs inline-flex items-center gap-1 text-gray-700">
                      <svg viewBox="0 0 20 20" className="w-4 h-4 fill-yellow-400">
                        <path d="M10 15l-5.878 3.09 1.122-6.545L.488 6.91l6.564-.955L10 0l2.948 5.955 6.564.955-4.756 4.635 1.122 6.545z"/>
                      </svg>
                      {Number(q.avaliacao).toFixed(1)}
                    </span>
                  )}
                </div>
              </div>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
