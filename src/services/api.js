// src/services/api.js

import axios from 'axios';

const api = axios.create({
  // Garanta que esta porta é a da sua API (3333)
  baseURL: 'http://localhost:3333' 
});

// --- ESTE BLOCO É ESSENCIAL PARA RECARREGAR A PÁGINA ---
// Ele lê o token do localStorage assim que o site abre
try {
  // Verifique o nome da sua chave. É 'login'?
  const storageData = localStorage.getItem('login'); 
  
  if (storageData) {
    // Extrai o token do JSON que você guardou
    const { token } = JSON.parse(storageData);
    
    if (token) {
      // Anexa o token ao 'api' (Axios)
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }
} catch (e) {
  console.error("Erro ao ler o token do localStorage", e);
}
// --- FIM DO BLOCO ---

export default api;