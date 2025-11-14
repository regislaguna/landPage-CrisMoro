import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInstagram, faFacebookF, faPinterestP, faWhatsapp } from '@fortawesome/free-brands-svg-icons';

const Footer = () => {
  return (
    <footer id="contact" className="bg-text-dark text-gray-300 pt-12 pb-6 relative">
      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-10">
        
        {/* SOBRE */}
        <div>
          <h3 className="text-lg font-bold text-white mb-4">SOBRE</h3>
          <p className="text-sm leading-relaxed">
            Na <span className="font-semibold text-white">CRIS MORO</span>, acreditamos que a verdadeira beleza vem de dentro para fora. Nosso objetivo é realçar sua confiança e elegância natural.
          </p>
          <div className="flex gap-4 mt-4">
            <a href="https://www.instagram.com/esteticacrismoro?igsh=aWx0MTA4em9zaGxo " aria-label="Instagram" className="text-gray-400 hover:text-accent-light text-xl">
              <FontAwesomeIcon icon={faInstagram} />
            </a>
            <a href="#" aria-label="Facebook" className="text-gray-400 hover:text-accent-light text-xl">
              <FontAwesomeIcon icon={faFacebookF} />
            </a>
            <a href="#" aria-label="Pinterest" className="text-gray-400 hover:text-accent-light text-xl">
              <FontAwesomeIcon icon={faPinterestP} />
            </a>
          </div>
        </div>

        {/* SERVIÇOS */}
        <div>
          <h3 className="text-lg font-bold text-white mb-4">SERVIÇOS</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:text-accent-light transition">Limpeza de Pele</a></li>
            <li><a href="#" className="hover:text-accent-light transition">Drenagem</a></li>
            <li><a href="#" className="hover:text-accent-light transition">Peeling</a></li>
            <li><a href="#" className="hover:text-accent-light transition">Massagem</a></li>
          </ul>
        </div>

        {/* INFORMAÇÕES */}
        <div>
          <h3 className="text-lg font-bold text-white mb-4">INFORMAÇÕES</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:text-accent-light transition">FAQ</a></li>
            <li><a href="#" className="hover:text-accent-light transition">Política de Privacidade</a></li>
            <li><a href="#" className="hover:text-accent-light transition">Termos de Serviço</a></li>
            <li><a href="#" className="hover:text-accent-light transition">Blog</a></li>
          </ul>
        </div>

        {/* NEWSLETTER */}
        <div>
          <h3 className="text-lg font-bold text-white mb-4">NEWSLETTER</h3>
          <p className="text-sm mb-4">Receba dicas de beleza e promoções exclusivas:</p>
          <form className="flex flex-col gap-3">
            <input
              type="email"
              placeholder="Seu e-mail"
              className="px-4 py-2 rounded bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent-light"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-accent-dark text-white rounded hover:bg-accent-light transition"
            >
              Inscrever-se
            </button>
          </form>
        </div>
      </div>

      {/* Separador */}
      <div className="border-t border-gray-700 mt-10 pt-6 text-center text-sm text-gray-500">
        &copy; {new Date().getFullYear()} <span className="text-white font-semibold">CRIS MORO</span>. Todos os direitos reservados.
      </div>

      {/* Botão WhatsApp fixo */}
      <a
        href="https://wa.me/5511997404121"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg z-50 transition"
        aria-label="Fale conosco pelo WhatsApp"
      >
        <FontAwesomeIcon icon={faWhatsapp} className="text-2xl" />
      </a>
    </footer>
  );
};

export default Footer;
