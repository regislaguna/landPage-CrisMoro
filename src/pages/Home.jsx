import { useEffect, useMemo, useState } from "react";
import Card from "../components/Card";
import api from "../services/api";

function Home() {
    const [services, setServices] = useState ([])
    const servicos = useMemo(() => [
        {image: '/icons/icon_network.svg', title: 'Otimize sua infraestrutura', texto: 'Soluções avancadas de infraestrutura, gerencimaneto dos recursos de rede proporcionando eficiencia seguranca e escalabilidade'},
        {image: '/icons/icon_network.svg', title: 'Restauração e Backup', texto: 'Soluções avancadas de infraestrutura, gerencimaneto dos recursos de rede proporcionando eficiencia seguranca e escalabilidade'},
        {image: '/icons/icon_network.svg', title: 'Restauração e Backup', texto: 'Soluções avancadas de infraestrutura, gerencimaneto dos recursos de rede proporcionando eficiencia seguranca e escalabilidade'},
        {image: '/icons/icon_network.svg', title: 'Restauração e Backup', texto: 'Soluções avancadas de infraestrutura, gerencimaneto dos recursos de rede proporcionando eficiencia seguranca e escalabilidade'},
        {image: '/icons/icon_network.svg', title: 'Restauração e Backup', texto: 'Soluções avancadas de infraestrutura, gerencimaneto dos recursos de rede proporcionando eficiencia seguranca e escalabilidade'},
        {image: '/icons/icon_network.svg', title: 'Restauração e Backup', texto: 'Soluções avancadas de infraestrutura, gerencimaneto dos recursos de rede proporcionando eficiencia seguranca e escalabilidade'},
        
      ],[])
      const getServices = async () => {
        const response = await api.get('/services')
        setServices(response?.data.services || [])

        console.log(response.data);
    }
    useEffect(() =>{
        getServices();
    }, [])

    return(
        <div className="mt-[110px]">
            <h1>Pagina Inicial (Home)</h1>
            <p>Bem vindo</p>
            <section id="solucoes" className="flex mt-[100px] gap-3 flex-wrap justify-center">
          {/* <Card 
            image={'/icons/icon_network.svg'} 
            title={'Otimize sua infraestrutura'} 
            texto={'Soluções avancadas de infraestrutura, gerencimaneto dos recursos de rede proporcionando eficiencia seguranca e escalabilidade'} 
            colorBg={'bg-color-primary'}
            colorTitle={'text-white'}
            colorTexto={'text-gray-70 opactiy-70'}
            /> */}
            {services.map((service, index) => {
              console.log(service)
              return(
                <Card key={index} image={service.image} texto={service.texto} title={service.title}
                  colorBg={index % 2 ? 'bg-color-primary' : 'bg-white'} 
                  colorTexto={index % 2 ? 'text-white' : 'text-gray-70 opacity-70'}
                  colorTitle={index % 2 ? 'text-white' : 'text-color-primary'}
                  /> 
              )
            } )}
        </section>
        </div>
    )
}

export default Home;