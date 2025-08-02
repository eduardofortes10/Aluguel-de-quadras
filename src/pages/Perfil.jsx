import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import MobileNav from "../components/MobileNav";
import {
  User,
  CreditCard,
  Bell,
  Lock,
  Info,
  ChevronRight,
  LogOut,
} from "lucide-react";

export default function Perfil() {
  const navigate = useNavigate();
  const [nomeUsuario, setNomeUsuario] = useState("Usuário");
  const [imagemPerfil, setImagemPerfil] = useState(null);
  const [novaImagem, setNovaImagem] = useState(null);

  useEffect(() => {
    const usuario = localStorage.getItem("usuario");
    if (usuario) {
      try {
        const user = JSON.parse(usuario);
        if (user?.nome) {
          setNomeUsuario(user.nome);
        }
      } catch (e) {
        console.warn("Erro ao carregar nome:", e);
      }
    }
  }, []);

  useEffect(() => {
    const usuario = JSON.parse(localStorage.getItem("usuario"));
    if (usuario?.id) {
      axios
        .get(`/api/fotos-perfil/${usuario.id}`)
        .then((res) => setImagemPerfil(res.data?.imagem_url))
        .catch(() => {});
    }
  }, []);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setNovaImagem(URL.createObjectURL(file));

    const formData = new FormData();
    formData.append("avatar", file);
    formData.append(
      "usuario_id",
      JSON.parse(localStorage.getItem("usuario")).id
    );

    try {
      await axios.post("/api/fotos-perfil/upload", formData);
      window.location.reload();
    } catch (error) {
      console.error("Erro ao enviar imagem:", error);
    }
  };

  const opcoes = [
    { path: "/conta", label: "Conta", icon: <User className="w-5 h-5" /> },
    {
      path: "/pagamento",
      label: "Pagamento",
      icon: <CreditCard className="w-5 h-5" />,
    },
    {
      path: "/notificacao",
      label: "Notificações",
      icon: <Bell className="w-5 h-5" />,
    },
    {
      path: "/privacidade",
      label: "Privacidade",
      icon: <Lock className="w-5 h-5" />,
    },
    {
      path: "/sobre",
      label: "Sobre nós",
      icon: <Info className="w-5 h-5" />,
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem("usuario");
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar somente em telas médias para cima */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      <div className="flex-1 px-4 pt-4 pb-20 md:pl-20">
        {/* Header com fundo e avatar */}
        <div className="relative bg-gradient-to-br from-green-500 to-green-700 rounded-b-3xl py-8 text-white text-center shadow-md">
          <div className="relative w-24 h-24 md:w-28 md:h-28 mx-auto rounded-full border-4 border-white bg-white overflow-hidden shadow-lg group">
            <img
              src={
                novaImagem
                  ? novaImagem
                  : imagemPerfil
                  ? `/avatars/${imagemPerfil}`
                  : "/quadras/avatar.png"
              }
              alt="Avatar"
              className="object-cover w-full h-full"
            />
            <label className="absolute inset-0 bg-black bg-opacity-30 text-white text-xs md:text-sm flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition">
              Trocar
              <input type="file" className="hidden" onChange={handleUpload} />
            </label>
          </div>
          <h1 className="mt-4 text-xl md:text-2xl font-semibold">
            {nomeUsuario}
          </h1>
        </div>

        {/* Botões com opções */}
        <div className="mt-8 space-y-4 max-w-md mx-auto px-2">
          {opcoes.map((item, i) => (
            <button
              key={i}
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

          {/* Botão de sair */}
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

      {/* Mobile navigation fixa no rodapé */}
      <MobileNav />
    </div>
  );
}
