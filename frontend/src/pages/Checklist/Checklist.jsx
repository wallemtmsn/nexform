// ============================================================
// src/pages/Checklist/Checklist.jsx
// Sistema de Checklist Diário de Empilhadeira
// ============================================================

import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import TopbarChecklist from './components/TopbarChecklist'
import FormChecklist from './components/FormChecklist'
import DashboardChecklist from './components/DashboardChecklist'
import Notificacoes from '../PT/components/Notificacoes'
import './Checklist.css'

// ── Dados de exemplo para demonstração
const CHECKLISTS_INICIAIS = [
  {
    id: 'CK-2026-0001',
    data: '2026-03-18',
    turno: 'Turno A (06h–14h)',
    hora: '06:15',
    horimetro: '1250',
    equipamento: 'EMP-01',
    operador: 'João Ferreira',
    totalItens: 47,
    conformes: 44,
    naoConformes: 2,
    naoAplicaveis: 1,
    status: 'aguardando',   // 'aguardando' | 'aprovado' | 'reprovado'
    lider: null,
    dataAprovacao: null,
    observacoes: 'Item 20: Nível de combustível abaixo de 25%. Item 32: Folga no freio de serviço.',
  },
  {
    id: 'CK-2026-0002',
    data: '2026-03-17',
    turno: 'Turno B (14h–22h)',
    hora: '14:10',
    horimetro: '1238',
    equipamento: 'EMP-02',
    operador: 'Maria Santos',
    totalItens: 47,
    conformes: 47,
    naoConformes: 0,
    naoAplicaveis: 0,
    status: 'aprovado',
    lider: 'Carlos Eduardo',
    dataAprovacao: '2026-03-17',
    observacoes: '',
  },
  {
    id: 'CK-2026-0003',
    data: '2026-03-16',
    turno: 'Turno A (06h–14h)',
    hora: '06:05',
    horimetro: '1220',
    equipamento: 'EMP-01',
    operador: 'João Ferreira',
    totalItens: 47,
    conformes: 43,
    naoConformes: 3,
    naoAplicaveis: 1,
    status: 'aprovado',
    lider: 'Carlos Eduardo',
    dataAprovacao: '2026-03-16',
    observacoes: 'Itens críticos verificados e corrigidos antes da operação.',
  },
]

export default function Checklist() {
  const navigate             = useNavigate()
  const { usuario, empresa } = useAuth()
  const [aba, setAba]        = useState('dashboard')
  const [store, setStore]    = useState(CHECKLISTS_INICIAIS)
  const [notifs, setNotifs]  = useState([])

  if (!usuario || !empresa) {
    navigate('/')
    return null
  }

  // ── Salva novo checklist após preenchimento
  function salvarChecklist(dados) {
    const novo = {
      id: `CK-2026-${String(store.length + 1).padStart(4, '0')}`,
      ...dados,
      operador: usuario.nome,
      status: 'aguardando',
      lider: null,
      dataAprovacao: null,
    }
    setStore(prev => [novo, ...prev])
    setAba('dashboard')

    // Notificação para o líder se for perfil lider
    if (usuario.perfil === 'lider') {
      setNotifs([{ tipo: 'info', msg: 'Checklist salvo com sucesso!', sub: `${novo.id} · ${novo.equipamento}` }])
    } else {
      setNotifs([{ tipo: 'info', msg: 'Checklist enviado para aprovação!', sub: `Aguardando validação do líder` }])
    }
  }

  // ── Líder aprova checklist
  function aprovarChecklist(id) {
    setStore(prev => prev.map(c =>
      c.id === id
        ? { ...c, status: 'aprovado', lider: usuario.nome, dataAprovacao: new Date().toISOString().split('T')[0] }
        : c
    ))
    setNotifs([{ tipo: 'info', msg: 'Checklist aprovado!', sub: `${id} · Assinado por ${usuario.nome}` }])
  }

  // ── Conta pendentes para badge
  const qtdPendentes = useMemo(() =>
    store.filter(c => c.status === 'aguardando').length,
    [store]
  )

  return (
    <div className="checklist-screen">
      <TopbarChecklist
        aba={aba}
        onTrocarAba={setAba}
        qtdPendentes={qtdPendentes}
        usuario={usuario}
        empresa={empresa}
        onVoltar={() => navigate('/dashboard')}
      />

      <Notificacoes
        notifs={notifs}
        onDismiss={id => setNotifs(prev => prev.filter((_, i) => i !== id))}
      />

      {aba === 'form'
        ? <FormChecklist usuario={usuario} empresa={empresa} onSalvar={salvarChecklist} />
        : <DashboardChecklist
            store={store}
            usuario={usuario}
            empresa={empresa}
            onAprovar={aprovarChecklist}
            onNovoChecklist={() => setAba('form')}
          />
      }
    </div>
  )
}
