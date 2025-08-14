// src/pages/Chat.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import MobileNav from "../components/MobileNav";
import { FaEllipsisV, FaTrash } from "react-icons/fa";
import toast from "react-hot-toast";
import { api } from "../services/api";

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

  // Util: scroll pro fim quando mensagens mudarem
  useEffect(() => {
    if (mensagensRef.current) {
      mensagensRef.current.scrollTop = mensagensRef.current.scrollHeight;
    }
  }, [mensagens]);

  // Buscar lista de conversas
  const carregarConversas = async () => {
    if (!meId || carregandoConversasRef.current) return;
    try {
      carregandoConversasRef.current = true;
      const { data } = await api.get(`/conversas/ultimas/${meId}`);
      setConversas(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Erro ao carregar conversas:", err);
    } finally {
      carregandoConversasRef.current = false;
    }
  };

  // Buscar mensagens da conversa ativa
  const carregarMensagens = async (conversaId) => {
    if (!conversaId || carregandoMensagensRef.current) return;
    try {
      carregandoMensagensRef.current = true;
      const { data } = await api.get(`/conversas/mensagens/${conversaId}`);
      setMensagens(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Erro ao carregar mensagens:", err);
    } finally {
      carregandoMensagensRef.current = false;
    }
  };

  // Inicia/garante uma conversa com o alvo (?id=) sem duplicar
  const garantirConversaComAlvo = async (alvo) => {
    if (!meId || !alvo) return;

    // Descobre quem é cliente e quem é locador de acordo com o tipo do usuário
    const euSouLocador = (meTipo || "").toLowerCase() === "locador";
    const cliente_id = euSouLocador ? alvo : meId;
    const locador_id = euSouLocador ? meId : alvo;

    // Procura conversa existente
    const { data: lista } = await api.get(`/conversas/ultimas/${meId}`);
    const existente =
      (lista || []).find(
        (c) =>
          (Number(c.cliente_id) === Number(cliente_id) &&
            Number(c.locador_id) === Number(locador_id)) ||
          (Number(c.cliente_id) === Number(locador_id) &&
            Number(c.locador_id) === Number(cliente_id))
      ) || null;

    // Se não existir, cria com 1ª mensagem "olá..."
    if (!existente) {
      await api.post("/conversas", {
        cliente_id,
        locador_id,
        autor_id: meId,
        mensagem: "Olá, gostaria de saber mais sobre o aluguel.",
      });
    }

    // Recarrega lista e seleciona conversa
    await carregarConversas();
    const { data: lista2 } = await api.get(`/conversas/ultimas/${meId}`);
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

  // Carrega conversas ao abrir
  useEffect(() => {
    if (!meId) return;
    carregarConversas();
  }, [meId]);

  // Se veio com ?id=, tenta garantir a conversa
  useEffect(() => {
    if (!meId || !alvoId) return;
    garantirConversaComAlvo(alvoId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [meId, alvoId]);

  // Sempre que troca conversa ativa, carrega mensagens
  useEffect(() => {
    if (conversaAtiva?.conversa_id) {
      carregarMensagens(conversaAtiva.conversa_id);
    }
  }, [conversaAtiva]);

  // Polling leve (atualiza mensagens da conversa ativa e a lista)
  useEffect(() => {
    if (!conversaAtiva?.conversa_id) return;
    if (pollRef.current) clearInterval(pollRef.current);
    pollRef.current = setInterval(async () => {
      await carregarMensagens(conversaAtiva.conversa_id);
      await carregarConversas();
    }, 6000); // a cada 6s
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversaAtiva?.conversa_id]);

  // Enviar mensagem
  const enviarMensagem = async () => {
    const texto = (novaMensagem || "").trim();
    if (!texto || !conversaAtiva) return;

    // Garante papéis corretos
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
      console.error("Erro ao enviar mensagem:", err);
      toast.error("Não foi possível enviar sua mensagem.");
    }
  };

  // Enter para enviar
  const onKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      enviarMensagem();
    }
  };

  // Excluir conversa
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

  // Excluir mensagem (com confirmação)
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

  // Formatações
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

  // Filtra contatos por nome
  const conversasFiltradas = useMemo(() => {
    const f = (filtro || "").toLowerCase();
    return conversas.filter((c) => (c?.nome || "").toLowerCase().includes(f));
  }, [conversas, filtro]);

  if (!meId) return null;

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
        {/* Lista de conversas (esconde no mobile quando há conversa ativa) */}
        {!conversaAtiva || !isMobile ? (
          <div className="w-full md:w-1/3 border-r bg-white p-4 overflow-y-auto max-h-[calc(100dvh-80px)]">
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
              <div className="flex-grow overflow-y-auto p-4 mb-24" ref={mensagensRef}>
                {mensagens.map((msg, idx) => {
                  const atual = new Date(msg.data_envio);
                  const anterior = idx > 0 ? new Date(mensagens[idx - 1].data_envio) : null;
                  const mudouDia = !anterior || atual.toDateString() !== anterior.toDateString();

                  const minha = Number(msg.autor_id) === Number(meId);

                  return (
                    <React.Fragment key={msg.id}>
                      {mudouDia && (
                        <div className="text-center text-sm text-gray-400 my-2">
                          {formatarDataMensagem(msg.data_envio)}
                        </div>
                      )}
                      <div
                        className={`mb-3 px-4 py-3 rounded-2xl shadow max-w-xs sm:max-w-sm ${
                          minha
                            ? "bg-green-500 text-white ml-auto rounded-br-none"
                            : "bg-gray-100 text-gray-800 rounded-bl-none"
                        }`}
                      >
                        <div className="flex justify-between items-start gap-2">
                          <span className="break-words">{msg.mensagem}</span>

                          {minha && (
                            <div className="relative shrink-0">
                              <FaEllipsisV
                                className="cursor-pointer text-white/80 hover:text-white"
                                onClick={() =>
                                  setMenuAbertoId(menuAbertoId === msg.id ? null : msg.id)
                                }
                              />
                              {menuAbertoId === msg.id && (
                                <div className="absolute right-0 mt-1 bg-white border rounded shadow-md z-10">
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

                        <div className={`text-xs mt-1 ${minha ? "text-white/80" : "text-gray-500"} text-right`}>
                          {formatarHora(msg.data_envio)}
                          {minha && msg.lida && <span className="ml-2">✓ Visto</span>}
                        </div>
                      </div>
                    </React.Fragment>
                  );
                })}
              </div>

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
