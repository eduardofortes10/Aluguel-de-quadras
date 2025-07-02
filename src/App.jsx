import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import Home from './pages/Home';

const App = () => {
  return (
    <Routes>
  <Route path="/" element={<Login />} />         {/* <- Página inicial = Login */}
  <Route path="/Register" element={<Register />} />
  <Route path="/Home" element={<Home />} />      {/* <- Página Home fica acessível como /Home */}
</Routes>

  );
};

export default App;
