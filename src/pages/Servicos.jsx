import React from 'react';
import Header from '../components/Header/index'; // Ajuste o caminho conforme sua estrutura
import Footer from '../components/Footer/index'; // Ajuste o caminho conforme sua estrutura

// IMPORTE AS IMAGENS AQUI
import limpezaImage from '../img/limpeza.png'; // Ajuste o caminho conforme onde você salvou
import drenagemImage from '../img/drenagem.png';
import peelingImage from '../img/peeling.png';



// Dados mockados dos serviços (futuramente virão da API)
const servicosData = [
  {
    id: 1,
    title: 'Limpeza de Pele Profunda',
    description: 'Um tratamento essencial para remover impurezas, cravos e células mortas, promovendo uma pele mais saudável, luminosa e preparada para absorver melhor os produtos. Indicado para todos os tipos de pele.',
    image: limpezaImage, // Placeholder, a imagem real será gerada
    imageRight: true, // Imagem à direita, texto à esquerda
  },
  {
    id: 2,
    title: 'Drenagem Linfática Corporal',
    description: 'Massagem suave e rítmica que estimula o sistema linfático, auxiliando na redução de inchaços, eliminação de toxinas e melhora da circulação. Ideal para pós-operatório e combate à retenção de líquidos.',
    image: drenagemImage, // Placeholder, a imagem real será gerada
    imageRight: false, // Imagem à esquerda, texto à direita
  },
  {
    id: 3,
    title: 'Peeling Químico',
    description: 'Procedimento que utiliza ácidos para remover camadas superficiais da pele, tratando manchas, cicatrizes de acne, rugas finas e promovendo a renovação celular para uma pele mais uniforme e rejuvenescida.',
    image: drenagemImage, // Placeholder, a imagem real será gerada
    imageRight: true, // Imagem à direita, texto à esquerda
  },
  {
    id: 4,
    title: 'Massagem Relaxante',
    description: 'Técnica de massagem que utiliza movimentos suaves e firmes para aliviar tensões musculares, reduzir o estresse e proporcionar uma profunda sensação de bem-estar e relaxamento para corpo e mente.',
    image: 'https://cris-moro-estetica.com.br/massagem-relaxante.jpg', // Placeholder, a imagem real será gerada
    imageRight: false, // Imagem à esquerda, texto à direita
  },
];

// Componente auxiliar para renderizar cada seção de serviço
const ServiceSection = ({ service }) => {
  const { title, description, image, imageRight } = service;

  return (
    <div className={`service-section ${imageRight ? 'image-right' : 'image-left'} flex flex-col md:flex-row items-center my-8 p-4 bg-white shadow-md rounded-lg`}>
      {/* Bloco da Imagem */}
      <div className={`md:w-1/2 ${imageRight ? 'md:order-2' : 'md:order-1'} flex justify-center p-4`}>
        <img src={image} alt={title} className="w-full max-w-md h-auto rounded-lg shadow-lg object-cover" />
      </div>

      {/* Bloco do Texto */}
      <div className={`md:w-1/2 ${imageRight ? 'md:order-1' : 'md:order-2'} p-4 text-center md:text-left`}>
        <h2 className="text-3xl font-bold text-gray-800 mb-4">{title}</h2>
        <p className="text-gray-600 leading-relaxed">{description}</p>
        <button className="mt-6 px-6 py-3 bg-purple-600 text-white font-semibold rounded-full hover:bg-purple-700 transition duration-300">
          Agendar Agora
        </button>
      </div>
    </div>
  );
};

// Página principal de Serviços
function Servicos() {
  return (
    <div className="servicos-page-container bg-gray-100 min-h-screen">
      

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-extrabold text-center text-purple-800 mb-12">Nossos Serviços de Estética</h1>

        <section className="service-list">
          {servicosData.map(service => (
            <ServiceSection key={service.id} service={service} />
          ))}
        </section>
      </main>

      <Footer /> {/* Inclui o Footer */}
    </div>
  );
}

export default Servicos;