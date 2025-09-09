// src/pages/notificacao.jsx
import React, { useEffect, useState } from "react";
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

import { getNotificacoes, deleteNotificacao } from "../services/notificacoes";
import { api } from "../services/api";

// helper: resolve ID do usuário (apenas para feedback amigável)
async function getUsuarioIdSeguro() {
  try {
    const raw = localStorage.getItem("usuario");
    if (raw) {
      const u = JSON.parse(raw);
      if (u?.id) return Number(u.id);
      if (u?.usuario_id) return Number(u.usuario_id);
    }
    const uidStr = localStorage.getItem("usuario_id");
    if (uidStr && /^\d+$/.test(uidStr)) return Number(uidStr);

    // tenta /auth/me (se token já está no axios)
    const { data } = await api.get("/auth/me");
    if (data?.id) return Number(data.id);
    if (data?.usuario_id) return Number(data.usuario_id);
  } catch {}
  return null;
}

export default function Notificacao() {
  const [items, setItems] = useState([]);
  const [carregando, setCarregando] = useState(true);

  const icones = {
    aprovacao: <FaCheckCircle className="text-green-500 w-6 h-6" />,
    reserva: <FaCalendarAlt className="text-blue-500 w-6 h-6" />,
    pagamento: <FaMoneyCheckAlt className="text-yellow-500 w-6 h-6" />,
    favorito: <FaCheckCircle className="text-pink-500 w-6 h-6" />,
    aluguel: <FaCalendarAlt className="text-purple-500 w-6 h-6" />,
  };

  async function carregar() {
    try {
      setCarregando(true);
      const uid = await getUsuarioIdSeguro();
      if (!uid) {
        setItems([]);
        toast.info("Entre na sua conta para ver as notificações.");
        return;
      }

      // ✅ chamada correta: o backend usa o id do token, não precisa passar uid
      const { data } = await getNotificacoes();
      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Erro ao carregar notificações:", err?.response?.data || err?.message);
      toast.error("Não foi possível carregar as notificações.");
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregar();
  }, []);

  async function excluir(id) {
    try {
      await deleteNotificacao(id);
      setItems((prev) => prev.filter((n) => n.id !== id));
      toast.success("Notificação excluída!");
    } catch (err) {
      console.error("Erro ao excluir notificação:", err?.response?.data || err?.message);
      toast.error("Erro ao excluir notificação.");
    }
  }

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

        {/* Topo com dropdown e sino */}
        <div className="flex justify-end items-center mb-4 gap-4">
          <div className="relative">
            <FaBell className="text-gray-700 w-6 h-6" />
            {items.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
                {items.length}
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
            {items.length}
          </span>
        </h1>

        {/* Lista / estados */}
        {carregando ? (
          <div className="text-gray-500">Carregando notificações...</div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center p-8 bg-white rounded-lg border shadow">
            <FaBell className="w-10 h-10 text-gray-400 mb-2" />
            <p className="text-gray-700 font-medium">Nenhuma notificação por aqui</p>
            <p className="text-gray-500 text-sm">Quando algo acontecer, você verá por aqui.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {items.map((n) => (
              <div
                key={n.id}
                className="flex items-start justify-between p-4 bg-white border-l-4 border-green-600 shadow rounded-lg hover:bg-green-50 transition-all"
              >
                <div className="flex items-start gap-4">
                  <div>{icones[n.tipo] || <FaCheckCircle className="text-gray-400 w-6 h-6" />}</div>
                  <div>
                    <p className="text-gray-800 font-medium">{n.mensagem}</p>
                    {n.data && (
                      <span className="text-sm text-gray-500 block">
                        {new Date(n.data).toLocaleString("pt-BR")}
                      </span>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => excluir(n.id)}
                  className="text-red-600 hover:text-red-800 p-2 rounded-full transition"
                  title="Excluir notificação"
                >
                  <FaTrashAlt />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
