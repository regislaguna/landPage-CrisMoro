import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Link, useLocation } from 'react-router-dom';

function Agendamentos() {
  const [formData, setFormData] = useState({
    serviceId: '',
    date: '',
    time: '',
    name: '',
    phone: '',
    email: '',
    notes: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  // Lista de serviços
  const [servicos, setServicos] = useState([]);
  const [loadingServicos, setLoadingServicos] = useState(true);

  // Captura parâmetro da URL (ex: ?servico=1)
  const location = useLocation();

  useEffect(() => {
    async function fetchServicos() {
      try {
        setLoadingServicos(true);
        const response = await api.get('/servicos');
        setServicos(response.data);

        // Pré-seleção via URL
        const params = new URLSearchParams(location.search);
        const servicoParam = params.get("servico");
        if (servicoParam) {
          setFormData(prev => ({ ...prev, serviceId: servicoParam }));
        }
      } catch (err) {
        console.error("Erro ao buscar serviços:", err);
      } finally {
        setLoadingServicos(false);
      }
    }
    fetchServicos();
  }, [location.search]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // ✅ Endpoint corrigido para plural e payload compatível
      await api.post('/agendamentos', {
        serviceId: formData.serviceId,
        date: formData.date,
        time: formData.time,
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        notes: formData.notes
      });
      setIsLoading(false);
      setSuccess(true);
      setFormData({ serviceId: '', date: '', time: '', name: '', phone: '', email: '', notes: '' });
    } catch (err) {
      setIsLoading(false);
      setError('Erro ao agendar. Tente novamente.');
    }
  };

  return (
    <main className="bg-bg-light py-16">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-extrabold text-center text-accent-dark mb-12 animate-fadeSlide">
          Agende Seu Horário
        </h1>

        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded-lg shadow-lg max-w-2xl mx-auto animate-fadeSlide"
        >
          {/* Nome */}
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-text-dark mb-1">Nome *</label>
            <input id="name" type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full border rounded-md p-2"/>
          </div>

          {/* Email */}
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-text-dark mb-1">Email *</label>
            <input id="email" type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full border rounded-md p-2"/>
          </div>

          {/* Telefone */}
          <div className="mb-4">
            <label htmlFor="phone" className="block text-sm font-medium text-text-dark mb-1">Telefone *</label>
            <input id="phone" type="tel" name="phone" value={formData.phone} onChange={handleChange} required className="w-full border rounded-md p-2"/>
          </div>

          {/* Data e Horário */}
          <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-text-dark mb-1">Data *</label>
              <input id="date" type="date" name="date" value={formData.date} onChange={handleChange} required className="w-full border rounded-md p-2"/>
            </div>
            <div>
              <label htmlFor="time" className="block text-sm font-medium text-text-dark mb-1">Horário *</label>
              <input id="time" type="time" name="time" value={formData.time} onChange={handleChange} required className="w-full border rounded-md p-2"/>
            </div>
          </div>

          {/* Serviço */}
          <div className="mb-4">
            <label htmlFor="serviceId" className="block text-sm font-medium text-text-dark mb-1">Serviço *</label>
            {loadingServicos ? (
              <p>Carregando serviços...</p>
            ) : (
              <select
                id="serviceId"
                name="serviceId"
                value={formData.serviceId}
                onChange={handleChange}
                required
                className="w-full border rounded-md p-2"
              >
                <option value="">Selecione um serviço</option>
                {servicos.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.nome}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Feedback */}
          {error && <p className="text-red-600 mb-4">{error}</p>}
          {success && <p className="text-green-600 mb-4">Agendamento realizado com sucesso!</p>}

          {/* Botão */}
          <button
            type="submit"
            className="text-white bg-accent-dark border rounded-xl uppercase font-bold 
                       min-h-[40px] w-full transition-all duration-300 ease-in-out
                       hover:bg-accent-light hover:text-text-dark 
                       hover:shadow-lg hover:-translate-y-1
                       disabled:bg-gray-400 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {isLoading ? 'Agendando...' : 'Agendar'}
          </button>
        </form>

        {/* Questionário personalizado */}
        <section
          className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-8 rounded-lg shadow-xl 
                     max-w-2xl mx-auto text-center mt-12 mb-12 animate-fadeSlide"
          aria-label="Questionário para atendimento personalizado"
        >
          <h2 className="text-2xl font-bold mb-4">Questionário Personalizado</h2>
          <p className="mb-4">Preencha nosso questionário para que possamos oferecer um atendimento mais direcionado.</p>
          <Link
            to="/questionario"
            className="inline-block bg-white text-accent-dark font-bold px-6 py-2 rounded-lg 
                       transition duration-300 ease-in-out hover:bg-accent-light hover:text-text-dark"
          >
            Ir para o Questionário
          </Link>
        </section>
      </div>
    </main>
  );
}

export default Agendamentos;
