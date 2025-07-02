// src/components/Sidebar.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

export default function Sidebar() {
  const navigate = useNavigate();

  return (
    <div className="w-16 bg-[#1E8449] text-white flex flex-col items-center py-4 space-y-4 fixed h-full">
      <div className="w-8 h-8 rounded-full bg-white"></div>

      <button title="Home" onClick={() => navigate("/home")} className="p-2 hover:bg-green-700 rounded-lg">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor"
          viewBox="0 0 24 24" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M3 9.75L12 4l9 5.75M4.5 10.5v8.25a.75.75 0 00.75.75H9v-5.25h6v5.25h3.75a.75.75 0 00.75-.75V10.5" />
        </svg>
      </button>

      <button title="Favoritos" className="p-2 hover:bg-green-700 rounded-lg">
        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="w-6 h-6" viewBox="0 0 24 24">
          <path d="M6 4a4 4 0 00-4 4c0 5 10 12 10 12s10-7 10-12a4 4 0 00-4-4c-1.6 0-3 .9-4 2.09C13 4.9 11.6 4 10 4z" />
        </svg>
      </button>

      <button title="Chat" className="p-2 hover:bg-green-700 rounded-lg">
        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="w-6 h-6" viewBox="0 0 24 24">
          <path d="M2 5a2 2 0 012-2h16a2 2 0 012 2v12a2 2 0 01-2 2H6l-4 4V5z" />
        </svg>
      </button>

      <button title="Perfil" onClick={() => navigate("/perfil")} className="p-2 hover:bg-green-700 rounded-lg">
        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="w-6 h-6" viewBox="0 0 24 24">
          <path d="M12 12a5 5 0 100-10 5 5 0 000 10zm0 2c-3.3 0-10 1.7-10 5v1h20v-1c0-3.3-6.7-5-10-5z" />
        </svg>
      </button>
    </div>
  );
}
