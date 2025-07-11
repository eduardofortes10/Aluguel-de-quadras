import React from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

export default function Sidebar() {
  const navigate = useNavigate();

  return (
    <div className="w-16 bg-[#1E8449] text-white flex flex-col items-center py-4 space-y-4 fixed h-full z-50">
     

      {/* Ícone Home */}
      <Link
        to="/home"
        title="Home"
        className="p-2 rounded-lg hover:bg-green-700 transition"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 10.5L12 4l9 6.5M4.5 10.5v9a.5.5 0 00.5.5h4.5v-6h5v6H19a.5.5 0 00.5-.5v-9" />
        </svg>
      </Link>

      {/* Ícone Favoritos */}
      <Link
        to="/favoritos"
        title="Favoritos"
        className="p-2 rounded-lg hover:bg-green-700 transition"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-6 h-6">
          <path d="M6 4a2 2 0 00-2 2v16l8-4 8 4V6a2 2 0 00-2-2H6z" />
        </svg>
      </Link>

      {/* Ícone Chat */}
      <Link
        to="/chat"
        title="Chat"
        className="p-2 rounded-lg hover:bg-green-700 transition"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-6 h-6">
          <path d="M2 5a2 2 0 012-2h16a2 2 0 012 2v11a2 2 0 01-2 2H6l-4 4V5z" />
        </svg>
      </Link>

      {/* Ícone Perfil */}
      <button
        title="Perfil"
        onClick={() => navigate("/perfil")}
        className="p-2 rounded-lg hover:bg-green-700 transition"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="w-6 h-6" viewBox="0 0 24 24">
          <path d="M12 12a5 5 0 100-10 5 5 0 000 10zm0 2c-3.3 0-10 1.7-10 5v1h20v-1c0-3.3-6.7-5-10-5z" />
        </svg>
      </button>
    </div>
  );
}
