// ============================================================
// src/pages/PT/utils/gerarPDF.js
// Geração do PDF da Permissão de Trabalho via html2canvas + jsPDF
// ============================================================

// Aguarda as libs carregadas via CDN no index.html
function getJsPDF() {
  return window.jspdf?.jsPDF
}
function getHtml2Canvas() {
  return window.html2canvas
}

function fmtDate(s) {
  if (!s || s === '—') return '—'
  const [y, m, d] = s.split('-')
  return `${d}/${m}/${y}`
}

function buildPDFHTML(d, empresa) {
  const riskClass = d.risco === 'Alto' ? 'risk-alto' : d.risco === 'Médio' ? 'risk-medio' : 'risk-baixo'

  const riscosHtml = d.riscos.map(r => `
    <div class="pdf-check-item">
      <div class="dot">✓</div><span>${r}</span>
    </div>`).join('')

  const medidasHtml = d.medidas.map(m => `
    <div class="pdf-check-item">
      <div class="dot">✓</div><span>${m}</span>
    </div>`).join('')

  const episHtml = d.epis.length
    ? d.epis.map(e => `<span class="pdf-epi-tag">${e}</span>`).join('')
    : '<span style="font-size:0.78rem;color:#6b7f9a;">Nenhum EPI selecionado</span>'

  return `
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: Arial, sans-serif; font-size: 13px; color: #1c2b45; background: #fff; }
    .pdf-header { display: flex; align-items: flex-start; justify-content: space-between; padding-bottom: 14px; border-bottom: 2px solid #0d1f3c; margin-bottom: 18px; }
    .pdf-logo { font-size: 1.3rem; font-weight: 700; color: #0d1f3c; }
    .pdf-logo span { color: #2d6be4; }
    .pdf-title-block { text-align: center; flex: 1; }
    .pdf-title-block h1 { font-size: 1.1rem; color: #0d1f3c; }
    .pdf-title-block p  { font-size: 0.68rem; color: #6b7f9a; margin-top: 2px; }
    .pdf-num { text-align: right; font-size: 0.68rem; color: #6b7f9a; }
    .pdf-num strong { display: block; font-size: 0.95rem; color: #2d6be4; font-weight: 700; }
    .pdf-section { margin-bottom: 16px; }
    .pdf-section-title { font-size: 0.62rem; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: #2d6be4; border-bottom: 1px solid #dce5f0; padding-bottom: 4px; margin-bottom: 10px; }
    .pdf-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 7px 18px; }
    .pdf-grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 7px 18px; }
    .pdf-field label { display: block; font-size: 0.6rem; letter-spacing: 0.08em; text-transform: uppercase; color: #6b7f9a; margin-bottom: 2px; }
    .pdf-field p { font-size: 0.8rem; color: #1c2b45; font-weight: 500; padding: 4px 7px; background: #f4f7fc; border-radius: 2px; min-height: 24px; }
    .pdf-risk-badge { display: inline-block; padding: 3px 12px; border-radius: 2px; font-size: 0.75rem; font-weight: 700; }
    .risk-baixo { background: rgba(22,163,74,0.1); color: #16a34a; }
    .risk-medio { background: rgba(217,119,6,0.1); color: #d97706; }
    .risk-alto  { background: rgba(220,38,38,0.1); color: #dc2626; }
    .pdf-checklist { display: grid; grid-template-columns: 1fr 1fr; gap: 3px; }
    .pdf-check-item { display: flex; align-items: center; gap: 5px; font-size: 0.75rem; color: #1c2b45; padding: 2px 0; }
    .pdf-check-item .dot { width: 13px; height: 13px; border-radius: 2px; background: #2d6be4; display: flex; align-items: center; justify-content: center; color: #fff; font-size: 0.55rem; flex-shrink: 0; }
    .pdf-epi-list { display: flex; flex-wrap: wrap; gap: 5px; }
    .pdf-epi-tag { font-size: 0.7rem; padding: 2px 9px; background: rgba(45,107,228,0.08); border: 1px solid rgba(45,107,228,0.2); border-radius: 2px; color: #1a3d6e; }
    .pdf-sig-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; margin-top: 6px; }
    .pdf-sig-box { border: 1px solid #dce5f0; border-radius: 3px; min-height: 58px; padding: 7px; display: flex; flex-direction: column; justify-content: flex-end; }
    .pdf-sig-label { font-size: 0.6rem; letter-spacing: 0.08em; text-transform: uppercase; color: #6b7f9a; border-top: 1px solid #dce5f0; padding-top: 4px; margin-top: 5px; }
    .pdf-footer { margin-top: 18px; padding-top: 10px; border-top: 1px solid #dce5f0; display: flex; justify-content: space-between; font-size: 0.6rem; color: #6b7f9a; }
    .pdf-cnpj { font-size: 0.6rem; color: #6b7f9a; margin-top: 2px; }
  </style>

  <div class="pdf-header">
    <div>
      <div class="pdf-logo">Nex<span>form</span></div>
      <div class="pdf-cnpj">CNPJ: ${empresa.cnpj || '—'}</div>
      <div style="font-size:0.58rem;color:#6b7f9a;margin-top:2px;">Plataforma de Transformação Digital</div>
    </div>
    <div class="pdf-title-block">
      <h1>Permissão de Trabalho</h1>
      <p>Documento de controle de atividades de risco</p>
    </div>
    <div class="pdf-num">
      <span>Número</span>
      <strong>${d.pt}</strong>
      <span>Emitido em: ${d.emitidoEm}</span>
    </div>
  </div>

  <div class="pdf-section">
    <div class="pdf-section-title">1. Identificação</div>
    <div class="pdf-grid-2">
      <div class="pdf-field"><label>Empresa Solicitante</label><p>${d.empresa || '—'}</p></div>
      <div class="pdf-field"><label>CNPJ / CPF</label><p>${d.cnpj || '—'}</p></div>
      <div class="pdf-field"><label>Responsável pelo Serviço</label><p>${d.responsavel || '—'}</p></div>
      <div class="pdf-field"><label>Cargo / Função</label><p>${d.cargo || '—'}</p></div>
      <div class="pdf-field"><label>Local / Área de Trabalho</label><p>${d.local || '—'}</p></div>
      <div class="pdf-field"><label>Setor / Planta</label><p>${d.setor || '—'}</p></div>
    </div>
  </div>

  <div class="pdf-section">
    <div class="pdf-section-title">2. Período e Tipo de Serviço</div>
    <div class="pdf-grid-3" style="margin-bottom:7px;">
      <div class="pdf-field"><label>Data de Início</label><p>${fmtDate(d.dataInicio)}</p></div>
      <div class="pdf-field"><label>Data de Término</label><p>${fmtDate(d.dataFim)}</p></div>
      <div class="pdf-field"><label>Turno</label><p>${d.turno || '—'}</p></div>
    </div>
    <div class="pdf-field" style="margin-bottom:7px;"><label>Tipo de Trabalho</label><p>${d.tipoTrabalho}</p></div>
    <div class="pdf-field"><label>Descrição Detalhada</label><p>${d.descricao}</p></div>
  </div>

  <div class="pdf-section">
    <div class="pdf-section-title">3. Nível de Risco</div>
    <span class="pdf-risk-badge ${riskClass}">${d.risco}</span>
  </div>

  <div class="pdf-section">
    <div class="pdf-section-title">4. Análise Preliminar de Riscos</div>
    <div class="pdf-checklist">${riscosHtml || '<span style="font-size:0.75rem;color:#6b7f9a;">Nenhum risco marcado</span>'}</div>
  </div>

  <div class="pdf-section">
    <div class="pdf-section-title">5. EPIs Obrigatórios</div>
    <div class="pdf-epi-list">${episHtml}</div>
  </div>

  <div class="pdf-section">
    <div class="pdf-section-title">6. Medidas de Controle</div>
    <div class="pdf-checklist">${medidasHtml || '<span style="font-size:0.75rem;color:#6b7f9a;">Nenhuma medida marcada</span>'}</div>
    ${d.observacoes ? `<div style="margin-top:7px;"><div style="font-size:0.6rem;letter-spacing:0.08em;text-transform:uppercase;color:#6b7f9a;margin-bottom:3px;">Observações</div><div style="background:#f4f7fc;border-radius:2px;padding:7px 9px;font-size:0.8rem;color:#1c2b45;">${d.observacoes}</div></div>` : ''}
  </div>

  <div class="pdf-section">
    <div class="pdf-section-title">7. Responsabilidade</div>
    <div class="pdf-grid-2" style="margin-bottom:10px;">
      <div class="pdf-field"><label>Técnico de Segurança</label><p>${d.tecnico || '—'}</p></div>
      <div class="pdf-field"><label>Matrícula / Registro</label><p>${d.registro || '—'}</p></div>
    </div>
    <div class="pdf-sig-grid">
      <div class="pdf-sig-box"><div class="pdf-sig-label">Assinatura — Técnico de Segurança</div></div>
      <div class="pdf-sig-box"><div class="pdf-sig-label">Assinatura — Responsável pelo Serviço</div></div>
    </div>
  </div>

  <div class="pdf-footer">
    <span>NEXFORMS · CNPJ ${empresa.cnpj || '—'} · Plataforma de Transformação Digital</span>
    <span>${d.pt} · ${d.emitidoEm}</span>
    <span>Válido somente com assinaturas</span>
  </div>`
}

export async function gerarPDF(dados, empresa) {
  const jsPDF      = getJsPDF()
  const html2canvas = getHtml2Canvas()

  if (!jsPDF || !html2canvas) {
    throw new Error('Bibliotecas de PDF não carregadas.')
  }

  // Cria container oculto
  const container = document.createElement('div')
  container.style.cssText = 'position:fixed;left:-9999px;top:0;width:794px;background:#fff;padding:36px 44px;'
  container.innerHTML = buildPDFHTML(dados, empresa)
  document.body.appendChild(container)

  await new Promise(r => setTimeout(r, 300))

  try {
    const canvas = await html2canvas(container, {
      scale: 2, useCORS: true, backgroundColor: '#ffffff', width: 794, windowWidth: 794,
    })

    const pdf = new jsPDF({ unit: 'px', format: 'a4', orientation: 'portrait' })
    const pW  = pdf.internal.pageSize.getWidth()
    const pH  = pdf.internal.pageSize.getHeight()
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

    pdf.save(`${dados.pt}.pdf`)
  } finally {
    document.body.removeChild(container)
  }
}
