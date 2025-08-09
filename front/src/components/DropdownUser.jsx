import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User as UserIcon, LogOut, Bell, ChevronDown } from "lucide-react";
import { api } from "../services/api"; // << usa a instância com baseURL

export default function UserDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [nomeUsuario, setNomeUsuario] = useState("Usuário");
  const [imagemPerfil, setImagemPerfil] = useState(null);
  const navigate = useNavigate();

  const FILES_ORIGIN = import.meta.env.VITE_FILES_ORIGIN; // ex: https://aluguel-de-quadras.onrender.com

  useEffect(() => {
    const usuario = localStorage.getItem("usuario");
    if (!usuario) return;

    try {
      const user = JSON.parse(usuario);
      if (user?.nome) setNomeUsuario(user.nome);

      if (user?.id) {
        // usa a API com baseURL correta (Render)
        api
          .get(`/fotos-perfil/${user.id}`)
          .then((res) => {
            const url = res.data?.imagem_url;
            if (!url) return;

            // se o backend já devolve URL absoluta, usa direto
            // se vier só o nome do arquivo, monta a URL completa
            const finalUrl = url.startsWith("http")
              ? url
              : `${FILES_ORIGIN}/avatars/${url}`;

            setImagemPerfil(finalUrl);
          })
          .catch(() => {});
      }
    } catch (e) {
      console.warn("Erro ao ler usuário do localStorage:", e);
    }
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const avatarFallback = `${FILES_ORIGIN}/avatars/default.png`; // garanta esse arquivo no backend/public/avatars

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center bg-green-600 text-white px-4 py-2 rounded-full hover:bg-green-700 shadow-md"
      >
        <img
          src={imagemPerfil || avatarFallback}
          alt="Avatar"
          className="w-8 h-8 rounded-full mr-2 border-2 border-white shadow-sm"
        />
        <span className="font-medium">{nomeUsuario}</span>
        <ChevronDown className="ml-1 w-4 h-4" />
      </button>

      {isOpen && (
        <div
          className="absolute right-0 top-full mt-2 w-56 bg-white border rounded-lg shadow-xl z-[9999] overflow-hidden"
          onMouseLeave={() => setIsOpen(false)}
        >
          <div className="px-4 py-3 border-b bg-gray-50 text-sm text-gray-700">
            <p className="font-semibold">Olá, {nomeUsuario.split(" ")[0]} 👋</p>
            <p className="text-gray-500 text-xs">Seja bem-vindo(a)!</p>
          </div>

          <button
            onClick={() => navigate("/perfil")}
            className="flex items-center w-full px-4 py-2 text-sm hover:bg-gray-100 text-gray-700"
          >
            <UserIcon className="w-4 h-4 mr-2" />
            Meus Dados
          </button>

          <button
            onClick={() => navigate("/notificacao")}
            className="flex items-center w-full px-4 py-2 text-sm hover:bg-gray-100 text-gray-700"
          >
            <Bell className="w-4 h-4 mr-2" />
            Notificações
          </button>

          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-2 text-sm hover:bg-red-100 text-red-600 border-t"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sair
          </button>
        </div>
      )}
    </div>
  );
}
