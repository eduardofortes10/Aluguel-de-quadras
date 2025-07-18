import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import UserDropdown from "../components/DropdownUser";
import MobileNav from "../components/MobileNav";

export default function HomeLocador() {
  const [quadras, setQuadras] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
  const usuario = JSON.parse(localStorage.getItem("usuario"));
  if (!usuario?.id) return;

fetch("http://localhost:5000/api/quadras?dono_id=" + usuario?.id)

    .then((res) => res.json())
    .then((data) => setQuadras(data))
    .catch((err) => console.error("Erro ao carregar quadras:", err));
}, []);


  const handleNovaQuadra = () => {
    navigate("/cadastrarquadra");
  };

  return (
    <div className="flex min-h-screen bg-gray-100 relative">
  {/* Sidebar desktop */}
  <div className="hidden md:block">
    <Sidebar />
  </div>

  {/* Mobile nav */}
  <MobileNav />

  {/* Conteúdo */}
  <div className="flex-1 md:ml-64 p-4 pb-24 relative">
    {/* Dropdown desktop no topo */}
    <div className="hidden md:flex justify-end mb-4">
      <UserDropdown />
    </div>

    {/* Título + botão */}
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <h1 className="text-2xl font-bold text-green-700">Quadras Cadastradas</h1>
      <button
        onClick={handleNovaQuadra}
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 w-full sm:w-auto"
      >
        + Nova Quadra
      </button>
    </div>

    {/* Lista de quadras */}
    {quadras.length === 0 ? (
      <p className="text-gray-500">Você ainda não cadastrou nenhuma quadra.</p>
    ) : (
      quadras.map((quadra) => (
<Link to={`/quadra-locador/${quadra.id}`} key={quadra.id} className="block bg-white rounded-xl shadow-md overflow-hidden relative mb-6 w-full max-w-md mx-auto">
  <img
    src={`http://localhost:5000${quadra.imagem_url}`}
    alt={quadra.nome}
    className="w-full h-48 object-cover"
  />
  <div className="p-4">
    <h2 className="text-lg font-semibold">{quadra.nome}</h2>
    <p className="text-sm text-gray-600">{quadra.local}</p>
    <div className="flex justify-between items-center mt-2">
      <span className="text-green-700 font-bold">R${quadra.preco}</span>
      <span className="text-yellow-500">⭐ {quadra.nota || "4.5"}</span>
    </div>
  </div>
</Link>

      ))
    )}
  </div>
</div>
  );
}
