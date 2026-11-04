const hero = document.querySelector<HTMLElement>('[data-national-hero]');
if (hero) {
  const slides = [...hero.querySelectorAll<HTMLElement>('[data-slide]')];
  const indicators = [...hero.querySelectorAll<HTMLButtonElement>('[data-slide-to]')];
  const controls = hero.querySelector<HTMLElement>('[data-slide-controls]')!;
  const caption = hero.querySelector<HTMLElement>('[data-slide-caption]')!;
  const pause = hero.querySelector<HTMLButtonElement>('[data-slide-pause]')!;
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  let index = 0;
  let playing = !motion.matches;
  let timer: number | undefined;
  let requested = 0;

  function schedule() {
    window.clearTimeout(timer);
    if (playing && !document.hidden) timer = window.setTimeout(() => void select(index + 1), Number(hero!.dataset.interval));
  }

  async function select(target: number) {
    const request = ++requested;
    const next = (target + slides.length) % slides.length;
    const slide = slides[next]!;
    const template = slide.querySelector('template');
    if (template) {
      const img = template.content.querySelector('img')!;
      img.loading = 'eager';
      template.replaceWith(img);
    }
    try { await slide.querySelector('img')?.decode(); } catch { /* Keep navigation usable if an image fails. */ }
    if (request !== requested) return;
    index = next;
    slides.forEach((element, i) => {
      element.classList.toggle('is-current', i === index);
      element.setAttribute('aria-hidden', String(i !== index));
    });
    indicators.forEach((button, i) => {
      if (i === index) button.setAttribute('aria-current', 'true');
      else button.removeAttribute('aria-current');
    });
    caption.textContent = slide.dataset.caption ?? '';
    schedule();
  }

  function setPlaying(value: boolean) {
    playing = value;
    pause.textContent = playing ? 'Ⅱ' : '▶';
    pause.setAttribute('aria-label', (playing ? hero!.dataset.pause : hero!.dataset.play) ?? '');
    schedule();
  }

  function navigate(next: number) {
    setPlaying(false);
    void select(next);
  }

  controls.hidden = false;
  hero.querySelector('[data-slide-prev]')?.addEventListener('click', () => navigate(index - 1));
  hero.querySelector('[data-slide-next]')?.addEventListener('click', () => navigate(index + 1));
  indicators.forEach((button, i) => button.addEventListener('click', () => navigate(i)));
  pause.addEventListener('click', () => setPlaying(!playing));
  motion.addEventListener('change', () => { if (motion.matches) setPlaying(false); });
  document.addEventListener('visibilitychange', schedule);
  setPlaying(playing);
}
