// Chat.jsx atualizado com horário corrigido usando Intl.DateTimeFormat

import React, { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import MobileNav from "../components/MobileNav";
import { FaEllipsisV, FaTrash } from "react-icons/fa";

export default function Chat() {
  const usuario = JSON.parse(localStorage.getItem("usuario"));
  const [params] = useSearchParams();
  const destinatarioInicial = params.get("id");

  const [usuarios, setUsuarios] = useState([]);
  const [destinatario, setDestinatario] = useState(null);
  const [mensagens, setMensagens] = useState([]);
  const [novaMensagem, setNovaMensagem] = useState("");
  const [mostrarLista, setMostrarLista] = useState(true);
  const mensagensRef = useRef(null);
  const [menuAbertoId, setMenuAbertoId] = useState(null);
  const [larguraTela, setLarguraTela] = useState(window.innerWidth);

  useEffect(() => {
    const buscarConversasComUltimas = async () => {
      try {
        const res = await fetch(`http://localhost:3001/api/conversas/ultimas/${usuario.id}`);
        const data = await res.json();
        setUsuarios(Array.isArray(data) ? data : []);

        if (destinatarioInicial) {
          const preSelecionado = data.find((u) => u.id === parseInt(destinatarioInicial));
          if (preSelecionado) {
            setDestinatario(preSelecionado);
            setMostrarLista(false);
          }
        }
      } catch (err) {
        console.error("Erro ao buscar últimas mensagens:", err);
        setUsuarios([]);
      }
    };

    buscarConversasComUltimas();
  }, [usuario, destinatarioInicial]);

  useEffect(() => {
    const atualizarLargura = () => setLarguraTela(window.innerWidth);
    window.addEventListener("resize", atualizarLargura);
    return () => window.removeEventListener("resize", atualizarLargura);
  }, []);

  const excluirMensagem = async (id) => {
    if (!window.confirm("Tem certeza que deseja excluir esta mensagem?")) return;
    try {
      await fetch(`http://localhost:3001/api/conversas/${id}`, { method: "DELETE" });
      buscarMensagens();
      setMenuAbertoId(null);
    } catch (err) {
      console.error("Erro ao excluir mensagem:", err);
    }
  };

  useEffect(() => {
    const enviarMensagemAutomatica = async () => {
      if (
        destinatarioInicial &&
        destinatario &&
        destinatario.id === parseInt(destinatarioInicial)
      ) {
        await fetch("http://localhost:3001/api/conversas", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            remetente_id: usuario.id,
            destinatario_id: destinatario.id,
            mensagem: "Olá, gostaria de saber mais sobre o aluguel.",
          }),
        });

        buscarMensagens();
      }
    };

    enviarMensagemAutomatica();
  }, [destinatario, destinatarioInicial]);

  const buscarMensagens = async () => {
    if (!destinatario) return;
    try {
      const res = await fetch(`http://localhost:3001/api/conversas/${usuario.id}/${destinatario.id}`);
      const data = await res.json();
      setMensagens(data);
    } catch (err) {
      console.error("Erro ao buscar mensagens:", err);
    }
  };

  useEffect(() => {
    const intervalo = setInterval(() => {
      if (destinatario) buscarMensagens();
    }, 3000);
    return () => clearInterval(intervalo);
  }, [destinatario]);

  useEffect(() => {
    if (mensagensRef.current) {
      mensagensRef.current.scrollTop = mensagensRef.current.scrollHeight;
    }
  }, [mensagens]);

  const enviarMensagem = async () => {
  if (!novaMensagem.trim() || !destinatario) return;

  await fetch("http://localhost:3001/api/conversas", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      remetente_id: usuario.id,
      destinatario_id: destinatario.id,
      mensagem: novaMensagem,
    }),
  });

  setNovaMensagem("");

  // Aguarda 300ms antes de buscar novamente, dando tempo ao MySQL
  setTimeout(() => {
    buscarMensagens();
  }, 300);
};


  const formatarHora = (dataString) => {
    try {
      const data = new Date(dataString);
      return new Intl.DateTimeFormat("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
        timeZone: "America/Sao_Paulo",
      }).format(data);
    } catch {
      return "hora inválida";
    }
  };

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <div className="hidden md:block">
        <Sidebar />
      </div>
      <MobileNav />

      <div className="flex-1 md:ml-64 flex flex-col md:flex-row">
        {(mostrarLista || larguraTela >= 768) && (
          <div className="w-full md:w-1/3 border-r bg-white p-4">
            <h2 className="text-lg font-semibold mb-4">Conversas</h2>
            {usuarios.length === 0 && <p className="text-gray-500">Nenhum contato disponível.</p>}
            {usuarios.map((u) => (
              <button
                key={u.id}
                onClick={() => {
                  setDestinatario(u);
                  if (window.innerWidth < 768) setMostrarLista(false);
                }}
                className={`block w-full text-left px-4 py-2 rounded mb-2 ${
                  destinatario?.id === u.id ? "bg-green-100 font-bold" : "hover:bg-gray-100"
                }`}
              >
                <div className="font-medium">{u.nome}</div>
                <p className="text-sm text-gray-500 truncate">{u.ultima_mensagem}</p>
              </button>
            ))}
          </div>
        )}

        {destinatario && (
          <div className="flex-1 flex flex-col bg-white h-[calc(100dvh-96px)] md:h-auto">
            <div className="md:hidden p-4 border-b flex justify-between items-center">
              <button
                onClick={() => {
                  setDestinatario(null);
                  setMostrarLista(true);
                }}
                className="text-green-600 font-semibold"
              >
                ← Voltar
              </button>
              <span className="font-medium">{destinatario.nome}</span>
              <div />
            </div>

            <div className="flex flex-col flex-grow overflow-hidden">
              <div className="p-4 overflow-y-auto flex-grow pb-[80px]" ref={mensagensRef}>
                {mensagens.map((msg) => (
                  <div
                    key={msg.id}
                    className={`mb-2 p-2 rounded max-w-xs ${
                      msg.remetente_id === usuario.id
                        ? "bg-green-200 ml-auto text-right"
                        : "bg-gray-200 text-left"
                    }`}
                  >
                    <div className="relative">
                      <div className="flex justify-between items-center">
                        <span className="break-words max-w-[220px]">{msg.mensagem}</span>

                        {msg.remetente_id === usuario.id && (
                          <div className="relative ml-2">
                            <FaEllipsisV
                              className="cursor-pointer text-gray-600"
                              onClick={() =>
                                setMenuAbertoId(menuAbertoId === msg.id ? null : msg.id)
                              }
                            />
                            {menuAbertoId === msg.id && (
                              <div className="absolute right-0 mt-1 bg-white border rounded shadow z-10">
                                <button
                                  onClick={() => excluirMensagem(msg.id)}
                                  className="flex items-center px-2 py-1 text-sm text-red-600 hover:bg-red-100 w-full"
                                >
                                  <FaTrash className="mr-1" /> Excluir
                                </button>
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      <div className="text-xs text-gray-500 mt-1">
                        {msg.data_envio ? formatarHora(msg.data_envio) : "Hora inválida"}
                        {msg.remetente_id === usuario.id && msg.lida && (
                          <span className="text-green-600 ml-2">✓ Visto</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 border-t flex bg-white md:static fixed bottom-16 left-0 right-0 z-10">
                <input
                  type="text"
                  value={novaMensagem}
                  onChange={(e) => setNovaMensagem(e.target.value)}
                  placeholder="Digite sua mensagem..."
                  className="flex-1 border rounded px-3 py-2 mr-2"
                />
                <button
                  onClick={enviarMensagem}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                  Enviar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}