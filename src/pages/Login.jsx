import { useState } from "react";
import { users } from "../data/users-constants";
import { useNavigate } from "react-router-dom";
import { login } from "../utils/storege";
import api from "../services/api";


function Login(){
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [error, setError] =useState('');
    //console.log(email)
    //console.log(senha)
    const navigate = useNavigate();
    async function  handleLogin() {
        // const userFound = users.find(user => user.email === email);
        const userFound = await api.post('/login', {email, senha} )
        console.log(userFound);
        if(userFound) {
            const match = senha === userFound.senha
            if(match) {
                //usuario autenticado(encontrado com autorização)
                setError('');
                login(JSON.stringify(userFound));
                navigate('/painel');
                return;
            }
            //senha invalida
            setError('Senha invalida');
            return;
        }
        //usuario não encontrado
        setError('Usuario não encontrado')
        return;
    }
    return(
        <div className="flex-grow flex shadow m-6 rounded-[12px] bg-slate-200 justify-center items-center">
            <div className="p-6 flex flex-col min-w-[398px] gap-3">
                <h3 className="text-center">Faça Login na sua conta</h3>
                <div className="flex flex-col w-[100%]">
                    <span>E-mail</span>
                    <input className="rounded-[6px] min-h-[40px] p-2" placeholder="informe seu e-mail" type="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className="field flex flex-col w-[100%] ">
                    <span>Senha</span>
                    <input className="rounded-[6px] min-h-[40px] p-2" placeholder="informe sua senha" type="password" name="senha" value={senha} onChange={(e) => setSenha(e.target.value)} />
                </div>
                <span>Esqueceu a senha</span>
                <button onClick={handleLogin} className="text-white bg-color-primary uppercase font-bold rounded-[8px] min-h-[40px]">Entrar</button>
                <span className="text-red-error ">{error}</span>
            </div>
        </div>
    );
};

export default Login;