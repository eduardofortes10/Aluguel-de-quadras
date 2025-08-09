import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import MobileNav from "../components/MobileNav";
import {
  User, CreditCard, Bell, Lock, Info, ChevronRight, LogOut,
} from "lucide-react";
import { api } from "../services/api";

export default function Perfil() {
  const navigate = useNavigate();
  const [nomeUsuario, setNomeUsuario] = useState("Usuário");
  const [imagemPerfil, setImagemPerfil] = useState(null); // sempre ABSOLUTA aqui
  const [novaPreview, setNovaPreview] = useState(null);

  const FILES_ORIGIN = import.meta.env.VITE_FILES_ORIGIN; // ex: https://aluguel-de-quadras.onrender.com

  const normalize = (val) => {
    if (!val) return null;
    if (val.startsWith("http")) return val;
    if (val.startsWith("/")) return `${FILES_ORIGIN}${val}`;
    return `${FILES_ORIGIN}/avatars/${val}`;
  };

  useEffect(() => {
    const raw = localStorage.getItem("usuario");
    if (!raw) return;
    try {
      const user = JSON.parse(raw);
      if (user?.nome) setNomeUsuario(user.nome);
    } catch {}
  }, []);

  useEffect(() => {
    const raw = localStorage.getItem("usuario");
    if (!raw) return;
    try {
      const user = JSON.parse(raw);
      if (!user?.id) return;

      api.get(`/fotos-perfil/${user.id}`)
        .then(({ data }) => {
          setImagemPerfil(normalize(data?.imagem_url));
        })
        .catch(() => {});
    } catch {}
  }, []);

  const srcAvatar = () => {
    if (novaPreview) return novaPreview;
    return imagemPerfil || `${FILES_ORIGIN}/avatars/default.png`;
  };

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

      if (data?.imagem_url) {
        setImagemPerfil(normalize(data.imagem_url));
      } else if (data?.url) {
        setImagemPerfil(normalize(data.url));
      } else {
        const { data: got } = await api.get(`/fotos-perfil/${user.id}`);
        setImagemPerfil(normalize(got?.imagem_url));
      }
    } catch (err) {
      console.error("Erro ao enviar imagem:", err);
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
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="hidden md:block"><Sidebar /></div>
      <div className="flex-1 px-4 pt-4 pb-20 md:pl-20">
        <div className="relative bg-gradient-to-br from-green-500 to-green-700 rounded-b-3xl py-8 text-white text-center shadow-md">
          <div className="relative w-24 h-24 md:w-28 md:h-28 mx-auto rounded-full border-4 border-white bg-white overflow-hidden shadow-lg group">
            <img src={srcAvatar()} alt="Avatar" className="object-cover w-full h-full" />
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
