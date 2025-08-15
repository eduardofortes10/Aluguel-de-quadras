import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../services/api";

export default function Register() {
  const navigate = useNavigate();

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmSenha, setConfirmSenha] = useState("");
  const [tipo, setTipo] = useState("cliente");
  const [telefone, setTelefone] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const IMAGES = useMemo(
    () => [
      "/quadras/quadra4.png",
      "/quadras/quadra2.png",
      "/quadras/quadra6.png",
      "/quadras/quadra5.png",
    ],
    []
  );
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % IMAGES.length), 5000);
    return () => clearInterval(t);
  }, [IMAGES.length]);

  useEffect(() => {
    const next = (idx + 1) % IMAGES.length;
    const img = new Image();
    img.src = IMAGES[next];
  }, [idx, IMAGES]);

  const nextPathFor = (u) =>
    (u?.tipo || u?.tipo_usuario) === "locador" ? "/home-locador" : "/home";

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!nome || !email || !senha) {
      setError("Preencha nome, e-mail e senha.");
      return;
    }
    if (senha.length < 6) {
      setError("A senha precisa ter pelo menos 6 caracteres.");
      return;
    }
    if (senha !== confirmSenha) {
      setError("As senhas não coincidem.");
      return;
    }

    // monta payload do registro (normalizado)
    const dados = {
      nome: String(nome).trim(),
      email: String(email).trim().toLowerCase(),
      senha, // backend deve hashear
      tipo: (tipo || "cliente").toLowerCase(), // "cliente" | "locador"
      telefone: String(telefone || "").trim() || null,
      data_nascimento: dataNascimento || null, // ajuste se seu backend usa outro nome
    };

    setLoading(true);
    try {
      // cria conta
      await api.post("/auth/register", dados);

      // login automático
      const res = await api.post("/auth/login", {
        email: dados.email,
        senha,
      });

      const { usuario, token } = res.data || {};
      if (usuario) localStorage.setItem("usuario", JSON.stringify(usuario));
      if (token) localStorage.setItem("token", token);

      navigate(nextPathFor(usuario), { replace: true });
    } catch (err) {
      const status = err?.response?.status;
      const payload = err?.response?.data || {};
      let msg =
        payload?.erro ||
        payload?.message ||
        "Não foi possível cadastrar. Verifique os dados e tente novamente.";

      if (status === 409) msg = "E-mail já cadastrado.";
      if (status === 405) msg = "405: verifique se /api/auth/register aceita POST.";
      if (status === 404) msg = "Rota /api/auth/register não encontrada.";

      setError(msg);
      console.error("[REGISTER ERRO]", err);
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

      {/* Grid */}
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
        {/* HERO slideshow */}
        <div className="hidden md:flex items-center justify-center p-10">
          <div className="relative w-full max-w-xl aspect-[4/3] overflow-hidden rounded-3xl shadow-2xl">
            {IMAGES.map((src, i) => (
              <img
                key={src}
                src={src}
                alt="Quadra"
                className={`absolute inset-0 h-full w-full object-cover transition-all duration-700 ease-out ${
                  i === idx ? "opacity-100 scale-100" : "opacity-0 scale-105"
                }`}
                loading={i === 0 ? "eager" : "lazy"}
              />
            ))}
            <div className="absolute inset-0 bg-gradient-to-tr from-[#0A1611] via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-white/80">Pronto pra jogar?</p>
                  <p className="text-lg font-semibold">Cadastre-se e comece agora</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-white/70">Agendamentos por dia</p>
                  <p className="text-xl font-bold">+120</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Formulário */}
        <div className="flex items-center justify-center p-6 sm:p-10">
          <div className="w-full max-w-md">
            <div className="mb-8 text-center">
              <img
                src="/quadras/logo-quadraflex.png"
                alt="QuadraFlex"
                className="mx-auto mb-3 w-auto max-h-16 sm:max-h-20 object-contain rounded-2xl bg-white/5 p-2 border border-white/10 drop-shadow-[0_2px_8px_rgba(0,0,0,0.35)]"
                draggable="false"
              />
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Criar conta</h1>
              <p className="mt-1 text-white/70">
                Em poucos passos você já pode reservar e gerenciar quadras
              </p>
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
                    <label htmlFor="nome" className="mb-1 block text-sm text-white/80">
                      Nome
                    </label>
                    <input
                      id="nome"
                      type="text"
                      required
                      value={nome}
                      onChange={(e) => setNome(e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-white/10 px-4 py-2.5 text-sm outline-none placeholder:text-white/50 focus:border-emerald-400/60 focus:ring-2 focus:ring-emerald-400/20"
                      placeholder="Seu nome completo"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="mb-1 block text-sm text-white/80">
                      E-mail
                    </label>
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

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label htmlFor="senha" className="mb-1 block text-sm text-white/80">
                        Senha
                      </label>
                      <div className="relative">
                        <input
                          id="senha"
                          type={showPassword ? "text" : "password"}
                          required
                          value={senha}
                          onChange={(e) => setSenha(e.target.value)}
                          className="w-full rounded-xl border border-white/10 bg-white/10 px-4 py-2.5 text-sm outline-none placeholder:text-white/50 focus:border-emerald-400/60 focus:ring-2 focus:ring-emerald-400/20"
                          placeholder="Mín. 6 caracteres"
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
                    <div>
                      <label htmlFor="confirm" className="mb-1 block text-sm text-white/80">
                        Confirmar senha
                      </label>
                      <input
                        id="confirm"
                        type={showPassword ? "text" : "password"}
                        required
                        value={confirmSenha}
                        onChange={(e) => setConfirmSenha(e.target.value)}
                        className="w-full rounded-xl border border-white/10 bg-white/10 px-4 py-2.5 text-sm outline-none placeholder:text-white/50 focus:border-emerald-400/60 focus:ring-2 focus:ring-emerald-400/20"
                        placeholder="Repita sua senha"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-1 block text-sm text-white/80">Tipo de usuário</label>
                    <div className="grid grid-cols-2 gap-2 rounded-xl p-1 bg-white/5 border border-white/10">
                      {["cliente", "locador"].map((t) => (
                        <button
                          type="button"
                          key={t}
                          onClick={() => setTipo(t)}
                          className={`py-2 rounded-lg text-sm font-medium transition-all ${
                            tipo === t
                              ? "bg-gradient-to-r from-emerald-500 to-green-600 shadow border border-white/10"
                              : "text-white/70 hover:text-white"
                          }`}
                          aria-pressed={tipo === t}
                        >
                          {t === "cliente" ? "Cliente" : "Locador"}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label htmlFor="tel" className="mb-1 block text-sm text-white/80">
                        Telefone
                      </label>
                      <input
                        id="tel"
                        type="tel"
                        value={telefone}
                        onChange={(e) => setTelefone(e.target.value)}
                        className="w-full rounded-xl border border-white/10 bg-white/10 px-4 py-2.5 text-sm outline-none placeholder:text-white/50 focus:border-emerald-400/60 focus:ring-2 focus:ring-emerald-400/20"
                        placeholder="(11) 99999-9999"
                      />
                    </div>
                    <div>
                      <label htmlFor="nasc" className="mb-1 block text-sm text-white/80">
                        Data de nascimento
                      </label>
                      <input
                        id="nasc"
                        type="date"
                        value={dataNascimento}
                        onChange={(e) => setDataNascimento(e.target.value)}
                        className="w-full rounded-xl border border-white/10 bg-white/10 px-4 py-2.5 text-sm outline-none placeholder:text-white/50 focus:border-emerald-400/60 focus:ring-2 focus:ring-emerald-400/20"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="relative mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 px-4 py-3 text-[0.95rem] font-semibold shadow-lg shadow-emerald-900/20 hover:brightness-[1.03] focus:outline-none focus:ring-4 focus:ring-emerald-400/30 active:scale-[.99]"
                    disabled={loading}
                  >
                    {loading ? (
                      <span className="inline-flex items-center gap-2">
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                        Cadastrando...
                      </span>
                    ) : (
                      <>Criar conta</>
                    )}
                  </button>

                  <p className="mt-4 text-center text-sm text-white/70">
                    Já tem conta?{" "}
                    <Link
                      to="/login"
                      className="text-emerald-300 hover:text-emerald-200 underline-offset-4 hover:underline"
                    >
                      Entrar
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
