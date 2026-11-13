document.documentElement.classList.add('js');

const topbar = document.querySelector('.topbar');
const hero = document.querySelector('.hero');
const updateTopbar = () => {
  if (!topbar || !hero) return;
  topbar.classList.toggle(
    'is-scrolled',
    hero.getBoundingClientRect().bottom <= topbar.getBoundingClientRect().bottom + 1
  );
};
window.addEventListener('scroll', updateTopbar, { passive: true });
window.addEventListener('resize', updateTopbar);
updateTopbar();

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
      current.querySelector('.faq-answer').hidden = true;
    });
    item.classList.toggle('is-open', open);
    button.setAttribute('aria-expanded', String(open));
    item.querySelector('.faq-answer').hidden = !open;
  });
});

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const revealItems = document.querySelectorAll('.reveal');

// Keep the three care steps visible while moving the emphasis along the path.
const careSteps = [...document.querySelectorAll('.care-timeline li')];
const careProcess = document.querySelector('.care-process');
let activeCareStep = 0;
let careTimer;
let careInView = false;
let careHovered = false;
let careFocused = false;
const activateCareStep = (index) => {
  activeCareStep = (index + careSteps.length) % careSteps.length;
  careSteps.forEach((item, itemIndex) => {
    item.classList.toggle('is-active', itemIndex === activeCareStep);
    item.querySelector('.timeline-hit')?.setAttribute('aria-pressed', String(itemIndex === activeCareStep));
  });
};
const syncCareTimer = () => {
  clearInterval(careTimer);
  if (reducedMotion || !careInView || careHovered || careFocused || document.hidden || careSteps.length < 2) return;
  careTimer = setInterval(() => activateCareStep(activeCareStep + 1), 3000);
};
careSteps.forEach((step, index) => {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'timeline-hit';
  button.setAttribute('aria-label', `Etapa ${index + 1}: ${step.querySelector('h3')?.textContent || ''}`);
  button.setAttribute('aria-pressed', String(index === 0));
  step.classList.toggle('is-active', index === 0);
  step.append(button);
  button.addEventListener('click', () => { activateCareStep(index); syncCareTimer(); });
  button.addEventListener('keydown', (event) => {
    if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return;
    event.preventDefault();
    const next = (index + (event.key === 'ArrowRight' ? 1 : careSteps.length - 1)) % careSteps.length;
    careSteps[next].querySelector('.timeline-hit')?.focus();
    careSteps[next].querySelector('.timeline-hit')?.click();
  });
});
if (careProcess && careSteps.length) {
  careProcess.addEventListener('pointerenter', () => { careHovered = true; syncCareTimer(); });
  careProcess.addEventListener('pointerleave', () => { careHovered = false; syncCareTimer(); });
  careProcess.addEventListener('focusin', () => { careFocused = true; syncCareTimer(); });
  careProcess.addEventListener('focusout', (event) => {
    if (careProcess.contains(event.relatedTarget)) return;
    careFocused = false;
    syncCareTimer();
  });
  document.addEventListener('visibilitychange', syncCareTimer);
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([entry]) => { careInView = entry.isIntersecting; syncCareTimer(); }, {threshold:0.35}).observe(careProcess);
  } else {
    careInView = true;
    syncCareTimer();
  }
}

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

// Complaint tabs and cards share a single selection. There is no autoplay.
const treatmentStepContent = [
  [['aliviar para começar','as técnicas manuais ajudam a diminuir o desconforto e preparam o corpo para os exercícios.'],['mover com segurança','os exercícios são ajustados à sua resposta para ganhar movimento e força aos poucos.'],['entender a dor','você aprende a reconhecer os sinais do corpo e a seguir ativo na rotina.']],
  [['recuperar o movimento','trabalhamos a mobilidade da articulação sem forçar além do que ela tolera.'],['fortalecer com cuidado','os exercícios aumentam de dificuldade conforme seu movimento melhora.'],['medir a evolução','comparamos a força ao longo do plano para orientar os próximos exercícios.']],
  [['medir o ponto de partida','testes de força mostram o que ainda precisa de atenção antes da volta.'],['treinar o movimento','exercícios graduais ajudam a recuperar estabilidade e confiança.'],['preparar o retorno','novos testes ajudam a decidir quando avançar para a atividade desejada.']],
  [['começar com apoio','os movimentos são adaptados à sua força e ao seu equilíbrio de hoje.'],['ganhar força na rotina','exercícios trabalham músculos usados para caminhar, levantar e carregar objetos.'],['treinar o equilíbrio','praticamos movimentos do dia a dia com apoio e progressão gradual.']],
  [['cuidar do inchaço','quando indicada, a drenagem pode ajudar a aliviar o inchaço após a cirurgia.'],['recuperar o movimento','técnicas manuais e exercícios respeitam a fase da sua recuperação.'],['reconstruir a força','a carga aumenta aos poucos, conforme a resposta do corpo e a orientação médica.']],
  [['medir o ponto de partida','avaliamos força e movimento para encontrar áreas que precisam de atenção.'],['montar um plano preventivo','com os resultados, escolhemos exercícios para reduzir o risco de novas lesões.']]
];
document.querySelectorAll('.treatment-steps').forEach((steps, cardIndex) => {
  const buttons = [...steps.querySelectorAll('button[data-step]')];
  const panel = steps.nextElementSibling;
  const progress = [...panel.querySelectorAll('.step-progress span')];
  const showStep = (index) => {
    buttons.forEach((button, i) => button.setAttribute('aria-pressed', String(i === index)));
    progress.forEach((part, i) => part.classList.toggle('is-complete', i <= index));
    panel.querySelector('.step-title').textContent = treatmentStepContent[cardIndex][index][0];
    panel.querySelector('.step-copy').textContent = treatmentStepContent[cardIndex][index][1];
    panel.classList.remove('is-changing');
    void panel.offsetWidth;
    if (!matchMedia('(prefers-reduced-motion: reduce)').matches) panel.classList.add('is-changing');
  };
  buttons.forEach((button, index) => button.addEventListener('click', () => showStep(index)));
  showStep(0);
});
document.querySelectorAll('[data-pain-carousel]').forEach((carousel) => {
  const track = carousel.querySelector('.pain-grid');
  const viewport = carousel.querySelector('.pain-viewport');
  const tabs = [...carousel.querySelectorAll('[role="tab"]')];
  const picker = carousel.querySelector('.complaint-picker');
  const pickerTrigger = picker.querySelector('.complaint-picker-trigger');
  const pickerValue = picker.querySelector('.complaint-picker-value');
  const pickerMenu = picker.querySelector('.complaint-picker-menu');
  const pickerOptions = [...pickerMenu.querySelectorAll('[data-complaint-index]')];
  const cards = [...track.querySelectorAll('.pain-card')];
  const tablist = carousel.querySelector('.complaint-tabs');
  const quoteGroup = carousel.querySelector('.complaint-quotes');
  const quotes = [...quoteGroup.querySelectorAll('.patient-quote')];
  let hasInteracted = false;
  const announcement = carousel.querySelector('.pain-announcement');
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let current = 0, phase = 0, step = 0, sideWidth = 0, centerWidth = 0, frame;
  let drag = null, suppressClick = false;
  let centerHeight = 330;
  const sideHeight = parseFloat(getComputedStyle(carousel).getPropertyValue('--pain-side-height')) || 270;
  const transitionDuration = parseFloat(getComputedStyle(carousel).getPropertyValue('--pain-motion-duration')) || 640;
  const arcDepth = parseFloat(getComputedStyle(carousel).getPropertyValue('--pain-arc-depth')) || 21;
  const tilt = parseFloat(getComputedStyle(carousel).getPropertyValue('--pain-tilt')) || 7;
  const bend = parseFloat(getComputedStyle(carousel).getPropertyValue('--pain-bend')) || 1.25;
  const recede = parseFloat(getComputedStyle(carousel).getPropertyValue('--pain-recede')) || 45;
  let curved = false;
  const wrap = (n) => (n % cards.length + cards.length) % cards.length;
  const slotFor = (i, position) => wrap(position - i + cards.length / 2) - cards.length / 2;
  const draw = (position) => {
    cards.forEach((card, i) => {
      const slot = slotFor(i, position);
      const distance = Math.abs(slot);
      const expansion = 1 - Math.min(distance, 1);
      card.style.width = `${sideWidth + (centerWidth - sideWidth) * expansion}px`;
      card.style.height = `${sideHeight + (centerHeight - sideHeight) * expansion}px`;
      const x = slot * step + Math.sign(slot) * Math.min(distance, 1) * (centerWidth - sideWidth) / 2;
      const arc = Math.min(distance, 2.5);
      const y = curved ? arc * arc * arcDepth : distance * distance * 12;
      const z = curved ? -arc * recede : 0;
      const turn = curved ? -Math.sign(slot) * Math.min(arc, 2) * tilt : 0;
      const roll = curved ? Math.sign(slot) * Math.min(arc, 2) * bend : 0;
      card.style.transform = `translateX(-50%) translate3d(${x}px, ${y}px, ${z}px) rotateY(${turn}deg) rotateZ(${roll}deg)`;
      card.style.visibility = distance > 2.55 ? 'hidden' : 'visible';
      card.style.zIndex = String(i === current ? 20 : 10 - Math.round(distance));
    });
  };
  const measureHeight = () => {
    track.style.setProperty('--pain-height', `${Math.max(330, centerHeight) + 100}px`);
  };
  const measureExpandedCards = () => {
    // Measure every complete panel at the center width before choosing a shared height.
    // This synchronous layout pass never reveals inactive content to the user.
    track.style.setProperty('--pain-center-width', `${centerWidth}px`);
    carousel.classList.add('is-measuring');
    centerHeight = Math.ceil(Math.max(...cards.map((card) => card.offsetHeight)));
    carousel.classList.remove('is-measuring');
    track.style.setProperty('--pain-card-height', `${centerHeight}px`);
    measureHeight();
  };
  const ensureTabVisible = () => {
    if (!tablist.clientWidth) return;
    const tab = tabs[current];
    const left = tab.offsetLeft;
    const right = left + tab.offsetWidth;
    if (left < tablist.scrollLeft + 12) tablist.scrollTo({left: Math.max(0, left - 12), behavior: 'instant'});
    else if (right > tablist.scrollLeft + tablist.clientWidth - 12) tablist.scrollTo({left: right - tablist.clientWidth + 12, behavior: 'instant'});
  };
  const setPickerOpen = (open, focusOption = false) => {
    pickerMenu.hidden = !open;
    pickerTrigger.setAttribute('aria-expanded', String(open));
    if (open && focusOption) pickerOptions[current].focus({preventScroll: true});
  };
  const sync = () => {
    cards.forEach((card, i) => {
      const active = i === current;
      card.classList.toggle('is-active', active);
      card.setAttribute('aria-hidden', String(!active));
      card.tabIndex = active ? 0 : -1;
      card.querySelector('.pain-detail').hidden = !active;
      quotes[i].hidden = !active || !hasInteracted;
      card.setAttribute('aria-describedby', active && hasInteracted ? quotes[i].id : '');
      tabs[i].setAttribute('aria-selected', String(active));
      tabs[i].tabIndex = active ? 0 : -1;
    });
    quoteGroup.hidden = !hasInteracted;
    pickerValue.textContent = tabs[current].textContent;
    pickerOptions.forEach((option, i) => option.setAttribute('aria-pressed', String(i === current)));
    ensureTabVisible();
  };
  function select(index, manual = true) {
    cancelAnimationFrame(frame);
    const target = wrap(index);
    // Keep the shortest route even when another selection interrupts a transition.
    const distance = wrap(target - phase + cards.length / 2) - cards.length / 2;
    const start = phase;
    const end = start + distance;
    current = target;
    if (manual) hasInteracted = true;
    sync();
    if (manual) announcement.textContent = `${current + 1} de 6: ${tabs[current].textContent}`;
    if (motion.matches || Math.abs(distance) < .001) {
      phase = current; draw(phase); measureHeight(); return;
    }
    // Keep the same reserved height throughout selection and movement.
    measureHeight();
    const started = performance.now();
    const tick = (now) => {
      const progress = Math.min((now - started) / transitionDuration, 1);
      const eased = progress * progress * (3 - 2 * progress);
      phase = start + (end - start) * eased;
      draw(phase);
      if (progress < 1) frame = requestAnimationFrame(tick);
      else { phase = current; draw(phase); measureHeight(); }
    };
    frame = requestAnimationFrame(tick);
  }
  const resize = () => {
    cancelAnimationFrame(frame);
    const available = track.clientWidth;
    curved = available > 1100;
    if (available > 1100) {
      // Center + three side widths + four gaps: outer card centers meet viewport edges.
      sideWidth = (available - 80) / 4.6;
      centerWidth = sideWidth * 1.6;
      step = sideWidth - 10;
    } else {
      centerWidth = available <= 760 ? available - 40 : Math.min(560, available * .68);
      sideWidth = centerWidth;
      step = available <= 760 ? available : centerWidth - 24;
    }
    phase = current;
    measureExpandedCards();
    draw(phase); ensureTabVisible();
  };
  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => select(i));
    tab.addEventListener('keydown', (event) => {
      const actions = {ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: cards.length - 1};
      if (!(event.key in actions)) return;
      event.preventDefault();
      const next = wrap(actions[event.key]);
      select(next);
      tabs[next].focus({preventScroll: true});
    });
  });
  pickerTrigger.addEventListener('click', () => setPickerOpen(pickerMenu.hidden));
  pickerTrigger.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      setPickerOpen(true, true);
    } else if (event.key === 'Escape') setPickerOpen(false);
  });
  pickerOptions.forEach((option, i) => {
    option.addEventListener('click', () => {
      select(i);
      setPickerOpen(false);
      pickerTrigger.focus({preventScroll: true});
    });
    option.addEventListener('keydown', (event) => {
      const actions = {ArrowDown: i + 1, ArrowUp: i - 1, Home: 0, End: pickerOptions.length - 1};
      if (event.key in actions) {
        event.preventDefault();
        pickerOptions[wrap(actions[event.key])].focus({preventScroll: true});
      } else if (event.key === 'Escape') {
        event.preventDefault();
        setPickerOpen(false);
        pickerTrigger.focus({preventScroll: true});
      } else if (event.key === 'Tab') setPickerOpen(false);
    });
  });
  document.addEventListener('pointerdown', (event) => {
    if (!picker.contains(event.target)) setPickerOpen(false);
  });
  matchMedia('(max-width: 1000px)').addEventListener('change', () => setPickerOpen(false));
  cards.forEach((card, i) => card.addEventListener('click', (event) => {
    if (!suppressClick && !event.target.closest('a, button') && i !== current) select(i);
  }));
  viewport.addEventListener('click', (event) => {
    if (!suppressClick) return;
    event.preventDefault(); event.stopPropagation(); suppressClick = false;
  }, true);
  viewport.addEventListener('pointerdown', (event) => {
    if (!event.isPrimary || event.button !== 0 || event.target.closest('a, button')) return;
    suppressClick = false;
    drag = {id: event.pointerId, x: event.clientX, y: event.clientY, dx: 0, active: false};
  });
  viewport.addEventListener('pointermove', (event) => {
    if (!drag || drag.id !== event.pointerId) return;
    const dx = event.clientX - drag.x;
    const dy = event.clientY - drag.y;
    if (!drag.active) {
      if (Math.abs(dy) > Math.abs(dx) && Math.abs(dy) > 8) { drag = null; return; }
      if (Math.abs(dx) < 8) return;
      drag.active = true;
      cancelAnimationFrame(frame);
      viewport.setPointerCapture(event.pointerId);
      viewport.classList.add('is-dragging');
    }
    drag.dx = dx;
    if (!motion.matches) { phase = current + Math.max(-1, Math.min(1, dx / step)); draw(phase); }
  });
  const endDrag = (event) => {
    if (!drag || drag.id !== event.pointerId) return;
    const {active, dx} = drag;
    drag = null;
    viewport.classList.remove('is-dragging');
    if (!active) return;
    suppressClick = true;
    if (viewport.hasPointerCapture(event.pointerId)) viewport.releasePointerCapture(event.pointerId);
    const direction = event.type !== 'pointercancel' && Math.abs(dx) > Math.min(64, step * .2) ? Math.sign(dx) : 0;
    select(current + direction, direction !== 0);
  };
  viewport.addEventListener('pointerup', endDrag);
  viewport.addEventListener('pointercancel', endDrag);
  carousel.classList.add('is-ready');
  sync(); resize();
  if ('ResizeObserver' in window) {
    // Width changes only: track height updates must not interrupt transitions.
    let lastWidth = carousel.clientWidth;
    const widthObserver = new ResizeObserver(() => {
      if (carousel.clientWidth !== lastWidth) { lastWidth = carousel.clientWidth; resize(); }
    });
    widthObserver.observe(carousel);
  } else window.addEventListener('resize', resize);
  document.fonts?.ready.then(resize);
  motion.addEventListener('change', () => { cancelAnimationFrame(frame); phase = current; draw(phase); measureHeight(); });
});

// Keep the fixed mobile action clear of the footer and its contact links.
const floatingWhatsapp = document.querySelector('.mobile-whatsapp');
const footer = document.querySelector('.site-footer');
if (floatingWhatsapp && footer && 'IntersectionObserver' in window) {
  new IntersectionObserver(([entry]) => { floatingWhatsapp.hidden = entry.isIntersecting; }, {rootMargin:'0px 0px 24px 0px'}).observe(footer);
}

// Preserve the full gold headline on one line at every viewport width.
const heroGoldLine = document.querySelector('#hero-title .hero-title-serif');
if (heroGoldLine) {
  const heroGoldText = heroGoldLine.querySelector('span');
  const fitHeroGoldLine = () => {
    heroGoldLine.style.fontSize = '';
    const available = heroGoldLine.clientWidth;
    const natural = heroGoldText.getBoundingClientRect().width;
    if (available && natural > available) {
      const size = parseFloat(getComputedStyle(heroGoldLine).fontSize);
      heroGoldLine.style.fontSize = `${size * available / natural * .97}px`;
    }
  };
  requestAnimationFrame(fitHeroGoldLine);
  window.addEventListener('resize', fitHeroGoldLine, {passive: true});
  document.fonts?.ready.then(fitHeroGoldLine);
}

