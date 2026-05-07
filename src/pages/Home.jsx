/*
* Ficheiro: src/pages/HomePage.jsx
* Documentação: Página inicial com correção de caminho de imagens para serviços em destaque.
*/
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Carousel from '../components/Carousel';
import api from '../services/api';

// --- CONFIGURAÇÃO: Endereço do seu Backend ---
const API_URL = "http://localhost:3333";

function HomePage() {
  const [servicos, setServicos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchServicos() {
      try {
        setLoading(true);
        const response = await api.get('/servicos');
        setServicos(response.data);
      } catch (err) {
        console.error("Erro ao buscar serviços:", err);
        setError("Não foi possível carregar os serviços em destaque.");
      } finally {
        setLoading(false);
      }
    }
    fetchServicos();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-bg-light">
      
      {/* === CARROSSEL === */}
      <div className="relative w-full overflow-hidden">
        <Carousel />
      </div>

      {/* === BOAS-VINDAS === */}
      <section className="text-center animate-fadeSlide py-10">
        <h1 className="text-4xl md:text-5xl font-extrabold text-text-dark mb-3">
          Bem-vindo à Nossa Clínica de Estética
        </h1>
        <p className="text-lg text-text-medium max-w-2xl mx-auto mb-5">
          Cuide da sua beleza e bem-estar com nossos serviços personalizados.
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            to="/servicos"
            className="px-6 py-3 bg-accent-dark text-white rounded-full hover:bg-accent-light hover:text-text-dark transition"
          >
            Ver Serviços
          </Link>
          <Link
            to="/agendamento"
            className="px-6 py-3 bg-white text-accent-dark rounded-full hover:bg-accent-light hover:text-text-dark transition shadow-sm"
          >
            Agende Agora
          </Link>
        </div>
      </section>

      {/* === SEÇÃO INTRODUÇÃO === */}
      <section className="container mx-auto px-6 py-12 text-center animate-fadeSlide">
        <h2 className="text-3xl font-bold text-text-dark mb-6">Transforme sua Beleza</h2>
        <p className="text-text-medium max-w-2xl mx-auto leading-relaxed">
          Nossa clínica oferece tratamentos modernos e personalizados para realçar sua beleza natural.
        </p>
      </section>

      {/* === SEÇÃO DESTAQUES (CORRIGIDA) === */}
      <section className="bg-bg-cream py-16 animate-fadeSlide">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-text-dark mb-12">
            Serviços em Destaque
          </h2>

          {loading && <p className="text-center text-text-medium">Carregando destaques...</p>}
          {error && <p className="text-center text-red-600">{error}</p>}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {!loading && !error && servicos.slice(0, 3).map((service) => {
              
              // --- LÓGICA DE IMAGEM CORRIGIDA ---
              // Concatenamos a URL do servidor com o caminho salvo no banco
              const fullImageUrl = service.image 
                ? `${API_URL}${service.image}` 
                : 'https://via.placeholder.com/400x300?text=Clínica+Estética';

              return (
                <div key={service.id} className="bg-white rounded-lg shadow-lg p-6 text-center hover:shadow-xl transition duration-300 flex flex-col">
                  <img 
                    src={fullImageUrl} // Usando a URL completa corrigida
                    alt={service.nome} 
                    className="rounded-md mb-4 h-48 w-full object-cover shadow-sm"
                    onError={(e) => { e.target.src = 'https://via.placeholder.com/400x300?text=Imagem+Indisponível'; }}
                  />
                  <h3 className="text-xl font-semibold text-accent-dark mb-2">{service.nome}</h3>
                  <p className="text-text-medium mb-4 flex-grow">{service.descricao}</p>
                  <Link 
                    to={`/agendamento?servico=${encodeURIComponent(service.nome)}`} 
                    className="mt-auto px-4 py-2 bg-accent-dark text-white rounded-full hover:bg-accent-light hover:text-text-dark transition"
                  >
                    Agendar
                  </Link>
                </div>
              );
            })}

            {!loading && !error && servicos.length === 0 && (
              <p className="text-center text-text-medium col-span-3">Nenhum serviço em destaque no momento.</p>
            )}
          </div>

          {/* Botão para ver todos */}
          {!loading && !error && servicos.length > 0 && (
            <div className="flex justify-center mt-12">
              <Link
                to="/servicos"
                className="px-8 py-3 bg-accent-dark text-white font-semibold rounded-full hover:bg-accent-light hover:text-text-dark transition duration-300"
              >
                Ver Todos os Serviços
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default HomePage;