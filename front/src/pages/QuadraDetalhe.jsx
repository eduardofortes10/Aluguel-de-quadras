// src/pages/QuadraDetalhe.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams, Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import MobileNav from "../components/MobileNav";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { enviarNotificacao } from "../services/notificacoes";
import { api, fileURL } from "../services/api";
import { quadras as DATA_Q, quadrasCarrossel as DATA_CAR } from "../data/quadras";
import { FaStar, FaEnvelope, FaPhone, FaCommentDots, FaHeart, FaMapMarkerAlt } from "react-icons/fa";

// 🔐 Helper: resolve o ID do usuário logado a partir de várias fontes
async function getUsuarioIdSeguro() {
  try {
    const raw = localStorage.getItem("usuario");
    if (raw) {
      const u = JSON.parse(raw);
      if (u?.id) return Number(u.id);
      if (u?.usuario_id) return Number(u.usuario_id);
    }
    const uidStr = localStorage.getItem("usuario_id");
    if (uidStr && /^\d+$/.test(uidStr)) return Number(uidStr);

    try {
      const { data } = await api.get("/auth/me"); // se existir
      if (data?.id) return Number(data.id);
      if (data?.usuario_id) return Number(data.usuario_id);
    } catch {
      const uid = parseInt(localStorage.getItem("usuario_id") || "", 10);
      if (!isNaN(uid) && uid > 0) return uid;
    }
  } catch (e) {
    console.warn("Falha ao resolver usuario_id:", e);
  }
  return null;
}

function precoToNumber(v) {
  if (typeof v === "number") return v;
  const limpo = String(v || "")
    .replace(/[R$\s]/g, "")
    .replace("/hora", "")
    .replace(/\./g, "")
    .replace(",", ".")
    .trim();
  const n = parseFloat(limpo);
  return Number.isFinite(n) ? n : 0;
}

function resolveImagemCapa(q) {
  // 1) data local
  if (q?.imagem) return q.imagem;

  // 2) banco: primeira válida do array 'imagens'
  const list = Array.isArray(q?.imagens) ? q.imagens : [];
  for (let c of list) {
    if (!c) continue;
    const s = String(c).trim().replace(/\\/g, "/");
    if (/^https?:\/\//i.test(s)) return s;       // URL absoluta
    if (s.includes("/uploads/") || s.startsWith("/")) return fileURL(s);
    return `/quadras/${s}`;                       // se veio algo tipo "quadra1.png"
  }

  // 3) fallback
  return "/quadras/quadra1.png";
}

export default function QuadraDetalhe() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { state } = useLocation();

  const [quadra, setQuadra] = useState(state?.quadra || null);
  const [carregando, setCarregando] = useState(!state?.quadra);

  const [mostrarModal, setMostrarModal] = useState(false);
  const [dataAluguel, setDataAluguel] = useState("");
  const [horaInicio, setHoraInicio] = useState("");
  const [horaFim, setHoraFim] = useState("");
  const [valorTotal, setValorTotal] = useState("0.00");
  const [duracaoHoras, setDuracaoHoras] = useState(0);
  const [observacoes, setObservacoes] = useState("");

  // Carrega quadra se entrou direto pela URL
  useEffect(() => {
    let cancel = false;
    if (state?.quadra) return; // já temos pelos resultados (data local)

    async function carregar() {
      try {
        setCarregando(true);
        const idNum = Number(id);

        // 1) tenta achar no data local
        if (Number.isFinite(idNum)) {
          const local = [...DATA_CAR, ...DATA_Q].find((q) => Number(q.id) === idNum);
          if (local) {
            if (!cancel) setQuadra(local);
            return;
          }
        }

        // 2) fallback: busca no backend
        if (Number.isFinite(Number(id))) {
          const { data } = await api.get(`/quadras/${id}`);
          if (!cancel) setQuadra(data);
        }
      } catch (e) {
        console.error("Erro ao carregar quadra:", e);
        if (!cancel) setQuadra(null);
      } finally {
        if (!cancel) setCarregando(false);
      }
    }

    carregar();
    return () => { cancel = true; };
  }, [id, state?.quadra]);

  const capaUrl = useMemo(() => resolveImagemCapa(quadra), [quadra]);
  const precoBase = useMemo(() => precoToNumber(quadra?.preco), [quadra]);
  const precoDisplay = useMemo(() => {
    if (typeof quadra?.preco === "string") return quadra.preco;
    if (Number.isFinite(precoBase)) return precoBase.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }) + " /hora";
    return "R$ 0,00 /hora";
  }, [quadra, precoBase]);

  // Recalcula total quando horários mudam
  useEffect(() => {
    if (!horaInicio || !horaFim || !precoBase) {
      setDuracaoHoras(0);
      setValorTotal("0.00");
      return;
    }
    const [h1, m1] = horaInicio.split(":").map(Number);
    const [h2, m2] = horaFim.split(":").map(Number);
    const ini = h1 * 60 + m1;
    const fim = h2 * 60 + m2;
    if (fim > ini) {
      const dur = (fim - ini) / 60;
      setDuracaoHoras(dur);
      setValorTotal((dur * precoBase).toFixed(2));
    } else {
      setDuracaoHoras(0);
      setValorTotal("0.00");
    }
  }, [horaInicio, horaFim, precoBase]);

  const handleFavoritar = async () => {
    const uid = await getUsuarioIdSeguro();
    if (!uid) {
      toast.error("Faça login para favoritar.");
      return;
    }

    const imgName =
      quadra?.imagem_url?.split("/").pop() ||
      quadra?.imagem?.split("/").pop() ||
      "sem-imagem.png";

    const dadosFavorito = {
      usuario_id: uid,
      quadra_id: quadra?.id || quadra?.quadra_id || 0,
      nome: quadra?.nome,
      preco: precoBase || 0,
      local: quadra?.local,
      imagem_url: imgName,
      nota: quadra?.avaliacao || quadra?.nota || 4.5,
    };

    try {
      await api.post("/favoritos", dadosFavorito);
      toast.success("Quadra favoritada com sucesso!");
      await enviarNotificacao({
        usuario_id: uid,
        tipo: "favorito",
        mensagem: `Você favoritou a quadra ${quadra?.nome}`,
      });
    } catch (erro) {
      console.error("Erro ao favoritar:", erro);
      const msg = erro?.response?.data?.erro || "Erro inesperado ao favoritar.";
      toast.error(msg);
    }
  };

  const confirmarAluguel = async () => {
    const uid = await getUsuarioIdSeguro();
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
      const imgName = quadra?.imagem?.split("/").pop() || "sem-imagem.png";
      await api.post("/alugueis", {
        quadra_id: quadra?.id || quadra?.quadra_id || 0,
        cliente_id: uid,
        data: dataAluguel,
        hora_inicio: horaInicio,
        hora_fim: horaFim,
        imagem_url: imgName,
        nome: quadra?.nome,
        valor_pago: Number(valorTotal),
        observacoes,
      });

      await enviarNotificacao({
        usuario_id: uid,
        tipo: "aluguel",
        mensagem: `Você alugou a quadra ${quadra?.nome}`,
      });

      toast.success("Aluguel realizado com sucesso!");
      setMostrarModal(false);
    } catch (err) {
      console.error("❌ Erro ao salvar aluguel:", err);
      const msg = err?.response?.data?.erro || "Erro inesperado ao salvar aluguel.";
      toast.error(msg);
    }
  };

  if (carregando) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-pulse text-gray-600">Carregando detalhes…</div>
      </div>
    );
  }

  if (!quadra) {
    return (
      <div className="p-6">
        <p className="text-gray-700">Quadra não encontrada.</p>
        <button onClick={() => navigate(-1)} className="mt-3 text-green-700 underline">
          Voltar
        </button>
      </div>
    );
  }

  const dono = quadra?.dono || null; // data local tem 'dono'; banco geralmente não

  return (
    <div className="relative min-h-screen w-full overflow-y-auto">
      {/* Fundo decorativo */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-green-400 via-green-700 to-green-900" />
      <div className="absolute top-[-100px] right-[-200px] w-[700px] h-[700px] bg-gradient-to-bl from-white/70 via-lime-200/40 to-transparent blur-[100px] opacity-70 z-10 pointer-events-none rounded-full rotate-[-25deg]" />

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
            <Link to="/home" className="text-gray-600 flex items-center hover:underline">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001-1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
              </svg>
              Início
            </Link>
            <span className="mx-3 text-gray-400">/</span>
            <span className="text-blue-600 font-medium">Detalhes da quadra</span>
          </div>

          {/* Capa e favoritar */}
          <div className="relative">
            <img
              src={capaUrl}
              alt={quadra.nome}
              className="w-full h-56 md:h-64 object-cover rounded-2xl hover:scale-105 transition-transform duration-500"
              onError={(e) => (e.currentTarget.src = "/quadras/quadra1.png")}
            />
            <button
              onClick={handleFavoritar}
              className="absolute top-4 right-4 bg-white text-red-600 p-2 rounded-full shadow hover:ring-2 hover:ring-red-300 transition transform active:scale-110"
              title="Favoritar"
            >
              <FaHeart className="w-5 h-5" />
            </button>
          </div>

          {/* Infos principais */}
          <div className="mt-4">
            <h1 className="text-3xl font-bold text-gray-800">{quadra.nome}</h1>
            <div className="flex items-center gap-2 mt-2 text-sm bg-yellow-100 text-yellow-700 px-2 py-1 rounded w-max">
              <FaStar /> {Number(quadra.avaliacao ?? quadra.nota ?? 0).toFixed(1)}
            </div>
            <p className="text-gray-600 flex items-center gap-1 mt-2 text-sm">
              <FaMapMarkerAlt /> {quadra.local}
            </p>
            <p className="text-gray-700 text-sm mt-1">{quadra.tipo}</p>
          </div>

          {/* Dono */}
          <div className="mt-6 border-t pt-4">
            <h2 className="text-lg font-semibold mb-2 text-gray-800">Dono da Quadra</h2>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-gray-50 p-4 rounded-xl shadow-sm">
              {dono?.foto ? (
                <img src={dono.foto} alt={dono.nome || "Dono"} className="w-14 h-14 rounded-full object-cover" />
              ) : (
                <div className="w-14 h-14 rounded-full bg-gray-300" />
              )}
              <div>
                <p className="font-medium">{dono?.nome || "Locador"}</p>
                {dono?.email && <p className="text-sm text-gray-600">{dono.email}</p>}
                {dono?.telefone && <p className="text-sm text-gray-600">{dono.telefone}</p>}
              </div>
              <div className="ml-auto flex gap-3 text-green-700 text-xl">
                {dono?.email && (
                  <a href={`mailto:${dono.email}`} title="E-mail"><FaEnvelope /></a>
                )}
                {dono?.telefone && (
                  <a href={`tel:${dono.telefone}`} title="Telefone"><FaPhone /></a>
                )}
                {dono?.id ? (
                  <button
                    onClick={() => navigate(`/chat?id=${dono.id}`)}
                    className="hover:text-green-900"
                    title="Conversar"
                  >
                    <FaCommentDots />
                  </button>
                ) : (
                  <button
                    className="opacity-50 cursor-not-allowed"
                    title="Chat indisponível"
                    disabled
                  >
                    <FaCommentDots />
                  </button>
                )}
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
                src={`https://www.google.com/maps?q=${encodeURIComponent(quadra.local || "")}&output=embed`}
                width="100%"
                height="280"
                className="rounded-2xl"
                style={{ border: 0 }}
                loading="lazy"
                allowFullScreen
              />
            </div>

            <p className="mt-2 text-center text-sm text-gray-600 italic">
              {quadra.local}
            </p>
          </div>

          {/* Preço + CTA */}
          <div className="mt-6 text-center">
            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full font-bold text-sm">
              {precoDisplay}
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
            <button
              onClick={() => setMostrarModal(true)}
              className="w-full bg-green-600 text-white mt-2 py-2 rounded hover:bg-green-700 transition"
            >
              Alugar agora
            </button>
          </div>

          {/* Modal */}
          {mostrarModal && (
            <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center px-4">
              <div className="bg-white rounded-2xl p-6 w-full max-w-md relative shadow-2xl">
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
                    <label className="block text-sm font-semibold text-gray-700">Data</label>
                    <input
                      type="date"
                      value={dataAluguel}
                      onChange={(e) => setDataAluguel(e.target.value)}
                      className="w-full border rounded-lg px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-green-400"
                    />
                  </div>

                  <div className="flex gap-3">
                    <div className="w-1/2">
                      <label className="block text-sm font-semibold text-gray-700">Hora início</label>
                      <input
                        type="time"
                        value={horaInicio}
                        onChange={(e) => setHoraInicio(e.target.value)}
                        className="w-full border rounded-lg px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-green-400"
                      />
                    </div>
                    <div className="w-1/2">
                      <label className="block text-sm font-semibold text-gray-700">Hora fim</label>
                      <input
                        type="time"
                        value={horaFim}
                        onChange={(e) => setHoraFim(e.target.value)}
                        className="w-full border rounded-lg px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-green-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700">Observações</label>
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
                        Duração: <span className="font-semibold">{duracaoHoras} hora(s)</span>
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
