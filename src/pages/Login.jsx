import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../utils/storage";
import api from "../services/api";

function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();
    setError('');

    try {
      const response = await api.post('/login', { email, senha });
      const { token, user } = response.data;
      login(JSON.stringify({ token, user }));
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      navigate('/painel');
    } catch (err) {
      if (err.response && err.response.data) {
        setError(err.response.data.erro || 'Email ou senha inválidos');
      } else {
        setError('Falha ao tentar fazer login. Tente novamente.');
      }
    }
  }

  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      <form
        onSubmit={handleLogin}
        className="bg-white w-full max-w-sm rounded-md shadow-md p-6 space-y-5"
      >
        <h2 className="text-center text-lg font-medium text-gray-700">
          Faça login na sua conta
        </h2>

        <div className="space-y-1">
          <label htmlFor="email" className="text-sm font-medium text-gray-600">
            E-mail
          </label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="informe seu e-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-blue-300"
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="senha" className="text-sm font-medium text-gray-600">
            Senha
          </label>
          <input
            id="senha"
            name="senha"
            type="password"
            placeholder="informe sua senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-blue-300"
          />
        </div>

        <span className="block text-xs text-center text-gray-500 hover:text-blue-500 cursor-pointer transition">
          Esqueceu a senha
        </span>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white text-sm font-semibold py-2 rounded-md hover:bg-blue-600 transition"
        >
          Entrar
        </button>

        {error && (
          <span role="alert" className="block text-center text-red-500 text-sm mt-2">
            {error}
          </span>
        )}
      </form>
    </main>
  );
}

export default Login;
