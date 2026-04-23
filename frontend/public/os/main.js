// ── OS Number
function genOSNumber() {
  const y = new Date().getFullYear();
  const n = String(Math.floor(Math.random() * 9000) + 1000);
  return `OS-${y}-${n}`;
}
let currentOS = genOSNumber();
document.getElementById('os-num').textContent = currentOS;

// ── Tipo de Manutenção selector
let selectedTipo = '';
function selectTipo(btn) {
  document.querySelectorAll('.tipo-btn').forEach(b => { b.className = 'tipo-btn'; });
  selectedTipo = btn.dataset.tipo;
  btn.classList.add('active-' + selectedTipo.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase());
}

// ── Prioridade selector
let selectedPrioridade = '';
function selectPrioridade(btn) {
  document.querySelectorAll('.prioridade-btn').forEach(b => { b.className = 'prioridade-btn'; });
  selectedPrioridade = btn.dataset.prio;
  btn.classList.add('active-' + selectedPrioridade.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase());
}

// ── Checkboxes
function toggleCheck(el) {
  el.classList.toggle('checked');
  el.querySelector('.check-box').innerHTML = el.classList.contains('checked') ? '✓' : '';
}

// ── Material toggle
function toggleMaterial(el) { el.classList.toggle('checked'); }

// ── Clear form
function clearForm() {
  if (!confirm('Limpar todos os campos?')) return;
  document.querySelectorAll('input:not([readonly]), select, textarea').forEach(el => el.value = '');
  document.getElementById('tecnico').value = 'Carlos Eduardo Mendes';
  document.getElementById('data-abertura').valueAsDate = new Date();
  document.querySelectorAll('.check-item').forEach(el => {
    el.classList.remove('checked');
    el.querySelector('.check-box').innerHTML = '';
  });
  document.querySelectorAll('.material-item').forEach(el => el.classList.remove('checked'));
  document.querySelectorAll('.tipo-btn').forEach(b => b.className = 'tipo-btn');
  document.querySelectorAll('.prioridade-btn').forEach(b => b.className = 'prioridade-btn');
  selectedTipo = '';
  selectedPrioridade = '';
  currentOS = genOSNumber();
  document.getElementById('os-num').textContent = currentOS;
}

// ── Collect data
function collectData() {
  const checkedMateriais = [...document.querySelectorAll('#material-grid .material-item.checked')]
    .map(el => el.dataset.material);
  const checkedSeguranca = [...document.querySelectorAll('#seguranca-checklist .check-item.checked')]
    .map(el => el.textContent.trim());
  return {
    os:               currentOS,
    solicitante:      document.getElementById('solicitante').value || '—',
    setorSolicitante: document.getElementById('setor-solicitante').value || '—',
    dataAbertura:     document.getElementById('data-abertura').value || '—',
    contato:          document.getElementById('contato').value || '—',
    equipamento:      document.getElementById('equipamento').value || '—',
    tag:              document.getElementById('tag').value || '—',
    local:            document.getElementById('local').value || '—',
    setorPlanta:      document.getElementById('setor-planta').value || '—',
    tipo:             selectedTipo || '—',
    prioridade:       selectedPrioridade || '—',
    descricao:        document.getElementById('descricao').value || '—',
    materiais:        checkedMateriais,
    seguranca:        checkedSeguranca,
    tecnico:          document.getElementById('tecnico').value || '—',
    matricula:        document.getElementById('matricula').value || '—',
    horas:            document.getElementById('horas').value || '—',
    emitidoEm:        new Date().toLocaleString('pt-BR'),
  };
}

// ── Validate
function validate(d) {
  const missing = [];
  if (!d.solicitante      || d.solicitante === '—')      missing.push('Solicitante');
  if (!d.setorSolicitante || d.setorSolicitante === '—') missing.push('Setor Solicitante');
  if (!d.equipamento      || d.equipamento === '—')      missing.push('Nome do Equipamento');
  if (!d.local            || d.local === '—')            missing.push('Local / Área');
  if (!d.tipo             || d.tipo === '—')             missing.push('Tipo de Manutenção');
  if (!d.prioridade       || d.prioridade === '—')       missing.push('Prioridade');
  if (!d.descricao        || d.descricao === '—')        missing.push('Descrição do Serviço');
  return missing;
}

// ── Build PDF HTML
function buildPDFHTML(d) {
  const tipoClass = {
    'Corretiva': 'tipo-corretiva', 'Preventiva': 'tipo-preventiva',
    'Preditiva': 'tipo-preditiva', 'Instalação': 'tipo-instalacao',
  }[d.tipo] || '';

  const prioClass = {
    'Baixa': 'prio-baixa', 'Média': 'prio-media',
    'Alta': 'prio-alta',   'Crítica': 'prio-critica',
  }[d.prioridade] || '';

  const segurancaHtml = (() => {
    const all = [...document.querySelectorAll('#seguranca-checklist .check-item')].map(el => ({
      label: el.textContent.trim(),
      checked: el.classList.contains('checked'),
    }));
    return all.map(r => `
      <div class="pdf-check-item">
        <div class="dot ${r.checked ? '' : 'off'}">${r.checked ? '✓' : ''}</div>
        <span>${r.label}</span>
      </div>`).join('');
  })();

  const materiaisHtml = d.materiais.length
    ? d.materiais.map(m => `<span class="pdf-epi-tag">${m}</span>`).join('')
    : '<span style="font-size:0.78rem;color:#6b7f9a;">Nenhum material selecionado</span>';

  const fmtDate = s => {
    if (!s || s === '—') return '—';
    const [y, m, day] = s.split('-');
    return `${day}/${m}/${y}`;
  };

  return `
  <div class="pdf-header">
    <div class="pdf-logo">Nex<span>form</span></div>
    <div class="pdf-title-block">
      <h1>Ordem de Serviço</h1>
      <p>Documento de controle de manutenção</p>
    </div>
    <div class="pdf-num">
      <span>Número</span>
      <strong>${d.os}</strong>
      <span>Emitido em: ${d.emitidoEm}</span>
    </div>
  </div>

  <div class="pdf-section">
    <div class="pdf-section-title">1. Identificação</div>
    <div class="pdf-grid-2">
      <div class="pdf-field"><label>Solicitante</label><p>${d.solicitante}</p></div>
      <div class="pdf-field"><label>Setor Solicitante</label><p>${d.setorSolicitante}</p></div>
      <div class="pdf-field"><label>Data de Abertura</label><p>${fmtDate(d.dataAbertura)}</p></div>
      <div class="pdf-field"><label>Contato</label><p>${d.contato}</p></div>
    </div>
  </div>

  <div class="pdf-section">
    <div class="pdf-section-title">2. Equipamento / Local</div>
    <div class="pdf-grid-2">
      <div class="pdf-field"><label>Nome do Equipamento</label><p>${d.equipamento}</p></div>
      <div class="pdf-field"><label>Tag / Patrimônio</label><p>${d.tag}</p></div>
      <div class="pdf-field"><label>Local / Área</label><p>${d.local}</p></div>
      <div class="pdf-field"><label>Setor / Planta</label><p>${d.setorPlanta}</p></div>
    </div>
  </div>

  <div class="pdf-section">
    <div class="pdf-section-title">3. Tipo de Manutenção</div>
    <span class="pdf-badge ${tipoClass}">${d.tipo}</span>
  </div>

  <div class="pdf-section">
    <div class="pdf-section-title">4. Prioridade</div>
    <span class="pdf-badge ${prioClass}">${d.prioridade}</span>
  </div>

  <div class="pdf-section">
    <div class="pdf-section-title">5. Descrição do Serviço</div>
    <div class="pdf-obs-box">${d.descricao}</div>
  </div>

  <div class="pdf-section">
    <div class="pdf-section-title">6. Materiais e Ferramentas</div>
    <div class="pdf-epi-list">${materiaisHtml}</div>
  </div>

  <div class="pdf-section">
    <div class="pdf-section-title">7. Medidas de Segurança</div>
    <div class="pdf-checklist">${segurancaHtml}</div>
  </div>

  <div class="pdf-section">
    <div class="pdf-section-title">8. Execução e Responsabilidade</div>
    <div class="pdf-grid-3" style="margin-bottom:12px;">
      <div class="pdf-field"><label>Técnico Responsável</label><p>${d.tecnico}</p></div>
      <div class="pdf-field"><label>Matrícula / Registro</label><p>${d.matricula}</p></div>
      <div class="pdf-field"><label>Previsão de Horas</label><p>${d.horas}</p></div>
    </div>
    <div class="pdf-sig-grid">
      <div class="pdf-sig-box"><div class="pdf-sig-label">Assinatura — Técnico Responsável</div></div>
      <div class="pdf-sig-box"><div class="pdf-sig-label">Assinatura — Aprovação / Supervisão</div></div>
    </div>
  </div>

  <div class="pdf-footer">
    <span>Nexform · Sistema de Ordem de Serviço</span>
    <span>${d.os} · ${d.emitidoEm}</span>
    <span>Este documento tem validade somente com assinaturas</span>
  </div>`;
}

// ── Generate PDF
async function generatePDF() {
  const d = collectData();
  const missing = validate(d);
  if (missing.length) {
    showErrorModal(missing);
    return;
  }

  const btn = document.querySelector('.btn-primary');
  btn.innerHTML = '<i class="bi bi-hourglass-split"></i> Gerando PDF...';
  btn.disabled = true;

  const tpl = document.getElementById('pdf-template');
  tpl.innerHTML = buildPDFHTML(d);

  await new Promise(r => setTimeout(r, 300));

  try {
    const canvas = await html2canvas(tpl, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff',
      width: 794,
      windowWidth: 794,
    });

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
        c2.width = canvas.width;
        c2.height = sliceH;
        c2.getContext('2d').drawImage(canvas, 0, yOffset, canvas.width, sliceH, 0, 0, canvas.width, sliceH);
        if (yOffset > 0) pdf.addPage();
        pdf.addImage(c2.toDataURL('image/png'), 'PNG', 0, 0, pW, sliceH * ratio);
        yOffset += sliceH;
      }
    }

    pdf.save(`${d.os}.pdf`);
    tpl.innerHTML = '';

    document.getElementById('modal-os-num').textContent = d.os;
    document.getElementById('success-overlay').classList.add('open');

  } catch (err) {
    showErrorModal(['Erro ao gerar PDF. Tente novamente.']);
    console.error(err);
  }

  btn.innerHTML = '<i class="bi bi-file-earmark-pdf"></i> Gerar Ordem de Serviço';
  btn.disabled = false;
}

// ── Modals
function closeModal() {
  document.getElementById('success-overlay').classList.remove('open');
  currentOS = genOSNumber();
  document.getElementById('os-num').textContent = currentOS;
}

function showErrorModal(missing) {
  const list = document.getElementById('modal-missing-list');
  list.innerHTML = missing.map(m => `<li>${m}</li>`).join('');
  document.getElementById('error-overlay').classList.add('open');
}

function closeErrorModal() {
  document.getElementById('error-overlay').classList.remove('open');
}

// ── Auto-fill today's date
document.getElementById('data-abertura').valueAsDate = new Date();
