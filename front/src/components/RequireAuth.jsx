import React from "react";
import { Navigate, useLocation } from "react-router-dom";

export default function RequireAuth({ children, role }) {
  const raw = localStorage.getItem("usuario");
  const usuario = raw ? JSON.parse(raw) : null;
  const token = localStorage.getItem("token");
  const location = useLocation();

  if (!token || !usuario) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (role && usuario?.tipo_usuario !== role) {
    const dest = usuario?.tipo_usuario === "locador" ? "/home-locador" : "/home";
    return <Navigate to={dest} replace />;
  }

  return children;
}
