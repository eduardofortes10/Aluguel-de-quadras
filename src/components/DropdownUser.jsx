import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import userPhoto from "../assets/avatar.png";

export default function UserDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/login");
  };

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
      >
        <img src={userPhoto} alt="Avatar" className="w-6 h-6 rounded-full mr-2" />
        Eduardo
        <svg className="ml-1 w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.584l3.71-4.354a.75.75 0 111.14.976l-4.25 5a.75.75 0 01-1.14 0l-4.25-5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
        </svg>
      </button>

      {isOpen && (
        <div
            className="absolute right-0 top-full mt-2 w-48 bg-white border rounded-md shadow-lg z-[9999]"
          onMouseLeave={() => setIsOpen(false)}
        >
          <a href="/perfil" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Perfil</a>
          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-100"
          >
            Sair
          </button>
        </div>
      )}
    </div>
  );
}
