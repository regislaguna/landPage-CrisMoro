
import { useMemo } from "react";
import Card from "../components/Card";
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
        <Header/>
        <main className="flex flex-grow container mx-auto p-4 mt-[100px]">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/sobre" element={<Sobre />} />
            <Route path="/agendamento" element={<Agendamento />} />
            <Route path="/questionario-personalizado" element={<Questionario />} />
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
       
        
      </div>
    </BrowserRouter>
  );
}

export default App;
