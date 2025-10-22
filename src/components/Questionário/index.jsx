/* * Ficheiro: src/components/Questionário/index.jsx 
 * (ou src/pages/QuestionarioPage.jsx)
 * * Versão completa com TODAS as perguntas.
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

/* * ATENÇÃO: Verifique se estes caminhos de importação estão corretos
 * com base na localização DESTE ficheiro.
 * Se este ficheiro está em 'src/components/Questionário/', os caminhos abaixo estão corretos.
 */
import Header from '../Header/index'; 
import Footer from '../Footer/index'; 

// Estado inicial completo para limpar o formulário
const estadoInicialFormulario = {
  // Seção 1
  nome: '',
  endereco: '',
  email: '',
  telefone: '',
  // Seção 2
  motivo_consulta: '',
  tratamento_previo: '',
  motivos: [],
  area_interesse: [],
  // Seção 3
  historico_saude: '',
  tipo_sanguineo: 'Selecione uma opção',
  teve_covid: '',
  vacina_covid: '',
  historico_doencas: [],
  // Seção 4
  retencao_liquidos: '',
  cansaco_excessivo: '',
  pratica_fisica: '',
  // Seção 5
  alimentacao: '',
  dieta: '',
  bebida: '',
  alimentacao_rotina: '',
  // Seção 6
  idade_menarca: '',
  ciclo_menstrual: '',
  contraceptivo: '',
  tipo_contraceptivo: 'Selecione uma opção',
};

// Componente da Página
function Questionario() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(estadoInicialFormulario);
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // --- Handlers (Funções de atualização) ---

  // Handler genérico para inputs de texto, email, tel, radio, select e textarea
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handler específico para checkboxes (que usam arrays)
  const handleCheckboxChange = (e) => {
    const { name, value, checked } = e.target;
    setFormData(prevData => {
      const arrayAtual = prevData[name] || [];
      if (checked) {
        return { ...prevData, [name]: [...arrayAtual, value] };
      } else {
        return { ...prevData, [name]: arrayAtual.filter(item => item !== value) };
      }
    });
  };

  // --- Função de Envio (Submit) ---
  
  const handleSubmit = async (e) => {
    e.preventDefault(); 
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // O endpoint da sua API de backend
      const response = await fetch('/api/questionario', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData), 
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Falha ao enviar o questionário.');
      }

      setIsLoading(false);
      setSuccess(true); 
      setFormData(estadoInicialFormulario); 

      setTimeout(() => {
        navigate('/agendamentos'); 
      }, 4000); 

    } catch (err) {
      setIsLoading(false);
      setError(err.message);
    }
  };

  // --- Estilos Comuns do Tailwind ---
  const estiloInput = "mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm";
  const estiloLabel = "block text-sm font-medium text-gray-700";
  const estiloGrupoForm = "mb-6"; // Aumentei a margem para mais espaçamento
  const estiloFieldset = "border border-gray-200 p-4 md:p-6 rounded-lg bg-white shadow-sm";
  const estiloLegend = "text-xl font-semibold text-purple-700 px-2 mb-4";
  const estiloRadioLabel = "flex items-center gap-2 text-sm text-gray-600 cursor-pointer";
  const estiloRadioInput = "h-4 w-4 text-purple-600 border-gray-300 focus:ring-purple-500 cursor-pointer";
  const estiloGrupoRadio = "flex flex-col sm:flex-row gap-4 mt-2";
  const estiloTextoPergunta = "text-md font-medium text-gray-700";

  // --- Renderização de Sucesso ---
  if (success) {
    return (
      <div className="flex flex-col min-h-screen">
       
        <main className="flex-grow container mx-auto px-4 py-8 flex items-center justify-center">
          <div className="bg-white p-10 rounded-lg shadow-xl text-center max-w-lg">
            <h2 className="text-3xl font-bold text-purple-700 mb-4">Obrigado!</h2>
            <p className="text-gray-600 text-lg">
              Seu questionário foi enviado com sucesso. Entraremos em contato em breve com sua recomendação personalizada!
            </p>
            <p className="text-gray-500 text-sm mt-4">
              Você será redirecionado em instantes...
            </p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // --- Renderização Padrão (O Formulário) ---
  return (
    <div className="bg-gray-50 min-h-screen">
      
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">

          {/* Cabeçalho da Página */}
          <article className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-8 rounded-lg shadow-xl text-center mb-8">
            <h1 className="text-3xl font-bold mb-4">Questionário Personalizado</h1>
            <p className="text-lg">
              Responda as perguntas abaixo para que a nossa equipe possa indicar o melhor tratamento para você.
            </p>
          </article>

          {/* Formulário */}
          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* Seção 1: Dados Pessoais */}
            <fieldset className={estiloFieldset}>
              <legend className={estiloLegend}>Dados Pessoais</legend>
              <div className={estiloGrupoForm}>
                <label htmlFor="nome" className={estiloLabel}>Nome completo: <span className="text-red-500">*</span></label>
                <input type="text" id="nome" name="nome" className={estiloInput} required value={formData.nome} onChange={handleChange} placeholder="Digite seu nome completo" />
              </div>
              <div className={estiloGrupoForm}>
                <label htmlFor="endereco" className={estiloLabel}>Endereço:</label>
                <input type="text" id="endereco" name="endereco" className={estiloInput} value={formData.endereco} onChange={handleChange} placeholder="Rua, número, complemento" />
              </div>
              <div className={estiloGrupoForm}>
                <label htmlFor="email" className={estiloLabel}>Email: <span className="text-red-500">*</span></label>
                <input type="email" id="email" name="email" className={estiloInput} required value={formData.email} onChange={handleChange} placeholder="exemplo@email.com" />
              </div>
              <div className={estiloGrupoForm}>
                <label htmlFor="telefone" className={estiloLabel}>Telefone: <span className="text-red-500">*</span></label>
                <input type="tel" id="telefone" name="telefone" className={estiloInput} required value={formData.telefone} onChange={handleChange} placeholder="(00) 00000-0000" />
              </div>
            </fieldset>

            {/* Seção 2: Motivação Consulta */}
            <fieldset className={estiloFieldset}>
              <legend className={estiloLegend}>Motivação e Objetivos</legend>
              <div className={estiloGrupoForm}>
                <label htmlFor="motivo-consulta" className={estiloLabel}>1. Descreva suas motivações na busca por um tratamento: <span className="text-red-500">*</span></label>
                <textarea id="motivo-consulta" name="motivo_consulta" rows="4" className={estiloInput} required value={formData.motivo_consulta} onChange={handleChange} placeholder="Descreva seus objetivos com o tratamento"></textarea>
              </div>
              
              <div className={estiloGrupoForm}>
                <p className={estiloTextoPergunta}>2. Você já realizou algum tratamento estético?</p>
                <div className={estiloGrupoRadio}>
                  <label className={estiloRadioLabel}><input type="radio" name="tratamento_previo" value="sim" className={estiloRadioInput} checked={formData.tratamento_previo === 'sim'} onChange={handleChange}/> Sim</label>
                  <label className={estiloRadioLabel}><input type="radio" name="tratamento_previo" value="não" className={estiloRadioInput} checked={formData.tratamento_previo === 'não'} onChange={handleChange}/> Não</label>
                </div>
              </div>
              
              <div className={estiloGrupoForm}>
                <p className={estiloTextoPergunta}>3. Qual o motivo da consulta? (Marque todas que se aplicam)</p>
                <div className="flex flex-col gap-2 mt-2">
                  <label className={estiloRadioLabel}><input type="checkbox" name="motivos" value="gordura_localizada" className={estiloRadioInput} checked={formData.motivos.includes('gordura_localizada')} onChange={handleCheckboxChange} /> Gordura localizada</label>
                  <label className={estiloRadioLabel}><input type="checkbox" name="motivos" value="celulite" className={estiloRadioInput} checked={formData.motivos.includes('celulite')} onChange={handleCheckboxChange} /> Celulite</label>
                  <label className={estiloRadioLabel}><input type="checkbox" name="motivos" value="retenção-liquido" className={estiloRadioInput} checked={formData.motivos.includes('retenção-liquido')} onChange={handleCheckboxChange} /> Retenção de liquido</label>
                  <label className={estiloRadioLabel}><input type="checkbox" name="motivos" value="flacidez" className={estiloRadioInput} checked={formData.motivos.includes('flacidez')} onChange={handleCheckboxChange} /> Flacidez</label>
                  <label className={estiloRadioLabel}><input type="checkbox" name="motivos" value="lipedema" className={estiloRadioInput} checked={formData.motivos.includes('lipedema')} onChange={handleCheckboxChange} /> Lipedema</label>
                </div>
              </div>

              <div className={estiloGrupoForm}>
                <p className={estiloTextoPergunta}>4. Qual área te incomoda mais? (Marque todas que se aplicam)</p>
                <div className="flex flex-col gap-2 mt-2">
                  <label className={estiloRadioLabel}><input type="checkbox" name="area_interesse" value="abdomen" className={estiloRadioInput} checked={formData.area_interesse.includes('abdomen')} onChange={handleCheckboxChange} /> Abdômen</label>
                  <label className={estiloRadioLabel}><input type="checkbox" name="area_interesse" value="bracos" className={estiloRadioInput} checked={formData.area_interesse.includes('bracos')} onChange={handleCheckboxChange} /> Braços</label>
                  <label className={estiloRadioLabel}><input type="checkbox" name="area_interesse" value="pernas" className={estiloRadioInput} checked={formData.area_interesse.includes('pernas')} onChange={handleCheckboxChange} /> Pernas</label>
                  <label className={estiloRadioLabel}><input type="checkbox" name="area_interesse" value="costas" className={estiloRadioInput} checked={formData.area_interesse.includes('costas')} onChange={handleCheckboxChange} /> Costas</label>
                  <label className={estiloRadioLabel}><input type="checkbox" name="area_interesse" value="gluteos" className={estiloRadioInput} checked={formData.area_interesse.includes('gluteos')} onChange={handleCheckboxChange} /> Glúteos</label>
                </div>
              </div>
            </fieldset>

            {/* Seção 3: Histórico de saúde */}
            <fieldset className={estiloFieldset}>
              <legend className={estiloLegend}>Histórico de saúde</legend>
              <div className={estiloGrupoForm}>
                <label htmlFor="historico-saude" className={estiloLabel}>5. Possui alguma condição de saúde relevante ou já enfrentou alguma doença importante? <span className="text-red-500">*</span></label>
                <textarea id="historico-saude" name="historico_saude" rows="4" className={estiloInput} required value={formData.historico_saude} onChange={handleChange} placeholder="Descreva sua condição de saúde"></textarea>
              </div>

              <div className={estiloGrupoForm}>
                <label htmlFor="tipo-sanguineo" className={estiloLabel}>6. Qual o seu tipo sanguíneo?</label>
                <select id="tipo-sanguineo" name="tipo_sanguineo" className={estiloInput} value={formData.tipo_sanguineo} onChange={handleChange}>
                  <option>Selecione uma opção</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                  <option value="não_sei">Não Sei</option>
                </select>
              </div>

              <div className={estiloGrupoForm}>
                <p className={estiloTextoPergunta}>7. Você teve COVID-19?</p>
                <div className={estiloGrupoRadio}>
                  <label className={estiloRadioLabel}><input type="radio" name="teve_covid" value="sim" className={estiloRadioInput} checked={formData.teve_covid === 'sim'} onChange={handleChange}/> Sim</label>
                  <label className={estiloRadioLabel}><input type="radio" name="teve_covid" value="não" className={estiloRadioInput} checked={formData.teve_covid === 'não'} onChange={handleChange}/> Não</label>
                </div>
              </div>

              <div className={estiloGrupoForm}>
                <p className={estiloTextoPergunta}>8. Recebeu vacina contra COVID-19?</p>
                <div className={estiloGrupoRadio}>
                  <label className={estiloRadioLabel}><input type="radio" name="vacina_covid" value="sim" className={estiloRadioInput} checked={formData.vacina_covid === 'sim'} onChange={handleChange}/> Sim</label>
                  <label className={estiloRadioLabel}><input type="radio" name="vacina_covid" value="não" className={estiloRadioInput} checked={formData.vacina_covid === 'não'} onChange={handleChange}/> Não</label>
                </div>
              </div>
              
              <div className={estiloGrupoForm}>
                <p className={estiloTextoPergunta}>9. Histórico de doenças familiares relevantes? (Marque todas que se aplicam)</p>
                <div className="flex flex-col gap-2 mt-2">
                  <label className={estiloRadioLabel}><input type="checkbox" name="historico_doencas" value="diabetes" className={estiloRadioInput} checked={formData.historico_doencas.includes('diabetes')} onChange={handleCheckboxChange} /> Diabetes</label>
                  <label className={estiloRadioLabel}><input type="checkbox" name="historico_doencas" value="doença-cardiovascular" className={estiloRadioInput} checked={formData.historico_doencas.includes('doença-cardiovascular')} onChange={handleCheckboxChange} /> Doenças cardiovascular</label>
                  <label className={estiloRadioLabel}><input type="checkbox" name="historico_doencas" value="hipertensao" className={estiloRadioInput} checked={formData.historico_doencas.includes('hipertensao')} onChange={handleCheckboxChange} /> Hipertensão</label>
                  <label className={estiloRadioLabel}><input type="checkbox" name="historico_doencas" value="cancer" className={estiloRadioInput} checked={formData.historico_doencas.includes('cancer')} onChange={handleCheckboxChange} /> Câncer</label>
                  <label className={estiloRadioLabel}><input type="checkbox" name="historico_doencas" value="obesidade" className={estiloRadioInput} checked={formData.historico_doencas.includes('obesidade')} onChange={handleCheckboxChange} /> Obesidade</label>
                </div>
              </div>
            </fieldset>

            {/* Seção 4: Saúde e Bem-estar */}
            <fieldset className={estiloFieldset}>
              <legend className={estiloLegend}>Saúde e Bem-estar</legend>
              <div className={estiloGrupoForm}>
                <p className={estiloTextoPergunta}>10. Você possui retenção de líquidos, inchaço ou dores nas pernas?</p>
                <div className={estiloGrupoRadio}>
                  <label className={estiloRadioLabel}><input type="radio" name="retencao_liquidos" value="sim" className={estiloRadioInput} checked={formData.retencao_liquidos === 'sim'} onChange={handleChange}/> Sim</label>
                  <label className={estiloRadioLabel}><input type="radio" name="retencao_liquidos" value="não" className={estiloRadioInput} checked={formData.retencao_liquidos === 'não'} onChange={handleChange}/> Não</label>
                </div>
              </div>

              <div className={estiloGrupoForm}>
                <p className={estiloTextoPergunta}>11. Sente cansaço excessivo em atividades leves?</p>
                <div className={estiloGrupoRadio}>
                  <label className={estiloRadioLabel}><input type="radio" name="cansaco_excessivo" value="sim" className={estiloRadioInput} checked={formData.cansaco_excessivo === 'sim'} onChange={handleChange}/> Sim</label>
                  <label className={estiloRadioLabel}><input type="radio" name="cansaco_excessivo" value="não" className={estiloRadioInput} checked={formData.cansaco_excessivo === 'não'} onChange={handleChange}/> Não</label>
                </div>
              </div>

              <div className={estiloGrupoForm}>
                <p className={estiloTextoPergunta}>12. Você pratica atividades físicas?</p>
                <div className={estiloGrupoRadio}>
                  <label className={estiloRadioLabel}><input type="radio" name="pratica_fisica" value="regularmente" className={estiloRadioInput} checked={formData.pratica_fisica === 'regularmente'} onChange={handleChange}/> Regularmente</label>
                  <label className={estiloRadioLabel}><input type="radio" name="pratica_fisica" value="ocasionalmente" className={estiloRadioInput} checked={formData.pratica_fisica === 'ocasionalmente'} onChange={handleChange}/> Ocasionalmente</label>
                  <label className={estiloRadioLabel}><input type="radio" name="pratica_fisica" value="nunca" className={estiloRadioInput} checked={formData.pratica_fisica === 'nunca'} onChange={handleChange}/> Nunca</label>
                </div>
              </div>
            </fieldset>

            {/* Seção 5: Alimentação e Rotina */}
            <fieldset className={estiloFieldset}>
              <legend className={estiloLegend}>Alimentação e Rotina</legend>
              <div className={estiloGrupoForm}>
                <p className={estiloTextoPergunta}>13. Como define a sua alimentação?</p>
                <div className={estiloGrupoRadio}>
                  <label className={estiloRadioLabel}><input type="radio" name="alimentacao" value="equilibrada" className={estiloRadioInput} checked={formData.alimentacao === 'equilibrada'} onChange={handleChange}/> Equilibrada</label>
                  <label className={estiloRadioLabel}><input type="radio" name="alimentacao" value="desregrada" className={estiloRadioInput} checked={formData.alimentacao === 'desregrada'} onChange={handleChange}/> Desregrada</label>
                  <label className={estiloRadioLabel}><input type="radio" name="alimentacao" value="variada" className={estiloRadioInput} checked={formData.alimentacao === 'variada'} onChange={handleChange}/> Variada</label>
                </div>
              </div>

              <div className={estiloGrupoForm}>
                <p className={estiloTextoPergunta}>14. Já seguiu alguma dieta?</p>
                <div className={estiloGrupoRadio}>
                  <label className={estiloRadioLabel}><input type="radio" name="dieta" value="sim" className={estiloRadioInput} checked={formData.dieta === 'sim'} onChange={handleChange}/> Sim</label>
                  <label className={estiloRadioLabel}><input type="radio" name="dieta" value="não" className={estiloRadioInput} checked={formData.dieta === 'não'} onChange={handleChange}/> Não</label>
                </div>
              </div>

              <div className={estiloGrupoForm}>
                <p className={estiloTextoPergunta}>15. Bebe líquidos durante as refeições?</p>
                <div className={estiloGrupoRadio}>
                  <label className={estiloRadioLabel}><input type="radio" name="bebida" value="sim" className={estiloRadioInput} checked={formData.bebida === 'sim'} onChange={handleChange}/> Sim</label>
                  <label className={estiloRadioLabel}><input type="radio" name="bebida" value="não" className={estiloRadioInput} checked={formData.bebida === 'não'} onChange={handleChange}/> Não</label>
                </div>
              </div>

              <div className={estiloGrupoForm}>
                <label htmlFor="alimentacao-rotina" className={estiloLabel}>16. Possui aversão alimentar? Se sim, descreva: <span className="text-red-500">*</span></label>
                <textarea id="alimentacao-rotina" name="alimentacao_rotina" rows="4" className={estiloInput} required value={formData.alimentacao_rotina} onChange={handleChange} placeholder="Descreva sua aversão"></textarea>
              </div>
            </fieldset>

            {/* Seção 6: Saúde Feminina */}
            <fieldset className={estiloFieldset}>
              <legend className={estiloLegend}>Saúde Feminina (Opcional)</legend>
              <div className={estiloGrupoForm}>
                <label htmlFor="idade-menarca" className={estiloLabel}>17. Idade da menarca? (primeira menstruação)</label>
                <input type="number" id="idade-menarca" name="idade_menarca" min="8" max="20" className={estiloInput} placeholder="Idade em anos" value={formData.idade_menarca} onChange={handleChange} />
              </div>

              <div className={estiloGrupoForm}>
                <p className={estiloTextoPergunta}>18. Seu ciclo menstrual é regulado?</p>
                <div className={estiloGrupoRadio}>
                  <label className={estiloRadioLabel}><input type="radio" name="ciclo_menstrual" value="sim" className={estiloInput} checked={formData.ciclo_menstrual === 'sim'} onChange={handleChange}/> Sim</label>
                  <label className={estiloRadioLabel}><input type="radio" name="ciclo_menstrual" value="não" className={estiloInput} checked={formData.ciclo_menstrual === 'não'} onChange={handleChange}/> Não</label>
                </div>
              </div>

              <div className={estiloGrupoForm}>
                <p className={estiloTextoPergunta}>19. Usa anticoncepcional?</p>
                <div className={estiloGrupoRadio}>
                  <label className={estiloRadioLabel}><input type="radio" name="contraceptivo" value="sim" className={estiloRadioInput} checked={formData.contraceptivo === 'sim'} onChange={handleChange}/> Sim</label>
                  <label className={estiloRadioLabel}><input type="radio" name="contraceptivo" value="não" className={estiloRadioInput} checked={formData.contraceptivo === 'não'} onChange={handleChange}/> Não</label>
                </div>
              </div>
              
              {/* Renderização Condicional */}
              {formData.contraceptivo === 'sim' && (
                <div id="contraceptivo-details" className="mt-4 pl-6 border-l-4 border-purple-200">
                  <label htmlFor="tipo-contraceptivo" className={estiloLabel}>Tipo de anticoncepcional</label>
                  <select id="tipo-contraceptivo" name="tipo_contraceptivo" className={estiloInput} value={formData.tipo_contraceptivo} onChange={handleChange}>
                    <option>Selecione uma opção</option>
                    <option value="contraceptivo-oral">Contraceptivo via oral</option>
                    <option value="diu">DIU</option>
                    <option value="contraceptivo-injetável">Contraceptivo Injetável</option>
                    <option value="contraceptivo-implantado">Contraceptivo implantado</option>
                    <option value="outros">Outros métodos</option>
                  </select>
                </div>
              )}
            </fieldset>
            
            {/* Seção de Envio */}
            <div className="form-actions pt-4">
              {error && (
                <p className="text-center mb-4 text-red-600 font-semibold">{error}</p>
              )}
              
              <button
                type="submit"
                id="submit-form"
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-full focus:outline-none focus:shadow-outline transition duration-300 transform hover:scale-105 disabled:bg-gray-400 disabled:cursor-not-allowed"
                disabled={isLoading} 
              >
                {isLoading ? 'Enviando...' : 'Enviar Questionário'}
              </button>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default Questionario;