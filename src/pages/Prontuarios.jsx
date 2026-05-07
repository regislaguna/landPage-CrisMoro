// --- DOCUMENTAÇÃO: IMPORTAÇÕES NECESSÁRIAS ---
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../services/api';

function Prontuarios() {
  const navigate = useNavigate();
  const location = useLocation(); // Escutador da "mala diplomática"

  // ==========================================
  // ESTADOS INICIAIS
  // ==========================================
  const estadoInicialFormulario = { 
    id: null, nome: '', email: '', telefone: '', 
    comorbidades: '', situacao_pele_corpo: '', 
    produtos_maquinas: [], anotacoes_clinicas: '',
    historico_tratamentos: [] 
  };

  const [prontuarios, setProntuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busca, setBusca] = useState(location.state?.termoBusca || '');

  const [modalEdicaoAberto, setModalEdicaoAberto] = useState(false);
  const [formData, setFormData] = useState(estadoInicialFormulario);

  const [modalDossieAberto, setModalDossieAberto] = useState(false);
  const [dossieAtual, setDossieAtual] = useState(null);
  const [loadingDossie, setLoadingDossie] = useState(false);

  const listaRecursosEsteticos = [
    'Radiofrequência', 'Criolipólise', 'Ultrassom Microfocado', 'Peeling Químico', 
    'Microagulhamento', 'Toxina Botulínica', 'Ácido Hialurônico', 'Limpeza de Pele', 'Drenagem Linfática'
  ];

  const getAuthHeader = () => {
    const storageData = localStorage.getItem('login');
    const parsedData = storageData ? JSON.parse(storageData) : null;
    return parsedData?.token ? { headers: { Authorization: `Bearer ${parsedData.token}` } } : {};
  };

  useEffect(() => { 
    fetchProntuarios(); 
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ==========================================
  // COMUNICAÇÃO COM A API
  // ==========================================
  async function fetchProntuarios() {
    try {
      setLoading(true);
      const response = await api.get('/prontuarios', getAuthHeader());
      const dadosProntuarios = Array.isArray(response.data) ? response.data : [];
      setProntuarios(dadosProntuarios);

      // --- MÁGICA DA NAVEGAÇÃO AUTOMÁTICA ---
      if (location.state?.termoBusca) {
        const termo = location.state.termoBusca.toLowerCase();
        const pacienteEncontrado = dadosProntuarios.find(p => p.nome.toLowerCase() === termo);
        
        if (pacienteEncontrado) {
          abrirDossie(pacienteEncontrado.id);
        } else {
          alert(`O paciente "${location.state.termoBusca}" ainda não tem Prontuário. Clique em + Nova Ficha.`);
        }
        // Limpa a rota para evitar loops ao atualizar a página
        window.history.replaceState({}, document.title);
      }

    } catch (err) {
      console.error('Erro ao buscar prontuários:', err);
    } finally {
      setLoading(false);
    }
  }

  const salvarProntuario = async (e) => {
    e.preventDefault();
    try {
      const dadosParaSalvar = { ...formData, produtos_maquinas: formData.produtos_maquinas.join(', ') };
      if (formData.id) { await api.put(`/prontuarios/${formData.id}`, dadosParaSalvar, getAuthHeader()); } 
      else { await api.post('/prontuarios', dadosParaSalvar, getAuthHeader()); }
      setModalEdicaoAberto(false); fetchProntuarios();
    } catch (err) { alert("Erro ao salvar o prontuário."); }
  };

  const excluirProntuario = async (id) => {
    if (!window.confirm("Tens a certeza que desejas excluir toda a ficha deste paciente?")) return;
    try { await api.delete(`/prontuarios/${id}`, getAuthHeader()); fetchProntuarios(); } 
    catch (err) { alert("Erro ao excluir."); }
  };

  const abrirDossie = async (id) => {
    setModalDossieAberto(true); setLoadingDossie(true); setDossieAtual(null);
    try {
      const response = await api.get(`/prontuarios/${id}`, getAuthHeader());
      setDossieAtual(response.data);
    } catch (err) {
      alert("Erro ao carregar o histórico completo."); setModalDossieAberto(false);
    } finally { setLoadingDossie(false); }
  };

  // ==========================================
  // LÓGICA DA LINHA DO TEMPO (TRATAMENTOS)
  // ==========================================
  const adicionarTratamento = () => {
    const novoTratamento = { id_unico: Date.now(), nome_tratamento: '', quantidade_sessoes: '', sessoes: [] };
    setFormData({ ...formData, historico_tratamentos: [...formData.historico_tratamentos, novoTratamento] });
  };

  const removerTratamento = (index) => {
    const novaLista = [...formData.historico_tratamentos]; novaLista.splice(index, 1);
    setFormData({ ...formData, historico_tratamentos: novaLista });
  };

  const atualizarTratamento = (index, campo, valor) => {
    const novaLista = [...formData.historico_tratamentos]; novaLista[index][campo] = valor;
    setFormData({ ...formData, historico_tratamentos: novaLista });
  };

  const adicionarSessao = (indexTratamento) => {
    const novaLista = [...formData.historico_tratamentos]; novaLista[indexTratamento].sessoes.push({ data: '', relato: '' });
    setFormData({ ...formData, historico_tratamentos: novaLista });
  };

  const removerSessao = (indexTratamento, indexSessao) => {
    const novaLista = [...formData.historico_tratamentos]; novaLista[indexTratamento].sessoes.splice(indexSessao, 1);
    setFormData({ ...formData, historico_tratamentos: novaLista });
  };

  const atualizarSessao = (indexTratamento, indexSessao, campo, valor) => {
    const novaLista = [...formData.historico_tratamentos]; novaLista[indexTratamento].sessoes[indexSessao][campo] = valor;
    setFormData({ ...formData, historico_tratamentos: novaLista });
  };

  // ==========================================
  // AUXILIARES
  // ==========================================
  const prontuariosFiltrados = useMemo(() => {
    if (!busca) return prontuarios;
    const termo = busca.toLowerCase();
    return prontuarios.filter(p => (p.nome && p.nome.toLowerCase().includes(termo)) || (p.telefone && p.telefone.toLowerCase().includes(termo)));
  }, [prontuarios, busca]);

  const abrirModalNovo = () => { setFormData(estadoInicialFormulario); setModalEdicaoAberto(true); };

  const abrirModalEditar = (prontuario) => {
    const produtosArray = prontuario.produtos_maquinas ? prontuario.produtos_maquinas.split(', ') : [];
    const historicoSeguro = Array.isArray(prontuario.historico_tratamentos) ? prontuario.historico_tratamentos : [];
    setFormData({ 
      id: prontuario.id, nome: prontuario.nome || '', email: prontuario.email || '', telefone: prontuario.telefone || '', 
      comorbidades: prontuario.comorbidades || '', situacao_pele_corpo: prontuario.situacao_pele_corpo || '', 
      produtos_maquinas: produtosArray, historico_tratamentos: historicoSeguro, anotacoes_clinicas: prontuario.anotacoes_clinicas || '' 
    });
    setModalEdicaoAberto(true);
  };

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    setFormData(prev => {
      const atual = prev.produtos_maquinas || [];
      return { ...prev, produtos_maquinas: checked ? [...atual, value] : atual.filter(v => v !== value) };
    });
  };

  // ==========================================
  // RENDERIZAÇÃO
  // ==========================================
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white shadow-sm py-4 px-6 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/painel')} className="text-gray-500 hover:text-blue-500 font-medium">&larr; Voltar ao Painel</button>
          <h1 className="text-xl font-semibold text-gray-700">Fichas Clínicas (Prontuários)</h1>
        </div>
        <button onClick={abrirModalNovo} className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md font-medium text-sm shadow-sm">+ Nova Ficha</button>
      </header>

      <main className="flex-grow p-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white p-4 rounded-md shadow-sm border-l-4 border-indigo-400 mb-6">
            <h3 className="text-md font-medium text-gray-700 mb-2">Localizar Paciente</h3>
            <input type="text" placeholder="Pesquisar por nome ou telefone..." value={busca} onChange={(e) => setBusca(e.target.value)} className="w-full md:w-1/2 border rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-indigo-300" />
          </div>

          <div className="bg-white rounded-md shadow-sm overflow-hidden">
            <table className="min-w-full text-sm text-left">
              <thead className="bg-gray-50 border-b">
                <tr className="text-gray-500">
                  <th className="py-3 px-4 font-medium">Paciente</th>
                  <th className="py-3 px-4 font-medium">Contato</th>
                  <th className="py-3 px-4 font-medium">Alertas Médicos</th>
                  <th className="py-3 px-4 font-medium text-center">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? <tr><td colSpan="4" className="py-8 text-center text-gray-400">Carregando...</td></tr> : prontuariosFiltrados.length === 0 ? <tr><td colSpan="4" className="py-8 text-center text-gray-400">Nenhum paciente encontrado.</td></tr> : (
                  prontuariosFiltrados.map(p => (
                    <tr key={p.id} className="hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium text-gray-800">{p.nome}</td>
                      <td className="py-3 px-4 text-gray-600"><div>{p.telefone || 'S/ Tel'}</div><div className="text-xs text-gray-400">{p.email}</div></td>
                      <td className="py-3 px-4">
                        {p.comorbidades ? <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-bold truncate max-w-[150px] inline-block">⚠ {p.comorbidades}</span> : <span className="text-gray-400 text-xs">Nenhum</span>}
                      </td>
                      <td className="py-3 px-4 flex justify-center gap-2">
                        <button onClick={() => abrirDossie(p.id)} className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded hover:bg-indigo-200 text-xs font-medium">Ver Dossiê</button>
                        <button onClick={() => abrirModalEditar(p)} className="bg-gray-100 text-gray-700 px-3 py-1 rounded hover:bg-gray-200 text-xs font-medium">Editar Ficha</button>
                        <button onClick={() => excluirProntuario(p.id)} className="bg-red-50 text-red-600 px-3 py-1 rounded hover:bg-red-100 text-xs font-medium">Excluir</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* MODAL 1: FORMULÁRIO DE EDIÇÃO */}
      {modalEdicaoAberto && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl overflow-hidden flex flex-col max-h-[95vh]">
            <div className="p-4 border-b flex justify-between items-center bg-gray-50">
              <h2 className="text-lg font-bold text-gray-700">{formData.id ? 'Atualizar Ficha Clínica' : 'Nova Ficha Clínica'}</h2>
              <button onClick={() => setModalEdicaoAberto(false)} className="text-gray-500 hover:text-red-500 font-bold text-xl">&times;</button>
            </div>
            
            <form onSubmit={salvarProntuario} className="p-6 flex-grow overflow-y-auto space-y-6">
              <div className="bg-gray-50 p-4 rounded-md border">
                <h3 className="font-semibold text-gray-700 mb-3 border-b pb-1">1. Identificação</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div><label className="block text-xs font-bold text-gray-700 mb-1">Nome Completo *</label><input type="text" required value={formData.nome} onChange={e => setFormData({...formData, nome: e.target.value})} className="w-full border rounded p-2 text-sm" /></div>
                  <div><label className="block text-xs font-bold text-gray-700 mb-1">Telefone</label><input type="text" value={formData.telefone} onChange={e => setFormData({...formData, telefone: e.target.value})} className="w-full border rounded p-2 text-sm" /></div>
                  <div><label className="block text-xs font-bold text-gray-700 mb-1">Email</label><input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full border rounded p-2 text-sm" /></div>
                </div>
              </div>

              <div className="bg-red-50 p-4 rounded-md border border-red-200">
                <h3 className="font-semibold text-red-800 mb-3 border-b border-red-200 pb-1 flex items-center gap-2"><span>⚠</span> 2. Alertas Médicos</h3>
                <input type="text" placeholder="Ex: Diabética, Alergia..." value={formData.comorbidades} onChange={e => setFormData({...formData, comorbidades: e.target.value})} className="w-full border-red-300 rounded p-2 text-sm focus:ring-red-400" />
              </div>

              <div className="bg-blue-50 p-4 rounded-md border border-blue-100">
                <h3 className="font-semibold text-blue-800 mb-3 border-b border-blue-200 pb-1">3. Avaliação e Recursos</h3>
                <input type="text" placeholder="Situação Pele/Corpo..." value={formData.situacao_pele_corpo} onChange={e => setFormData({...formData, situacao_pele_corpo: e.target.value})} className="w-full border-blue-200 rounded p-2 text-sm mb-4" />
                <label className="block text-xs font-bold text-blue-800 mb-2">Máquinas/Produtos (Marcação)</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 bg-white p-3 rounded border border-blue-100">
                  {listaRecursosEsteticos.map(r => (
                    <label key={r} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                      <input type="checkbox" value={r} checked={formData.produtos_maquinas.includes(r)} onChange={handleCheckboxChange} className="h-4 w-4 text-blue-600 rounded" />{r}
                    </label>
                  ))}
                </div>
              </div>

              <div className="bg-white p-4 rounded-md border shadow-sm mt-6">
                <div className="flex justify-between items-center border-b pb-2 mb-4">
                  <h3 className="font-bold text-gray-800 text-lg">4. Linha do Tempo Clínica</h3>
                  <button type="button" onClick={adicionarTratamento} className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm font-bold">+ Adicionar Tratamento</button>
                </div>
                <div className="space-y-6">
                  {formData.historico_tratamentos.map((trat, idx) => (
                    <div key={idx} className="bg-gray-50 border border-indigo-100 rounded-md p-4 relative">
                      <button type="button" onClick={() => removerTratamento(idx)} className="absolute top-2 right-2 text-red-400 hover:text-red-600 font-bold text-sm">&times; Remover Tratamento</button>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 mt-2">
                        <div><label className="block text-xs font-bold text-indigo-800 mb-1">Tratamento *</label><input type="text" required value={trat.nome_tratamento} onChange={(e) => atualizarTratamento(idx, 'nome_tratamento', e.target.value)} className="w-full border rounded p-2 text-sm" /></div>
                        <div><label className="block text-xs font-bold text-indigo-800 mb-1">Sessões Planeadas</label><input type="text" value={trat.quantidade_sessoes} onChange={(e) => atualizarTratamento(idx, 'quantidade_sessoes', e.target.value)} className="w-full border rounded p-2 text-sm" /></div>
                      </div>
                      <div className="ml-4 pl-4 border-l-2 border-indigo-200 space-y-3">
                        <div className="flex justify-between items-center mb-2"><h4 className="text-sm font-bold text-gray-600">Sessões Realizadas</h4><button type="button" onClick={() => adicionarSessao(idx)} className="bg-indigo-100 text-indigo-700 hover:bg-indigo-200 px-2 py-1 rounded text-xs font-bold">+ Nova Sessão</button></div>
                        {trat.sessoes.map((sessao, idxS) => (
                          <div key={idxS} className="bg-white border rounded p-3 flex flex-col md:flex-row gap-3 relative shadow-sm">
                            <div className="w-full md:w-1/4"><label className="block text-xs font-bold text-gray-500 mb-1">Data</label><input type="date" value={sessao.data} onChange={(e) => atualizarSessao(idx, idxS, 'data', e.target.value)} className="w-full border rounded p-1 text-sm" /></div>
                            <div className="w-full md:w-3/4"><label className="block text-xs font-bold text-gray-500 mb-1">Relato</label><textarea rows="2" value={sessao.relato} onChange={(e) => atualizarSessao(idx, idxS, 'relato', e.target.value)} className="w-full border rounded p-1 text-sm"></textarea></div>
                            <button type="button" onClick={() => removerSessao(idx, idxS)} className="text-red-400 hover:text-red-600 font-bold md:mt-5 ml-2">&times;</button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div><label className="block text-sm font-bold text-gray-700 mb-1">5. Anotações Gerais</label><textarea rows="3" value={formData.anotacoes_clinicas} onChange={e => setFormData({...formData, anotacoes_clinicas: e.target.value})} className="w-full border rounded p-2 text-sm"></textarea></div>
              <div className="flex justify-end gap-2 pt-4 border-t"><button type="button" onClick={() => setModalEdicaoAberto(false)} className="px-4 py-2 border rounded">Cancelar</button><button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded font-bold">Salvar</button></div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: DOSSIÊ COMPLETO */}
      {modalDossieAberto && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl overflow-hidden flex flex-col max-h-[95vh]">
            <div className="p-4 border-b flex justify-between items-center bg-indigo-700 text-white"><h2 className="text-lg font-bold">Dossiê Clínico</h2><button onClick={() => setModalDossieAberto(false)} className="text-indigo-200 hover:text-white font-bold text-2xl">&times;</button></div>
            <div className="p-6 flex-grow overflow-y-auto bg-gray-100">
              {loadingDossie ? <div className="text-center py-10">Carregando...</div> : dossieAtual ? (
                <div className="space-y-6">
                  <div className="bg-white p-5 rounded border relative overflow-hidden">
                    {dossieAtual.comorbidades && <div className="absolute top-0 left-0 w-full bg-red-600 text-white text-center py-1 font-bold text-sm">⚠ {dossieAtual.comorbidades}</div>}
                    <div className={dossieAtual.comorbidades ? 'mt-6' : ''}><h3 className="text-2xl font-black text-gray-800">{dossieAtual.nome}</h3><p className="text-sm text-gray-500">{dossieAtual.email} | {dossieAtual.telefone}</p></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 bg-gray-50 p-4 border rounded">
                      <div><strong>Pele/Corpo:</strong> {dossieAtual.situacao_pele_corpo}</div>
                      <div className="col-span-1 md:col-span-2"><strong>Recursos:</strong> {dossieAtual.produtos_maquinas}</div>
                    </div>
                  </div>

                  <div className="bg-white p-5 rounded border">
                    <h4 className="font-bold text-gray-800 border-b pb-2 mb-4">Evolução de Tratamentos</h4>
                    {dossieAtual.historico_tratamentos?.length > 0 ? (
                      <div className="space-y-4">
                        {dossieAtual.historico_tratamentos.map((t, i) => (
                          <div key={i} className="border p-3 bg-indigo-50/30 rounded">
                            <h5 className="font-bold text-indigo-800">{t.nome_tratamento} <span className="text-xs text-gray-500">({t.quantidade_sessoes} planeadas)</span></h5>
                            <div className="mt-2 pl-3 border-l-2 border-indigo-200 space-y-2">
                              {t.sessoes?.map((s, j) => (
                                <div key={j} className="text-sm bg-white p-2 rounded border"><span className="font-semibold text-gray-700">{s.data}:</span> {s.relato}</div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : <p className="text-sm text-gray-500">Sem tratamentos.</p>}
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white p-5 rounded border"><h4 className="font-bold text-gray-800 border-b pb-2 mb-3">Agendamentos</h4>{dossieAtual.agendamentos?.map(ag => <div key={ag.id} className="text-sm border-b py-2">📅 {ag.date} - {ag.time}</div>)}</div>
                    <div className="bg-white p-5 rounded border"><h4 className="font-bold text-gray-800 border-b pb-2 mb-3">Questionários</h4>{dossieAtual.questionarios?.map(q => <div key={q.id} className="text-sm border-b py-2">📝 {q.motivo_consulta}</div>)}</div>
                  </div>
                </div>
              ) : <div className="text-center text-red-500">Erro.</div>}
            </div>
            <div className="p-4 border-t bg-white flex justify-end"><button onClick={() => setModalDossieAberto(false)} className="px-4 py-2 bg-gray-200 rounded">Fechar</button></div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Prontuarios;