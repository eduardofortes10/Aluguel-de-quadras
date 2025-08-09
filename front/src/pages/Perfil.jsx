// src/pages/Perfil.jsx
console.log('[Perfil] build marker v7');
import React, { useEffect, useMemo, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import MobileNav from "../components/MobileNav";
import { User, CreditCard, Bell, Lock, Info, ChevronRight, LogOut } from "lucide-react";
import { api } from "../services/api";

export default function Perfil() {
  const navigate = useNavigate();
  const [nomeUsuario, setNomeUsuario] = useState("Usuário");
  const [imagemPerfil, setImagemPerfil] = useState(null);
  const [novaPreview, setNovaPreview] = useState(null);

  const ORIGIN = useMemo(
    () =>
      import.meta.env.VITE_FILES_ORIGIN?.replace(/\/+$/, "") ||
      (typeof window !== "undefined" ? window.location.origin : ""),
    []
  );

  const avatarFallback = `${ORIGIN}/avatars/default.png`;

  const normalize = useCallback(
    (val) => {
      if (!val) return null;
      if (/^https?:\/\//i.test(val)) return val;
      if (val.startsWith("/")) return `${ORIGIN}${val}`;
      return `${ORIGIN}/avatars/${val.replace(/^\/+/, "")}`;
    },
    [ORIGIN]
  );

  const bust = useCallback(
    (url) => {
      if (!url) return avatarFallback;
      const sep = url.includes("?") ? "&" : "?";
      return `${url}${sep}t=${Date.now()}`;
    },
    [avatarFallback]
  );

  const srcAvatar = useMemo(() => {
    if (novaPreview) return novaPreview;
    return imagemPerfil || avatarFallback;
  }, [novaPreview, imagemPerfil, avatarFallback]);

  // nome do usuário
  useEffect(() => {
    const raw = localStorage.getItem("usuario");
    if (!raw) return;
    try {
      const user = JSON.parse(raw);
      if (user?.nome) setNomeUsuario(user.nome);
    } catch {}
  }, []);

  // busca foto
  useEffect(() => {
    const raw = localStorage.getItem("usuario");
    if (!raw) return;
    try {
      const user = JSON.parse(raw);
      if (!user?.id) return;

      api
        .get(`/fotos-perfil/${user.id}`)
        .then(({ data }) => {
          const url = normalize(data?.imagem_url) || avatarFallback;
          const finalUrl = bust(url);
          setImagemPerfil(finalUrl);
          localStorage.setItem("avatar_url", finalUrl);
          window.dispatchEvent(new Event("avatar-updated"));
        })
        .catch(() => setImagemPerfil(avatarFallback));
    } catch {
      setImagemPerfil(avatarFallback);
    }
  }, [normalize, avatarFallback, bust]);

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setNovaPreview(URL.createObjectURL(file));

    const raw = localStorage.getItem("usuario");
    const user = raw ? JSON.parse(raw) : null;
    if (!user?.id) return;

    const formData = new FormData();
    formData.append("avatar", file);
    formData.append("usuario_id", user.id);

    try {
      const { data } = await api.post("/fotos-perfil/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const returned = data?.imagem_url || data?.url || null;
      const normalized = normalize(returned) || avatarFallback;
      const finalUrl = bust(normalized);

      setImagemPerfil(finalUrl);
      setNovaPreview(null);

      // sincroniza com o Dropdown e demais componentes
      localStorage.setItem("avatar_url", finalUrl);
      window.dispatchEvent(new Event("avatar-updated"));
    } catch (err) {
      console.error("Erro ao enviar imagem:", err);
      setImagemPerfil(avatarFallback);
      setNovaPreview(null);
    }
  };

  const opcoes = [
    { path: "/conta", label: "Conta", icon: <User className="w-5 h-5" /> },
    { path: "/pagamento", label: "Pagamento", icon: <CreditCard className="w-5 h-5" /> },
    { path: "/notificacao", label: "Notificações", icon: <Bell className="w-5 h-5" /> },
    { path: "/privacidade", label: "Privacidade", icon: <Lock className="w-5 h-5" /> },
    { path: "/sobre", label: "Sobre nós", icon: <Info className="w-5 h-5" /> },
  ];

  const handleLogout = () => {
    localStorage.removeItem("usuario");
    localStorage.removeItem("usuario_id");
    localStorage.removeItem("nomeUsuario");
    localStorage.removeItem("avatar_url");
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="hidden md:block">
        <Sidebar />
      </div>

      <div className="flex-1 px-4 pt-4 pb-20 md:pl-20">
        <div className="relative bg-gradient-to-br from-green-500 to-green-700 rounded-b-3xl py-8 text-white text-center shadow-md">
          <div className="relative w-24 h-24 md:w-28 md:h-28 mx-auto rounded-full border-4 border-white bg-white overflow-hidden shadow-lg group">
            <img
              src={srcAvatar}
              alt="Avatar"
              className="object-cover w-full h-full"
              onError={(e) => {
                if (e.currentTarget.src !== avatarFallback) {
                  e.currentTarget.src = avatarFallback;
                }
              }}
            />
            <label className="absolute inset-0 bg-black/30 text-white text-xs md:text-sm flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition">
              Trocar
              <input type="file" className="hidden" accept="image/*" onChange={handleUpload} />
            </label>
          </div>
          <h1 className="mt-4 text-xl md:text-2xl font-semibold">{nomeUsuario}</h1>
        </div>

        <div className="mt-8 space-y-4 max-w-md mx-auto px-2">
          {opcoes.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className="flex justify-between items-center p-4 bg-white rounded-xl shadow-sm hover:bg-green-50 border w-full"
            >
              <div className="flex items-center gap-3 text-green-700">
                {item.icon}
                <span className="font-medium text-gray-800">{item.label}</span>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </button>
          ))}

          <button
            onClick={handleLogout}
            className="flex justify-between items-center p-4 bg-red-50 border border-red-300 rounded-xl shadow-sm hover:bg-red-100 w-full"
          >
            <div className="flex items-center gap-3 text-red-700 font-semibold">
              <LogOut className="w-5 h-5" />
              <span>Sair</span>
            </div>
            <ChevronRight className="w-4 h-4 text-red-400" />
          </button>
        </div>
      </div>

      <MobileNav />
    </div>
  );
}
