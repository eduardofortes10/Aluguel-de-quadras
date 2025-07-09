// src/pages/Chat.jsx
import React, { useState } from "react";
import Sidebar from "../components/Sidebar";

const conversations = [
{
  id: 1,
  name: "Chuck",
  avatar: "/avatars/chuck.png",
  messages: [
    { from: "other", text: "Olá! Posso te ajudar?", time: "13:20" },
    { from: "me", text: "Obrigado por entrar em contato", time: "13:25" },
  ],
},
{
  id: 2,
  name: "Kim",
  avatar: "/avatars/kim.png",
  messages: [
    { from: "other", text: "Sim! A quadra está disponível!", time: "13:14" },
  ],
},
{
  id: 3,
  name: "Marie",
  avatar: "/avatars/marie.png",
  messages: [
    { from: "other", text: "Sem burocracia, direto comigo", time: "11:00" },
  ],
},
{
  id: 4,
  name: "Paulo Scholl",
  avatar: "/avatars/paulo.png",
  messages: [
    { from: "other", text: "Ok, aguardo seu retorno", time: "10:25" },
  ],
},
{
  id: 5,
  name: "Ehrmantraut",
  avatar: "/avatars/ehrmantraut.png",
  messages: [
    { from: "other", text: "Ok!", time: "9:30" },
  ],
},
{
  id: 6,
  name: "Hector",
  avatar: "/avatars/hector.png",
  messages: [
    { from: "other", text: "Sim, está disponível às 14:30!", time: "8:45" },
  ],
},
];

export default function Chat() {
  const [selectedChat, setSelectedChat] = useState(conversations[0]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;
    const newMessage = {
      from: "me",
      text: input,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    const updatedChat = {
      ...selectedChat,
      messages: [...selectedChat.messages, newMessage],
    };
    setSelectedChat(updatedChat);
    setInput("");
  };

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Sidebar */}
      <div className="fixed h-screen">
        <Sidebar />
      </div>

      {/* Conteúdo principal com margem da sidebar */}
      <div className="flex flex-1 ml-16">
        {/* Lista de conversas */}
        <div className="w-1/4 bg-white border-r flex flex-col">
          <div className="p-4 text-lg font-semibold text-green-800">Chats</div>
          <input
            type="text"
            placeholder="Procurar mensagem..."
            className="w-full px-4 py-2 border-b text-sm focus:outline-none"
          />
          <div className="overflow-y-auto flex-1">
            {conversations.map((chat) => (
              <div
                key={chat.id}
                className={`flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-gray-100 ${
                  selectedChat.id === chat.id ? "bg-gray-200" : ""
                }`}
                onClick={() => setSelectedChat(chat)}
              >
                <img
                  src={chat.avatar}
                  alt={chat.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div className="flex-1">
                  <div className="font-semibold text-sm">{chat.name}</div>
                  <div className="text-xs text-gray-500 truncate">
                    {chat.messages.at(-1)?.text}
                  </div>
                </div>
                <div className="text-xs text-gray-400">
                  {chat.messages.at(-1)?.time}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Janela do chat */}
        <div className="flex-1 flex flex-col">
          {/* Cabeçalho */}
          <div className="flex items-center px-6 py-4 border-b bg-white">
            <img
              src={selectedChat.avatar}
              alt={selectedChat.name}
              className="w-10 h-10 rounded-full object-cover mr-3"
            />
            <div className="font-semibold">{selectedChat.name}</div>
          </div>

          {/* Mensagens */}
          <div className="flex-1 p-6 space-y-3 overflow-y-auto">
            {selectedChat.messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${
                  msg.from === "me" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`rounded-lg px-4 py-2 text-sm shadow max-w-xs ${
                    msg.from === "me"
                      ? "bg-green-100 text-black"
                      : "bg-white text-gray-800"
                  }`}
                >
                  <div>{msg.text}</div>
                  <div className="text-xs text-gray-400 text-right mt-1">
                    {msg.time}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Campo de digitação */}
          <div className="flex items-center px-6 py-4 border-t bg-white">
            <input
              type="text"
              placeholder="Digite uma mensagem..."
              className="flex-1 px-4 py-2 border rounded-full text-sm focus:outline-none"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            <button
              onClick={handleSend}
              className="ml-3 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-full text-sm"
            >
              Enviar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}