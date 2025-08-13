import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    function load() {
      try {
        const raw = localStorage.getItem("usuario");
        if (raw) {
          const u = JSON.parse(raw);
          const tipo = u?.tipo || u?.tipo_usuario || null; // normaliza
          setUsuario({ ...u, tipo });
          return;
        }
      } catch {}
      setUsuario(null);
    }
    load();
    const onStorage = (e) => { if (e.key === "usuario") load(); };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("usuario");
    localStorage.removeItem("usuario_id");
    localStorage.removeItem("nomeUsuario");
    localStorage.removeItem("token");
    navigate("/login");
  };

  const isLocador = usuario?.tipo === "locador";
  const routes = [
    { path: isLocador ? "/home-locador" : "/home", label: "Início", icon: <Home size={20} />, show: true },
    { path: "/favoritos", label: "Favoritos", icon: <Bookmark size={20} />, show: !isLocador },
    // 🔁 Minhas Quadras -> rota FIXA para a página MinhasQuadras.jsx
    { path: "/minhas-quadras", label: "Minhas Quadras", icon: <CalendarDays size={20} />, show: !isLocador },
    { path: "/chat", label: "Chat", icon: <MessageSquare size={20} />, show: true },
    { path: "/perfil", label: "Perfil", icon: <User size={20} />, show: true },
    { path: "/sobre", label: "Sobre", icon: <Info size={20} />, show: true },
  ].filter(r => r.show);

  return (
    <div
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
      className={`h-screen fixed top-0 left-0 z-50 bg-green-700 text-white shadow-lg transition-all duration-300 ${isExpanded ? "w-56" : "w-14"}`}
    >
      <div className="flex flex-col justify-between h-full py-6">
        <nav className="space-y-2">
          {routes.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2 hover:bg-green-600 ${isActive ? "bg-green-800" : ""}`
              }
              title={item.label}
            >
              {item.icon}
              {isExpanded && <span className="whitespace-nowrap">{item.label}</span>}
            </NavLink>
          ))}
          {isLocador && (
            <NavLink
              to="/cadastrarquadra"
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2 hover:bg-green-600 ${isActive ? "bg-green-800" : ""}`
              }
              title="Nova Quadra"
            >
              <Plus size={20} />
              {isExpanded && <span>Nova Quadra</span>}
            </NavLink>
          )}
        </nav>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-2 hover:bg-red-600 text-white"
          title="Sair"
        >
          <LogOut size={20} />
          {isExpanded && <span>Sair</span>}
        </button>
      </div>
    </div>
  );
}
