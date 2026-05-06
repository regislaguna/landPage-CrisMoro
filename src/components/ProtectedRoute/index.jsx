import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { isAuthenticated } from '../../utils/storage'; // Função que verifica se o token existe

const ProtectedRoute = () => {
  // 'isAuthenticated()' deve ler o seu storage e ver se o token é válido
  const auth = isAuthenticated(); 

  // Se estiver autenticado, mostra a página (Outlet).
  // Se não, redireciona para o login.
  return auth ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;