// src/services/api.js

import axios from 'axios';

// 1. Criação da instância base do Axios. 
// Define a morada (URL) onde o teu Backend está alojado.
const api = axios.create({
  baseURL: 'https://api-crismoro-aqanhzdpdphcemc2.westus3-01.azurewebsites.net/' // Confirma se esta é a porta correta do teu Backend
});

// 2. Configuração do Interceptor de Pedidos (Request Interceptor)
// Esta função é executada ANTES de qualquer pedido (GET, POST, etc.) sair para o servidor.
api.interceptors.request.use(
  (config) => {
    try {
      // Passo A: Procurar os dados de login guardados no armazenamento local do navegador.
      // Substitui 'login' pelo nome exato da chave que utilizaste no teu processo de autenticação, se for diferente.
      const storageData = localStorage.getItem('login'); 
      
      // Passo B: Se encontrámos dados guardados...
      if (storageData) {
        // ...vamos transformá-los de texto (string) para um Objeto JavaScript.
        const parsedData = JSON.parse(storageData);
        
        // Passo C: Retiramos apenas o 'token' de dentro do objeto.
        const token = parsedData.token; 

        // Passo D: Se existir um token válido, anexamo-lo ao cabeçalho do pedido.
        // O formato 'Bearer TOKEN' é a norma de segurança que o teu Backend exige.
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
    } catch (erro) {
      // Caso aconteça um erro (por exemplo, os dados guardados não sejam um JSON válido), registamos no painel de controlo (console).
      console.error("Erro ao ler ou processar o token no Interceptor:", erro);
    }
    
    // Passo E: Devolvemos as configurações (agora com o token incluído) para que o pedido prossiga.
    return config;
  },
  (error) => {
    // Se ocorrer algum erro antes do pedido sair, rejeitamos a promessa.
    return Promise.reject(error);
  }
);

export default api;