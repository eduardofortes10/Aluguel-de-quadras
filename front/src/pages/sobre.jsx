import React from "react";
import { Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import UserDropdown from "../components/DropdownUser";
import MobileNav from "../components/MobileNav";

export default function Sobre() {
  return (
    <div className="flex min-h-screen bg-white">
      {/* Sidebar (desktop) */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* Conteúdo */}
      <div className="flex-1 flex flex-col md:ml-64 px-4 sm:px-6 md:px-8 pt-6 pb-20">
        {/* Topo com dropdown */}
        <div className="flex justify-end items-center mb-4">
          <UserDropdown />
        </div>

        {/* Breadcrumb */}
        <nav
          aria-label="breadcrumb"
          className="flex items-center py-4 overflow-x-auto whitespace-nowrap text-sm text-gray-500"
        >
          <Link to="/home" className="text-gray-600 flex items-center hover:underline">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
            </svg>
            Início
          </Link>
          <span className="mx-2">/</span>
          <Link to="/perfil" className="text-gray-600 hover:underline">Perfil</Link>
          <span className="mx-2">/</span>
          <span className="text-green-700 font-semibold">Sobre</span>
        </nav>

        {/* Conteúdo */}
        <main className="text-justify max-w-3xl w-full mx-auto px-1 sm:px-2">
          <h1 className="text-2xl font-bold text-green-700 mb-4">Sobre o Projeto</h1>

          <p className="mb-4">
            Este sistema foi desenvolvido com o objetivo de facilitar o aluguel de quadras esportivas de forma ágil e intuitiva.
            Ideal para quem busca praticidade ao encontrar locais para jogar futebol, vôlei, basquete, tênis e outros esportes.
          </p>

          <p className="mb-4">
            Através da plataforma, o usuário pode buscar quadras próximas, aplicar filtros (preço, avaliação, tipo de quadra, horário, etc.)
            e visualizar detalhes completos de cada local. Além disso, é possível entrar em contato com os responsáveis,
            favoritar quadras e gerenciar o próprio perfil.
          </p>

          <p className="mb-4">
            Este projeto foi desenvolvido como parte do Trabalho de Conclusão de Curso (TCC) por Eduardo Fortes,
            estudante do 2º ano do ensino médio técnico em Tecnologia da Informação. O projeto abrangeu desde o design no Figma
            até o desenvolvimento front-end e estruturação do banco de dados.
          </p>

          <p className="mb-4">
            As tecnologias utilizadas incluem: <strong>React, Tailwind CSS, React Router, Keen Slider, Vite</strong> e outras ferramentas modernas.
          </p>

          <p className="mb-4">
            Ainda em fase de expansão, o sistema futuramente terá integração com login de usuários reais, sistema de pagamento e
            funcionalidades administrativas para donos de quadras.
          </p>

          <p>
            Para dúvidas, feedbacks ou colaborações, entre em contato pelo e-mail:{" "}
            <a href="mailto:eduardo_fortes@gmail.com" className="text-green-600 hover:underline">
              eduardo_fortes@gmail.com
            </a>
          </p>
        </main>
      </div>

      {/* MobileNav fixo no rodapé (mobile) */}
      <MobileNav />
    </div>
  );
}
