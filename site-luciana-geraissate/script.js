const menuButton = document.querySelector('.menu-toggle');
const menu = document.querySelector('.main-nav');

menuButton?.addEventListener('click', () => {
  const open = menu.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(open));
});

menu?.addEventListener('click', (event) => {
  if (!event.target.closest('a')) return;
  menu.classList.remove('open');
  menuButton?.setAttribute('aria-expanded', 'false');
});

