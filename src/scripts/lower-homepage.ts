/** Homepage-only, dependency-free filtering and three-card desktop window.
 * Mobile ignores the desktop window and stacks all matching cards vertically.
 * No media/player code or network requests.
 */
document.querySelectorAll<HTMLElement>('[data-editorial-section="experiences"]').forEach(section => {
  const cards = Array.from(section.querySelectorAll<HTMLElement>('[data-editorial-card]'));
  const filters = Array.from(section.querySelectorAll<HTMLButtonElement>('[data-editorial-filter]'));
  const filterGroup = section.querySelector<HTMLElement>('[data-editorial-filters]');
  const controls = section.querySelector<HTMLElement>('[data-editorial-controls]');
  const previous = section.querySelector<HTMLButtonElement>('[data-editorial-prev]');
  const next = section.querySelector<HTMLButtonElement>('[data-editorial-next]');
  const status = section.querySelector<HTMLElement>('[data-editorial-status]');
  const empty = section.querySelector<HTMLElement>('[data-editorial-empty]');
  if (!filterGroup || !controls || !previous || !next || !status) return;
  let category = 'Tất cả';
  let start = 0;
  const update = () => {
    const matching = cards.filter(card => category === 'Tất cả' || card.dataset.category === category);
    start = Math.max(0, Math.min(start, matching.length - 3));
    cards.forEach(card => {
      const index = matching.indexOf(card);
      card.hidden = index < 0;
      card.toggleAttribute('data-window-hidden', index < start || index >= start + 3);
      card.dataset.rank = String(index - start);
    });
    filters.forEach(filter => filter.setAttribute('aria-pressed', String(filter.dataset.editorialFilter === category)));
    previous.disabled = start === 0;
    next.disabled = start + 3 >= matching.length;
    controls.hidden = matching.length <= 3;
    if (empty) {
      empty.hidden = matching.length !== 0;
      empty.textContent = `Chưa có trải nghiệm trong danh mục ${category}.`;
    }
    status.textContent = matching.length === 0 ? '0 trải nghiệm' : `${start + 1}–${Math.min(start + 3, matching.length)} / ${matching.length} trải nghiệm`;
  };
  filters.forEach(filter => filter.addEventListener('click', () => {
    category = filter.dataset.editorialFilter || 'Tất cả';
    start = 0;
    update();
  }));
  previous.addEventListener('click', () => { start -= 1; update(); });
  next.addEventListener('click', () => { start += 1; update(); });
  filterGroup.hidden = false;
  update();
});
