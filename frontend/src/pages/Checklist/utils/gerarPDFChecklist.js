// ============================================================
// src/pages/Checklist/utils/gerarPDFChecklist.js
// Geração do PDF do Checklist Diário via html2canvas + jsPDF
// ============================================================

import { CHECKLIST_ITEMS } from '../../../data/checklistItems'

function getJsPDF()      { return window.jspdf?.jsPDF }
function getHtml2Canvas() { return window.html2canvas }

function fmtDate(s) {
  if (!s) return '—'
  const [y, m, d] = s.split('-')
  return `${d}/${m}/${y}`
}

function buildHTML(checklist, empresa) {
  const { respostas = {}, obsItens = {} } = checklist

  // ── Agrupa itens por categoria
  const categorias = [...new Set(CHECKLIST_ITEMS.map(i => i.categoria))]

  const tabelaHTML = categorias.map(cat => {
    const itens = CHECKLIST_ITEMS.filter(i => i.categoria === cat)
    const linhas = itens.map(item => {
      const resp   = respostas[item.id] || '—'
      const obs    = obsItens?.[item.id] || ''
      const isNC   = resp === 'NC'
      const respColor = resp === 'C' ? '#16a34a' : resp === 'NC' ? '#dc2626' : '#6b7f9a'
      const rowBg     = isNC ? 'rgba(220,38,38,0.04)' : 'transparent'
      const borderLeft = item.critico ? '3px solid rgba(220,38,38,0.4)' : '3px solid transparent'

      return `
        <tr style="background:${rowBg}; border-left:${borderLeft};">
          <td style="text-align:center; color:${item.critico ? '#dc2626' : '#6b7f9a'}; font-size:0.72rem; padding:5px 8px; border-bottom:1px solid #dce5f0;">
            ${item.critico ? '⚠' : ''} ${item.id}
          </td>
          <td style="font-size:0.75rem; color:#1c2b45; padding:5px 8px; border-bottom:1px solid #dce5f0; line-height:1.4;">
            ${item.texto}
            ${obs ? `<div style="font-size:0.68rem;color:#dc2626;margin-top:2px;">↳ ${obs}</div>` : ''}
          </td>
          <td style="text-align:center; font-weight:700; font-size:0.78rem; color:${respColor}; padding:5px 8px; border-bottom:1px solid #dce5f0;">${resp}</td>
        </tr>`
    }).join('')

    return `
      <tr>
        <td colspan="3" style="background:#0d1f3c; color:rgba(255,255,255,0.85); font-size:0.65rem; font-weight:700; letter-spacing:0.1em; text-transform:uppercase; padding:6px 10px;">
          ${cat}
        </td>
      </tr>
      ${linhas}`
  }).join('')

  // ── Stats
  const conformes    = checklist.conformes    ?? 0
  const naoConformes = checklist.naoConformes ?? 0
  const naoAplic     = checklist.naoAplicaveis ?? 0

  return `
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: Arial, sans-serif; font-size: 13px; color: #1c2b45; background: #fff; }
    table { border-collapse: collapse; width: 100%; }
  </style>

  <!-- Cabeçalho -->
  <div style="display:flex; align-items:flex-start; justify-content:space-between; padding-bottom:12px; border-bottom:2px solid #0d1f3c; margin-bottom:14px;">
    <div>
      <div style="font-size:1.3rem; font-weight:700; color:#0d1f3c;">Nex<span style="color:#2d6be4;">form</span></div>
      <div style="font-size:0.65rem; color:#6b7f9a;">CNPJ: ${empresa.cnpj || '—'} · Plataforma de Transformação Digital</div>
    </div>
    <div style="text-align:center; flex:1;">
      <div style="font-size:1rem; font-weight:700; color:#0d1f3c;">Checklist Diário — Empilhadeiras</div>
      <div style="font-size:0.65rem; color:#6b7f9a; margin-top:2px;">Documento de inspeção e controle operacional</div>
    </div>
    <div style="text-align:right; font-size:0.65rem; color:#6b7f9a;">
      <span style="display:block; font-size:0.62rem;">Número</span>
      <strong style="font-size:0.95rem; color:#2d6be4;">${checklist.id}</strong>
    </div>
  </div>

  <!-- Identificação -->
  <div style="display:grid; grid-template-columns:repeat(3,1fr); gap:8px; margin-bottom:12px;">
    ${[
      ['Data',        fmtDate(checklist.data)],
      ['Turno',       checklist.turno || '—'],
      ['Hora',        checklist.hora || '—'],
      ['Horímetro',   checklist.horimetro || '—'],
      ['Equipamento', checklist.equipamento || '—'],
      ['Operador',    checklist.operador || '—'],
    ].map(([l, v]) => `
      <div style="background:#f4f7fc; border:1px solid #dce5f0; border-radius:3px; padding:6px 10px;">
        <div style="font-size:0.58rem; text-transform:uppercase; letter-spacing:0.08em; color:#6b7f9a;">${l}</div>
        <div style="font-size:0.82rem; font-weight:600; color:#0d1f3c;">${v}</div>
      </div>`).join('')}
  </div>

  <!-- Resumo de conformidade -->
  <div style="display:grid; grid-template-columns:repeat(3,1fr); gap:8px; margin-bottom:14px;">
    <div style="background:rgba(22,163,74,0.08); border:1px solid rgba(22,163,74,0.25); border-radius:3px; padding:8px 12px; text-align:center;">
      <div style="font-size:1.4rem; font-weight:700; color:#16a34a;">${conformes}</div>
      <div style="font-size:0.65rem; color:#6b7f9a; text-transform:uppercase; letter-spacing:0.08em;">Conformes</div>
    </div>
    <div style="background:rgba(220,38,38,0.08); border:1px solid rgba(220,38,38,0.25); border-radius:3px; padding:8px 12px; text-align:center;">
      <div style="font-size:1.4rem; font-weight:700; color:#dc2626;">${naoConformes}</div>
      <div style="font-size:0.65rem; color:#6b7f9a; text-transform:uppercase; letter-spacing:0.08em;">Não Conformes</div>
    </div>
    <div style="background:rgba(107,127,154,0.08); border:1px solid rgba(107,127,154,0.2); border-radius:3px; padding:8px 12px; text-align:center;">
      <div style="font-size:1.4rem; font-weight:700; color:#6b7f9a;">${naoAplic}</div>
      <div style="font-size:0.65rem; color:#6b7f9a; text-transform:uppercase; letter-spacing:0.08em;">Não Aplicáveis</div>
    </div>
  </div>

  <!-- Tabela de itens -->
  <table>
    <thead>
      <tr style="background:#f4f7fc;">
        <th style="width:52px; text-align:center; font-size:0.65rem; letter-spacing:0.1em; text-transform:uppercase; color:#6b7f9a; padding:6px 8px; border-bottom:1px solid #dce5f0;">#</th>
        <th style="font-size:0.65rem; letter-spacing:0.1em; text-transform:uppercase; color:#6b7f9a; padding:6px 8px; border-bottom:1px solid #dce5f0;">Descrição</th>
        <th style="width:50px; text-align:center; font-size:0.65rem; letter-spacing:0.1em; text-transform:uppercase; color:#6b7f9a; padding:6px 8px; border-bottom:1px solid #dce5f0;">Resp.</th>
      </tr>
    </thead>
    <tbody>${tabelaHTML}</tbody>
  </table>

  <!-- Observações -->
  ${checklist.observacoes ? `
  <div style="margin-top:14px; background:#f4f7fc; border:1px solid #dce5f0; border-radius:3px; padding:10px 12px;">
    <div style="font-size:0.62rem; text-transform:uppercase; letter-spacing:0.1em; color:#6b7f9a; margin-bottom:4px;">Observações</div>
    <div style="font-size:0.8rem; color:#1c2b45; line-height:1.5;">${checklist.observacoes}</div>
  </div>` : ''}

  <!-- Assinaturas -->
  <div style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:14px; margin-top:18px;">
    <div style="border:1px solid #dce5f0; border-radius:3px; padding:10px; min-height:60px; display:flex; flex-direction:column; justify-content:flex-end;">
      <div style="font-size:0.72rem; color:#1c2b45; font-weight:500;">${checklist.operador || '—'}</div>
      <div style="font-size:0.6rem; text-transform:uppercase; letter-spacing:0.08em; color:#6b7f9a; border-top:1px solid #dce5f0; padding-top:4px; margin-top:4px;">Operador / Matrícula</div>
    </div>
    <div style="border:1px solid #dce5f0; border-radius:3px; padding:10px; min-height:60px; display:flex; flex-direction:column; justify-content:flex-end;">
      <div style="font-size:0.72rem; color:#1c2b45; font-weight:500;">${checklist.lider || '—'}</div>
      <div style="font-size:0.6rem; text-transform:uppercase; letter-spacing:0.08em; color:#6b7f9a; border-top:1px solid #dce5f0; padding-top:4px; margin-top:4px;">Líder / Aprovação — ${checklist.dataAprovacao ? fmtDate(checklist.dataAprovacao) : 'Pendente'}</div>
    </div>
    <div style="border:1px solid #dce5f0; border-radius:3px; padding:10px; min-height:60px; display:flex; flex-direction:column; justify-content:flex-end;">
      <div style="font-size:0.6rem; text-transform:uppercase; letter-spacing:0.08em; color:#6b7f9a; border-top:1px solid #dce5f0; padding-top:4px; margin-top:4px;">Nome Colaborador Manutenção / Matrícula</div>
    </div>
  </div>

  <!-- Laudo de liberação (apenas se houver NC) -->
  ${naoConformes > 0 ? `
  <div style="margin-top:12px; border:1px solid #dce5f0; border-radius:3px; padding:10px 12px;">
    <div style="font-size:0.62rem; text-transform:uppercase; letter-spacing:0.1em; color:#6b7f9a; margin-bottom:6px; text-align:center;">Campo destinado à liberação de operação com item "NC"</div>
    <div style="font-size:0.72rem; color:#6b7f9a;">Laudo de liberação:</div>
    <div style="min-height:36px; border-bottom:1px solid #dce5f0; margin-top:4px;"></div>
  </div>` : ''}

  <!-- Rodapé -->
  <div style="margin-top:16px; padding-top:8px; border-top:1px solid #dce5f0; display:flex; justify-content:space-between; font-size:0.6rem; color:#6b7f9a;">
    <span>Nexform · CNPJ ${empresa.cnpj || '—'}</span>
    <span>${checklist.id} · Gerado em ${new Date().toLocaleString('pt-BR')}</span>
    <span>${checklist.status === 'aprovado' ? '✓ Aprovado' : 'Aguardando aprovação'}</span>
  </div>`
}

export async function gerarPDFChecklist(checklist, empresa) {
  const jsPDF       = getJsPDF()
  const html2canvas = getHtml2Canvas()

  if (!jsPDF || !html2canvas) {
    throw new Error('Bibliotecas de PDF não carregadas.')
  }

  const container = document.createElement('div')
  container.style.cssText = 'position:fixed;left:-9999px;top:0;width:794px;background:#fff;padding:32px 40px;'
  container.innerHTML = buildHTML(checklist, empresa)
  document.body.appendChild(container)

  await new Promise(r => setTimeout(r, 300))

  try {
    const canvas = await html2canvas(container, {
      scale: 2, useCORS: true, backgroundColor: '#ffffff', width: 794, windowWidth: 794,
    })

    const pdf   = new jsPDF({ unit: 'px', format: 'a4', orientation: 'portrait' })
    const pW    = pdf.internal.pageSize.getWidth()
    const pH    = pdf.internal.pageSize.getHeight()
    const ratio = pW / canvas.width
    const imgH  = canvas.height * ratio

    if (imgH <= pH) {
      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, pW, imgH)
    } else {
      let yOffset = 0
      while (yOffset < canvas.height) {
        const sliceH = Math.min(pH / ratio, canvas.height - yOffset)
        const c2 = document.createElement('canvas')
        c2.width = canvas.width; c2.height = sliceH
        c2.getContext('2d').drawImage(canvas, 0, yOffset, canvas.width, sliceH, 0, 0, canvas.width, sliceH)
        if (yOffset > 0) pdf.addPage()
        pdf.addImage(c2.toDataURL('image/png'), 'PNG', 0, 0, pW, sliceH * ratio)
        yOffset += sliceH
      }
    }

    pdf.save(`${checklist.id}.pdf`)
  } finally {
    document.body.removeChild(container)
  }
}
