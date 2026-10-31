const menuButton = document.querySelector('.menu-toggle');
const menu = document.querySelector('.main-nav');
const careSwitch = document.querySelector('.care-switch');
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

careButtons.forEach((button, index) => {
  button.addEventListener('click', () => {
    if (button.classList.contains('active')) return;
    careButtons.forEach((item) => {
      item.classList.remove('active');
      item.setAttribute('aria-pressed', 'false');
    });
    button.classList.add('active');
    button.setAttribute('aria-pressed', 'true');
    careSwitch.dataset.active = String(index);
    careSwitch.classList.remove('is-changing');
    void careSwitch.offsetWidth;
    careSwitch.classList.add('is-changing');
  });
});

