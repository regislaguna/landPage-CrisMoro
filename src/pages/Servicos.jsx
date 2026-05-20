// (Versão Atualizada: Integrada com Azure Blob Storage e Ajuste de URL)
import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import api from '../services/api'; 

// CONFIGURAÇÃO DA AZURE (Substitua pelos seus dados reais da Azure se o banco não trouxer o link completo)
const AZURE_STORAGE_ACCOUNT = "stclinicacrismoro"; 
const AZURE_CONTAINER = "$logs";

const ServiceSection = ({ service, index }) => {
  const { id, nome, descricao, image } = service;

  const imageRight = index % 2 !== 0;
  const titleId = `service-title-${id}`;

  /* * LÓGICA DE TRATAMENTO DE IMAGEM DA AZURE:
   * 1. Se não houver imagem, usa o placeholder da clínica.
   * 2. Se a imagem já vier com "http" do backend, usa ela direto.
   * 3. Se vier apenas o nome do arquivo, monta a URL completa da Azure automaticamente!
   */
  let finalImageUrl = 'https://via.placeholder.com/400x300?text=Cl%C3%ADnica+Est%C3%A9tica';
  
  if (image) {
    if (image.startsWith('http://') || image.startsWith('https://')) {
      finalImageUrl = image; // Já é a URL completa da Azure
    } else {
      // É apenas o nome do arquivo, montamos a URL do Blob Storage
      finalImageUrl = `https://${AZURE_STORAGE_ACCOUNT}.blob.core.windows.net/${AZURE_CONTAINER}/${image}`;
    }
  }

  return (
    <section
      aria-labelledby={titleId}
      className={`service-section ${imageRight ? 'image-right' : 'image-left'} 
                  flex flex-col md:flex-row items-center my-12 p-6 bg-white 
                  shadow-sm rounded-xl animate-fadeSlide border border-gray-100`}
    >
      {/* Bloco da Imagem */}
      <div className={`md:w-1/2 ${imageRight ? 'md:order-2' : 'md:order-1'} flex justify-center p-4`}>
        <img
          src={finalImageUrl} 
          alt={nome}
          className="w-full max-w-md h-64 rounded-lg shadow-lg object-cover transform hover:scale-105 transition duration-500"
          onError={(e) => { 
            // Se mesmo montando a URL der erro de acesso (container privado), ele mostra o placeholder de aviso
            e.target.src = 'https://via.placeholder.com/400x300?text=Acesso+Restrito+Azure'; 
          }}
        />
      }
      </div>

      {/* Bloco do Texto */}
      <div className={`md:w-1/2 ${imageRight ? 'md:order-1' : 'md:order-2'} p-8 text-center md:text-left`}>
        <h2 id={titleId} className="text-3xl font-bold text-gray-800 mb-4">{nome}</h2>
        <p className="text-gray-600 text-lg leading-relaxed">{descricao}</p>

        <Link
          to="/agendamento"
          className="inline-block mt-8 px-8 py-3 bg-accent-dark text-white font-semibold rounded-full 
                     hover:bg-opacity-90 transition duration-300 shadow-md hover:shadow-lg"
        >
          Agendar Agora
        </Link>
      </div>
    </section>
  );
};

function Servicos() {
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
        setError("Não foi possível carregar os serviços no momento.");
      } finally {
        setLoading(false);
      }
    }
    fetchServicos();
  }, []);

  return (
    <div className="servicos-page-container bg-gray-50 min-h-screen">
      <main className="container mx-auto px-4 py-16">
        <header className="text-center mb-16">
          <h1 className="text-5xl font-black text-gray-900 mb-4">
            Nossos Serviços de Estética
          </h1>
          <div className="w-24 h-1 bg-accent-dark mx-auto rounded-full"></div>
        </header>

        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-dark mb-4"></div>
             <p className="text-gray-500 text-lg">Buscando tratamentos...</p>
          </div>
        )}

        {error && (
          <div className="text-center p-10 bg-red-50 rounded-lg">
            <p role="alert" className="text-red-600 text-lg font-medium">{error}</p>
            <button onClick={() => window.location.reload()} className="mt-4 text-red-700 underline">Tentar novamente</button>
          </div>
        )}

        <section className="service-list max-w-6xl mx-auto" aria-label="Lista de serviços detalhados">
          {!loading && !error && servicos.map((service, index) => (
            <ServiceSection key={service.id} service={service} index={index} />
          ))}

          {!loading && !error && servicos.length === 0 && (
            <div className="text-center py-20">
              <p className="text-gray-400 text-xl">Nenhum serviço disponível no momento.</p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default Servicos;