import React, { useEffect, useState } from "react";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";

import futebolIcon from "../assets/imagem2logo.png";
import basqueteIcon from "../assets/imagem1logo.png";
import voleiIcon from "../assets/imagem4logo.png";
import tenisIcon from "../assets/imagem3logo.png";
import bellIcon from "../assets/bellIcon.png";
import userPhoto from "../assets/avatar.png";
import quadra1 from "../assets/imagem11.png";
import quadra2 from "../assets/quadras2.png";
import quadra3 from "../assets/quadras3.png";
import quadra4 from "../assets/quadras4.png";
import quadra5 from "../assets/quadras5.png";
import quadra6 from "../assets/quadras6.png";
import quadra7 from "../assets/quadras7.png";

export default function Home() {
  const [mostrarAviso, setMostrarAviso] = useState(false);
  const [mostrarCookies, setMostrarCookies] = useState(true);

  const quadrasParaVoce = [quadra1, quadra2, quadra3, quadra4, quadra5, quadra6, quadra7];

  const todasQuadras = [
    { nome: "Quadra de areia", local: "Itoupava, Blumenau", preco: "R$140", nota: 4.2, imagem: quadra3 },
    { nome: "Quadra", local: "Fortaleza, Blumenau", preco: "R$240", nota: 4.1, imagem: quadra4 },
    { nome: "Campo", local: "Salto Norte, Blumenau", preco: "R$200", nota: 4.3, imagem: quadra5 },
    { nome: "Futebol Society", local: "Velha Central, Blumenau", preco: "R$180", nota: 4.0, imagem: quadra1 },
    { nome: "Ginásio Coberto", local: "Centro, Blumenau", preco: "R$220", nota: 4.6, imagem: quadra2 },
    { nome: "Quadra Sintética", local: "Ponta Aguda, Blumenau", preco: "R$190", nota: 4.4, imagem: quadra6 }
  ];

  const [sliderRef, instanceRef] = useKeenSlider({
    loop: true,
    slides: { perView: 5, spacing: 16 }
  });

  useEffect(() => {
    setMostrarAviso(true);
    const timeout = setTimeout(() => {
      setMostrarAviso(false);
    }, 3000);
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      instanceRef.current?.next();
    }, 5000);
    return () => clearInterval(interval);
  }, [instanceRef]);

 return (
  <div className="flex min-h-screen overflow-x-hidden">

     {/* SIDEBAR */}
      <aside className="flex flex-col items-center w-16 h-screen py-8 overflow-y-auto bg-[#14532d] border-r fixed left-0 top-0 z-50">
        <nav className="flex flex-col flex-1 space-y-6">
       
          {[
            // Home
            "M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75",
            // Chart
            "M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75c0 .621-.504 1.125-1.125 1.125h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z",
            // Clipboard Check
            "M11.35 3.836c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m8.9-4.414c.376.023.75.05 1.124.08 1.131.094 1.976 1.057 1.976 2.192V16.5A2.25 2.25 0 0118 18.75h-2.25m-7.5-10.5H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V18.75m-7.5-10.5h6.375c.621 0 1.125.504 1.125 1.125v9.375m-8.25-3l1.5 1.5 3-3.75",
            // Megafone
            "M3 3v1.5M3 21v-6m0 0l2.77-.693a9 9 0 016.208.682l.108.054a9 9 0 006.086.71l3.114-.732a48.524 48.524 0 01-.005-10.499l-3.11.732a9 9 0 01-6.085-.711l-.108-.054a9 9 0 00-6.208-.682L3 4.5M3 15V4.5",
            // Engrenagem
            "M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
          ].map((d, i) => (
            <a key={i} href="#" className="p-1.5 text-white hover:bg-green-700 rounded-lg transition-colors duration-200">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d={d} />
              </svg>
            </a>
          ))}
        </nav>
         {/* AVATAR NO FINAL */}
        <div className="mt-6">
          <div className="w-10 h-10 rounded-full overflow-hidden shadow-md">
            <img src={userPhoto} alt="Usuário" className="w-full h-full object-cover" />
          </div>
        </div>
      </aside>
<div className="flex-1 bg-white text-black transition-colors px-4 pl-16 overflow-hidden">
        {/* AVISO DE SUCESSO */}
        {mostrarAviso && (
          <div className="fixed top-6 right-6 flex w-full max-w-sm overflow-hidden bg-white rounded-lg shadow-md z-50">
            <div className="flex items-center justify-center w-12 bg-emerald-500">
              <svg className="w-6 h-6 text-white fill-current" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 3.33331C10.8 3.33331 3.33337 10.8 3.33337 20C3.33337 29.2 10.8 36.6666 20 36.6666C29.2 36.6666 36.6667 29.2 36.6667 20C36.6667 10.8 29.2 3.33331 20 3.33331ZM16.6667 28.3333L8.33337 20L10.6834 17.65L16.6667 23.6166L29.3167 10.9666L31.6667 13.3333L16.6667 28.3333Z" />
              </svg>
            </div>
            <div className="px-4 py-2 -mx-3">
              <div className="mx-3">
                <span className="font-semibold text-emerald-500">Sucesso</span>
                <p className="text-sm text-gray-600">Sua conta foi acessada com sucesso!</p>
              </div>
            </div>
          </div>
        )}

        {/* TOPO COM AVATAR E NOTIFICAÇÃO */}
        <div className="relative bg-[#1E8449] text-white p-6 rounded-lg shadow-md mt-4">
          <div className="absolute top-4 right-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-full overflow-hidden shadow-md bg-white flex items-center justify-center">
              <img src={bellIcon} alt="Notificações" className="w-6 h-6 object-contain" />
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

        {/* SLIDER */}
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

        {/* LISTA QUADRAS */}
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

        {/* COOKIES */}
        {mostrarCookies && (
          <section className="fixed max-w-md p-4 mx-auto bg-[#1E8449] border border-green-900 left-12 bottom-16 rounded-2xl text-white shadow-lg z-50">
            <h2 className="font-semibold">🍪 Usamos cookies!</h2>
            <p className="mt-4 text-sm">
              Este site usa cookies essenciais para funcionar corretamente, e cookies de rastreamento para entender como você interage com ele.{" "}
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

        {/* RODAPÉ */}
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
    </div>
  );
}
