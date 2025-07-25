import React from "react";
import Sidebar from "../components/Sidebar";
import { Link } from "react-router-dom";
import UserDropdown from "../components/DropdownUser";
import MobileNav from "../components/MobileNav";
export default function Pagamento() {
  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
       {/* Sidebar sempre visível em desktop, oculta no mobile por padrão (ajuste se tiver menu mobile) */}
            <div className="md:block hidden">
              <Sidebar />
            </div>

<div className="absolute top-4 right-4 z-50">
  <UserDropdown />
</div>


      <div className="flex-1 p-8 ml-16 text-gray-800 dark:text-white">
        {/* Breadcrumb */}
        <div className="flex items-center py-4 overflow-x-auto whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
          <Link to="/home" className="text-gray-600 dark:text-gray-200">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
            </svg>
          </Link>

          <span className="mx-2">/</span>
          <Link to="/perfil" className="hover:underline text-gray-600 dark:text-gray-200">Perfil</Link>
          <span className="mx-2">/</span>
          <span className="text-blue-600 dark:text-blue-400 font-medium">Pagamento</span>
        </div>

        {/* Formulário de Pagamento */}
        <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Método de Pagamento</h2>

          <label className="text-sm text-gray-600 dark:text-gray-400">Seus Cartões</label>
          <div className="space-y-2 mb-6">
            <input disabled value="💳 **** **** **** 5342" className="w-full px-4 py-2 border rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white" />
            <input disabled value="💳 **** **** **** 7890" className="w-full px-4 py-2 border rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white" />
          </div>

          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Para adicionar um novo cartão:</p>
          <input type="text" placeholder="Número do cartão" className="w-full mb-3 px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white" />
          <input type="text" placeholder="Nome no cartão" className="w-full mb-4 px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white" />

          <div className="flex gap-2 mb-6">
            <select className="w-1/3 px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white">
              <option>MM</option>
              {[...Array(12)].map((_, i) => (
                <option key={i + 1}>{String(i + 1).padStart(2, '0')}</option>
              ))}
            </select>
            <select className="w-1/3 px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white">
              <option>AA</option>
              {[...Array(10)].map((_, i) => (
                <option key={i}>{24 + i}</option>
              ))}
            </select>
            <input type="text" placeholder="CVV" className="w-1/3 px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white" />
          </div>

          <div className="flex justify-end">
            <button className="bg-green-600 hover:bg-green-700 text-white font-medium px-5 py-2 rounded-full shadow-md transition">
              Adicionar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
