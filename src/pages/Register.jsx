import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";
import {
  UserIcon,
  PhoneIcon,
  EnvelopeIcon, // <- ✅ correto!
  LockClosedIcon,
} from "@heroicons/react/24/solid";


function Register() {
  const navigate = useNavigate();

  const [nome, setNome] = useState("");
  const [sobrenome, setSobrenome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmSenha, setConfirmSenha] = useState("");
  const [tipo, setTipo] = useState("cliente");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!nome || !sobrenome || !email || !senha || !confirmSenha) {
      toast.error("Preencha todos os campos");
      return;
    }

    if (senha !== confirmSenha) {
      toast.error("As senhas não coincidem");
      return;
    }

    const nomeCompleto = `${nome} ${sobrenome}`;
    const dados = {
      nome: nomeCompleto,
      email,
      senha,
      tipo_usuario: tipo,
    };

    try {
      setLoading(true);
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dados),
      });

      const resultado = await response.json();

      if (response.ok) {
        toast.success("Conta criada com sucesso!");
        localStorage.setItem("usuario", JSON.stringify(resultado.usuario || dados));
        setTimeout(() => {
          navigate(
            (resultado.usuario?.tipo_usuario || tipo) === "locador"
              ? "/home-Locador"
              : "/Home"
          );
        }, 1500);
      } else {
        toast.error(resultado.erro || "Erro ao registrar.");
      }
    } catch (err) {
      console.error("Erro na requisição:", err);
      toast.error("Erro ao conectar com o servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="flex min-h-screen">
      <Toaster position="top-right" />

      {/* LADO ESQUERDO */}
      <div
        className="w-2/5 bg-cover bg-center relative hidden lg:block"
        style={{ backgroundImage: "url('/quadras/logo-fundo.png')" }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="text-white p-6 max-w-md">
            <h2 className="text-3xl font-bold mb-4">QuadraFlex</h2>
            <p>
              Bem-vindo ao QuadraFlex! Aqui você encontra a maneira mais rápida
              e prática de reservar quadras esportivas perto de você.
            </p>
          </div>
        </div>
      </div>

      {/* LADO DIREITO */}
      <div className="relative flex w-full lg:w-3/5 items-center justify-center overflow-hidden">
        {/* Fundo animado radial verde */}
        <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-green-400 via-green-700 to-green-900 animate-blob" />

        {/* Luz suave no fundo */}
        <div className="absolute top-[-100px] right-[-200px] w-[700px] h-[700px] bg-gradient-to-bl from-white/70 via-lime-200/40 to-transparent blur-[100px] opacity-70 z-10 pointer-events-none rounded-full rotate-[-25deg]" />

        {/* Partículas flutuantes */}
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

        {/* FORMULÁRIO */}
        <div className="relative z-30 w-full max-w-3xl px-4 sm:px-8 py-8 bg-white/5 border border-white/20 backdrop-blur-xl rounded-xl shadow-xl animate-fade-in-up">
          <h1 className="text-3xl text-white font-bold">Criar Conta</h1>
          <p className="text-sm text-gray-200 mt-2">
            Preencha os dados para começar a usar o QuadraFlex
          </p>

          {/* Tipo de conta */}
          <div className="mt-6">
            <p className="text-white font-medium mb-2">Tipo de conta</p>
            <div className="flex gap-4">
              {["cliente", "locador"].map((role) => (
                <button
                  key={role}
                  onClick={() => setTipo(role)}
                  className={`transition-all duration-300 px-6 py-3 rounded-lg ${
                    tipo === role
                      ? "bg-white text-green-800 font-bold shadow-md"
                      : "border border-white text-white hover:bg-white/10"
                  }`}
                >
                  {role === "cliente" ? "Cliente" : "Locador"}
                </button>
              ))}
            </div>
          </div>

          {/* Inputs */}
          <form className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            {/* Nome */}
            <InputField label="Nome" value={nome} onChange={setNome} icon={<UserIcon />} />
            <InputField label="Sobrenome" value={sobrenome} onChange={setSobrenome} icon={<UserIcon />} />
            <InputField label="Telefone" value={telefone} onChange={setTelefone} icon={<PhoneIcon />} />
          <InputField label="Email" value={email} onChange={setEmail} icon={<EnvelopeIcon />} type="email" />
            <InputField label="Senha" value={senha} onChange={setSenha} icon={<LockClosedIcon />} type="password" />
            <InputField
              label="Confirmar Senha"
              value={confirmSenha}
              onChange={setConfirmSenha}
              icon={<LockClosedIcon />}
              type="password"
            />

            {senha !== confirmSenha && confirmSenha.length > 0 && (
              <p className="text-red-300 text-sm mt-[-12px] md:col-span-2">
                As senhas não coincidem.
              </p>
            )}

            {/* Botão */}
            <button
              type="button"
              onClick={handleRegister}
              className="md:col-span-2 mt-4 flex justify-center items-center gap-2 bg-[#1E8449] hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-all duration-300"
              disabled={loading}
            >
              {loading ? (
                <span className="loader-small" />
              ) : (
                <>
                  Criar conta
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </>
              )}
            </button>
          </form>

          <p className="text-sm text-white mt-6 text-center">
            Já tem uma conta?
            <Link to="/login" className="ml-1 underline hover:text-gray-200">
              Entrar
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}

// Componente de input reutilizável com ícone
function InputField({ label, value, onChange, icon, type = "text" }) {
  return (
    <div>
      <label className="block text-white text-sm mb-1">{label}</label>
      <div className="relative">
        <span className="absolute left-3 top-3 text-gray-400">{icon}</span>
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={label}
          className="w-full pl-10 pr-4 py-3 mt-1 text-gray-700 bg-white border rounded-lg outline-none focus:ring-2 focus:ring-green-400"
        />
      </div>
    </div>
  );
}

export default Register;
