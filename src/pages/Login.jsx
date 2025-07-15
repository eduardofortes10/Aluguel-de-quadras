import React, { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import MobileNav from "../components/MobileNav";
function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');


  const handleLogin = async (e) => {
  e.preventDefault();

  try {
    const response = await fetch("http://localhost:3001/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, senha }),
    });

    const data = await response.json();

    if (response.ok) {
      alert("Login bem-sucedido!");
      localStorage.setItem("usuario", JSON.stringify(data.user));
      if (data.user.tipo === "locador") {
  navigate("/home-locador");
} else {
  navigate("/Home");
}

    } else {
      alert(data.error || "Erro ao fazer login");
    }
  } catch (err) {
    console.error("Erro no login:", err);
    alert("Erro no servidor");
  }
};


  return (
    <div className="flex h-screen">
      {/* Lado esquerdo - fundo com imagem do public */}
      <div
        className="hidden lg:flex w-2/3 bg-cover bg-center items-center justify-center p-16"
        style={{ backgroundImage: "url('/quadras/logo-fundo.png')" }}
      >
        <div className="bg-black bg-opacity-40 p-8 rounded-lg">
          <h2 className="text-3xl font-bold text-white">QuadraFlex</h2>
          <p className="mt-4 max-w-md text-gray-200">
            Bem-vindo ao QuadraFlex! Aqui você encontra a maneira mais rápida e prática de reservar quadras esportivas perto de você.
            Seja para jogar futebol, basquete, tênis ou qualquer outra modalidade, nos conectamos você aos melhores espaços
            com horários flexíveis, preços acessíveis e confirmação imediata.
          </p>
        </div>
      </div>

      {/* Lado direito - fundo verde escuro */}
      <div className="flex w-full lg:w-1/3 bg-verdePrincipal items-center justify-center">
        <div className="w-full max-w-md px-6 py-8 bg-white rounded-lg shadow-lg">
          <div className="flex flex-col items-center">
            {/* Corrigido: imagem da logo acessando diretamente do public */}
            <img src="/quadras/logo-quadraflex.png" alt="Logo" className="w-24 h-24 rounded-full mb-4" />
            <p className="text-gray-700 text-sm mb-6 text-center">
              Entre para acessar sua conta
            </p>
          </div>

          <form>
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm text-gray-700">
                Email
              </label>
              <input
              type="email"
              id="email"
              placeholder="exemplo@email.com"
              className="w-full px-4 py-2 border rounded-lg mt-1"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
             />

            </div>

            <div className="mb-4">
              <label htmlFor="senha" className="block text-sm text-gray-700">
                Senha
              </label>
              <input
  type="password"
  id="senha"
  placeholder="Sua senha"
  className="w-full px-4 py-2 border rounded-lg mt-1"
  value={senha}
  onChange={(e) => setSenha(e.target.value)}
/>

            </div>

            <button
              onClick={handleLogin}
              type="button"
              className="w-full bg-verdePrincipal text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors"
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
        </div>
      </div>
    </div>
  );
}

export default Login;
