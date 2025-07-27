import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const handleLogin = async () => {
    if (!email || !senha) {
      toast.error("Preencha todos os campos");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha }),
      });

      const resultado = await response.json();

      if (response.ok) {
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
        }, 1200);
      } else {
        toast.error(resultado.erro || "Email ou senha inválidos");
      }
    } catch (err) {
      console.error("Erro no login:", err);
      toast.error("Erro ao conectar com o servidor");
    }
  };

  return (
    <div className="flex h-screen">
      <ToastContainer position="top-center" autoClose={2500} theme="colored" />

      {/* Lado esquerdo */}
      <div
        className="hidden lg:flex w-2/3 bg-cover bg-center items-center justify-center p-16"
        style={{ backgroundImage: "url('/quadras/logo-fundo.png')" }}
      >
        <div className="bg-black bg-opacity-50 p-10 rounded-xl">
          <h2 className="text-4xl font-bold text-white">QuadraFlex</h2>
          <p className="mt-4 text-gray-200 text-lg">
            Bem-vindo ao QuadraFlex! Reserve quadras esportivas perto de você de
            forma rápida e prática. Futebol, basquete, tênis e muito mais.
          </p>
        </div>
      </div>

      {/* Lado direito */}
      <div className="relative flex w-full lg:w-1/3 items-center justify-center overflow-hidden">
        {/* Fundo animado */}
        <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-green-400 via-green-700 to-green-900 animate-blob" />
        <div className="absolute top-[-100px] right-[-200px] w-[700px] h-[700px] bg-gradient-to-bl from-white/70 via-lime-200/40 to-transparent blur-[100px] opacity-70 z-10 pointer-events-none rounded-full rotate-[-25deg]" />
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

        {/* Card */}
        <div className="relative z-30 w-full max-w-md bg-white p-8 rounded-2xl shadow-[20px_20px_60px_rgba(0,0,0,0.2),_-10px_10px_40px_rgba(0,0,0,0.15)]">
          <div className="flex flex-col items-center">
            <img src="/quadras/logo-quadraflex.png" alt="Logo" className="w-24 h-24 rounded-full mb-4" />
            <p className="text-gray-700 text-sm mb-6 text-center">Entre para acessar sua conta</p>
          </div>

          {/* Formulário */}
          <form onSubmit={(e) => e.preventDefault()}>
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm text-gray-700">Email</label>
              <input
                type="email"
                id="email"
                placeholder="exemplo@email.com"
                className="w-full px-4 py-2 border rounded-lg mt-1 focus:outline-none focus:ring-2 focus:ring-verdePrincipal"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="mb-4">
              <label htmlFor="senha" className="block text-sm text-gray-700">Senha</label>
              <input
                type="password"
                id="senha"
                placeholder="Sua senha"
                className="w-full px-4 py-2 border rounded-lg mt-1 focus:outline-none focus:ring-2 focus:ring-verdePrincipal"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
              />
              <div className="text-right mt-1">
                <Link to="/esqueceu-senha" className="text-sm text-verdePrincipal hover:underline">
                  Esqueceu a senha?
                </Link>
              </div>
            </div>

            <button
              onClick={handleLogin}
              type="submit"
              className="w-full bg-verdePrincipal text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors mt-2"
            >
              Entrar
            </button>

            <p className="mt-4 text-sm text-center text-gray-600">
              Não tem uma conta?{" "}
              <Link to="/Register" className="text-verdePrincipal hover:underline">
                Registre-se
              </Link>
            </p>
          </form>

          {/* Divisor */}
          <div className="flex items-center my-6">
            <hr className="flex-grow border-gray-300" />
            <span className="mx-2 text-gray-500 text-sm">ou entre com</span>
            <hr className="flex-grow border-gray-300" />
          </div>

          {/* Botões sociais */}
          <div className="flex justify-center gap-4">
            <button className="w-10 h-10 flex items-center justify-center rounded-full bg-black hover:opacity-90 transition">
              <img src="/icons/apple-icon.svg" alt="Apple" className="w-5 h-5" />
            </button>
            <button className="w-10 h-10 flex items-center justify-center rounded-full bg-white border hover:shadow-md transition">
              <img src="/icons/google-icon.svg" alt="Google" className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
