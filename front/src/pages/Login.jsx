import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Ajuste os nomes conforme as imagens que existem em /public/quadras
  const IMAGES = useMemo(
    () => [
      "/quadras/quadra5.png",
      "/quadras/quadra4.png",
      "/quadras/quadra2.png",
       "/quadras/quadra1.png",
       "/quadras/quadra6.png",
    ],
    []
  );
  const [idx, setIdx] = useState(0);

  // Troca a imagem a cada 5s
  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % IMAGES.length), 5000);
    return () => clearInterval(t);
  }, [IMAGES.length]);

  // Pré-carrega a próxima
  useEffect(() => {
    const next = (idx + 1) % IMAGES.length;
    const img = new Image();
    img.src = IMAGES[next];
  }, [idx, IMAGES]);

  // base do backend (sem /api no final)
  const RAW_BASE = import.meta?.env?.VITE_API_URL || "";
  const API_BASE = RAW_BASE.trim().replace(/\s+/g, "").replace(/\/?api\/?$/i, "").replace(/\/$/, "");
  const LOGIN_URL = API_BASE ? `${API_BASE}/api/auth/login` : "/api/auth/login";

  const nextPathFor = (u) => (u?.tipo_usuario === "locador" ? "/home-locador" : "/home");

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await axios.post(
        LOGIN_URL,
        { email, senha: password },
        { headers: { "Content-Type": "application/json" } }
      );

      const data = res?.data || {};
      const usuario = data.usuario;
      const token = data.token;

      if (usuario) localStorage.setItem("usuario", JSON.stringify(usuario));
      if (token) localStorage.setItem("token", token);

      navigate(nextPathFor(usuario));
    } catch (err) {
      const status = err?.response?.status;
      let msg =
        err?.response?.data?.message ||
        "Não foi possível entrar. Verifique seu e-mail e senha.";
      if (status === 405) msg = "405: verifique se /api/auth/login aceita POST.";
      if (status === 404) msg = "Rota /api/auth/login não encontrada.";
      if (err?.message?.includes("ERR_NAME_NOT_RESOLVED"))
        msg = "VITE_API_URL inválida. Use a URL completa do backend (https://...).";

      setError(msg);
      console.error("[LOGIN ERRO]", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#0A1611] text-white">
      {/* Glows */}
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute -top-40 -left-40 h-80 w-80 rounded-full blur-3xl opacity-30"
          style={{ background: "radial-gradient(closest-side, #34d399, transparent)" }}
        />
        <div
          className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full blur-3xl opacity-25"
          style={{ background: "radial-gradient(closest-side, #10b981, transparent)" }}
        />
      </div>

      {/* Grid da “quadra” */}
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

      <div className="relative z-10 grid min-h-screen grid-cols-1 md:grid-cols-2">
        {/* HERO com slideshow */}
        <div className="hidden md:flex items-center justify-center p-10">
          <div className="relative w-full max-w-xl aspect-[4/3] overflow-hidden rounded-3xl shadow-2xl">
            {IMAGES.map((src, i) => (
              <img
                key={src}
                src={src}
                alt="Quadra"
                className={`absolute inset-0 h-full w-full object-cover transition-all duration-700 ease-out
                  ${i === idx ? "opacity-100 scale-100" : "opacity-0 scale-105"}`}
                loading={i === 0 ? "eager" : "lazy"}
              />
            ))}
            <div className="absolute inset-0 bg-gradient-to-tr from-[#0A1611] via-transparent to-transparent" />
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

        {/* Formulário */}
        <div className="flex items-center justify-center p-6 sm:p-10">
          <div className="w-full max-w-md">
            <div className="mb-8 text-center">
              {/* LOGO real (sem corte) */}
              <img
                src="/quadras/logo-quadraflex.png"
                alt="QuadraFlex"
                className="mx-auto mb-3 w-auto max-h-16 sm:max-h-20 object-contain drop-shadow-[0_2px_8px_rgba(0,0,0,0.35)]"
                draggable="false"
              />
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Bem-vindo de volta</h1>
              <p className="mt-1 text-white/70">Entre para agendar, favoritar e conversar com donos de quadras</p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md shadow-xl">
              <div className="p-6 sm:p-7">
                {error && (
                  <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2 text-red-200 text-sm">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="email" className="mb-1 block text-sm text-white/80">E-mail</label>
                    <input
                      id="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-white/10 px-4 py-2.5 text-sm outline-none placeholder:text-white/50 focus:border-emerald-400/60 focus:ring-2 focus:ring-emerald-400/20"
                      placeholder="voce@email.com"
                    />
                  </div>

                  <div>
                    <label htmlFor="password" className="mb-1 block text-sm text-white/80">Senha</label>
                    <div className="relative">
                      <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        autoComplete="current-password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full rounded-xl border border-white/10 bg-white/10 px-4 py-2.5 text-sm outline-none placeholder:text-white/50 focus:border-emerald-400/60 focus:ring-2 focus:ring-emerald-400/20"
                        placeholder="Sua senha"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((v) => !v)}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-lg px-2 py-1 text-xs text-white/70 hover:text-white focus:outline-none focus:ring-2 focus:ring-emerald-400/30"
                      >
                        {showPassword ? "Ocultar" : "Mostrar"}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span />
                    <Link to="/recuperar" className="text-emerald-300 hover:text-emerald-200 underline-offset-4 hover:underline">
                      Esqueceu a senha?
                    </Link>
                  </div>

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
                      <>Entrar</>
                    )}
                  </button>

                  <p className="mt-4 text-center text-sm text-white/70">
                    Não tem conta?{" "}
                    <Link to="/register" className="text-emerald-300 hover:text-emerald-200 underline-offset-4 hover:underline">
                      Crie uma agora
                    </Link>
                  </p>
                </form>
              </div>
            </div>

            <div className="mt-6 text-center text-xs text-white/50">
              © {new Date().getFullYear()} Aluguel de Quadras — todos os direitos reservados
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
