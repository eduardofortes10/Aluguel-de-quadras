import React, { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import MobileNav from "../components/MobileNav";
import { FaEllipsisV, FaTrash } from "react-icons/fa";
import axios from "axios";
import toast from 'react-hot-toast';

export default function Chat() {
  const usuario = JSON.parse(localStorage.getItem("usuario") || "{}");
  const usuarioId = usuario?.id;
  if (!usuarioId) return null;

  const [params] = useSearchParams();
  const destinatarioIdParam = params.get("id");
  const API_URL = "http://localhost:5000";

  const [conversas, setConversas] = useState([]);
  const [destinatario, setDestinatario] = useState(null);
  const [mensagens, setMensagens] = useState([]);
  const [novaMensagem, setNovaMensagem] = useState("");
  const mensagensRef = useRef(null);
  const [menuAbertoId, setMenuAbertoId] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/conversas/ultimas/${usuarioId}`)
      .then(res => setConversas(res.data))
      .catch(err => console.error(err));
  }, [usuarioId]);

  useEffect(() => {
    if (destinatario && destinatario.conversa_id) {
      axios.get(`${API_URL}/api/conversas/mensagens/${destinatario.conversa_id}`)
        .then(res => setMensagens(res.data))
        .catch(err => console.error(err));
    }
  }, [destinatario]);

  const formatarData = (dataString) => {
    const data = new Date(dataString);
    return data.toLocaleTimeString("pt-BR", { hour: '2-digit', minute: '2-digit' });
  };

  useEffect(() => {
    if (!usuario?.id || !destinatarioIdParam) return;
    const iniciarConversa = async () => {
      await fetch(`${API_URL}/api/conversas`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cliente_id: usuario.id,
          locador_id: destinatarioIdParam,
          autor_id: usuario.id,
          mensagem: "Olá, gostaria de saber mais sobre o aluguel."
        })
      });
      await carregarContatos();
      const contatosAtualizados = await fetch(`${API_URL}/api/conversas/ultimas/${usuario.id}`);
      const lista = await contatosAtualizados.json();
      const conversaCriada = lista.find(
        (c) =>
          (c.cliente_id === usuario.id && c.locador_id === parseInt(destinatarioIdParam)) ||
          (c.locador_id === usuario.id && c.cliente_id === parseInt(destinatarioIdParam))
      );
      if (conversaCriada) {
        setDestinatario(conversaCriada);
        await carregarMensagens(conversaCriada.conversa_id);
      }
    };
    iniciarConversa();
  }, [destinatarioIdParam]);

  const carregarMensagens = async (conversaId) => {
    try {
      const res = await fetch(`${API_URL}/api/conversas/mensagens/${conversaId}`);
      const data = await res.json();
      setMensagens(data);
    } catch (err) {
      console.error("Erro ao carregar mensagens:", err);
    }
  };

  const carregarContatos = async () => {
    if (!usuario?.id) return;
    try {
      const res = await fetch(`${API_URL}/api/conversas/ultimas/${usuario.id}`);
      const data = await res.json();
      setConversas(data);
    } catch (err) {
      console.error("Erro ao carregar conversas:", err);
    }
  };

  useEffect(() => {
    carregarContatos();
  }, [usuario]);

  useEffect(() => {
    if (mensagensRef.current) {
      mensagensRef.current.scrollTop = mensagensRef.current.scrollHeight;
    }
  }, [mensagens]);

  const enviarMensagem = async () => {
    if (!novaMensagem.trim() || !destinatario) return;
    const clienteId = destinatario.cliente_id;
    const locadorId = destinatario.locador_id;
    await fetch(`${API_URL}/api/conversas`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        cliente_id: clienteId,
        locador_id: locadorId,
        autor_id: usuario.id,
        mensagem: novaMensagem
      })
    });
    setNovaMensagem("");
    const conversasAtualizadas = await fetch(`${API_URL}/api/conversas/ultimas/${usuario.id}`);
    const lista = await conversasAtualizadas.json();
    const conversaAtual = lista.find(
      (c) =>
        (c.cliente_id === clienteId && c.locador_id === locadorId) ||
        (c.locador_id === clienteId && c.cliente_id === locadorId)
    );
    if (conversaAtual) {
      setDestinatario(conversaAtual);
      carregarMensagens(conversaAtual.conversa_id);
    }
  };

  const excluirMensagem = async (id) => {
    toast((t) => (
      <div className="text-sm text-gray-800">
        <p>Tem certeza que deseja excluir esta mensagem?</p>
        <div className="flex justify-end gap-2 mt-2">
          <button
            onClick={async () => {
              try {
                await fetch(`${API_URL}/api/conversas/mensagens/${id}`, {
                  method: "DELETE",
                });
                toast.dismiss(t.id);
                toast.success("Mensagem excluída com sucesso!");
                if (destinatario) carregarMensagens(destinatario.conversa_id);
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
    ), { duration: 999999 });
  };

  const formatarHora = (dataString) => {
    try {
      const data = new Date(dataString);
      return new Intl.DateTimeFormat("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
        timeZone: "America/Sao_Paulo"
      }).format(data);
    } catch {
      return "hora inválida";
    }
  };

  return (
    <div className="flex bg-gray-100 min-h-screen pb-16 md:pb-0">
      <div className="hidden md:block">
        <Sidebar />
      </div>
      <MobileNav />
      <div className="flex-1 md:ml-64 flex flex-col md:flex-row">
        {!destinatario || window.innerWidth >= 768 ? (
          <div className="w-full md:w-1/3 border-r bg-white p-4 overflow-y-auto max-h-[calc(100dvh-80px)]">
            <h2 className="text-lg font-semibold mb-4">Conversas</h2>
            {conversas.length === 0 && <p className="text-gray-500">Nenhuma conversa iniciada.</p>}
            {conversas.map((c) => (
              <button
                key={c.conversa_id}
                onClick={() => {
                  setDestinatario(c);
                  carregarMensagens(c.conversa_id);
                }}
                className={`block w-full text-left px-4 py-3 rounded-lg mb-2 shadow-sm transition ${
                  destinatario?.conversa_id === c.conversa_id
                    ? "bg-green-100 font-bold border-l-4 border-green-600"
                    : "hover:bg-gray-50"
                }`}
              >
                <div className="font-medium text-gray-800 truncate">{c.nome}</div>
                <p className="text-sm text-gray-500 truncate">{c.ultima_mensagem}</p>
              </button>
            ))}
          </div>
        ) : null}

        <div className="flex-1 flex flex-col bg-white h-[calc(100dvh-96px)] md:h-auto">
          {destinatario && (
            <div className="flex items-center justify-between px-4 py-3 border-b bg-white md:hidden">
              <button onClick={() => setDestinatario(null)} className="text-green-600 text-sm">← Voltar</button>
              <h3 className="font-semibold text-base text-gray-800 truncate">{destinatario?.nome}</h3>
            </div>
          )}

          <div className="flex-grow overflow-y-auto p-4 mb-16 md:mb-0" ref={mensagensRef}>
            {mensagens.map((msg) => (
              <div
                key={msg.id}
                className={`mb-3 px-4 py-3 rounded-2xl shadow max-w-xs sm:max-w-sm ${
                  msg.autor_id === usuario.id
                    ? "bg-green-500 text-white ml-auto rounded-br-none"
                    : "bg-gray-100 text-gray-800 rounded-bl-none"
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className="break-words max-w-[220px]">{msg.mensagem}</span>
                  {msg.autor_id === usuario.id && (
                    <div className="relative ml-2">
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
                <div className="text-xs text-white/80 mt-1">
                  {formatarHora(msg.data_envio)}
                  {msg.autor_id === usuario.id && msg.lida && (
                    <span className="text-green-200 ml-2">✓ Visto</span>
                  )}
                </div>
              </div>
            ))}
          </div>
          {destinatario && (
            <div className="p-4 border-t flex bg-white fixed bottom-14 w-full md:static md:w-auto">
              <input
                type="text"
                value={novaMensagem}
                onChange={(e) => setNovaMensagem(e.target.value)}
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
          )}
        </div>
      </div>
    </div>
  );
}
