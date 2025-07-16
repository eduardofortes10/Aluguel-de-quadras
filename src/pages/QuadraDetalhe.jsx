import React from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { FaStar, FaEnvelope, FaPhone, FaCommentDots, FaHeart, FaMapMarkerAlt } from "react-icons/fa";
import UserDropdown from "../components/DropdownUser";
import MobileNav from "../components/MobileNav";

export default function QuadraDetalhe() {
  const { state } = useLocation();
  const quadra = state?.quadra;
  const navigate = useNavigate();

  const usuarioLogado = { id: 2, email: "joao@email.com" }; // Simulação do usuário logado

  if (!quadra) return <div className="p-4">Quadra não encontrada.</div>;

  const handleFavoritar = async () => {
    try {
      const imagemNome = quadra.imagem?.split("/").pop();
      const resposta = await fetch("http://localhost:3001/api/favoritos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          usuario_id: usuarioLogado.id,
          quadra_id: quadra.id,
          nome: quadra.nome,
          preco: quadra.preco?.replace("R$", "").replace("/hora", "").trim(),
          local: quadra.local,
          imagem_url: imagemNome,
          nota: quadra.avaliacao || 4.5
        }),
      });
      const data = await resposta.json();
      console.log("✅ Resposta do servidor:", data);
    } catch (erro) {
      console.error("❌ Erro ao favoritar:", erro);
    }
  };

  const handleChat = async () => {
    try {
      await fetch("http://localhost:3001/api/conversas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          remetente_id: usuarioLogado.id,
          destinatario_id: quadra.dono.id,
          mensagem: "Olá, gostaria de saber as informações sobre o aluguel.",
        }),
      });
      navigate("/chat");
    } catch (error) {
      console.error("Erro ao iniciar chat:", error);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* MobileNav e UserDropdown fixos no topo */}
      <div className="md:hidden fixed top-0 w-full z-10">
        <div className="bg-green-700 flex justify-between items-center px-4 py-2 text-white">
          <MobileNav />
          <UserDropdown />
        </div>
      </div>

      {/* Layout principal */}
      <div className="flex flex-1 pt-[60px] md:pt-0">
        {/* Sidebar apenas em telas md+ */}
        <div className="hidden md:block">
          <Sidebar />
        </div>

        <div className="flex-1 p-4 md:pl-[100px]">
          {/* Breadcrumb */}
          <div className="flex items-center py-4 overflow-x-auto whitespace-nowrap">
            <a href="/home" className="text-gray-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
              </svg>
            </a>
            <span className="mx-5 text-gray-500">/</span>
            <span className="text-blue-600 font-medium">Detalhes de quadra</span>
          </div>

          {/* Imagem da quadra */}
          <div className="relative">
            <img src={quadra.imagem} alt={quadra.nome} className="w-full h-72 object-cover rounded-lg" />
            <button
              onClick={handleFavoritar}
              className="absolute top-4 right-4 bg-white text-red-600 p-2 rounded-full shadow"
            >
              <FaHeart />
            </button>
          </div>

          {/* Informações principais */}
          <div className="mt-4 flex flex-col gap-2">
            <h1 className="text-2xl font-semibold">{quadra.nome}</h1>
            <div className="flex items-center text-yellow-500 gap-2 text-sm">
              <FaStar /> {quadra.avaliacao}
            </div>
            <p className="text-gray-600 text-sm flex items-center gap-1">
              <FaMapMarkerAlt /> {quadra.local}
            </p>
            <p className="text-gray-700 text-sm">{quadra.tipo}</p>
          </div>

          {/* Dono */}
          <div className="mt-6 border-t pt-4">
            <h2 className="font-semibold mb-2">Informações do Dono</h2>
            <div className="flex items-center gap-4">
              <img src={quadra.dono.foto} alt={quadra.dono.nome} className="w-14 h-14 rounded-full object-cover" />
              <div>
                <p className="font-medium">{quadra.dono.nome}</p>
                <p className="text-sm text-gray-600">{quadra.dono.email}</p>
                <p className="text-sm text-gray-600">{quadra.dono.telefone}</p>
              </div>
              <div className="ml-auto flex gap-3 text-green-700 text-xl">
                <a href={`mailto:${quadra.dono.email}`}><FaEnvelope /></a>
                <a href={`tel:${quadra.dono.telefone}`}><FaPhone /></a>
                <Link to={`/chat?id=${quadra.dono.id}`}>
  <FaCommentDots />
</Link>


              </div>
            </div>
          </div>

          {/* Mapa */}
          <div className="mt-6">
            <h2 className="font-semibold mb-2">Localização</h2>
            <iframe
              title="mapa"
              src={`https://www.google.com/maps?q=${encodeURIComponent(quadra.local)}&output=embed`}
              width="100%"
              height="280"
              className="rounded-lg"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>

          {/* Preço */}
          <div className="mt-6 flex justify-between items-center">
            <p className="text-green-600 text-lg font-semibold">{quadra.preco}</p>
            <button className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition">
              Alugar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
