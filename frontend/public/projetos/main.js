/* ============================================================
   NEXFORM — projetos/main.js
   Estrutura:
   1. Navbar
   2. Dados dos projetos (para o modal mobile)
   3. Modal mobile
============================================================ */

/* ── 1. NAVBAR ── */
const nav       = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const navLinks  = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 0);
});

function toggleNav() {
  const open = navToggle.classList.toggle('open');
  navLinks.classList.toggle('open', open);
  document.body.style.overflow = open ? 'hidden' : '';
}

function closeNav() {
  navToggle.classList.remove('open');
  navLinks.classList.remove('open');
  document.body.style.overflow = '';
}

navToggle.addEventListener('click', toggleNav);
navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', closeNav));

/* ── 2. DADOS DOS PROJETOS ── */
const PROJECTS = {
  pt: {
    module: 'module_01.form · module_02.analytics · module_03.compliance',
    title: 'Sistema de Emissão de Permissão de Trabalho',
    desc: 'Digitalização completa do processo de PT para operações portuárias. O técnico preenche o formulário com análise de riscos automatizada e gera o PDF assinado — tudo em minutos, sem papel.',
    tags: ['Formulário Digital', 'APR Dinâmica', 'Geração de PDF', 'Dashboard', 'Notificações', 'LGPD', 'Multi-perfil'],
    features: [
      { icon: 'bi-shield-check',   title: 'APR dinâmica por tipo de trabalho',  desc: 'Ao selecionar o tipo de serviço, os riscos inerentes e EPIs obrigatórios são sugeridos automaticamente.' },
      { icon: 'bi-file-earmark-pdf', title: 'Geração de PDF formatado',          desc: 'A PT é gerada como documento PDF pronto para impressão e assinatura, com número de controle único.' },
      { icon: 'bi-grid-1x2',       title: 'Dashboard com status de validade',    desc: 'Painel com todas as PTs emitidas, indicando quais estão ativas, vencendo ou encerradas.' },
      { icon: 'bi-bell',           title: 'Notificações de vencimento',          desc: 'Alertas automáticos ao fazer login quando há PTs próximas do vencimento ou já expiradas.' },
      { icon: 'bi-person-badge',   title: 'Login por perfil de usuário',         desc: 'Acesso controlado por credenciais — cada usuário vê apenas o que é pertinente ao seu perfil.' },
    ],
    route: '../pt/',
  },
  os: {
    module: 'module_01.form · module_02.status · module_03.pdf',
    title: 'Sistema de Ordem de Serviço Digital',
    desc: 'Emissão digital de Ordens de Serviço para equipes de manutenção. Abertura, classificação por tipo e prioridade, checklist de materiais e segurança, e geração de PDF com número de controle único.',
    tags: ['Ordem de Serviço', 'Manutenção', 'Geração de PDF', 'Checklist', 'Prioridade', 'LOTO'],
    features: [
      { icon: 'bi-list-check',     title: 'Fluxo de status da OS',               desc: 'Acompanhamento do ciclo Aberta → Em Andamento → Concluída para rastreabilidade completa.' },
      { icon: 'bi-tools',          title: 'Classificação por tipo e prioridade', desc: 'Quatro tipos de manutenção e quatro níveis de prioridade, incluindo Crítica.' },
      { icon: 'bi-file-earmark-pdf', title: 'Geração de PDF com número único',  desc: 'A OS é exportada como PDF formatado com número OS-YYYY-NNNN, pronto para impressão.' },
      { icon: 'bi-box-seam',       title: 'Checklist de materiais e ferramentas', desc: 'Seleção visual dos recursos necessários para execução, registrados diretamente no documento.' },
      { icon: 'bi-shield-check',   title: 'Medidas de segurança integradas',     desc: 'LOTO, área isolada, EPI em uso, DDS realizado e plano de resgate como checklist obrigatório.' },
    ],
    route: '../os/',
  },
  checklist: {
    module: 'module_01.form · module_02.checklist · module_03.pdf',
    title: 'Sistema de Checklist de Inspeção',
    desc: 'Checklists digitais para inspeções de segurança em campo, organizados por grupos de verificação, com resultado consolidado e geração de relatório PDF com trilha de auditoria.',
    tags: ['Checklist', 'Inspeção', 'Geração de PDF', 'Auditoria', 'Segurança', 'LOTO'],
    features: [
      { icon: 'bi-list-check',       title: '4 grupos de verificação',           desc: 'Segurança física, EPIs, Documentação e Condições operacionais — cada item marcado individualmente.' },
      { icon: 'bi-clipboard2-check', title: 'Tipo e resultado da inspeção',      desc: 'Classificação por tipo (Rotineira, Pré-operacional, Periódica, Extraordinária) e resultado final.' },
      { icon: 'bi-file-earmark-pdf', title: 'Relatório PDF com número CI',       desc: 'Documento completo com número CI-YYYY-NNNN, todos os itens verificados e ações corretivas.' },
      { icon: 'bi-exclamation-triangle', title: 'Registro de não conformidades', desc: 'Campo dedicado para NCs e ações corretivas recomendadas, incluídas no PDF gerado.' },
      { icon: 'bi-pen',              title: 'Assinaturas e responsabilidade',    desc: 'Campos de assinatura para inspetor e supervisor, com matrícula registrada no documento.' },
    ],
    route: '../checklist/',
  },
  admissao: {
    module: 'module_01.form · module_02.docs · module_03.pdf',
    title: 'Sistema de Formulário de Admissão',
    desc: 'Digitalização completa do processo de admissão de colaboradores — dados pessoais, endereço, contato, dados profissionais, checklist de documentos, saúde ocupacional e geração de PDF assinado.',
    tags: ['Admissão', 'RH', 'Geração de PDF', 'Documentação', 'ASO', 'LGPD'],
    features: [
      { icon: 'bi-person',         title: 'Cadastro completo do colaborador',   desc: '7 seções cobrindo dados pessoais, endereço, contato, dados profissionais, documentação, saúde e RH.' },
      { icon: 'bi-folder-check',   title: 'Checklist de documentação',          desc: '12 documentos rastreados: RG, CPF, PIS, CTPS, comprovante, foto, ASO e mais.' },
      { icon: 'bi-heart-pulse',    title: 'Saúde ocupacional integrada',        desc: 'Registro do ASO com data, resultado (Apto / Com Restrições / Inapto) e observações médicas.' },
      { icon: 'bi-file-earmark-pdf', title: 'PDF completo com número ADM',      desc: 'Documento com número ADM-YYYY-NNNN, todos os dados do colaborador e campos de assinatura.' },
      { icon: 'bi-shield-lock',    title: 'Conformidade LGPD',                  desc: 'Coleta controlada de dados sensíveis com geração de documento formal para arquivo e trilha legal.' },
    ],
    route: '../admissao/',
  },
  epi: {
    module: 'module_01.form · module_02.nr6 · module_03.pdf',
    title: 'Sistema de Ficha de Entrega de EPI',
    desc: 'Controle digital obrigatório de entrega de Equipamentos de Proteção Individual, conforme NR-6. Registro por colaborador com Nº CA de cada EPI, motivo da entrega, data e geração de ficha PDF com assinaturas.',
    tags: ['EPI', 'NR-6', 'Geração de PDF', 'Nº CA', 'RH / Segurança', 'MTE'],
    features: [
      { icon: 'bi-table',              title: 'Tabela dinâmica de EPIs',         desc: 'Adicione quantos EPIs precisar com Nº CA, quantidade, data e motivo da entrega.' },
      { icon: 'bi-patch-check',        title: 'Nº CA por item (exigência legal)', desc: 'Campo dedicado ao Certificado de Aprovação do INMETRO — requisito obrigatório da NR-6.' },
      { icon: 'bi-file-earmark-pdf',   title: 'PDF com número FE único',         desc: 'Documento com número FE-YYYY-NNNN, tabela completa dos EPIs e declaração legal de ciência.' },
      { icon: 'bi-shield-fill-check',  title: 'Declaração NR-6 integrada',       desc: 'Texto legal de responsabilidade incluído na ficha — declaração de ciência sobre uso correto do EPI.' },
      { icon: 'bi-person-lines-fill',  title: 'Identificação completa',          desc: 'Dados do colaborador (CPF, cargo, setor) e do responsável pela entrega — trilha de auditoria completa.' },
    ],
    route: '../epi/',
  },
  rnc: {
    module: 'module_01.form · module_02.iso9001 · module_03.pdf',
    title: 'Sistema de Registro de Não Conformidade',
    desc: 'Gestão completa do ciclo de vida de não conformidades conforme ISO 9001:2015. Da detecção ao encerramento: contenção, análise de causa raiz (5 Porquês ou Ishikawa), ação corretiva e verificação de eficácia.',
    tags: ['ISO 9001:2015', 'RNC', '5 Porquês', 'Ishikawa', 'Ação Corretiva', 'SGQ'],
    features: [
      { icon: 'bi-search',             title: 'Análise de causa raiz com 3 ferramentas', desc: '5 Porquês encadeados, Diagrama de Ishikawa (6M) ou análise livre — selecionável no formulário.' },
      { icon: 'bi-wrench-adjustable',  title: 'Ação corretiva e preventiva separadas',  desc: 'Campos distintos para eliminar a causa da NC atual e para evitar recorrência em outros processos.' },
      { icon: 'bi-patch-check',        title: 'Verificação de eficácia rastreável',      desc: 'Campo dedicado para evidenciar se a ação corretiva foi eficaz, com data, verificador e evidência.' },
      { icon: 'bi-file-earmark-pdf',   title: 'PDF com referências normativas',          desc: 'Documento RNC-YYYY-NNNN com 9 seções e cláusulas ISO referenciadas, pronto para auditoria.' },
      { icon: 'bi-diagram-3',          title: 'Classificação completa da NC',            desc: 'Tipo, origem, gravidade (Crítica/Maior/Menor) e controle de reincidência com referência à RNC anterior.' },
    ],
    route: '../rnc/',
  },
};

/* ── 3. MODAL MOBILE ── */
const modalOverlay = document.getElementById('mobileModal');
const modalBody    = document.getElementById('modalBody');
const modalClose   = document.getElementById('modalClose');

function openModal(projectId) {
  const p = PROJECTS[projectId];
  if (!p) return;

  modalBody.innerHTML = `
    <div class="modal-live">
      <div class="pf-dot"></div>
      <span class="pf-status-label">live</span>
    </div>
    <p class="modal-module">${p.module}</p>
    <h2 class="modal-title">${p.title}</h2>
    <p class="modal-desc">${p.desc}</p>
    <div class="modal-tags">
      ${p.tags.map(t => `<span>${t}</span>`).join('')}
    </div>
    <p class="modal-features-label">funcionalidades</p>
    <ul class="modal-features">
      ${p.features.map(f => `
        <li>
          <div class="modal-feat-icon"><i class="bi ${f.icon}"></i></div>
          <div>
            <strong>${f.title}</strong>
            <span>${f.desc}</span>
          </div>
        </li>
      `).join('')}
    </ul>
    <a href="${p.route}" class="modal-access-btn">
      <i class="bi bi-box-arrow-in-right"></i> acessar sistema
    </a>
    <p class="modal-access-note">// requer login com credenciais NEXFORMS</p>
  `;

  modalOverlay.setAttribute('aria-hidden', 'false');
  modalOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  modalOverlay.classList.remove('open');
  modalOverlay.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

/* Clique nos cards só abre modal no mobile */
document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('click', () => {
    if (window.innerWidth < 768) {
      openModal(card.dataset.id);
    }
  });
});

modalClose.addEventListener('click', closeModal);

/* Fechar ao clicar no backdrop */
modalOverlay.addEventListener('click', e => {
  if (e.target === modalOverlay) closeModal();
});

/* Fechar com Escape */
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    closeModal();
    closeNav();
  }
});
