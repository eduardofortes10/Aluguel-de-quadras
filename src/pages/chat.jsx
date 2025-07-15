import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import MobileNav from "../components/MobileNav";

export default function Chat() {
  const usuario = JSON.parse(localStorage.getItem("usuario"));
  const [conversas, setConversas] = useState([]);
  const [destinatarioId, setDestinatarioId] = useState(null);
  const [mensagens, setMensagens] = useState([]);
  const [novaMensagem, setNovaMensagem] = useState("");

  // Carrega lista de contatos
  useEffect(() => {
  if (!usuario?.id) return;

  const carregarConversas = async () => {
    try {
      const res = await fetch(`http://localhost:3001/api/conversas/${usuario.id}`);
      const data = await res.json();

      const contatos = [];
      data.forEach((msg) => {
        const idOutro = msg.remetente_id === usuario.id ? msg.destinatario_id : msg.remetente_id;
        if (!contatos.includes(idOutro)) contatos.push(idOutro);
      });

      setConversas(contatos);
    } catch (err) {
      console.error("Erro ao buscar lista de conversas:", err);
    }
  };

  carregarConversas();
}, [usuario, mensagens]); // ← Adiciona mensagens como dependência



  // Carrega mensagens entre usuário e destinatário
useEffect(() => {
  if (!destinatarioId) return;

  fetch(`http://localhost:3001/api/conversas/${usuario.id}/${destinatarioId}`)
    .then((res) => res.json())
    .then((data) => setMensagens(data))
    .catch((err) => console.error("Erro ao buscar mensagens", err));
}, [destinatarioId]);



  const enviarMensagem = async () => {
    if (!novaMensagem || !destinatarioId) return;

    await fetch("http://localhost:3001/api/conversas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        remetente_id: usuario.id,
        destinatario_id: destinatarioId,
        mensagem: novaMensagem,
      }),
    });

    setNovaMensagem("");

    const res = await fetch(`http://localhost:3001/api/conversas/${usuario.id}/${destinatarioId}`);
    const data = await res.json();
    setMensagens(data);
  };

  return (
    <div className="flex bg-gray-100 min-h-screen">
      {/* Sidebar e Mobile */}
      <div className="hidden md:block">
        <Sidebar />
      </div>
      <MobileNav />

      {/* Conteúdo principal */}
      <div className="flex-1 md:ml-64 flex flex-col md:flex-row">
        {/* Lista de conversas */}
        <div className="w-full md:w-1/3 border-r bg-white p-4">
          <h2 className="text-lg font-semibold mb-4">Conversas</h2>
          {conversas.length === 0 && <p className="text-gray-500">Nenhuma conversa iniciada.</p>}
          {conversas.map((id) => (
            <button
              key={id}
              onClick={() => setDestinatarioId(id)}
              className={`block w-full text-left px-4 py-2 rounded mb-2 ${
                destinatarioId === id ? "bg-green-100 font-bold" : "hover:bg-gray-100"
              }`}
            >
              Usuário {id}
            </button>
          ))}
        </div>

        {/* Mensagens */}
        <div className="flex-1 flex flex-col justify-between bg-white">
          <div className="p-4 overflow-y-auto h-[calc(100vh-6rem)]">
            {mensagens.map((msg) => (
              <div
                key={msg.id}
                className={`mb-2 p-2 rounded max-w-xs ${
                  msg.remetente_id === usuario.id
                    ? "bg-green-200 ml-auto text-right"
                    : "bg-gray-200 text-left"
                }`}
              >
                {msg.mensagem}
              </div>
            ))}
          </div>

          {/* Input */}
          {destinatarioId && (
            <div className="p-4 border-t flex">
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
          )}
        </div>
      </div>
    </div>
  );
}
