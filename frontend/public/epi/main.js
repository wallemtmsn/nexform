// ── FE Number
function genFENumber() {
  const y = new Date().getFullYear();
  const n = String(Math.floor(Math.random() * 9000) + 1000);
  return `FE-${y}-${n}`;
}
let currentFE = genFENumber();
document.getElementById('fe-num').textContent = currentFE;

// ── CNPJ/CPF mask
function maskCNPJCPF(el) {
  el.addEventListener('input', function () {
    let v = this.value.replace(/\D/g, '').slice(0, 14);
    if (v.length <= 11) {
      if (v.length > 9)      v = v.replace(/^(\d{3})(\d{3})(\d{3})(\d{0,2})/, '$1.$2.$3-$4');
      else if (v.length > 6) v = v.replace(/^(\d{3})(\d{3})(\d{0,3})/, '$1.$2.$3');
      else if (v.length > 3) v = v.replace(/^(\d{3})(\d{0,3})/, '$1.$2');
    } else {
      if (v.length > 12)     v = v.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{0,2})/, '$1.$2.$3/$4-$5');
      else if (v.length > 8) v = v.replace(/^(\d{2})(\d{3})(\d{3})(\d{0,4})/, '$1.$2.$3/$4');
      else if (v.length > 5) v = v.replace(/^(\d{2})(\d{3})(\d{0,3})/, '$1.$2.$3');
      else if (v.length > 2) v = v.replace(/^(\d{2})(\d{0,3})/, '$1.$2');
    }
    this.value = v;
  });
}

function maskCPF(el) {
  el.addEventListener('input', function () {
    let v = this.value.replace(/\D/g, '').slice(0, 11);
    if (v.length > 9)      v = v.replace(/^(\d{3})(\d{3})(\d{3})(\d{0,2})/, '$1.$2.$3-$4');
    else if (v.length > 6) v = v.replace(/^(\d{3})(\d{3})(\d{0,3})/, '$1.$2.$3');
    else if (v.length > 3) v = v.replace(/^(\d{3})(\d{0,3})/, '$1.$2');
    this.value = v;
  });
}

// ── EPI row management
let rowCounter = 0;

const EPI_OPTIONS = [
  'Capacete de Segurança',
  'Óculos de Proteção',
  'Protetor Auricular (Tipo Concha)',
  'Protetor Auricular (Tipo Plug)',
  'Luva de Borracha / PVC',
  'Luva de Raspa / Couro',
  'Luva de Malha de Aço',
  'Luva Nitrílica',
  'Bota de Segurança (com bico de aço)',
  'Bota Impermeável / PVC',
  'Cinto de Segurança / Talabarte',
  'Máscara de Proteção Respiratória PFF2',
  'Máscara com Filtro Químico',
  'Protetor Facial (Face Shield)',
  'Óculos de Solda / Máscara de Solda',
  'Avental de Proteção',
  'Manga / Mangote',
  'Colete Refletivo',
  'Uniforme / Vestimenta de Trabalho',
  'Calçado de Segurança (sem bico de aço)',
  'Capa de Chuva',
  'Protetor Solar Fator 30+',
  'Outro',
];

const MOTIVO_OPTIONS = [
  'Admissão',
  'Reposição por Dano',
  'Reposição por Perda',
  'Troca Periódica',
  'Outros',
];

function addEPIRow() {
  rowCounter++;
  const id = rowCounter;
  const today = new Date().toISOString().split('T')[0];

  const optionsHtml = EPI_OPTIONS.map(o =>
    `<option value="${o === 'Outro' ? '__outro__' : o}">${o}</option>`
  ).join('');

  const motivoHtml = `<option value="">Selecione...</option>` +
    MOTIVO_OPTIONS.map(m => `<option>${m}</option>`).join('');

  const row = document.createElement('div');
  row.className = 'epi-row';
  row.id = `row-${id}`;
  row.innerHTML = `
    <div class="epi-desc-wrap">
      <select id="epi-sel-${id}" onchange="handleEPISelect(${id})">
        <option value="">Selecione o EPI...</option>
        ${optionsHtml}
      </select>
      <input type="text" class="epi-custom" id="epi-custom-${id}" placeholder="Descreva o EPI..." />
    </div>
    <input type="text" id="ca-${id}" placeholder="000000" maxlength="10" />
    <input type="number" id="qty-${id}" value="1" min="1" max="999" />
    <input type="date" id="date-${id}" value="${today}" />
    <select id="motivo-${id}">${motivoHtml}</select>
    <button type="button" class="remove-btn" onclick="removeEPIRow(${id})" title="Remover">
      <i class="bi bi-x-lg"></i>
    </button>`;

  document.getElementById('epi-rows').appendChild(row);
}

function handleEPISelect(id) {
  const sel = document.getElementById(`epi-sel-${id}`);
  const custom = document.getElementById(`epi-custom-${id}`);
  if (sel.value === '__outro__') {
    custom.classList.add('visible');
    custom.focus();
  } else {
    custom.classList.remove('visible');
    custom.value = '';
  }
}

function removeEPIRow(id) {
  const row = document.getElementById(`row-${id}`);
  if (row) row.remove();
}

// ── Clear form
function clearForm() {
  if (!confirm('Limpar todos os campos?')) return;
  document.querySelectorAll('input:not([readonly]), select, textarea').forEach(el => el.value = '');
  document.getElementById('responsavel').value = 'Carlos Eduardo Mendes';
  document.getElementById('data-emissao').valueAsDate = new Date();
  document.getElementById('epi-rows').innerHTML = '';
  rowCounter = 0;
  currentFE = genFENumber();
  document.getElementById('fe-num').textContent = currentFE;
  addEPIRow();
}

// ── Collect data
function collectEPIs() {
  const rows = document.querySelectorAll('#epi-rows .epi-row');
  return [...rows].map(row => {
    const id = row.id.replace('row-', '');
    const sel = document.getElementById(`epi-sel-${id}`);
    const custom = document.getElementById(`epi-custom-${id}`);
    const desc = sel.value === '__outro__'
      ? (custom.value.trim() || 'Outro')
      : (sel.value || '—');
    return {
      desc,
      ca:     document.getElementById(`ca-${id}`).value.trim() || '—',
      qty:    document.getElementById(`qty-${id}`).value || '1',
      date:   document.getElementById(`date-${id}`).value || '—',
      motivo: document.getElementById(`motivo-${id}`).value || '—',
    };
  }).filter(r => r.desc && r.desc !== '—');
}

function collectData() {
  return {
    fe:               currentFE,
    nome:             document.getElementById('nome').value.trim() || '—',
    cpf:              document.getElementById('cpf').value.trim() || '—',
    rg:               document.getElementById('rg').value.trim() || '—',
    matricula:        document.getElementById('matricula').value.trim() || '—',
    cargo:            document.getElementById('cargo').value.trim() || '—',
    setor:            document.getElementById('setor').value.trim() || '—',
    dataAdmissao:     document.getElementById('data-admissao').value || '—',
    empresa:          document.getElementById('empresa').value.trim() || '—',
    cnpj:             document.getElementById('cnpj').value.trim() || '—',
    responsavel:      document.getElementById('responsavel').value.trim() || '—',
    cargoResponsavel: document.getElementById('cargo-responsavel').value.trim() || '—',
    registroResp:     document.getElementById('registro-responsavel').value.trim() || '—',
    local:            document.getElementById('local').value.trim() || '—',
    epis:             collectEPIs(),
    dataEmissao:      document.getElementById('data-emissao').value || '—',
    observacoes:      document.getElementById('observacoes').value.trim() || '—',
    emitidoEm:        new Date().toLocaleString('pt-BR'),
  };
}

// ── Validate
function validate(d) {
  const missing = [];
  if (!d.nome     || d.nome === '—')     missing.push('Nome Completo do Colaborador');
  if (!d.cpf      || d.cpf === '—')      missing.push('CPF do Colaborador');
  if (!d.cargo    || d.cargo === '—')    missing.push('Cargo / Função');
  if (!d.setor    || d.setor === '—')    missing.push('Setor / Departamento');
  if (!d.empresa  || d.empresa === '—')  missing.push('Empresa / Razão Social');
  if (!d.responsavel || d.responsavel === '—') missing.push('Responsável pela Entrega');
  if (!d.epis.length) missing.push('Pelo menos 1 EPI na tabela de entrega');
  return missing;
}

// ── Build PDF HTML
function buildPDFHTML(d) {
  const fmtDate = s => {
    if (!s || s === '—') return '—';
    const [y, m, day] = s.split('-');
    return `${day}/${m}/${y}`;
  };

  const episTableRows = d.epis.map((e, i) => `
    <tr>
      <td>${i + 1}. ${e.desc}</td>
      <td>${e.ca}</td>
      <td>${e.qty}</td>
      <td>${fmtDate(e.date)}</td>
      <td>${e.motivo}</td>
    </tr>`).join('');

  return `
  <div class="pdf-header">
    <div class="pdf-logo">Nex<span>form</span></div>
    <div class="pdf-title-block">
      <h1>Ficha de Entrega de EPI</h1>
      <p>Controle de entrega · NR-6 / Portaria MTE nº 3.214/78</p>
    </div>
    <div class="pdf-num">
      <span>Número</span>
      <strong>${d.fe}</strong>
      <span>Emitido em: ${d.emitidoEm}</span>
    </div>
  </div>

  <div class="pdf-section">
    <div class="pdf-section-title">1. Identificação do Colaborador</div>
    <div class="pdf-grid-2" style="margin-bottom:8px;">
      <div class="pdf-field" style="grid-column:1/-1"><label>Nome Completo</label><p>${d.nome}</p></div>
    </div>
    <div class="pdf-grid-3">
      <div class="pdf-field"><label>CPF</label><p>${d.cpf}</p></div>
      <div class="pdf-field"><label>RG</label><p>${d.rg}</p></div>
      <div class="pdf-field"><label>Matrícula</label><p>${d.matricula}</p></div>
      <div class="pdf-field"><label>Cargo / Função</label><p>${d.cargo}</p></div>
      <div class="pdf-field"><label>Setor / Departamento</label><p>${d.setor}</p></div>
      <div class="pdf-field"><label>Data de Admissão</label><p>${fmtDate(d.dataAdmissao)}</p></div>
    </div>
  </div>

  <div class="pdf-section">
    <div class="pdf-section-title">2. Dados do Empregador</div>
    <div class="pdf-grid-3">
      <div class="pdf-field" style="grid-column:span 2"><label>Empresa / Razão Social</label><p>${d.empresa}</p></div>
      <div class="pdf-field"><label>CNPJ / CPF</label><p>${d.cnpj}</p></div>
      <div class="pdf-field"><label>Responsável pela Entrega</label><p>${d.responsavel}</p></div>
      <div class="pdf-field"><label>Cargo do Responsável</label><p>${d.cargoResponsavel}</p></div>
      <div class="pdf-field"><label>Registro Profissional</label><p>${d.registroResp}</p></div>
    </div>
  </div>

  <div class="pdf-section">
    <div class="pdf-section-title">3. EPIs Entregues</div>
    <table class="pdf-epi-table">
      <thead>
        <tr>
          <th style="width:38%;">Descrição do EPI</th>
          <th style="width:12%;">Nº CA</th>
          <th style="width:6%;text-align:center;">Qtd</th>
          <th style="width:16%;">Data de Entrega</th>
          <th style="width:28%;">Motivo</th>
        </tr>
      </thead>
      <tbody>${episTableRows}</tbody>
    </table>
  </div>

  <div class="pdf-section">
    <div class="pdf-section-title">4. Declaração do Colaborador</div>
    <div class="pdf-declaration">
      Declaro que recebi os Equipamentos de Proteção Individual (EPIs) listados neste documento, que fui devidamente orientado(a) quanto ao seu uso correto, conservação, higienização e guarda, comprometendo-me a utilizá-los sempre que necessário para a execução das minhas atividades, conforme determina a <strong>NR-6 da Portaria MTE nº 3.214/78</strong>. Estou ciente de que a recusa ao uso do EPI ou seu uso inadequado configura falta grave, sujeita às penalidades previstas na CLT, incluindo possibilidade de dispensa por justa causa.
    </div>
    <div style="display:flex;gap:20px;margin-top:8px;">
      <div class="pdf-field" style="flex:1;"><label>Data de Emissão</label><p>${fmtDate(d.dataEmissao)}</p></div>
      <div class="pdf-field" style="flex:1;"><label>Local / Unidade</label><p>${d.local}</p></div>
      ${d.observacoes !== '—' ? `<div class="pdf-field" style="flex:2;"><label>Observações</label><p>${d.observacoes}</p></div>` : ''}
    </div>
  </div>

  <div class="pdf-section">
    <div class="pdf-section-title">5. Assinaturas</div>
    <div class="pdf-sig-grid">
      <div class="pdf-sig-box"><div class="pdf-sig-label">Assinatura — Colaborador: ${d.nome}</div></div>
      <div class="pdf-sig-box"><div class="pdf-sig-label">Assinatura — Responsável: ${d.responsavel}</div></div>
    </div>
  </div>

  <div class="pdf-footer">
    <span>Nexform · Ficha de Entrega de EPI · NR-6</span>
    <span>${d.fe} · ${d.emitidoEm}</span>
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

    pdf.save(`${d.fe}.pdf`);
    tpl.innerHTML = '';
    document.getElementById('modal-fe-num').textContent = d.fe;
    document.getElementById('success-overlay').classList.add('open');
  } catch (err) {
    showErrorModal(['Erro ao gerar PDF. Tente novamente.']);
    console.error(err);
  }

  btn.innerHTML = '<i class="bi bi-file-earmark-pdf"></i> Gerar Ficha de Entrega';
  btn.disabled = false;
}

function closeModal() {
  document.getElementById('success-overlay').classList.remove('open');
  currentFE = genFENumber();
  document.getElementById('fe-num').textContent = currentFE;
}
function showErrorModal(missing) {
  document.getElementById('modal-missing-list').innerHTML = missing.map(m => `<li>${m}</li>`).join('');
  document.getElementById('error-overlay').classList.add('open');
}
function closeErrorModal() { document.getElementById('error-overlay').classList.remove('open'); }

// ── Init
document.getElementById('data-emissao').valueAsDate = new Date();
maskCPF(document.getElementById('cpf'));
maskCNPJCPF(document.getElementById('cnpj'));
addEPIRow(); // start with one empty row
