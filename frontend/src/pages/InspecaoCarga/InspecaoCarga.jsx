// ============================================================
// src/pages/InspecaoCarga/InspecaoCarga.jsx
// Sistema de Checklist de Inspeção de Carga — NEXFORMS
// ============================================================

import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import TopbarIC from './components/TopbarIC'
import FormIC from './components/FormIC'
import DashboardIC from './components/DashboardIC'
import Notificacoes from '../PT/components/Notificacoes'
import './InspecaoCarga.css'

const IC_INICIAIS = [
  {
    id: 'IC-2026-0001',
    data: '2026-04-20',
    hora: '08:30',
    cliente: 'Petrobras',
    tipo: 'maritimo',
    embarcacao: 'MV Atlântico',
    manifesto: 'MSL-2026-04-001',
    inspecionadoPor: 'João Ferreira',
    totalItens: 38,
    conformes: 35,
    naoConformes: 1,
    naoAplicaveis: 2,
    status: 'aguardando',
    finalizadoPor: null,
    dataAprovacao: null,
    observacoes: 'Item 1.3: Olhal com leve corrosão na extremidade.',
  },
  {
    id: 'IC-2026-0002',
    data: '2026-04-19',
    hora: '14:15',
    cliente: 'Vale S.A.',
    tipo: 'terrestre',
    motorista: 'Pedro Alves',
    romaneio: 'ROM-2026-1024',
    transportadora: 'TransLog Brasil',
    placa: 'ABC-1D23',
    inspecionadoPor: 'João Ferreira',
    totalItens: 38,
    conformes: 38,
    naoConformes: 0,
    naoAplicaveis: 0,
    status: 'aprovado',
    finalizadoPor: 'Carlos Eduardo',
    dataAprovacao: '2026-04-19',
    observacoes: '',
  },
  {
    id: 'IC-2026-0003',
    data: '2026-04-17',
    hora: '06:45',
    cliente: 'Shell Brasil',
    tipo: 'maritimo',
    embarcacao: 'MV Esperança',
    manifesto: 'MSL-2026-04-003',
    inspecionadoPor: 'João Ferreira',
    totalItens: 38,
    conformes: 32,
    naoConformes: 4,
    naoAplicaveis: 2,
    status: 'reprovado',
    finalizadoPor: 'Carlos Eduardo',
    dataAprovacao: '2026-04-17',
    observacoes: 'Item 4.2: Sem identificação de risco. Item 4.4: Válvula com vazamento. Item 7.6: Faltando CNEN. Item 7.7: FDS não disponível.',
  },
]

export default function InspecaoCarga() {
  const navigate             = useNavigate()
  const { usuario, empresa } = useAuth()
  const [aba, setAba]        = useState('dashboard')
  const [store, setStore]    = useState(IC_INICIAIS)
  const [notifs, setNotifs]  = useState([])

  if (!usuario || !empresa) {
    navigate('/')
    return null
  }

  function salvarInspecao(dados) {
    const novo = {
      id: `IC-${new Date().getFullYear()}-${String(store.length + 1).padStart(4, '0')}`,
      ...dados,
      inspecionadoPor: usuario.nome,
      status: 'aguardando',
      finalizadoPor: null,
      dataAprovacao: null,
    }
    setStore(prev => [novo, ...prev])
    setAba('dashboard')
    setNotifs([{
      tipo: 'info',
      msg: 'Inspeção enviada para aprovação!',
      sub: `${novo.id} · ${novo.cliente}`,
    }])
  }

  function aprovarInspecao(id) {
    setStore(prev => prev.map(r =>
      r.id === id
        ? { ...r, status: 'aprovado', finalizadoPor: usuario.nome, dataAprovacao: new Date().toISOString().split('T')[0] }
        : r
    ))
    setNotifs([{ tipo: 'info', msg: 'Inspeção aprovada!', sub: `${id} · Finalizado por ${usuario.nome}` }])
  }

  function reprovarInspecao(id) {
    setStore(prev => prev.map(r =>
      r.id === id
        ? { ...r, status: 'reprovado', finalizadoPor: usuario.nome, dataAprovacao: new Date().toISOString().split('T')[0] }
        : r
    ))
    setNotifs([{ tipo: 'info', msg: 'Inspeção reprovada.', sub: `${id} · Registrado por ${usuario.nome}` }])
  }

  const qtdPendentes = useMemo(
    () => store.filter(r => r.status === 'aguardando').length,
    [store]
  )

  return (
    <div className="ic-screen">
      <TopbarIC
        aba={aba}
        onTrocarAba={setAba}
        qtdPendentes={qtdPendentes}
        usuario={usuario}
        empresa={empresa}
        onVoltar={() => navigate('/dashboard')}
      />

      <Notificacoes
        notifs={notifs}
        onDismiss={idx => setNotifs(prev => prev.filter((_, i) => i !== idx))}
      />

      {aba === 'form'
        ? <FormIC usuario={usuario} empresa={empresa} onSalvar={salvarInspecao} />
        : <DashboardIC
            store={store}
            usuario={usuario}
            onAprovar={aprovarInspecao}
            onReprovar={reprovarInspecao}
            onNovaInspecao={() => setAba('form')}
          />
      }
    </div>
  )
}
