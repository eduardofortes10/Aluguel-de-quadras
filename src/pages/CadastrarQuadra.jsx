import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import MobileNav from "../components/MobileNav";
import { FaSpinner, FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";


export default function CadastrarQuadra() {
  const [nome, setNome] = useState("");
  const [local, setLocal] = useState("");
  const [preco, setPreco] = useState("");
  const [tipo, setTipo] = useState("Futebol");
  const [imagens, setImagens] = useState([]);
  const [descricao, setDescricao] = useState("");
  const [carregando, setCarregando] = useState(false);
  const navigate = useNavigate();
  const usuario = JSON.parse(localStorage.getItem("usuario"));

  const handleImagemChange = (e) => {
    const files = Array.from(e.target.files);
    setImagens((prev) => [...prev, ...files]);
  };

  const handleRemoverImagem = (index) => {
    const novasImagens = imagens.filter((_, i) => i !== index);
    setImagens(novasImagens);
  };

  const handleCadastrar = async () => {
  if (!nome || !local || !preco || !tipo || imagens.length < 3) {
  toast.error("Preencha todos os campos e envie no mínimo 3 imagens da quadra.");
  return;
}



    setCarregando(true);
    const formData = new FormData();
    formData.append("nome", nome);
    formData.append("local", local);
    formData.append("preco", preco);
    formData.append("tipo", tipo);
    formData.append("descricao", descricao);
    formData.append("dono_id", usuario?.id || 1);
    formData.append("nota", 0);
    imagens.forEach((img) => formData.append("imagens", img));

    try {
      const response = await fetch("http://localhost:5000/api/quadras", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        navigate("/home-Locador");
      } else {
        const erro = await response.json();
        alert(erro.error || "Erro ao cadastrar quadra");
      }
    } catch (err) {
      console.error("Erro na requisição:", err);
      alert("Erro ao conectar com o servidor");
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <div className="hidden md:block">
        <Sidebar />
      </div>

      <MobileNav />

      <div className="flex-1 p-4 md:ml-64 pb-24">
        {/* Breadcrumb */}
        <div className="mb-4 flex items-center text-sm text-gray-500 gap-1">
          <Link to="/home-locador" className="text-gray-600 hover:underline flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
            </svg>
          </Link>
          <span className="mx-1">/</span>
          <span className="text-blue-600 font-medium">Cadastrar Quadra</span>
        </div>

        {/* Formulário */}
        <div className="max-w-3xl mx-auto bg-white p-6 rounded shadow">
          <h1 className="text-2xl font-bold text-green-700 mb-6">Cadastrar Nova Quadra</h1>

          <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                placeholder="Ex: 180"
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

            {/* Imagens */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Imagens da Quadra</label>
              <label htmlFor="imagens" className={`flex flex-col items-center justify-center w-full p-6 text-center border-2 border-dashed rounded-lg cursor-pointer transition ${imagens.length > 0 ? "border-green-400 bg-green-50" : "border-gray-300 bg-white"}`}>
                <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3" />
                </svg>
                <span className="text-sm text-gray-500 mt-2">Clique para selecionar imagens</span>
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

            {/* Descrição */}
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
                className={`w-full py-3 rounded text-white font-semibold transition ${carregando ? "bg-green-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"}`}
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
