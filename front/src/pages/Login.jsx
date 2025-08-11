import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { api } from "../services/api";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [carregando, setCarregando] = useState(false);

  async function handleLogin(e) {
    e?.preventDefault();
    if (!email || !senha) {
      toast.error("Preencha todos os campos");
      return;
    }
    try {
      setCarregando(true);
      const { data: r } = await api.post("/auth/login", { email, senha });

      localStorage.setItem("usuario_id", r.id);
      localStorage.setItem("nomeUsuario", r.nome);
      localStorage.setItem(
        "user",
        JSON.stringify({ id: r.id, nome: r.nome, email: r.email, tipo: r.tipo_usuario })
      );

      toast.success("Login realizado com sucesso!");
      setTimeout(() => {
        if (r.tipo_usuario === "locador") navigate("/home-locador");
        else navigate("/home", { state: { loginSucesso: true } });
      }, 600);
    } catch (err) {
      console.error("Erro no login:", err);
      const msg = err?.response?.data?.erro || "Email ou senha inválidos";
      toast.error(msg);
    } finally {
      setCarregando(false);
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-neutral-950 text-white">
      <ToastContainer position="top-center" autoClose={2500} theme="colored" />

      {/* Aurora / blobs */}
      <div className="pointer-events-none absolute -top-28 -left-28 h-96 w-96 rounded-full bg-emerald-600/25 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-36 -right-28 h-[26rem] w-[26rem] rounded-full bg-teal-500/20 blur-3xl" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(1200px_600px_at_80%_-10%,rgba(16,185,129,0.12),transparent),radial-gradient(900px_500px_at_10%_110%,rgba(4,120,87,0.10),transparent)]" />
      {/* grade sutil */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:22px_22px] [mask-image:radial-gradient(70%_50%_at_50%_40%,black,transparent)]" />

      {/* container */}
      <div className="relative z-10 flex min-h-screen items-center justify-center px-4">
        <div className="w-full max-w-[420px] rounded-3xl border border-white/10 bg-white/10 backdrop-blur-2xl shadow-[0_20px_70px_rgba(0,0,0,0.45)]">
          <div className="px-7 py-8 sm:p-10">
            {/* topo do card */}
            <div className="flex items-center gap-3">
              <img
                src="/quadras/logo-quadraflex.png"
                alt="QuadraFlex"
                className="h-10 w-10 rounded-full ring-1 ring-white/20"
              />
              <div>
                <h1 className="text-lg font-semibold tracking-tight">Bem-vindo</h1>
                <p className="text-xs text-white/60">Acesse sua conta do QuadraFlex</p>
              </div>
            </div>

            {/* formulário */}
            <form onSubmit={handleLogin} className="mt-8 space-y-5">
              {/* email */}
              <div className="relative">
                <input
                  id="email"
                  type="email"
                  autoComplete="username"
                  placeholder=" "
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="peer h-12 w-full rounded-xl border border-white/15 bg-white/5 px-4 pt-4 text-white placeholder-transparent outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/40"
                />
                <label
                  htmlFor="email"
                  className="pointer-events-none absolute left-4 top-3 origin-left -translate-y-2 scale-90 text-sm text-white/70 transition-all
                  peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-placeholder-shown:text-base
                  peer-focus:top-3 peer-focus:-translate-y-2 peer-focus:scale-90 peer-focus:text-emerald-200"
                >
                  Email
                </label>
                <svg
                  aria-hidden="true"
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 opacity-60"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path d="M4 8l8 5 8-5" />
                  <rect x="3" y="6" width="18" height="12" rx="2" ry="2" />
                </svg>
              </div>

              {/* senha */}
              <div className="relative">
                <input
                  id="senha"
                  type={showPass ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder=" "
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  minLength={4}
                  required
                  className="peer h-12 w-full rounded-xl border border-white/15 bg-white/5 px-4 pr-12 pt-4 text-white placeholder-transparent outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/40"
                />
                <label
                  htmlFor="senha"
                  className="pointer-events-none absolute left-4 top-3 origin-left -translate-y-2 scale-90 text-sm text-white/70 transition-all
                  peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-placeholder-shown:text-base
                  peer-focus:top-3 peer-focus:-translate-y-2 peer-focus:scale-90 peer-focus:text-emerald-200"
                >
                  Senha
                </label>
                <button
                  type="button"
                  onClick={() => setShowPass((s) => !s)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-white/70 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                  aria-label={showPass ? "Ocultar senha" : "Mostrar senha"}
                >
                  {showPass ? (
                    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6">
                      <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7z" />
                      <path d="M9.5 9.5L14.5 14.5M14.5 9.5L9.5 14.5" />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z" />
                      <circle cx="12" cy="12" r="3.5" />
                    </svg>
                  )}
                </button>
              </div>

              {/* ações */}
              <div className="mt-1 flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 select-none text-white/80">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-white/20 bg-white/5 text-emerald-500 focus:ring-emerald-500"
                  />
                  Manter conectado
                </label>
                <Link to="/redefinir-senha" className="text-emerald-300 hover:text-emerald-200">
                  Esqueceu a senha?
                </Link>
              </div>

              {/* botão */}
              <button
                type="submit"
                disabled={carregando}
                aria-busy={carregando}
                className="group relative mt-1 inline-flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl
                  bg-[linear-gradient(110deg,#10b981_0%,#059669_50%,#10b981_100%)] bg-[length:200%_100%]
                  px-4 py-3 font-semibold text-white transition-[background-position,transform] duration-700
                  hover:bg-[position:100%_0] active:scale-[0.99] disabled:opacity-70"
              >
                {carregando && (
                  <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="4" />
                  </svg>
                )}
                <span>{carregando ? "Entrando..." : "Entrar"}</span>
              </button>
            </form>

            {/* divider + sociais */}
            <div className="my-6 flex items-center gap-4 text-xs text-white/60">
              <div className="h-px flex-1 bg-white/15" />
              <span>ou continue com</span>
              <div className="h-px flex-1 bg-white/15" />
            </div>
            <div className="flex items-center justify-center gap-3">
              <button type="button" className="h-10 w-10 rounded-full bg-white text-black hover:opacity-90 transition">
                <img src="/icons/apple-icon.svg" alt="Apple" className="mx-auto h-5 w-5" />
              </button>
              <button type="button" className="h-10 w-10 rounded-full border border-white/20 bg-white/10 hover:bg-white/15 transition">
                <img src="/icons/google-icon.svg" alt="Google" className="mx-auto h-5 w-5" />
              </button>
            </div>

            {/* cadastro */}
            <p className="mt-6 text-center text-sm text-white/70">
              Não tem conta?{" "}
              <Link to="/register" className="font-medium text-emerald-300 hover:text-emerald-200">
                Registre-se
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
