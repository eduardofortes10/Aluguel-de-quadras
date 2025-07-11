// src/pages/conta.jsx
import React from "react";
import { useNavigate, Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import UserDropdown from "../components/DropdownUser";


export default function Conta() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
       {/* Sidebar sempre visível em desktop, oculta no mobile por padrão (ajuste se tiver menu mobile) */}
            <div className="md:block hidden">
              <Sidebar />
            </div>
      
<div className="absolute top-4 right-4 z-50">
  <UserDropdown />
</div>

      {/* Conteúdo */}
      <div className="flex-1 text-black px-6 pl-20 py-10">
        {/* Breadcrumb */}
        <div className="flex items-center py-4 overflow-x-auto whitespace-nowrap mb-6">
          <Link to="/home" className="text-gray-600 dark:text-gray-200">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
            </svg>
          </Link>

          <span className="mx-5 text-gray-500 dark:text-gray-300">/</span>
          <Link to="/perfil" className="text-gray-600 dark:text-gray-200 hover:underline">Perfil</Link>
          <span className="mx-5 text-gray-500 dark:text-gray-300">/</span>
          <span className="text-blue-600 dark:text-blue-400 font-medium">Conta</span>
        </div>

        

        {/* Formulário */}
        <div className="max-w-xl mx-auto bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6">Informações da Conta</h2>
          <form className="space-y-6">
            {/* Username */}
            <div>
              <label htmlFor="username" className="block text-sm text-gray-500 dark:text-gray-300">Username</label>
              <input disabled type="text" placeholder="John Doe" className="block bg-gray-50 cursor-not-allowed mt-2 w-full placeholder-gray-400/70 dark:placeholder-gray-500 rounded-lg border border-gray-200 px-5 py-2.5 text-gray-700 focus:outline-none dark:border-gray-600 dark:bg-gray-900 dark:text-gray-300" />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm text-gray-500 dark:text-gray-300">Email</label>
              <input type="email" placeholder="john@example.com" className="block w-full py-2.5 px-5 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-lg dark:bg-gray-900 dark:text-gray-300 dark:border-gray-600" />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm text-gray-500 dark:text-gray-300">Senha</label>
              <input type="password" placeholder="********" className="block w-full py-2.5 px-5 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-lg dark:bg-gray-900 dark:text-gray-300 dark:border-gray-600" />
            </div>

            {/* Birthday */}
            <div>
              <label htmlFor="birthday" className="block text-sm text-gray-500 dark:text-gray-300">Data de Nascimento</label>
              <input type="date" className="block w-full mt-2 px-5 py-2.5 text-gray-700 border border-gray-200 rounded-lg bg-white dark:bg-gray-900 dark:text-gray-300 dark:border-gray-600" />
            </div>
            
          </form>
          
        </div>
      </div>
    </div>
  );
}
