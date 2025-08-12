import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

// Login.jsx — tela reformulada e coerente com o visual do projeto de aluguel de quadras
// - Paleta dark esverdeada
// - Linhas que remetem à marcação de quadra (overlay)
// - Card vítreo com borda gradient
// - Toggle de perfil (Cliente / Locador)
// - Botões amigáveis e microinterações
// - Acessível (labels, aria-attrs) e responsivo

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [keepSigned, setKeepSigned] = useState(true);
  const [role, setRole] = useState("cliente"); // "cliente" | "locador"
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const API_BASE = import.meta?.env?.VITE_API_URL || ""; // e.g. https://seu-backend.com

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Ajuste o endpoint conforme seu backend
      // Exemplo: POST /api/login { email, senha, tipo }
      const res = await axios.post(`${API_BASE}/api/login`, {
        email,
        senha: password,
        tipo: role,
        keepSigned,
      });

      // Supondo que o backend retorne o usuário e um token
      const { usuario, token } = res.data || {};
      if (usuario) {
        localStorage.setItem("usuario", JSON.stringify(usuario));
      }
      if (token) {
        localStorage.setItem("token", token);
      }

      // Redireciona para a Home (ou para a rota de destino, se houver)
      navigate("/");
    } catch (err) {
      const msg = err?.response?.data?.message || "Credenciais inválidas. Tente novamente.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#0A1611] text-white">
      {/* Glow radiais de fundo */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 -left-40 h-80 w-80 rounded-full blur-3xl opacity-30"
             style={{ background: "radial-gradient(closest-side, #34d399, transparent)" }} />
        <div className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full blur-3xl opacity-25"
             style={{ background: "radial-gradient(closest-side, #10b981, transparent)" }} />
      </div>

      {/* Padrão de linhas de quadra (grid + faixas) */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-15"
        style={{
          backgroundImage:
            "linear-gradient(transparent 23px, rgba(255,255,255,0.08) 24px), linear-gradient(90deg, transparent 23px, rgba(255,255,255,0.08) 24px)",
          backgroundSize: "24px 24px, 24px 24px",
        }}
      />
      <div
        aria-hidden
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 44px, rgba(16,185,129,0.35) 44px, rgba(16,185,129,0.35) 46px)",
        }}
      />

      {/* Layout: metade com imagem/hero, metade com o card */}
      <div className="relative z-10 grid min-h-screen grid-cols-1 md:grid-cols-2">
        {/* Coluna esquerda (hero) */}
        <div className="hidden md:flex items-center justify-center p-10">
          <div className="relative w-full max-w-xl">
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl shadow-2xl">
              {/* Imagem de quadra do seu /public/quadras (ajuste o caminho conforme o projeto) */}
              <img
                src="/quadras/quadra3.png"
                alt="Quadra poliesportiva"
                className="h-full w-full object-cover"
                loading="lazy"
              />
              {/* Gradiente por cima para legibilidade */}
              <div className="absolute inset-0 bg-gradient-to-tr from-[#0A1611] via-transparent to-transparent" />
            </div>
            <div className="absolute -bottom-6 left-6 right-6 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-white/70">Reserve rápido</p>
                  <p className="text-lg font-semibold">Encontre a quadra perfeita perto de você</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-white/60">Avaliação média</p>
                  <p className="text-xl font-bold">4.8 ★</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Coluna direita (form) */}
        <div className="flex items-center justify-center p-6 sm:p-10">
          <div className="w-full max-w-md">
            {/* Logo + título */}
            <div className="mb-8 text-center">
              <div className="mx-auto mb-3 h-12 w-12 rounded-2xl bg-gradient-to-br from-emerald-400 to-green-600 grid place-items-center shadow-lg">
                {/* Ícone bola simples */}
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="9" stroke="white" strokeWidth="2" />
                  <path d="M3 12h18M12 3v18" stroke="white" strokeWidth="2" opacity="0.8" />
                </svg>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Bem-vindo de volta</h1>
              <p className="mt-1 text-white/70">Entre para agendar, favoritar e conversar com donos de quadras</p>
            </div>

            {/* Toggle de perfil */}
            <div className="mb-6 grid grid-cols-2 rounded-xl p-1 bg-white/5 border border-white/10">
              {(["cliente", "locador"]).map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setRole(opt)}
                  className={`relative py-2.5 text-sm font-medium rounded-lg transition-all ${
                    role === opt
                      ? "bg-gradient-to-r from-emerald-500 to-green-600 shadow border border-white/10"
                      : "text-white/70 hover:text-white"
                  }`}
                  aria-pressed={role === opt}
                >
                  {opt === "cliente" ? "Sou Cliente" : "Sou Locador"}
                </button>
              ))}
            </div>

            {/* Card vítreo do formulário */}
            <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md shadow-xl">
              <div className="p-6 sm:p-7">
                {error && (
                  <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2 text-red-200 text-sm">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Email */}
                  <div>
                    <label htmlFor="email" className="mb-1 block text-sm text-white/80">
                      E-mail
                    </label>
                    <div className="relative">
                      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 opacity-70">
                        {/* Ícone e-mail */}
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M4 6h16a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z" stroke="currentColor" strokeWidth="1.8"/>
                          <path d="m22 8-10 6L2 8" stroke="currentColor" strokeWidth="1.8"/>
                        </svg>
                      </span>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full rounded-xl border border-white/10 bg-white/10 px-10 py-2.5 text-sm outline-none placeholder:text-white/50 focus:border-emerald-400/60 focus:ring-2 focus:ring-emerald-400/20"
                        placeholder="voce@email.com"
                        aria-invalid={!!error}
                      />
                    </div>
                  </div>

                  {/* Senha */}
                  <div>
                    <label htmlFor="password" className="mb-1 block text-sm text-white/80">
                      Senha
                    </label>
                    <div className="relative">
                      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 opacity-70">
                        {/* Ícone cadeado */}
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <rect x="4" y="10" width="16" height="10" rx="2" stroke="currentColor" strokeWidth="1.8"/>
                          <path d="M8 10V7a4 4 0 1 1 8 0v3" stroke="currentColor" strokeWidth="1.8"/>
                        </svg>
                      </span>
                      <input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        autoComplete="current-password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full rounded-xl border border-white/10 bg-white/10 px-10 py-2.5 text-sm outline-none placeholder:text-white/50 focus:border-emerald-400/60 focus:ring-2 focus:ring-emerald-400/20"
                        placeholder="Sua senha"
                        aria-invalid={!!error}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((v) => !v)}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-lg px-2 py-1 text-xs text-white/70 hover:text-white focus:outline-none focus:ring-2 focus:ring-emerald-400/30"
                        aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                      >
                        {showPassword ? (
                          // Ícone olho fechado
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M3 3l18 18" stroke="currentColor" strokeWidth="1.8"/>
                            <path d="M10.58 10.58A3 3 0 0 0 9 13a3 3 0 0 0 5.24 1.76" stroke="currentColor" strokeWidth="1.6"/>
                            <path d="M2 12s3.5-7 10-7 10 7 10 7a17.2 17.2 0 0 1-3.2 3.78M6.1 15.1A17.5 17.5 0 0 1 2 12" stroke="currentColor" strokeWidth="1.6"/>
                          </svg>
                        ) : (
                          // Ícone olho aberto
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" stroke="currentColor" strokeWidth="1.8"/>
                            <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8"/>
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Opções */}
                  <div className="flex items-center justify-between text-sm">
                    <label className="inline-flex items-center gap-2 select-none">
                      <input
                        type="checkbox"
                        className="h-4 w-4 rounded border-white/20 bg-white/10 text-emerald-500 focus:ring-emerald-400/30"
                        checked={keepSigned}
                        onChange={(e) => setKeepSigned(e.target.checked)}
                      />
                      <span className="text-white/80">Manter conectado</span>
                    </label>
                    <Link
                      to="/recuperar"
                      className="text-emerald-300 hover:text-emerald-200 underline-offset-4 hover:underline"
                    >
                      Esqueceu a senha?
                    </Link>
                  </div>

                  {/* Botão Entrar */}
                  <button
                    type="submit"
                    className="relative mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 px-4 py-3 text-[0.95rem] font-semibold shadow-lg shadow-emerald-900/20 hover:brightness-[1.03] focus:outline-none focus:ring-4 focus:ring-emerald-400/30 active:scale-[.99]"
                    disabled={loading}
                  >
                    {loading ? (
                      <span className="inline-flex items-center gap-2">
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                        Entrando...
                      </span>
                    ) : (
                      <>
                        {/* Ícone de login */}
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M8 12h12" stroke="currentColor" strokeWidth="2"/>
                          <path d="M14 6l6 6-6 6" stroke="currentColor" strokeWidth="2"/>
                          <path d="M10 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h4" stroke="currentColor" strokeWidth="2"/>
                        </svg>
                        Entrar
                      </>
                    )}
                  </button>

                  {/* Separador */}
                  <div className="relative my-3">
                    <div className="absolute inset-0 flex items-center" aria-hidden="true">
                      <div className="w-full border-t border-white/10" />
                    </div>
                    <div className="relative flex justify-center">
                      <span className="bg-white/5 px-3 text-xs text-white/60">
                        ou continue com
                      </span>
                    </div>
                  </div>

                  {/* Social — placeholder (implemente depois com seu provedor) */}
                  <button
                    type="button"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm hover:bg-white/10 focus:outline-none focus:ring-4 focus:ring-emerald-400/20"
                    onClick={() => alert("Integre aqui seu provedor de OAuth (Google, etc.)")}
                  >
                    {/* Ícone G */}
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M21.35 11.1H12v2.9h5.3A5.4 5.4 0 1 1 6.6 8.9" stroke="currentColor" strokeWidth="1.8"/>
                    </svg>
                    Continuar com Google
                  </button>

                  {/* CTA cadastro */}
                  <p className="mt-4 text-center text-sm text-white/70">
                    Não tem conta?{" "}
                    <Link to="/cadastro" className="text-emerald-300 hover:text-emerald-200 underline-offset-4 hover:underline">
                      Crie uma agora
                    </Link>
                  </p>

                  <p className="text-center text-[11px] text-white/50">
                    Ao continuar, você concorda com nossos {" "}
                    <Link to="/termos" className="underline underline-offset-2 hover:text-white/70">Termos</Link>
                    {" "}e {" "}
                    <Link to="/privacidade" className="underline underline-offset-2 hover:text-white/70">Privacidade</Link>.
                  </p>
                </form>
              </div>
            </div>

            {/* Rodapé pequeno */}
            <div className="mt-6 text-center text-xs text-white/50">
              © {new Date().getFullYear()} Aluguel de Quadras — todos os direitos reservados
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
