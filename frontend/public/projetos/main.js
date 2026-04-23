/* ============================================================
   NEXFORM — projetos/main.js
   Página de Portfólio / Cases
   Estrutura:
   1. Navbar — sempre com fundo na página de projetos
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
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeNav(); });
