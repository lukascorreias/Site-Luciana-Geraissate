const menuButton = document.querySelector('.menu-toggle');
const menu = document.querySelector('.main-nav');
const careButtons = [...document.querySelectorAll('.care-switch button')];

menuButton?.addEventListener('click', () => {
  const open = menu.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(open));
});

menu?.addEventListener('click', (event) => {
  if (!event.target.closest('a')) return;
  menu.classList.remove('open');
  menuButton?.setAttribute('aria-expanded', 'false');
});

careButtons.forEach((button) => {
  button.addEventListener('click', () => {
    careButtons.forEach((item) => item.classList.remove('active'));
    button.classList.add('active');
  });
});

