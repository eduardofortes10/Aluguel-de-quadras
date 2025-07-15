import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();

  const [nome, setNome] = useState('');
  const [sobrenome, setSobrenome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [tipo, setTipo] = useState('locatario');

  const handleRegister = async () => {
    const nomeCompleto = `${nome} ${sobrenome}`;
    const dados = { nome: nomeCompleto, email, senha, tipo, telefone };

    try {
      const response = await fetch("http://localhost:3001/usuarios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dados),
      });

      const resultado = await response.json();

      if (response.ok) {
        alert("Usuário registrado com sucesso!");
        navigate("/Home");
      } else {
        alert(resultado.error || "Erro ao registrar usuário");
      }
    } catch (err) {
      console.error("Erro na requisição:", err);
      alert("Erro ao conectar com o servidor");
    }
  };

  return (
    <section className="flex min-h-screen">
      {/* LADO ESQUERDO */}
      <div
        className="w-2/5 bg-cover bg-center relative hidden lg:block"
        style={{ backgroundImage: "url('/quadras/logo-fundo.png')" }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="text-white p-6 max-w-md">
            <h2 className="text-3xl font-bold mb-4">QuadraFlex</h2>
            <p>
              Bem-vindo ao QuadraFlex! Aqui você encontra a maneira mais rápida e prática de reservar quadras esportivas perto de você.
            </p>
          </div>
        </div>
      </div>

      {/* LADO DIREITO */}
      <div className="w-full lg:w-3/5 bg-[#47B560] flex items-center justify-center p-8">
        <div className="w-full max-w-3xl">
          <h1 className="text-2xl font-semibold tracking-wider text-white capitalize">
            Crie sua conta agora
          </h1>

          <p className="mt-4 text-gray-100">
            Vamos te deixar pronto para reservar suas quadras e aproveitar ao máximo a plataforma QuadraFlex.
          </p>

          <div className="mt-6">
            <h1 className="text-white">Escolha o tipo de conta</h1>
            <div className="mt-3 md:flex md:items-center md:-mx-2">
              <button
                type="button"
                onClick={() => setTipo("locatario")}
                className={`flex justify-center w-full px-6 py-3 text-white rounded-lg md:w-auto md:mx-2 ${
                  tipo === "locatario" ? "bg-[#1E8449]" : "border border-white"
                }`}
              >
                <span className="mx-2">Cliente</span>
              </button>

              <button
                type="button"
                onClick={() => setTipo("locador")}
                className={`flex justify-center w-full px-6 py-3 mt-4 text-white rounded-lg md:mt-0 md:w-auto md:mx-2 ${
                  tipo === "locador" ? "bg-[#1E8449]" : "border border-white"
                }`}
              >
                <span className="mx-2">Locador</span>
              </button>
            </div>
          </div>

          <form className="grid grid-cols-1 gap-6 mt-8 md:grid-cols-2">
            <div>
              <label className="block mb-2 text-sm text-white">Nome</label>
              <input
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="João"
                className="block w-full px-5 py-3 mt-2 text-gray-700 bg-white border rounded-lg"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm text-white">Sobrenome</label>
              <input
                type="text"
                value={sobrenome}
                onChange={(e) => setSobrenome(e.target.value)}
                placeholder="Silva"
                className="block w-full px-5 py-3 mt-2 text-gray-700 bg-white border rounded-lg"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm text-white">Telefone</label>
              <input
                type="text"
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
                placeholder="(00) 00000-0000"
                className="block w-full px-5 py-3 mt-2 text-gray-700 bg-white border rounded-lg"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm text-white">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="joao@email.com"
                className="block w-full px-5 py-3 mt-2 text-gray-700 bg-white border rounded-lg"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm text-white">Senha</label>
              <input
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                placeholder="Digite sua senha"
                className="block w-full px-5 py-3 mt-2 text-gray-700 bg-white border rounded-lg"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm text-white">Confirmar Senha</label>
              <input
                type="password"
                placeholder="Repita a senha"
                className="block w-full px-5 py-3 mt-2 text-gray-700 bg-white border rounded-lg"
              />
            </div>

            <button
              type="button"
              onClick={handleRegister}
              className="flex items-center justify-between w-full px-6 py-3 text-sm tracking-wide text-white bg-[#1E8449] rounded-lg hover:bg-green-700 md:col-span-2"
            >
              <span>Criar conta</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5 rtl:-scale-x-100"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

export default Register;
