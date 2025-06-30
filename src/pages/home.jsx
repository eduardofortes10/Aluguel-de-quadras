import React, { useEffect, useState } from "react";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";

import futebolIcon from "../assets/imagem2logo.png";
import basqueteIcon from "../assets/imagem1logo.png";
import voleiIcon from "../assets/imagem4logo.png";
import tenisIcon from "../assets/imagem3logo.png";

import bellIcon from "../assets/bellIcon.png";


import userPhoto from "../assets/avatar.png";
import quadra1 from "../assets/quadras1.png";
import quadra2 from "../assets/quadras2.png";
import quadra3 from "../assets/quadras3.png";
import quadra4 from "../assets/quadras4.png";
import quadra5 from "../assets/quadras5.png";
import quadra6 from "../assets/quadras6.png";
import quadra7 from "../assets/quadras7.png";

export default function Home() {
  const quadrasParaVoce = [quadra1, quadra2, quadra3, quadra4, quadra5, quadra6, quadra7];

  const todasQuadras = [
    { nome: "Quadra de areia", local: "Itoupava, Blumenau", preco: "R$140", nota: 4.2, imagem: quadra3 },
    { nome: "Quadra", local: "Fortaleza, Blumenau", preco: "R$240", nota: 4.1, imagem: quadra4 },
    { nome: "Campo", local: "Salto Norte, Blumenau", preco: "R$200", nota: 4.3, imagem: quadra5 },
    { nome: "Futebol Society", local: "Velha Central, Blumenau", preco: "R$180", nota: 4.0, imagem: quadra1 },
    { nome: "Ginásio Coberto", local: "Centro, Blumenau", preco: "R$220", nota: 4.6, imagem: quadra2 },
    { nome: "Quadra Sintética", local: "Ponta Aguda, Blumenau", preco: "R$190", nota: 4.4, imagem: quadra6 }
  ];

  const [mostrarCookies, setMostrarCookies] = useState(true);

  const [sliderRef, instanceRef] = useKeenSlider({
    loop: true,
    slides: { perView: 5, spacing: 16 }
  });

  useEffect(() => {
    const interval = setInterval(() => {
      instanceRef.current?.next();
    }, 5000);
    return () => clearInterval(interval);
  }, [instanceRef]);

  return (
    <div className="min-h-screen bg-white text-black transition-colors">
      <div className="relative bg-[#1E8449] text-white p-6 rounded-lg shadow-md">
        {/* Notificação + Avatar */}
        <div className="absolute top-4 right-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-full overflow-hidden shadow-md bg-white flex items-center justify-center">
            <img src={bellIcon} alt="Notificações" className="w-6 h-6 object-contain" />
          </div>
          <div className="w-10 h-10 rounded-full overflow-hidden shadow-md">
            <img src={userPhoto} alt="Usuário" className="w-full h-full object-cover" />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-center">Olá, Richard Rasmussen</h1>
        <p className="text-sm mt-1 text-center">Sua quadra, seu jogo!</p>

        <div className="mt-4 flex justify-center">
          <input
            type="text"
            placeholder="Procure sua quadra aqui"
            className="py-2 px-4 rounded-full text-black focus:outline-none focus:ring-2 focus:ring-green-500 shadow-md w-full max-w-3xl"
          />
        </div>

        <div className="flex gap-6 mt-6 justify-center flex-wrap">
          {[{ nome: "Futebol", img: futebolIcon },
            { nome: "Basquete", img: basqueteIcon },
            { nome: "Vôlei", img: voleiIcon },
            { nome: "Tênis", img: tenisIcon }
          ].map(({ nome, img }) => (
            <div key={nome} className="flex flex-col items-center">
              <div className="bg-white rounded-full p-2 shadow-md hover:scale-105 transition">
                <img src={img} alt={nome} className="w-10 h-10 object-contain" />
              </div>
              <span className="text-sm mt-1 capitalize text-white">{nome}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-10">
        <h2 className="text-xl font-semibold mb-4">Para você</h2>
        <div ref={sliderRef} className="keen-slider">
          {quadrasParaVoce.map((img, index) => (
            <div className="keen-slider__slide bg-white rounded-lg shadow-md p-2" key={index}>
              <img src={img} alt={`Quadra ${index + 1}`} className="rounded-md w-full h-32 object-cover" />
              <div className="mt-2">
                <h3 className="font-medium text-sm">Quadra {index + 1}</h3>
                <p className="text-green-700 font-bold text-sm">R${100 + index * 10} / hora</p>
                <p className="text-xs text-gray-500">Bairro {index + 1}, Blumenau</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-10">
        <h2 className="text-xl font-semibold mb-4">Quadras</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {todasQuadras.map((q, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-4 flex gap-4 hover:shadow-lg hover:scale-[1.01] transition duration-300">
              <img src={q.imagem} alt={q.nome} className="w-24 h-20 object-cover rounded-md" />
              <div className="flex flex-col justify-between">
                <h3 className="font-medium">{q.nome}</h3>
                <p className="text-sm text-gray-600">{q.local}</p>
                <p className="text-green-700 font-bold text-sm">{q.preco} / hora</p>
                <p className="text-yellow-500 text-sm">★ {q.nota}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {mostrarCookies && (
        <section className="fixed max-w-md p-4 mx-auto bg-[#1E8449] border border-green-900 left-12 bottom-16 rounded-2xl text-white shadow-lg z-50">
          <h2 className="font-semibold">🍪 Usamos cookies!</h2>
          <p className="mt-4 text-sm">
            Este site usa cookies essenciais para funcionar corretamente, e cookies de rastreamento para entender como você interage com ele. Esses só serão ativados após seu consentimento.{" "}
            <a href="#" className="font-medium underline hover:text-green-200 transition-colors">Escolher preferências</a>.
          </p>
          <p className="mt-3 text-sm">Fechando essa notificação, as configurações padrão serão salvas.</p>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <button onClick={() => setMostrarCookies(false)} className="text-xs bg-white text-green-800 font-medium rounded-lg hover:bg-green-100 px-4 py-2.5 transition-colors">Aceitar todos</button>
            <button onClick={() => setMostrarCookies(false)} className="text-xs border border-white text-white hover:bg-green-700 font-medium rounded-lg px-4 py-2.5 transition-colors">Rejeitar todos</button>
            <button className="text-xs border border-white text-white hover:bg-green-700 font-medium rounded-lg px-4 py-2.5 transition-colors col-span-2">Preferências</button>
            <button onClick={() => setMostrarCookies(false)} className="text-xs border border-white text-white hover:bg-green-700 font-medium rounded-lg px-4 py-2.5 transition-colors col-span-2">Fechar</button>
          </div>
        </section>
      )}

      <footer className="bg-[#14532d] text-white py-6 mt-12">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-lg font-bold">Sobre</h3>
          <p className="text-sm mt-1">Encontre, alugue e jogue nas melhores quadras da sua cidade.</p>
          <h3 className="text-lg font-bold mt-4">Navegação</h3>
          <p className="text-sm">Home | Quadras | Contato</p>
          <h3 className="text-lg font-bold mt-4">Redes sociais</h3>
          <p className="text-sm">Nos siga para novidades e promoções.</p>
          <h3 className="text-lg font-bold mt-4">Contato</h3>
          <p className="text-sm">exemplo@email.com</p>
          <p className="text-sm">+55 (47) 99999-9999</p>
          <p className="text-center text-sm mt-4">© 2025 Aluguel de Quadras — Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
