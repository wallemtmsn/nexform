// ============================================================
// src/pages/PT/PT.jsx
// Sistema de Emissão de Permissão de Trabalho — Nexform
// ============================================================

import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import TopbarPT from './components/TopbarPT'
import FormularioPT from './components/FormularioPT'
import DashboardPT from './components/DashboardPT'
import Notificacoes from './components/Notificacoes'
import './PT.css'

// ── Helpers de data
function offsetDate(days) {
  const d = new Date()
  d.setDate(d.getDate() + days)
  return d.toISOString().split('T')[0]
}

function resolveStatus(row) {
  if (row.status === 'encerrada') return 'encerrada'
  const today = new Date(); today.setHours(0,0,0,0)
  const end   = new Date(row.dataFim); end.setHours(0,0,0,0)
  const diff  = Math.ceil((end - today) / 86400000)
  if (diff < 0)  return 'vencida'
  if (diff === 0) return 'vencendo'
  return 'ativa'
}

// ── PTs de exemplo para demonstração
const PTS_INICIAIS = [
  { pt: 'PT-2026-0841', empresa: 'Nexform Demo', responsavel: 'João Ferreira',   tipo: 'Trabalho em Altura (acima de 2 metros)',          local: 'Área Industrial 03',    risco: 'Alto',  dataFim: offsetDate(2),  status: 'ativa' },
  { pt: 'PT-2026-0840', empresa: 'Nexform Demo', responsavel: 'Carla Mendes',    tipo: 'Trabalho a Quente (solda, corte, esmerilhamento)', local: 'Armazém B - Área 4',    risco: 'Alto',  dataFim: offsetDate(0),  status: 'ativa' },
  { pt: 'PT-2026-0839', empresa: 'Nexform Demo', responsavel: 'Roberto Lima',    tipo: 'Espaço Confinado',                                local: 'Tanque T-07',           risco: 'Alto',  dataFim: offsetDate(-1), status: 'vencida' },
  { pt: 'PT-2026-0838', empresa: 'Nexform Demo', responsavel: 'Fernanda Souza',  tipo: 'Içamento e Movimentação de Cargas',               local: 'Pátio Externo Sul',     risco: 'Médio', dataFim: offsetDate(-3), status: 'encerrada' },
  { pt: 'PT-2026-0837', empresa: 'Nexform Demo', responsavel: 'Carlos Eduardo',  tipo: 'Bloqueio e Etiquetagem (LOTO)',                   local: 'Subestação SE-02',      risco: 'Médio', dataFim: offsetDate(1),  status: 'ativa' },
  { pt: 'PT-2026-0836', empresa: 'Nexform Demo', responsavel: 'Marcio Dutra',    tipo: 'Trabalho Elétrico (alta tensão)',                 local: 'Torre de Alta Tensão',  risco: 'Alto',  dataFim: offsetDate(0),  status: 'ativa' },
]

export default function PT() {
  const navigate             = useNavigate()
  const { usuario, empresa } = useAuth()
  const [aba, setAba]        = useState('form')       // 'form' | 'dashboard'
  const [ptStore, setPtStore] = useState(PTS_INICIAIS)
  const [notifs, setNotifs]  = useState([])
  const [notifShown, setNotifShown] = useState(false)

  // Redireciona se não autenticado
  if (!usuario || !empresa) {
    navigate('/')
    return null
  }

  // ── Adiciona PT ao store após geração
  function adicionarPT(dados) {
    const novaPT = {
      pt:          dados.pt,
      empresa:     dados.empresa || empresa.nomeFantasia,
      responsavel: dados.responsavel,
      tipo:        dados.tipoTrabalho,
      local:       dados.local,
      risco:       dados.risco,
      dataFim:     dados.dataFim,
      status:      'ativa',
    }
    setPtStore(prev => [novaPT, ...prev])
  }

  // ── Encerra PT
  function encerrarPT(ptNum) {
    setPtStore(prev =>
      prev.map(r => r.pt === ptNum ? { ...r, status: 'encerrada' } : r)
    )
  }

  // ── Notificações de vencimento (dispara ao trocar para dashboard)
  function verificarVencimentos() {
    if (notifShown) return
    const alertas = []
    ptStore.forEach(r => {
      const st = resolveStatus(r)
      if (st === 'vencendo') alertas.push({ tipo: 'warn',   msg: `PT ${r.pt} vence hoje`, sub: `${r.empresa} · ${r.local}` })
      if (st === 'vencida') {
        const today = new Date(); today.setHours(0,0,0,0)
        const end   = new Date(r.dataFim); end.setHours(0,0,0,0)
        const diff  = Math.ceil((end - today) / 86400000)
        if (diff >= -1) alertas.push({ tipo: 'danger', msg: `PT ${r.pt} está vencida`, sub: `Venceu em ${r.dataFim} · ${r.empresa}` })
      }
    })
    if (alertas.length) {
      setNotifs(alertas)
      setNotifShown(true)
    }
  }

  function trocarAba(novaAba) {
    setAba(novaAba)
    if (novaAba === 'dashboard') verificarVencimentos()
  }

  // Conta alertas para badge
  const qtdAlertas = ptStore.filter(r => {
    const st = resolveStatus(r)
    return st === 'vencendo' || st === 'vencida'
  }).length

  return (
    <div className="pt-screen">
      <TopbarPT
        aba={aba}
        onTrocarAba={trocarAba}
        qtdAlertas={qtdAlertas}
        usuario={usuario}
        empresa={empresa}
        onVoltar={() => navigate('/dashboard')}
      />

      <Notificacoes
        notifs={notifs}
        onDismiss={id => setNotifs(prev => prev.filter((_, i) => i !== id))}
      />

      {aba === 'form'
        ? <FormularioPT empresa={empresa} usuario={usuario} onPTGerada={adicionarPT} />
        : <DashboardPT ptStore={ptStore} empresa={empresa} onEncerrar={encerrarPT} onNovaPT={() => setAba('form')} />
      }
    </div>
  )
}
