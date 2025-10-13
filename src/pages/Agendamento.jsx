// src/pages/AgendamentosPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Importe useNavigate
import Header from '../components/Header/index';
import Footer from '../components/Footer/index';


// ... (servicosDisponiveis e horariosDisponiveis permanecem os mesmos) ...
const servicosDisponiveis = [
    { id: 1, title: 'Limpeza de Pele Profunda', duration: 60, price: 'R$ 150,00' },
    { id: 2, title: 'Drenagem Linfática Corporal', duration: 90, price: 'R$ 180,00' },
    { id: 3, title: 'Peeling Químico', duration: 45, price: 'R$ 250,00' },
    { id: 4, title: 'Massagem Relaxante', duration: 60, price: 'R$ 120,00' },
    { id: 5, title: 'Design de Sobrancelhas', duration: 30, price: 'R$ 50,00' },
];

const horariosDisponiveis = [
    '09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'
];

function Agendamentos() {
  const navigate = useNavigate(); // Hook para navegação programática
  const [formData, setFormData] = useState({
    serviceId: '',
    date: '',
    time: '',
    name: '',
    phone: '',
    email: '',
    notes: ''
  });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Dados do agendamento:', formData);
    setMessage('Agendamento solicitado com sucesso! Aguarde a confirmação.');
    setFormData({
      serviceId: '',
      date: '',
      time: '',
      name: '',
      phone: '',
      email: '',
      notes: ''
    });
  };

  const handlePersonalizedClick = () => {
    navigate('/questionario-personalizado'); // Navega para a nova página do questionário
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="agendamentos-page-container bg-gray-100 min-h-screen">
     

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-extrabold text-center text-purple-800 mb-12">Agende Seu Horário ou Peça um Atendimento Personalizado</h1>

        {/* Seção de Agendamento Tradicional */}
        <div className="mb-12">
            <h2 className="text-3xl font-bold text-center text-gray-700 mb-8">Agendamento Rápido</h2>
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg max-w-2xl mx-auto">
                {/* Campos do formulário de agendamento permanecem aqui */}
                <div className="mb-6">
                    <label htmlFor="serviceId" className="block text-gray-700 text-sm font-bold mb-2">Serviço Desejado:</label>
                    <select id="serviceId" name="serviceId" value={formData.serviceId} onChange={handleChange} required className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                        <option value="">Selecione um serviço</option>
                        {servicosDisponiveis.map(service => (
                            <option key={service.id} value={service.id}>{service.title} ({service.duration} min) - {service.price}</option>
                        ))}
                    </select>
                </div>
                <div className="mb-6">
                    <label htmlFor="date" className="block text-gray-700 text-sm font-bold mb-2">Data:</label>
                    <input type="date" id="date" name="date" value={formData.date} onChange={handleChange} min={today} required className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"/>
                </div>
                <div className="mb-6">
                    <label htmlFor="time" className="block text-gray-700 text-sm font-bold mb-2">Horário:</label>
                    <select id="time" name="time" value={formData.time} onChange={handleChange} required className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                        <option value="">Selecione um horário</option>
                        {horariosDisponiveis.map((timeOption, index) => (
                            <option key={index} value={timeOption}>{timeOption}</option>
                        ))}
                    </select>
                </div>
                <div className="mb-6">
                    <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">Seu Nome Completo:</label>
                    <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"/>
                </div>
                <div className="mb-6">
                    <label htmlFor="phone" className="block text-gray-700 text-sm font-bold mb-2">Telefone (com DDD):</label>
                    <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} required pattern="[0-9]{10,11}" placeholder="Ex: 11987654321" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"/>
                </div>
                <div className="mb-6">
                    <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">E-mail:</label>
                    <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"/>
                </div>
                <div className="mb-6">
                    <label htmlFor="notes" className="block text-gray-700 text-sm font-bold mb-2">Observações (opcional):</label>
                    <textarea id="notes" name="notes" value={formData.notes} onChange={handleChange} rows="4" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"></textarea>
                </div>

                <div className="flex items-center justify-center">
                    <button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-full focus:outline-none focus:shadow-outline transition duration-300">
                        Confirmar Agendamento
                    </button>
                </div>
                {message && (<p className="text-center mt-4 text-green-600 font-semibold">{message}</p>)}
            </form>
        </div>

        {/* Seção de Atendimento Personalizado */}
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-8 rounded-lg shadow-xl max-w-2xl mx-auto text-center mt-12 mb-12">
            <h2 className="text-3xl font-bold mb-4">Não tem certeza de qual serviço escolher?</h2>
            <p className="text-lg mb-6">Responda algumas perguntas e nós te ajudaremos a encontrar o tratamento ideal para suas necessidades e objetivos. Receba uma recomendação personalizada de Cris Moro.</p>
            <button
                onClick={handlePersonalizedClick}
                className="bg-white text-purple-700 font-bold py-3 px-8 rounded-full shadow-lg hover:bg-gray-100 transition duration-300 transform hover:scale-105"
            >
                Iniciar Questionário Personalizado
            </button>
        </div>

      </main>

      <Footer />
    </div>
  );
}

export default Agendamentos;