/* ============================================================
   NEXFORM — main.js
   Estrutura:
   1. Configuração
   2. Navbar — scroll
   3. Scroll reveal
   4. WhatsApp — montagem de mensagem
   5. Modal
============================================================ */

/* ── 1. CONFIGURAÇÃO ── */
/* ── 6. LINKS WHATSAPP DIRETOS ── */
const WA_NUMBER = '5522974047856';
const WA_MSG = encodeURIComponent('Olá! Vim pelo site da Nexform e gostaria de um estudo de caso para digitalizar meu processo.');

const waDirectLink = document.getElementById('wa-direct-link');
if (waDirectLink) {
  waDirectLink.href = `https://wa.me/${WA_NUMBER}?text=${WA_MSG}`;
}

/* ── 2. NAVBAR — muda aparência ao rolar ── */
const nav = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
});

/* ── 3. SCROLL REVEAL ── */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;

    // Aplica delay escalonado para elementos irmãos
    const siblings = [...entry.target.parentElement.querySelectorAll('.reveal')];
    const idx = siblings.indexOf(entry.target);
    setTimeout(() => entry.target.classList.add('visible'), idx * 90);

    revealObserver.unobserve(entry.target);
  });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ── 4. WHATSAPP ── */

/**
 * Monta a mensagem formatada para o WhatsApp.
 * @param {string} nome
 * @param {string} empresa
 * @param {string} tipo
 * @param {string} descricao
 * @returns {string} URL encoded message
 */
function buildWAMessage(nome, empresa, tipo, descricao) {
  let msg = 'Olá! Vim pelo site da Nexform e gostaria de um estudo de caso.\n\n';
  if (nome)      msg += `*Nome:* ${nome}\n`;
  if (empresa)   msg += `*Empresa:* ${empresa}\n`;
  if (tipo)      msg += `*Processo:* ${tipo}\n`;
  if (descricao) msg += `*Descrição:* ${descricao}\n`;
  msg += '\nAguardo o retorno!';
  return encodeURIComponent(msg);
}

/**
 * Lê os campos do formulário da seção de contato e abre o WhatsApp.
 */
function enviarWhatsApp() {
  const nome      = document.getElementById('c-nome')?.value.trim()    || '';
  const empresa   = document.getElementById('c-empresa')?.value.trim() || '';
  const tipo      = document.getElementById('c-tipo')?.value           || '';
  const descricao = document.getElementById('c-descricao')?.value.trim() || '';
  const url       = `https://wa.me/${WA_NUMBER}?text=${buildWAMessage(nome, empresa, tipo, descricao)}`;
  window.open(url, '_blank');
}

/**
 * Lê os campos do modal e abre o WhatsApp, fechando o modal em seguida.
 */
function enviarWhatsAppModal() {
  const nome      = document.getElementById('m-nome')?.value.trim()    || '';
  const empresa   = document.getElementById('m-empresa')?.value.trim() || '';
  const tipo      = document.getElementById('m-tipo')?.value           || '';
  const descricao = document.getElementById('m-descricao')?.value.trim() || '';
  const url       = `https://wa.me/${WA_NUMBER}?text=${buildWAMessage(nome, empresa, tipo, descricao)}`;
  closeModal();
  window.open(url, '_blank');
}

/* ── 5. MODAL ── */

/**
 * Abre o modal de contato.
 * @param {Event} [e]
 */
function openModal(e) {
  if (e) e.preventDefault();
  document.getElementById('contactModal').classList.add('open');
  document.body.style.overflow = 'hidden';
}

/** Fecha o modal de contato. */
function closeModal() {
  document.getElementById('contactModal').classList.remove('open');
  document.body.style.overflow = '';
}

/**
 * Fecha o modal ao clicar no fundo (overlay).
 * @param {MouseEvent} e
 */
function closeModalOutside(e) {
  if (e.target === document.getElementById('contactModal')) {
    closeModal();
  }
}

// Fecha modal com tecla Escape
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModal();
});
