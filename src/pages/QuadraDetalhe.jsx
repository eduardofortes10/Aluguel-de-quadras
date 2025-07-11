import React from "react";
import { useLocation, useParams, Link } from "react-router-dom";
import Sidebar from "../components/Sidebar"; // ajuste se o caminho estiver diferente
import { FaStar, FaEnvelope, FaPhone, FaCommentDots, FaHeart, FaMapMarkerAlt } from "react-icons/fa";
import UserDropdown from "../components/DropdownUser";

export default function QuadraDetalhe() {
  const { state } = useLocation();
  const quadra = state?.quadra;

  if (!quadra) {
    return <div className="p-4">Quadra não encontrada.</div>;
  }

  return (
   <div className="flex">
  <Sidebar />
  <div className="flex-1 p-4 pl-[80px] md:pl-[100px] lg:pl-[120px]">

       {/* Breadcrumb */}
        <div className="flex items-center py-4 overflow-x-auto whitespace-nowrap">
          <a href="/home" className="text-gray-600 dark:text-gray-200">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
            </svg>
          </a>
          <span className="mx-5 text-gray-500 dark:text-gray-300">/</span>
          <span className="text-blue-600 dark:text-blue-400 font-medium">Detalhes de quadra</span>
        </div>

        {/* Imagem da quadra */}
        <div className="relative">
          <img
            src={quadra.imagem}
            alt={quadra.nome}
            className="w-full h-72 object-cover rounded-lg"
          />
          <button className="absolute top-4 right-4 bg-white text-red-600 p-2 rounded-full shadow">
            <FaHeart />
          </button>
        </div>

        {/* Informações principais */}
        <div className="mt-4 flex flex-col gap-2">
          <h1 className="text-2xl font-semibold">{quadra.nome}</h1>
          <div className="flex items-center text-yellow-500 gap-2 text-sm">
            <FaStar /> {quadra.avaliacao}
          </div>
          <p className="text-gray-600 text-sm flex items-center gap-1">
            <FaMapMarkerAlt /> {quadra.local}
          </p>
          <p className="text-gray-700 text-sm">{quadra.tipo}</p>
        </div>

        {/* Informações do Dono */}
        <div className="mt-6 border-t pt-4">
          <h2 className="font-semibold mb-2">Informações do Dono</h2>
          <div className="flex items-center gap-4">
            <img
              src={quadra.dono.foto}
              alt={quadra.dono.nome}
              className="w-14 h-14 rounded-full object-cover"
            />
            <div>
              <p className="font-medium">{quadra.dono.nome}</p>
              <p className="text-sm text-gray-600">{quadra.dono.email}</p>
              <p className="text-sm text-gray-600">{quadra.dono.telefone}</p>
            </div>
            <div className="ml-auto flex gap-3 text-green-700 text-xl">
              <a href={`mailto:${quadra.dono.email}`}><FaEnvelope /></a>
              <a href={`tel:${quadra.dono.telefone}`}><FaPhone /></a>
              <Link to="/chat"><FaCommentDots /></Link>
            </div>
          </div>
        </div>

        {/* Mapa */}
        <div className="mt-6">
          <h2 className="font-semibold mb-2">Localização</h2>
          <iframe
            title="mapa"
            src={`https://www.google.com/maps?q=${encodeURIComponent(quadra.local)}&output=embed`}
            width="100%"
            height="280"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="rounded-lg"
          ></iframe>
        </div>

        {/* Preço e Botão */}
        <div className="mt-6 flex justify-between items-center">
          <p className="text-green-600 text-lg font-semibold">{quadra.preco}</p>
          <button className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition">
            Alugar
          </button>
        </div>
      </div>
    </div>
  );
}
