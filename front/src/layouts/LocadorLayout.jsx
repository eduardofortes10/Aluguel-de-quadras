import React from "react";
import Sidebar from "../components/Sidebar";
import MobileNav from "../components/MobileNav";
import UserDropdown from "../components/DropdownUser";
import { Link } from "react-router-dom";

export default function LocadorLayout({ title, breadcrumb, actions, children }) {
  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar (desktop) */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* Conteúdo */}
      <div className="flex-1 md:ml-64 pb-24">
        {/* Header */}
        <div className="sticky top-0 z-30 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-b">
          <div className="mx-auto max-w-[1400px] px-4 py-3">
            {/* Breadcrumb */}
            <div className="text-xs text-gray-500 flex items-center gap-2">
              <Link to="/home-locador" className="hover:underline">Início</Link>
              {breadcrumb ? <span>/</span> : null}
              {breadcrumb && <span className="text-blue-600 font-medium">{breadcrumb}</span>}
            </div>
            {/* Título + Ações */}
            <div className="mt-2 flex items-center justify-between gap-4">
              <h1 className="text-2xl font-bold text-green-700">{title}</h1>
              <div className="hidden md:flex items-center gap-3">
                {actions}
                <UserDropdown />
              </div>
            </div>
          </div>
        </div>

        {/* Conteúdo principal */}
        <main className="mx-auto max-w-[1400px] px-4 py-6">
          {children}
        </main>
      </div>

      {/* Nav mobile fixa (corrigido bg) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40">
        <div className="bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/70 border-t px-4 py-2 pb-[env(safe-area-inset-bottom)]">
          <MobileNav />
        </div>
      </div>
    </div>
  );
}
