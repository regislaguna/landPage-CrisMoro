import React, { useState, useEffect } from 'react';
import api from '../../services/api';

function ServicoModal({ servicoAtual, onClose, onSave }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    image: ''
  });

  const [imageFile, setImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (servicoAtual) {
      setFormData({
        title: servicoAtual.nome || '',
        description: servicoAtual.descricao || '',
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    let imageUrl = formData.image;

    try {
      if (imageFile) {
        setUploading(true);
        const fileUploadData = new FormData();
        fileUploadData.append('file', imageFile);

        const uploadResponse = await api.post('/upload', fileUploadData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        imageUrl = uploadResponse.data.url;
        setUploading(false);
      }

      const dadosDoServico = {
        title: formData.title,
        description: formData.description,
        price: parseFloat(formData.price),
        image: imageUrl,
      };

      const response = servicoAtual
        ? await api.put(`/servicos/${servicoAtual.id}`, dadosDoServico)
        : await api.post('/servicos', dadosDoServico);

      onSave(response.data);
    } catch (err) {
      console.error(err);
      setError('Falha ao salvar o serviço. Verifique os campos.');
    } finally {
      setLoading(false);
      setUploading(false);
    }
  };

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
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-sm"
          >
            ✕
          </button>
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
              type="number"
              step="0.01"
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
              onChange={handleFileChange}
              className="w-full mt-1 border border-gray-300 rounded-md px-3 py-2 text-sm"
            />
            {formData.image && !imageFile && (
              <p className="text-xs text-gray-500 mt-1">
                Imagem atual: {formData.image.substring(0, 50)}...
              </p>
            )}
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
              disabled={loading || uploading}
              className="bg-blue-400 text-white text-xs px-4 py-1 rounded-md hover:bg-blue-500 transition disabled:bg-gray-400"
            >
              {uploading ? 'Enviando...' : loading ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ServicoModal;
