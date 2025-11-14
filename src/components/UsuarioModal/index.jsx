import React, { useState } from 'react';
import api from '../../services/api';

function UsuarioModal({ onClose, onSave }) {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await api.post('/register', formData);
      onSave(response.data.data);
      onClose();
    } catch (err) {
      if (err.response && err.response.data) {
        setError(err.response.data.erro || 'Falha ao criar usuário.');
      } else {
        setError('Erro de conexão.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-30 z-50 flex items-center justify-center"
      onClick={onClose}
    >
      <div
        className="bg-white w-[360px] max-w-full rounded-md shadow-md p-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4 border-b pb-2">
          <h3 className="text-lg font-medium text-gray-700">Novo Administrador</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-sm"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 text-sm text-gray-700">
          <div>
            <label htmlFor="nome">Nome</label>
            <input
              id="nome"
              name="nome"
              type="text"
              value={formData.nome}
              onChange={handleChange}
              required
              className="w-full mt-1 border border-gray-300 rounded-md px-3 py-2 focus:ring-1 focus:ring-blue-300"
            />
          </div>

          <div>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full mt-1 border border-gray-300 rounded-md px-3 py-2 focus:ring-1 focus:ring-blue-300"
            />
          </div>

          <div>
            <label htmlFor="senha">Senha Provisória</label>
            <input
              id="senha"
              name="senha"
              type="password"
              value={formData.senha}
              onChange={handleChange}
              required
              className="w-full mt-1 border border-gray-300 rounded-md px-3 py-2 focus:ring-1 focus:ring-blue-300"
            />
          </div>

          {error && <p role="alert" className="text-red-500">{error}</p>}

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="bg-gray-200 text-gray-700 text-xs px-3 py-1 rounded-md hover:bg-gray-300 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-400 text-white text-xs px-4 py-1 rounded-md hover:bg-blue-500 transition disabled:bg-gray-400"
            >
              {loading ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UsuarioModal;
