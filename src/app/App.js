
import { useMemo } from "react";
import Card from "../components/Carousel";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "../pages/Home";
import Sobre from "../pages/Sobre";
import Agendamento from "../pages/Agendamento";
import Servicos from "../pages/Servicos";
import Painel from "../pages/Painel";
import Login from "../pages/Login";
import PrivateRoute from "../components/Auth";
import Questionario from "../components/Questionário";


function App() {
  
  
  return (
    <BrowserRouter>
      <div className="Content flex min-h-screen flex-col">

        {/* DEPOIS: Adicione o Skip Link aqui */}
        <a 
          href="#main-content" 
          className="
            absolute left-[-9999px] p-3 bg-white text-text-dark font-bold 
            border border-accent-dark rounded-b-md
            focus:left-4 focus:top-0 z-50
          "
        >
          Pular para o Conteúdo Principal
        </a>
        
        <Header/>
        <main className="flex flex-grow flex-col justify-center container mx-auto p-2 mt-[25px]">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/sobre" element={<Sobre />} />
            <Route path="/agendamento" element={<Agendamento />} />
            <Route path="/questionario" element={<Questionario />} />
            <Route path="/servicos" element={<Servicos />} />
            <Route path="/painel" element={ 
              <PrivateRoute>
                <Painel/>
              </PrivateRoute>
            }/>
            <Route path="/login" element={<Login/>} />
            <Route path="/servicos" element={<Servicos />} />
          </Routes>
        </main>
            <Footer/>
        
      </div>
    </BrowserRouter>
  );
}

export default App;
