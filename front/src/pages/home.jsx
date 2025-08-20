// src/pages/Home.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import { useNavigate, Link } from "react-router-dom";
import { quadras, quadrasCarrossel } from "../data/quadras";
import UserDropdown from "../components/DropdownUser";
import MobileNav from "../components/MobileNav";
import Sidebar from "../components/Sidebar";
import { api } from "../services/api";
import CourtCard from "../components/CourtCard";
import { toast } from "react-hot-toast";
import { enviarNotificacao } from "../services/notificacoes";

// ===== Helpers (reaproveitados do Favoritos / QuadraDetalhe) =====
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

// Normaliza qualquer formato de favorito vindo do backend
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

// extrai número do preço (aceita "R$ 120", "120", "120,00 /hora" etc.)
function precoToNumber(v) {
  if (typeof v === "number") return v;
  const limpo = String(v || "")
    .replace(/[R$\s]/g, "")
    .replace("/hora", "")
    .replace(/\./g, "")
    .replace(",", ".")
    .trim();
  const n = parseFloat(limpo);
  return Number.isFinite(n) ? n : 0;
}

function getImagemNome(quadra) {
  const s =
    quadra?.imagem_url ||
    quadra?.imagem ||
    "";
  const part = String(s).split("/").pop();
  return part || "sem-imagem.png";
}
// ================================================================

// Helper que resolve o nome do usuário a partir de múltiplas fontes
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

export default function Home() {
  const navigate = useNavigate();

  const [nomeUsuario, setNomeUsuario] = useState("Usuário(a)");
  const [mostrarCookies, setMostrarCookies] = useState(false);
  const [tipoSelecionado, setTipoSelecionado] = useState("Todos");
  const [notificacoesNaoLidas, setNotificacoesNaoLidas] = useState(0);

  // ===== Estado de favoritos =====
  const [uid, setUid] = useState(null);
  const [favSet, setFavSet] = useState(() => new Set());           // quadraId -> favoritado?
  const [favIdByQuadra, setFavIdByQuadra] = useState(() => new Map()); // quadraId -> favoritoId

  // Carregar usuário + favoritos
  useEffect(() => {
    let cancel = false;
    (async () => {
      const id = await getUsuarioIdSeguro();
      if (!cancel) setUid(id);
      if (!id) return; // usuário não logado: deixa set vazio
      await sincronizarFavoritos(id);
    })();
    return () => { cancel = true; };
  }, []);

  async function sincronizarFavoritos(userId = uid) {
    if (!userId) return;
    try {
      const { data } = await api.get(`/favoritos/${userId}`);
      const arr = Array.isArray(data) ? data : [];
      const normalizados = arr.map(normalizarFavorito);
      // monta estruturas
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

  // Handler do coração (add/remove)
  const handleFavorite = async (quadra, isNowFav) => {
    const userId = uid ?? (await getUsuarioIdSeguro());
    if (!userId) {
      toast.error("Faça login para favoritar.");
      return;
    }

    try {
      if (isNowFav) {
        // ADD
        const dadosFavorito = {
          usuario_id: userId,
          quadra_id: quadra?.id || quadra?.quadra_id || 0,
          nome: quadra?.nome,
          preco: precoToNumber(quadra?.preco),
          local: quadra?.local,
          imagem_url: getImagemNome(quadra),
          nota: quadra?.avaliacao || quadra?.nota || 4.5,
        };
        await api.post("/favoritos", dadosFavorito);
        toast.success("Adicionada aos favoritos!");
        // notificação opcional (mesma usada no detalhe)
        try {
          await enviarNotificacao({
            usuario_id: userId,
            tipo: "favorito",
            mensagem: `Você favoritou a quadra ${quadra?.nome}`,
          });
        } catch {}
      } else {
        // REMOVE
        const favId = favIdByQuadra.get(Number(quadra.id));
        if (favId) {
          await api.delete(`/favoritos/${favId}`);
        } else {
          // rota fallback (se existir no seu back)
          await api.delete(`/favoritos/usuario/${userId}/quadra/${quadra.id}`);
        }
        toast("Removida dos favoritos.", { icon: "🗑️" });
      }
    } catch (err) {
      console.error("Erro ao atualizar favorito:", err?.response?.data || err?.message);
      toast.error(err?.response?.data?.erro || "Não foi possível atualizar favorito.");
    } finally {
      // ressincroniza estado com o backend
      await sincronizarFavoritos(userId);
    }
  };

  // ===== Keen slider =====
  const [sliderRef, instanceRef] = useKeenSlider({
    loop: true,
    slides: { perView: 5, spacing: 16 },
  });

  useEffect(() => {
    if (!instanceRef.current) return;
    const id = setInterval(() => {
      instanceRef.current?.next();
    }, 5000);
    return () => clearInterval(id);
  }, [instanceRef]);

  // Notificações
  useEffect(() => {
    const usuario = JSON.parse(localStorage.getItem("usuario"));
    if (!usuario?.id) return;

    const buscarTodasNotificacoes = async () => {
      try {
        const { data } = await api.get(`/notificacoes/${usuario.id}`);
        const total = Array.isArray(data) ? data.length : 0;
        setNotificacoesNaoLidas(total);
      } catch (err) {
        console.error("Erro ao buscar notificações:", err?.response?.data || err?.message);
      }
    };

    buscarTodasNotificacoes();
    const intervalo = setInterval(buscarTodasNotificacoes, 15000);
    return () => clearInterval(intervalo);
  }, []);

  // Navegação detalhe (mantendo seu state de imagem)
  const handleQuadraClick = (quadra) => {
    const imagem_nome = quadra.imagem?.split("/").pop();
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
        // também podemos ressincronizar favoritos ao trocar de usuário
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

  // Cookie banner
  useEffect(() => {
    const cookiesAceitos = localStorage.getItem("cookiesAceitos");
    setMostrarCookies(cookiesAceitos !== "true");
  }, []);

  return (
    <div className="flex min-h-screen overflow-x-hidden">
      <div className="hidden md:block">
        <Sidebar />
      </div>

      <div className="md:hidden fixed top-0 left-0 w-full z-50">
        <MobileNav />
      </div>

      <div className="flex-1 bg-white text-black transition-colors px-4 pl-16 overflow-hidden">
        <div className="relative bg-gradient-to-b from-[#1E8449] to-[#14532d] text-white p-6 pb-10 rounded-b-3xl shadow-md z-10">
          {/* Sino / Notificações */}
          <Link to="/notificacao" className="absolute top-6 left-4 sm:left-16">
            <div className="relative group">
              <div className="bg-white rounded-full w-10 h-10 shadow flex items-center justify-center group-hover:scale-105 transition">
                <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 2a6 6 0 00-6 6v2.586l-.707.707A1 1 0 004 13h12a1 1 0 00.707-1.707L16 10.586V8a6 6 0 00-6-6zm0 16a2 2 0 001.995-1.85L12 16H8a2 2 0 001.85 1.995L10 18z" />
                </svg>
              </div>
              {notificacoesNaoLidas > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-semibold px-1.5 py-[1px] rounded-full shadow">
                  {notificacoesNaoLidas}
                </span>
              )}
            </div>
          </Link>

          {/* Dropdown do usuário */}
          <div className="fixed top-4 right-4 z-[9999]">
            <UserDropdown />
          </div>

          <h1 className="text-2xl font-bold text-center">Olá, {nomeUsuario}</h1>
          <p className="text-sm mt-1 text-center">Sua quadra, seu jogo!</p>

          {/* Busca + Filtro */}
          <div className="flex items-center justify-center mt-4">
            <div className="flex items-center bg-white rounded-full px-4 py-2 shadow-md">
              <svg className="w-5 h-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M5 11a6 6 0 1112 0 6 6 0 01-12 0z" />
              </svg>
              <input
                type="text"
                placeholder="Procure sua quadra aqui"
                className="outline-none text-gray-700 w-64"
              />
            </div>

            <button
              className="ml-2 p-3 bg-white rounded-xl shadow-md hover:bg-green-100"
              onClick={() => navigate("/filtro")}
            >
              <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M3 4a1 1 0 011-1h16a1 1 0 01.8 1.6l-6.2 7.9V19a1 1 0 01-1.6.8l-2-1.5a1 1 0 01-.4-.8v-5.8L3.2 5.6A1 1 0 013 4z" />
              </svg>
            </button>
          </div>

          {/* Atalhos por tipo */}
          <div className="flex gap-6 mt-6 justify-center flex-wrap">
            {[
              { nome: "Futebol", img: "/quadras/Imagem2logo.png" },
              { nome: "Basquete", img: "/quadras/imagem1logo.png" },
              { nome: "Vôlei", img: "/quadras/imagem4logo.png" },
              { nome: "Tênis", img: "/quadras/imagem3logo.png" },
            ].map(({ nome, img }) => (
              <div
                key={nome}
                onClick={() =>
                  navigate("/resultados", {
                    state: { tipo: [nome], precoMaximo: "", avaliacaoMinima: "", local: "" },
                  })
                }
                className="flex flex-col items-center cursor-pointer"
              >
                <div className="bg-white rounded-full p-2 shadow-md hover:scale-105 transition-transform duration-200">
                  <img src={img} alt={nome} className="w-10 h-10 object-contain" />
                </div>
                <span className="text-sm mt-1 capitalize text-white drop-shadow">{nome}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Carrossel "Para você" */}
        <div className="mt-10">
          <h2 className="text-xl font-semibold mb-4">Para você</h2>
          <div ref={sliderRef} className="keen-slider">
            {quadrasCarrossel.map((q) => {
              const isFav = favSet.has(Number(q.id));
              return (
                <div key={q.id} className="keen-slider__slide px-2 md:px-3">
                  <CourtCard
                    key={`${q.id}-${isFav ? 1 : 0}`} // re-monta se o estado mudar (só por garantia)
                    quadra={q}
                    variant="compact"
                    isFavorited={isFav}
                    onClick={() => handleQuadraClick(q)}
                    onFavorite={handleFavorite}
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* Quadras em destaque */}
        <div className="mt-10">
          <h2 className="text-xl font-semibold mb-4 text-green-700">Quadras em destaque</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {quadras.map((q) => {
              const isFav = favSet.has(Number(q.id));
              return (
                <CourtCard
                  key={`${q.id}-${isFav ? 1 : 0}`} // idem
                  quadra={q}
                  variant="default"
                  isFavorited={isFav}
                  onClick={() => handleQuadraClick(q)}
                  onFavorite={handleFavorite}
                />
              );
            })}
          </div>
        </div>

        {/* COOKIES */}
        {mostrarCookies && (
          <section className="fixed bottom-10 left-6 sm:left-12 max-w-md w-[90%] sm:w-[400px] p-4 bg-green-700 text-white rounded-xl shadow-xl z-50 transition-all">
            <h2 className="font-bold text-lg mb-1">🍪 Nós usamos cookies!</h2>
            <p className="text-sm mb-3">
              Usamos cookies para melhorar sua experiência e analisar o tráfego do site.
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => {
                  localStorage.setItem("cookiesAceitos", "true");
                  setMostrarCookies(false);
                }}
                className="bg-white text-green-800 px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-100 transition"
              >
                Aceitar todos
              </button>
              <button
                onClick={() => {
                  localStorage.setItem("cookiesAceitos", "true");
                  setMostrarCookies(false);
                }}
                className="border border-white text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-600 transition"
              >
                Rejeitar
              </button>
              <button
                onClick={() => setMostrarCookies(false)}
                className="w-full text-center mt-2 text-xs underline text-white/80 hover:text-white"
              >
                Fechar
              </button>
            </div>
          </section>
        )}

        {/* RODAPÉ */}
        <footer className="bg-[#14532d] text-white py-10 mt-12">
          <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 text-sm">
            <div>
              <h3 className="text-lg font-bold mb-2">Sobre</h3>
              <p>Encontre, alugue e jogue nas melhores quadras da sua cidade.</p>
            </div>

            <div>
              <h3 className="text-lg font-bold mb-2">Navegação</h3>
              <ul className="space-y-1">
                <li><a href="#" className="hover:underline">Home</a></li>
                <li><a href="#" className="hover:underline">Quadras</a></li>
                <li><a href="#" className="hover:underline">Contato</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-bold mb-2">Redes sociais</h3>
              <ul className="space-y-1">
                <li><a href="#" className="hover:underline">Instagram</a></li>
                <li><a href="#" className="hover:underline">Facebook</a></li>
                <li><a href="#" className="hover:underline">Twitter</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-bold mb-2">Contato</h3>
              <p className="mb-1">📧 eduardo_fortes@gmail.com</p>
              <p>📞 +55 (19) 99938-7274</p>
            </div>
          </div>
          <div className="mt-8 text-center text-xs border-t border-white/20 pt-4">
            © 2025 Aluguel de Quadras — Todos os direitos reservados.
          </div>
        </footer>
      </div>
    </div>
  );
}
