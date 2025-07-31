import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import UserDropdown from "../components/DropdownUser";
import MobileNav from "../components/MobileNav";
import { Link } from "react-router-dom";
import {
  FaCheckCircle,
  FaCalendarAlt,
  FaMoneyCheckAlt,
  FaTrashAlt,
  FaBell,
} from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

export default function Notificacoes() {
  const [notificacoes, setNotificacoes] = useState([]);

  useEffect(() => {
    const userId = localStorage.getItem("usuario_id");
    console.log("🆔 Usuário ID do localStorage:", userId);

    if (!userId) return;

    const buscarNotificacoes = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/notificacoes/${userId}`);
     console.log("🔔 Notificações recebidas do backend:", res.data);
setNotificacoes(res.data);

      } catch (error) {
  console.error("❌ Erro ao buscar notificações:", error.response?.data || error.message);
}

    };

    buscarNotificacoes();
  }, []);

  const icones = {
    aprovacao: <FaCheckCircle className="text-green-500 w-6 h-6" />,
    reserva: <FaCalendarAlt className="text-blue-500 w-6 h-6" />,
    pagamento: <FaMoneyCheckAlt className="text-yellow-500 w-6 h-6" />,
    favorito: <FaCheckCircle className="text-pink-500 w-6 h-6" />,
    aluguel: <FaCalendarAlt className="text-purple-500 w-6 h-6" />,
  };

const excluirNotificacao = async (id) => {
  try {
    await axios.delete(`http://localhost:5000/api/notificacoes/${id}`);
    setNotificacoes((prev) => prev.filter((n) => n.id !== id));
    toast.success("Notificação excluída com sucesso!");
  } catch (error) {
    console.error("❌ Erro ao excluir notificação:", error);
    toast.error("Erro ao excluir notificação.");
  }
};
  return (
    <div className="flex">
      <ToastContainer />

      {/* Sidebar (desktop) */}
      <div className="md:block hidden">
        <Sidebar />
      </div>

      <div className="flex-1 min-h-screen bg-white px-6 py-8 md:ml-64">
        {/* Mobile nav */}
        <div className="md:hidden fixed bottom-14 left-0 w-full bg-[#14532d] p-4 flex justify-between items-center z-50 shadow-inner">
          <MobileNav />
        </div>

        {/* Topo com dropdown e sino de notificação */}
        <div className="flex justify-end items-center mb-4 gap-4">
          <div className="relative">
            <FaBell className="text-gray-700 w-6 h-6" />
            {notificacoes.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
                {notificacoes.length}
              </span>
            )}
          </div>
          <UserDropdown />
        </div>

        {/* Breadcrumb */}
        <div className="flex items-center py-4 overflow-x-auto whitespace-nowrap text-sm text-gray-500">
          <Link to="/home" className="text-gray-600 flex items-center hover:underline">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
            </svg>
            Início
          </Link>
          <span className="mx-2">/</span>
          <Link to="/perfil" className="text-gray-600 hover:underline">Perfil</Link>
          <span className="mx-2">/</span>
          <span className="text-green-700 font-semibold">Notificações</span>
        </div>

        {/* Título */}
        <h1 className="text-2xl font-bold text-green-700 mb-6">
          Notificações
          <span className="ml-2 bg-green-200 text-green-800 text-xs font-bold px-2 py-1 rounded-full">
            {notificacoes.length}
          </span>
        </h1>

        {/* Lista de notificações */}
<div className="space-y-4">
  {notificacoes.map((n) => {
    console.log("🔍 Notificação:", n); // <-- Correto aqui dentro

    return (
      <div
        key={n.id}
        className="flex items-start justify-between p-4 bg-white border-l-4 border-green-600 shadow rounded-lg hover:bg-green-50 transition-all"
      >
        <div className="flex items-start gap-4">
          <div>{icones[n.tipo] || <FaCheckCircle className="text-gray-400 w-6 h-6" />}</div>
          <div>
            <p className="text-gray-800 font-medium">{n.mensagem}</p>
            {n.data && (
              <span className="text-sm text-gray-500">
                {new Date(n.data).toLocaleString("pt-BR")}
              </span>
            )}
          </div>
        </div>
        <button
          onClick={() => excluirNotificacao(n.id)}
          className="text-red-600 hover:text-red-800 p-2 rounded-full transition"
          title="Excluir notificação"
        >
          <FaTrashAlt />
        </button>
      </div>
    );
  })}
</div>

      </div>
    </div>
  );
}
