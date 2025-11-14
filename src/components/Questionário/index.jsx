import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

const estadoInicialFormulario = {
  nome: '', endereco: '', email: '', telefone: '',
  motivo_consulta: '', tratamento_previo: '', motivos: [],
  area_interesse: [], historico_saude: '', tipo_sanguineo: '',
  teve_covid: '', vacina_covid: '', historico_doencas: [],
  retencao_liquidos: '', cansaco_excessivo: '', pratica_fisica: '',
  alimentacao: '', dieta: '', bebida: '', alimentacao_rotina: '',
  idade_menarca: '', ciclo_menstrual: '', contraceptivo: '',
  tipo_contraceptivo: '',
};

function Questionario() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(estadoInicialFormulario);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e) => {
    const { name, value, checked } = e.target;
    setFormData(prev => {
      const atual = prev[name] || [];
      return { ...prev, [name]: checked ? [...atual, value] : atual.filter(v => v !== value) };
    });
  };

  const gerarRespostas = () => Object.entries(formData).map(([key, value]) => `${key}: ${value}`);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    const payload = { ...formData, respostas: gerarRespostas() };

    try {
      await api.post('/questionario', payload);
      setIsLoading(false);
      setSuccess(true);
      setFormData(estadoInicialFormulario);
      setTimeout(() => navigate('/'), 4000);
    } catch (err) {
      setIsLoading(false);
      setError(err.response?.data?.error || 'Erro ao enviar. Verifique os campos obrigatórios.');
    }
  };

  // --- Estilos reutilizáveis ---
  const estiloFieldset = "bg-white p-6 rounded-lg shadow-sm mb-8 opacity-0 translate-y-4 animate-fadeSlide";
  const estiloLegend = "text-xl font-light text-accent-dark mb-4 border-b border-gray-200 pb-2";
  const estiloGrupo = "mb-4";
  const estiloLabel = "block text-sm font-medium text-text-dark mb-1";
  const estiloInput = "mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:border-accent-dark focus:ring focus:ring-accent-dark focus:ring-opacity-50";
  const estiloRadioGroup = "flex items-center gap-4 mt-2";
  const estiloRadioLabel = "flex items-center gap-2 text-sm text-gray-700 cursor-pointer";
  const estiloRadioInput = "h-4 w-4 text-accent-dark focus:ring-accent-dark";
  const estiloCheckboxGroup = "grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2";
  const estiloCheckboxLabel = "flex items-center gap-2 text-sm text-gray-700 cursor-pointer";
  const estiloCheckboxInput = "h-4 w-4 text-accent-dark rounded focus:ring-accent-dark";

  // --- Renderização de Sucesso ---
  if (success) {
    return (
      <main className="flex-grow flex items-center justify-center bg-bg-pale py-16">
        <div className="bg-white p-10 rounded-lg shadow-xl text-center max-w-lg animate-fadeSlide">
          <h2 className="text-3xl font-bold text-accent-dark mb-4">Obrigado!</h2>
          <p className="text-text-medium text-lg">Seu questionário foi enviado com sucesso.</p>
          <p className="text-gray-500 text-sm mt-4">Você será redirecionado para a página inicial em instantes...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-bg-pale py-16">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="text-center mb-10 animate-fadeSlide">
          <h1 className="text-4xl md:text-5xl font-light text-text-dark">Questionário Personalizado</h1>
          <p className="text-lg text-accent-dark mt-2">Preencha este formulário para uma avaliação detalhada.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Seção 1: Dados Pessoais */}
          <fieldset className={estiloFieldset}>
            <legend className={estiloLegend}>Dados Pessoais</legend>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className={estiloGrupo}>
                <label htmlFor="nome" className={estiloLabel}>Nome Completo *</label>
                <input type="text" id="nome" name="nome" value={formData.nome} onChange={handleChange} className={estiloInput} required />
              </div>
              <div className={estiloGrupo}>
                <label htmlFor="telefone" className={estiloLabel}>Telefone *</label>
                <input type="tel" id="telefone" name="telefone" value={formData.telefone} onChange={handleChange} className={estiloInput} required />
              </div>
            </div>
            <div className={estiloGrupo}>
              <label htmlFor="email" className={estiloLabel}>Email *</label>
              <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} className={estiloInput} required />
            </div>
            <div className={estiloGrupo}>
              <label htmlFor="endereco" className={estiloLabel}>Endereço</label>
              <input type="text" id="endereco" name="endereco" value={formData.endereco} onChange={handleChange} className={estiloInput} />
            </div>
          </fieldset>

          {/* Seção 2: Motivação */}
          <fieldset className={estiloFieldset}>
            <legend className={estiloLegend}>Motivação e Objetivos</legend>
            <div className={estiloGrupo}>
              <label htmlFor="motivo_consulta" className={estiloLabel}>Motivo da consulta *</label>
              <textarea id="motivo_consulta" name="motivo_consulta" value={formData.motivo_consulta} onChange={handleChange} className={estiloInput} required rows="3" />
            </div>
            <div className={estiloGrupo}>
              <label className={estiloLabel}>Tratamento estético prévio?</label>
              <div className={estiloRadioGroup}>
                <label className={estiloRadioLabel}><input type="radio" name="tratamento_previo" value="sim" checked={formData.tratamento_previo === 'sim'} onChange={handleChange} className={estiloRadioInput} /> Sim</label>
                <label className={estiloRadioLabel}><input type="radio" name="tratamento_previo" value="não" checked={formData.tratamento_previo === 'não'} onChange={handleChange} className={estiloRadioInput} /> Não</label>
              </div>
            </div>
            <div className={estiloGrupo}>
              <label className={estiloLabel}>Motivos estéticos</label>
              <div className={estiloCheckboxGroup}>
                {['celulite','flacidez','gordura_localizada','retenção-liquido'].map(opcao => (
                  <label key={opcao} className={estiloCheckboxLabel}>
                    <input type="checkbox" name="motivos" value={opcao} checked={formData.motivos.includes(opcao)} onChange={handleCheckboxChange} className={estiloCheckboxInput} />
                    {opcao}
                  </label>
                ))}
              </div>
            </div>
            <div className={estiloGrupo}>
              <label className={estiloLabel}>Áreas de interesse</label>
              <div className={estiloCheckboxGroup}>
                {['abdomen','pernas','costas','braços','glúteos'].map(opcao => (
                  <label key={opcao} className={estiloCheckboxLabel}>
                                       <input
                      type="checkbox"
                      name="area_interesse"
                      value={opcao}
                      checked={formData.area_interesse.includes(opcao)}
                      onChange={handleCheckboxChange}
                      className={estiloCheckboxInput}
                    />
                    {opcao}
                  </label>
                ))}
              </div>
            </div>
          </fieldset>

          {/* Seção 3: Saúde Geral */}
          <fieldset className={estiloFieldset}>
            <legend className={estiloLegend}>Saúde Geral</legend>
            <div className={estiloGrupo}>
              <label className={estiloLabel}>Condições de saúde ou doenças pré-existentes *</label>
              <textarea
                name="historico_saude"
                value={formData.historico_saude}
                onChange={handleChange}
                className={estiloInput}
                required
                rows="3"
                placeholder="Ex: Hipertensão, diabetes, alergias..."
              />
            </div>
            <div className={estiloGrupo}>
              <label className={estiloLabel}>Tipo sanguíneo</label>
              <select
                name="tipo_sanguineo"
                value={formData.tipo_sanguineo}
                onChange={handleChange}
                className={estiloInput}
              >
                <option value="">Selecione</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
                <option value="não sei">Não sei</option>
              </select>
            </div>
            <div className={estiloGrupo}>
              <label className={estiloLabel}>Teve COVID?</label>
              <div className={estiloRadioGroup}>
                <label className={estiloRadioLabel}>
                  <input type="radio" name="teve_covid" value="sim" checked={formData.teve_covid === 'sim'} onChange={handleChange} className={estiloRadioInput}/> Sim
                </label>
                <label className={estiloRadioLabel}>
                  <input type="radio" name="teve_covid" value="não" checked={formData.teve_covid === 'não'} onChange={handleChange} className={estiloRadioInput}/> Não
                </label>
              </div>
            </div>
            <div className={estiloGrupo}>
              <label className={estiloLabel}>Tomou vacina da COVID?</label>
              <div className={estiloRadioGroup}>
                <label className={estiloRadioLabel}>
                  <input type="radio" name="vacina_covid" value="sim" checked={formData.vacina_covid === 'sim'} onChange={handleChange} className={estiloRadioInput}/> Sim
                </label>
                <label className={estiloRadioLabel}>
                  <input type="radio" name="vacina_covid" value="não" checked={formData.vacina_covid === 'não'} onChange={handleChange} className={estiloRadioInput}/> Não
                </label>
              </div>
            </div>
            <div className={estiloGrupo}>
              <label className={estiloLabel}>Doenças pré-existentes na família</label>
              <div className={estiloCheckboxGroup}>
                {['diabetes','hipertensao','doença-cardiovascular','obesidade','câncer'].map(opcao => (
                  <label key={opcao} className={estiloCheckboxLabel}>
                    <input type="checkbox" name="historico_doencas" value={opcao} checked={formData.historico_doencas.includes(opcao)} onChange={handleCheckboxChange} className={estiloCheckboxInput}/>
                    {opcao}
                  </label>
                ))}
              </div>
            </div>
          </fieldset>

          {/* Seção 4: Saúde e Bem-estar */}
          <fieldset className={estiloFieldset}>
            <legend className={estiloLegend}>Saúde e Bem-estar</legend>
            <div className={estiloGrupo}>
              <label className={estiloLabel}>Você possui retenção de líquidos?</label>
              <div className={estiloRadioGroup}>
                <label className={estiloRadioLabel}><input type="radio" name="retencao_liquidos" value="sim" checked={formData.retencao_liquidos === 'sim'} onChange={handleChange} className={estiloRadioInput}/> Sim</label>
                <label className={estiloRadioLabel}><input type="radio" name="retencao_liquidos" value="não" checked={formData.retencao_liquidos === 'não'} onChange={handleChange} className={estiloRadioInput}/> Não</label>
              </div>
            </div>
            <div className={estiloGrupo}>
              <label className={estiloLabel}>Sente cansaço excessivo?</label>
              <div className={estiloRadioGroup}>
                <label className={estiloRadioLabel}><input type="radio" name="cansaco_excessivo" value="sim" checked={formData.cansaco_excessivo === 'sim'} onChange={handleChange} className={estiloRadioInput}/> Sim</label>
                <label className={estiloRadioLabel}><input type="radio" name="cansaco_excessivo" value="não" checked={formData.cansaco_excessivo === 'não'} onChange={handleChange} className={estiloRadioInput}/> Não</label>
              </div>
            </div>
            <div className={estiloGrupo}>
              <label className={estiloLabel}>Você pratica atividades físicas?</label>
              <select name="pratica_fisica" value={formData.pratica_fisica} onChange={handleChange} className={estiloInput}>
                <option value="">Selecione</option>
                <option value="regularmente">Regularmente</option>
                <option value="ocasionalmente">Ocasionalmente</option>
                <option value="nunca">Nunca</option>
              </select>
            </div>
          </fieldset>

          {/* Seção 5: Alimentação */}
          <fieldset className={estiloFieldset}>
            <legend className={estiloLegend}>Alimentação</legend>
            <div className={estiloGrupo}>
              <label className={estiloLabel}>Como define sua alimentação?</label>
              <select name="alimentacao" value={formData.alimentacao} onChange={handleChange} className={estiloInput}>
                <option value="">Selecione</option>
                <option value="equilibrada">Equilibrada</option>
                <option value="desregrada">Desregrada</option>
                <option value="variada">Variada</option>
              </select>
            </div>
            <div className={estiloGrupo}>
              <label className={estiloLabel}>Já seguiu alguma dieta?</label>
              <div className={estiloRadioGroup}>
                <label className={estiloRadioLabel}><input type="radio" name="dieta" value="sim" checked={formData.dieta === 'sim'} onChange={handleChange} className={estiloRadioInput}/> Sim</label>
                <label className={estiloRadioLabel}><input type="radio" name="dieta" value="não" checked={formData.dieta === 'não'} onChange={handleChange} className={estiloRadioInput}/> Não</label>
              </div>
            </div>
            <div className={estiloGrupo}>
              <label className={estiloLabel}>Bebe líquidos durante as refeições?</label>
              <div className={estiloRadioGroup}>
                <label className={estiloRadioLabel}><input type="radio" name="bebida" value="sim" checked={formData.bebida === 'sim'} onChange={handleChange} className={estiloRadioInput}/> Sim</label>
                <label className={estiloRadioLabel}><input type="radio" name="bebida" value="não" checked={formData.bebida === 'não'} onChange={handleChange} className={estiloRadioInput}/> Não</label>
              </div>
            </div>
            <div className={estiloGrupo}>
              <label htmlFor="alimentacao_rotina" className={estiloLabel}>Possui aversão alimentar? Se sim, descreva:</label>
              <textarea id="alimentacao_rotina" name="alimentacao_rotina" value={formData.alimentacao_rotina} onChange={handleChange} className={estiloInput} rows="2" />
            </div>
          </fieldset>
          {/* Seção 6: Saúde Feminina */}
          <fieldset className={estiloFieldset}>
            <legend className={estiloLegend}>Saúde Feminina</legend>
            <p className="text-xs text-gray-500 -mt-4 mb-4">
              Esta seção é opcional e destinada apenas ao público feminino.
            </p>

            <div className={estiloGrupo}>
              <label htmlFor="idade_menarca" className={estiloLabel}>
                Idade da menarca (primeira menstruação)
              </label>
              <input
                type="number"
                id="idade_menarca"
                name="idade_menarca"
                value={formData.idade_menarca}
                onChange={handleChange}
                className={estiloInput}
                min="8"
                max="20"
              />
            </div>

            <div className={estiloGrupo}>
              <label className={estiloLabel}>Seu ciclo menstrual é regulado?</label>
              <div className={estiloRadioGroup}>
                <label className={estiloRadioLabel}>
                  <input
                    type="radio"
                    name="ciclo_menstrual"
                    value="sim"
                    checked={formData.ciclo_menstrual === 'sim'}
                    onChange={handleChange}
                    className={estiloRadioInput}
                  /> Sim
                </label>
                <label className={estiloRadioLabel}>
                  <input
                    type="radio"
                    name="ciclo_menstrual"
                    value="não"
                    checked={formData.ciclo_menstrual === 'não'}
                    onChange={handleChange}
                    className={estiloRadioInput}
                  /> Não
                </label>
              </div>
            </div>

            <div className={estiloGrupo}>
              <label className={estiloLabel}>Usa anticoncepcional?</label>
              <div className={estiloRadioGroup}>
                <label className={estiloRadioLabel}>
                  <input
                    type="radio"
                    name="contraceptivo"
                    value="sim"
                    checked={formData.contraceptivo === 'sim'}
                    onChange={handleChange}
                    className={estiloRadioInput}
                  /> Sim
                </label>
                <label className={estiloRadioLabel}>
                  <input
                    type="radio"
                    name="contraceptivo"
                    value="não"
                    checked={formData.contraceptivo === 'não'}
                    onChange={handleChange}
                    className={estiloRadioInput}
                  /> Não
                </label>
              </div>
            </div>

            {/* Pergunta Condicional */}
            {formData.contraceptivo === 'sim' && (
              <div className={`${estiloGrupo} bg-accent-light bg-opacity-20 p-4 rounded-md border-l-4 border-accent-dark`}>
                <label className={estiloLabel}>Qual tipo de anticoncepcional?</label>
                <select
                  name="tipo_contraceptivo"
                  value={formData.tipo_contraceptivo}
                  onChange={handleChange}
                  className={estiloInput}
                >
                  <option value="">Selecione</option>
                  <option value="contraceptivo-oral">Contraceptivo oral</option>
                  <option value="diu">DIU</option>
                  <option value="contraceptivo-injetável">Injetável</option>
                  <option value="contraceptivo-implantado">Implantado</option>
                  <option value="outros">Outros</option>
                </select>
              </div>
            )}
          </fieldset>

          {/* Botão de envio */}
          <div className="flex flex-col items-center pt-4 animate-fadeSlide">
            {error && <p role="alert" className="text-red-600 font-semibold mb-4">{error}</p>}
            <button
              type="submit"
              className="text-white bg-accent-dark border rounded-xl uppercase font-bold 
                         min-h-[40px] w-[250px] self-center
                         transition-all duration-300 ease-in-out
                         hover:bg-accent-light hover:text-text-dark 
                         hover:shadow-lg hover:-translate-y-1
                         disabled:bg-gray-400 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              {isLoading ? 'Enviando...' : 'Enviar Questionário'}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}

export default Questionario;

        
