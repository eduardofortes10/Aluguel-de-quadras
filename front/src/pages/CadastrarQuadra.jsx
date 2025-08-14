// src/pages/CadastrarQuadra.jsx
import React, { useState, useEffect, useMemo, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import MobileNav from "../components/MobileNav";
import { FaSpinner, FaTrash, FaChevronRight, FaChevronLeft, FaCheck, FaCloudUploadAlt, FaMapMarkerAlt, FaClock, FaImage } from "react-icons/fa";
import { toast } from "react-hot-toast";
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

  // passo
  const [step, setStep] = useState(1);

  // passo 1 - informações
  const [nome, setNome] = useState("");
  const [tipo, setTipo] = useState("Futebol");
  const [cep, setCep] = useState("");
  const [endereco, setEndereco] = useState(""); // logradouro
  const [numero, setNumero] = useState("");
  const [complemento, setComplemento] = useState("");
  const [bairro, setBairro] = useState("");
  const [cidade, setCidade] = useState("");
  const [uf, setUf] = useState("");

  // passo 2 - imagens
  const [imagens, setImagens] = useState([]); // File[]
  const inputFileRef = useRef(null);

  // passo 3 - preço/horários/descrição
  const [preco, setPreco] = useState("");
  const [horarioInicio, setHorarioInicio] = useState("08:00");
  const [horarioFim, setHorarioFim] = useState("22:00");
  const [descricao, setDescricao] = useState("");

  // estado geral
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

  // ViaCEP
  const buscarCEP = async (cepValor) => {
    const apenasNumeros = String(cepValor || "").replace(/\D/g, "");
    if (apenasNumeros.length !== 8) {
      toast("CEP deve ter 8 dígitos.", { icon: "📮" });
      return;
    }
    try {
      const resp = await fetch(`https://viacep.com.br/ws/${apenasNumeros}/json/`);
      const data = await resp.json();
      if (data?.erro) {
        toast.error("CEP não encontrado.");
        return;
      }
      setEndereco(data.logradouro || "");
      setBairro(data.bairro || "");
      setCidade(data.localidade || "");
      setUf(data.uf || "");
    } catch (e) {
      console.error(e);
      toast.error("Falha ao buscar CEP.");
    }
  };

  // Dropzone handlers
  const handleImagemChange = (e) => {
    const files = Array.from(e.target.files || []);
    addFiles(files);
  };

  const addFiles = (files) => {
    const onlyImages = files.filter((f) => f.type.startsWith("image/"));
    if (onlyImages.length !== files.length) {
      toast("Alguns arquivos foram ignorados por não serem imagens.", { icon: "⚠️" });
    }
    if (onlyImages.length === 0) return;
    setImagens((prev) => {
      // evita duplicadas por nome+tamanho
      const map = new Map(prev.map((f) => [`${f.name}-${f.size}`, f]));
      for (const f of onlyImages) map.set(`${f.name}-${f.size}`, f);
      return Array.from(map.values()).slice(0, 10); // limite opcional 10
    });
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addFiles(Array.from(e.dataTransfer.files || []));
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleRemoverImagem = (index) => {
    setImagens((prev) => prev.filter((_, i) => i !== index));
  };

  const moverImagem = (from, to) => {
    setImagens((prev) => {
      const arr = [...prev];
      const [m] = arr.splice(from, 1);
      arr.splice(to, 0, m);
      return arr;
    });
  };

  // validações por passo
  const step1Valido = useMemo(() => {
    const cepOk = /^\d{5}-?\d{3}$/.test(cep);
    return nome.trim().length >= 3 && tipo && cepOk && endereco.trim() && bairro.trim() && cidade.trim() && uf.trim();
  }, [nome, tipo, cep, endereco, bairro, cidade, uf]);

  const step2Valido = useMemo(() => imagens.length >= 3, [imagens]);

  const step3Valido = useMemo(() => {
    const precoNumber = parsePrecoToNumber(preco);
    const horariosOk = horarioInicio && horarioFim && horarioInicio < horarioFim;
    return !isNaN(precoNumber) && precoNumber > 0 && horariosOk && descricao.trim().length >= 10;
  }, [preco, horarioInicio, horarioFim, descricao]);

  const progresso = useMemo(() => {
    const total = 3;
    const done =
      (step1Valido ? 1 : 0) +
      (step2Valido ? 1 : 0) +
      (step3Valido ? 1 : 0);
    return Math.round((done / total) * 100);
  }, [step1Valido, step2Valido, step3Valido]);

  const next = () => {
    if (step === 1 && !step1Valido) return toast.error("Complete as informações básicas antes de avançar.");
    if (step === 2 && !step2Valido) return toast.error("Envie ao menos 3 imagens.");
    setStep((s) => Math.min(3, s + 1));
  };

  const prev = () => setStep((s) => Math.max(1, s - 1));

  const handleCadastrar = async () => {
    const { id: donoId } = await getUsuarioAtual();
    if (!donoId) {
      toast.error("Sessão expirada. Faça login novamente.");
      navigate("/login", { replace: true });
      return;
    }

    const precoNumber = parsePrecoToNumber(preco);
    const localStr = `${endereco}${numero ? `, ${numero}` : ""}${bairro ? ` - ${bairro}` : ""}, ${cidade}${uf ? `-${uf}` : ""}`;

    if (!step1Valido || !step2Valido || !step3Valido) {
      toast.error("Revise os campos: informações, imagens e preço/horários.");
      return;
    }

    setCarregando(true);
    const formData = new FormData();

    formData.append("nome", nome.trim());
    formData.append("local", localStr.trim());
    formData.append("preco", String(precoNumber));
    formData.append("tipo", normalizarTipo(tipo));
    formData.append("descricao", `${descricao.trim()} | Funcionamento: ${horarioInicio}–${horarioFim}`);
    formData.append("dono_id", String(donoId));
    formData.append("nota", "0");
    formData.append("cep", String(cep || "").replace(/\D/g, "")); // só números
    formData.append("endereco", endereco.trim());                 // logradouro
    formData.append("numero", numero.trim());
    formData.append("complemento", complemento.trim());
    formData.append("bairro", bairro.trim());
    formData.append("cidade", cidade.trim());
    formData.append("uf", uf.trim().toUpperCase().slice(0, 2));
    
    formData.append("horario_inicio", horarioInicio);             // "08:00"
    formData.append("horario_fim", horarioFim);                   // "22:00"
    
    // opcional, mas garante o status inicial
    formData.append("status", "ativa");
    imagens.forEach((file) => {
      formData.append("imagens", file, file.name);
    });

    try {
      const { data } = await api.post("/quadras", formData);
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
    <div className="flex min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-100">
      {/* Sidebar desktop */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* Nav mobile fixa (corrigido) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40">
        <div className="bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/70 border-t px-4 py-2 pb-[env(safe-area-inset-bottom)]">
          <MobileNav />
        </div>
      </div>

      <div className="flex-1 p-4 md:ml-64 pb-24">
        

        {/* Card container */}
        <div className="max-w-5xl mx-auto relative">
          {/* Glass header */}
          <div className="rounded-2xl border bg-white/70 backdrop-blur shadow-sm">
            <div className="px-6 py-5 border-b">
              <div className="flex items-center justify-between gap-3">
                <h1 className="text-2xl font-bold text-green-700">Cadastrar Nova Quadra</h1>
                <div className="hidden md:flex items-center gap-2 text-xs">
                  <span className={`px-2 py-1 rounded-full ${step1Valido ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>Informações</span>
                  <FaChevronRight className="opacity-50" />
                  <span className={`px-2 py-1 rounded-full ${step2Valido ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>Imagens</span>
                  <FaChevronRight className="opacity-50" />
                  <span className={`px-2 py-1 rounded-full ${step3Valido ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>Preço & Horários</span>
                </div>
              </div>
              {/* Progress */}
              <div className="mt-4 h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-green-500 rounded-full transition-all" style={{ width: `${progresso}%` }} />
              </div>
            </div>

            {/* conteúdo */}
            <form className="px-6 py-6" onSubmit={(e) => e.preventDefault()}>
              {/* STEP 1 */}
              {step === 1 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Nome da Quadra</label>
                    <input
                      type="text"
                      value={nome}
                      onChange={(e) => setNome(e.target.value)}
                      className={`mt-1 block w-full p-3 border rounded-xl focus:outline-none focus:ring-2 ${nome.trim().length >= 3 ? "border-gray-300 focus:ring-green-500" : "border-rose-300 focus:ring-rose-400"}`}
                      placeholder="Ex: Quadra Society Alpha"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Tipo</label>
                    <select
                      value={tipo}
                      onChange={(e) => setTipo(e.target.value)}
                      className="mt-1 block w-full p-3 border rounded-xl focus:outline-none focus:ring-2 border-gray-300 focus:ring-green-500"
                    >
                      <option>Futebol</option>
                      <option>Society</option>
                      <option>Basquete</option>
                      <option>Tênis</option>
                      <option>Vôlei</option>
                      <option>Golfe</option>
                      <option>Poliesportiva</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                      <FaMapMarkerAlt /> CEP
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={cep}
                        onChange={(e) => setCep(e.target.value)}
                        placeholder="Ex: 01001-000"
                        className={`mt-1 block w-full p-3 border rounded-xl focus:outline-none focus:ring-2 ${/^\d{5}-?\d{3}$/.test(cep) ? "border-gray-300 focus:ring-green-500" : "border-amber-300 focus:ring-amber-400"}`}
                      />
                      <button
                        type="button"
                        onClick={() => buscarCEP(cep)}
                        className="mt-1 px-4 rounded-xl border bg-white hover:bg-gray-50 text-gray-700"
                      >
                        Buscar
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Usamos o CEP para preencher endereço automaticamente.</p>
                  </div>

                  <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-12 gap-4">
                    <div className="md:col-span-6">
                      <label className="block text-sm font-medium text-gray-700">Endereço</label>
                      <input
                        type="text"
                        value={endereco}
                        onChange={(e) => setEndereco(e.target.value)}
                        className={`mt-1 block w-full p-3 border rounded-xl focus:outline-none focus:ring-2 ${endereco.trim() ? "border-gray-300 focus:ring-green-500" : "border-rose-300 focus:ring-rose-400"}`}
                        placeholder="Logradouro (rua/avenida)"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700">Número</label>
                      <input
                        type="text"
                        value={numero}
                        onChange={(e) => setNumero(e.target.value)}
                        className="mt-1 block w-full p-3 border rounded-xl focus:outline-none focus:ring-2 border-gray-300 focus:ring-green-500"
                        placeholder="Nº"
                      />
                    </div>
                    <div className="md:col-span-4">
                      <label className="block text-sm font-medium text-gray-700">Complemento</label>
                      <input
                        type="text"
                        value={complemento}
                        onChange={(e) => setComplemento(e.target.value)}
                        className="mt-1 block w-full p-3 border rounded-xl focus:outline-none focus:ring-2 border-gray-300 focus:ring-green-500"
                        placeholder="Opcional (ex: bloco, referência)"
                      />
                    </div>
                    <div className="md:col-span-4">
                      <label className="block text-sm font-medium text-gray-700">Bairro</label>
                      <input
                        type="text"
                        value={bairro}
                        onChange={(e) => setBairro(e.target.value)}
                        className={`mt-1 block w-full p-3 border rounded-xl focus:outline-none focus:ring-2 ${bairro.trim() ? "border-gray-300 focus:ring-green-500" : "border-rose-300 focus:ring-rose-400"}`}
                        placeholder="Bairro"
                      />
                    </div>
                    <div className="md:col-span-6">
                      <label className="block text-sm font-medium text-gray-700">Cidade</label>
                      <input
                        type="text"
                        value={cidade}
                        onChange={(e) => setCidade(e.target.value)}
                        className={`mt-1 block w-full p-3 border rounded-xl focus:outline-none focus:ring-2 ${cidade.trim() ? "border-gray-300 focus:ring-green-500" : "border-rose-300 focus:ring-rose-400"}`}
                        placeholder="Cidade"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700">UF</label>
                      <input
                        type="text"
                        value={uf}
                        onChange={(e) => setUf(e.target.value.toUpperCase().slice(0, 2))}
                        className={`mt-1 block w-full p-3 border rounded-xl focus:outline-none focus:ring-2 ${uf.trim().length === 2 ? "border-gray-300 focus:ring-green-500" : "border-rose-300 focus:ring-rose-400"}`}
                        placeholder="SP"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2 */}
              {step === 2 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Imagens da Quadra</label>

                  <div
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    className={`flex flex-col items-center justify-center w-full p-10 text-center border-2 border-dashed rounded-2xl transition ${
                      imagens.length > 0 ? "border-green-400 bg-green-50" : "border-gray-300 bg-white"
                    }`}
                  >
                    <FaCloudUploadAlt className="w-10 h-10 opacity-70" />
                    <span className="text-sm text-gray-600 mt-2">Arraste e solte as imagens aqui</span>
                    <span className="text-xs text-gray-500">ou</span>
                    <button
                      type="button"
                      onClick={() => inputFileRef.current?.click()}
                      className="mt-3 px-4 py-2 rounded-xl bg-green-600 text-white hover:bg-green-700"
                    >
                      Selecionar arquivos
                    </button>
                    <input
                      ref={inputFileRef}
                      id="imagens"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      multiple
                      onChange={handleImagemChange}
                    />
                    <p className={`text-xs mt-3 ${imagens.length < 3 ? "text-red-600" : "text-gray-500"}`}>
                      {imagens.length}/3 imagens selecionadas (mínimo 3, máximo 10)
                    </p>
                  </div>

                  {imagens.length > 0 && (
                    <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                      {imagens.map((img, i) => (
                        <div key={`${img.name}-${img.size}-${i}`} className="relative group rounded-xl overflow-hidden border bg-white">
                          <img
                            src={URL.createObjectURL(img)}
                            alt={`imagem-${i}`}
                            className="object-cover w-full h-32"
                            onLoad={(e) => URL.revokeObjectURL(e.currentTarget.src)}
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition flex items-end justify-between p-2 opacity-0 group-hover:opacity-100">
                            <div className="flex gap-2">
                              <button
                                type="button"
                                onClick={() => i > 0 && moverImagem(i, i - 1)}
                                className="px-2 py-1 text-xs rounded-md bg-white/90 hover:bg-white"
                                title="Mover para a esquerda"
                              >
                                ←
                              </button>
                              <button
                                type="button"
                                onClick={() => i < imagens.length - 1 && moverImagem(i, i + 1)}
                                className="px-2 py-1 text-xs rounded-md bg-white/90 hover:bg-white"
                                title="Mover para a direita"
                              >
                                →
                              </button>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleRemoverImagem(i)}
                              className="px-2 py-1 text-xs rounded-md bg-red-600 text-white hover:bg-red-700"
                              title="Remover"
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* STEP 3 */}
              {step === 3 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Preço por hora</label>
                    <input
                      type="text"
                      value={preco}
                      onChange={(e) => setPreco(e.target.value)}
                      className={`mt-1 block w-full p-3 border rounded-xl focus:outline-none focus:ring-2 ${!isNaN(parsePrecoToNumber(preco)) && parsePrecoToNumber(preco) > 0 ? "border-gray-300 focus:ring-green-500" : "border-rose-300 focus:ring-rose-400"}`}
                      placeholder="Ex: 180 ou 180,50"
                    />
                    <p className="text-xs text-gray-500 mt-1">Formato livre. Ex: 150, 150,90, 200.50</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                      <FaClock /> Horário de Funcionamento
                    </label>
                    <div className="mt-1 grid grid-cols-2 gap-3">
                      <input
                        type="time"
                        value={horarioInicio}
                        onChange={(e) => setHorarioInicio(e.target.value)}
                        className="p-3 border rounded-xl focus:outline-none focus:ring-2 border-gray-300 focus:ring-green-500"
                      />
                      <input
                        type="time"
                        value={horarioFim}
                        onChange={(e) => setHorarioFim(e.target.value)}
                        className={`p-3 border rounded-xl focus:outline-none focus:ring-2 ${horarioFim > horarioInicio ? "border-gray-300 focus:ring-green-500" : "border-rose-300 focus:ring-rose-400"}`}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Ex.: 08:00 até 22:00</p>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Descrição</label>
                    <div className="relative">
                      <textarea
                        value={descricao}
                        onChange={(e) => setDescricao(e.target.value)}
                        placeholder="Ex: Quadra coberta com vestiário, iluminação noturna, estacionamento e segurança. Regras de uso, política de cancelamento etc."
                        className={`mt-1 w-full h-36 p-3 border rounded-xl text-gray-700 focus:outline-none focus:ring-2 ${descricao.trim().length >= 10 ? "border-gray-300 focus:ring-green-500" : "border-amber-300 focus:ring-amber-400"}`}
                      />
                      <span className="absolute bottom-2 right-3 text-xs text-gray-500">{descricao.trim().length}/5000</span>
                    </div>
                  </div>

                  <div className="md:col-span-2 bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-start gap-3">
                    <FaImage className="mt-1" />
                    <div className="text-sm text-emerald-900">
                      <p><strong>Dica:</strong> fotos bem iluminadas e na horizontal aumentam as reservas.</p>
                      <p>Adicione fotos da quadra, vestiários, iluminação noturna e estacionamento.</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Ações */}
              <div className="mt-8 flex items-center justify-between">
                <button
                  type="button"
                  onClick={prev}
                  disabled={step === 1}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl border ${step === 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-50"}`}
                >
                  <FaChevronLeft /> Voltar
                </button>

                {step < 3 ? (
                  <button
                    type="button"
                    onClick={next}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-green-600 text-white hover:bg-green-700"
                  >
                    Avançar <FaChevronRight />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleCadastrar}
                    disabled={carregando}
                    className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl text-white font-semibold transition ${
                      carregando ? "bg-green-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
                    }`}
                  >
                    {carregando ? (
                      <>
                        <FaSpinner className="animate-spin" /> Salvando...
                      </>
                    ) : (
                      <>
                        <FaCheck /> Salvar Quadra
                      </>
                    )}
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* overlay de carregamento opcional */}
      {carregando && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-lg px-6 py-4 flex items-center gap-3">
            <FaSpinner className="animate-spin" />
            <span>Enviando dados...</span>
          </div>
        </div>
      )}
    </div>
  );
}
