import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import Home from './pages/home';
import Perfil from "./pages/Perfil";
import Conta from "./pages/conta";
import Pagamento from "./pages/pagamento";
import Notificacao from "./pages/notificacao";
import Privacidade from "./pages/privacidade";
import Sobre from "./pages/sobre";
import Favoritos from "./pages/Favoritos";
import Chat from './pages/chat';
import QuadraDetalhe from "./pages/QuadraDetalhe";
import { quadras } from "./data/quadras";
import HomeLocador from "./pages/HomeLocador";
import CadastrarQuadra from "./pages/CadastrarQuadra";
import DetalheQuadraLocador from "./pages/DetalheQuadraLocador";
import { Toaster } from 'react-hot-toast';
const App = () => {
  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />

      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />
        <Route path="/favoritos" element={<Favoritos />} />
        <Route path="/perfil" element={<Perfil />} />
        <Route path="/conta" element={<Conta />} />
        <Route path="/pagamento" element={<Pagamento />} />
        <Route path="/notificacao" element={<Notificacao />} />
        <Route path="/privacidade" element={<Privacidade />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/sobre" element={<Sobre />} />
        <Route path="/quadra/:id" element={<QuadraDetalhe />} />
        <Route path="/home-locador" element={<HomeLocador />} />
        <Route path="/cadastrarquadra" element={<CadastrarQuadra />} />
        <Route path="/quadra-locador/:id" element={<DetalheQuadraLocador />} />
      </Routes>
    </>
  );
};


export default App;
