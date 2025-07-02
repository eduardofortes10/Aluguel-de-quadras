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

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/home" element={<Home />} />
      <Route path="/perfil" element={<Perfil />} />
      <Route path="/conta" element={<Conta />} />
      <Route path="/pagamento" element={<Pagamento />} />
      <Route path="/notificacao" element={<Notificacao />} />
      <Route path="/privacidade" element={<Privacidade />} />
      <Route path="/sobre" element={<Sobre />} />
    </Routes>
  );
};

export default App;
