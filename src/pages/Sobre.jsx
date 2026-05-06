import React from 'react';
import { FaBook, FaBullseye, FaUsers } from 'react-icons/fa';

function Sobre() {
  return (
    <main className="bg-gray-50 py-20">
      <section className="max-w-6xl mx-auto px-6" aria-labelledby="sobre-page-title">
        
        {/* Título principal */}
        <div className="text-center mb-16">
          <h1 id="sobre-page-title" className="text-4xl md:text-5xl font-light text-gray-800">
            Minha Jornada até Você
          </h1>
          <p className="text-lg text-blue-600 mt-2">Descubra o propósito por trás da consultoria</p>
        </div>

        {/* Bloco 1: História */}
        <section className="flex flex-col md:flex-row gap-16 items-center mb-24">
          <div className="space-y-5 md:w-1/2">
            <FaBook className="text-blue-600 text-3xl mb-2" />
            <h2 id="historia-title" className="text-3xl font-light text-gray-800">
              Minha História: De Paixão a Propósito
            </h2>
            <p className="text-gray-700 leading-relaxed text-justify">
              Minha história na estética começou muito antes da formação. Sou Cris, mãe do João e da Ana, e a paixão pela natureza e pelo "pé no chão" sempre me acompanharam. Gosto de estudar, de aprender, e de criar momentos especiais em família.
            </p>
            <p className="text-gray-700 leading-relaxed text-justify">
              Essa busca por bem-estar e equilíbrio me levou ao universo da estética integrativa. Formada na Espanha e com 14 anos de prática clínica e mais de 10 mil atendimentos, eu percebi que a verdadeira beleza vai além da superfície: ela está ligada à autoestima e à confiança que cada mulher sente em si mesma.
            </p>
            <p className="text-gray-700 leading-relaxed text-justify">
              Hoje, sou presidente da Estética e Saúde Prudente Interior de São Paulo e meu maior propósito é transformar vidas, elevando a autoestima e promovendo um envelhecimento saudável.
            </p>
          </div>
          <div className="md:w-1/2">
            <img
              src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=776&q=80"
              alt="Cris Moro, consultora de imagem"
              className="rounded-lg shadow-md object-cover w-full aspect-[3/4]"
            />
          </div>
        </section>

        {/* Bloco 2: Missão e Valores */}
        <section className="flex flex-col md:flex-row gap-16 items-center mb-24">
          <div className="md:order-2 md:w-1/2">
            <img
              src="https://images.pexels.com/photos/3762464/pexels-photo-3762464.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
              alt="Cuidado estético e bem-estar"
              className="rounded-lg shadow-md object-cover w-full aspect-[3/4]"
            />
          </div>
          <div className="space-y-5 md:order-1 md:w-1/2">
            <FaBullseye className="text-blue-600 text-3xl mb-2" />
            <h2 id="missao-title" className="text-3xl font-light text-gray-800">
              Nossa Missão e Valores
            </h2>
            <p className="text-gray-700 leading-relaxed text-justify">
              Minha <strong>missão</strong> é simples: resgatar a sua melhor versão, elevando sua confiança e bem-estar. Acredito que a estética é uma ferramenta poderosa para fortalecer a autoestima, promovendo um envelhecimento saudável e feliz.
            </p>
            <ul className="list-none space-y-3 text-gray-700 text-justify">
              <li><strong className="text-gray-800">Autenticidade:</strong> Tratamentos personalizados que realçam sua beleza natural, respeitando sua essência.</li>
              <li><strong className="text-gray-800">Empatia:</strong> Escuta ativa para entender suas necessidades e construir um plano que faça sentido para você.</li>
              <li><strong className="text-gray-800">Excelência:</strong> Técnicas e produtos de alta qualidade, com foco em resultados duradouros e seguros.</li>
              <li><strong className="text-gray-800">Transformação:</strong> Uma jornada de autoconhecimento e empoderamento, onde a beleza exterior reflete sua força interior.</li>
            </ul>
          </div>
        </section>

        {/* Bloco 3: Método */}
        <section className="flex flex-col md:flex-row gap-16 items-center">
          <div className="space-y-5 md:w-1/2">
            <FaUsers className="text-blue-600 text-3xl mb-2" />
            <h2 id="metodo-title" className="text-3xl font-light text-gray-800">
              Nosso Método: Uma Conexão de Confiança
            </h2>
            <p className="text-gray-700 leading-relaxed text-justify">
              Meu trabalho é uma parceria contínua com você. O ícone de "equipe" representa essa conexão e o cuidado individualizado que dedico a cada cliente.
            </p>
            <p className="text-gray-700 leading-relaxed text-justify">
              Nosso método começa com uma escuta atenta para entender suas expectativas e histórico. A partir daí, desenvolvemos um plano de tratamento personalizado que integra as técnicas mais avançadas em estética, como a Criolipólise, sempre com o objetivo de alcançar resultados eficazes e naturais.
            </p>
            <p className="text-gray-700 leading-relaxed text-justify">
              Mais do que procedimentos, ofereço um atendimento que preza pela sua satisfação e bem-estar duradouros. Estou aqui para ser sua especialista e guia. Vamos juntas nesta jornada de cuidado e autoconfiança?
            </p>
          </div>
          <div className="md:w-1/2">
            <img
              src="https://images.unsplash.com/photo-1515377905703-c4788e51af15?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80"
              alt="Procedimento estético facial"
              className="rounded-lg shadow-md object-cover w-full aspect-[3/4]"
            />
          </div>
        </section>
      </section>
    </main>
  );
}

export default Sobre;
