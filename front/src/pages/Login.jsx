import React, { useState, useMemo } from "react";
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
      const { data: resultado } = await api.post("/auth/login", { email, senha });

      // Persistência (compatível com seu projeto)
      localStorage.setItem("usuario_id", resultado.id);
      localStorage.setItem("nomeUsuario", resultado.nome);
      localStorage.setItem("user", JSON.stringify({
        id: resultado.id,
        nome: resultado.nome,
        email: resultado.email,
        tipo: resultado.tipo_usuario
      }));

      toast.success("Login realizado com sucesso!");
      setTimeout(() => {
        if (resultado.tipo_usuario === "locador") {
          navigate("/home-locador");
        } else {
          navigate("/home", { state: { loginSucesso: true } });
        }
      }, 700);
    } catch (err) {
      console.error("Erro no login:", err);
      const msg = err?.response?.data?.erro || "Email ou senha inválidos";
      toast.error(msg);
    } finally {
      setCarregando(false);
    }
  }

  // Menos partículas em telas pequenas (melhor performance)
  const particles = useMemo(() => {
    const total = window.matchMedia("(max-width: 1024px)").matches ? 20 : 40;
    return Array.from({ length: total }).map((_, i) => ({
      id: i,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 8}s`,
      duration: `${10 + Math.random() * 10}s`
    }));
  }, []);

  return (
    <main className="min-h-screen grid lg:grid-cols-2 bg-black">
      <ToastContainer position="top-center" autoClose={2500} theme="colored" />

      {/* HERO / lado esquerdo (desktop) */}
      <section
        className="relative hidden lg:flex items-center justify-center overflow-hidden"
        aria-label="Apresentação do QuadraFlex"
      >
        <img
          src="/quadras/logo-fundo.png"
          alt="Fundo com quadra esportiva"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-black/50 to-emerald-900/60" />
        <div className="relative z-10 max-w-xl px-12">
          <h1 className="text-4xl font-bold text-white tracking-tight">QuadraFlex</h1>
          <p className="mt-4 text-emerald-50/90 text-lg leading-relaxed">
            Reserve quadras esportivas perto de você, com pagamento seguro e confirmação imediata.
          </p>

          <ul className="mt-8 space-y-3 text-emerald-50/90">
            <li className="flex items-center gap-3">
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-400/90 text-black text-xs font-semibold">1</span>
              Encontre quadras por esporte, preço e avaliação.
            </li>
            <li className="flex items-center gap-3">
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-400/90 text-black text-xs font-semibold">2</span>
              Agende em minutos, sem burocracia.
            </li>
            <li className="flex items-center gap-3">
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-400/90 text-black text-xs font-semibold">3</span>
              Converse com o locador direto pelo chat.
            </li>
          </ul>
        </div>
      </section>

      {/* FORM / lado direito */}
      <section className="relative flex items-center justify-center p-6 sm:p-10">
        {/* Fundo moderno */}
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_rgba(16,185,129,0.25),transparent_60%),radial-gradient(ellipse_at_bottom,_rgba(6,95,70,0.35),transparent_60%)]" />
        <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full blur-3xl bg-emerald-500/20" />
        <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full blur-3xl bg-emerald-700/25" />

        {/* Partículas leves */}
        <div className="absolute inset-0 pointer-events-none">
          {particles.map(p => (
            <span
              key={p.id}
              className="particle"
              style={{ top: p.top, left: p.left, animationDelay: p.delay, animationDuration: p.duration }}
            />
          ))}
        </div>

        {/* Card */}
        <div className="relative w-full max-w-md rounded-2xl border border-white/10 bg-white/80 backdrop-blur-xl shadow-[0_10px_40px_rgba(0,0,0,0.15)]">
          <div className="px-6 sm:px-8 py-7">
            {/* Logo + texto */}
            <div className="flex flex-col items-center mb-6">
              <img
                src="/quadras/logo-quadraflex.png"
                alt="Logo QuadraFlex"
                className="w-20 h-20 rounded-full ring-1 ring-black/5 shadow"
              />
              <p className="mt-3 text-gray-700 text-sm text-center">Entre para acessar sua conta</p>
            </div>

            {/* Form */}
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm text-gray-700">Email</label>
                <div className="relative mt-1">
                  <input
                    id="email"
                    type="email"
                    placeholder="exemplo@email.com"
                    className="peer w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-900 outline-none focus:ring-2 focus:ring-verdePrincipal"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="username"
                    required
                  />
                  {/* Ícone */}
                  <svg
                    aria-hidden="true"
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 opacity-60 peer-focus:opacity-100"
                    viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
                  >
                    <path d="M4 8l8 5 8-5" />
                    <rect x="3" y="6" width="18" height="12" rx="2" ry="2" />
                  </svg>
                </div>
              </div>

              <div>
                <label htmlFor="senha" className="block text-sm text-gray-700">Senha</label>
                <div className="relative mt-1">
                  <input
                    id="senha"
                    type={showPass ? "text" : "password"}
                    placeholder="Sua senha"
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 pr-11 text-gray-900 outline-none focus:ring-2 focus:ring-verdePrincipal"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    autoComplete="current-password"
                    minLength={4}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(s => !s)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-md p-1 text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
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
                <div className="mt-2 flex items-center justify-between">
                  <label className="flex items-center gap-2 text-sm text-gray-700 select-none">
                    <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500" />
                    Manter conectado
                  </label>
                  <Link to="/register" className="text-sm text-emerald-700 hover:underline">
                    Criar conta
                  </Link>
                </div>
              </div>

              <button
                type="submit"
                disabled={carregando}
                aria-busy={carregando}
                className="group relative inline-flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-70"
              >
                {carregando && (
                  <span className="loader-small" aria-hidden="true" />
                )}
                <span>{carregando ? "Entrando..." : "Entrar"}</span>
              </button>
            </form>

            {/* Divider */}
            <div className="my-6 flex items-center gap-4 text-xs text-gray-500">
              <div className="h-px flex-1 bg-gray-300/70" />
              <span>ou continue com</span>
              <div className="h-px flex-1 bg-gray-300/70" />
            </div>

            {/* Social */}
            <div className="flex items-center justify-center gap-3">
              <button type="button" className="w-10 h-10 flex items-center justify-center rounded-full bg-black hover:opacity-90 transition">
                <img src="/icons/apple-icon.svg" alt="Apple" className="h-5 w-5" />
              </button>
              <button type="button" className="w-10 h-10 flex items-center justify-center rounded-full bg-white border hover:shadow-md transition">
                <img src="/icons/google-icon.svg" alt="Google" className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
