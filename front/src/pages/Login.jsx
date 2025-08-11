import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { api } from "../services/api";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [carregando, setCarregando] = useState(false);

  const handleLogin = async (e) => {
    e?.preventDefault();

    if (!email || !senha) {
      toast.error("Preencha todos os campos");
      return;
    }

    try {
      setCarregando(true);

      const { data: resultado } = await api.post("/auth/login", { email, senha });

      toast.success("Login realizado com sucesso!");
      localStorage.setItem("usuario_id", resultado.id);
      localStorage.setItem("nomeUsuario", resultado.nome);
      localStorage.setItem(
        "usuario",
        JSON.stringify({
          id: resultado.id,
          nome: resultado.nome,
          tipo: resultado.tipo_usuario,
        })
      );

      setTimeout(() => {
        if (resultado.tipo_usuario === "locador") {
          navigate("/home-locador");
        } else {
          navigate("/home", { state: { loginSucesso: true } });
        }
      }, 800);
    } catch (err) {
      console.error("Erro no login:", err);
      const msg = err?.response?.data?.erro || "Email ou senha inválidos";
      toast.error(msg);
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-neutral-950">
      <ToastContainer position="top-center" autoClose={2500} theme="colored" />

      {/* ÚNICA SEÇÃO — centralizada (SEM imagem lateral) */}
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden p-6">
        {/* Fundo animado (mantive o seu “clima” verde) */}
        <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_top,_rgba(16,185,129,0.25),transparent_60%),radial-gradient(ellipse_at_bottom,_rgba(6,95,70,0.35),transparent_60%)]" />
        <div className="absolute top-[-100px] right-[-200px] w-[700px] h-[700px] bg-gradient-to-br from-green-400 via-green-700 to-green-900 opacity-70 z-10 pointer-events-none rounded-full rotate-[-25deg]" />
        <div className="absolute inset-0 z-20 pointer-events-none">
          {[...Array(60)].map((_, i) => (
            <div
              key={i}
              className="particle"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 10}s`,
                animationDuration: `${10 + Math.random() * 10}s`,
              }}
            />
          ))}
        </div>

        {/* CARD */}
        <div className="relative z-30 w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-2xl p-8 sm:p-10">
            {/* Logo */}
            <div className="flex flex-col items-center mb-6">
              <img
                src="/quadras/logo-quadraflex.png"
                alt="QuadraFlex"
                className="w-20 h-20 rounded-full"
              />
              <p className="mt-3 text-gray-600 text-sm text-center">
                Entre para acessar sua conta
              </p>
            </div>

            {/* Formulário */}
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm text-gray-700">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="joao@email.com"
                  className="w-full px-4 py-2 border rounded-lg mt-1 focus:outline-none focus:ring-2 focus:ring-verdePrincipal"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="username"
                  required
                />
              </div>

              <div>
                <label htmlFor="senha" className="block text-sm text-gray-700">
                  Senha
                </label>
                <input
                  id="senha"
                  type="password"
                  placeholder="Sua senha"
                  className="w-full px-4 py-2 border rounded-lg mt-1 focus:outline-none focus:ring-2 focus:ring-verdePrincipal"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  autoComplete="current-password"
                  required
                />
                <div className="text-right mt-1">
                  <Link to="/esqueceu-senha" className="text-sm text-verdePrincipal hover:underline">
                    Esqueceu a senha?
                  </Link>
                </div>
              </div>

              <button
                type="submit"
                disabled={carregando}
                className={`w-full text-white py-2 px-4 rounded-lg transition-colors mt-2 ${
                  carregando ? "bg-green-400 cursor-not-allowed" : "bg-verdePrincipal hover:bg-green-600"
                }`}
              >
                {carregando ? "Entrando..." : "Entrar"}
              </button>

              <p className="mt-4 text-sm text-center text-gray-600">
                Não tem uma conta?{" "}
                <Link to="/Register" className="text-verdePrincipal hover:underline">
                  Registre-se
                </Link>
              </p>

              {/* Social */}
              <div className="mt-6">
                <div className="flex items-center gap-4 text-xs text-gray-400">
                  <div className="h-px flex-1 bg-gray-200" />
                  <span>ou entre com</span>
                  <div className="h-px flex-1 bg-gray-200" />
                </div>
                <div className="flex items-center justify-center gap-3 mt-4">
                  <button className="w-10 h-10 flex items-center justify-center rounded-full bg-black hover:opacity-90 transition">
                    <img src="/icons/apple-icon.svg" alt="Apple" className="w-5 h-5" />
                  </button>
                  <button className="w-10 h-10 flex items-center justify-center rounded-full bg-white border hover:shadow-md transition">
                    <img src="/icons/google-icon.svg" alt="Google" className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
        {/* fim do card */}
      </div>
    </div>
  );
}

export default Login;
