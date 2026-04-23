const nav       = document.getElementById('nav');
const navToggle = document.getElementById('navToggle');
const navLinks  = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);
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
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeNav(); });
