// src/pages/CadastrarQuadra.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import MobileNav from "../components/MobileNav";
import { FaSpinner, FaTrash } from "react-icons/fa";
import { toast } from "react-hot-toast"; // ✅ CORRIGIDO
import { api } from "../services/api";

// helpers
async function getUsuarioAtual() {
  try {
    const raw = localStorage.getItem("usuario");
    if (raw) {
      const u = JSON.parse(raw);
      const id = u?.id ?? u?.usuario_id ?? null;
      const tipo = u?.tipo || u?.tipo_usuario || null;
      if (id) return { id: Number(id), tipo };
    }
    const uidStr = localStorage.getItem("usuario_id");
    if (uidStr && /^\d+$/.test(uidStr)) {
      let tipo = null;
      try {
        const raw2 = localStorage.getItem("usuario");
        if (raw2) {
          const u2 = JSON.parse(raw2);
          tipo = u2?.tipo || u2?.tipo_usuario || null;
        }
      } catch {}
      return { id: Number(uidStr), tipo };
    }
    const { data } = await api.get("/auth/me");
    const id = data?.id ?? data?.usuario_id ?? null;
    const tipo = data?.tipo || data?.tipo_usuario || null;
    if (id) return { id: Number(id), tipo };
  } catch {}
  return { id: null, tipo: null };
}

function normalizarTipo(v) {
  if (!v) return "Futebol";
  const s = String(v).trim().toLowerCase();
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function parsePrecoToNumber(v) {
  const cleaned = String(v ?? "").replace(/[^\d.,-]/g, "").replace(/\./g, "").replace(",", ".");
  const num = parseFloat(cleaned);
  return Number.isFinite(num) ? num : NaN;
}

export default function CadastrarQuadra() {
  const navigate = useNavigate();

  const [nome, setNome] = useState("");
  const [local, setLocal] = useState("");
  const [preco, setPreco] = useState("");
  const [tipo, setTipo] = useState("Futebol");
  const [imagens, setImagens] = useState([]); // File[]
  const [descricao, setDescricao] = useState("");
  const [carregando, setCarregando] = useState(false);

  // garante login + papel locador
  useEffect(() => {
    let cancel = false;
    (async () => {
      const { id, tipo } = await getUsuarioAtual();
      if (!id) {
        toast.error("Faça login para cadastrar quadras.");
        navigate("/login", { replace: true });
        return;
      }
      if (tipo !== "locador") {
        toast("Você não tem acesso a esta página.", { icon: "⛔" });
        navigate("/home", { replace: true });
        return;
      }
      if (cancel) return;
    })();
    return () => {
      cancel = true;
    };
  }, [navigate]);

  const handleImagemChange = (e) => {
    const files = Array.from(e.target.files || []);
    const onlyImages = files.filter((f) => f.type.startsWith("image/"));
    if (onlyImages.length !== files.length) {
      toast("Alguns arquivos foram ignorados por não serem imagens.", { icon: "⚠️" });
    }
    setImagens((prev) => [...prev, ...onlyImages]);
  };

  const handleRemoverImagem = (index) => {
    setImagens((prev) => prev.filter((_, i) => i !== index));
  };

  const handleCadastrar = async () => {
    const { id: donoId } = await getUsuarioAtual();
    if (!donoId) {
      toast.error("Sessão expirada. Faça login novamente.");
      navigate("/login", { replace: true });
      return;
    }

    const precoNumber = parsePrecoToNumber(preco);
    if (!nome || !local || isNaN(precoNumber) || precoNumber <= 0 || !tipo || imagens.length < 3) {
      toast.error("Preencha todos os campos corretamente e envie no mínimo 3 imagens.");
      return;
    }

    setCarregando(true);
    const formData = new FormData();

    formData.append("nome", nome.trim());
    formData.append("local", local.trim());
    formData.append("preco", String(precoNumber));
    formData.append("tipo", normalizarTipo(tipo));
    formData.append("descricao", descricao.trim());
    formData.append("dono_id", String(donoId));
    formData.append("nota", "0");

    // envie APENAS o campo aceito pelo Multer
    imagens.forEach((file) => {
      formData.append("imagens", file, file.name);
    });

    try {
      const { data } = await api.post("/quadras", formData); // não defina Content-Type manualmente
      console.log("🟢 Resposta do servidor:", data);
      toast.success("Quadra cadastrada com sucesso!");
      navigate("/home-locador");
    } catch (err) {
      console.error("❌ Erro na requisição:", err);
      const msg =
        err?.response?.data?.erro ||
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        err?.message ||
        "Erro ao cadastrar quadra.";
      toast.error(msg);
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="flex bg-gray-100 min-h-screen">
      {/* Sidebar desktop */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* Nav mobile */}
      <div className="md:hidden fixed bottom-14 left-0 w-full bg-[#14532d] p-4 flex justify-between items-center z-50 shadow-inner">
        <MobileNav />
      </div>

      <div className="flex-1 p-4 md:ml-64 pb-24">
        <div className="mb-4 flex items-center text-sm text-gray-500 gap-1">
          <Link to="/home-locador" className="text-gray-600 hover:underline flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
            </svg>
            Início
          </Link>
          <span className="mx-1">/</span>
          <span className="text-blue-600 font-medium">Cadastrar Quadra</span>
        </div>

        <div className="max-w-3xl mx-auto bg-white p-6 rounded shadow">
          <h1 className="text-2xl font-bold text-green-700 mb-6">Cadastrar Nova Quadra</h1>

          <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label className="block text-sm font-medium text-gray-700">Nome</label>
              <input
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className="mt-1 block w-full p-3 border rounded"
                placeholder="Ex: Quadra Society Alpha"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Localização</label>
              <input
                type="text"
                value={local}
                onChange={(e) => setLocal(e.target.value)}
                className="mt-1 block w-full p-3 border rounded"
                placeholder="Ex: Centro, São Paulo"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Preço</label>
              <input
                type="text"
                value={preco}
                onChange={(e) => setPreco(e.target.value)}
                className="mt-1 block w-full p-3 border rounded"
                placeholder="Ex: 180 ou 180,50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Tipo</label>
              <select
                value={tipo}
                onChange={(e) => setTipo(e.target.value)}
                className="mt-1 block w-full p-3 border rounded"
              >
                <option>Futebol</option>
                <option>Basquete</option>
                <option>Tênis</option>
                <option>Vôlei</option>
                <option>Society</option>
                <option>Golfe</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Imagens da Quadra</label>
              <label
                htmlFor="imagens"
                className={`flex flex-col items-center justify-center w-full p-6 text-center border-2 border-dashed rounded-lg cursor-pointer transition ${
                  imagens.length > 0 ? "border-green-400 bg-green-50" : "border-gray-300 bg-white"
                }`}
              >
                <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3" />
                </svg>
                <span className="text-sm text-gray-500 mt-2">Clique para selecionar imagens (mínimo 3)</span>
                <input
                  id="imagens"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  multiple
                  onChange={handleImagemChange}
                />
              </label>

              {imagens.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-4">
                  {imagens.map((img, i) => (
                    <div key={i} className="relative w-24 h-24">
                      <img
                        src={URL.createObjectURL(img)}
                        alt={`imagem-${i}`}
                        className="object-cover w-full h-full rounded"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoverImagem(i)}
                        className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                        title="Remover"
                      >
                        <FaTrash size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Descrição</label>
              <textarea
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                placeholder="Ex: Quadra coberta com vestiário e iluminação noturna..."
                className="mt-2 w-full h-32 p-3 border rounded text-gray-700"
              />
            </div>

            <div className="md:col-span-2">
              <button
                type="button"
                onClick={handleCadastrar}
                disabled={carregando}
                className={`w-full py-3 rounded text-white font-semibold transition ${
                  carregando ? "bg-green-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
                }`}
              >
                {carregando ? (
                  <span className="flex items-center justify-center gap-2">
                    <FaSpinner className="animate-spin" /> Salvando...
                  </span>
                ) : (
                  "Salvar Quadra"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
