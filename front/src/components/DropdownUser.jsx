// src/components/DropdownUser.jsx
console.log("[Dropdown] build marker v10");
import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { User as UserIcon, LogOut, Bell, ChevronDown } from "lucide-react";
import { api, fileURL } from "../services/api";

export default function UserDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [nomeUsuario, setNomeUsuario] = useState("Usuário");
  const [imagemPerfil, setImagemPerfil] = useState(null);
  const navigate = useNavigate();
  const menuRef = useRef(null);
  const btnRef = useRef(null);

  const AVATAR_PLACEHOLDER = "/avatar-placeholder.png"; // /public no front
  const avatarFallback = fileURL("/avatars/default.png");

  const normalizeToFileURL = useCallback((val) => {
    if (!val) return null;
    const s = String(val).trim();
    if (/^https?:\/\//i.test(s)) return s;

    // preferir /avatars/
    let idx = s.indexOf("/avatars/");
    if (idx >= 0) return fileURL(s.slice(idx));

    // aceitar legado /uploads/
    idx = s.indexOf("/uploads/");
    if (idx >= 0) return fileURL(s.slice(idx));

    // veio só um nome de arquivo -> trate como avatar
    const just = s.replace(/^\/+/, "");
    return fileURL(`/avatars/${just}`);
  }, []);

  const bust = useCallback((url) => {
    if (!url) return avatarFallback;
    const sep = url.includes("?") ? "&" : "?";
    return `${url}${sep}t=${Date.now()}`;
  }, [avatarFallback]);

  const loadFromServer = useCallback(async (id) => {
    try {
      const { data } = await api.get(`/fotos-perfil/${id}`);
      const raw = data?.imagem_url || data?.imagem || data?.foto || data?.path || null;
      const url = normalizeToFileURL(raw) || avatarFallback;
      const finalUrl = bust(url);
      setImagemPerfil(finalUrl);
      localStorage.setItem("avatar_url", finalUrl);
    } catch {
      setImagemPerfil(avatarFallback);
    }
  }, [normalizeToFileURL, avatarFallback, bust]);

  useEffect(() => {
    const raw = localStorage.getItem("usuario");
    if (!raw) return;
    try {
      const user = JSON.parse(raw);
      if (user?.nome) setNomeUsuario(user.nome);

      const lsAvatar = localStorage.getItem("avatar_url");
      if (lsAvatar) setImagemPerfil(lsAvatar);

      const id = user?.id ?? user?.usuario_id;
      if (id) loadFromServer(id);
    } catch {
      setImagemPerfil(avatarFallback);
    }
  }, [loadFromServer, avatarFallback]);

  useEffect(() => {
    const onUpdated = () => {
      const lsAvatar = localStorage.getItem("avatar_url");
      if (lsAvatar) setImagemPerfil(lsAvatar);
    };
    window.addEventListener("avatar-updated", onUpdated);
    window.addEventListener("storage", onUpdated);
    return () => {
      window.removeEventListener("avatar-updated", onUpdated);
      window.removeEventListener("storage", onUpdated);
    };
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const onClickAway = (e) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target) &&
        btnRef.current &&
        !btnRef.current.contains(e.target)
      ) setIsOpen(false);
    };
    const onKey = (e) => e.key === "Escape" && setIsOpen(false);
    document.addEventListener("mousedown", onClickAway);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClickAway);
      document.removeEventListener("keydown", onKey);
    };
  }, [isOpen]);

  const go = (path) => { setIsOpen(false); navigate(path); };
  const handleLogout = () => { localStorage.clear(); navigate("/login"); };

  return (
    <div className="relative inline-block text-left">
      <button
        ref={btnRef}
        onClick={() => setIsOpen((v) => !v)}
        className="flex items-center bg-green-600 text-white px-4 py-2 rounded-full hover:bg-green-700 shadow-md"
        aria-haspopup="menu"
        aria-expanded={isOpen}
      >
        <img
          src={imagemPerfil || avatarFallback}
          alt="Avatar"
          className="w-8 h-8 rounded-full mr-2 border-2 border-white shadow-sm object-cover"
          onError={(e) => {
            if (e.currentTarget.src !== avatarFallback) {
              e.currentTarget.src = avatarFallback;
            } else {
              e.currentTarget.src = AVATAR_PLACEHOLDER;
            }
          }}
        />
        <span className="font-medium max-w-[140px] truncate">{nomeUsuario}</span>
        <ChevronDown className="ml-1 w-4 h-4" />
      </button>

      {isOpen && (
        <div
          ref={menuRef}
          role="menu"
          className="absolute right-0 top-full mt-2 w-56 bg-white border rounded-lg shadow-xl z-[9999] overflow-hidden"
          onMouseLeave={() => setIsOpen(false)}
        >
          <div className="px-4 py-3 border-b bg-gray-50 text-sm text-gray-700">
            <p className="font-semibold">Olá, {nomeUsuario.split(" ")[0]} 👋</p>
            <p className="text-gray-500 text-xs">Seja bem-vindo(a)!</p>
          </div>

          <button role="menuitem" onClick={() => go("/perfil")} className="flex items-center w-full px-4 py-2 text-sm hover:bg-gray-100 text-gray-700">
            <UserIcon className="w-4 h-4 mr-2" /> Meus Dados
          </button>

          <button role="menuitem" onClick={() => go("/notificacao")} className="flex items-center w-full px-4 py-2 text-sm hover:bg-gray-100 text-gray-700">
            <Bell className="w-4 h-4 mr-2" /> Notificações
          </button>

          <button role="menuitem" onClick={handleLogout} className="flex items-center w-full px-4 py-2 text-sm hover:bg-red-100 text-red-600 border-t">
            <LogOut className="w-4 h-4 mr-2" /> Sair
          </button>
        </div>
      )}
    </div>
  );
}
