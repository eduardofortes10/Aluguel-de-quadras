import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Register from "./pages/Register";
import Login from "./pages/Login";
import Home from "./pages/home";
import Perfil from "./pages/Perfil";
import Conta from "./pages/conta";
import Pagamento from "./pages/pagamento";
import Notificacao from "./pages/notificacao";
import Privacidade from "./pages/privacidade";
import Sobre from "./pages/sobre";
import Favoritos from "./pages/Favoritos";
import Chat from "./pages/chat";
import QuadraDetalhe from "./pages/QuadraDetalhe";
import { quadras } from "./data/quadras";
import HomeLocador from "./pages/HomeLocador";
import CadastrarQuadra from "./pages/CadastrarQuadra";
import Filtro from "./pages/Filtro";
import Resultados from "./pages/Resultados";
import DetalheQuadraLocador from "./pages/DetalheQuadraLocador";
import MinhasQuadras from "./pages/MinhasQuadras";
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

  if (role && usuario?.tipo_usuario !== role) {
    const dest = usuario?.tipo_usuario === "locador" ? "/home-locador" : "/home";
    return <Navigate to={dest} replace />;
  }

  return children;
}

const App = () => {
  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />

      <Routes>
        {/* Públicas */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* Se quiser deixar /sobre e /privacidade públicas, mantenha fora do guard */}
        <Route path="/sobre" element={<Sobre />} />
        <Route path="/privacidade" element={<Privacidade />} />
        {/* Detalhe de quadra pode ser público; mantenha assim se desejar */}
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
        <Route
          path="/minhas-quadras"
          element={
            <RequireAuth role="locador">
              <MinhasQuadras />
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

        {/* Filtros/resultados — deixe público ou proteja, você escolhe */}
        <Route path="/filtro" element={<Filtro />} />
        <Route path="/resultados" element={<Resultados />} />

        {/* 404 */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </>
  );
};

export default App;
