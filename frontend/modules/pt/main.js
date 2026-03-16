// ── PT Number
  function genPTNumber() {
    const y = new Date().getFullYear();
    const n = String(Math.floor(Math.random() * 9000) + 1000);
    return `PT-${y}-${n}`;
  }
  let currentPT = genPTNumber();
  document.getElementById('pt-num').textContent = currentPT;

  // ── Risk selector
  let selectedRisk = '';
  function selectRisk(btn) {
    document.querySelectorAll('.risk-btn').forEach(b => {
      b.className = 'risk-btn';
    });
    const r = btn.dataset.risk;
    selectedRisk = r;
    btn.classList.add('active-' + r.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase());
  }

  // ── Checkboxes
  function toggleCheck(el) {
    el.classList.toggle('checked');
    el.querySelector('.check-box').innerHTML = el.classList.contains('checked') ? '✓' : '';
  }

  // ── EPI toggle
  function toggleEpi(el) { el.classList.toggle('checked'); }

  // ── Clear form
  function clearForm() {
    if (!confirm('Limpar todos os campos?')) return;
    document.querySelectorAll('input, select, textarea').forEach(el => el.value = '');
    document.getElementById('tecnico').value = 'Carlos Eduardo Mendes';
    document.querySelectorAll('.check-item').forEach(el => {
      el.classList.remove('checked');
      el.querySelector('.check-box').innerHTML = '';
    });
    document.querySelectorAll('.epi-item').forEach(el => el.classList.remove('checked'));
    document.querySelectorAll('.risk-btn').forEach(b => b.className = 'risk-btn');
    selectedRisk = '';
    currentPT = genPTNumber();
    document.getElementById('pt-num').textContent = currentPT;
  }

  // ── Collect data
  function collectData() {
    const checkedRiscos = [...document.querySelectorAll('#riscos-checklist .check-item.checked')].map(el => el.textContent.trim());
    const checkedMedidas = [...document.querySelectorAll('#medidas-checklist .check-item.checked')].map(el => el.textContent.trim());
    const checkedEpis = [...document.querySelectorAll('#epi-grid .epi-item.checked')].map(el => el.dataset.epi);
    return {
      pt: currentPT,
      empresa: document.getElementById('empresa').value || '—',
      cnpj: document.getElementById('cnpj').value || '—',
      responsavel: document.getElementById('responsavel').value || '—',
      cargo: document.getElementById('cargo').value || '—',
      local: document.getElementById('local').value || '—',
      setor: document.getElementById('setor').value || '—',
      dataInicio: document.getElementById('data-inicio').value || '—',
      dataFim: document.getElementById('data-fim').value || '—',
      turno: document.getElementById('turno').value || '—',
      tipoTrabalho: document.getElementById('tipo-trabalho').value || '—',
      descricao: document.getElementById('descricao').value || '—',
      risco: selectedRisk || '—',
      riscos: checkedRiscos,
      epis: checkedEpis,
      medidas: checkedMedidas,
      observacoes: document.getElementById('observacoes').value || '—',
      tecnico: document.getElementById('tecnico').value || '—',
      registro: document.getElementById('registro').value || '—',
      emitidoEm: new Date().toLocaleString('pt-BR'),
    };
  }

  // ── Validate
  function validate(d) {
    const missing = [];
    if (!d.empresa || d.empresa === '—') missing.push('Empresa Solicitante');
    if (!d.responsavel || d.responsavel === '—') missing.push('Responsável pelo Serviço');
    if (!d.local || d.local === '—') missing.push('Local / Área de Trabalho');
    if (!d.dataInicio || d.dataInicio === '—') missing.push('Data de Início');
    if (!d.dataFim || d.dataFim === '—') missing.push('Data de Término');
    if (!d.tipoTrabalho || d.tipoTrabalho === '—') missing.push('Tipo de Trabalho');
    if (!d.descricao || d.descricao === '—') missing.push('Descrição do Serviço');
    if (!d.risco || d.risco === '—') missing.push('Nível de Risco');
    return missing;
  }

  // ── Build PDF HTML
  function buildPDFHTML(d) {
    const riskClass = d.risco === 'Alto' ? 'risk-alto' : d.risco === 'Médio' ? 'risk-medio' : 'risk-baixo';

    const riscosHtml = (() => {
      const all = [...document.querySelectorAll('#riscos-checklist .check-item')].map(el => ({
        label: el.textContent.trim(),
        checked: el.classList.contains('checked')
      }));
      return all.map(r => `
        <div class="pdf-check-item">
          <div class="dot ${r.checked ? '' : 'off'}">${r.checked ? '✓' : ''}</div>
          <span>${r.label}</span>
        </div>`).join('');
    })();

    const medidasHtml = (() => {
      const all = [...document.querySelectorAll('#medidas-checklist .check-item')].map(el => ({
        label: el.textContent.trim(),
        checked: el.classList.contains('checked')
      }));
      return all.map(r => `
        <div class="pdf-check-item">
          <div class="dot ${r.checked ? '' : 'off'}">${r.checked ? '✓' : ''}</div>
          <span>${r.label}</span>
        </div>`).join('');
    })();

    const episHtml = d.epis.length
      ? d.epis.map(e => `<span class="pdf-epi-tag">${e}</span>`).join('')
      : '<span style="font-size:0.78rem;color:#6b7f9a;">Nenhum EPI selecionado</span>';

    const fmtDate = s => {
      if (!s || s === '—') return '—';
      const [y,m,d2] = s.split('-');
      return `${d2}/${m}/${y}`;
    };

    return `
    <div class="pdf-header">
      <div class="pdf-logo">Nex<span>form</span></div>
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
        <div class="pdf-field"><label>Empresa Solicitante</label><p>${d.empresa}</p></div>
        <div class="pdf-field"><label>CNPJ / CPF</label><p>${d.cnpj}</p></div>
        <div class="pdf-field"><label>Responsável pelo Serviço</label><p>${d.responsavel}</p></div>
        <div class="pdf-field"><label>Cargo / Função</label><p>${d.cargo}</p></div>
        <div class="pdf-field"><label>Local / Área de Trabalho</label><p>${d.local}</p></div>
        <div class="pdf-field"><label>Setor / Planta</label><p>${d.setor}</p></div>
      </div>
    </div>

    <div class="pdf-section">
      <div class="pdf-section-title">2. Período e Tipo de Serviço</div>
      <div class="pdf-grid-3" style="margin-bottom:8px;">
        <div class="pdf-field"><label>Data de Início</label><p>${fmtDate(d.dataInicio)}</p></div>
        <div class="pdf-field"><label>Data de Término</label><p>${fmtDate(d.dataFim)}</p></div>
        <div class="pdf-field"><label>Turno</label><p>${d.turno}</p></div>
      </div>
      <div class="pdf-field" style="margin-bottom:8px;"><label>Tipo de Trabalho</label><p>${d.tipoTrabalho}</p></div>
      <div class="pdf-field"><label>Descrição Detalhada</label><p>${d.descricao}</p></div>
    </div>

    <div class="pdf-section">
      <div class="pdf-section-title">3. Nível de Risco</div>
      <span class="pdf-risk-badge ${riskClass}">${d.risco}</span>
    </div>

    <div class="pdf-section">
      <div class="pdf-section-title">4. Análise Preliminar de Riscos</div>
      <div class="pdf-checklist">${riscosHtml}</div>
    </div>

    <div class="pdf-section">
      <div class="pdf-section-title">5. EPIs Obrigatórios</div>
      <div class="pdf-epi-list">${episHtml}</div>
    </div>

    <div class="pdf-section">
      <div class="pdf-section-title">6. Medidas de Controle</div>
      <div class="pdf-checklist">${medidasHtml}</div>
      ${d.observacoes !== '—' ? `<div style="margin-top:8px;"><div style="font-size:0.62rem;letter-spacing:0.08em;text-transform:uppercase;color:#6b7f9a;margin-bottom:4px;">Observações</div><div class="pdf-obs-box">${d.observacoes}</div></div>` : ''}
    </div>

    <div class="pdf-section">
      <div class="pdf-section-title">7. Responsabilidade</div>
      <div class="pdf-grid-2" style="margin-bottom:12px;">
        <div class="pdf-field"><label>Técnico de Segurança</label><p>${d.tecnico}</p></div>
        <div class="pdf-field"><label>Matrícula / Registro</label><p>${d.registro}</p></div>
      </div>
      <div class="pdf-sig-grid">
        <div class="pdf-sig-box"><div class="pdf-sig-label">Assinatura — Técnico de Segurança</div></div>
        <div class="pdf-sig-box"><div class="pdf-sig-label">Assinatura — Responsável pelo Serviço</div></div>
      </div>
    </div>

    <div class="pdf-footer">
      <span>Nexform · Sistema de Permissão de Trabalho</span>
      <span>${d.pt} · ${d.emitidoEm}</span>
      <span>Este documento tem validade somente com assinaturas</span>
    </div>`;
  }

  // ── Generate PDF
  async function generatePDF() {
    const d = collectData();
    const missing = validate(d);
    if (missing.length) {
      alert('Preencha os campos obrigatórios:\n\n• ' + missing.join('\n• '));
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
        // multi-page
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

      pdf.save(`${d.pt}.pdf`);
      tpl.innerHTML = '';

      document.getElementById('modal-pt-num').textContent = d.pt;
      document.getElementById('success-overlay').classList.add('open');

    } catch (err) {
      alert('Erro ao gerar PDF. Tente novamente.');
      console.error(err);
    }

    btn.innerHTML = '<i class="bi bi-file-earmark-pdf"></i> Gerar Permissão de Trabalho';
    btn.disabled = false;
  }

  function closeModal() {
    document.getElementById('success-overlay').classList.remove('open');
    currentPT = genPTNumber();
    document.getElementById('pt-num').textContent = currentPT;
  }

  // Set today as default start date
  document.getElementById('data-inicio').valueAsDate = new Date();