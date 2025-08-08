import React, { useState, useEffect } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import MobileNav from "../components/MobileNav";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { enviarNotificacao } from "../services/notificacoes";
import { api } from "../services/api";

import {
  FaStar,
  FaEnvelope,
  FaPhone,
  FaCommentDots,
  FaHeart,
  FaMapMarkerAlt,
} from "react-icons/fa";

export default function QuadraDetalhe() {
  const navigate = useNavigate();
  const [mostrarModal, setMostrarModal] = useState(false);
  const [dataAluguel, setDataAluguel] = useState("");
  const [horaInicio, setHoraInicio] = useState("");
  const [horaFim, setHoraFim] = useState("");
  const [valorTotal, setValorTotal] = useState("0.00");
  const [duracaoHoras, setDuracaoHoras] = useState(0);
  const [observacoes, setObservacoes] = useState("");

  const { state } = useLocation();
  const quadra = state?.quadra;
  const usuario_id = Number(localStorage.getItem("usuario_id"));

  if (!quadra) return <div className="p-4">Quadra não encontrada.</div>;

  const precoNumerico = () => {
    // aceita "R$ 100", "R$ 100 /hora", "100"
    const limpo = String(quadra.preco || "")
      .replace("R$", "")
      .replace("/hora", "")
      .replace(",", ".")
      .trim();
    const n = parseFloat(limpo);
    return isNaN(n) ? 0 : n;
  };

  useEffect(() => {
    if (!horaInicio || !horaFim) {
      setDuracaoHoras(0);
      setValorTotal("0.00");
      return;
    }

    const [h1, m1] = horaInicio.split(":").map(Number);
    const [h2, m2] = horaFim.split(":").map(Number);
    const inicio = h1 * 60 + m1;
    const fim = h2 * 60 + m2;

    if (fim > inicio) {
      const duracao = (fim - inicio) / 60;
      setDuracaoHoras(duracao);
      const total = duracao * precoNumerico();
      setValorTotal(total.toFixed(2));
    } else {
      setDuracaoHoras(0);
      setValorTotal("0.00");
    }
  }, [horaInicio, horaFim]);

  const handleFavoritar = async () => {
    const uid = Number(localStorage.getItem("usuario_id"));
    if (!uid) {
      alert("Você precisa estar logado para favoritar quadras.");
      return;
    }

    const dadosFavorito = {
      usuario_id: uid,
      quadra_id: quadra.id || quadra.quadra_id || 0,
      nome: quadra.nome,
      preco: precoNumerico(), // manda número
      local: quadra.local,
      imagem_url:
        quadra.imagem_url?.split("/").pop() ||
        quadra.imagem?.split("/").pop() ||
        "sem-imagem.png",
      nota: quadra.avaliacao || 4.5,
    };

    try {
      await api.post("/favoritos", dadosFavorito);
      toast.success("Quadra favoritada com sucesso!");

      // notificação
      await enviarNotificacao({
        usuario_id: uid,
        tipo: "favorito",
        mensagem: `Você favoritou a quadra ${quadra.nome}`,
      });

      // opcional: atualizar contador de não lidas (se tiver store global depois)
      await api.get(`/notificacoes/nao-lidas/${uid}`);
    } catch (erro) {
      console.error("Erro ao favoritar:", erro);
      const msg =
        erro?.response?.data?.erro || "Erro inesperado ao favoritar.";
      toast.error(msg);
    }
  };

  const confirmarAluguel = async () => {
    const uid = Number(localStorage.getItem("usuario_id"));
    if (!uid) {
      toast.error("Faça login para alugar.");
      return;
    }
    if (!dataAluguel || !horaInicio || !horaFim) {
      toast.error("Preencha data e horários.");
      return;
    }
    if (duracaoHoras <= 0) {
      toast.error("Horário inválido.");
      return;
    }

    try {
      await api.post("/alugueis", {
        quadra_id: quadra.id || quadra.quadra_id || 0,
        cliente_id: uid,
        data: dataAluguel,
        hora_inicio: horaInicio,
        hora_fim: horaFim,
        imagem_url: quadra.imagem?.split("/").pop() || "sem-imagem.png",
        nome: quadra.nome,
        valor_pago: Number(valorTotal),
        observacoes,
      });

      await enviarNotificacao({
        usuario_id: uid,
        tipo: "aluguel",
        mensagem: `Você alugou a quadra ${quadra.nome}`,
      });

      toast.success("Aluguel realizado com sucesso!");
      setMostrarModal(false);
    } catch (err) {
      console.error("❌ Erro ao salvar aluguel:", err);
      const msg =
        err?.response?.data?.erro || "Erro inesperado ao salvar aluguel.";
      toast.error(msg);
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-y-auto">
      {/* Fundo animado radial verde */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-green-400 via-green-700 to-green-900 animate-blob" />

      {/* Luz suave no fundo */}
      <div className="absolute top-[-100px] right-[-200px] w-[700px] h-[700px] bg-gradient-to-bl from-white/70 via-lime-200/40 to-transparent blur-[100px] opacity-70 z-10 pointer-events-none rounded-full rotate-[-25deg]" />

      {/* Partículas */}
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

      {/* Sidebar / MobileNav */}
      <div className="hidden md:block fixed top-0 left-0 h-full">
        <Sidebar />
      </div>
      <div className="md:hidden fixed bottom-14 left-0 w-full bg-[#14532d] p-4 flex justify-between items-center z-50 shadow-inner">
        <MobileNav />
      </div>

      <div className="relative z-30 max-w-3xl mx-auto px-4 pt-20 pb-28 md:pb-10">
        <div className="bg-white shadow-2xl rounded-3xl p-6 border border-gray-200">
          {/* Breadcrumb */}
          <div className="flex items-center py-4 overflow-x-auto whitespace-nowrap">
            <Link
              to="/home"
              className="text-gray-600 flex items-center hover:underline"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5 mr-1"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
              </svg>
              Início
            </Link>
            <span className="mx-3 text-gray-400">/</span>
            <span className="text-blue-600 font-medium">Detalhes da quadra</span>
          </div>

          {/* Capa e favoritar */}
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

          {/* Infos principais */}
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

          {/* Dono */}
          <div className="mt-6 border-t pt-4">
            <h2 className="text-lg font-semibold mb-2 text-gray-800">
              Dono da Quadra
            </h2>
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
                <a href={`mailto:${quadra.dono.email}`}>
                  <FaEnvelope />
                </a>
                <a href={`tel:${quadra.dono.telefone}`}>
                  <FaPhone />
                </a>
                <button
                  onClick={() => {
                    if (!quadra?.dono?.id) {
                      console.error("❌ ID do locador não encontrado:", quadra?.dono);
                      alert("Erro: ID do dono da quadra não encontrado.");
                      return;
                    }
                    navigate(`/chat?id=${quadra.dono.id}`);
                  }}
                  className="hover:text-green-900"
                  title="Conversar"
                >
                  <FaCommentDots />
                </button>
              </div>
            </div>
          </div>

          {/* Mapa */}
          <div className="mt-8">
            <div className="flex items-center gap-2 text-lg font-semibold text-gray-800 mb-3">
              <FaMapMarkerAlt className="text-red-500" />
              <span>Localização da Quadra</span>
            </div>

            <div className="rounded-2xl overflow-hidden backdrop-blur-md bg-white/30 shadow-xl ring-1 ring-white/20">
              <iframe
                title="Mapa da quadra"
                src={`https://www.google.com/maps?q=${encodeURIComponent(
                  quadra.local
                )}&output=embed`}
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

          {/* Preço + CTA */}
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

          {/* Botão principal */}
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

          {/* Modal */}
          {mostrarModal && (
            <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center px-4">
              <div className="bg-white rounded-2xl p-6 w-full max-w-md relative shadow-2xl animate-fade-in">
                <button
                  onClick={() => setMostrarModal(false)}
                  className="absolute top-2 right-3 text-gray-500 text-2xl font-bold hover:text-red-500 transition"
                >
                  &times;
                </button>

                <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
                  Agendar Quadra
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700">
                      Data
                    </label>
                    <input
                      type="date"
                      value={dataAluguel}
                      onChange={(e) => setDataAluguel(e.target.value)}
                      className="w-full border rounded-lg px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-green-400"
                    />
                  </div>

                  <div className="flex gap-3">
                    <div className="w-1/2">
                      <label className="block text-sm font-semibold text-gray-700">
                        Hora início
                      </label>
                      <input
                        type="time"
                        value={horaInicio}
                        onChange={(e) => setHoraInicio(e.target.value)}
                        className="w-full border rounded-lg px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-green-400"
                      />
                    </div>
                    <div className="w-1/2">
                      <label className="block text-sm font-semibold text-gray-700">
                        Hora fim
                      </label>
                      <input
                        type="time"
                        value={horaFim}
                        onChange={(e) => setHoraFim(e.target.value)}
                        className="w-full border rounded-lg px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-green-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700">
                      Observações
                    </label>
                    <textarea
                      placeholder="Ex: Levar bola, jogo amistoso..."
                      value={observacoes}
                      onChange={(e) => setObservacoes(e.target.value)}
                      className="w-full border rounded-lg px-3 py-2 mt-1 h-20 resize-none focus:outline-none focus:ring-2 focus:ring-green-400"
                    />
                  </div>

                  {duracaoHoras > 0 && (
                    <div className="text-center mt-2 bg-green-50 border border-green-300 rounded-xl px-4 py-2">
                      <p className="text-sm text-gray-600">
                        Duração:{" "}
                        <span className="font-semibold">{duracaoHoras} hora(s)</span>
                      </p>
                      <p className="text-md font-bold text-green-700">
                        Total a pagar: R$ {valorTotal}
                      </p>
                    </div>
                  )}

                  <button
                    onClick={confirmarAluguel}
                    className="w-full bg-green-600 text-white font-semibold py-2 rounded-lg shadow hover:bg-green-700 transform active:scale-95 transition-all duration-200"
                  >
                    Confirmar Aluguel
                  </button>
                </div>
              </div>
            </div>
          )}
          {/* fim modal */}
        </div>
      </div>
    </div>
  );
}
