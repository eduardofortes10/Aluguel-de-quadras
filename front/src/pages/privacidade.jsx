import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import UserDropdown from "../components/DropdownUser";
import MobileNav from "../components/MobileNav";
import { Link } from "react-router-dom";

export default function Privacidade() {
  const [authMethod, setAuthMethod] = useState("email");

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

      <div className="flex-1 px-6 pt-24 md:pt-8 pb-12 md:ml-64 text-gray-800 dark:text-gray-200">
        {/* User menu topo (desktop) */}
        <div className="hidden md:flex justify-end mb-4">
          <UserDropdown />
        </div>

        {/* Breadcrumb */}
        <div className="flex items-center py-4 overflow-x-auto whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
          <Link to="/home" className="text-gray-600 dark:text-gray-200 hover:underline flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
            </svg>
            Início
          </Link>
          <span className="mx-2">/</span>
          <Link to="/perfil" className="text-gray-600 dark:text-gray-200 hover:underline">
            Perfil
          </Link>
          <span className="mx-2">/</span>
          <span className="text-blue-600 dark:text-blue-400 font-medium">Privacidade</span>
        </div>

        <h2 className="text-2xl font-semibold mb-6 mt-2">Segurança e Privacidade</h2>

        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 space-y-6">
          {/* Autenticação 2 Fatores */}
          <div>
            <h3 className="text-lg font-medium mb-2">Autenticação em 2 Fatores</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Adicione uma camada extra de segurança à sua conta usando autenticação por e-mail ou telefone.
            </p>

            <div className="flex gap-4 mb-4">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="authMethod"
                  value="email"
                  checked={authMethod === "email"}
                  onChange={() => setAuthMethod("email")}
                  className="form-radio text-green-600"
                />
                <span className="ml-2">Autenticar por E-mail</span>
              </label>

              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="authMethod"
                  value="telefone"
                  checked={authMethod === "telefone"}
                  onChange={() => setAuthMethod("telefone")}
                  className="form-radio text-green-600"
                />
                <span className="ml-2">Autenticar por Telefone</span>
              </label>
            </div>

            {/* Campo dinâmico */}
            {authMethod === "email" ? (
              <div>
                <label htmlFor="email" className="block text-sm text-gray-500 dark:text-gray-300">
                  Endereço de e-mail
                </label>
                <div className="relative flex items-center mt-2">
                  <span className="absolute left-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                    </svg>
                  </span>
                  <input
                    type="email"
                    placeholder="john@example.com"
                    className="block w-full py-2.5 pl-11 pr-5 text-gray-700 placeholder-gray-400/70 bg-white border border-gray-200 rounded-lg dark:bg-gray-900 dark:text-gray-300 dark:border-gray-600 focus:border-green-500 focus:ring focus:ring-green-300 focus:outline-none focus:ring-opacity-40"
                  />
                </div>
              </div>
            ) : (
              <div>
                <label htmlFor="telefone" className="block text-sm text-gray-500 dark:text-gray-300">
                  Número de telefone
                </label>
                <div className="relative flex items-center mt-2">
                  <span className="absolute left-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                    </svg>
                  </span>
                  <input
                    type="tel"
                    placeholder="+55 (11) 91234-5678"
                    className="block w-full py-2.5 pl-11 pr-5 text-gray-700 placeholder-gray-400/70 bg-white border border-gray-200 rounded-lg dark:bg-gray-900 dark:text-gray-300 dark:border-gray-600 focus:border-green-500 focus:ring focus:ring-green-300 focus:outline-none focus:ring-opacity-40"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Login por Biometria */}
          <div>
            <h3 className="text-lg font-medium mb-2">Login por Biometria</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Permita o login usando impressão digital ou reconhecimento facial.
            </p>
            <button
              type="button"
              onClick={() => alert("Demonstração: aqui você ativaria WebAuthn/Passkeys.")}
              className="flex items-center px-5 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg shadow"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" className="w-5 h-5 mr-2" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c.714 0 1.404.161 2 .448m-4 0A4.002 4.002 0 0112 11m0 0a4.002 4.002 0 012 7.75M12 11a4.002 4.002 0 00-2 7.75M8 21h8m-4-4v4" />
              </svg>
              Ativar Biometria
            </button>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              *Para produção, considere implementar Passkeys/WebAuthn.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
