import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import UserDropdown from "../components/DropdownUser";
import MobileNav from "../components/MobileNav";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { api } from "../services/api";

export default function Conta() {
  const navigate = useNavigate();
  const usuarioId = localStorage.getItem("usuario_id");

  const [dados, setDados] = useState({
    nome: "",
    email: "",
    telefone: "",
    data_nascimento: "",
  });
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    // se não estiver logado, manda pro login
    if (!usuarioId) {
      navigate("/login");
      return;
    }

    const buscarDados = async () => {
      try {
        const res = await api.get(`/usuarios/${usuarioId}`);
        const dadosUsuario = res.data || {};

        if (dadosUsuario.data_nascimento) {
          dadosUsuario.data_nascimento = new Date(dadosUsuario.data_nascimento)
            .toISOString()
            .split("T")[0];
        }

        setDados({
          nome: dadosUsuario.nome || "",
          email: dadosUsuario.email || "",
          telefone: dadosUsuario.telefone || "",
          data_nascimento: dadosUsuario.data_nascimento || "",
        });
      } catch (err) {
        console.error("Erro ao buscar dados:", err);
        toast.error("❌ Não foi possível carregar seus dados.", {
          position: "top-right",
          autoClose: 3000,
          theme: "colored",
        });
      } finally {
        setCarregando(false);
      }
    };

    buscarDados();
  }, [usuarioId, navigate]);

  const handleChange = (e) => {
    setDados({ ...dados, [e.target.name]: e.target.value });
  };

  const salvarAlteracoes = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/usuarios/${usuarioId}`, dados);
      toast.success("✅ Dados atualizados com sucesso!", {
        position: "top-right",
        autoClose: 3000,
        theme: "colored",
      });
    } catch (err) {
      console.error("Erro ao salvar alterações:", err);
      toast.error("❌ Erro ao salvar alterações!", {
        position: "top-right",
        autoClose: 3000,
        theme: "colored",
      });
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar desktop */}
      <div className="md:block hidden">
        <Sidebar />
      </div>

      {/* Nav mobile */}
      <div className="md:hidden block w-full">
        <MobileNav />
      </div>

      <div className="absolute top-4 right-4 z-50">
        <UserDropdown />
      </div>

      <div className="flex-1 text-black px-6 md:pl-20 py-10">
        {/* Breadcrumb */}
        <div className="flex items-center py-4 overflow-x-auto whitespace-nowrap mb-6">
          <Link to="/home" className="text-gray-600 dark:text-gray-200">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
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

          {carregando ? (
            <p className="text-gray-600 dark:text-gray-300">Carregando...</p>
          ) : (
            <form className="space-y-6" onSubmit={salvarAlteracoes}>
              {/* Nome */}
              <div>
                <label htmlFor="nome" className="block text-sm text-gray-500 dark:text-gray-300">Nome</label>
                <input
                  name="nome"
                  type="text"
                  value={dados.nome}
                  onChange={handleChange}
                  className="block w-full py-2.5 px-5 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-lg dark:bg-gray-900 dark:text-gray-300 dark:border-gray-600"
                />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm text-gray-500 dark:text-gray-300">Email</label>
                <input
                  name="email"
                  type="email"
                  value={dados.email}
                  onChange={handleChange}
                  className="block w-full py-2.5 px-5 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-lg dark:bg-gray-900 dark:text-gray-300 dark:border-gray-600"
                />
              </div>

              {/* Telefone */}
              <div>
                <label htmlFor="telefone" className="block text-sm text-gray-500 dark:text-gray-300">Telefone</label>
                <input
                  name="telefone"
                  type="tel"
                  value={dados.telefone}
                  onChange={handleChange}
                  placeholder="(xx) xxxxx-xxxx"
                  className="block w-full py-2.5 px-5 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-lg dark:bg-gray-900 dark:text-gray-300 dark:border-gray-600"
                />
              </div>

              {/* Data de Nascimento */}
              <div>
                <label htmlFor="data_nascimento" className="block text-sm text-gray-500 dark:text-gray-300">Data de Nascimento</label>
                <input
                  name="data_nascimento"
                  type="date"
                  value={dados.data_nascimento}
                  onChange={handleChange}
                  className="block w-full mt-2 px-5 py-2.5 text-gray-700 border border-gray-200 rounded-lg bg-white dark:bg-gray-900 dark:text-gray-300 dark:border-gray-600"
                />
              </div>

              {/* Botão Salvar */}
              <div className="pt-4">
                <button
                  type="submit"
                  className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
                >
                  Salvar Alterações
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Toast container */}
      <ToastContainer />
    </div>
  );
}
