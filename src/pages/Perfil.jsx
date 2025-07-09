// src/pages/Perfil.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";

export default function Perfil() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen overflow-x-hidden">
      <Sidebar />

      <div className="flex-1 bg-white text-black px-6 pl-20">
        {/* Topo */}
        <div className="relative bg-gradient-to-br from-green-500 to-green-700 rounded-b-3xl py-8 text-white text-center">
          <div className="w-24 h-24 mx-auto rounded-full border-4 border-white bg-white overflow-hidden shadow-md">
            <img src="/src/assets/avatar.png" alt="Avatar" className="object-cover w-full h-full" />
          </div>
          <h1 className="mt-4 text-xl font-semibold">Eduardo Fortes</h1>
        </div>

        {/* Botões */}
        <div className="mt-8 space-y-4 max-w-md mx-auto">
          {[
            { path: "/conta", label: "Conta", icon: "👤" },
            { path: "/pagamento", label: "Pagamento", icon: "💳" },
            { path: "/notificacao", label: "Notificação", icon: "🔔" },
            { path: "/privacidade", label: "Privacidade", icon: "🔒" },
            { path: "/sobre", label: "Sobre nós", icon: "ℹ️" },
          ].map((item, i) => (
            <button
              key={i}
              onClick={() => navigate(item.path)}
              className="flex justify-between items-center p-4 bg-gray-100 rounded-xl shadow hover:bg-green-50 cursor-pointer w-full"
            >
              <div className="flex items-center gap-3">
                <span className="text-lg">{item.icon}</span>
                <span className="font-medium text-gray-800">{item.label}</span>
              </div>
              <span className="text-green-700">➔</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
