// src/pages/Notificacoes.jsx
import React, { useState, useEffect, useMemo } from "react";
import Sidebar from "../components/Sidebar";
import UserDropdown from "../components/DropdownUser";
import MobileNav from "../components/MobileNav";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { api } from "../services/api";
import {
  Bell,
  CheckCircle2,
  CalendarDays,
  CreditCard,
  Heart,
  CalendarCheck,
  Trash2,
  Home,
} from "lucide-react";

export default function Notificacoes() {
  const [notificacoes, setNotificacoes] = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const userId = localStorage.getItem("usuario_id");
    if (!userId) {
      setCarregando(false);
      toast.info("Você precisa estar logado para ver as notificações.");
      return;
    }

    let cancelado = false;
    async function buscarNotificacoes() {
      try {
        setCarregando(true);
        const res = await api.get(`/notificacoes/${userId}`);
        if (!cancelado) {
          const data = Array.isArray(res.data) ? res.data : [];
          setNotificacoes(data);
        }
      } catch (error) {
        console.error("❌ Erro ao buscar notificações:", error?.response?.data || error?.message);
        toast.error("Não foi possível carregar as notificações.");
      } finally {
        if (!cancelado) setCarregando(false);
      }
    }

    buscarNotificacoes();
    return () => {
      cancelado = true;
    };
  }, []);

  const tipos = useMemo(
    () => ({
      aprovacao: { Icon: CheckCircle2, bg: "bg-green-100", fg: "text-green-700", ring: "ring-green-200" },
      reserva: { Icon: CalendarDays, bg: "bg-blue-100", fg: "text-blue-700", ring: "ring-blue-200" },
      pagamento: { Icon: CreditCard, bg: "bg-amber-100", fg: "text-amber-700", ring: "ring-amber-200" },
      favorito: { Icon: Heart, bg: "bg-pink-100", fg: "text-pink-700", ring: "ring-pink-200" },
      aluguel: { Icon: CalendarCheck, bg: "bg-purple-100", fg: "text-purple-700", ring: "ring-purple-200" },
    }),
    []
  );

  const excluirNotificacao = async (id) => {
    try {
      await api.delete(`/notificacoes/${id}`);
      setNotificacoes((prev) => prev.filter((n) => n.id !== id));
      toast.success("Notificação excluída com sucesso!");
    } catch (error) {
      console.error("❌ Erro ao excluir notificação:", error?.response?.data || error?.message);
      toast.error("Erro ao excluir notificação.");
    }
  };

  /* Skeleton simples */
  const Skeleton = () => (
    <div className="p-4 rounded-xl bg-white ring-1 ring-black/5 shadow animate-pulse">
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-full bg-gray-200" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-200 rounded w-1/2" />
          <div className="h-3 bg-gray-200 rounded w-1/3" />
        </div>
        <div className="w-8 h-8 bg-gray-200 rounded-full" />
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-neutral-50">
      <ToastContainer />

      {/* Sidebar (desktop) */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* Conteúdo */}
      <main className="flex-1 w-full">
        {/* HEADER full-bleed (sem “corte”) */}
        <section className="relative mt-12 md:mt-4 -mx-3 sm:-mx-4 md:-mx-6 lg:-mx-8">
          <div className="relative rounded-b-3xl shadow-sm">
            <div className="absolute inset-0 rounded-b-3xl bg-gradient-to-br from-emerald-700 via-emerald-600 to-emerald-800" />
            <div className="relative px-3 sm:px-4 md:px-6 lg:px-8 py-4 md:py-6 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-white grid place-items-center shadow">
                      <Bell className="w-5 h-5 text-emerald-700" />
                    </div>
                    {notificacoes.length > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-semibold px-1.5 py-[1px] rounded-full shadow">
                        {notificacoes.length}
                      </span>
                    )}
                  </div>
                  <h1 className="text-xl md:text-2xl font-semibold">Notificações</h1>
                  <span className="ml-2 bg-white/90 text-emerald-900 text-xs font-bold px-2 py-1 rounded-full">
                    {notificacoes.length}
                  </span>
                </div>

                <div className="relative z-50">
                  <UserDropdown />
                </div>
              </div>

              {/* Chips de breadcrumb */}
              <div className="mt-3 flex items-center gap-2 text-xs md:text-sm">
                <Link
                  to="/home"
                  className="inline-flex items-center gap-1 bg-white/15 hover:bg-white/25 text-white px-2 py-1 rounded-md transition"
                >
                  <Home className="w-4 h-4" /> Início
                </Link>
                <span className="opacity-70">/</span>
                <Link
                  to="/perfil"
                  className="inline-flex items-center bg-white/15 hover:bg-white/25 text-white px-2 py-1 rounded-md transition"
                >
                  Perfil
                </Link>
                <span className="opacity-70">/</span>
                <span className="font-semibold">Notificações</span>
              </div>
            </div>
          </div>
        </section>

        {/* Área central */}
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-6">
          {/* Mobile nav (mantido no bottom como estava) */}
          <div className="md:hidden fixed bottom-14 left-0 w-full bg-[#14532d] p-4 flex justify-between items-center z-50 shadow-inner">
            <MobileNav />
          </div>

          {/* Estados */}
          {carregando ? (
            <div className="space-y-3">
              <Skeleton />
              <Skeleton />
              <Skeleton />
            </div>
          ) : notificacoes.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center p-8 bg-white rounded-xl ring-1 ring-black/5 shadow">
              <Bell className="w-10 h-10 text-gray-400 mb-2" />
              <p className="text-gray-800 font-medium">Nenhuma notificação por aqui</p>
              <p className="text-gray-500 text-sm">Quando algo acontecer, você verá por aqui.</p>
              <Link
                to="/home"
                className="mt-4 inline-block bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm hover:bg-emerald-800 transition"
              >
                Voltar ao início
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {notificacoes.map((n) => {
                const meta = tipos[n.tipo] || { Icon: CheckCircle2, bg: "bg-gray-100", fg: "text-gray-700", ring: "ring-gray-200" };
                const Icon = meta.Icon;
                return (
                  <div
                    key={n.id}
                    className={`flex items-start justify-between p-4 bg-white rounded-xl shadow ring-1 ring-black/5 hover:shadow-md transition`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`shrink-0 rounded-full p-2 ${meta.bg} ${meta.ring} ring-1`}>
                        <Icon className={`w-5 h-5 ${meta.fg}`} />
                      </div>
                      <div>
                        <p className="text-gray-900 font-medium">{n.mensagem}</p>
                        {n.data && (
                          <span className="text-sm text-gray-500 block">
                            {new Date(n.data).toLocaleString("pt-BR")}
                          </span>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => excluirNotificacao(n.id)}
                      className="text-red-600 hover:text-red-800 p-2 rounded-full transition"
                      title="Excluir notificação"
                      aria-label="Excluir notificação"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
