// ── RNC Number
function genRNCNumber() {
  const y = new Date().getFullYear();
  const n = String(Math.floor(Math.random() * 9000) + 1000);
  return `RNC-${y}-${n}`;
}
let currentRNC = genRNCNumber();
document.getElementById('rnc-num').textContent = currentRNC;

// ── State
let selectedTipoNC       = '';
let selectedOrigem       = '';
let selectedGravidade    = '';
let selectedReincidencia = '';
let selectedContencaoStatus   = '';
let selectedAcaoCorretivaStatus = '';
let selectedAcaoPreventivaStatus = '';
let selectedEficacia     = '';
let selectedStatusFinal  = '';
let selectedFerramenta   = '5-porques';

// ── Generic selector helpers
function clearGroup(selector) {
  document.querySelectorAll(selector).forEach(b => b.className = b.className.replace(/\s*active[\w-]*/g, '').trim());
}

function normalizeKey(s) {
  return s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[\s/()]+/g, '-').replace(/[^a-z0-9-]/g, '');
}

// ── Selectors
function selectTipoNC(btn) {
  clearGroup('.tipo-nc-btn');
  btn.classList.add('active');
  selectedTipoNC = btn.dataset.tipo;
}

function selectOrigem(btn) {
  clearGroup('.origem-btn');
  btn.classList.add('active');
  selectedOrigem = btn.dataset.origem;
}

function selectGravidade(btn) {
  clearGroup('.grav-btn');
  const key = normalizeKey(btn.dataset.grav);
  btn.classList.add('active-' + key);
  selectedGravidade = btn.dataset.grav;
}

function selectReincidencia(btn) {
  clearGroup('.reinc-btn');
  const key = normalizeKey(btn.dataset.reinc);
  btn.classList.add('active-' + key);
  selectedReincidencia = btn.dataset.reinc;
  const wrap = document.getElementById('reinc-ref-wrap');
  wrap.classList.toggle('hidden', btn.dataset.reinc !== 'Sim');
}

function selectContencaoStatus(btn) {
  document.querySelectorAll('.status-group .status-btn').forEach((b, i) => {
    if (b.closest('.card-body') === btn.closest('.card-body')) b.classList.remove('active');
  });
  btn.classList.add('active');
  selectedContencaoStatus = btn.dataset.status;
}

function selectAcaoCorretivaStatus(btn) {
  btn.closest('.btn-group').querySelectorAll('.status-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  selectedAcaoCorretivaStatus = btn.dataset.status;
}

function selectAcaoPreventiva(btn) {
  btn.closest('.btn-group').querySelectorAll('.status-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  selectedAcaoPreventivaStatus = btn.dataset.status;
}

function selectEficacia(btn) {
  clearGroup('.efic-btn');
  const key = normalizeKey(btn.dataset.efic);
  btn.classList.add('active-' + key);
  selectedEficacia = btn.dataset.efic;
}

function selectStatusFinal(btn) {
  clearGroup('.sf-btn');
  const key = normalizeKey(btn.dataset.sf);
  btn.classList.add('active-' + key);
  selectedStatusFinal = btn.dataset.sf;
}

function selectFerramenta(btn) {
  clearGroup('.ferr-btn');
  btn.classList.add('active-ferr');
  selectedFerramenta = btn.dataset.ferr;
  document.getElementById('block-5porques').classList.toggle('hidden', selectedFerramenta !== '5-porques');
  document.getElementById('block-ishikawa').classList.toggle('hidden', selectedFerramenta !== 'ishikawa');
  document.getElementById('block-livre').classList.toggle('hidden', selectedFerramenta !== 'livre');
}

// ── Clear form
function clearForm() {
  if (!confirm('Limpar todos os campos?')) return;
  document.querySelectorAll('input:not([readonly]), select, textarea').forEach(el => el.value = '');
  document.getElementById('aberto-por').value = 'Carlos Eduardo Mendes';
  document.getElementById('data-abertura').valueAsDate = new Date();

  clearGroup('.tipo-nc-btn');   selectedTipoNC = '';
  clearGroup('.origem-btn');    selectedOrigem = '';
  clearGroup('.grav-btn');      selectedGravidade = '';
  clearGroup('.reinc-btn');     selectedReincidencia = '';
  clearGroup('.efic-btn');      selectedEficacia = '';
  clearGroup('.sf-btn');        selectedStatusFinal = '';
  document.querySelectorAll('.status-btn').forEach(b => b.classList.remove('active'));
  selectedContencaoStatus = ''; selectedAcaoCorretivaStatus = ''; selectedAcaoPreventivaStatus = '';
  document.getElementById('reinc-ref-wrap').classList.add('hidden');

  // Reset ferramenta to 5 Porquês
  clearGroup('.ferr-btn');
  document.querySelector('.ferr-btn[data-ferr="5-porques"]').classList.add('active-ferr');
  selectedFerramenta = '5-porques';
  document.getElementById('block-5porques').classList.remove('hidden');
  document.getElementById('block-ishikawa').classList.add('hidden');
  document.getElementById('block-livre').classList.add('hidden');

  currentRNC = genRNCNumber();
  document.getElementById('rnc-num').textContent = currentRNC;
}

// ── Collect data
function collectData() {
  return {
    rnc:               currentRNC,
    abertoPor:         document.getElementById('aberto-por').value.trim() || '—',
    dataAbertura:      document.getElementById('data-abertura').value || '—',
    setor:             document.getElementById('setor').value.trim() || '—',
    turno:             document.getElementById('turno').value || '—',
    empresa:           document.getElementById('empresa').value.trim() || '—',
    tipoNC:            selectedTipoNC || '—',
    origem:            selectedOrigem || '—',
    gravidade:         selectedGravidade || '—',
    reincidencia:      selectedReincidencia || '—',
    rncAnterior:       document.getElementById('rnc-anterior').value.trim() || '—',
    descricao:         document.getElementById('descricao').value.trim() || '—',
    requisito:         document.getElementById('requisito').value.trim() || '—',
    produtoAfetado:    document.getElementById('produto-afetado').value.trim() || '—',
    quantidadeLote:    document.getElementById('quantidade-lote').value.trim() || '—',
    impacto:           document.getElementById('impacto').value.trim() || '—',
    contencao:         document.getElementById('contencao').value.trim() || '—',
    respContencao:     document.getElementById('responsavel-contencao').value.trim() || '—',
    dataContencao:     document.getElementById('data-contencao').value || '—',
    contencaoStatus:   selectedContencaoStatus || '—',
    ferramenta:        selectedFerramenta,
    pq1: document.getElementById('pq1').value.trim() || '—',
    pq2: document.getElementById('pq2').value.trim() || '—',
    pq3: document.getElementById('pq3').value.trim() || '—',
    pq4: document.getElementById('pq4').value.trim() || '—',
    pq5: document.getElementById('pq5').value.trim() || '—',
    ishiMaquina:  document.getElementById('ishi-maquina').value.trim() || '—',
    ishiMetodo:   document.getElementById('ishi-metodo').value.trim() || '—',
    ishiMdo:      document.getElementById('ishi-mdo').value.trim() || '—',
    ishiMaterial: document.getElementById('ishi-material').value.trim() || '—',
    ishiAmbiente: document.getElementById('ishi-ambiente').value.trim() || '—',
    ishiMedicao:  document.getElementById('ishi-medicao').value.trim() || '—',
    causaLivre:        document.getElementById('causa-livre').value.trim() || '—',
    causaRaiz:         document.getElementById('causa-raiz').value.trim() || '—',
    acaoCorretiva:     document.getElementById('acao-corretiva').value.trim() || '—',
    respCorretiva:     document.getElementById('resp-corretiva').value.trim() || '—',
    prazoCorretiva:    document.getElementById('prazo-corretiva').value || '—',
    acaoCorretivaStatus: selectedAcaoCorretivaStatus || '—',
    acaoPreventiva:    document.getElementById('acao-preventiva').value.trim() || '—',
    riscosAtualizados: document.getElementById('riscos-atualizados').value.trim() || '—',
    respPreventiva:    document.getElementById('resp-preventiva').value.trim() || '—',
    prazoPreventiva:   document.getElementById('prazo-preventiva').value || '—',
    acaoPreventivaStatus: selectedAcaoPreventivaStatus || '—',
    dataVerificacao:   document.getElementById('data-verificacao').value || '—',
    verificador:       document.getElementById('verificador').value.trim() || '—',
    evidenciaVerificacao: document.getElementById('evidencia-verificacao').value.trim() || '—',
    eficacia:          selectedEficacia || '—',
    respEncerramento:  document.getElementById('responsavel-encerramento').value.trim() || '—',
    dataEncerramento:  document.getElementById('data-encerramento').value || '—',
    obsFinais:         document.getElementById('obs-finais').value.trim() || '—',
    statusFinal:       selectedStatusFinal || '—',
    emitidoEm:         new Date().toLocaleString('pt-BR'),
  };
}

// ── Validate
function validate(d) {
  const missing = [];
  if (d.abertoPor === '—')      missing.push('Aberto por');
  if (d.setor === '—')          missing.push('Setor / Área');
  if (d.tipoNC === '—')         missing.push('Tipo de Não Conformidade');
  if (d.origem === '—')         missing.push('Origem da Detecção');
  if (d.gravidade === '—')      missing.push('Gravidade');
  if (d.descricao === '—')      missing.push('Descrição da Não Conformidade');
  if (d.contencao === '—')      missing.push('Ação de Contenção');
  if (d.respContencao === '—')  missing.push('Responsável pela Contenção');
  if (d.causaRaiz === '—')      missing.push('Causa Raiz Conclusiva');
  if (d.acaoCorretiva === '—')  missing.push('Descrição da Ação Corretiva');
  if (d.respCorretiva === '—')  missing.push('Responsável pela Ação Corretiva');
  if (d.prazoCorretiva === '—') missing.push('Prazo para Ação Corretiva');
  if (d.respEncerramento === '—') missing.push('Responsável pelo Encerramento');
  return missing;
}

// ── PDF badge HTML
function gravBadge(g) {
  const cls = g === 'Crítica' ? 'badge-critica' : g === 'Maior' ? 'badge-maior' : 'badge-menor';
  return `<span class="pdf-badge ${cls}">${g}</span>`;
}
function statusBadge(s) {
  const map = { 'Aberta': 'badge-aberta', 'Em Andamento': 'badge-andamento', 'Aguardando Verificação': 'badge-aguardando', 'Encerrada': 'badge-encerrada', 'Pendente': 'badge-aberta', 'Executada': 'badge-andamento', 'Verificada': 'badge-encerrada', 'Concluída': 'badge-encerrada' };
  return `<span class="pdf-badge ${map[s] || 'badge-andamento'}">${s}</span>`;
}
function eficBadge(e) {
  const cls = e === 'Sim' ? 'badge-efic-sim' : e === 'Não' ? 'badge-efic-nao' : 'badge-efic-obs';
  return `<span class="pdf-badge ${cls}">${e}</span>`;
}

// ── Build PDF HTML
function buildPDFHTML(d) {
  const fmtDate = s => { if (!s || s === '—') return '—'; const [y,m,day] = s.split('-'); return `${day}/${m}/${y}`; };

  const ferrNome = { '5-porques': '5 Porquês', 'ishikawa': 'Ishikawa (6M)', 'livre': 'Análise Livre' }[d.ferramenta] || d.ferramenta;

  const analiseHtml = (() => {
    if (d.ferramenta === '5-porques') {
      const items = [
        { num: 'Por quê 1', text: d.pq1 },
        { num: 'Por quê 2', text: d.pq2 },
        { num: 'Por quê 3', text: d.pq3 },
        { num: 'Por quê 4', text: d.pq4 },
        { num: 'Por quê 5', text: d.pq5 },
      ].filter(i => i.text && i.text !== '—');
      if (!items.length) return '';
      return `<div class="pdf-porques">${items.map(i => `
        <div class="pdf-porque-item">
          <div class="pdf-porque-num">${i.num}</div>
          <div class="pdf-porque-text">${i.text}</div>
        </div>`).join('')}</div>`;
    }
    if (d.ferramenta === 'ishikawa') {
      const cats = [
        { cat: 'Máquina', text: d.ishiMaquina },
        { cat: 'Método', text: d.ishiMetodo },
        { cat: 'Mão de Obra', text: d.ishiMdo },
        { cat: 'Material', text: d.ishiMaterial },
        { cat: 'Meio Ambiente', text: d.ishiAmbiente },
        { cat: 'Medição', text: d.ishiMedicao },
      ].filter(c => c.text && c.text !== '—');
      if (!cats.length) return '';
      return `<div class="pdf-ishikawa">${cats.map(c => `
        <div class="pdf-ishi-item">
          <div class="pdf-ishi-cat">${c.cat}</div>
          <div class="pdf-ishi-text">${c.text}</div>
        </div>`).join('')}</div>`;
    }
    if (d.ferramenta === 'livre' && d.causaLivre !== '—') {
      return `<div class="pdf-obs-box">${d.causaLivre}</div>`;
    }
    return '';
  })();

  const reincidenciaNote = d.reincidencia === 'Sim' && d.rncAnterior !== '—'
    ? ` · RNC anterior: <strong>${d.rncAnterior}</strong>` : '';

  return `
  <div class="pdf-header">
    <div class="pdf-logo">Nex<span>form</span></div>
    <div class="pdf-title-block">
      <h1>Registro de Não Conformidade</h1>
      <p>Identificação, análise e plano de ação corretiva · ISO 9001:2015 — Cláusula 10.2</p>
    </div>
    <div class="pdf-num">
      <span>Número</span>
      <strong>${d.rnc}</strong>
      <span>Emitido em: ${d.emitidoEm}</span>
    </div>
  </div>

  <div class="pdf-section">
    <div class="pdf-section-title">1. Identificação</div>
    <div class="pdf-grid-3">
      <div class="pdf-field" style="grid-column:span 2;"><label>Aberto por</label><p>${d.abertoPor}</p></div>
      <div class="pdf-field"><label>Data de Abertura</label><p>${fmtDate(d.dataAbertura)}</p></div>
      <div class="pdf-field" style="grid-column:span 2;"><label>Setor / Área</label><p>${d.setor}</p></div>
      <div class="pdf-field"><label>Turno</label><p>${d.turno}</p></div>
      ${d.empresa !== '—' ? `<div class="pdf-field" style="grid-column:1/-1;"><label>Empresa / Fornecedor</label><p>${d.empresa}</p></div>` : ''}
    </div>
  </div>

  <div class="pdf-section">
    <div class="pdf-section-title">2. Classificação</div>
    <div class="pdf-grid-2" style="margin-bottom:8px;">
      <div class="pdf-field"><label>Tipo de NC</label><p>${d.tipoNC}</p></div>
      <div class="pdf-field"><label>Origem da Detecção</label><p>${d.origem}</p></div>
    </div>
    <div style="display:flex;align-items:center;gap:16px;flex-wrap:wrap;">
      <div><div style="font-size:0.6rem;letter-spacing:0.08em;text-transform:uppercase;color:#6b7f9a;margin-bottom:3px;">Gravidade</div>${gravBadge(d.gravidade)}</div>
      <div><div style="font-size:0.6rem;letter-spacing:0.08em;text-transform:uppercase;color:#6b7f9a;margin-bottom:3px;">Reincidência</div><span class="pdf-badge badge-andamento">${d.reincidencia}${reincidenciaNote}</span></div>
    </div>
  </div>

  <div class="pdf-section">
    <div class="pdf-section-title">3. Descrição da Não Conformidade</div>
    <div class="pdf-field-full" style="margin-bottom:7px;"><label>Descrição detalhada</label><div class="pdf-obs-box">${d.descricao}</div></div>
    <div class="pdf-grid-2" style="margin-bottom:7px;">
      <div class="pdf-field"><label>Requisito violado / Ref. normativa</label><p>${d.requisito}</p></div>
      <div class="pdf-field"><label>Produto / Equip. / Doc. afetado</label><p>${d.produtoAfetado}</p></div>
      <div class="pdf-field"><label>Quantidade / Lote</label><p>${d.quantidadeLote}</p></div>
    </div>
    ${d.impacto !== '—' ? `<div class="pdf-field-full"><label>Impacto estimado</label><div class="pdf-obs-box">${d.impacto}</div></div>` : ''}
  </div>

  <div class="pdf-section">
    <div class="pdf-section-title">4. Contenção Imediata · ISO 9001:2015 — 10.2.1 a)</div>
    <div class="pdf-field-full" style="margin-bottom:7px;"><label>Ação de contenção</label><div class="pdf-obs-box">${d.contencao}</div></div>
    <div class="pdf-grid-3">
      <div class="pdf-field"><label>Responsável</label><p>${d.respContencao}</p></div>
      <div class="pdf-field"><label>Data</label><p>${fmtDate(d.dataContencao)}</p></div>
      <div class="pdf-field"><label>Status</label><p>${d.contencaoStatus !== '—' ? '' : '—'}${d.contencaoStatus !== '—' ? '' : ''}</p>${d.contencaoStatus !== '—' ? statusBadge(d.contencaoStatus) : ''}</div>
    </div>
  </div>

  <div class="pdf-section">
    <div class="pdf-section-title">5. Análise de Causa Raiz · ISO 9001:2015 — 10.2.1 b) · Ferramenta: ${ferrNome}</div>
    ${analiseHtml ? `<div style="margin-bottom:8px;">${analiseHtml}</div>` : ''}
    <div class="pdf-field-full"><label>Causa Raiz Conclusiva</label><div class="pdf-obs-box" style="border-left:2px solid #2d6be4;padding-left:10px;">${d.causaRaiz}</div></div>
  </div>

  <div class="pdf-section">
    <div class="pdf-section-title">6. Ação Corretiva · ISO 9001:2015 — 10.2.1 c)</div>
    <div class="pdf-field-full" style="margin-bottom:7px;"><label>Descrição da ação corretiva</label><div class="pdf-obs-box">${d.acaoCorretiva}</div></div>
    <div class="pdf-grid-3">
      <div class="pdf-field"><label>Responsável</label><p>${d.respCorretiva}</p></div>
      <div class="pdf-field"><label>Prazo</label><p>${fmtDate(d.prazoCorretiva)}</p></div>
      <div class="pdf-field"><label>Status</label>${d.acaoCorretivaStatus !== '—' ? statusBadge(d.acaoCorretivaStatus) : '<p>—</p>'}</div>
    </div>
  </div>

  ${d.acaoPreventiva !== '—' ? `<div class="pdf-section">
    <div class="pdf-section-title">7. Ação Preventiva · ISO 9001:2015 — 10.2.1 e), f)</div>
    <div class="pdf-field-full" style="margin-bottom:7px;"><label>Descrição da ação preventiva</label><div class="pdf-obs-box">${d.acaoPreventiva}</div></div>
    ${d.riscosAtualizados !== '—' ? `<div class="pdf-field-full" style="margin-bottom:7px;"><label>Atualização de riscos e oportunidades (cl. 6.1)</label><div class="pdf-obs-box">${d.riscosAtualizados}</div></div>` : ''}
    <div class="pdf-grid-3">
      <div class="pdf-field"><label>Responsável</label><p>${d.respPreventiva}</p></div>
      <div class="pdf-field"><label>Prazo</label><p>${fmtDate(d.prazoPreventiva)}</p></div>
      <div class="pdf-field"><label>Status</label>${d.acaoPreventivaStatus !== '—' ? statusBadge(d.acaoPreventivaStatus) : '<p>—</p>'}</div>
    </div>
  </div>` : ''}

  <div class="pdf-section">
    <div class="pdf-section-title">8. Verificação de Eficácia · ISO 9001:2015 — 10.2.1 d)</div>
    <div class="pdf-grid-3" style="margin-bottom:7px;">
      <div class="pdf-field"><label>Data da verificação</label><p>${fmtDate(d.dataVerificacao)}</p></div>
      <div class="pdf-field"><label>Verificador / Auditor</label><p>${d.verificador}</p></div>
      <div class="pdf-field"><label>Eficácia</label>${d.eficacia !== '—' ? eficBadge(d.eficacia) : '<p>—</p>'}</div>
    </div>
    ${d.evidenciaVerificacao !== '—' ? `<div class="pdf-field-full"><label>Evidência da verificação</label><div class="pdf-obs-box">${d.evidenciaVerificacao}</div></div>` : ''}
  </div>

  <div class="pdf-section">
    <div class="pdf-section-title">9. Encerramento · ISO 9001:2015 — 10.2.2</div>
    <div class="pdf-grid-3" style="margin-bottom:8px;">
      <div class="pdf-field" style="grid-column:span 2;"><label>Responsável pelo encerramento</label><p>${d.respEncerramento}</p></div>
      <div class="pdf-field"><label>Data de encerramento</label><p>${fmtDate(d.dataEncerramento)}</p></div>
    </div>
    ${d.obsFinais !== '—' ? `<div class="pdf-field-full" style="margin-bottom:8px;"><label>Observações finais / Lições aprendidas</label><div class="pdf-obs-box">${d.obsFinais}</div></div>` : ''}
    <div style="display:flex;align-items:center;gap:8px;margin-bottom:12px;">
      <span style="font-size:0.6rem;letter-spacing:0.08em;text-transform:uppercase;color:#6b7f9a;">Status Final:</span>
      ${d.statusFinal !== '—' ? statusBadge(d.statusFinal) : '<span>—</span>'}
    </div>
    <div class="pdf-sig-grid">
      <div class="pdf-sig-box"><div class="pdf-sig-label">Assinatura — Responsável pela NC</div></div>
      <div class="pdf-sig-box"><div class="pdf-sig-label">Assinatura — Gestor / Aprovador</div></div>
    </div>
    <div class="pdf-iso-note">Documento retido como informação documentada conforme ISO 9001:2015 — 10.2.2 a) e b). Natureza da NC, ações tomadas e resultados da ação corretiva registrados.</div>
  </div>

  <div class="pdf-footer">
    <span>Nexform · Registro de Não Conformidade · ISO 9001:2015</span>
    <span>${d.rnc} · ${d.emitidoEm}</span>
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

    pdf.save(`${d.rnc}.pdf`);
    tpl.innerHTML = '';
    document.getElementById('modal-rnc-num').textContent = d.rnc;
    document.getElementById('success-overlay').classList.add('open');
  } catch (err) {
    showErrorModal(['Erro ao gerar PDF. Tente novamente.']);
    console.error(err);
  }

  btn.innerHTML = '<i class="bi bi-file-earmark-pdf"></i> Gerar Registro de NC';
  btn.disabled = false;
}

function closeModal() {
  document.getElementById('success-overlay').classList.remove('open');
  currentRNC = genRNCNumber();
  document.getElementById('rnc-num').textContent = currentRNC;
}
function showErrorModal(missing) {
  document.getElementById('modal-missing-list').innerHTML = missing.map(m => `<li>${m}</li>`).join('');
  document.getElementById('error-overlay').classList.add('open');
}
function closeErrorModal() { document.getElementById('error-overlay').classList.remove('open'); }

// ── Init
document.getElementById('data-abertura').valueAsDate = new Date();
