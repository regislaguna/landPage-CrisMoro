/*
* Ficheiro: src/pages/HomePage.jsx
* Documentação: Página inicial com correção de caminho de imagens integrado ao Azure Blob Storage.
*/
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Carousel from '../components/Carousel';
import api from '../services/api';

// --- CONFIGURAÇÃO DA AZURE MANTIDA EM CONFORMIDADE ---
const AZURE_STORAGE_ACCOUNT = "stclinicacrismoro"; 
const AZURE_CONTAINER = "images";

function HomePage() {
  const [servicos, setServicos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchServicos() {
      try {
        setLoading(true);
        const response = await api.get('/servicos');
        setServicos(Array.isArray(response.data) ? response.data : []);
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

      {/* === SEÇÃO DESTAQUES === */}
      <section className="bg-bg-cream py-16 animate-fadeSlide">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-text-dark mb-12">
            Serviços em Destaque
          </h2>

          {loading && <p className="text-center text-text-medium">Carregando destaques...</p>}
          {error && <p className="text-center text-red-600">{error}</p>}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {!loading && !error && servicos.slice(0, 3).map((service) => {
              
              const id = service.id;
              const nome = service.nome || service.title || "Tratamento";
              const descricao = service.descricao || service.description || "";
              const image = service.image;

              // --- LÓGICA DE IMAGEM DA AZURE COMPATÍVEL ---
              let finalImageUrl = null;
              if (image) {
                if (image.startsWith('http://') || image.startsWith('https://')) {
                  finalImageUrl = image;
                } else {
                  finalImageUrl = `https://${AZURE_STORAGE_ACCOUNT}.blob.core.windows.net/${AZURE_CONTAINER}/${image}`;
                }
              }

              return (
                <div key={id} className="bg-white rounded-lg shadow-lg p-6 text-center hover:shadow-xl transition duration-300 flex flex-col">
                  <img 
                    src={finalImageUrl || 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=500&auto=format&fit=crop'} 
                    alt={nome} 
                    className="rounded-md mb-4 h-48 w-full object-cover shadow-sm transform hover:scale-105 transition duration-300"
                    onError={(e) => { 
                      e.target.onerror = null; 
                      // Fallback elegante caso a Azure bloqueie ou a imagem não exista no Storage
                      e.target.src = 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=500&auto=format&fit=crop'; 
                    }}
                  />
                  <h3 className="text-xl font-semibold text-accent-dark mb-2">{nome}</h3>
                  <p className="text-text-medium mb-4 flex-grow line-clamp-3">{descricao}</p>
                  
                  {/* Link com ID numérico para manter o formulário de agendamento 100% funcional sem quebras */}
                  <Link 
                    to={`/agendamento?servico=${id}`} 
                    className="mt-auto px-4 py-2 bg-accent-dark text-white rounded-full hover:bg-accent-light hover:text-text-dark transition shadow-sm font-medium text-sm"
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
                className="px-8 py-3 bg-accent-dark text-white font-semibold rounded-full hover:bg-accent-light hover:text-text-dark transition duration-300 shadow-md hover:shadow-lg"
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