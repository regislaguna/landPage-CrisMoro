import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import logoImage from "../../img/Logo empresa.png";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <header className="relative w-full z-50 bg-accent-light shadow-md">
      <nav
        className="container mx-auto flex justify-between items-center px-4 py-4 md:px-0"
        aria-label="Navegação principal"
      >
        {/* Logo */}
        <div className="flex-shrink-0">
          <Link to="/" aria-label="Página inicial">
            <img
              src={logoImage}
              className="w-[120px] h-[120px] rounded-full object-cover"
              alt="Logo Cris Moro"
            />
          </Link>
        </div>

        {/* Menu Desktop */}
        <ul className="hidden md:flex space-x-8 items-center">
          {[
            { path: "/", label: "Home" },
            { path: "/sobre", label: "Sobre" },
            { path: "/servicos", label: "Serviços" },
          ].map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                aria-current={isActive(item.path) ? "page" : undefined}
                className={`text-lg font-extrabold uppercase tracking-wide transition-colors duration-300 ${
                  isActive(item.path)
                    ? "text-accent-dark border-b-2 border-accent-dark"
                    : "text-text-dark hover:text-text-medium"
                }`}
              >
                {item.label}
              </Link>
            </li>
          ))}

          {/* Botão de ação destacado */}
          <li>
            <Link
              to="/agendamento"
              className="ml-6 px-5 py-2 bg-accent-dark text-white rounded-full font-bold uppercase 
                         transition duration-300 hover:bg-accent-light hover:text-text-dark shadow-md"
            >
              Agende Agora
            </Link>
          </li>
        </ul>

        {/* Botão Mobile */}
        <div className="md:hidden">
          <button
            className="text-text-dark focus:outline-none"
            aria-label="Abrir menu de navegação"
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-menu"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <svg
              className="w-7 h-7"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </nav>

      {/* Menu Mobile */}
      <div
        id="mobile-menu"
        className={`md:hidden transform transition-transform duration-300 ease-in-out ${
          isMobileMenuOpen
            ? "translate-y-0 opacity-100"
            : "-translate-y-5 opacity-0 pointer-events-none"
        } bg-accent-light absolute w-full left-0 shadow-lg`}
      >
        <ul className="flex flex-col items-center space-y-4 py-6">
          {[
            { path: "/", label: "Home" },
            { path: "/sobre", label: "Sobre" },
            { path: "/servicos", label: "Serviços" },
          ].map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                aria-current={isActive(item.path) ? "page" : undefined}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`text-lg font-extrabold uppercase tracking-wide transition-colors duration-300 ${
                  isActive(item.path)
                    ? "text-accent-dark border-b-2 border-accent-dark"
                    : "text-text-dark hover:text-text-medium"
                }`}
              >
                {item.label}
              </Link>
            </li>
          ))}

          {/* Botão de ação destacado no mobile */}
          <li>
            <Link
              to="/agendamento"
              onClick={() => setIsMobileMenuOpen(false)}
              className="px-6 py-2 bg-accent-dark text-white rounded-full font-bold uppercase 
                         transition duration-300 hover:bg-accent-light hover:text-text-dark shadow-md"
            >
              Agende Agora
            </Link>
          </li>
        </ul>
      </div>
    </header>
  );
};

export default Header;
