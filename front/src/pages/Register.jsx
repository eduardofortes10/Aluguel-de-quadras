import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { api } from "../services/api";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nome: "",
    email: "",
    senha: "",
    tipo: "cliente",
  });

  const [carregando, setCarregando] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!form.nome || !form.email || !form.senha) {
      toast.error("Preencha todos os campos");
      return;
    }

    try {
      setCarregando(true);
      const { data } = await api.post("/auth/register", form);
      toast.success("Cadastro realizado com sucesso!");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      console.error("Erro no registro:", err);
      toast.error("Erro ao registrar usuário");
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{
        backgroundImage: `url(${import.meta.env.VITE_FILES_ORIGIN}/quadras/logo-fundo.png)`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold mb-6 text-center">Criar Conta</h2>
        <form onSubmit={handleRegister}>
          <input
            type="text"
            name="nome"
            placeholder="Nome"
            value={form.nome}
            onChange={handleChange}
            className="w-full p-2 mb-4 border border-gray-300 rounded"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="w-full p-2 mb-4 border border-gray-300 rounded"
          />
          <input
            type="password"
            name="senha"
            placeholder="Senha"
            value={form.senha}
            onChange={handleChange}
            className="w-full p-2 mb-4 border border-gray-300 rounded"
          />

          <select
            name="tipo"
            value={form.tipo}
            onChange={handleChange}
            className="w-full p-2 mb-4 border border-gray-300 rounded"
          >
            <option value="cliente">Cliente</option>
            <option value="locador">Locador</option>
          </select>

          <button
            type="submit"
            disabled={carregando}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 rounded"
          >
            {carregando ? "Cadastrando..." : "Cadastrar"}
          </button>
        </form>

        <p className="mt-4 text-sm text-center">
          Já tem uma conta?{" "}
          <Link to="/login" className="text-green-600 hover:underline">
            Entrar
          </Link>
        </p>
      </div>
      <ToastContainer />
    </div>
  );
}
