import React, { useEffect, useState } from "react";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { quadras, quadrasCarrossel } from "../data/quadras";
import UserDropdown from "../components/DropdownUser";
import MobileNav from "../components/MobileNav";
import Sidebar from "../components/Sidebar";

export default function Home() {
  const navigate = useNavigate();
  const location = useLocation();
  const [nomeUsuario, setNomeUsuario] = useState("");
  const [mostrarAviso, setMostrarAviso] = useState(false);
  const [mostrarCookies, setMostrarCookies] = useState(false);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [tipoSelecionado, setTipoSelecionado] = useState("Todos");

  const [sliderRef] = useKeenSlider({
  loop: true,
  slides: { perView: 5, spacing: 16 },
  created(slider) {
    setInterval(() => {
      slider.next();
    }, 5000);
  },
});

  const handleQuadraClick = (quadra) => {
    const imagem_nome = quadra.imagem?.split("/").pop();
    navigate(`/quadra/${quadra.id}`, {
      state: {
        quadra: {
          ...quadra,
          imagem_url: imagem_nome,
          imagem: `/quadras/${imagem_nome}`
        }
      }
    });
  };

  useEffect(() => {
    const nome = localStorage.getItem("nomeUsuario") || "Usuário(a)";
    setNomeUsuario(nome);
  }, []);

  useEffect(() => {
    if (location.state?.loginSucesso) {
      setMostrarAviso(true);
      const timeout = setTimeout(() => setMostrarAviso(false), 3000);
      return () => clearTimeout(timeout);
    }
  }, [location.state]);

  useEffect(() => {
    const cookiesAceitos = localStorage.getItem("cookiesAceitos");
    setMostrarCookies(cookiesAceitos !== "true");
  }, []);

  return (
    <div className="flex min-h-screen overflow-x-hidden">
      <div className="hidden md:block">
        <Sidebar />
      </div>

      <div className="md:hidden fixed top-0 left-0 w-full z-50">
        <MobileNav />
      </div>

      <div className="flex-1 bg-white text-black transition-colors px-4 pl-16 overflow-hidden">
        {mostrarAviso && (
          <div className="fixed top-6 right-6 z-50 bg-white border-l-4 border-green-600 shadow-xl rounded-md p-4 flex items-start gap-3 animate-fade-in-down">
            <div className="bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center">✓</div>
            <div>
              <p className="font-semibold text-green-700">Login realizado!</p>
              <p className="text-sm text-gray-600">Bem-vindo de volta à plataforma.</p>
            </div>
          </div>
        )}

        <div className="relative bg-gradient-to-b from-[#1E8449] to-[#14532d] text-white p-6 pb-10 rounded-b-3xl shadow-md z-10">
          <Link to="/notificacao" className="absolute top-6 left-4 sm:left-16">
            <div className="w-10 h-10 rounded-full overflow-hidden shadow-md bg-white flex items-center justify-center">
              <img src="/quadras/bellIcon.png" alt="Notificações" className="w-6 h-6 object-contain" />
            </div>
          </Link>

          <div className="fixed top-4 right-4 z-[9999]">
            <UserDropdown />
          </div>

          <h1 className="text-2xl font-bold text-center">Olá, {nomeUsuario}</h1>
          <p className="text-sm mt-1 text-center">Sua quadra, seu jogo!</p>

          <div className="flex items-center justify-center mt-4">
            <div className="flex items-center bg-white rounded-full px-4 py-2 shadow-md">
              <svg className="w-5 h-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M5 11a6 6 0 1112 0 6 6 0 01-12 0z" />
              </svg>
              <input
                type="text"
                placeholder="Procure sua quadra aqui"
                className="outline-none text-gray-700 w-64"
              />
            </div>

            <button
              className="ml-2 p-3 bg-white rounded-xl shadow-md hover:bg-green-100"
              onClick={() => setMostrarModal(true)}
            >
              <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M3 4a1 1 0 011-1h16a1 1 0 01.8 1.6l-6.2 7.9V19a1 1 0 01-1.6.8l-2-1.5a1 1 0 01-.4-.8v-5.8L3.2 5.6A1 1 0 013 4z" />
              </svg>
            </button>
          </div>

          <div className="flex gap-6 mt-6 justify-center flex-wrap">
            {[
              { nome: "Futebol", img: "/quadras/Imagem2logo.png" },
              { nome: "Basquete", img: "/quadras/imagem1logo.png" },
              { nome: "Vôlei", img: "/quadras/imagem4logo.png" },
              { nome: "Tênis", img: "/quadras/imagem3logo.png" }
            ].map(({ nome, img }) => (
              <div key={nome} className="flex flex-col items-center">
                <div className="bg-white rounded-full p-2 shadow-md hover:scale-105 transition-transform duration-200">
                  <img src={img} alt={nome} className="w-10 h-10 object-contain" />
                </div>
                <span className="text-sm mt-1 capitalize text-white drop-shadow">{nome}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10">
          <h2 className="text-xl font-semibold mb-4">Para você</h2>
          <div ref={sliderRef} className="keen-slider">
            {quadrasCarrossel.map((quadra) => (
              <div
                key={quadra.id}
                className="keen-slider__slide bg-white rounded-lg shadow-md p-2 cursor-pointer"
                onClick={() => navigate(`/quadra/${quadra.id}`, { state: { quadra } })}
              >
                <img src={quadra.imagem} alt={quadra.nome} className="rounded-md w-full h-32 object-cover" />
                <div className="mt-2">
                  <h3 className="font-medium text-sm">{quadra.nome}</h3>
                  <p className="text-green-700 font-bold text-sm">{quadra.preco}</p>
                  <p className="text-xs text-gray-500">{quadra.local}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      {/* Quadras em destaque */}
        <div className="mt-10">
          <h2 className="text-xl font-semibold mb-4 text-green-700">Quadras em destaque</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {quadras.map((q) => (
              <div
                key={q.id}
                onClick={() => handleQuadraClick(q)}
                className="cursor-pointer bg-white rounded-xl shadow-md hover:shadow-xl hover:scale-[1.015] transition-transform duration-300 p-4 flex gap-4"
              >
                <img
                  src={q.imagem}
                  alt={q.nome}
                  className="w-24 h-24 object-cover rounded-lg border border-gray-200"
                />
                <div className="flex flex-col justify-between">
                  <h3 className="font-semibold text-lg text-gray-900">{q.nome}</h3>
                  <p className="text-sm text-gray-600">{q.local}</p>
                  <p className="text-green-700 font-bold text-sm">{q.preco}</p>
                  <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2 py-0.5 rounded w-max">
                    ★ {q.avaliacao}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* COOKIES */}
       {mostrarCookies && (
  <section className="fixed bottom-10 left-6 sm:left-12 max-w-md w-[90%] sm:w-[400px] p-4 bg-green-700 text-white rounded-xl shadow-xl z-50 transition-all">
    <h2 className="font-bold text-lg mb-1">🍪 Nós usamos cookies!</h2>
    <p className="text-sm mb-3">Usamos cookies para melhorar sua experiência e analisar o tráfego do site.</p>
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => {
          localStorage.setItem("cookiesAceitos", "true");
          setMostrarCookies(false);
        }}
        className="bg-white text-green-800 px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-100 transition"
      >
        Aceitar todos
      </button>
      <button
        onClick={() => {
  localStorage.setItem("cookiesAceitos", "true");
  setMostrarCookies(false);
}}

        className="border border-white text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-600 transition"
      >
        Rejeitar
      </button>
      <button
        onClick={() => setMostrarCookies(false)}
        className="w-full text-center mt-2 text-xs underline text-white/80 hover:text-white"
      >
        Fechar
      </button>
    </div>
  </section>
)}
        
        {/* RODAPÉ */}
        <footer className="bg-[#14532d] text-white py-10 mt-12">
          <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 text-sm">
            <div>
              <h3 className="text-lg font-bold mb-2">Sobre</h3>
              <p>Encontre, alugue e jogue nas melhores quadras da sua cidade.</p>
            </div>

            <div>
              <h3 className="text-lg font-bold mb-2">Navegação</h3>
              <ul className="space-y-1">
                <li><a href="#" className="hover:underline">Home</a></li>
                <li><a href="#" className="hover:underline">Quadras</a></li>
                <li><a href="#" className="hover:underline">Contato</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-bold mb-2">Redes sociais</h3>
              <ul className="space-y-1">
                <li><a href="#" className="hover:underline">Instagram</a></li>
                <li><a href="#" className="hover:underline">Facebook</a></li>
                <li><a href="#" className="hover:underline">Twitter</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-bold mb-2">Contato</h3>
              <p className="mb-1">📧 eduardo_fortes@gmail.com</p>
              <p>📞 +55 (19) 99938-7274</p>
            </div>
          </div>
          <div className="mt-8 text-center text-xs border-t border-white/20 pt-4">
            © 2025 Aluguel de Quadras — Todos os direitos reservados.
          </div>
        </footer>
      {mostrarModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center">
          <div className="bg-white w-[90%] max-w-md rounded-2xl p-6 relative overflow-y-auto max-h-[90vh]">
            <button
              className="absolute top-4 right-4 text-gray-600 hover:text-red-500"
              onClick={() => setMostrarModal(false)}
            >
              ✕
            </button>

            <h2 className="text-xl font-bold text-green-700 mb-4">Filtros</h2>

            <div className="mb-4">
              <h3 className="font-semibold text-sm mb-2">Tipo de quadra</h3>
              <div className="flex flex-wrap gap-2">
                {["Todos", "Futsal", "Society", "Campo", "Quadra"].map((tipo, i) => (
                  <button
                    key={i}
                    className="px-3 py-1 rounded-full bg-gray-100 hover:bg-green-100 text-sm text-gray-800"
                  >
                    {tipo}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <h3 className="font-semibold text-sm mb-2">Número de Estrelas</h3>
              <div className="flex flex-col gap-1">
                {[5, 4, 3, 2, 1].map((star) => (
                  <label key={star} className="flex items-center gap-2">
                    <input type="checkbox" />
                    {Array.from({ length: star }, (_, i) => (
                      <span key={i}>⭐</span>
                    ))}
                  </label>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <h3 className="font-semibold text-sm mb-2">Linha de preço</h3>
              <input type="range" min={0} max={1000} className="w-full accent-green-600" />
              <div className="flex justify-between text-xs text-gray-600">
                <span>R$0</span>
                <span>R$1000</span>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="font-semibold text-sm mb-2">Horas</h3>
              <div className="flex flex-wrap gap-2">
                {["Todos", 1, 2, 3, 4, "5+"].map((hora, i) => (
                  <button
                    key={i}
                    className="px-3 py-1 rounded-full bg-gray-100 hover:bg-green-100 text-sm text-gray-800"
                  >
                    {hora}
                  </button>
                ))}
              </div>
            </div>
            <div className="mb-6">
              <h3 className="font-semibold text-sm mb-2">Banheiros</h3>
              <div className="flex flex-wrap gap-2">
                {["Todos", 1, 2, 3, 4, "5+"].map((banheiro, i) => (
                  <button
                    key={i}
                    className="px-3 py-1 rounded-full bg-gray-100 hover:bg-green-100 text-sm text-gray-800"
                  >
                    {banheiro}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <h3 className="font-semibold text-sm mb-2 text-blue-900">Distância até você</h3>
              <input type="range" min={10} max={2000} className="w-full accent-green-600" />
              <div className="flex justify-between text-xs text-gray-600">
                <span>100m</span>
                <span>2000m+</span>
              </div>
            </div>

            <button
              onClick={() => setMostrarModal(false)}
              className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg"
            >
              Aplicar Filtro
                       </button>
          </div>
        </div>
      )}
         </div> 
    </div> 
  );
}
