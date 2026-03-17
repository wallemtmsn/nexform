/* ============================================================
   NEXFORM — projetos/main.js
   Página de Portfólio / Cases
   Estrutura:
   1. Navbar — sempre com fundo na página de projetos
============================================================ */

/* ── 1. NAVBAR ── */
// Na página de projetos a navbar começa sempre com fundo,
// pois não há hero com scroll — o conteúdo começa no topo.
const nav = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 0);
});
