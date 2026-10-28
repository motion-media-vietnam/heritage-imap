document.querySelectorAll<HTMLElement>('[data-heritage-experiences]').forEach(section => {
  const track = section.querySelector<HTMLElement>('.experience-track');
  const cards = Array.from(section.querySelectorAll<HTMLElement>('[data-experience-card]'));
  const previous = section.querySelector<HTMLButtonElement>('[data-experience-prev]');
  const next = section.querySelector<HTMLButtonElement>('[data-experience-next]');
  const count = section.querySelector<HTMLElement>('[data-experience-count]');
  if (!track || !cards.length || !previous || !next || !count) return;
  let active = 0;
  let requestedFrame = 0;
  const targetOffset = (index: number) => {
    const start = cards[index].getBoundingClientRect().left - track.getBoundingClientRect().left + track.scrollLeft;
    return Math.max(0, Math.min(start, track.scrollWidth - track.clientWidth));
  };
  const update = () => {
    requestedFrame = 0;
    active = cards.reduce((nearest, _, index) =>
      Math.abs(track.scrollLeft - targetOffset(index)) < Math.abs(track.scrollLeft - targetOffset(nearest)) ? index : nearest, 0);
    previous.disabled = active === 0;
    next.disabled = active === cards.length - 1;
    count.textContent = String(active + 1).padStart(2, '0');
  };
  const move = (index: number) => track.scrollTo({
    left: targetOffset(Math.max(0, Math.min(index, cards.length - 1))),
    behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',
  });
  previous.addEventListener('click', () => move(active - 1));
  next.addEventListener('click', () => move(active + 1));
  track.addEventListener('scroll', () => {
    if (!requestedFrame) requestedFrame = requestAnimationFrame(update);
  }, { passive: true });
  track.addEventListener('keydown', event => {
    if (event.target !== track) return;
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    move(event.key === 'Home' ? 0 : event.key === 'End' ? cards.length - 1 : active + (event.key === 'ArrowRight' ? 1 : -1));
  });
  new ResizeObserver(update).observe(track);
  update();

});
