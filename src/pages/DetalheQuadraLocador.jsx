import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import MobileNav from "../components/MobileNav";
import "keen-slider/keen-slider.min.css";
import { useKeenSlider } from "keen-slider/react";

export default function DetalheQuadraLocador() {
  const { id } = useParams();
  const [quadra, setQuadra] = useState(null);
  const [imagemSelecionada, setImagemSelecionada] = useState(null);
  const [perView, setPerView] = useState(window.innerWidth < 640 ? 1 : 3);

  const [sliderRef, instanceRef] = useKeenSlider({
    loop: true,
    slides: {
      perView,
      spacing: 15,
    },
  });

  // Atualiza responsividade ao redimensionar a janela
  useEffect(() => {
    const handleResize = () => {
      setPerView(window.innerWidth < 640 ? 1 : 3);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    fetch(`http://localhost:5000/api/quadras/${id}`)
      .then((res) => res.json())
      .then((data) => {
        try {
          data.imagem_url = JSON.parse(data.imagem_url || "[]");
        } catch {
          data.imagem_url = [];
        }
        setQuadra(data);
      })
      .catch((err) =>
        console.error("Erro ao carregar detalhes da quadra:", err)
      );
  }, [id]);

  if (!quadra) return <p className="p-4">Carregando...</p>;

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
      {/* Sidebar apenas em telas grandes */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* MobileNav apenas em telas pequenas */}
      <div className="md:hidden w-full">
        <MobileNav />
      </div>

      <div className="flex-1 md:ml-64 p-4 pb-24 pt-16 md:pt-4">
        <div className="w-full max-w-[1400px] mx-auto bg-white rounded-xl shadow-lg overflow-visible pt-6 pb-12 px-4">
          {/* Carrossel */}
          <div
            ref={sliderRef}
            className="keen-slider flex justify-center items-center overflow-visible min-h-[220px]"
          >
            {quadra.imagem_url?.map((url, index) => {
              const slide = instanceRef.current?.track?.details?.slides[index];
              const isCenter = slide?.portion > 0.5;
              const isMobile = window.innerWidth < 640;

              return (
                <div
                  key={index}
                 className={`keen-slider__slide flex justify-center items-center transition-all duration-500 ease-in-out ${
  isCenter ? "z-30" : "z-10"
                  }`}
                  style={{
                    width: isMobile ? "90vw" : isCenter ? "500px" : "260px",
                    height: isMobile ? "200px" : isCenter ? "300px" : "160px",
                    transform: isMobile
                      ? "scale(1)"
                      : isCenter
                      ? "scale(1.2)"
                      : "scale(0.95)",
                    transition: "all 0.5s ease-in-out",
                  }}
                >
                  <img
                    onClick={() => setImagemSelecionada(url)}
                    src={`http://localhost:5000${url}`}
                    className="w-full h-full object-cover rounded-xl shadow-2xl cursor-pointer"
                    alt={`Quadra ${index + 1}`}
                  />
                </div>
              );
            })}
          </div>

          {/* Modal de imagem ampliada */}
          {imagemSelecionada && (
            <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
              <div className="relative max-w-4xl w-full p-4">
                <button
                  onClick={() => setImagemSelecionada(null)}
                  className="absolute top-4 right-4 text-white text-3xl font-bold"
                >
                  &times;
                </button>
                <img
                  src={`http://localhost:5000${imagemSelecionada}`}
                  alt="Imagem ampliada"
                  className="w-full max-h-[80vh] object-contain rounded-lg shadow-lg"
                />
              </div>
            </div>
          )}

          {/* Informações da quadra */}
          <div className="p-6 space-y-4">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-gray-800">
                {quadra.nome}
              </h1>
              <div className="text-yellow-500 font-semibold">
                ⭐ {quadra.nota || "4.5"}
              </div>
            </div>

            <div className="flex items-center text-gray-600 gap-1">
              📍
              <span className="text-sm">{quadra.local}</span>
            </div>

            <div>
              <h2 className="font-semibold text-gray-700">Descrição</h2>
              <p className="text-gray-600 text-sm">
                {quadra.descricao || "Sem descrição disponível."}
              </p>
            </div>

            <div className="flex justify-between items-center border-t pt-4">
              <span className="text-green-700 font-bold text-lg">
                R${quadra.preco}{" "}
                <span className="text-sm font-normal text-gray-500">
                  /hora
                </span>
              </span>

              <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition">
                Alugar agora
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
