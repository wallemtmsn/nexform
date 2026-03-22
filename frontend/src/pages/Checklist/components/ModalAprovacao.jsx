// ============================================================
// src/pages/Checklist/components/ModalAprovacao.jsx
// Modal de aprovação do líder — confirma identidade e assina
// ============================================================

import { useState } from 'react'
import './ModalAprovacao.css'

function fmtDate(s) {
  if (!s) return '—'
  const [y, m, d] = s.split('-')
  return `${d}/${m}/${y}`
}

export default function ModalAprovacao({ checklist, usuario, onConfirmar, onCancelar }) {
  const [confirmado, setConfirmado] = useState(false)
  const [senha, setSenha]           = useState('')
  const [erro, setErro]             = useState('')

  function handleConfirmar() {
    if (!confirmado) {
      setErro('Confirme que revisou o checklist antes de assinar.')
      return
    }
    if (!senha) {
      setErro('Digite sua senha para confirmar a assinatura.')
      return
    }
    // Validação simples — substituir por API real no futuro
    if (senha !== 'nexforms123') {
      setErro('Senha incorreta. Tente novamente.')
      setSenha('')
      return
    }
    onConfirmar()
  }

  return (
    <div className="modal-ap-overlay" onClick={e => e.target === e.currentTarget && onCancelar()}>
      <div className="modal-ap-box">

        {/* Header */}
        <div className="modal-ap-header">
          <div className="modal-ap-icon">
            <i className="bi bi-shield-check" />
          </div>
          <div>
            <h3>Aprovação de Checklist</h3>
            <p>Revise os dados e confirme sua identidade para assinar digitalmente.</p>
          </div>
        </div>

        {/* Resumo do checklist */}
        <div className="modal-ap-resumo">
          <div className="modal-ap-resumo-row">
            <span>ID</span><strong>{checklist.id}</strong>
          </div>
          <div className="modal-ap-resumo-row">
            <span>Data</span><strong>{fmtDate(checklist.data)} · {checklist.turno}</strong>
          </div>
          <div className="modal-ap-resumo-row">
            <span>Operador</span><strong>{checklist.operador}</strong>
          </div>
          <div className="modal-ap-resumo-row">
            <span>Equipamento</span><strong>{checklist.equipamento}</strong>
          </div>
          <div className="modal-ap-resumo-row">
            <span>Itens C / NA</span>
            <strong>{checklist.conformes} conformes · {checklist.naoAplicaveis} N/A</strong>
          </div>
          <div className="modal-ap-resumo-row">
            <span>Itens NC</span>
            <strong className={checklist.naoConformes > 0 ? 'text-red' : 'text-green'}>
              {checklist.naoConformes > 0
                ? `⚠ ${checklist.naoConformes} não conformes`
                : '✓ Nenhum item NC'}
            </strong>
          </div>
          {checklist.observacoes && (
            <div className="modal-ap-obs">
              <span>Observações:</span>
              <p>{checklist.observacoes}</p>
            </div>
          )}
        </div>

        {/* Erro */}
        {erro && (
          <div className="modal-ap-erro">
            <i className="bi bi-exclamation-circle" />
            <span>{erro}</span>
          </div>
        )}

        {/* Confirmação de revisão */}
        <label className="modal-ap-check">
          <input
            type="checkbox"
            checked={confirmado}
            onChange={e => { setConfirmado(e.target.checked); setErro('') }}
          />
          <span>Confirmo que revisei todos os itens deste checklist e estou ciente das condições registradas.</span>
        </label>

        {/* Assinatura por senha */}
        <div className="modal-ap-senha-wrap">
          <label>Confirme sua identidade com sua senha</label>
          <div className="modal-ap-senha-input">
            <i className="bi bi-lock" />
            <input
              type="password"
              placeholder="••••••••"
              value={senha}
              onChange={e => { setSenha(e.target.value); setErro('') }}
              onKeyDown={e => e.key === 'Enter' && handleConfirmar()}
            />
          </div>
          <p className="modal-ap-assinante">
            <i className="bi bi-person-check" />
            Assinado por: <strong>{usuario.nome}</strong> · {usuario.cargo}
            {' · '}{new Date().toLocaleDateString('pt-BR')}
          </p>
        </div>

        {/* Ações */}
        <div className="modal-ap-actions">
          <button className="modal-ap-btn-cancel" onClick={onCancelar}>
            Cancelar
          </button>
          <button className="modal-ap-btn-confirm" onClick={handleConfirmar}>
            <i className="bi bi-shield-check" /> Aprovar e Assinar
          </button>
        </div>

      </div>
    </div>
  )
}
