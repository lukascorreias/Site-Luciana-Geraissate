document.documentElement.classList.add('js');

const menuButton = document.querySelector('.menu-toggle');
const menu = document.querySelector('.main-nav');

const setMenuState = (open) => {
  menu?.classList.toggle('open', open);
  menuButton?.setAttribute('aria-expanded', String(open));
  const label = menuButton?.querySelector('.sr-only');
  if (label) label.textContent = open ? 'Fechar menu' : 'Abrir menu';
};

menuButton?.addEventListener('click', () => {
  setMenuState(!menu?.classList.contains('open'));
});

menu?.addEventListener('click', (event) => {
  if (!event.target.closest('a')) return;
  setMenuState(false);
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') setMenuState(false);
});

document.querySelectorAll('.faq-item button').forEach((button) => {
  button.addEventListener('click', () => {
    const item = button.closest('.faq-item');
    const open = !item.classList.contains('is-open');
    document.querySelectorAll('.faq-item.is-open').forEach((current) => {
      current.classList.remove('is-open');
      current.querySelector('button')?.setAttribute('aria-expanded', 'false');
    });
    item.classList.toggle('is-open', open);
    button.setAttribute('aria-expanded', String(open));
  });
});

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const revealItems = document.querySelectorAll('.reveal');

if (reducedMotion || !('IntersectionObserver' in window)) {
  revealItems.forEach((item) => item.classList.add('is-visible'));
} else {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px' });
  revealItems.forEach((item) => revealObserver.observe(item));
}

