import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Home,
  Bookmark,
  MessageSquare,
  User,
  Info,
  Plus,
  LogOut,
  CalendarDays,
} from "lucide-react";

export default function Sidebar() {
  const [isExpanded, setIsExpanded] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const dados = JSON.parse(localStorage.getItem("usuario"));
    setUsuario(dados);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("usuario");
    navigate("/login");
  };

  const routes = [
    {
      path: usuario?.tipo === "locador" ? "/home-locador" : "/home",
      label: "Início",
      icon: <Home size={20} />,
    },
    ...(usuario?.tipo !== "locador"
      ? [
          {
            path: "/favoritos",
            label: "Favoritos",
            icon: <Bookmark size={20} />,
          },
          {
            path: "/minhas-quadras",
            label: "Minhas Quadras",
            icon: <CalendarDays size={20} />,
          },
        ]
      : []),
    {
      path: "/chat",
      label: "Chat",
      icon: <MessageSquare size={20} />,
    },
    {
      path: "/perfil",
      label: "Perfil",
      icon: <User size={20} />,
    },
    {
      path: "/sobre",
      label: "Sobre",
      icon: <Info size={20} />,
    },
  ];

  return (
    <div
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
      className={`h-screen fixed top-0 left-0 z-50 bg-green-700 text-white shadow-lg transition-all duration-300 ease-in-out ${
        isExpanded ? "w-56" : "w-14"
      }`}
    >
      <div className="flex flex-col justify-between h-full py-6">
        <div className="space-y-2">
          {routes.map((item, index) => (
            <Link
              to={item.path}
              key={index}
              className={`flex items-center gap-3 px-4 py-2 hover:bg-green-600 ${
                location.pathname === item.path ? "bg-green-800" : ""
              }`}
            >
              {item.icon}
              {isExpanded && <span className="whitespace-nowrap">{item.label}</span>}
            </Link>
          ))}

          {/* Botão Nova Quadra apenas para locadores */}
          {usuario?.tipo === "locador" && (
            <Link
              to="/cadastrarquadra"
              className={`flex items-center gap-3 px-4 py-2 hover:bg-green-600`}
            >
              <Plus size={20} />
              {isExpanded && <span>Nova Quadra</span>}
            </Link>
          )}
        </div>

        {/* Botão Sair */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-2 hover:bg-red-600 text-white"
        >
          <LogOut size={20} />
          {isExpanded && <span>Sair</span>}
        </button>
      </div>
    </div>
  );
}
