// src/components/DropdownUser.jsx
console.log('[Dropdown] build marker v6');
import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { User as UserIcon, LogOut, Bell, ChevronDown } from "lucide-react";
import { api } from "../services/api";

export default function UserDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [nomeUsuario, setNomeUsuario] = useState("Usuário");
  const [imagemPerfil, setImagemPerfil] = useState(null);
  const navigate = useNavigate();

  const ORIGIN =
    import.meta.env.VITE_FILES_ORIGIN?.replace(/\/+$/, "") ||
    (typeof window !== "undefined" ? window.location.origin : "");

  const avatarFallback = `${ORIGIN}/avatars/default.png`;

  const normalize = useCallback(
    (val) => {
      if (!val) return null;
      // já é absoluta
      if (/^https?:\/\//i.test(val)) return val;
      // começa com / -> juntar com ORIGIN sem duplicar barras
      if (val.startsWith("/")) return `${ORIGIN}${val}`;
      // apenas filename ou caminho relativo -> apontar para /avatars
      return `${ORIGIN}/avatars/${val.replace(/^\/+/, "")}`;
    },
    [ORIGIN]
  );

  useEffect(() => {
    const usuario = localStorage.getItem("usuario");
    if (!usuario) return;

    try {
      const user = JSON.parse(usuario);
      if (user?.nome) setNomeUsuario(user.nome);

      if (user?.id) {
        api
          .get(`/fotos-perfil/${user.id}`)
          .then(({ data }) => {
            const url = data?.imagem_url || null;
            setImagemPerfil(normalize(url) || avatarFallback);
          })
          .catch(() => setImagemPerfil(avatarFallback));
      } else {
        setImagemPerfil(avatarFallback);
      }
    } catch {
      setImagemPerfil(avatarFallback);
    }
  }, [normalize]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={() => setIsOpen((v) => !v)}
        className="flex items-center bg-green-600 text-white px-4 py-2 rounded-full hover:bg-green-700 shadow-md"
      >
        <img
          src={imagemPerfil || avatarFallback}
          alt="Avatar"
          className="w-8 h-8 rounded-full mr-2 border-2 border-white shadow-sm object-cover"
          onError={(e) => {
            if (e.currentTarget.src !== avatarFallback) {
              e.currentTarget.src = avatarFallback;
            }
          }}
        />
        <span className="font-medium max-w-[140px] truncate">{nomeUsuario}</span>
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
            onClick={() => {
              setIsOpen(false);
              navigate("/perfil");
            }}
            className="flex items-center w-full px-4 py-2 text-sm hover:bg-gray-100 text-gray-700"
          >
            <UserIcon className="w-4 h-4 mr-2" />
            Meus Dados
          </button>

          <button
            onClick={() => {
              setIsOpen(false);
              navigate("/notificacao");
            }}
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
