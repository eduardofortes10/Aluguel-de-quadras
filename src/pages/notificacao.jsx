import React from "react";
import Sidebar from "../components/Sidebar";
import UserDropdown from "../components/DropdownUser";
import { Link } from "react-router-dom";
import MobileNav from "../components/MobileNav";
export default function Notificacoes() {
  const notificacoes = [
    {
      id: 1,
      mensagem: "Sua quadra foi aprovada e já está disponível no sistema.",
      data: "10/07/2025",
    },
    {
      id: 2,
      mensagem: "Novo pedido de reserva na quadra 'Arena 1'.",
      data: "09/07/2025",
    },
    {
      id: 3,
      mensagem: "Pagamento confirmado para reserva em 'Quadra Central'.",
      data: "08/07/2025",
    },
  ];

  return (
    <div className="flex">
      {/* Sidebar sempre visível em desktop, oculta no mobile por padrão (ajuste se tiver menu mobile) */}
                  <div className="md:block hidden">
                    <Sidebar />
                  </div>

      <div className="flex-1 min-h-screen bg-white px-8 py-8 md:ml-64">
        {/* Topo com dropdown */}
        <div className="flex justify-end items-center mb-4">
          <UserDropdown />
        </div>

       {/* Breadcrumb */}
<div className="flex items-center py-4 overflow-x-auto whitespace-nowrap text-sm text-gray-500">
  <Link to="/home" className="text-gray-600 flex items-center hover:underline">
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20">
      <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
    </svg>
  </Link>

  <span className="mx-2">/</span>
  <Link to="/perfil" className="text-gray-600 hover:underline">Perfil</Link>
  <span className="mx-2">/</span>
  <span className="text-green-700 font-semibold">Notificações</span>
</div>


        {/* Título */}
        <h1 className="text-2xl font-bold text-green-700 mb-6">Notificações</h1>

        {/* Lista de notificações */}
        <div className="space-y-4">
          {notificacoes.map((notificacao) => (
            <div
              key={notificacao.id}
              className="p-4 bg-gray-50 border border-gray-200 rounded-lg shadow-sm hover:bg-gray-100 transition"
            >
              <p className="text-gray-800">{notificacao.mensagem}</p>
              <span className="text-sm text-gray-500">{notificacao.data}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
