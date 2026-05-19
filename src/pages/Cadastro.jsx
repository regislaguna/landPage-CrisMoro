import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Cadastro() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [sucesso, setSucesso] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  async function handleCadastro(e) {
    e.preventDefault();
    setError('');
    setSucesso('');

    try {
      // Dispara os dados para criar o administrador na Azure
      await api.post('/register', { nome, email, senha });
      
      setSucesso('Administrador cadastrado com sucesso!');
      
      // Limpa os campos
      setNome('');
      setEmail('');
      setSenha('');

      // Espera 2 segundos para dar tempo de ler a mensagem e manda para o login
      setTimeout(() => {
        navigate('/login');
      }, 2000);

    } catch (err) {
      if (err.response && err.response.data) {
        setError(err.response.data.error || err.response.data.erro || 'Erro ao realizar cadastro.');
      } else {
        setError('Falha ao conectar com o servidor da Azure.');
      }
    }
  }

  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      <form
        onSubmit={handleCadastro}
        className="bg-white w-full max-w-sm rounded-md shadow-md p-6 space-y-5"
      >
        <h2 className="text-center text-lg font-medium text-gray-700">
          Cadastrar Novo Administrador
        </h2>

        {/* Campo Nome */}
        <div className="space-y-1">
          <label htmlFor="nome" className="text-sm font-medium text-gray-600">
            Nome Completo
          </label>
          <input
            id="nome"
            name="nome"
            type="text"
            placeholder="informe seu nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-blue-300"
          />
        </div>

        {/* Campo E-mail */}
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

        {/* Campo Senha */}
        <div className="space-y-1">
          <label htmlFor="senha" className="text-sm font-medium text-gray-600">
            Senha
          </label>
          <input
            id="senha"
            name="senha"
            type="password"
            placeholder="crie uma senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-blue-300"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white text-sm font-semibold py-2 rounded-md hover:bg-blue-600 transition"
        >
          Cadastrar Admin
        </button>

        {/* Feedbacks de Erro ou Sucesso */}
        {sucesso && (
          <span className="block text-center text-green-600 text-sm mt-2 font-medium">
            {sucesso}
          </span>
        )}

        {error && (
          <span role="alert" className="block text-center text-red-500 text-sm mt-2">
            {error}
          </span>
        )}
      </form>
    </main>
  );
}

export default Cadastro;