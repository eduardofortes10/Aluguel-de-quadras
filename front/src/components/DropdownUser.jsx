// src/components/DropdownUser.jsx
import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useLayoutEffect,
} from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { User as UserIcon, LogOut, Bell, ChevronDown } from "lucide-react";
import { api, fileURL } from "../services/api";

console.log("[Dropdown] build marker v11");

export default function UserDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [nomeUsuario, setNomeUsuario] = useState("Usuário");
  const [imagemPerfil, setImagemPerfil] = useState(null);
  const navigate = useNavigate();

  const btnRef = useRef(null);
  const menuRef = useRef(null);

  // posição (para o portal)
  const [pos, setPos] = useState({ top: 0, left: 0, width: 224 }); // w-56 = 224px

  const AVATAR_PLACEHOLDER = "/avatar-placeholder.png";
  const avatarFallback = fileURL("/avatars/default.png");

  const normalizeToFileURL = useCallback((val) => {
    if (!val) return null;
    const s = String(val).trim();
    if (/^https?:\/\//i.test(s)) return s;
    let idx = s.indexOf("/avatars/");
    if (idx >= 0) return fileURL(s.slice(idx));
    idx = s.indexOf("/uploads/");
    if (idx >= 0) return fileURL(s.slice(idx));
    const just = s.replace(/^\/+/, "");
    return fileURL(`/avatars/${just}`);
  }, []);

  const bust = useCallback(
    (url) => {
      if (!url) return avatarFallback;
      const sep = url.includes("?") ? "&" : "?";
      return `${url}${sep}t=${Date.now()}`;
    },
    [avatarFallback]
  );

  const loadFromServer = useCallback(
    async (id) => {
      try {
        const { data } = await api.get(`/fotos-perfil/${id}`);
        const raw =
          data?.imagem_url || data?.imagem || data?.foto || data?.path || null;
        const url = normalizeToFileURL(raw) || avatarFallback;
        const finalUrl = bust(url);
        setImagemPerfil(finalUrl);
        localStorage.setItem("avatar_url", finalUrl);
      } catch {
        setImagemPerfil(avatarFallback);
      }
    },
    [normalizeToFileURL, avatarFallback, bust]
  );

  // carrega user + avatar
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

  // atualiza avatar quando salvo em outro lugar
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

  // calcula posição do portal
  const positionMenu = useCallback(() => {
    if (!btnRef.current) return;
    const r = btnRef.current.getBoundingClientRect();
    const W = 224; // w-56
    const vw = document.documentElement.clientWidth;
    // base: abaixo do botão, alinhado à direita
    let left = r.right - W;
    let top = r.bottom;

    // clamp para não sair da tela (8px margem)
    const margin = 8;
    if (left + W > vw - margin) left = vw - margin - W;
    if (left < margin) left = margin;

    setPos({ top, left, width: W });
  }, []);

  useLayoutEffect(() => {
    if (!isOpen) return;
    positionMenu();
    const onScroll = () => positionMenu();
    const onResize = () => positionMenu();
    window.addEventListener("scroll", onScroll, true);
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("scroll", onScroll, true);
      window.removeEventListener("resize", onResize);
    };
  }, [isOpen, positionMenu]);

  // clique fora / Esc
  useEffect(() => {
    if (!isOpen) return;
    const onClickAway = (e) => {
      const target = e.target;
      if (
        menuRef.current &&
        !menuRef.current.contains(target) &&
        btnRef.current &&
        !btnRef.current.contains(target)
      ) {
        setIsOpen(false);
      }
    };
    const onKey = (e) => e.key === "Escape" && setIsOpen(false);
    document.addEventListener("mousedown", onClickAway);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClickAway);
      document.removeEventListener("keydown", onKey);
    };
  }, [isOpen]);

  const go = (path) => {
    setIsOpen(false);
    navigate(path);
  };
  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  // botão + portal
  return (
    <div className="relative inline-block text-left">
      <button
        ref={btnRef}
        onClick={() => setIsOpen((v) => !v)}
        className="flex items-center bg-green-600 text-white px-4 py-2 rounded-full hover:bg-green-700 shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
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

      {isOpen &&
        createPortal(
          <div
            ref={menuRef}
            role="menu"
            className="fixed z-[9999] w-56 bg-white border rounded-lg shadow-xl overflow-hidden"
            style={{
              top: pos.top, // coordenada de viewport (com position:fixed)
              left: pos.left,
            }}
          >
            <div className="px-4 py-3 border-b bg-gray-50 text-sm text-gray-700">
              <p className="font-semibold">
                Olá, {nomeUsuario.split(" ")[0]} 👋
              </p>
              <p className="text-gray-500 text-xs">Seja bem-vindo(a)!</p>
            </div>

            <button
              role="menuitem"
              onClick={() => go("/perfil")}
              className="flex items-center w-full px-4 py-2 text-sm hover:bg-gray-100 text-gray-700"
            >
              <UserIcon className="w-4 h-4 mr-2" /> Meus Dados
            </button>

            <button
              role="menuitem"
              onClick={() => go("/notificacao")}
              className="flex items-center w-full px-4 py-2 text-sm hover:bg-gray-100 text-gray-700"
            >
              <Bell className="w-4 h-4 mr-2" /> Notificações
            </button>

            <button
              role="menuitem"
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-2 text-sm hover:bg-red-100 text-red-600 border-t"
            >
              <LogOut className="w-4 h-4 mr-2" /> Sair
            </button>
          </div>,
          document.body
        )}
    </div>
  );
}
