// src/App.jsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// PÁGINA INICIAL (pública, antes do login)
import Landing from "./pages/Landing";

// Páginas públicas de auth
import Register from "./pages/Register";
import Login from "./pages/Login";

// Páginas do cliente
import Home from "./pages/home";
import Favoritos from "./pages/Favoritos";
import MinhasQuadras from "./pages/MinhasQuadras";

// Páginas do locador
import HomeLocador from "./pages/HomeLocador";
import CadastrarQuadra from "./pages/CadastrarQuadra";
import DetalheQuadraLocador from "./pages/DetalheQuadraLocador";

// Páginas comuns autenticadas
import Perfil from "./pages/Perfil";
import Conta from "./pages/conta";
import Pagamento from "./pages/pagamento";
import Notificacao from "./pages/notificacao";
import Chat from "./pages/chat";

// Outras páginas públicas
import Sobre from "./pages/sobre";
import Privacidade from "./pages/privacidade";
import QuadraDetalhe from "./pages/QuadraDetalhe";
import Filtro from "./pages/Filtro";
import Resultados from "./pages/Resultados";

import { Toaster } from "react-hot-toast";

/** Guard simples para autenticação + papel (cliente/locador).
 *  - Se não logado -> /login
 *  - Se papel não bate -> redireciona para a home correta do usuário
 */
function RequireAuth({ children, role }) {
  let usuario = null;
  try {
    const raw = localStorage.getItem("usuario");
    usuario = raw ? JSON.parse(raw) : null;
  } catch {
    usuario = null;
  }
  const token = localStorage.getItem("token");

  if (!token || !usuario) {
    return <Navigate to="/login" replace />;
  }

  // normaliza o campo de tipo
  const tipo = usuario?.tipo || usuario?.tipo_usuario;

  if (role && tipo !== role) {
    const dest = tipo === "locador" ? "/home-locador" : "/home";
    return <Navigate to={dest} replace />;
  }

  return children;
}

const App = () => {
  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />

      <Routes>
        {/* Página inicial PÚBLICA (sem redirecionamento automático) */}
        <Route path="/" element={<Landing />} />

        {/* Públicas */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/sobre" element={<Sobre />} />
        <Route path="/privacidade" element={<Privacidade />} />

        {/* Detalhe de quadra pode ser público */}
        <Route path="/quadra/:id" element={<QuadraDetalhe />} />

        {/* Cliente */}
        <Route
          path="/home"
          element={
            <RequireAuth role="cliente">
              <Home />
            </RequireAuth>
          }
        />
        <Route
          path="/favoritos"
          element={
            <RequireAuth role="cliente">
              <Favoritos />
            </RequireAuth>
          }
        />
        <Route
          path="/minhas-quadras"
          element={
            <RequireAuth role="cliente">
              <MinhasQuadras />
            </RequireAuth>
          }
        />

        {/* Locador */}
        <Route
          path="/home-locador"
          element={
            <RequireAuth role="locador">
              <HomeLocador />
            </RequireAuth>
          }
        />
        <Route
          path="/cadastrarquadra"
          element={
            <RequireAuth role="locador">
              <CadastrarQuadra />
            </RequireAuth>
          }
        />
        <Route
          path="/quadra-locador/:id"
          element={
            <RequireAuth role="locador">
              <DetalheQuadraLocador />
            </RequireAuth>
          }
        />

        {/* Autenticado (qualquer papel) */}
        <Route
          path="/perfil"
          element={
            <RequireAuth>
              <Perfil />
            </RequireAuth>
          }
        />
        <Route
          path="/conta"
          element={
            <RequireAuth>
              <Conta />
            </RequireAuth>
          }
        />
        <Route
          path="/pagamento"
          element={
            <RequireAuth>
              <Pagamento />
            </RequireAuth>
          }
        />
        <Route
          path="/notificacao"
          element={
            <RequireAuth>
              <Notificacao />
            </RequireAuth>
          }
        />
        <Route
          path="/chat"
          element={
            <RequireAuth>
              <Chat />
            </RequireAuth>
          }
        />

        {/* Filtros/resultados — públicos */}
        <Route path="/filtro" element={<Filtro />} />
        <Route path="/resultados" element={<Resultados />} />

        {/* 404 -> volta para a landing */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
};

export default App;
