// ── ADM Number
function genADMNumber() {
  const y = new Date().getFullYear();
  const n = String(Math.floor(Math.random() * 9000) + 1000);
  return `ADM-${y}-${n}`;
}
let currentADM = genADMNumber();
document.getElementById('adm-num').textContent = currentADM;

// ── Checkboxes
function toggleCheck(el) {
  el.classList.toggle('checked');
  el.querySelector('.check-box').innerHTML = el.classList.contains('checked') ? '✓' : '';
}

// ── Clear form
function clearForm() {
  if (!confirm('Limpar todos os campos?')) return;
  document.querySelectorAll('input:not([readonly]), select, textarea').forEach(el => el.value = '');
  document.getElementById('data-emissao').valueAsDate = new Date();
  document.querySelectorAll('.check-item').forEach(el => {
    el.classList.remove('checked');
    el.querySelector('.check-box').innerHTML = '';
  });
  currentADM = genADMNumber();
  document.getElementById('adm-num').textContent = currentADM;
}

// ── Collect data
function collectData() {
  const docs = [...document.querySelectorAll('#docs-checklist .check-item')].map(el => ({
    label: el.textContent.trim(), checked: el.classList.contains('checked'),
  }));
  return {
    adm:             currentADM,
    nome:            document.getElementById('nome').value || '—',
    cpf:             document.getElementById('cpf').value || '—',
    rg:              document.getElementById('rg').value || '—',
    dataNascimento:  document.getElementById('data-nascimento').value || '—',
    estadoCivil:     document.getElementById('estado-civil').value || '—',
    naturalidade:    document.getElementById('naturalidade').value || '—',
    nacionalidade:   document.getElementById('nacionalidade').value || '—',
    cep:             document.getElementById('cep').value || '—',
    logradouro:      document.getElementById('logradouro').value || '—',
    numero:          document.getElementById('numero').value || '—',
    complemento:     document.getElementById('complemento').value || '—',
    bairro:          document.getElementById('bairro').value || '—',
    cidade:          document.getElementById('cidade').value || '—',
    estado:          document.getElementById('estado').value || '—',
    telefone:        document.getElementById('telefone').value || '—',
    email:           document.getElementById('email').value || '—',
    emergenciaNome:  document.getElementById('emergencia-nome').value || '—',
    emergenciaTel:   document.getElementById('emergencia-tel').value || '—',
    cargo:           document.getElementById('cargo').value || '—',
    setorProf:       document.getElementById('setor-prof').value || '—',
    dataAdmissao:    document.getElementById('data-admissao').value || '—',
    tipoContrato:    document.getElementById('tipo-contrato').value || '—',
    regime:          document.getElementById('regime').value || '—',
    gestor:          document.getElementById('gestor').value || '—',
    docs:            docs,
    dataAso:         document.getElementById('data-aso').value || '—',
    resultadoAso:    document.getElementById('resultado-aso').value || '—',
    restricoes:      document.getElementById('restricoes').value || '—',
    responsavelRh:   document.getElementById('responsavel-rh').value || '—',
    dataEmissao:     document.getElementById('data-emissao').value || '—',
    emitidoEm:       new Date().toLocaleString('pt-BR'),
  };
}

// ── Validate
function validate(d) {
  const missing = [];
  if (!d.nome           || d.nome === '—')           missing.push('Nome Completo');
  if (!d.cpf            || d.cpf === '—')            missing.push('CPF');
  if (!d.dataNascimento || d.dataNascimento === '—') missing.push('Data de Nascimento');
  if (!d.logradouro     || d.logradouro === '—')     missing.push('Logradouro');
  if (!d.bairro         || d.bairro === '—')         missing.push('Bairro');
  if (!d.cidade         || d.cidade === '—')         missing.push('Cidade');
  if (!d.estado         || d.estado === '—')         missing.push('Estado');
  if (!d.telefone       || d.telefone === '—')       missing.push('Telefone');
  if (!d.cargo          || d.cargo === '—')          missing.push('Cargo / Função');
  if (!d.setorProf      || d.setorProf === '—')      missing.push('Setor / Departamento');
  if (!d.dataAdmissao   || d.dataAdmissao === '—')   missing.push('Data de Admissão');
  if (!d.responsavelRh  || d.responsavelRh === '—')  missing.push('Responsável pelo RH');
  return missing;
}

// ── Build PDF HTML
function buildPDFHTML(d) {
  const fmtDate = s => { if (!s || s === '—') return '—'; const [y,m,day] = s.split('-'); return `${day}/${m}/${y}`; };

  const docsHtml = d.docs.map(doc => `
    <div class="pdf-check-item">
      <div class="dot ${doc.checked ? '' : 'off'}">${doc.checked ? '✓' : ''}</div>
      <span>${doc.label}</span>
    </div>`).join('');

  return `
  <div class="pdf-header">
    <div class="pdf-logo">Nex<span>form</span></div>
    <div class="pdf-title-block"><h1>Formulário de Admissão</h1><p>Registro de admissão de colaborador</p></div>
    <div class="pdf-num"><span>Número</span><strong>${d.adm}</strong><span>Emitido em: ${d.emitidoEm}</span></div>
  </div>

  <div class="pdf-section">
    <div class="pdf-section-title">1. Dados Pessoais</div>
    <div class="pdf-grid-2" style="margin-bottom:8px;">
      <div class="pdf-field" style="grid-column:1/-1"><label>Nome Completo</label><p>${d.nome}</p></div>
    </div>
    <div class="pdf-grid-4">
      <div class="pdf-field"><label>CPF</label><p>${d.cpf}</p></div>
      <div class="pdf-field"><label>RG</label><p>${d.rg}</p></div>
      <div class="pdf-field"><label>Data de Nasc.</label><p>${fmtDate(d.dataNascimento)}</p></div>
      <div class="pdf-field"><label>Estado Civil</label><p>${d.estadoCivil}</p></div>
      <div class="pdf-field"><label>Naturalidade</label><p>${d.naturalidade}</p></div>
      <div class="pdf-field"><label>Nacionalidade</label><p>${d.nacionalidade}</p></div>
    </div>
  </div>

  <div class="pdf-section">
    <div class="pdf-section-title">2. Endereço</div>
    <div class="pdf-grid-3">
      <div class="pdf-field" style="grid-column:1/-1"><label>Logradouro</label><p>${d.logradouro}, ${d.numero}${d.complemento !== '—' ? ' — ' + d.complemento : ''}</p></div>
      <div class="pdf-field"><label>Bairro</label><p>${d.bairro}</p></div>
      <div class="pdf-field"><label>Cidade</label><p>${d.cidade}</p></div>
      <div class="pdf-field"><label>Estado / CEP</label><p>${d.estado} · ${d.cep}</p></div>
    </div>
  </div>

  <div class="pdf-section">
    <div class="pdf-section-title">3. Contato</div>
    <div class="pdf-grid-4">
      <div class="pdf-field"><label>Telefone</label><p>${d.telefone}</p></div>
      <div class="pdf-field"><label>E-mail</label><p>${d.email}</p></div>
      <div class="pdf-field"><label>Contato de Emerg.</label><p>${d.emergenciaNome}</p></div>
      <div class="pdf-field"><label>Tel. Emergência</label><p>${d.emergenciaTel}</p></div>
    </div>
  </div>

  <div class="pdf-section">
    <div class="pdf-section-title">4. Dados Profissionais</div>
    <div class="pdf-grid-3">
      <div class="pdf-field"><label>Cargo / Função</label><p>${d.cargo}</p></div>
      <div class="pdf-field"><label>Setor / Depto.</label><p>${d.setorProf}</p></div>
      <div class="pdf-field"><label>Data de Admissão</label><p>${fmtDate(d.dataAdmissao)}</p></div>
      <div class="pdf-field"><label>Tipo de Contrato</label><p>${d.tipoContrato}</p></div>
      <div class="pdf-field"><label>Regime de Trabalho</label><p>${d.regime}</p></div>
      <div class="pdf-field"><label>Gestor Imediato</label><p>${d.gestor}</p></div>
    </div>
  </div>

  <div class="pdf-section">
    <div class="pdf-section-title">5. Documentação Entregue</div>
    <div class="pdf-checklist">${docsHtml}</div>
  </div>

  <div class="pdf-section">
    <div class="pdf-section-title">6. Saúde Ocupacional</div>
    <div class="pdf-grid-3">
      <div class="pdf-field"><label>Data do ASO</label><p>${fmtDate(d.dataAso)}</p></div>
      <div class="pdf-field"><label>Resultado do ASO</label><p>${d.resultadoAso}</p></div>
      ${d.restricoes !== '—' ? `<div class="pdf-field" style="grid-column:1/-1"><label>Restrições / Observações</label><div class="pdf-obs-box">${d.restricoes}</div></div>` : ''}
    </div>
  </div>

  <div class="pdf-section">
    <div class="pdf-section-title">7. Responsabilidade e Registro</div>
    <div class="pdf-grid-2" style="margin-bottom:12px;">
      <div class="pdf-field"><label>Responsável pelo RH</label><p>${d.responsavelRh}</p></div>
      <div class="pdf-field"><label>Data de Emissão</label><p>${fmtDate(d.dataEmissao)}</p></div>
    </div>
    <div class="pdf-sig-grid">
      <div class="pdf-sig-box"><div class="pdf-sig-label">Assinatura — Colaborador</div></div>
      <div class="pdf-sig-box"><div class="pdf-sig-label">Assinatura — Responsável RH</div></div>
    </div>
  </div>

  <div class="pdf-footer">
    <span>Nexform · Sistema de Formulário de Admissão</span>
    <span>${d.adm} · ${d.emitidoEm}</span>
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

    pdf.save(`${d.adm}.pdf`);
    tpl.innerHTML = '';
    document.getElementById('modal-adm-num').textContent = d.adm;
    document.getElementById('success-overlay').classList.add('open');
  } catch (err) {
    showErrorModal(['Erro ao gerar PDF. Tente novamente.']);
    console.error(err);
  }

  btn.innerHTML = '<i class="bi bi-file-earmark-pdf"></i> Gerar Formulário de Admissão';
  btn.disabled = false;
}

function closeModal() {
  document.getElementById('success-overlay').classList.remove('open');
  currentADM = genADMNumber();
  document.getElementById('adm-num').textContent = currentADM;
}
function showErrorModal(missing) {
  document.getElementById('modal-missing-list').innerHTML = missing.map(m => `<li>${m}</li>`).join('');
  document.getElementById('error-overlay').classList.add('open');
}
function closeErrorModal() { document.getElementById('error-overlay').classList.remove('open'); }

document.getElementById('data-emissao').valueAsDate = new Date();
