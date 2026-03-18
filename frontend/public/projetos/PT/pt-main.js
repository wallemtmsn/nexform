/* ============================================================
   NEXFORM — pt-main.js
   Sistema de Permissão de Trabalho — Nexform
   Estrutura:
    1. Mapeamento APR por Tipo de Trabalho
    2. Trigger APR dinâmica ao selecionar tipo de trabalho
    3. Número da PT (geração automática)
    4. Seletor de nível de risco
    5. Toggle checkboxes (riscos e medidas)
    6. Toggle EPIs (obrigatórios e opcionais)
    7. Limpar formulários
    8. Coleta de dados do formulário
    9. Validação de campos obrigatórios
   10. Geração do HTML do PDF
   11. Geração e download do PDF
   12. Modal de sucesso
   13. Dashboard — store de PTs e helpers
   14. Render do dashboard
   15. Filtros e busca
   16. Notificações de vencimento
   17. Login
   18. Navegação entre abas
============================================================ */

  // ── Dynamic APR mapping per job type
  const APR_MAP = {
    'Trabalho a Quente (solda, corte, esmerilhamento)': {
      precheck: ['incendio', 'projecao', 'temperatura', 'ruido'],
      extra: ['Queimaduras por fagulhas ou respingos', 'Intoxicação por fumos metálicos', 'Incêndio em materiais próximos', 'Explosão por atmosfera inflamável'],
      epi: ['Capacete', 'Óculos de Proteção', 'Protetor Facial', 'Luvas', 'Botina de Segurança', 'Protetor Auricular', 'Respirador / Máscara', 'Uniforme / Macacão'],
      risco: 'Alto',
    },
    'Trabalho em Altura (acima de 2 metros)': {
      precheck: ['queda-altura', 'projecao', 'ergonomico'],
      extra: ['Queda de ferramentas e objetos', 'Tombamento de estrutura ou plataforma', 'Colapso do ponto de ancoragem', 'Choque contra estruturas durante queda'],
      epi: ['Capacete', 'Cinto de Segurança', 'Botina de Segurança', 'Luvas', 'Óculos de Proteção', 'Colete Refletivo'],
      risco: 'Alto',
    },
    'Espaço Confinado': {
      precheck: ['aprisionamento', 'atmosfera-o2', 'agentes-quimicos', 'temperatura'],
      extra: ['Atmosfera tóxica ou explosiva', 'Afogamento ou soterramento interno', 'Colapso das paredes do espaço', 'Dificuldade de resgate em emergência'],
      epi: ['Capacete', 'Respirador / Máscara', 'Detector de Gás', 'Luvas', 'Botina de Segurança', 'Cinto de Segurança'],
      risco: 'Alto',
    },
    'Trabalho Elétrico (baixa tensão)': {
      precheck: ['choque-eletrico', 'incendio'],
      extra: ['Arco elétrico e flash', 'Queimaduras elétricas', 'Parada cardiorrespiratória por eletrocussão', 'Incêndio por curto-circuito'],
      epi: ['Capacete', 'Luva Dielétrica', 'Óculos de Proteção', 'Protetor Facial', 'Botina de Segurança'],
      risco: 'Médio',
    },
    'Trabalho Elétrico (alta tensão)': {
      precheck: ['choque-eletrico', 'incendio', 'queda-altura'],
      extra: ['Arco elétrico de alta energia', 'Eletrocussão fatal', 'Explosão de equipamentos sob tensão', 'Queimaduras graves por arco'],
      epi: ['Capacete', 'Luva Dielétrica', 'Óculos de Proteção', 'Protetor Facial', 'Botina de Segurança', 'Uniforme / Macacão'],
      risco: 'Alto',
    },
    'Içamento e Movimentação de Cargas': {
      precheck: ['queda-altura', 'ergonomico', 'projecao'],
      extra: ['Queda de carga sobre trabalhadores', 'Atropelamento por equipamento de movimentação', 'Esmagamento e prensamento de membros', 'Tombamento do equipamento de içamento', 'Ruptura de cabos ou correntes', 'Colisão com estruturas durante o içamento'],
      epi: ['Capacete', 'Luvas', 'Botina de Segurança', 'Colete Refletivo', 'Óculos de Proteção'],
      risco: 'Alto',
    },
    'Trabalho com Produtos Químicos / Perigosos': {
      precheck: ['agentes-quimicos', 'incendio', 'temperatura'],
      extra: ['Intoxicação por inalação de vapores', 'Queimadura química na pele ou olhos', 'Contaminação ambiental por derramamento', 'Reação química descontrolada'],
      epi: ['Capacete', 'Óculos de Proteção', 'Protetor Facial', 'Luvas', 'Respirador / Máscara', 'Uniforme / Macacão', 'Botina de Segurança'],
      risco: 'Alto',
    },
    'Escavação e Trabalho em Valas': {
      precheck: ['soterramento', 'agentes-quimicos', 'queda-altura'],
      extra: ['Soterramento por desmoronamento das paredes', 'Contato com tubulações enterradas (gás, elétrica)', 'Afogamento por acúmulo de água', 'Queda de pessoas ou objetos na vala'],
      epi: ['Capacete', 'Luvas', 'Botina de Segurança', 'Colete Refletivo', 'Óculos de Proteção'],
      risco: 'Alto',
    },
    'Bloqueio e Etiquetagem (LOTO)': {
      precheck: ['choque-eletrico', 'aprisionamento'],
      extra: ['Energização acidental do equipamento', 'Partida intempestiva de máquinas', 'Liberação de energia residual (molas, pressão)', 'Falha no bloqueio por dispositivo inadequado'],
      epi: ['Capacete', 'Luva Dielétrica', 'Óculos de Proteção', 'Botina de Segurança', 'Luvas'],
      risco: 'Médio',
    },
    'Trabalho em Linha Viva': {
      precheck: ['choque-eletrico', 'queda-altura', 'incendio'],
      extra: ['Eletrocussão por contato direto', 'Arco elétrico com energia elevada', 'Queda durante manobra na linha', 'Falha de EPI dielétrico'],
      epi: ['Capacete', 'Luva Dielétrica', 'Óculos de Proteção', 'Protetor Facial', 'Botina de Segurança', 'Uniforme / Macacão'],
      risco: 'Alto',
    },
  };

  // ── Trigger APR on job type change
  document.getElementById('tipo-trabalho').addEventListener('change', function () {
    const val = this.value;
    const map = APR_MAP[val];

    // Reset auto-checked base items
    document.querySelectorAll('#riscos-checklist .check-item').forEach(el => {
      if (el.classList.contains('auto-checked')) {
        el.classList.remove('auto-checked', 'checked');
        el.querySelector('.check-box').innerHTML = '';
      }
    });

    // Clear dynamic risks
    const dynWrap = document.getElementById('dynamic-risks-wrap');
    const dynList = document.getElementById('dynamic-risks-checklist');
    dynList.innerHTML = '';
    dynWrap.style.display = 'none';

    const banner = document.getElementById('apr-banner');

    if (!map) { banner.classList.remove('show'); return; }

    // Pre-check base risks
    map.precheck.forEach(riskKey => {
      const el = document.querySelector(`#riscos-checklist [data-risk="${riskKey}"]`);
      if (el && !el.classList.contains('checked')) {
        el.classList.add('auto-checked');
        el.querySelector('.check-box').innerHTML = '✓';
      }
    });

    // Inject dynamic extra risks
    if (map.extra && map.extra.length) {
      map.extra.forEach(label => {
        const div = document.createElement('div');
        div.className = 'check-item auto-checked';
        div.setAttribute('onclick', 'toggleCheck(this)');
        div.innerHTML = `<div class="check-box">✓</div> ${label} <span class="suggested-tag"><i class="bi bi-stars"></i> sugerido</span>`;
        dynList.appendChild(div);
      });
      dynWrap.style.display = 'block';
    }

    // Auto-select EPIs
    if (map.epi) {
      document.querySelectorAll('#epi-grid .epi-item').forEach(el => el.classList.remove('checked'));
      map.epi.forEach(epiName => {
        const el = [...document.querySelectorAll('#epi-grid .epi-item')].find(e => e.dataset.epi === epiName);
        if (el) el.classList.add('checked');
      });
    }

    // Auto-select risk level
    if (map.risco) {
      document.querySelectorAll('.risk-btn').forEach(b => b.className = 'risk-btn');
      selectedRisk = map.risco;
      const rKey = map.risco.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
      const btn = document.querySelector(`.risk-btn[data-risk="${map.risco}"]`);
      if (btn) btn.classList.add('active-' + rKey);
    }

    // Show banner
    document.getElementById('apr-banner-text').textContent =
      `Com base em "${val}", ${map.extra.length} riscos inerentes foram pré-marcados abaixo. Revise e ajuste conforme necessário.`;
    banner.classList.add('show');

    // Scroll to APR card smoothly
    setTimeout(() => banner.scrollIntoView({ behavior: 'smooth', block: 'center' }), 100);
  });

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
    const wasAuto = el.classList.contains('auto-checked');
    el.classList.remove('auto-checked');
    el.classList.toggle('checked');
    el.querySelector('.check-box').innerHTML = el.classList.contains('checked') ? '✓' : '';
  }

  // ── EPI toggle (mandatory items are always included)
  const MANDATORY_EPIS = ['Capacete', 'Óculos de Proteção', 'Botina de Segurança', 'Protetor Auricular'];
  function toggleEpi(el) {
    if (el.classList.contains('mandatory')) return;
    el.classList.toggle('checked');
  }

  // ── Clear form
  function clearForm() {
    if (!confirm('Limpar todos os campos?')) return;
    document.querySelectorAll('input, select, textarea').forEach(el => el.value = '');
    document.getElementById('tecnico').value = 'Carlos Eduardo Mendes';
    document.querySelectorAll('.check-item').forEach(el => {
      el.classList.remove('checked', 'auto-checked');
      el.querySelector('.check-box').innerHTML = '';
    });
    document.getElementById('dynamic-risks-checklist').innerHTML = '';
    document.getElementById('dynamic-risks-wrap').style.display = 'none';
    document.getElementById('apr-banner').classList.remove('show');
    document.querySelectorAll('#epi-grid .epi-item:not(.mandatory)').forEach(el => el.classList.remove('checked'));
    document.querySelectorAll('.risk-btn').forEach(b => b.className = 'risk-btn');
    selectedRisk = '';
    currentPT = genPTNumber();
    document.getElementById('pt-num').textContent = currentPT;
  }

  // ── Collect data
  function collectData() {
    const checkedRiscos = [
      ...[...document.querySelectorAll('#riscos-checklist .check-item')].filter(el => el.classList.contains('checked') || el.classList.contains('auto-checked')).map(el => el.childNodes[1]?.textContent?.trim() || el.textContent.trim()),
      ...[...document.querySelectorAll('#dynamic-risks-checklist .check-item')].filter(el => el.classList.contains('checked') || el.classList.contains('auto-checked')).map(el => el.childNodes[1]?.textContent?.trim() || el.textContent.replace('sugerido','').trim()),
    ];
    const checkedMedidas = [...document.querySelectorAll('#medidas-checklist .check-item.checked')].map(el => el.textContent.trim());
    const checkedEpis = [
      ...MANDATORY_EPIS,
      ...[...document.querySelectorAll('#epi-grid .epi-item.checked:not(.mandatory)')].map(el => el.dataset.epi),
    ];
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
      <div>
        <div class="pdf-logo">Nex<span>form</span></div>
        <div style="font-size:0.6rem;color:#6b7f9a;margin-top:3px;letter-spacing:0.06em;">Desenvolvido por Nexform</div>
      </div>
      <div class="pdf-title-block">
        <div style="font-size:0.65rem;letter-spacing:0.12em;text-transform:uppercase;color:#6b7f9a;margin-bottom:4px;">Brasil Port · Porto do Açu</div>
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
      <span>Brasil Port · Porto do Açu</span>
      <span>${d.pt} · ${d.emitidoEm}</span>
      <span>Powered by Nexform · Este documento tem validade somente com assinaturas</span>
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

      // Save to dashboard store
      addPTToStore(d);

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

  // ── LOGIN
  const DEMO_USERS = [
    { email: 'tecnico@brasilport.com.br', password: 'brasilport2025', name: 'Carlos Eduardo', role: 'Técnico de Segurança' },
    { email: 'admin@brasilport.com.br',   password: 'admin2025',       name: 'Administrador',  role: 'Administrador' },
  ];

  function togglePassword(btn) {
    const input = document.getElementById('login-password');
    const icon  = btn.querySelector('i');
    if (input.type === 'password') {
      input.type = 'text';
      icon.className = 'bi bi-eye-slash';
    } else {
      input.type = 'password';
      icon.className = 'bi bi-eye';
    }
  }

  // Allow Enter key to submit login
  document.getElementById('login-password').addEventListener('keydown', e => {
    if (e.key === 'Enter') doLogin();
  });
  document.getElementById('login-email').addEventListener('keydown', e => {
    if (e.key === 'Enter') document.getElementById('login-password').focus();
  });

  // ── TAB SWITCHING
  function switchTab(tab) {
    const dashScreen = document.getElementById('dashboard-screen');
    const formScreen = document.getElementById('form-screen');
    const tabDash    = document.getElementById('tab-dashboard');
    const tabForm    = document.getElementById('tab-form');

    if (tab === 'dashboard') {
      dashScreen.classList.add('active');
      formScreen.classList.add('hidden');
      tabDash.classList.add('active');
      tabForm.classList.remove('active');
      renderDashboard();
    } else {
      dashScreen.classList.remove('active');
      formScreen.classList.remove('hidden');
      tabDash.classList.remove('active');
      tabForm.classList.add('active');
    }
  }

  // ── PT STORE (session memory)
  let ptStore = [
    { pt: 'PT-2025-0841', empresa: 'Tecon Rio Grande', responsavel: 'João Ferreira', tipo: 'Trabalho em Altura (acima de 2 metros)', local: 'Cais 03 - Berço 12', risco: 'Alto', dataFim: offsetDate(2), status: 'ativa' },
    { pt: 'PT-2025-0840', empresa: 'Termave Logística', responsavel: 'Carla Mendes', tipo: 'Trabalho a Quente (solda, corte, esmerilhamento)', local: 'Armazém B - Área 4', risco: 'Alto', dataFim: offsetDate(0), status: 'ativa' },
    { pt: 'PT-2025-0839', empresa: 'Brasil Port', responsavel: 'Roberto Lima', tipo: 'Espaço Confinado', local: 'Tanque T-07', risco: 'Alto', dataFim: offsetDate(-1), status: 'vencida' },
    { pt: 'PT-2025-0838', empresa: 'Cargill Navegação', responsavel: 'Fernanda Souza', tipo: 'Içamento e Movimentação de Cargas', local: 'Pátio Externo Sul', risco: 'Médio', dataFim: offsetDate(-3), status: 'encerrada' },
    { pt: 'PT-2025-0837', empresa: 'Brasil Port', responsavel: 'Carlos Eduardo', tipo: 'Bloqueio e Etiquetagem (LOTO)', local: 'Subestação SE-02', risco: 'Médio', dataFim: offsetDate(1), status: 'ativa' },
    { pt: 'PT-2025-0836', empresa: 'Porto do Açu', responsavel: 'Marcio Dutra', tipo: 'Trabalho Elétrico (alta tensão)', local: 'Torre de Alta Tensão', risco: 'Alto', dataFim: offsetDate(0), status: 'ativa' },
  ];

  function offsetDate(days) {
    const d = new Date();
    d.setDate(d.getDate() + days);
    return d.toISOString().split('T')[0];
  }

  function addPTToStore(data) {
    const today = new Date();
    const fim   = new Date(data.dataFim || today);
    const diff  = Math.ceil((fim - today) / 86400000);
    const status = diff < 0 ? 'vencida' : 'ativa';
    ptStore.unshift({
      pt: data.pt,
      empresa: data.empresa,
      responsavel: data.responsavel,
      tipo: data.tipoTrabalho,
      local: data.local,
      risco: data.risco,
      dataFim: data.dataFim,
      status,
    });
  }

  // ── VALIDITY HELPERS
  function getDaysLeft(dataFim) {
    const today = new Date(); today.setHours(0,0,0,0);
    const end   = new Date(dataFim); end.setHours(0,0,0,0);
    return Math.ceil((end - today) / 86400000);
  }

  function resolveStatus(row) {
    if (row.status === 'encerrada') return 'encerrada';
    const d = getDaysLeft(row.dataFim);
    if (d < 0)  return 'vencida';
    if (d === 0) return 'vencendo';
    return 'ativa';
  }

  function fmtDate(s) {
    if (!s) return '—';
    const [y,m,d] = s.split('-');
    return `${d}/${m}/${y}`;
  }

  // ── RENDER DASHBOARD
  let currentFilter = 'todas';
  let currentSearch = '';

  function renderDashboard() {
    // Recalculate statuses
    const data = ptStore.map(r => ({ ...r, resolvedStatus: resolveStatus(r) }));

    const total     = data.length;
    const ativas    = data.filter(r => r.resolvedStatus === 'ativa').length;
    const vencendo  = data.filter(r => r.resolvedStatus === 'vencendo').length;
    const vencidas  = data.filter(r => r.resolvedStatus === 'vencida').length;

    document.getElementById('stat-total').textContent   = total;
    document.getElementById('stat-ativas').textContent  = ativas;
    document.getElementById('stat-vencendo').textContent= vencendo;
    document.getElementById('stat-vencidas').textContent= vencidas;

    // Badge on tab
    const badge = document.getElementById('badge-expiring');
    const alertCount = vencendo + vencidas;
    if (alertCount > 0) {
      badge.style.display = 'inline';
      badge.textContent = alertCount;
      badge.className = 'tab-badge' + (vencidas > 0 ? ' warning' : ' warning');
    } else {
      badge.style.display = 'none';
    }

    // Filter + search
    let filtered = data;
    if (currentFilter !== 'todas') filtered = filtered.filter(r => r.resolvedStatus === currentFilter);
    if (currentSearch) {
      const q = currentSearch.toLowerCase();
      filtered = filtered.filter(r =>
        r.pt.toLowerCase().includes(q) ||
        r.empresa.toLowerCase().includes(q) ||
        r.responsavel.toLowerCase().includes(q) ||
        r.tipo.toLowerCase().includes(q)
      );
    }

    const tbody = document.getElementById('pt-table-body');
    if (!filtered.length) {
      tbody.innerHTML = `<div class="empty-state"><i class="bi bi-file-earmark-x"></i><p>Nenhuma PT encontrada com esses filtros.</p></div>`;
      return;
    }

    tbody.innerHTML = filtered.map(r => {
      const d = getDaysLeft(r.dataFim);
      const st = r.resolvedStatus;

      const statusLabel = { ativa:'Ativa', encerrada:'Encerrada', vencida:'Vencida', vencendo:'Vencendo' }[st];
      const rowClass = st === 'vencendo' ? 'pt-row expiring' : st === 'vencida' ? 'pt-row expired' : 'pt-row';

      let validityHtml = '';
      if (st === 'encerrada') {
        validityHtml = `<span class="validity-cell ok">${fmtDate(r.dataFim)}</span>`;
      } else if (d < 0) {
        validityHtml = `<span class="validity-cell expired"><i class="bi bi-exclamation-circle"></i> Vencida há ${Math.abs(d)}d</span>`;
      } else if (d === 0) {
        validityHtml = `<span class="validity-cell warn"><i class="bi bi-clock"></i> Vence hoje</span>`;
      } else {
        validityHtml = `<span class="validity-cell ${d <= 2 ? 'warn' : 'ok'}">${fmtDate(r.dataFim)} · ${d}d</span>`;
      }

      const riskColor = r.risco === 'Alto' ? 'color:#dc2626' : r.risco === 'Médio' ? 'color:#d97706' : 'color:#16a34a';

      return `<div class="${rowClass}">
        <div class="pt-num-cell">${r.pt}</div>
        <div><div class="pt-cell">${r.empresa}</div><div class="pt-cell muted">${r.responsavel}</div></div>
        <div class="pt-cell muted" style="font-size:0.78rem;">${r.tipo}</div>
        <div class="pt-cell muted">${r.local}</div>
        <div><span style="font-size:0.75rem;font-weight:600;${riskColor}">${r.risco}</span></div>
        <div>${validityHtml}</div>
        <div><span class="status-pill status-${st}">${statusLabel}</span></div>
        <div class="row-action">
          <button class="row-btn" title="Ver detalhes"><i class="bi bi-eye"></i></button>
          ${st !== 'encerrada' ? `<button class="row-btn" title="Encerrar PT" onclick="encerrarPT('${r.pt}', event)"><i class="bi bi-x-lg"></i></button>` : ''}
        </div>
      </div>`;
    }).join('');
  }

  function filterPTs(btn) {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentFilter = btn.dataset.filter;
    renderDashboard();
  }

  function searchPTs(val) {
    currentSearch = val;
    renderDashboard();
  }

  function encerrarPT(ptNum, event) {
    event.stopPropagation();
    if (!confirm(`Encerrar a PT ${ptNum}?`)) return;
    const row = ptStore.find(r => r.pt === ptNum);
    if (row) { row.status = 'encerrada'; renderDashboard(); }
  }

  // ── NOTIFICATIONS
  function showNotification(msg, sub, type = 'warn') {
    const container = document.getElementById('notif-container');
    const id = 'notif-' + Date.now();
    const div = document.createElement('div');
    div.className = 'notif-toast' + (type === 'danger' ? ' danger' : '');
    div.id = id;
    div.innerHTML = `
      <div class="notif-icon"><i class="bi bi-${type === 'danger' ? 'exclamation-octagon' : 'clock-history'}"></i></div>
      <div class="notif-body"><strong>${msg}</strong><span>${sub}</span></div>
      <button class="notif-close" onclick="document.getElementById('${id}').remove()"><i class="bi bi-x"></i></button>`;
    container.appendChild(div);
    setTimeout(() => { if (document.getElementById(id)) document.getElementById(id).remove(); }, 7000);
  }

  function checkExpiringPTs() {
    ptStore.forEach(r => {
      const st = resolveStatus(r);
      if (st === 'vencendo') {
        showNotification(`PT ${r.pt} vence hoje`, `${r.empresa} · ${r.local}`, 'warn');
      } else if (st === 'vencida' && getDaysLeft(r.dataFim) >= -1) {
        showNotification(`PT ${r.pt} está vencida`, `Venceu em ${fmtDate(r.dataFim)} · ${r.empresa}`, 'danger');
      }
    });
  }

  // ── Set today as default start date
  document.getElementById('data-inicio').valueAsDate = new Date();

  // ── On login: trigger notifications after short delay
  const _origDoLogin = doLogin;
  function doLogin() {
    const email    = document.getElementById('login-email').value.trim().toLowerCase();
    const password = document.getElementById('login-password').value;
    const btn      = document.getElementById('btn-login');
    const errBox   = document.getElementById('login-error');
    const errMsg   = document.getElementById('login-error-msg');
    errBox.classList.remove('show');
    if (!email || !password) {
      errMsg.textContent = 'Preencha o e-mail e a senha para continuar.';
      errBox.classList.add('show'); return;
    }
    btn.disabled = true;
    btn.innerHTML = '<i class="bi bi-hourglass-split"></i> Verificando...';
    setTimeout(() => {
      const user = DEMO_USERS.find(u => u.email === email && u.password === password);
      if (user) {
        document.querySelector('.user-pill').innerHTML =
          `<i class="bi bi-person-circle"></i> ${user.name} &nbsp;·&nbsp; ${user.role}`;
        const screen = document.getElementById('login-screen');
        screen.classList.add('hidden');
        setTimeout(() => { screen.style.display = 'none'; checkExpiringPTs(); }, 500);
      } else {
        errMsg.textContent = 'E-mail ou senha incorretos. Verifique suas credenciais.';
        errBox.classList.add('show');
        document.getElementById('login-password').value = '';
        document.getElementById('login-password').focus();
        btn.disabled = false;
        btn.innerHTML = '<i class="bi bi-box-arrow-in-right"></i> Entrar no sistema';
      }
    }, 900);
  }

