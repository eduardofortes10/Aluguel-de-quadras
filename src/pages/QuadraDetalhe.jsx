import React from "react";
import { useLocation, Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import UserDropdown from "../components/DropdownUser";
import {
  FaStar,
  FaEnvelope,
  FaPhone,
  FaCommentDots,
  FaHeart,
  FaMapMarkerAlt,
} from "react-icons/fa";

export default function QuadraDetalhe() {
  const { state } = useLocation();
  const quadra = state?.quadra;

  const usuario_id = localStorage.getItem("usuario_id");

  if (!quadra) return <div className="p-4">Quadra não encontrada.</div>;

const handleFavoritar = async () => {
  const usuario_id = Number(localStorage.getItem("usuario_id"));

  if (!usuario_id || usuario_id === 0) {
    console.error("⚠️ ID de usuário inválido. Usuário está logado?");
    alert("Você precisa estar logado para favoritar quadras.");
    return;
  }

 try {
  console.log("🔎 Enviando dados:", {
  usuario_id,
  quadra_id: quadra.id,
  nome: quadra.nome,
  preco: quadra.preco,
  local: quadra.local,
  imagem_url: quadra.imagem_url,
  nota: quadra.avaliacao
});

  const resposta = await fetch("http://localhost:5000/api/favoritos", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      
      usuario_id,
      quadra_id: quadra.id,
      nome: quadra.nome,
      preco: quadra.preco.replace("R$", "").replace("/hora", "").trim(),
      local: quadra.local,
      imagem_url: quadra.imagem_url?.split("/").pop() || quadra.imagem?.split("/").pop() || "sem-imagem.png",
      nota: quadra.avaliacao || 4.5,
    }),
  });

  const data = await resposta.json();

  if (!resposta.ok) {
    console.error("❌ Erro ao favoritar:", data.erro);
    alert(`Erro: ${data.erro}`);
    return;
  }

  console.log("✅ Favoritado com sucesso:", data);
  alert("Quadra favoritada com sucesso!");

} catch (erro) {
  console.error("❌ Erro ao favoritar:", erro);

  if (erro instanceof Error) {
    alert(`Erro: ${erro.message}`);
  } else {
    alert("Erro inesperado ao favoritar.");
  }
};
}



  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-4 pl-[80px] md:pl-[100px] lg:pl-[120px]">
        {/* Breadcrumb */}
        <div className="flex items-center py-4 overflow-x-auto whitespace-nowrap">
          <Link to="/home" className="text-gray-600 flex items-center hover:underline">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
            </svg>
            Início
          </Link>
          <span className="mx-3 text-gray-400">/</span>
          <span className="text-blue-600 font-medium">Detalhes da quadra</span>
        </div>

        {/* Imagem da quadra */}
        <div className="relative">
        <img src={quadra.imagem} alt={quadra.nome} className="w-full h-72 object-cover rounded-lg" />


          <button
            onClick={handleFavoritar}
            className="absolute top-4 right-4 bg-white text-red-600 p-2 rounded-full shadow"
            title="Favoritar"
          >
            <FaHeart />
          </button>
        </div>

        {/* Dados principais */}
        <div className="mt-4">
          <h1 className="text-2xl font-bold">{quadra.nome}</h1>
          <div className="flex items-center text-yellow-500 gap-1 text-sm mt-1">
            <FaStar /> {quadra.avaliacao}
          </div>
          <p className="text-gray-600 flex items-center gap-1 mt-2 text-sm">
            <FaMapMarkerAlt /> {quadra.local}
          </p>
          <p className="text-gray-700 text-sm mt-1">{quadra.tipo}</p>
        </div>

        {/* Dono */}
        <div className="mt-6 border-t pt-4">
          <h2 className="font-semibold mb-2">Informações do Dono</h2>
          <div className="flex items-center gap-4">
          <img
  src={quadra.dono.foto}
  alt={quadra.dono.nome}
  className="w-14 h-14 rounded-full object-cover"
/>



            <div>
              <p className="font-medium">{quadra.dono.nome}</p>
              <p className="text-sm text-gray-600">{quadra.dono.email}</p>
              <p className="text-sm text-gray-600">{quadra.dono.telefone}</p>
            </div>
            <div className="ml-auto flex gap-3 text-green-700 text-xl">
              <a href={`mailto:${quadra.dono.email}`}><FaEnvelope /></a>
              <a href={`tel:${quadra.dono.telefone}`}><FaPhone /></a>
              <Link to="/chat"><FaCommentDots /></Link>
            </div>
          </div>
        </div>

        {/* Mapa */}
        <div className="mt-6">
          <h2 className="font-semibold mb-2">Localização</h2>
          <iframe
            title="Mapa da quadra"
            src={`https://www.google.com/maps?q=${encodeURIComponent(quadra.local)}&output=embed`}
            width="100%"
            height="280"
            className="rounded-lg"
            style={{ border: 0 }}
            loading="lazy"
            allowFullScreen
          ></iframe>
        </div>

        {/* Preço e botão */}
        <div className="mt-6 flex justify-between items-center">
          <p className="text-green-600 text-lg font-semibold">{quadra.preco}</p>
          <button className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition">
            Alugar
          </button>
        </div>
      </div>
    </div>
  );
}
