// (Versão Atualizada: Integrada com Azure Blob Storage e Fallback Nativo Sem Placeholders)
import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import api from '../services/api'; 

// CONFIGURAÇÃO DA AZURE
const AZURE_STORAGE_ACCOUNT = "stclinicacrismoro"; 
const AZURE_CONTAINER = "images";

const ServiceSection = ({ service, index }) => {
  const { id, nome, descricao, image } = service;

  const imageRight = index % 2 !== 0;
  const titleId = `service-title-${id}`;

  /* * LÓGICA DE TRATAMENTO DE IMAGEM DA AZURE:
   * 1. Se a imagem já vier com "http" do backend, usa ela direto.
   * 2. Se vier apenas o nome do arquivo, monta a URL completa da Azure automaticamente!
   */
  let finalImageUrl = null;
  
  if (image) {
    if (image.startsWith('http://') || image.startsWith('https://')) {
      finalImageUrl = image; 
    } else {
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
        {finalImageUrl ? (
          <>
            <img
              src={finalImageUrl} 
              alt={nome}
              className="w-full max-w-md h-64 rounded-lg shadow-lg object-cover transform hover:scale-105 transition duration-500"
              onError={(e) => { 
                // 1. Cospe o link exato no console para você debugar o acesso da Azure
                console.log(`👉 O LINK QUE FALHOU NO SERVIÇO [${nome}] FOI:`, finalImageUrl);
                
                // 2. Oculta a imagem quebrada e ativa o bloco de aviso cinza nativo
                e.target.style.display = 'none'; 
                const fallbackBox = document.getElementById(`fallback-box-${id}`);
                if (fallbackBox) fallbackBox.style.display = 'flex';
              }}
            />
            
            {/* Fallback Box que inicia oculto e só aparece se a imagem falhar */}
            <div 
              id={`fallback-box-${id}`}
              style={{ display: 'none' }}
              className="w-full max-w-md h-64 rounded-lg shadow-lg bg-gray-100 flex flex-col items-center justify-center p-4 text-gray-400"
            >
              <svg className="w-16 h-16 mb-2 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-sm font-medium">Imagem indisponível</span>
            </div>
          </>
        ) : (
          /* Caso o serviço não tenha nenhuma imagem vinculada no banco de dados */
          <div className="w-full max-w-md h-64 rounded-lg shadow-lg bg-gray-100 flex flex-col items-center justify-center p-4 text-gray-400">
            <svg className="w-16 h-16 mb-2 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-sm font-medium">Sem imagem cadastrada</span>
          </div>
        )}
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