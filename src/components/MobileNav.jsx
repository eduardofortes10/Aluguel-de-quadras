import React, { useLayoutEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Bookmark, MessageSquare, User, Plus } from "lucide-react";

export default function MobileNav() {
  const location = useLocation();
  const [homeRoute, setHomeRoute] = useState("/home");
  const [isLocador, setIsLocador] = useState(false);

  useLayoutEffect(() => {
    const usuario = localStorage.getItem("usuario");

    if (usuario) {
      try {
        const user = JSON.parse(usuario);
        if (user?.tipo === "locador") {
          setHomeRoute("/home-locador");
          setIsLocador(true);
        }
      } catch (e) {
        console.warn("Erro ao interpretar usuário no MobileNav:", e);
      }
    }
  }, []);

  const active = (path) =>
    location.pathname === path ? "text-green-600" : "text-gray-400";

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-md flex justify-around items-center h-14 md:hidden z-50">
      <Link to={homeRoute} className={`flex flex-col items-center ${active(homeRoute)}`}>
        <Home className="w-5 h-5" />
      </Link>

      <Link to={isLocador ? "/cadastrarquadra" : "/favoritos"} className={`flex flex-col items-center ${active(isLocador ? "/cadastrarquadra" : "/favoritos")}`}>
        {isLocador ? <Plus className="w-5 h-5" /> : <Bookmark className="w-5 h-5" />}
      </Link>

      <Link to="/chat" className={`flex flex-col items-center ${active("/chat")}`}>
        <MessageSquare className="w-5 h-5" />
      </Link>

      <Link to="/perfil" className={`flex flex-col items-center ${active("/perfil")}`}>
        <User className="w-5 h-5" />
      </Link>
    </div>
  );
}
