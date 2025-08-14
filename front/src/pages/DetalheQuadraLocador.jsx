// src/pages/DetalheQuadraLocador.jsx
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import MobileNav from "../components/MobileNav";
import "keen-slider/keen-slider.min.css";
import { useKeenSlider } from "keen-slider/react";
import { api, fileURL } from "../services/api";

export default function DetalheQuadraLocador() {
  const { id } = useParams();
  const [quadra, setQuadra] = useState(null);
  const [imagens, setImagens] = useState([]);
  const [imagemSelecionada, setImagemSelecionada] = useState(null);

  const [perView, setPerView] = useState(window.innerWidth < 640 ? 1 : 3);
  const isMobile = perView === 1;

  const [sliderRef, instanceRef] = useKeenSlider({
    loop: imagens.length > 1,
    slides: { perView, spacing: 15 },
  });

  useEffect(() => {
    const onResize = () => setPerView(window.innerWidth < 640 ? 1 : 3);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    if (instanceRef.current) {
      instanceRef.current.update({
        loop: imagens.length > 1,
        slides: { perView, spacing: 15 },
      });
    }
  }, [perView, imagens.length, instanceRef]);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get(`/quadras/${id}`);
        const normalized = normalizeQuadra(data);
        setQuadra(normalized);
        setImagens(normalized._imagens);
      } catch (err) {
        console.error("Erro ao carregar detalhes da quadra:", err);
      }
    })();
  }, [id]);

  function normalizeQuadra(raw = {}) {
    const nome = raw.nome || raw.titulo || "Quadra";
    const preco = raw.preco ?? raw.valor ?? raw.preco_hora ?? 0;
    const local =
      raw.local ||
      raw.endereco ||
      [raw.rua, raw.numero, raw.bairro, raw.cidade, raw.uf].filter(Boolean).join(", ");
    const descricao = raw.descricao || raw.description || "";
    const avaliacao = Number(raw.avaliacao || raw.rating || raw.nota || 0);
    return {
      ...raw,
      _nome: nome,
      _preco: Number(preco) || 0,
      _local: local,
      _descricao: descricao,
      _avaliacao: isNaN(avaliacao) ? 0 : avaliacao,
      _imagens: resolveImagens(raw),
    };
  }

  function resolveImagens(quadra) {
    const out = [];
    const candidates = [];

    if (Array.isArray(quadra?.imagens)) candidates.push(...quadra.imagens);
    if (typeof quadra?.imagens === "string") {
      try {
        const arr = JSON.parse(quadra.imagens);
        if (Array.isArray(arr)) candidates.push(...arr);
        else candidates.push(quadra.imagens);
      } catch {
        candidates.push(quadra.imagens);
      }
    }
    if (quadra?.imagem_url) candidates.push(quadra.imagem_url);
    if (quadra?.imagem) candidates.push(quadra.imagem);

    for (let c of candidates) {
      if (!c) continue;
      const s = String(c).trim().replace(/\\/g, "/");
      if (!s) continue;

      if (/^https?:\/\//i.test(s)) out.push(s);
      else if (s.includes("/uploads/") || s.startsWith("/")) out.push(fileURL(s));
      else out.push(`/quadras/${s}`);
    }

    if (out.length === 0) out.push("/quadras/quadra1.png");
    return out;
  }

  if (!quadra) {
    return (
      <div className="flex min-h-screen bg-gray-100">
        <div className="hidden md:block"><Sidebar /></div>
        <div className="flex-1 md:ml-64 p-6">Carregando…</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
      <div className="hidden md:block"><Sidebar /></div>
      <div className="md:hidden w-full"><MobileNav /></div>

      <div className="flex-1 md:ml-64 p-4 pb-24 pt-16 md:pt-4">
        <div className="w-full max-w-[1400px] mx-auto bg-white rounded-xl shadow-lg overflow-visible pt-6 pb-12 px-4">

          <div className="text-sm text-gray-500 mb-4">
            <Link to="/home-locador" className="hover:underline">Minhas quadras</Link>{" "}
            / <span className="text-gray-700">{quadra._nome}</span>
          </div>

          <div ref={sliderRef} className="keen-slider flex justify-center items-center overflow-visible min-h-[220px]">
            {imagens.map((src, index) => {
              const slide = instanceRef.current?.track?.details?.slides?.[index];
              const isCenter = slide?.portion > 0.5;
              return (
                <div
                  key={`${index}-${src}`}
                  className={`keen-slider__slide flex justify-center items-center transition-all duration-500 ease-in-out ${isCenter ? "z-30" : "z-10"}`}
                  style={{
                    width: isMobile ? "90vw" : isCenter ? "500px" : "260px",
                    height: isMobile ? "200px" : isCenter ? "300px" : "160px",
                    transform: isMobile ? "scale(1)" : isCenter ? "scale(1.2)" : "scale(0.95)",
                    transition: "all 0.5s ease-in-out",
                  }}
                >
                  <img
                    onClick={() => setImagemSelecionada(src)}
                    src={src}
                    onError={(e) => (e.currentTarget.src = "/quadras/quadra1.png")}
                    className="w-full h-full object-cover rounded-xl shadow-2xl cursor-pointer"
                    alt={`Quadra ${index + 1}`}
                  />
                </div>
              );
            })}
          </div>

          {imagemSelecionada && (
            <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
              <div className="relative max-w-4xl w-full p-4">
                <button
                  onClick={() => setImagemSelecionada(null)}
                  className="absolute top-4 right-4 text-white text-3xl font-bold"
                  aria-label="Fechar"
                >
                  &times;
                </button>
                <img
                  src={imagemSelecionada}
                  onError={(e) => (e.currentTarget.src = "/quadras/quadra1.png")}
                  alt="Imagem ampliada"
                  className="w-full max-h-[80vh] object-contain rounded-lg shadow-lg"
                />
              </div>
            </div>
          )}

          <div className="p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <h1 className="text-2xl font-bold text-gray-800">{quadra._nome}</h1>
              <div className="text-yellow-500 font-semibold">⭐ {Number(quadra._avaliacao || 0).toFixed(1)}</div>
            </div>

            {quadra._local && (
              <div className="flex items-center text-gray-600 gap-1">📍 <span className="text-sm">{quadra._local}</span></div>
            )}

            <div>
              <h2 className="font-semibold text-gray-700">Descrição</h2>
              <p className="text-gray-600 text-sm">{quadra._descricao || "Sem descrição disponível."}</p>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-t pt-4">
              <span className="text-green-700 font-bold text-lg">
                {Number(quadra._preco || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}{" "}
                <span className="text-sm font-normal text-gray-500">/hora</span>
              </span>

              <div className="flex gap-3">
                <Link to="/agenda" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition">
                  Alugar agora
                </Link>
                <Link to="/home-locador" className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-50 transition">
                  Voltar
                </Link>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
