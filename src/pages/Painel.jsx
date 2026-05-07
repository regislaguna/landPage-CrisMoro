// --- DOCUMENTAÇÃO: IMPORTAÇÕES NECESSÁRIAS ---
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx'; 
import { FaFilePdf, FaFileExcel } from 'react-icons/fa'; 
import api from '../services/api';
import ServicoModal from '../components/ServicosModal';

function Painel() {
  const navigate = useNavigate();

  // ==========================================
  // ESTADOS DO COMPONENTE (Variáveis de Memória)
  // ==========================================
  const [servicos, setServicos] = useState([]);
  const [agendamentos, setAgendamentos] = useState([]);
  const [questionarios, setQuestionarios] = useState([]);
  const [admins, setAdmins] = useState([]);

  const [loadingServicos, setLoadingServicos] = useState(true);
  const [loadingAgendamentos, setLoadingAgendamentos] = useState(true);
  const [loadingQuestionarios, setLoadingQuestionarios] = useState(true);
  const [loadingAdmins, setLoadingAdmins] = useState(true);

  const [isServicoModalOpen, setIsServicoModalOpen] = useState(false);
  const [servicoEmEdicao, setServicoEmEdicao] = useState(null);

  const [buscaGeral, setBuscaGeral] = useState('');
  const [nomeRelatorioIndividual, setNomeRelatorioIndividual] = useState('');

  // ==========================================
  // AUTENTICAÇÃO E CARREGAMENTO
  // ==========================================
  const getAuthHeader = () => {
    const storageData = localStorage.getItem('login');
    const parsedData = storageData ? JSON.parse(storageData) : null;
    return parsedData?.token ? { headers: { Authorization: `Bearer ${parsedData.token}` } } : {};
  };

  useEffect(() => {
    fetchServicos();
    fetchAgendamentos();
    fetchQuestionarios();
    fetchAdmins();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('login');
    navigate('/login');
  };

  // ==========================================
  // NAVEGAÇÃO INTELIGENTE PARA O PRONTUÁRIO
  // ==========================================
  const irParaProntuario = (nome) => {
    if (!nome) return;
    // Navega para a página de prontuários levando o nome na "mala diplomática" (state)
    navigate('/prontuarios', { state: { termoBusca: nome } });
  };

  // ==========================================
  // BUSCA DE DADOS (GET)
  // ==========================================
  async function fetchServicos() {
    try {
      setLoadingServicos(true);
      const response = await api.get('/servicos');
      setServicos(Array.isArray(response.data) ? response.data : []);
    } catch (err) { console.error('Erro ao buscar serviços:', err); } finally { setLoadingServicos(false); }
  }

  async function fetchAgendamentos() {
    try {
      setLoadingAgendamentos(true);
      const response = await api.get('/agendamentos-admin', getAuthHeader());
      setAgendamentos(Array.isArray(response.data) ? response.data : []);
    } catch (err) { console.error('Erro ao buscar agendamentos:', err); } finally { setLoadingAgendamentos(false); }
  }

  async function fetchQuestionarios() {
    try {
      setLoadingQuestionarios(true);
      const response = await api.get('/questionarios-admin', getAuthHeader());
      setQuestionarios(Array.isArray(response.data) ? response.data : []);
    } catch (err) { console.error('Erro ao buscar questionários:', err); } finally { setLoadingQuestionarios(false); }
  }

  async function fetchAdmins() {
    try {
      setLoadingAdmins(true);
      const response = await api.get('/usuarios', getAuthHeader());
      setAdmins(Array.isArray(response.data) ? response.data : []);
    } catch (err) { console.error('Erro ao buscar admins:', err); } finally { setLoadingAdmins(false); }
  }

  // ==========================================
  // DELETAR E LÓGICA DE FILTROS
  // ==========================================
  const handleDeleteServico = async (id) => {
    if (!window.confirm("Tens a certeza que queres excluir este serviço?")) return;
    try {
      await api.delete(`/servicos/${id}`, getAuthHeader());
      fetchServicos(); 
    } catch (err) { alert("Falha ao excluir o serviço."); }
  };

  const agendamentosFiltrados = useMemo(() => {
    const lista = Array.isArray(agendamentos) ? agendamentos : [];
    if (!buscaGeral) return lista;
    const termo = buscaGeral.toLowerCase();
    return lista.filter(ag => (ag.name && ag.name.toLowerCase().includes(termo)) || (ag.email && ag.email.toLowerCase().includes(termo)) || (ag.phone && ag.phone.toLowerCase().includes(termo)));
  }, [agendamentos, buscaGeral]);

  const questionariosFiltrados = useMemo(() => {
    const lista = Array.isArray(questionarios) ? questionarios : [];
    if (!buscaGeral) return lista;
    const termo = buscaGeral.toLowerCase();
    return lista.filter(q => (q.nome && q.nome.toLowerCase().includes(termo)) || (q.email && q.email.toLowerCase().includes(termo)) || (q.telefone && q.telefone.toLowerCase().includes(termo)) || (q.motivo_consulta && q.motivo_consulta.toLowerCase().includes(termo)));
  }, [questionarios, buscaGeral]);

  // ==========================================
  // RELATÓRIOS (EXCEL E PDF)
  // ==========================================
  const exportarQuestionariosExcel = () => {
    const dadosParaExcel = questionariosFiltrados.map(q => ({
      "Data": q.createdAt ? new Date(q.createdAt).toLocaleDateString() : 'N/A', "Nome": q.nome || 'N/A', "Email": q.email || 'N/A', "Telefone": q.telefone || 'N/A', "Motivo da Consulta": q.motivo_consulta || 'N/A'
    }));
    if (dadosParaExcel.length === 0) return alert("Não há dados para exportar.");
    const planilha = XLSX.utils.json_to_sheet(dadosParaExcel);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, planilha, 'Questionarios');
    XLSX.writeFile(workbook, 'questionarios.xlsx');
  };

  const gerarRelatorioQuestionariosPDF = async () => {
    try {
      const response = await api.get('/relatorio-questionarios', { ...getAuthHeader(), responseType: 'blob' });
      if (response.data.size === 0) return alert("O PDF gerado está vazio.");
      const urlBlob = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
      const link = document.createElement('a'); link.href = urlBlob; link.setAttribute('download', 'relatorio-questionarios.pdf');
      document.body.appendChild(link); link.click(); document.body.removeChild(link);
    } catch (err) { alert('Erro ao gerar o PDF dos questionários.'); }
  };

  const gerarRelatorioPaciente = async () => {
    if (!nomeRelatorioIndividual.trim()) return alert("Digite o nome do paciente no campo.");
    try {
      const url = `/relatorio-questionarios?nome=${encodeURIComponent(nomeRelatorioIndividual)}`;
      const response = await api.get(url, { ...getAuthHeader(), responseType: 'blob' });
      if (response.data.size === 0) return alert("Paciente não encontrado ou relatório vazio.");
      const urlBlob = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
      const link = document.createElement('a'); link.href = urlBlob; link.setAttribute('download', `Dossie-${nomeRelatorioIndividual}.pdf`);
      document.body.appendChild(link); link.click(); document.body.removeChild(link);
    } catch (err) { alert('Falha ao tentar gerar o relatório individual.'); }
  };

  const exportarAgendamentosExcel = () => {
    const dadosParaExcel = agendamentosFiltrados.map(ag => ({
      "Data": ag.date ? new Date(ag.date).toLocaleDateString() : 'N/A', "Hora": ag.time || 'N/A', "Nome": ag.name || 'N/A', "Telefone": ag.phone || 'N/A',
    }));
    if (dadosParaExcel.length === 0) return alert("Não há dados para exportar.");
    const planilha = XLSX.utils.json_to_sheet(dadosParaExcel);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, planilha, 'Agendamentos');
    XLSX.writeFile(workbook, 'agendamentos.xlsx');
  };

  const gerarRelatorioAgendamentosPDF = async () => {
    try {
      const response = await api.get('/relatorio-agendamentos', { ...getAuthHeader(), responseType: 'blob' });
      if (response.data.size === 0) return alert("PDF vazio.");
      const urlBlob = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
      const link = document.createElement('a'); link.href = urlBlob; link.setAttribute('download', 'relatorio-agendamentos.pdf');
      document.body.appendChild(link); link.click(); document.body.removeChild(link);
    } catch (err) { alert('Erro ao gerar PDF de agendamentos.'); }
  };

  // ==========================================
  // RENDERIZAÇÃO
  // ==========================================
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white shadow-sm py-4 px-6 flex justify-between items-center">
        <h1 className="text-xl font-semibold text-gray-700">Painel do Administrador</h1>
        <div className="flex gap-4">
          <button onClick={() => navigate('/prontuarios')} className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-md transition font-medium text-sm shadow-sm">
            Gerir Prontuários
          </button>
          <button onClick={handleLogout} className="bg-red-400 hover:bg-red-500 text-white px-4 py-2 rounded-md transition font-medium text-sm">
            Sair
          </button>
        </div>
      </header>

      <main className="flex-grow p-6">
        <div className="max-w-7xl mx-auto space-y-6">

          {/* FERRAMENTAS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-white p-4 rounded-md shadow-sm border-l-4 border-blue-400">
              <h3 className="text-md font-medium text-gray-700 mb-2">Busca Inteligente</h3>
              <p className="text-xs text-gray-500 mb-3">Pesquise por nome, email, telefone ou motivo nas tabelas abaixo.</p>
              <input type="text" placeholder="Ex: Maria, celulite, 1899..." value={buscaGeral} onChange={(e) => setBuscaGeral(e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-blue-300" />
            </div>

            <div className="bg-white p-4 rounded-md shadow-sm border-l-4 border-green-400">
              <h3 className="text-md font-medium text-gray-700 mb-2">Dossiê do Paciente (PDF)</h3>
              <p className="text-xs text-gray-500 mb-3">Digite o nome exato para extrair a ficha clínica completa.</p>
              <div className="flex gap-2">
                <input type="text" placeholder="Nome do paciente..." value={nomeRelatorioIndividual} onChange={(e) => setNomeRelatorioIndividual(e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-green-300" />
                <button onClick={gerarRelatorioPaciente} className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition text-sm font-medium whitespace-nowrap">
                  Gerar Ficha
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* SERVIÇOS */}
            <section className="lg:col-span-2 bg-white p-4 rounded-md shadow-sm">
              <div className="flex justify-between items-center mb-3 border-b pb-3">
                <h2 className="text-lg font-medium text-gray-700">Gerir Serviços</h2>
                <button onClick={() => { setServicoEmEdicao(null); setIsServicoModalOpen(true); }} className="bg-blue-400 hover:bg-blue-500 text-white px-3 py-1 text-xs font-medium rounded transition">
                  + Novo Serviço
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="text-gray-400 text-left">
                      <th className="pb-2 font-medium">Título</th>
                      <th className="pb-2 font-medium">Preço</th>
                      <th className="pb-2 font-medium text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {loadingServicos ? <tr><td colSpan="3" className="py-4 text-center text-gray-500 text-xs">Carregando...</td></tr> : servicos.map(s => (
                      <tr key={s.id} className="hover:bg-gray-50 transition">
                        <td className="py-3 text-gray-700">{s.title || s.nome}</td>
                        <td className="py-3 text-gray-600">R$ {Number(s.price).toFixed(2)}</td>
                        <td className="py-3 text-right">
                          <button onClick={() => handleDeleteServico(s.id)} className="text-red-400 hover:text-red-600 text-xs">Excluir</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <div className="space-y-6">
              {/* ADMINS */}
              <section className="bg-white p-4 rounded-md shadow-sm">
                <div className="flex justify-between items-center mb-3 border-b pb-3">
                  <h2 className="text-lg font-medium text-gray-700">Admins</h2>
                </div>
                <div className="space-y-3 mt-4">
                  {loadingAdmins ? <p className="text-xs text-gray-500 text-center">Carregando...</p> : admins.map(admin => (
                    <div key={admin.id} className="flex justify-between text-sm items-center border-b pb-2 last:border-0">
                      <span className="text-gray-700">{admin.nome}</span>
                      <span className="text-gray-400 text-xs">{admin.email}</span>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </div>

          {/* AGENDAMENTOS */}
          <section className="bg-white p-4 rounded-md shadow-sm mt-6">
            <div className="flex justify-between items-center mb-3 border-b pb-3">
              <h2 className="text-lg font-medium text-gray-700">Agendamentos Recebidos</h2>
              <div className="flex gap-2">
                <button onClick={gerarRelatorioAgendamentosPDF} className="bg-gray-100 p-2 rounded hover:bg-gray-200" title="PDF"><FaFilePdf className="text-red-500" size={16} /></button>
                <button onClick={exportarAgendamentosExcel} className="bg-gray-100 p-2 rounded hover:bg-gray-200" title="Excel"><FaFileExcel className="text-green-500" size={16} /></button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="text-gray-400 text-left border-b">
                    <th className="pb-2">Data</th>
                    <th className="pb-2">Hora</th>
                    <th className="pb-2">Nome (Clique para Ficha)</th>
                    <th className="pb-2">Telefone</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {agendamentosFiltrados.map(ag => (
                    <tr key={ag.id} className="hover:bg-gray-50">
                      <td className="py-3">{ag.date ? new Date(ag.date).toLocaleDateString() : 'N/A'}</td>
                      <td>{ag.time}</td>
                      <td 
                        className="font-medium text-indigo-600 hover:text-indigo-800 cursor-pointer underline decoration-indigo-300 underline-offset-2 transition" 
                        onClick={() => irParaProntuario(ag.name)}
                        title="Abrir prontuário deste paciente"
                      >
                        {ag.name}
                      </td>
                      <td>{ag.phone}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* QUESTIONÁRIOS */}
          <section className="bg-white p-4 rounded-md shadow-sm mt-6">
            <div className="flex justify-between items-center mb-3 border-b pb-3">
              <h2 className="text-lg font-medium text-gray-700">Questionários Recebidos</h2>
              <div className="flex gap-2">
                <button onClick={gerarRelatorioQuestionariosPDF} className="bg-gray-100 p-2 rounded hover:bg-gray-200"><FaFilePdf className="text-red-500" size={16} /></button>
                <button onClick={exportarQuestionariosExcel} className="bg-gray-100 p-2 rounded hover:bg-gray-200"><FaFileExcel className="text-green-500" size={16} /></button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="text-gray-400 text-left border-b">
                    <th className="pb-2">Data</th>
                    <th className="pb-2">Nome (Clique para Ficha)</th>
                    <th className="pb-2">Motivo Principal</th>
                    <th className="pb-2">Telefone</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {questionariosFiltrados.map(q => (
                    <tr key={q.id} className="hover:bg-gray-50">
                      <td className="py-3">{q.createdAt ? new Date(q.createdAt).toLocaleDateString() : 'Sem Data'}</td>
                      <td 
                        className="font-medium text-indigo-600 hover:text-indigo-800 cursor-pointer underline decoration-indigo-300 underline-offset-2 transition" 
                        onClick={() => irParaProntuario(q.nome)}
                        title="Abrir prontuário deste paciente"
                      >
                        {q.nome}
                      </td>
                      <td className="truncate max-w-xs">{q.motivo_consulta}</td>
                      <td>{q.telefone}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

        </div>
      </main>

      {isServicoModalOpen && <ServicoModal servicoAtual={servicoEmEdicao} onClose={() => setIsServicoModalOpen(false)} onSave={fetchServicos} />}
    </div>
  );
}

export default Painel;