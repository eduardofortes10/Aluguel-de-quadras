// src/pages/Chat.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import MobileNav from "../components/MobileNav";
import { FaEllipsisV, FaTrash } from "react-icons/fa";
import toast from "react-hot-toast";
import { api } from "../services/api";
import MessageBubble from "../components/MessageBubble";

/* ===== Helpers ===== */
function getUsuarioLocal() {
  try {
    const raw = localStorage.getItem("usuario");
    if (!raw) return { id: null, tipo: null };
    const u = JSON.parse(raw);
    const id = u?.id ?? u?.usuario_id ?? null;
    const tipo = u?.tipo || u?.tipo_usuario || null;
    return { id: id ? Number(id) : null, tipo };
  } catch {
    return { id: null, tipo: null };
  }
}
function normalizarNumero(v) {
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}
// Trata 404 como “sem dados”
async function safeGet(url, fallback = []) {
  try {
    const { data } = await api.get(url);
    return data ?? fallback;
  } catch (err) {
    if (err?.response?.status === 404) return fallback;
    throw err;
  }
}

/* ===== Página ===== */
export default function Chat() {
  const navigate = useNavigate();
  const [params] = useSearchParams();

  // Usuário atual
  const { id: meId, tipo: meTipo } = getUsuarioLocal();

  // Redireciona sem login
  useEffect(() => {
    if (!meId) {
      toast.error("Faça login para usar o chat.");
      navigate("/login", { replace: true });
    }
  }, [meId, navigate]);

  // Estado principal
  const [conversas, setConversas] = useState([]);
  const [conversaAtiva, setConversaAtiva] = useState(null); // objeto retornado pelo back
  const [mensagens, setMensagens] = useState([]);
  const [novaMensagem, setNovaMensagem] = useState("");
  const [filtro, setFiltro] = useState("");
  const [menuAbertoId, setMenuAbertoId] = useState(null);

  // Responsivo
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Refs
  const mensagensRef = useRef(null);
  const pollRef = useRef(null);
  const carregandoConversasRef = useRef(false);
  const carregandoMensagensRef = useRef(false);

  // Param ?id= (alvo com quem queremos conversar)
  const alvoId = useMemo(() => normalizarNumero(params.get("id")), [params]);

  // Scroll pro fim quando mensagens mudarem
  useEffect(() => {
    if (mensagensRef.current) {
      mensagensRef.current.scrollTop = mensagensRef.current.scrollHeight;
    }
  }, [mensagens]);

  /* ===== API ===== */
  const carregarConversas = async () => {
    if (!meId || carregandoConversasRef.current) return;
    try {
      carregandoConversasRef.current = true;
      const data = await safeGet(`/conversas/ultimas/${meId}`, []);
      setConversas(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Erro ao carregar conversas:", err?.response?.data || err?.message);
      // opcional: toast.error("Não foi possível carregar suas conversas.");
    } finally {
      carregandoConversasRef.current = false;
    }
  };

  const marcarComoLidas = async (conversaId) => {
    if (!meId || !conversaId) return;
    try {
      await api.patch(`/conversas/mensagens/ler/${conversaId}`, { usuario_id: meId });
    } catch (err) {
      // não quebra UX
      console.warn("Não foi possível marcar como lidas:", err?.response?.data || err?.message);
    }
  };

  const carregarMensagens = async (conversaId) => {
    if (!conversaId || carregandoMensagensRef.current) return;
    try {
      carregandoMensagensRef.current = true;
      const data = await safeGet(`/conversas/mensagens/${conversaId}`, []);
      setMensagens(Array.isArray(data) ? data : []);
      await marcarComoLidas(conversaId);
    } catch (err) {
      console.error("Erro ao carregar mensagens:", err?.response?.data || err?.message);
    } finally {
      carregandoMensagensRef.current = false;
    }
  };

  // Garante uma conversa com o alvo (?id=...) sem duplicar
  const garantirConversaComAlvo = async (alvo) => {
    if (!meId || !alvo) return;

    const euSouLocador = (meTipo || "").toLowerCase() === "locador";
    const cliente_id = euSouLocador ? alvo : meId;
    const locador_id = euSouLocador ? meId : alvo;

    // lista pode dar 404 -> receber []
    const lista = await safeGet(`/conversas/ultimas/${meId}`, []);
    const existente =
      (lista || []).find(
        (c) =>
          (Number(c.cliente_id) === Number(cliente_id) &&
            Number(c.locador_id) === Number(locador_id)) ||
          (Number(c.cliente_id) === Number(locador_id) &&
            Number(c.locador_id) === Number(cliente_id))
      ) || null;

    if (!existente) {
      try {
        await api.post("/conversas", {
          cliente_id,
          locador_id,
          autor_id: meId,
          mensagem: "Olá, gostaria de saber mais sobre o aluguel.",
        });
      } catch (err) {
        // se o back responder 409 (já existe), ignorar
        if (err?.response?.status !== 409) throw err;
      }
    }

    await carregarConversas();
    const lista2 = await safeGet(`/conversas/ultimas/${meId}`, []);
    const conv =
      (lista2 || []).find(
        (c) =>
          (Number(c.cliente_id) === Number(cliente_id) &&
            Number(c.locador_id) === Number(locador_id)) ||
          (Number(c.cliente_id) === Number(locador_id) &&
            Number(c.locador_id) === Number(cliente_id))
      ) || null;

    if (conv) {
      setConversaAtiva(conv);
      await carregarMensagens(conv.conversa_id);
    }
  };

  /* ===== Efeitos ===== */
  useEffect(() => {
    if (!meId) return;
    carregarConversas();
  }, [meId]);

  useEffect(() => {
    if (!meId || !alvoId) return;
    garantirConversaComAlvo(alvoId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [meId, alvoId]);

  useEffect(() => {
    if (conversaAtiva?.conversa_id) {
      carregarMensagens(conversaAtiva.conversa_id);
    }
  }, [conversaAtiva]);

  // Polling leve (apenas quando há conversa ativa)
  useEffect(() => {
    if (!conversaAtiva?.conversa_id) return;
    if (pollRef.current) clearInterval(pollRef.current);
    pollRef.current = setInterval(async () => {
      await carregarMensagens(conversaAtiva.conversa_id);
      await carregarConversas();
    }, 6000);
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversaAtiva?.conversa_id]);

  /* ===== Ações ===== */
  const enviarMensagem = async () => {
    const texto = (novaMensagem || "").trim();
    if (!texto || !conversaAtiva) return;

    const euSouLocador = (meTipo || "").toLowerCase() === "locador";
    const cliente_id = euSouLocador ? conversaAtiva.cliente_id : meId;
    const locador_id = euSouLocador ? meId : conversaAtiva.locador_id;

    try {
      await api.post("/conversas", {
        cliente_id,
        locador_id,
        autor_id: meId,
        mensagem: texto,
      });
      setNovaMensagem("");
      await carregarMensagens(conversaAtiva.conversa_id);
      await carregarConversas();
    } catch (err) {
      console.error("Erro ao enviar mensagem:", err?.response?.data || err?.message);
      toast.error("Não foi possível enviar sua mensagem.");
    }
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      enviarMensagem();
    }
  };

  const excluirConversa = async (conversaId) => {
    try {
      await api.delete(`/conversas/${conversaId}`);
      toast.success("Conversa excluída com sucesso");
      if (conversaAtiva?.conversa_id === conversaId) {
        setConversaAtiva(null);
        setMensagens([]);
      }
      carregarConversas();
    } catch (err) {
      toast.error("Erro ao excluir conversa");
    }
  };

  const excluirMensagem = async (id) => {
    toast(
      (t) => (
        <div className="text-sm text-gray-800">
          <p>Tem certeza que deseja excluir esta mensagem?</p>
          <div className="flex justify-end gap-2 mt-2">
            <button
              onClick={async () => {
                try {
                  await api.delete(`/conversas/mensagens/${id}`);
                  toast.dismiss(t.id);
                  toast.success("Mensagem excluída com sucesso!");
                  if (conversaAtiva) carregarMensagens(conversaAtiva.conversa_id);
                } catch (err) {
                  toast.error("Erro ao excluir a mensagem.");
                }
              }}
              className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-xs"
            >
              Excluir
            </button>
            <button
              onClick={() => toast.dismiss(t.id)}
              className="px-3 py-1 border border-gray-300 rounded text-xs"
            >
              Cancelar
            </button>
          </div>
        </div>
      ),
      { duration: 999999 }
    );
  };

  /* ===== Formatação e filtros ===== */
  const formatarHora = (iso) => {
    try {
      const d = new Date(iso);
      return new Intl.DateTimeFormat("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
        timeZone: "America/Sao_Paulo",
      }).format(d);
    } catch {
      return "—";
    }
  };
  const formatarDataMensagem = (iso) => {
    const data = new Date(iso);
    const hoje = new Date();
    const ontem = new Date();
    ontem.setDate(hoje.getDate() - 1);
    if (data.toDateString() === hoje.toDateString()) return "Hoje";
    if (data.toDateString() === ontem.toDateString()) return "Ontem";
    return data.toLocaleDateString("pt-BR");
  };

  const conversasFiltradas = useMemo(() => {
    const f = (filtro || "").toLowerCase();
    return conversas.filter((c) => (c?.nome || "").toLowerCase().includes(f));
  }, [conversas, filtro]);

  // última mensagem enviada por mim (para exibir “visto”)
  const lastOwnMsgId = useMemo(() => {
    if (!Array.isArray(mensagens) || !meId) return null;
    for (let i = mensagens.length - 1; i >= 0; i--) {
      if (Number(mensagens[i]?.autor_id) === Number(meId)) return mensagens[i]?.id;
    }
    return null;
  }, [mensagens, meId]);

  if (!meId) return null;

  /* ===== UI ===== */
  return (
    <div className="flex bg-gray-100 min-h-screen pb-16 md:pb-0">
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* mobile nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50">
        <MobileNav />
      </div>

      <div className="flex-1 md:ml-64 flex flex-col md:flex-row">
        {/* Lista de conversas */}
        {!conversaAtiva || !isMobile ? (
          <div className="w-full md:w-1/3 border-r bg-white p-4 overflow-y-auto max-h[calc(100dvh-80px)]">
            <h2 className="text-lg font-semibold mb-4">Conversas</h2>

            <input
              type="text"
              placeholder="Buscar por nome..."
              value={filtro}
              onChange={(e) => setFiltro(e.target.value)}
              className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
            />

            {conversasFiltradas.map((c) => (
              <div
                key={c.conversa_id}
                className={`group relative block w-full text-left px-4 py-3 rounded-lg mb-3 shadow-sm transition cursor-pointer ${
                  conversaAtiva?.conversa_id === c.conversa_id
                    ? "bg-green-100 font-bold border-l-4 border-green-600"
                    : "hover:bg-gray-50"
                }`}
                onClick={() => {
                  setConversaAtiva(c);
                  carregarMensagens(c.conversa_id);
                }}
              >
                <div className="flex justify-between items-center">
                  <div className="min-w-0">
                    <div className="font-medium text-gray-800 truncate">{c.nome}</div>
                    <p className="text-sm text-gray-500 truncate">
                      {c.ultima_mensagem || "—"}
                      {c.data_envio && (
                        <span className="ml-2 text-xs text-gray-400">
                          {formatarHora(c.data_envio)}
                        </span>
                      )}
                    </p>
                  </div>
                  <div className="relative">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setMenuAbertoId(menuAbertoId === c.conversa_id ? null : c.conversa_id);
                      }}
                      className="text-gray-600 hover:text-gray-900 p-2 rounded-full"
                      title="Mais ações"
                    >
                      <FaEllipsisV />
                    </button>

                    {menuAbertoId === c.conversa_id && (
                      <div
                        onClick={(e) => e.stopPropagation()}
                        className="absolute right-0 mt-2 w-40 bg-white border rounded-md shadow-lg z-20"
                      >
                        <button
                          onClick={() => excluirConversa(c.conversa_id)}
                          className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                        >
                          Excluir conversa
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {conversasFiltradas.length === 0 && (
              <p className="text-gray-500">Nenhuma conversa encontrada.</p>
            )}
          </div>
        ) : null}

        {/* Área da conversa */}
        <div className="flex-1 flex flex-col bg-white h-screen md:h-auto overflow-hidden">
          {conversaAtiva && (
            <div className="flex items-center justify-between px-4 py-3 border-b bg-white">
              <button
                onClick={() => setConversaAtiva(null)}
                className="text-green-600 text-sm hover:underline"
              >
                ← Voltar
              </button>
              <h3 className="font-semibold text-base text-gray-800 truncate">
                {conversaAtiva?.nome}
              </h3>
            </div>
          )}

          {conversaAtiva ? (
            <>
              {/* LISTA DE MENSAGENS */}
              <div className="flex-grow overflow-y-auto p-4 mb-24" ref={mensagensRef}>
                {mensagens.map((msg, idx) => {
                  const atual = new Date(msg.data_envio);
                  const anterior = idx > 0 ? new Date(mensagens[idx - 1].data_envio) : null;
                  const mudouDia = !anterior || atual.toDateString() !== anterior.toDateString();

                  const isOwn = Number(msg.autor_id) === Number(meId);
                  const isLastOwn = isOwn && msg.id === lastOwnMsgId;

                  // aceita 'visto'/'lida'/'lido' em diferentes formatos
                  const vistoBackend = msg?.visto ?? msg?.lida ?? msg?.lido ?? false;
                  const seen =
                    isLastOwn &&
                    (vistoBackend === true ||
                      vistoBackend === 1 ||
                      vistoBackend === "1" ||
                      vistoBackend === "true");

                  return (
                    <React.Fragment key={msg.id ?? `${msg.autor_id}-${msg.data_envio}-${idx}`}>
                      {mudouDia && (
                        <div className="text-center text-xs text-zinc-500 my-2">
                          {formatarDataMensagem(msg.data_envio)}
                        </div>
                      )}

                      <div className={isOwn ? "flex justify-end" : "flex justify-start"}>
                        <div className="relative w-full max-w-[78%] sm:max-w-[65%]">
                          <MessageBubble
                            text={msg.mensagem || ""}
                            timestamp={msg.data_envio || msg.created_at || Date.now()}
                            isOwn={isOwn}
                            seen={seen}
                          />

                          {isOwn && (
                            <div className="absolute -top-2 -right-2">
                              <button
                                className="p-2 rounded-full bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                                onClick={() =>
                                  setMenuAbertoId(menuAbertoId === msg.id ? null : msg.id)
                                }
                                title="Mais ações"
                              >
                                <FaEllipsisV />
                              </button>

                              {menuAbertoId === msg.id && (
                                <div className="absolute right-0 mt-2 bg-white border rounded shadow-md z-10">
                                  <button
                                    onClick={() => excluirMensagem(msg.id)}
                                    className="flex items-center px-3 py-2 text-sm text-red-600 hover:bg-red-100 w-full"
                                  >
                                    <FaTrash className="mr-2" /> Excluir
                                  </button>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </React.Fragment>
                  );
                })}
              </div>

              {/* Input */}
              <div className="p-4 border-t flex bg-white w-full md:static md:w-auto z-10">
                <input
                  type="text"
                  value={novaMensagem}
                  onChange={(e) => setNovaMensagem(e.target.value)}
                  onKeyDown={onKeyDown}
                  placeholder="Digite sua mensagem..."
                  className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                />
                <button
                  onClick={enviarMensagem}
                  className="bg-green-600 hover:bg-green-700 text-white font-medium rounded-full px-6 py-2 ml-2 transition-all"
                >
                  Enviar
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              Selecione uma conversa para começar
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
