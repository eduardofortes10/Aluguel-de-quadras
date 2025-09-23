// src/pages/Home.jsx
import React, { useEffect, useState } from "react";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import { useNavigate, Link } from "react-router-dom";
import { quadras, quadrasCarrossel } from "../data/quadras";
import MobileNav from "../components/MobileNav";
import Sidebar from "../components/Sidebar";
import { api } from "../services/api";
import CourtCard from "../components/CourtCard";
import { toast } from "react-hot-toast";
import { enviarNotificacao } from "../services/notificacoes";
import HomeHero from "../components/HomeHero";

/* ================= Helpers ================= */
async function getUsuarioIdSeguro() {
  try {
    const raw = localStorage.getItem("usuario");
    if (raw) {
      const u = JSON.parse(raw);
      if (u?.id) return Number(u.id);
      if (u?.usuario_id) return Number(u.usuario_id);
    }
    const uidStr = localStorage.getItem("usuario_id");
    if (uidStr && /^\d+$/.test(uidStr)) return Number(uidStr);
    try {
      const { data } = await api.get("/auth/me");
      if (data?.id) return Number(data.id);
      if (data?.usuario_id) return Number(data.usuario_id);
    } catch {}
  } catch {}
  return null;
}

function normalizarFavorito(f) {
  const hasNestedQuadra = f?.quadra && typeof f.quadra === "object";
  const favoritoId =
    f.favorito_id ??
    (hasNestedQuadra ? f.id : undefined) ??
    (f.quadra_id ? f.id : undefined) ??
    f.id;
  const quadraId =
    f.quadra_id ??
    (hasNestedQuadra ? f.quadra.id : undefined) ??
    f.id_quadra ??
    f.quadraId ??
    f.id;
  const nome = f.nome ?? (hasNestedQuadra ? f.quadra.nome : undefined) ?? "Quadra";
  const preco = f.preco ?? (hasNestedQuadra ? f.quadra.preco : undefined) ?? 0;
  const local = f.local ?? (hasNestedQuadra ? f.quadra.local : undefined) ?? "";
  const tipo = f.tipo ?? (hasNestedQuadra ? f.quadra.tipo : undefined) ?? "Quadra esportiva";
  const nota =
    f.nota ??
    f.avaliacao ??
    (hasNestedQuadra ? f.quadra.nota ?? f.quadra.avaliacao : undefined) ??
    4.5;
  const imagem_url =
    f.imagem_url ??
    (hasNestedQuadra ? f.quadra.imagem_url ?? f.quadra.imagem : undefined) ??
    "sem-imagem.png";
  return { favoritoId, quadraId, nome, preco, local, tipo, nota, imagem_url, _raw: f };
}

function precoSemSufixoBRL(v) {
  if (typeof v === "number") {
    return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });
  }
  let s = String(v || "").trim();
  s = s.replace(/\s*\/\s*hora\b/gi, "");
  s = s.replace(/\s*\/\s*h\b/gi, "");
  s = s.trim();
  if (!/^R\$\s?/.test(s)) {
    const num = parseFloat(s.replace(/[^\d.,]/g, "").replace(/\./g, "").replace(",", "."));
    if (Number.isFinite(num)) {
      s = num.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });
    }
  }
  return s;
}

function precoToNumberAny(v) {
  if (typeof v === "number") return v;
  const n = parseFloat(String(v || "").replace(/[^\d.,-]/g, "").replace(/\./g, "").replace(",", "."));
  return Number.isFinite(n) ? n : 0;
}

function getImagemNome(quadra) {
  const s = quadra?.imagem || quadra?.imagem_url || "";
  if (!s) return "sem-imagem.png";
  const clean = String(s).split("?")[0].split("#")[0];
  const file = clean.split("/").filter(Boolean).pop();
  return file || "sem-imagem.png";
}

async function resolverNomeUsuario() {
  try {
    const raw = localStorage.getItem("usuario");
    if (raw) {
      const u = JSON.parse(raw);
      if (u?.nome) return u.nome;
      if (u?.name) return u.name;
    }
    const nomeisolado = localStorage.getItem("nomeUsuario");
    if (nomeisolado) return nomeisolado;
    try {
      const { data } = await api.get("/auth/me");
      if (data?.nome) return data.nome;
      if (data?.name) return data.name;
    } catch {
      const uid = localStorage.getItem("usuario_id");
      if (uid) {
        const { data } = await api.get(`/usuarios/${uid}`);
        if (data?.nome) return data.nome;
        if (data?.name) return data.name;
      }
    }
  } catch (e) {
    console.warn("Falha ao resolver nome do usuário:", e);
  }
  return "Usuário(a)";
}

/* ================= Componente ================= */
export default function Home() {
  const navigate = useNavigate();

  const [nomeUsuario, setNomeUsuario] = useState("Usuário(a)");
  const [mostrarCookies, setMostrarCookies] = useState(false);
  const [notificacoesNaoLidas, setNotificacoesNaoLidas] = useState(0);

  // Favoritos
  const [uid, setUid] = useState(null);
  const [favSet, setFavSet] = useState(() => new Set());
  const [favIdByQuadra, setFavIdByQuadra] = useState(() => new Map());

  // Limite responsivo p/ "Quadras em destaque"
  const [destaqueCount, setDestaqueCount] = useState(() => {
    const w = typeof window !== "undefined" ? window.innerWidth : 1280;
    if (w < 640) return 4;   // mobile
    if (w < 1024) return 6;  // tablet
    return 9;                // desktop
  });
  useEffect(() => {
    function onResize() {
      const w = window.innerWidth;
      setDestaqueCount(w < 640 ? 4 : w < 1024 ? 6 : 9);
    }
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // sync favoritos
  useEffect(() => {
    let cancel = false;
    (async () => {
      const id = await getUsuarioIdSeguro();
      if (!cancel) setUid(id);
      if (!id) return;
      await sincronizarFavoritos(id);
    })();
    return () => { cancel = true; };
  }, []);

  async function sincronizarFavoritos(userId = uid) {
    if (!userId) return;
    try {
      const { data } = await api.get("/favoritos");
      const arr = Array.isArray(data) ? data : [];
      const normalizados = arr.map(normalizarFavorito);
      const novoSet = new Set(normalizados.map((x) => Number(x.quadraId)));
      const novoMap = new Map();
      for (const it of normalizados) {
        if (it.quadraId != null && it.favoritoId != null) {
          novoMap.set(Number(it.quadraId), Number(it.favoritoId));
        }
      }
      setFavSet(novoSet);
      setFavIdByQuadra(novoMap);
    } catch (err) {
      console.error("Erro ao sincronizar favoritos:", err?.response?.data || err?.message);
    }
  }

  const handleFavorite = async (quadra, isNowFav) => {
    const userId = uid ?? (await getUsuarioIdSeguro());
    if (!userId) {
      toast.error("Faça login para favoritar.");
      return;
    }
    try {
      if (isNowFav) {
        const precoNumber = precoToNumberAny(quadra?.preco);
        const dadosFavorito = {
          usuario_id: userId,
          quadra_id: quadra?.id || quadra?.quadra_id || 0,
          nome: quadra?.nome,
          preco: precoNumber,
          local: quadra?.local,
          imagem_url: getImagemNome(quadra),
          nota: quadra?.avaliacao || quadra?.nota || 4.5,
        };
        await api.post("/favoritos", dadosFavorito);
        toast.success("Adicionada aos favoritos!");
        try {
          await enviarNotificacao({
            tipo: "favorito",
            mensagem: `Você favoritou a quadra ${quadra?.nome}`,
          });
        } catch {}
      } else {
        const favId = favIdByQuadra.get(Number(quadra.id));
        if (favId) {
          await api.delete(`/favoritos/${favId}`);
        } else {
          await api.delete(`/favoritos/usuario/${userId}/quadra/${quadra.id}`);
        }
        toast("Removida dos favoritos.", { icon: "🗑️" });
      }
    } catch (err) {
      console.error("Erro ao atualizar favorito:", err?.response?.data || err?.message);
      toast.error(err?.response?.data?.erro || "Não foi possível atualizar favorito.");
    } finally {
      await sincronizarFavoritos(userId);
    }
  };

  // Keen slider (cartões maiores no mobile e sem vazar largura)
  const [sliderRef, instanceRef] = useKeenSlider({
    loop: true,
    mode: "free-snap",
    drag: true,
    rubberband: true,
    slides: { perView: 4, spacing: 16 },
    breakpoints: {
      "(max-width: 480px)":  { slides: { perView: 1.1, spacing: 10 } },
      "(max-width: 640px)":  { slides: { perView: 1.25, spacing: 12 } },
      "(max-width: 768px)":  { slides: { perView: 1.6,  spacing: 14 } },
      "(max-width: 1024px)": { slides: { perView: 2.5,  spacing: 14 } },
      "(max-width: 1280px)": { slides: { perView: 3.25, spacing: 16 } },
    },
  });
  useEffect(() => {
    if (!instanceRef.current) return;
    const id = setInterval(() => instanceRef.current?.next(), 5000);
    return () => clearInterval(id);
  }, [instanceRef]);

  // Notificações
  useEffect(() => {
    const usuario = JSON.parse(localStorage.getItem("usuario"));
    if (!usuario?.id) return;
    const buscarTodasNotificacoes = async () => {
      try {
        const { data } = await api.get("/notificacoes");
        const total = Array.isArray(data) ? data.length : 0;
        setNotificacoesNaoLidas(total);
      } catch (err) {
        if (err?.response?.status === 404) setNotificacoesNaoLidas(0);
        else console.error("Erro ao buscar notificações:", err?.response?.data || err?.message);
      }
    };
    buscarTodasNotificacoes();
    const intervalo = setInterval(buscarTodasNotificacoes, 15000);
    return () => clearInterval(intervalo);
  }, []);

  // Navegar p/ detalhe
  const handleQuadraClick = (quadra) => {
    const imagem_nome = getImagemNome(quadra);
    navigate(`/quadra/${quadra.id}`, {
      state: {
        quadra: {
          ...quadra,
          imagem_url: imagem_nome,
          imagem: `/quadras/${imagem_nome}`,
        },
      },
    });
  };

  // Nome do usuário
  useEffect(() => {
    let cancelado = false;
    async function carregarNome() {
      const nome = await resolverNomeUsuario();
      if (!cancelado) setNomeUsuario(nome || "Usuário(a)");
    }
    carregarNome();
    function onStorage(e) {
      if (e.key === "usuario" || e.key === "nomeUsuario" || e.key === "usuario_id") {
        carregarNome();
        getUsuarioIdSeguro().then((id) => {
          setUid(id);
          if (id) sincronizarFavoritos(id);
          else {
            setFavSet(new Set());
            setFavIdByQuadra(new Map());
          }
        });
      }
    }
    window.addEventListener("storage", onStorage);
    return () => {
      cancelado = true;
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  // Cookies
  const [cookiesState, setCookiesState] = useState(false);
  useEffect(() => {
    const cookiesAceitos = localStorage.getItem("cookiesAceitos");
    setCookiesState(cookiesAceitos !== "true");
    setMostrarCookies(cookiesAceitos !== "true");
  }, []);

  /* ================= Render ================= */
  return (
    <div className="flex min-h-screen bg-white overflow-x-hidden touch-pan-y">
      {/* Sidebar fixa no desktop */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* Topbar mobile */}
      <div className="md:hidden fixed top-0 left-0 w-full z-50">
        <MobileNav />
      </div>

      {/* Conteúdo central */}
      <main className="flex-1 text-black md:pl-64">
        <div className="mx-auto w-full max-w-[1200px] px-3 sm:px-4 lg:px-6 pt-16 md:pt-10">
          {/* HERO com z alto e overflow visível (dropdown) */}
          <div className="relative z-50 overflow-visible">
            <HomeHero nomeUsuario={nomeUsuario} notificacoesNaoLidas={notificacoesNaoLidas} />
          </div>

          {/* “Para você” */}
          <section className="mt-10">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Para você</h2>
            </div>

            <div className="relative mt-4">
              {/* Gradientes só no mobile para não vazar largura */}
              <div className="pointer-events-none absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-white to-transparent sm:hidden" />
              <div className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-white to-transparent sm:hidden" />

              <div
                ref={sliderRef}
                className="keen-slider overflow-hidden sm:overflow-visible px-0 sm:px-0"
              >
                {quadrasCarrossel.map((q) => {
                  const isFav = favSet.has(Number(q.id));
                  const imgName = getImagemNome(q);
                  const qSan = {
                    ...q,
                    preco: precoSemSufixoBRL(q.preco),
                    imagem: `/quadras/${imgName}`,
                  };
                  return (
                    <div key={q.id} className="keen-slider__slide min-w-0 px-2 touch-pan-y">
                      <div className="bg-white rounded-2xl shadow-md ring-1 ring-black/5 hover:shadow-lg transition">
                        <CourtCard
                          quadra={qSan}
                          variant="compact"
                          isFavorited={isFav}
                          onClick={() => handleQuadraClick(qSan)}
                          onFavorite={handleFavorite}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Quadras em destaque */}
          <section className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Quadras em destaque</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-6">
              {quadras.slice(0, destaqueCount).map((q) => {
                const isFav = favSet.has(Number(q.id));
                const imgName = getImagemNome(q);
                const qSan = {
                  ...q,
                  preco: precoSemSufixoBRL(q.preco),
                  imagem: `/quadras/${imgName}`,
                };
                return (
                  <div key={`${q.id}-${isFav ? 1 : 0}`} className="bg-white rounded-2xl shadow-md ring-1 ring-black/5 hover:shadow-lg transition">
                    <CourtCard
                      quadra={qSan}
                      variant="default"
                      isFavorited={isFav}
                      onClick={() => handleQuadraClick(qSan)}
                      onFavorite={handleFavorite}
                    />
                  </div>
                );
              })}
            </div>
          </section>

          {/* Cookies */}
          {mostrarCookies && cookiesState && (
            <section className="fixed bottom-6 left-0 right-0 sm:left-1/2 sm:right-auto sm:-translate-x-1/2 sm:w-[420px] mx-4 sm:mx-0 p-4 bg-green-700 text-white rounded-xl shadow-2xl z-50">
              <h2 className="font-bold text-lg mb-1">🍪 Nós usamos cookies!</h2>
              <p className="text-sm mb-3">
                Usamos cookies para melhorar sua experiência e analisar o tráfego do site.
              </p>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => {
                    localStorage.setItem("cookiesAceitos", "true");
                    setMostrarCookies(false);
                    setCookiesState(false);
                  }}
                  className="bg-white text-green-800 px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-100 transition"
                >
                  Aceitar todos
                </button>
                <button
                  onClick={() => {
                    localStorage.setItem("cookiesAceitos", "true");
                    setMostrarCookies(false);
                    setCookiesState(false);
                  }}
                  className="border border-white text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-600 transition"
                >
                  Rejeitar
                </button>
                <button
                  onClick={() => {
                    setMostrarCookies(false);
                    setCookiesState(false);
                  }}
                  className="w-full text-center mt-2 text-xs underline text-white/80 hover:text-white"
                >
                  Fechar
                </button>
              </div>
            </section>
          )}

          {/* Rodapé */}
          <footer className="bg-[#0f3d26] text-white mt-14 rounded-t-2xl">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 text-sm">
                <div>
                  <h3 className="text-base font-bold mb-2">Aluguel de Quadras</h3>
                  <p className="text-white/80">
                    Encontre, alugue e jogue nas melhores quadras da sua cidade.
                  </p>
                </div>
                <div>
                  <h3 className="text-base font-bold mb-2">Navegação</h3>
                  <ul className="space-y-1 text-white/80">
                    <li><Link to="/home" className="hover:text-white">Home</Link></li>
                    <li><Link to="/resultados" className="hover:text-white">Quadras</Link></li>
                    <li><Link to="/filtro" className="hover:text-white">Filtro</Link></li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-base font-bold mb-2">Suporte</h3>
                  <ul className="space-y-1 text-white/80">
                    <li><a href="#" className="hover:text-white">Central de ajuda</a></li>
                    <li><a href="#" className="hover:text-white">Termos</a></li>
                    <li><a href="#" className="hover:text-white">Privacidade</a></li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-base font-bold mb-2">Contato</h3>
                  <ul className="space-y-1 text-white/80">
                    <li>📧 eduardo_fortes@gmail.com</li>
                    <li>📞 +55 (19) 99938-7274</li>
                  </ul>
                </div>
              </div>

              <div className="mt-6 sm:mt-8 border-t border-white/15 pt-4 text-[12px] sm:text-xs flex flex-col sm:flex-row items-center justify-between gap-2 text-white/70">
                <p>© 2025 Aluguel de Quadras — Todos os direitos reservados.</p>
                <p>Feito com ❤️ para quem ama esporte.</p>
              </div>
            </div>
          </footer>
        </div>
      </main>
    </div>
  );
}
