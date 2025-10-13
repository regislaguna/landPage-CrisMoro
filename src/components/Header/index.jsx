import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { isAuthenticated, logout } from "../../utils/storege";

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    }

  const navigate = useNavigate();

    return(
        <header className="flex flex-col w-full h-[100px] bg-transparent absolute top-0 z-10">
            <nav className="h-full flex px-10 mx-auto max-w-[1281px] w-full lg:flex-row flex-col ">
                <div className="Logo-Area flex-1 flex items-center justify-center px-10">
                    <h1 className="lg:text-6xl mb:text-2xl text-color-primary font-bold uppercase tracking-[6px]">
                        Cris Moro
                    </h1>
                </div>
                <div className="Menu-Area flex-1 w-full flex items-center">
                    <button className="sm:hidden focus:outline-none cursor-pointer" onClick={toggleMenu}>
                        <svg
                            className="h-6 w-6 fill-current text-gray-700"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            >
                            <path d="M0 3h24v2H0V3zm0 6h24v2H0V9zm0 6h24v2H0v-2z"/>
                        </svg>  
                    </button>
                    <ul className=" gap-14 justify-center w-full lg:text-[1.1rem] hidden sm:flex">
                        <li className="border-b-4 border-gray-70 hover:border-color-third">
                            <a href="#quem-somos">Quem somos</a>
                        </li>
                        <li className="border-b-4 border-gray-70 hover:border-color-third">
                        <Link to="/servicos">Servicos</Link>
                        </li>
                        <li className="border-b-4 border-gray-70 hover:border-color-third">
                            <a href="/agendamento">Agendamento</a>
                        </li>
                        <li className="border-b-4 border-gray-70 hover:border-color-third">
                          <Link to="/cadastro">Cadastro</Link>
                        </li>
                    </ul>
                </div>
                {isAuthenticated()&&
                  <div className="flex justify-center items-center">
                    <button className=" bg-color-primary text-white font-bold p-3 rounded-[8px]" onClick={() => {logout(); navigate('/login')}}>Logout</button>
                  </div>
                }
            </nav>
            {/* menu lateral mobile */}
            <div
        className={`w-[33%] h-screen absolute top-0 left-0 bg-white opacity-90 flex flex-col justify-center items-center space-y-6 md:hidden ${
          isMenuOpen ? 'block' : 'hidden'
        }`}
      >
        <button
          className="absolute top-0 right-0 m-8 focus:outline-none"
          onClick={toggleMenu}
        >
          <svg
            className="h-6 w-6 fill-current text-gray-700"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
          </svg>
        </button>
        <ul className="space-y-6 text-xl text-dark-gray-primary font-raleway">
          <li className="border-b-4 border-gray-70 hover:border-color-third"><a href="#quem-somos">Quem somos</a></li>
          <li className="border-b-4 border-gray-70 hover:border-color-third"><a href="#solucoes">Soluções</a></li>
          <li className="border-b-4 border-gray-70 hover:border-color-third"><a href="#contato">Contato</a></li>
          <li className="border-b-4 border-gray-70 hover:border-color-third"><Link to="/suporte">Suporte</Link></li>
        </ul>
      </div>
        </header>
    )
}

export default Header;