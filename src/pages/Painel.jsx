import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { logout } from '../utils/storage';
import ServicoModal from '../components/ServicosModal/index';
import UsuarioModal from '../components/UsuarioModal/index';
import GraficoAgendamentos from '../components/Graficos/index';
import * as XLSX from 'xlsx';
import {
  FaSignOutAlt, FaPlus, FaTrashAlt, FaFilePdf,
  FaFileExcel, FaSearch, FaExclamationTriangle
} from 'react-icons/fa';

function Painel() {
  // --- Estados de Dados ---
  const [servicos, setServicos] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [agendamentos, setAgendamentos] = useState([]);
  const [questionarios, setQuestionarios] = useState([]);

  // --- Estados de Loading ---
  const [loadingServicos, setLoadingServicos] = useState(true);
  const [loadingUsuarios, setLoadingUsuarios] = useState(true);
  const [loadingAgendamentos, setLoadingAgendamentos] = useState(true);
  const [loadingQuestionarios, setLoadingQuestionarios] = useState(true);

  // --- Estados de Erro ---
  const [errorServicos, setErrorServicos] = useState(null);
  const [errorUsuarios, setErrorUsuarios] = useState(null);
  const [errorAgendamentos, setErrorAgendamentos] = useState(null);
  const [errorQuestionarios, setErrorQuestionarios] = useState(null);

  // --- Estados dos Modais ---
  const [isServicoModalOpen, setIsServicoModalOpen] = useState(false);
  const [isUsuarioModalOpen, setIsUsuarioModalOpen] = useState(false);
  const [servicoParaEditar, setServicoParaEditar] = useState(null);

  // --- Estados dos Filtros de Data ---
  const [dataInicioQt, setDataInicioQt] = useState('');
  const [dataFimQt, setDataFimQt] = useState('');
  const [dataInicioAg, setDataInicioAg] = useState('');
  const [dataFimAg, setDataFimAg] = useState('');

  // --- Estados dos Filtros de Busca ---
  const [filtroAgendamento, setFiltroAgendamento] = useState('');
  const [filtroQuestionario, setFiltroQuestionario] = useState('');

  const navigate = useNavigate();

  // --- useEffect ---
  useEffect(() => {
    fetchServicos();
    fetchUsuarios();
    fetchAgendamentos();
    fetchQuestionarios();
  }, []);

  // --- Funções 'Fetch' ---
  async function fetchServicos() {
    try {
      setLoadingServicos(true);
      setErrorServicos(null);
      const response = await api.get('/servicos');
      setServicos(response.data);
    } catch (err) {
      console.error('Erro ao buscar serviços', err);
      setErrorServicos('Falha ao carregar serviços.');
    } finally {
      setLoadingServicos(false);
    }
  }
  async function fetchUsuarios() {
    try {
      setLoadingUsuarios(true);
      setErrorUsuarios(null);
      const response = await api.get('/usuarios');
      setUsuarios(response.data);
    } catch (err) {
      console.error('Erro ao buscar usuários', err);
      setErrorUsuarios('Falha ao carregar usuários.');
    } finally {
      setLoadingUsuarios(false);
    }
  }
  async function fetchAgendamentos() {
    try {
      setLoadingAgendamentos(true);
      setErrorAgendamentos(null);
      const response = await api.get('/agendamentos-admin');
      setAgendamentos(response.data);
    } catch (err) {
      console.error('Erro ao buscar agendamentos', err);
      setErrorAgendamentos('Falha ao carregar agendamentos.');
    } finally {
      setLoadingAgendamentos(false);
    }
  }
  async function fetchQuestionarios() {
    try {
      setLoadingQuestionarios(true);
      setErrorQuestionarios(null);
      const response = await api.get('/questionarios-admin');
      setQuestionarios(response.data);
    } catch (err) {
      console.error('Erro ao buscar questionários', err);
      setErrorQuestionarios('Falha ao carregar questionários.');
    } finally {
      setLoadingQuestionarios(false);
    }
  }

  // --- Funções 'Handle' (Ações) ---
  const excluirAgendamentosDuplicados = async () => {
    if (!window.confirm('Deseja excluir agendamentos duplicados?')) return;
    try {
      const res = await api.delete('/agendamentos-duplicados');
      alert(`Agendamentos removidos: ${res.data.removidos}`);
      fetchAgendamentos();
    } catch (err) {
      alert('Erro ao excluir agendamentos duplicados');
      console.error(err);
    }
  };
  const excluirQuestionariosDuplicados = async () => {
    if (!window.confirm('Deseja excluir questionários duplicados?')) return;
    try {
      const res = await api.delete('/questionarios-duplicados');
      alert(`Questionários removidos: ${res.data.removidos}`);
      fetchQuestionarios();
    } catch (err) {
      alert('Erro ao excluir questionários duplicados');
      console.error(err);
    }
  };
  const handleSalvarServico = (servicoSalvo) => {
    if (servicoParaEditar) {
      setServicos(servicos.map(s => (s.id === servicoSalvo.id ? servicoSalvo : s)));
    } else {
      setServicos([...servicos, servicoSalvo]);
    }
    setIsServicoModalOpen(false);
    setServicoParaEditar(null);
  };
  const handleExcluirServico = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir este serviço?')) return;
    try {
      await api.delete(`/servicos/${id}`);
      setServicos(servicos.filter(s => s.id !== id));
    } catch (err) {
      console.error('Erro ao excluir serviço', err);
    }
  };
  const handleSalvarUsuario = (usuarioSalvo) => {
    setUsuarios([...usuarios, usuarioSalvo]);
    setIsUsuarioModalOpen(false);
  };
  const handleLogout = () => {
    logout();
    delete api.defaults.headers.common['Authorization'];
    navigate('/login');
  };

  // --- Funções de Relatório (PDF e Excel) ---
  const gerarRelatorioPDF = async () => {
    const url = `/relatorio-questionarios?dataInicio=${dataInicioQt}&dataFim=${dataFimQt}`;
    try {
      const response = await api.get(url, { responseType: 'blob' });
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = 'relatorio-questionarios.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(link.href);
    } catch (err) {
      if (err.response && err.response.data) {
        try {
          const errorBlob = err.response.data;
          const errorText = await errorBlob.text();
          const errorJson = JSON.parse(errorText);
          alert(`Erro ao gerar PDF: ${errorJson.erro}`);
        } catch (e) {
          alert('Erro ao processar a resposta de erro da API.');
        }
      } else {
        console.error(err);
        alert('Erro de conexão ao tentar gerar o PDF.');
      }
    }
  };
  const gerarRelatorioAgendamentosPDF = async () => {
    const url = `/relatorio-agendamentos?dataInicio=${dataInicioAg}&dataFim=${dataFimAg}`;
    try {
      const response = await api.get(url, { responseType: 'blob' });
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = 'relatorio-agendamentos.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(link.href);
    } catch (err) {
      if (err.response && err.response.data) {
        try {
          const errorBlob = err.response.data;
          const errorText = await errorBlob.text();
          const errorJson = JSON.parse(errorText);
          alert(`Erro ao gerar PDF de Agendamentos: ${errorJson.erro}`);
        } catch (e) {
          alert('Erro ao processar a resposta de erro da API.');
        }
      } else {
        console.error(err);
        alert('Erro de conexão ao tentar gerar o PDF.');
      }
    }
  };
  const exportarExcel = () => {
    const dadosFiltrados = questionarios.filter(q => {
      if (!dataInicioQt || !dataFimQt) return true;
      const dataQt = new Date(q.createdAt);
      const dataFim = new Date(dataFimQt);
      dataFim.setDate(dataFim.getDate() + 1);
      return dataQt >= new Date(dataInicioQt) && dataQt < dataFim;
    });
    const dados = dadosFiltrados.map(q => ({
      Data: new Date(q.createdAt).toLocaleDateString(),
      Nome: q.nome,
      Email: q.email,
      Motivo: q.motivo_consulta,
    }));
    const planilha = XLSX.utils.json_to_sheet(dados);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, planilha, 'Questionários');
    XLSX.writeFile(workbook, 'questionarios.xlsx');
  };
  const exportarAgendamentosExcel = () => {
    const dadosFiltrados = agendamentos.filter(ag => {
      if (!dataInicioAg || !dataFimAg) return true;
      const dataAgendamento = new Date(ag.date);
      const dataFim = new Date(dataFimAg);
      dataFim.setDate(dataFim.getDate() + 1);
      return dataAgendamento >= new Date(dataInicioAg) && dataAgendamento < dataFim;
    });
    const dados = dadosFiltrados.map(ag => ({
      Data: new Date(ag.date).toLocaleDateString(),
      Hora: ag.time,
      Nome: ag.name,
      Telefone: ag.phone,
      Email: ag.email,
      'ID Servico': ag.serviceId,
      Notas: ag.notes
    }));
    const planilha = XLSX.utils.json_to_sheet(dados);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, planilha, 'Agendamentos');
    XLSX.writeFile(workbook, 'agendamentos.xlsx');
  };

  // --- Lógica de Filtro ---
  const agendamentosFiltrados = useMemo(() => {
    const termo = filtroAgendamento.toLowerCase();
    if (!termo) return agendamentos;
    return agendamentos.filter(ag =>
      (ag.name && ag.name.toLowerCase().includes(termo)) ||
      (ag.email && ag.email.toLowerCase().includes(termo)) ||
      (ag.phone && ag.phone.toLowerCase().includes(termo))
    );
  }, [agendamentos, filtroAgendamento]);

  const questionariosFiltrados = useMemo(() => {
    const termo = filtroQuestionario.toLowerCase();
    if (!termo) return questionarios;
    return questionarios.filter(q =>
      (q.nome && q.nome.toLowerCase().includes(termo)) ||
      (q.email && q.email.toLowerCase().includes(termo)) ||
      (q.motivo_consulta && q.motivo_consulta.toLowerCase().includes(termo))
    );
  }, [questionarios, filtroQuestionario]);

  // --- Renderização (JSX) ---
  return (
    <div className="p-6 bg-gray-50 min-h-screen font-sans">
      {/* Header */}
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-semibold text-gray-700">Painel do Administrador</h1>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 bg-red-400 text-white text-xs px-3 py-1 rounded-md hover:bg-red-500 transition"
        >
          <FaSignOutAlt /> Sair
        </button>
      </header>

      {/* Grid principal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* --- COLUNA PRINCIPAL (Esquerda) --- */}
        <main className="lg:col-span-2 space-y-6">

          {/* Card: Gerir Serviços */}
          <section className="bg-white p-4 rounded-md shadow-sm">
            <div className="flex justify-between items-center mb-3 border-b pb-3">
              <h2 className="text-lg font-medium text-gray-700">Gerir Serviços</h2>
              <button
                onClick={() => { setServicoParaEditar(null); setIsServicoModalOpen(true); }}
                className="flex items-center gap-1 bg-blue-400 text-white text-xs px-2 py-1 rounded-md hover:bg-blue-500 transition"
              >
                <FaPlus /> Novo Serviço
              </button>
            </div>
            {loadingServicos ? (
              <p className="text-gray-500">Carregando serviços...</p>
            ) : errorServicos ? (
              <p role="alert" className="text-red-500">{errorServicos}</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-400 uppercase">Imagem</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-400 uppercase">Título</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-400 uppercase">Preço</th>
                      <th className="px-3 py-2 text-right text-xs font-medium text-gray-400 uppercase">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {servicos.length === 0 ? (
                      <tr>
                        <td colSpan="4" className="text-center p-4 text-gray-400">Nenhum serviço cadastrado.</td>
                      </tr>
                    ) : (
                      servicos.map(servico => (
                        <tr key={servico.id} className="hover:bg-gray-50">
                          <td className="px-3 py-2">
                            <img src={servico.image} alt={servico.nome} className="w-14 h-14 object-cover rounded-md" />
                          </td>
                          <td className="px-3 py-2 font-medium">{servico.nome}</td>
                          <td className="px-3 py-2">R$ {servico.price}</td>
                          <td className="px-3 py-2 text-right">
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={() => { setServicoParaEditar(servico); setIsServicoModalOpen(true); }}
                                className="bg-yellow-400 text-white text-xs px-2 py-1 rounded-md hover:bg-yellow-500 transition"
                              >
                                Editar
                              </button>
                              <button
                                onClick={() => handleExcluirServico(servico.id)}
                                className="bg-red-400 text-white text-xs px-2 py-1 rounded-md hover:bg-red-500 transition"
                              >
                                Excluir
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          {/* Card: Agendamentos */}
          <section className="bg-white p-4 rounded-md shadow-sm">
            <h2 className="text-lg font-medium text-gray-700 mb-3 border-b pb-3">Agendamentos Recebidos</h2>
            {loadingAgendamentos ? (
              <p className="text-gray-500">Carregando agendamentos...</p>
            ) : errorAgendamentos ? (
              <p role="alert" className="text-red-500">{errorAgendamentos}</p>
            ) : (
              <>
                {/* Filtros e Botões (Agendamentos) */}
                <div className="flex flex-col md:flex-row items-center gap-3 mb-4 p-3 bg-gray-50 rounded-md">
                  {/* Filtro de Busca */}
                  <div className="relative flex-grow w-full md:w-auto">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><FaSearch /></span>
                    <input
                      type="search"
                      placeholder="Filtrar por nome, email ou telefone..."
                      value={filtroAgendamento}
                      onChange={(e) => setFiltroAgendamento(e.target.value)}
                      className="border border-gray-300 px-2 py-1 pl-9 rounded-md w-full text-sm focus:ring-1 focus:ring-blue-300"
                    />
                  </div>
                  {/* Filtros de Data */}
                  <div className="flex gap-2 items-center text-sm text-gray-600">
                    <label className="text-xs font-medium">Início:</label>
                    <input
                      type="date"
                      value={dataInicioAg}
                      onChange={(e) => setDataInicioAg(e.target.value)}
                      className="border border-gray-300 px-2 py-1 rounded-md text-xs"
                    />
                    <label className="text-xs font-medium">Fim:</label>
                    <input
                      type="date"
                      value={dataFimAg}
                      onChange={(e) => setDataFimAg(e.target.value)}
                      className="border border-gray-300 px-2 py-1 rounded-md text-xs"
                    />
                  </div>
                  {/* Botões */}
                  <div className="flex gap-2 mt-2 md:mt-0">
                    <button
                      onClick={gerarRelatorioAgendamentosPDF}
                      className="flex items-center gap-1 bg-blue-400 text-white text-xs px-2 py-1 rounded-md hover:bg-blue-500 transition"
                    >
                      <FaFilePdf /> PDF
                    </button>
                    <button
                      onClick={exportarAgendamentosExcel}
                      className="flex items-center gap-1 bg-green-400 text-white text-xs px-2 py-1 rounded-md hover:bg-green-500 transition"
                    >
                      <FaFileExcel /> Excel
                    </button>
                  </div>
                </div>

                {/* Tabela de Agendamentos */}
                <div className="overflow-x-auto mb-6">
                  <table className="min-w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-400 uppercase">Data</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-400 uppercase">Hora</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-400 uppercase">Nome</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-400 uppercase">Telefone</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-400 uppercase">Email</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-400 uppercase">Serviço</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                      {agendamentosFiltrados.map(ag => (
                        <tr key={ag.id} className="hover:bg-gray-50">
                          <td className="px-3 py-2">{new Date(ag.date).toLocaleDateString()}</td>
                          <td className="px-3 py-2">{ag.time}</td>
                          <td className="px-3 py-2">{ag.name}</td>
                          <td className="px-3 py-2">{ag.phone}</td>
                          <td className="px-3 py-2">{ag.email}</td>
                          <td className="px-3 py-2">{ag.serviceId}</td>
                        </tr>
                      ))}
                      {agendamentosFiltrados.length === 0 && (
                        <tr><td colSpan="6" className="text-center p-4 text-gray-400">Nenhum agendamento encontrado.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>

                <GraficoAgendamentos data={agendamentosFiltrados} />
              </>
            )}
          </section>

          {/* Card: Questionários */}
          <section className="bg-white p-4 rounded-md shadow-sm">
            <h2 className="text-lg font-medium text-gray-700 mb-3 border-b pb-3">Questionários Recebidos</h2>
            {loadingQuestionarios ? (
              <p className="text-gray-500">Carregando questionários...</p>
            ) : errorQuestionarios ? (
              <p role="alert" className="text-red-500">{errorQuestionarios}</p>
            ) : (
              <>
                {/* Filtros e Botões (Questionários) */}
                <div className="flex flex-col md:flex-row items-center gap-3 mb-4 p-3 bg-gray-50 rounded-md">
                  {/* Filtro de Busca */}
                  <div className="relative flex-grow w-full md:w-auto">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><FaSearch /></span>
                    <input
                      type="search"
                      placeholder="Filtrar por nome, email ou motivo..."
                      value={filtroQuestionario}
                      onChange={(e) => setFiltroQuestionario(e.target.value)}
                      className="border border-gray-300 px-2 py-1 pl-9 rounded-md w-full text-sm focus:ring-1 focus:ring-blue-300"
                    />
                  </div>
                  {/* Filtros de Data */}
                  <div className="flex gap-2 items-center text-sm text-gray-600">
                    <label className="text-xs font-medium">Início:</label>
                    <input
                      type="date"
                      value={dataInicioQt}
                      onChange={(e) => setDataInicioQt(e.target.value)}
                      className="border border-gray-300 px-2 py-1 rounded-md text-xs"
                    />
                    <label className="text-xs font-medium">Fim:</label>
                    <input
                      type="date"
                      value={dataFimQt}
                      onChange={(e) => setDataFimQt(e.target.value)}
                      className="border border-gray-300 px-2 py-1 rounded-md text-xs"
                    />
                  </div>
                  {/* Botões */}
                  <div className="flex gap-2 mt-2 md:mt-0">
                    <button
                      onClick={gerarRelatorioPDF}
                      className="flex items-center gap-1 bg-blue-400 text-white text-xs px-2 py-1 rounded-md hover:bg-blue-500 transition"
                    >
                      <FaFilePdf /> PDF
                    </button>
                    <button
                      onClick={exportarExcel}
                      className="flex items-center gap-1 bg-green-400 text-white text-xs px-2 py-1 rounded-md hover:bg-green-500 transition"
                    >
                      <FaFileExcel /> Excel
                    </button>
                  </div>
                </div>

                {/* Tabela de Questionários */}
                <div className="overflow-x-auto mb-4">
                  <table className="min-w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-400 uppercase">Data</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-400 uppercase">Nome</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-400 uppercase">Email</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-400 uppercase">Motivo</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                      {questionariosFiltrados.map(q => (
                        <tr key={q.id} className="hover:bg-gray-50">
                          <td className="px-3 py-2">{new Date(q.createdAt).toLocaleDateString()}</td>
                          <td className="px-3 py-2">{q.nome}</td>
                          <td className="px-3 py-2">{q.email}</td>
                          <td className="px-3 py-2 max-w-sm truncate" title={q.motivo_consulta}>{q.motivo_consulta}</td>
                        </tr>
                      ))}
                      {questionariosFiltrados.length === 0 && (
                        <tr><td colSpan="4" className="text-center p-4 text-gray-400">Nenhum questionário encontrado.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </section>
        </main>

        {/* --- COLUNA LATERAL (Direita) --- */}
        <aside className="lg:col-span-1 space-y-6">

          {/* Card: Gerir Administradores */}
          <section className="bg-white p-4 rounded-md shadow-sm">
            <div className="flex justify-between items-center mb-3 border-b pb-3">
              <h2 className="text-lg font-medium text-gray-700">Admins</h2>
              <button
                onClick={() => setIsUsuarioModalOpen(true)}
                className="flex items-center gap-1 bg-blue-400 text-white text-xs px-2 py-1 rounded-md hover:bg-blue-500 transition"
              >
                <FaPlus /> Novo Admin
              </button>
            </div>
            {loadingUsuarios ? (
              <p className="text-gray-500">Carregando usuários...</p>
            ) : errorUsuarios ? (
              <p role="alert" className="text-red-500">{errorUsuarios}</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-400 uppercase">Nome</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-400 uppercase">Email</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {usuarios.map(user => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="px-3 py-2">{user.nome}</td>
                        <td className="px-3 py-2">{user.email}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          {/* Card: Zona de Perigo */}
          <section className="bg-red-50 border border-red-200 p-4 rounded-md shadow-sm">
            <h2 className="text-sm font-semibold text-red-700 flex items-center gap-2">
              <FaExclamationTriangle /> Zona de Perigo
            </h2>
            <p className="text-xs text-red-600 mt-2 mb-4">
              Estas ações são permanentes e não podem ser desfeitas.
            </p>
            <div className="flex flex-col gap-2">
              <button
                onClick={excluirAgendamentosDuplicados}
                className="flex items-center justify-center gap-2 bg-red-400 text-white text-xs px-2 py-1 rounded-md hover:bg-red-500 transition"
              >
                <FaTrashAlt /> Excluir Agendamentos Duplicados
              </button>
              <button
                onClick={excluirQuestionariosDuplicados}
                className="flex items-center justify-center gap-2 bg-red-400 text-white text-xs px-2 py-1 rounded-md hover:bg-red-500 transition"
              >
                <FaTrashAlt /> Excluir Questionários Duplicados
              </button>
            </div>
          </section>
        </aside>
      </div>

      {/* Modais (Mantidos) */}
      {isServicoModalOpen && (
        <ServicoModal
          servicoAtual={servicoParaEditar}
          onClose={() => { setIsServicoModalOpen(false); setServicoParaEditar(null); }}
          onSave={handleSalvarServico}
        />
      )}
      {isUsuarioModalOpen && (
        <UsuarioModal
          onClose={() => setIsUsuarioModalOpen(false)}
          onSave={handleSalvarUsuario}
        />
      )}
    </div>
  );
}

export default Painel;
