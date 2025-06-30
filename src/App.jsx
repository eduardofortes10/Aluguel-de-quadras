import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import Home from './pages/home';

const App = () => {
  return (
    <Router>
      <Routes>
       <Route path="/Login" element={<Login />} />
        <Route path="/Register" element={<Register />} />
         <Route path="/" element={<Home />} />
      </Routes>
    </Router>
  );
};

export default App;
