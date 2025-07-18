import React, { useEffect, useState } from "react";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import { useNavigate, Link } from "react-router-dom";
import { quadras, quadrasCarrossel } from "../data/quadras";
import UserDropdown from "../components/DropdownUser";
import MobileNav from "../components/MobileNav";

export default function Home() {
  const navigate = useNavigate(); // Correção adicionada

  const handleQuadraClick = (quadra) => {
  const imagem_nome = quadra.imagem?.split("/").pop(); // extrai apenas o nome do arquivo
  navigate(`/quadra/${quadra.id}`, {
    state: {
      quadra: {
        ...quadra,
        imagem_url: imagem_nome,
        imagem: `/quadras/${imagem_nome}`, // garante compatibilidade visual em QuadraDetalhe se usar quadra.imagem
      },
    },
  });
};




  const [mostrarAviso, setMostrarAviso] = useState(false);
  const [mostrarCookies, setMostrarCookies] = useState(true);
  const [mostrarModal, setMostrarModal] = useState(false);
  

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
<div className="w-16 bg-[#1E8449] text-white flex flex-col items-center py-4 space-y-4 fixed h-full">

  

  {/* Ícone Home */}
  <button title="Home" className="p-2 rounded-lg hover:bg-green-700 transition">
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 10.5L12 4l9 6.5M4.5 10.5v9a.5.5 0 00.5.5h4.5v-6h5v6H19a.5.5 0 00.5-.5v-9" />
    </svg>
  </button>

  {/* Ícone Favoritos */}
  <Link to="/favoritos" title="Favoritos" className="p-2 rounded-lg hover:bg-green-700 transition">
  <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-6 h-6">
    <path d="M6 4a2 2 0 00-2 2v16l8-4 8 4V6a2 2 0 00-2-2H6z" />
  </svg>
</Link>

 {/* Ícone Chat */}
<Link to="/chat" title="Chat" className="p-2 rounded-lg hover:bg-green-700 transition">
  <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-6 h-6">
    <path d="M2 5a2 2 0 012-2h16a2 2 0 012 2v11a2 2 0 01-2 2H6l-4 4V5z" />
  </svg>
</Link>


  {/* Ícone Perfil */}
<button
  title="Perfil"
  onClick={() => navigate("/perfil")}
  className="p-2 rounded-lg hover:bg-green-700 transition"
>
  <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="w-6 h-6" viewBox="0 0 24 24">
    <path d="M12 12a5 5 0 100-10 5 5 0 000 10zm0 2c-3.3 0-10 1.7-10 5v1h20v-1c0-3.3-6.7-5-10-5z" />
  </svg>
</button>



  <button title="Quadras" className="p-2 hover:bg-green-700 rounded-lg">
    <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
      <path d="…"/>
    </svg>
  </button>

  <button title="Reservas" className="p-2 hover:bg-green-700 rounded-lg">
    <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
      <path d="…"/>
    </svg>
  </button>

  <button title="Perfil" className="p-2 hover:bg-green-700 rounded-lg">
    <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
      <path d="…"/>
    </svg>
  </button>
</div>


      <div className="flex-1 bg-white text-black transition-colors px-4 pl-16 overflow-hidden">
       {/* AVISO DE SUCESSO */}
{mostrarAviso && (
  <div className="fixed top-20 right-6 flex w-full max-w-sm overflow-hidden bg-white rounded-lg shadow-md z-50">
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

{/* TOPO COM SAUDAÇÃO, AVATAR E BOTÃO DE FILTRO */}
<div className="relative bg-[#1E8449] text-white p-6 pb-10 rounded-b-3xl shadow-md overflow-visible z-10">

  
{/* NOTIFICAÇÃO NO TOPO ESQUERDO */}
<Link to="/notificacao" className="absolute top-6 left-6 flex items-center gap-4 sm:left-16">
  <div className="w-10 h-10 rounded-full overflow-hidden shadow-md bg-white flex items-center justify-center">
   <img src="/quadras/bellIcon.png" alt="Notificações" className="w-6 h-6 object-contain" />
  </div>
</Link>




  <div className="absolute top-4 right-4 z-50">
    <UserDropdown />
  </div>


  {/* TÍTULO */}
  <h1 className="text-2xl font-bold text-center">Olá, Usuário(a)</h1>
  <p className="text-sm mt-1 text-center">Sua quadra, seu jogo!</p>

  {/* BARRA DE PESQUISA + BOTÃO DE FILTRO */}
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

    {/* Botão de filtro */}
    <button 
      className="ml-2 p-3 bg-white rounded-xl shadow-md"
      onClick={() => setMostrarModal(true)}
    >
      <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 24 24">
        <path d="M3 4a1 1 0 011-1h16a1 1 0 01.8 1.6l-6.2 7.9V19a1 1 0 01-1.6.8l-2-1.5a1 1 0 01-.4-.8v-5.8L3.2 5.6A1 1 0 013 4z" />
      </svg>
    </button>
  </div>

  {/* ÍCONES */}
  <div className="flex gap-6 mt-6 justify-center flex-wrap">
   {[
  { nome: "Futebol", img: "/quadras/Imagem2logo.png" },
  { nome: "Basquete", img: "/quadras/imagem1logo.png" },
  { nome: "Vôlei", img: "/quadras/imagem4logo.png" },
  { nome: "Tênis", img: "/quadras/imagem3logo.png" }
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

        {/* Seção de ícones e filtro já enviada */}

  {/* SLIDER */}
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
          <h2 className="text-xl font-semibold mb-4">Quadras</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quadras.map((q) => (
              <div
                key={q.id}
                onClick={() => handleQuadraClick(q)}
                className="cursor-pointer bg-white rounded-lg shadow-md p-4 flex gap-4 hover:shadow-lg hover:scale-[1.01] transition duration-300"
              >
                <img src={q.imagem} alt={q.nome} className="w-24 h-20 object-cover rounded-md" />
                <div className="flex flex-col justify-between">
                  <h3 className="font-medium">{q.nome}</h3>
                  <p className="text-sm text-gray-600">{q.local}</p>
                  <p className="text-green-700 font-bold text-sm">{q.preco} / hora</p>
                  <p className="text-yellow-500 text-sm">★ {q.avaliacao}</p>
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
