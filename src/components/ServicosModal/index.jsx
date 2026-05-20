// --- IMPORTAÇÕES NECESSÁRIAS ---
import React, { useState, useEffect } from 'react';
import api from '../../services/api'; // Verifique se o caminho está correto no seu projeto

function ServicoModal({ servicoAtual, onClose, onSave }) {
  // --- ESTADO DO FORMULÁRIO ---
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    image: ''
  });

  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // --- PREENCHIMENTO AUTOMÁTICO (EDIÇÃO) ---
  useEffect(() => {
    if (servicoAtual) {
      setFormData({
        title: servicoAtual.nome || servicoAtual.title || '',
        description: servicoAtual.descricao || servicoAtual.description || '',
        price: servicoAtual.price || '',
        image: servicoAtual.image || '',
      });
    }
  }, [servicoAtual]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  // --- FUNÇÃO PRINCIPAL DE ENVIO ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // 1. Buscar Utilizador Logado (Token no cabeçalho)
      const storageData = localStorage.getItem('login');
      const parsedData = storageData ? JSON.parse(storageData) : null;
      const token = parsedData?.token;

      if (!token) {
        throw new Error('Sessão expirada. Por favor, faça login novamente.');
      }

      // 2. Preparar e validar preço
      const precoLimpo = formData.price.toString().replace(',', '.');
      const precoFormatado = parseFloat(precoLimpo);
      if (isNaN(precoFormatado)) {
        throw new Error("Preço inválido. Use apenas números.");
      }

      // 3. Criar FormData
      const submitData = new FormData();
      submitData.append('title', formData.title);
      submitData.append('description', formData.description);
      submitData.append('price', precoFormatado);

      if (imageFile) {
        submitData.append('image', imageFile); // nome deve bater com upload.single('image') no backend
      }

      // 4. Configurar cabeçalho
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      };

      // 5. Chamada API
      let response;
      if (servicoAtual && servicoAtual.id) {
        response = await api.put(`/servicos/${servicoAtual.id}`, submitData, config);
      } else {
        response = await api.post('/servicos', submitData, config);
      }

      onSave(response.data);
      onClose();

    } catch (err) {
      console.error("Erro detalhado:", err.response?.data || err.message);
      setError(err.response?.data?.erro || err.message || 'Falha ao salvar o serviço.');
    } finally {
      setLoading(false);
    }
  };

  // --- INTERFACE VISUAL ---
  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 z-50 flex items-center justify-center" onClick={onClose}>
      <div
        className="bg-white w-[360px] max-w-full rounded-md shadow-md p-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4 border-b pb-2">
          <h3 className="text-lg font-medium text-gray-700">
            {servicoAtual ? 'Editar Serviço' : 'Adicionar Serviço'}
          </h3>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600 text-sm" aria-label="Fechar modal">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 text-sm text-gray-700">
          <div>
            <label htmlFor="title">Título</label>
            <input
              id="title"
              name="title"
              type="text"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full mt-1 border border-gray-300 rounded-md px-3 py-2 focus:ring-1 focus:ring-blue-300"
            />
          </div>

          <div>
            <label htmlFor="description">Descrição</label>
            <textarea
              id="description"
              name="description"
              rows="3"
              value={formData.description}
              onChange={handleChange}
              className="w-full mt-1 border border-gray-300 rounded-md px-3 py-2 focus:ring-1 focus:ring-blue-300"
            />
          </div>

          <div>
            <label htmlFor="price">Preço</label>
            <input
              id="price"
              name="price"
              type="text"
              placeholder="Ex: 150,00"
              value={formData.price}
              onChange={handleChange}
              required
              className="w-full mt-1 border border-gray-300 rounded-md px-3 py-2 focus:ring-1 focus:ring-blue-300"
            />
          </div>

          <div>
            <label htmlFor="imageFile">Imagem</label>
            <input
              id="imageFile"
              name="imageFile"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full mt-1 border border-gray-300 rounded-md px-3 py-2 text-sm"
            />
            {formData.image && !imageFile && (
              <p className="text-xs text-gray-500 mt-1 truncate">
                Imagem atual cadastrada. Envie outra apenas se quiser substituir.
              </p>
            )}
            {imageFile && (
              <img src={URL.createObjectURL(imageFile)} alt="Preview" className="mt-2 h-24 rounded shadow" />
            )}
          </div>

          {error && <p role="alert" className="text-red-500 text-xs">{error}</p>}

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

export default ServicoModal;
