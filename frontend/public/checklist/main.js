// ── CI Number
function genCINumber() {
  const y = new Date().getFullYear();
  const n = String(Math.floor(Math.random() * 9000) + 1000);
  return `CI-${y}-${n}`;
}
let currentCI = genCINumber();
document.getElementById('ci-num').textContent = currentCI;

// ── Tipo de Inspeção
let selectedTipo = '';
function selectTipo(btn) {
  document.querySelectorAll('.tipo-btn').forEach(b => { b.className = 'tipo-btn'; });
  selectedTipo = btn.dataset.tipo;
  btn.classList.add('active-' + selectedTipo.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/\s+/g, '-'));
}

// ── Resultado
let selectedResultado = '';
function selectResultado(btn) {
  document.querySelectorAll('.resultado-btn').forEach(b => { b.className = 'resultado-btn'; });
  selectedResultado = btn.dataset.resultado;
  btn.classList.add('active-' + selectedResultado.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/\s+/g, '-'));
}

// ── Checkboxes
function toggleCheck(el) {
  el.classList.toggle('checked');
  el.querySelector('.check-box').innerHTML = el.classList.contains('checked') ? '✓' : '';
}

// ── Clear form
function clearForm() {
  if (!confirm('Limpar todos os campos?')) return;
  document.querySelectorAll('input, select, textarea').forEach(el => el.value = '');
  document.getElementById('inspetor').value = 'Carlos Eduardo Mendes';
  document.getElementById('data-inspecao').valueAsDate = new Date();
  document.querySelectorAll('.check-item').forEach(el => {
    el.classList.remove('checked');
    el.querySelector('.check-box').innerHTML = '';
  });
  document.querySelectorAll('.tipo-btn').forEach(b => b.className = 'tipo-btn');
  document.querySelectorAll('.resultado-btn').forEach(b => b.className = 'resultado-btn');
  selectedTipo = '';
  selectedResultado = '';
  currentCI = genCINumber();
  document.getElementById('ci-num').textContent = currentCI;
}

// ── Collect data
function collectData() {
  const collectGroup = id => [...document.querySelectorAll(`#${id} .check-item`)].map(el => ({
    label: el.textContent.trim(), checked: el.classList.contains('checked'),
  }));
  return {
    ci:               currentCI,
    inspetor:         document.getElementById('inspetor').value || '—',
    matricula:        document.getElementById('matricula').value || '—',
    dataInspecao:     document.getElementById('data-inspecao').value || '—',
    setor:            document.getElementById('setor').value || '—',
    turno:            document.getElementById('turno').value || '—',
    empresa:          document.getElementById('empresa').value || '—',
    equipamento:      document.getElementById('equipamento').value || '—',
    tag:              document.getElementById('tag').value || '—',
    local:            document.getElementById('local').value || '—',
    planta:           document.getElementById('planta').value || '—',
    tipo:             selectedTipo || '—',
    grupoSeguranca:   collectGroup('grupo-seguranca'),
    grupoProtecao:    collectGroup('grupo-protecao'),
    grupoDocumentacao:collectGroup('grupo-documentacao'),
    grupoOperacional: collectGroup('grupo-operacional'),
    naoConformidades: document.getElementById('nao-conformidades').value || '—',
    acoesCorretivas:  document.getElementById('acoes-corretivas').value || '—',
    resultado:        selectedResultado || '—',
    supervisor:       document.getElementById('supervisor').value || '—',
    matriculaSup:     document.getElementById('matricula-supervisor').value || '—',
    emitidoEm:        new Date().toLocaleString('pt-BR'),
  };
}

// ── Validate
function validate(d) {
  const missing = [];
  if (!d.inspetor     || d.inspetor === '—')     missing.push('Inspetor Responsável');
  if (!d.dataInspecao || d.dataInspecao === '—') missing.push('Data da Inspeção');
  if (!d.setor        || d.setor === '—')        missing.push('Setor / Área');
  if (!d.equipamento  || d.equipamento === '—')  missing.push('Equipamento / Sistema');
  if (!d.tipo         || d.tipo === '—')         missing.push('Tipo de Inspeção');
  if (!d.resultado    || d.resultado === '—')    missing.push('Resultado da Inspeção');
  return missing;
}

// ── Build checklist HTML for PDF
function buildCheckGroup(items) {
  return items.map(r => `
    <div class="pdf-check-item">
      <div class="dot ${r.checked ? '' : 'off'}">${r.checked ? '✓' : ''}</div>
      <span>${r.label}</span>
    </div>`).join('');
}

// ── Build PDF HTML
function buildPDFHTML(d) {
  const tipoKey = d.tipo.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/\s+/g, '-');
  const resKey  = d.resultado.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/\s+/g, '-');
  const fmtDate = s => { if (!s || s === '—') return '—'; const [y,m,day] = s.split('-'); return `${day}/${m}/${y}`; };

  return `
  <div class="pdf-header">
    <div class="pdf-logo">Nex<span>form</span></div>
    <div class="pdf-title-block"><h1>Checklist de Inspeção</h1><p>Relatório de verificação de segurança e conformidade</p></div>
    <div class="pdf-num"><span>Número</span><strong>${d.ci}</strong><span>Emitido em: ${d.emitidoEm}</span></div>
  </div>

  <div class="pdf-section">
    <div class="pdf-section-title">1. Identificação</div>
    <div class="pdf-grid-3">
      <div class="pdf-field"><label>Inspetor</label><p>${d.inspetor}</p></div>
      <div class="pdf-field"><label>Matrícula</label><p>${d.matricula}</p></div>
      <div class="pdf-field"><label>Data da Inspeção</label><p>${fmtDate(d.dataInspecao)}</p></div>
      <div class="pdf-field"><label>Setor / Área</label><p>${d.setor}</p></div>
      <div class="pdf-field"><label>Turno</label><p>${d.turno}</p></div>
      <div class="pdf-field"><label>Empresa / Contratada</label><p>${d.empresa}</p></div>
    </div>
  </div>

  <div class="pdf-section">
    <div class="pdf-section-title">2. Equipamento / Local</div>
    <div class="pdf-grid-2">
      <div class="pdf-field"><label>Equipamento / Sistema</label><p>${d.equipamento}</p></div>
      <div class="pdf-field"><label>Tag / Patrimônio</label><p>${d.tag}</p></div>
      <div class="pdf-field"><label>Local Específico</label><p>${d.local}</p></div>
      <div class="pdf-field"><label>Planta / Unidade</label><p>${d.planta}</p></div>
    </div>
  </div>

  <div class="pdf-section">
    <div class="pdf-section-title">3. Tipo de Inspeção</div>
    <span class="pdf-badge tipo-${tipoKey}">${d.tipo}</span>
  </div>

  <div class="pdf-section">
    <div class="pdf-section-title">4. Itens de Verificação</div>
    <div class="pdf-group-label">Segurança Física</div>
    <div class="pdf-checklist">${buildCheckGroup(d.grupoSeguranca)}</div>
    <div class="pdf-group-label">Equipamentos de Proteção</div>
    <div class="pdf-checklist">${buildCheckGroup(d.grupoProtecao)}</div>
    <div class="pdf-group-label">Documentação e Registros</div>
    <div class="pdf-checklist">${buildCheckGroup(d.grupoDocumentacao)}</div>
    <div class="pdf-group-label">Condições Operacionais</div>
    <div class="pdf-checklist">${buildCheckGroup(d.grupoOperacional)}</div>
  </div>

  ${d.naoConformidades !== '—' ? `<div class="pdf-section">
    <div class="pdf-section-title">5. Não Conformidades</div>
    <div class="pdf-obs-box">${d.naoConformidades}</div>
    ${d.acoesCorretivas !== '—' ? `<div style="margin-top:8px;"><div style="font-size:0.62rem;letter-spacing:0.08em;text-transform:uppercase;color:#6b7f9a;margin-bottom:4px;">Ações Corretivas</div><div class="pdf-obs-box">${d.acoesCorretivas}</div></div>` : ''}
  </div>` : ''}

  <div class="pdf-section">
    <div class="pdf-section-title">6. Resultado da Inspeção</div>
    <span class="pdf-badge res-${resKey}">${d.resultado}</span>
  </div>

  <div class="pdf-section">
    <div class="pdf-section-title">7. Responsabilidade</div>
    <div class="pdf-grid-2" style="margin-bottom:12px;">
      <div class="pdf-field"><label>Supervisor</label><p>${d.supervisor}</p></div>
      <div class="pdf-field"><label>Matrícula do Supervisor</label><p>${d.matriculaSup}</p></div>
    </div>
    <div class="pdf-sig-grid">
      <div class="pdf-sig-box"><div class="pdf-sig-label">Assinatura — Inspetor Responsável</div></div>
      <div class="pdf-sig-box"><div class="pdf-sig-label">Assinatura — Supervisor / Aprovador</div></div>
    </div>
  </div>

  <div class="pdf-footer">
    <span>Nexform · Sistema de Checklist de Inspeção</span>
    <span>${d.ci} · ${d.emitidoEm}</span>
    <span>Este documento tem validade somente com assinaturas</span>
  </div>`;
}

// ── Generate PDF
async function generatePDF() {
  const d = collectData();
  const missing = validate(d);
  if (missing.length) { showErrorModal(missing); return; }

  const btn = document.querySelector('.btn-primary');
  btn.innerHTML = '<i class="bi bi-hourglass-split"></i> Gerando PDF...';
  btn.disabled = true;

  const tpl = document.getElementById('pdf-template');
  tpl.innerHTML = buildPDFHTML(d);
  await new Promise(r => setTimeout(r, 300));

  try {
    const canvas = await html2canvas(tpl, { scale: 2, useCORS: true, backgroundColor: '#ffffff', width: 794, windowWidth: 794 });
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF({ unit: 'px', format: 'a4', orientation: 'portrait' });
    const pW = pdf.internal.pageSize.getWidth();
    const pH = pdf.internal.pageSize.getHeight();
    const ratio = pW / canvas.width;
    const imgH = canvas.height * ratio;

    if (imgH <= pH) {
      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, pW, imgH);
    } else {
      let yOffset = 0;
      while (yOffset < canvas.height) {
        const sliceH = Math.min(pH / ratio, canvas.height - yOffset);
        const c2 = document.createElement('canvas');
        c2.width = canvas.width; c2.height = sliceH;
        c2.getContext('2d').drawImage(canvas, 0, yOffset, canvas.width, sliceH, 0, 0, canvas.width, sliceH);
        if (yOffset > 0) pdf.addPage();
        pdf.addImage(c2.toDataURL('image/png'), 'PNG', 0, 0, pW, sliceH * ratio);
        yOffset += sliceH;
      }
    }

    pdf.save(`${d.ci}.pdf`);
    tpl.innerHTML = '';
    document.getElementById('modal-ci-num').textContent = d.ci;
    document.getElementById('success-overlay').classList.add('open');
  } catch (err) {
    showErrorModal(['Erro ao gerar PDF. Tente novamente.']);
    console.error(err);
  }

  btn.innerHTML = '<i class="bi bi-file-earmark-pdf"></i> Gerar Relatório de Inspeção';
  btn.disabled = false;
}

function closeModal() {
  document.getElementById('success-overlay').classList.remove('open');
  currentCI = genCINumber();
  document.getElementById('ci-num').textContent = currentCI;
}
function showErrorModal(missing) {
  document.getElementById('modal-missing-list').innerHTML = missing.map(m => `<li>${m}</li>`).join('');
  document.getElementById('error-overlay').classList.add('open');
}
function closeErrorModal() { document.getElementById('error-overlay').classList.remove('open'); }

document.getElementById('data-inspecao').valueAsDate = new Date();
