import { recommend } from '../lib/concierge';

const root = document.querySelector<HTMLElement>('[data-heritage-assistant]');
if (root) {
  const tab = root.querySelector<HTMLButtonElement>('[data-heritage-open]')!;
  const drawer = root.querySelector<HTMLDialogElement>('#heritage-drawer')!;
  const close = root.querySelector<HTMLButtonElement>('[data-heritage-close]')!;
  const form = root.querySelector<HTMLFormElement>('[data-heritage-form]')!;
  const input = root.querySelector<HTMLTextAreaElement>('#heritage-question')!;
  const send = root.querySelector<HTMLButtonElement>('[data-heritage-send]')!;
  const status = root.querySelector<HTMLElement>('[data-heritage-status]')!;
  const messages = root.querySelector<HTMLElement>('[data-heritage-messages]')!;
  const conversation = root.querySelector<HTMLElement>('[data-heritage-conversation]')!;
  const prompts = Array.from(root.querySelectorAll<HTMLButtonElement>('[data-heritage-prompt]'));
  let saved: { x: number; y: number; overflow: string; gutter: string; focus: HTMLElement | null } | undefined;
  let busy = false;
  let frame = 0;

  const headerBottom = () => Math.max(0, ...Array.from(document.querySelectorAll<HTMLElement>('.site-header, .imap-page-header, .prototype-header')).map(header => header.getBoundingClientRect().bottom));
  function sizeDrawer() {
    const viewport = window.visualViewport;
    const bottom = (viewport?.height ?? window.innerHeight) + (viewport?.offsetTop ?? 0);
    // Never move the close control behind the site header to make room for a keyboard.
    const top = Math.min(bottom, Math.max(headerBottom(), viewport?.offsetTop ?? 0));
    drawer.style.setProperty('--heritage-drawer-top', `${top}px`);
    drawer.style.setProperty('--heritage-viewport-height', `${bottom}px`);
  }
  const setTabHidden = (hidden: boolean) => { if (tab.hidden !== hidden) tab.hidden = hidden; };
  function placeTab() {
    if (typeof drawer.showModal !== 'function') { setTabHidden(true); return; }
    if (drawer.open) { sizeDrawer(); setTabHidden(true); return; }
    if (document.querySelector('dialog[open], .mobile-menu[open]')) { setTabHidden(true); return; }
    // Move only this tab, never map controls, sheets, camera state or page sections.
    setTabHidden(false);
    const height = tab.offsetHeight || 170;
    const width = tab.offsetWidth || 44;
    const minimum = headerBottom() + height / 2 + 12;
    const maximum = window.innerHeight - height / 2 - 24;
    const blockers = Array.from(document.querySelectorAll<HTMLElement>('.leaflet-control, .map-toolbar, .imap-map-toolbar, .story-toolbar button, .imap-story-toolbar button, .sheet-handle button, .imap-handle button, .gallery-navigation button, .destination-video button, .hero-button')).filter(element => element.getClientRects().length).map(element => element.getBoundingClientRect()).filter(rect => rect.right > window.innerWidth - width - 8 && rect.left < window.innerWidth);
    const candidates: number[] = [];
    const center = Math.max(minimum, Math.min(window.innerHeight / 2, maximum));
    for (let offset = 0; offset <= window.innerHeight; offset += 24) candidates.push(center - offset, center + offset);
    const position = candidates.find(y => y >= minimum && y <= maximum && blockers.every(rect => y + height / 2 + 8 <= rect.top || y - height / 2 - 8 >= rect.bottom));
    setTabHidden(position === undefined);
    if (position !== undefined) tab.style.top = `${position}px`;
  }
  function schedulePosition() {
    if (frame) return;
    frame = requestAnimationFrame(() => { frame = 0; placeTab(); });
  }
  function openDrawer() {
    if (drawer.open || document.querySelector('dialog[open]')) return;
    saved = { x: window.scrollX, y: window.scrollY, overflow: document.documentElement.style.overflow, gutter: document.documentElement.style.scrollbarGutter, focus: document.activeElement instanceof HTMLElement ? document.activeElement : null };
    sizeDrawer();
    try { drawer.showModal(); }
    catch { saved = undefined; status.textContent = 'Trình duyệt chưa mở được bảng gợi ý. Vui lòng thử lại.'; return; }
    // Reserve the existing scrollbar space: locking the page must not resize the map.
    if (window.innerWidth > document.documentElement.clientWidth) document.documentElement.style.scrollbarGutter = 'stable';
    document.documentElement.style.overflow = 'hidden';
    tab.setAttribute('aria-expanded', 'true');
    setTabHidden(true);
  }
  function restorePage() {
    if (!saved) return;
    const previous = saved; saved = undefined;
    document.documentElement.style.overflow = previous.overflow;
    document.documentElement.style.scrollbarGutter = previous.gutter;
    tab.setAttribute('aria-expanded', 'false');
    // No URL/history changes and no calls to map/sheet/story controllers.
    window.scrollTo({ left: previous.x, top: previous.y, behavior: 'instant' });
    placeTab();
    if (previous.focus?.isConnected && previous.focus.getClientRects().length) previous.focus.focus({ preventScroll: true });
  }
  // Assistant interactions must not become outside-click actions for a map story.
  root.addEventListener('click', event => event.stopPropagation());
  tab.addEventListener('click', openDrawer);
  close.addEventListener('click', () => drawer.close());
  drawer.addEventListener('close', restorePage);
  drawer.addEventListener('cancel', event => { event.preventDefault(); drawer.close(); });
  drawer.addEventListener('keydown', event => {
    // Escape belongs to this modal, not an underlying selected map story.
    if (event.key === 'Escape') {
      event.preventDefault();
      event.stopPropagation();
      drawer.close();
    }
  }, { capture: true });
  drawer.addEventListener('click', event => { if (event.target === drawer && event.clientX < drawer.getBoundingClientRect().left) drawer.close(); });

  form.addEventListener('submit', event => {
    event.preventDefault();
    const query = input.value.trim();
    if (busy || !query) { if (!query) input.focus(); return; }
    busy = true; send.disabled = true; prompts.forEach(button => { button.disabled = true; });
    messages.setAttribute('aria-busy', 'true');
    status.textContent = 'Đang đối chiếu danh mục địa điểm có sẵn…';
    try {
      // Exact same local engine as the existing Heritage page, not an AI response.
      const result = recommend({ query, area: 'all', time: '', mobility: '', interests: [], requirements: [] });
      const turn = document.createElement('section'); turn.className = 'heritage-turn';
      const question = document.createElement('h4'); question.textContent = `Bạn hỏi: ${query}`; turn.append(question);
      const label = document.createElement('p');
      label.textContent = result.matches.length ? `Gợi ý từ danh mục hiện có: ${result.matches.length} địa điểm. Không phải phản hồi AI.` : 'Chưa có gợi ý phù hợp trong danh mục hiện có. AI hội thoại chưa được kết nối.';
      turn.append(label);
      if (result.matches.length) {
        const list = document.createElement('ul');
        for (const match of result.matches) {
          const item = document.createElement('li');
          const title = document.createElement('strong'); title.textContent = match.place.name;
          const reason = document.createElement('p'); reason.textContent = match.reason;
          item.append(title, reason); list.append(item);
        }
        turn.append(list);
      }
      for (const note of result.notes) { const paragraph = document.createElement('p'); paragraph.textContent = note; turn.append(paragraph); }
      messages.append(turn);
      input.value = '';
      status.textContent = result.matches.length ? `Đã đối chiếu: ${result.matches.length} gợi ý từ dữ liệu có sẵn.` : 'Đã đối chiếu: chưa có gợi ý phù hợp.';
      conversation.scrollTop = conversation.scrollHeight;
    } catch {
      status.textContent = 'Chưa thể đối chiếu danh mục. Câu hỏi được giữ lại; bạn hãy thử lại.';
    } finally {
      busy = false; send.disabled = false; prompts.forEach(button => { button.disabled = false; });
      messages.setAttribute('aria-busy', 'false');
    }
  });
  for (const button of prompts) button.addEventListener('click', () => { input.value = button.dataset.heritagePrompt!; form.requestSubmit(); });
  window.addEventListener('resize', schedulePosition);
  window.visualViewport?.addEventListener('resize', schedulePosition);
  window.visualViewport?.addEventListener('scroll', schedulePosition);
  document.addEventListener('scroll', schedulePosition, { passive: true, capture: true });
  const observer = new MutationObserver(records => { if (records.some(record => !root.contains(record.target))) schedulePosition(); });
  observer.observe(document.body, { subtree: true, childList: true, attributes: true, attributeFilter: ['class', 'hidden', 'open', 'data-sheet-state'] });
  window.addEventListener('pagehide', () => { if (drawer.open) drawer.close(); restorePage(); });
  window.addEventListener('pageshow', schedulePosition);
  if (typeof drawer.showModal === 'function') placeTab();
}
