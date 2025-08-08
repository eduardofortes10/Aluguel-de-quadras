import React from "react";
import Sidebar from "../components/Sidebar";
import { Link } from "react-router-dom";
import UserDropdown from "../components/DropdownUser";
import MobileNav from "../components/MobileNav";

export default function Pagamento() {
  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Sidebar desktop */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* Mobile nav */}
      <div className="md:hidden fixed top-0 left-0 w-full z-50">
        <MobileNav />
      </div>

      <div className="flex-1 px-6 pt-24 md:pt-8 pb-12 md:ml-64 text-gray-800 dark:text-white">
        {/* User menu topo */}
        <div className="hidden md:flex justify-end mb-4">
          <UserDropdown />
        </div>

        {/* Breadcrumb */}
        <div className="flex items-center py-4 overflow-x-auto whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
          <Link to="/home" className="text-gray-600 dark:text-gray-200 hover:underline flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
            </svg>
            Início
          </Link>
          <span className="mx-2">/</span>
          <Link to="/perfil" className="hover:underline text-gray-600 dark:text-gray-200">
            Perfil
          </Link>
          <span className="mx-2">/</span>
          <span className="text-blue-600 dark:text-blue-400 font-medium">Pagamento</span>
        </div>

        {/* Formulário de Pagamento */}
        <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-6">Método de Pagamento</h2>

          <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">Seus Cartões</label>
          <div className="space-y-2 mb-6">
            <input
              disabled
              value="💳 **** **** **** 5342"
              className="w-full px-4 py-2 border rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white"
            />
            <input
              disabled
              value="💳 **** **** **** 7890"
              className="w-full px-4 py-2 border rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white"
            />
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              // TODO: integrar com backend de pagamentos/tokenização
              alert("Cartão adicionado (exemplo).");
            }}
          >
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Adicionar novo cartão</p>

            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9 ]*"
              placeholder="Número do cartão"
              className="w-full mb-3 px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
              required
            />
            <input
              type="text"
              placeholder="Nome no cartão"
              className="w-full mb-4 px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
              required
            />

            <div className="flex gap-2 mb-6">
              <select
                className="w-1/3 px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                defaultValue=""
                required
              >
                <option value="" disabled>
                  MM
                </option>
                {[...Array(12)].map((_, i) => (
                  <option key={i + 1}>{String(i + 1).padStart(2, "0")}</option>
                ))}
              </select>

              <select
                className="w-1/3 px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                defaultValue=""
                required
              >
                <option value="" disabled>
                  AA
                </option>
                {[...Array(12)].map((_, i) => (
                  <option key={i}>{24 + i}</option>
                ))}
              </select>

              <input
                type="password"
                placeholder="CVV"
                maxLength={4}
                className="w-1/3 px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                required
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white font-medium px-5 py-2 rounded-full shadow-md transition"
              >
                Adicionar
              </button>
            </div>
          </form>

          {/* Aviso de demonstração */}
          <p className="mt-4 text-xs text-gray-500 dark:text-gray-400">
            *Tela demonstrativa. Para produção, integre um provedor (ex.: Stripe, Mercado Pago) e nunca envie dados
            de cartão sem tokenização.
          </p>
        </div>
      </div>
    </div>
  );
}
