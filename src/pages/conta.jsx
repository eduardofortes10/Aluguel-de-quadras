// src/pages/conta.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

export default function Conta() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen overflow-x-hidden">
      {/* Sidebar */}
      <div className="w-16 bg-[#1E8449] text-white flex flex-col items-center py-4 space-y-4 fixed h-full">
        <div className="w-8 h-8 rounded-full bg-white"></div>

        <button title="Home" onClick={() => navigate("/home")} className="p-2 hover:bg-green-700 rounded-lg">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor"
            viewBox="0 0 24 24" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M3 9.75L12 4l9 5.75M4.5 10.5v8.25a.75.75 0 00.75.75H9v-5.25h6v5.25h3.75a.75.75 0 00.75-.75V10.5" />
          </svg>
        </button>

        <button title="Favoritos" className="p-2 hover:bg-green-700 rounded-lg">
          <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="w-6 h-6" viewBox="0 0 24 24">
            <path d="M6 4a4 4 0 00-4 4c0 5 10 12 10 12s10-7 10-12a4 4 0 00-4-4c-1.6 0-3 .9-4 2.09C13 4.9 11.6 4 10 4z" />
          </svg>
        </button>

        <button title="Chat" className="p-2 hover:bg-green-700 rounded-lg">
          <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="w-6 h-6" viewBox="0 0 24 24">
            <path d="M2 5a2 2 0 012-2h16a2 2 0 012 2v12a2 2 0 01-2 2H6l-4 4V5z" />
          </svg>
        </button>

        <button title="Perfil" onClick={() => navigate("/perfil")} className="p-2 bg-green-700 rounded-lg">
          <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="w-6 h-6" viewBox="0 0 24 24">
            <path d="M12 12a5 5 0 100-10 5 5 0 000 10zm0 2c-3.3 0-10 1.7-10 5v1h20v-1c0-3.3-6.7-5-10-5z" />
          </svg>
        </button>
      </div>

      {/* Conteúdo */}
      <div className="flex-1 bg-gray-50 dark:bg-gray-900 text-black px-6 pl-20 py-10">
  {/* Breadcrumb */}
  <div className="flex items-center py-4 overflow-x-auto whitespace-nowrap mb-6">
    
    {/* Home */}
    <Link to="/home" className="text-gray-600 dark:text-gray-200">
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
        <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
      </svg>
    </Link>

    {/* Seta */}
    <span className="mx-5 text-gray-500 dark:text-gray-300 rtl:-scale-x-100">
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
      </svg>
    </span>

    {/* Perfil */}
    <Link to="/perfil" className="text-gray-600 dark:text-gray-200 hover:underline">Perfil</Link>

    {/* Seta */}
    <span className="mx-5 text-gray-500 dark:text-gray-300 rtl:-scale-x-100">
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
      </svg>
    </span>

    {/* Página atual (sem link) */}
    <span className="text-blue-600 dark:text-blue-400 font-medium">Conta</span>
  </div>

        {/* Formulário */}
        <div className="max-w-xl mx-auto bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6">Informações da Conta</h2>
          <form className="space-y-6">
            {/* Username */}
            <div>
              <label htmlFor="username" className="block text-sm text-gray-500 dark:text-gray-300">Username</label>
              <input disabled type="text" placeholder="John Doe" className="block bg-gray-50 cursor-not-allowed mt-2 w-full placeholder-gray-400/70 dark:placeholder-gray-500 rounded-lg border border-gray-200 px-5 py-2.5 text-gray-700 focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:focus:border-blue-300" />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm text-gray-500 dark:text-gray-300">Email</label>
              <div className="relative flex items-center mt-2">
                <span className="absolute left-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                  </svg>
                </span>
                <input type="email" placeholder="john@example.com" className="block w-full py-2.5 pl-11 pr-5 text-gray-700 placeholder-gray-400/70 bg-white border border-gray-200 rounded-lg dark:bg-gray-900 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40" />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm text-gray-500 dark:text-gray-300">Senha</label>
                <a href="#" className="text-xs text-gray-600 hover:underline dark:text-gray-400">Esqueceu?</a>
              </div>
              <div className="relative flex items-center mt-2">
                <button type="button" className="absolute right-0 pr-4 focus:outline-none">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="w-6 h-6 text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400" viewBox="0 0 24 24">
                    <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
                    <path fillRule="evenodd" d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 010-1.113zM17.25 12a5.25 5.25 0 11-10.5 0 5.25 5.25 0 0110.5 0z" clipRule="evenodd" />
                  </svg>
                </button>
                <input type="password" placeholder="********" className="block w-full py-2.5 px-5 pr-12 text-gray-700 placeholder-gray-400/70 bg-white border border-gray-200 rounded-lg dark:bg-gray-900 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40" />
              </div>
            </div>

            {/* Birthday */}
            <div>
              <label htmlFor="birthday" className="block text-sm text-gray-500 dark:text-gray-300">Data de Nascimento</label>
              <input type="date" className="block mt-2 w-full placeholder-gray-400/70 dark:placeholder-gray-500 rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-gray-700 focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:focus:border-blue-300" />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
