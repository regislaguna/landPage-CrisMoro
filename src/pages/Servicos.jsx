// (Código final com a conexão à API + layout com transição suave)
import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import api from '../services/api'; // Importa a conexão com a API

// --- Componente de Seção de Serviço ---
const ServiceSection = ({ service, index }) => {
  // Usamos os nomes das colunas do seu banco de dados
  const { id, nome, descricao, image, price } = service;

  // Lógica para alternar o layout (mantém o seu estilo)
  const imageRight = index % 2 !== 0;
  const titleId = `service-title-${id}`;

  return (
    <section
      aria-labelledby={titleId}
      className={`service-section ${imageRight ? 'image-right' : 'image-left'} 
                  flex flex-col md:flex-row items-center my-8 p-6 bg-white 
                  shadow-md rounded-lg animate-fadeSlide`}
    >
      {/* Bloco da Imagem (puxa o 'image' do banco) */}
      <div className={`md:w-1/2 ${imageRight ? 'md:order-2' : 'md:order-1'} flex justify-center p-4`}>
        <img
          src={image}
          alt={nome}
          className="w-full max-w-md h-auto rounded-lg shadow-lg object-cover"
        />
      </div>

      {/* Bloco do Texto (puxa 'nome' e 'descricao' do banco) */}
      <div className={`md:w-1/2 ${imageRight ? 'md:order-1' : 'md:order-2'} p-4 text-center md:text-left`}>
        <h2 id={titleId} className="text-3xl font-bold text-gray-800 mb-4">{nome}</h2>
        <p className="text-gray-600 leading-relaxed">{descricao}</p>

        <Link
          to="/agendamento"
          className="inline-block mt-6 px-6 py-3 bg-accent-dark text-white font-semibold rounded-full 
                     hover:bg-bg-pale transition duration-300 focus:outline-none focus:ring-2 
                     focus:ring-offset-2 focus:ring-accent-dark"
        >
          Agendar Agora
        </Link>
      </div>
    </section>
  );
};

// --- Página principal de Serviços ---
function Servicos() {
  const [servicos, setServicos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Busca os dados da API quando a página carregar
  useEffect(() => {
    async function fetchServicos() {
      try {
        setLoading(true);
        const response = await api.get('/servicos');
        setServicos(response.data); // Guarda os serviços no estado
      } catch (err) {
        console.error("Erro ao buscar serviços:", err);
        setError("Não foi possível carregar os serviços no momento.");
      } finally {
        setLoading(false);
      }
    }
    fetchServicos();
  }, []);

  return (
    <div className="servicos-page-container bg-bg-cream min-h-screen">
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-extrabold text-center text-text-dark mb-12 animate-fadeSlide">
          Nossos Serviços de Estética
        </h1>

        {/* Feedback para o usuário */}
        {loading && (
          <p className="text-center text-text-medium text-lg">A carregar serviços...</p>
        )}
        {error && (
          <p role="alert" className="text-center text-red-600 text-lg">{error}</p>
        )}

        <section className="service-list" aria-label="Lista de serviços detalhados">
          {!loading && !error && servicos.map((service, index) => (
            <ServiceSection key={service.id} service={service} index={index} />
          ))}

          {!loading && !error && servicos.length === 0 && (
            <p className="text-center text-text-medium text-lg">
              Nenhum serviço cadastrado no momento.
            </p>
          )}
        </section>
      </main>
    </div>
  );
}

export default Servicos;
