import React from "react";
import { useLocation, Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import UserDropdown from "../components/DropdownUser";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { enviarNotificacao } from "../services/notificacoes";
import { useState } from "react";


import {
  FaStar,
  FaEnvelope,
  FaPhone,
  FaCommentDots,
  FaHeart,
  FaMapMarkerAlt,
} from "react-icons/fa";
import MobileNav from "../components/MobileNav";

export default function QuadraDetalhe() {
  const [mostrarModal, setMostrarModal] = useState(false);
  const [dataAluguel, setDataAluguel] = useState("");
  const [horaInicio, setHoraInicio] = useState("");
  const [horaFim, setHoraFim] = useState("");
  const { state } = useLocation();
  const quadra = state?.quadra;
  const usuario_id = localStorage.getItem("usuario_id");

  if (!quadra) return <div className="p-4">Quadra não encontrada.</div>;


  const handleFavoritar = async () => {
  const usuario_id = Number(localStorage.getItem("usuario_id"));
  if (!usuario_id || usuario_id === 0) {
    alert("Você precisa estar logado para favoritar quadras.");
    return;
  }

  const dadosFavorito = {
    usuario_id,
    quadra_id: quadra.id || quadra.quadra_id || 0,
    nome: quadra.nome,
    preco: quadra.preco.replace("R$", "").replace("/hora", "").trim(),
    local: quadra.local,
    imagem_url: quadra.imagem_url?.split("/").pop() || quadra.imagem?.split("/").pop() || "sem-imagem.png",
    nota: quadra.avaliacao || 4.5,
  };

  console.log("📦 Enviando favorito:", dadosFavorito);

  try {
    const resposta = await fetch("http://localhost:5000/api/favoritos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dadosFavorito),
    });
    const data = await resposta.json();
    if (!resposta.ok) {
      toast.error(`Erro: ${data.erro}`);
      return;
    }

    toast.success("Quadra favoritada com sucesso!");

      // 🔔 Enviar notificação
    await enviarNotificacao({
      usuario_id,
      tipo: "favorito",
      mensagem: `Você favoritou a quadra ${quadra.nome}`,
    });

    // ✅ Fechando o primeiro try
  } catch (erro) {
    alert("Erro inesperado ao favoritar.");
    return;
  }

  // Atualizar contador de notificações não lidas
  try {
    const res = await fetch(`http://localhost:5000/api/notificacoes/nao-lidas/${usuario_id}`);
    const dados = await res.json();
    console.log("🔄 Atualizando contador de notificações:", dados.total);
    // Aqui você pode usar Context ou estado global depois
  } catch (err) {
    console.error("❌ Erro ao atualizar contador de notificações:", err);
  }
};



  return (
    <div className="relative min-h-screen w-full overflow-y-auto">
  {/* Fundo animado radial verde */}
  <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-green-400 via-green-700 to-green-900 animate-blob" />

  {/* Luz suave no fundo */}
  <div className="absolute top-[-100px] right-[-200px] w-[700px] h-[700px] bg-gradient-to-bl from-white/70 via-lime-200/40 to-transparent blur-[100px] opacity-70 z-10 pointer-events-none rounded-full rotate-[-25deg]" />

  {/* Partículas flutuantes */}
  <div className="absolute inset-0 z-20 pointer-events-none">
    {[...Array(60)].map((_, i) => (
      <div
        key={i}
        className="particle"
        style={{
          top: `${Math.random() * 100}%`,
          left: `${Math.random() * 100}%`,
          animationDelay: `${Math.random() * 10}s`,
          animationDuration: `${10 + Math.random() * 10}s`,
        }}
      />
    ))}
  </div>
      <div className="hidden md:block fixed top-0 left-0 h-full">
        <Sidebar />
      </div>
      <div className="md:hidden fixed bottom-14 left-0 w-full bg-[#14532d] p-4 flex justify-between items-center z-50 shadow-inner">
        <MobileNav />
      </div>
    <div className="relative z-30 max-w-3xl mx-auto px-4 pt-20 pb-28 md:pb-10">

        <div className="bg-white shadow-2xl rounded-3xl p-6 border border-gray-200">
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

          <div className="relative">
            <img
              src={quadra.imagem}
              alt={quadra.nome}
              className="w-full h-56 md:h-64 object-cover rounded-2xl hover:scale-105 transition-transform duration-500"
            />
            <button
  onClick={handleFavoritar}
  className="absolute top-4 right-4 bg-white text-red-600 p-2 rounded-full shadow hover:ring-2 hover:ring-red-300 transition transform active:scale-110 animate-pulse"
  title="Favoritar"
>
  <FaHeart className="w-5 h-5" />
</button>

          </div>

          <div className="mt-4">
            <h1 className="text-3xl font-bold text-gray-800">{quadra.nome}</h1>
            <div className="flex items-center gap-2 mt-2 text-sm bg-yellow-100 text-yellow-700 px-2 py-1 rounded w-max">
              <FaStar /> {quadra.avaliacao}
            </div>
            <p className="text-gray-600 flex items-center gap-1 mt-2 text-sm">
              <FaMapMarkerAlt /> {quadra.local}
            </p>
            <p className="text-gray-700 text-sm mt-1">{quadra.tipo}</p>
          </div>

          <div className="mt-6 border-t pt-4">
            <h2 className="text-lg font-semibold mb-2 text-gray-800">Dono da Quadra</h2>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-gray-50 p-4 rounded-xl shadow-sm">
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
                <Link to="/chat" title="Conversar" className="hover:text-green-900"><FaCommentDots /></Link>
              </div>
            </div>
          </div>

          <div className="mt-8">
  <div className="flex items-center gap-2 text-lg font-semibold text-gray-800 mb-3">
    <FaMapMarkerAlt className="text-red-500" />
    <span>Localização da Quadra</span>
  </div>

  <div className="rounded-2xl overflow-hidden backdrop-blur-md bg-white/30 shadow-xl ring-1 ring-white/20">
    <iframe
      title="Mapa da quadra"
      src={`https://www.google.com/maps?q=${encodeURIComponent(quadra.local)}&output=embed`}
      width="100%"
      height="280"
      className="rounded-2xl"
      style={{ border: 0 }}
      loading="lazy"
      allowFullScreen
    ></iframe>
  </div>

  <p className="mt-2 text-center text-sm text-gray-600 italic">
    {quadra.local}
  </p>
</div>


          <div className="mt-6 text-center">
            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full font-bold text-sm">
              {quadra.preco}
            </span>
 
         </div>
<ToastContainer
  position="top-center"
  autoClose={2500}
  hideProgressBar={false}
  newestOnTop={false}
  closeOnClick
  pauseOnHover
  theme="colored"
/>
{/* Botão de ação principal */}
<div className="mt-6 text-center">
  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full font-bold text-sm">
    {quadra.preco}
  </span>
  <button
    onClick={() => setMostrarModal(true)}
    className="w-full bg-green-600 text-white mt-4 py-2 rounded hover:bg-green-700 transition"
  >
    Alugar agora
  </button>
</div>

{/* Modal de agendamento */}
{mostrarModal && (
  <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center px-4">
    <div className="bg-white rounded-lg p-6 w-full max-w-md relative shadow-lg">
      <button
        onClick={() => setMostrarModal(false)}
        className="absolute top-2 right-3 text-gray-500 text-2xl font-bold"
      >
        &times;
      </button>
      <h2 className="text-xl font-semibold mb-4">Agendar Quadra</h2>

      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-gray-700">Data</label>
          <input
            type="date"
            value={dataAluguel}
            onChange={(e) => setDataAluguel(e.target.value)}
            className="w-full border rounded px-3 py-2 mt-1"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Hora de início</label>
          <input
            type="time"
            value={horaInicio}
            onChange={(e) => setHoraInicio(e.target.value)}
            className="w-full border rounded px-3 py-2 mt-1"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Hora de fim</label>
          <input
            type="time"
            value={horaFim}
            onChange={(e) => setHoraFim(e.target.value)}
            className="w-full border rounded px-3 py-2 mt-1"
          />
        </div>
<button
  onClick={async () => {
    console.log("🟢 Enviando aluguel com quadra_id:", quadra.id, "ou", quadra.quadra_id);
    const usuario_id = Number(localStorage.getItem("usuario_id"));

    // 1. Salvar no banco de dados
    try {
    const data_hora = `${dataAluguel} ${horaInicio}`; // Combina data e hora

const resposta =await fetch("http://localhost:5000/api/alugueis", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
  quadra_id: quadra.id || quadra.quadra_id || 0,
  cliente_id: usuario_id,
  data: dataAluguel,
  hora_inicio: horaInicio,
  hora_fim: horaFim,
  imagem_url: quadra.imagem?.split("/").pop() || "sem-imagem.png", // 🔥 ESSENCIAL!
  nome: quadra.nome, // também útil
}),

});

      if (!resposta.ok) {
        const erro = await resposta.json();
        toast.error(`Erro ao alugar: ${erro.erro}`);
        return;
      }
    } catch (err) {
      console.error("❌ Erro ao salvar aluguel:", err);
      toast.error("Erro inesperado ao salvar aluguel.");
      return;
    }

    // 2. Enviar notificação
    await enviarNotificacao({
      usuario_id,
      tipo: "aluguel",
      mensagem: `Você alugou a quadra ${quadra.nome}`,
    });

    toast.success("Aluguel realizado com sucesso!");
    setMostrarModal(false);
  }}
  className="w-full bg-green-600 text-white mt-4 py-2 rounded hover:bg-green-700 transition"
>
  Confirmar Aluguel
</button>

      </div>
    </div>
  </div>
)}

        </div>

      </div>
    </div>
  );
}
