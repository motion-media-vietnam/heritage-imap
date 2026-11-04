import { answerHeritage, defaultChips } from '../lib/hoi-heritage';
import { companion, companionPrompts } from '../data/national/companion';
import { translate, type Localized } from '../data/national/locale';
import type { CompanionReply } from '../lib/heritage-companion';
import { hasPassedOpeningHero } from '../lib/hero-visibility';

const root = document.querySelector<HTMLElement>('[data-heritage-assistant]');
if (root) {
  const national = import.meta.env.DEV && root.dataset.heritageScope === 'national';
  const lang = root.dataset.heritageLang === 'en' ? 'en' : 'vi';
  const t = (value: Localized) => translate(value, lang);
  const initialPrompts = national ? companionPrompts.map(item => t(item.question)) : defaultChips;
  const headerSelector = '.site-header, .imap-page-header, .prototype-header' + (national ? ', .n-header' : '');
  const openMenus = 'dialog[open], .mobile-menu[open]' + (national ? ', .n-menu[open]' : '');
  const tab = root.querySelector<HTMLButtonElement>('[data-heritage-open]')!;
  const drawer = root.querySelector<HTMLDialogElement>('#heritage-drawer')!;
  const close = root.querySelector<HTMLButtonElement>('[data-heritage-close]')!;
  const form = root.querySelector<HTMLFormElement>('[data-heritage-form]')!;
  const input = root.querySelector<HTMLTextAreaElement>('#heritage-question')!;
  const send = root.querySelector<HTMLButtonElement>('[data-heritage-send]')!;
  const status = root.querySelector<HTMLElement>('[data-heritage-status]')!;
  const messages = root.querySelector<HTMLElement>('[data-heritage-messages]')!;
  const conversation = root.querySelector<HTMLElement>('[data-heritage-conversation]')!;
  const suggestions = root.querySelector<HTMLElement>('[data-heritage-prompts]')!;
  const headerTriggers = Array.from(document.querySelectorAll<HTMLButtonElement>('[data-heritage-header-open]'));
  const openingHero = document.querySelector<HTMLElement>('[data-page-hero]');
  const setExpanded = (value: boolean) => { for (const trigger of [tab, ...headerTriggers]) trigger.setAttribute('aria-expanded', String(value)); };
  let saved: { x: number; y: number; overflow: string; gutter: string; focus: HTMLElement | null } | undefined;
  let busy = false;
  let frame = 0;

  const headerBottom = () => Math.max(0, ...Array.from(document.querySelectorAll<HTMLElement>(headerSelector)).map(header => header.getBoundingClientRect().bottom));
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
    if (document.querySelector(openMenus)) { setTabHidden(true); return; }
    if (!hasPassedOpeningHero(openingHero?.getBoundingClientRect().bottom ?? null, headerBottom())) { setTabHidden(true); return; }
    // Move only this tab, never map controls, sheets, camera state or page sections.
    setTabHidden(false);
    const height = tab.offsetHeight || 170;
    const width = tab.offsetWidth || 44;
    const minimum = headerBottom() + height / 2 + 12;
    const maximum = window.innerHeight - height / 2 - 24;
    const controls = '.leaflet-control, .map-toolbar, .imap-map-toolbar, .story-toolbar button, .imap-story-toolbar button, .sheet-handle button, .imap-handle button, .gallery-navigation button, .destination-video button, .hero-button'
      + (national ? ', .n-map-reset, .n-map-touch, .n-destination-list a, .n-hero-meta button, .n-hero-copy a, .n-text-link, .n-seasonal-selection summary' : '');
    const blockers = Array.from(document.querySelectorAll<HTMLElement>(controls)).filter(element => element.getClientRects().length).map(element => element.getBoundingClientRect()).filter(rect => rect.right > window.innerWidth - width - 8 && rect.left < window.innerWidth);
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
    catch { saved = undefined; status.textContent = national ? t(companion.unavailable) : 'Trình duyệt chưa mở được bảng gợi ý. Vui lòng thử lại.'; return; }
    // Reserve the existing scrollbar space: locking the page must not resize the map.
    if (window.innerWidth > document.documentElement.clientWidth) document.documentElement.style.scrollbarGutter = 'stable';
    document.documentElement.style.overflow = 'hidden';
    setExpanded(true);
    setTabHidden(true);
  }
  function restorePage() {
    if (!saved) return;
    const previous = saved; saved = undefined;
    document.documentElement.style.overflow = previous.overflow;
    document.documentElement.style.scrollbarGutter = previous.gutter;
    setExpanded(false);
    // No URL/history changes and no calls to map/sheet/story controllers.
    window.scrollTo({ left: previous.x, top: previous.y, behavior: 'instant' });
    placeTab();
    if (previous.focus?.isConnected && previous.focus.getClientRects().length) previous.focus.focus({ preventScroll: true });
    else if (national && !tab.hidden) tab.focus({ preventScroll: true });
  }
  // Assistant interactions must not become outside-click actions for a map story.
  root.addEventListener('click', event => event.stopPropagation());
  tab.addEventListener('click', openDrawer);
  for (const trigger of headerTriggers) trigger.addEventListener('click', () => {
    const menu = trigger.closest<HTMLDetailsElement>(national ? '.n-menu' : '.mobile-menu');
    if (menu) menu.open = false;
    openDrawer();
  });
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
  drawer.addEventListener('click', event => { if (event.target === drawer && (event.clientX < drawer.getBoundingClientRect().left || event.clientY < drawer.getBoundingClientRect().top)) drawer.close(); });

  if (national) drawer.addEventListener('click', event => {
    const link = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>('a[href^="#"]') : null;
    if (!link || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    drawer.addEventListener('close', () => {
      if (location.hash === link.hash) document.getElementById(link.hash.slice(1))?.scrollIntoView();
      else location.hash = link.hash;
    }, { once: true });
    drawer.close();
  });

  function addMessage(kind: 'bot' | 'user', body: string, reply?: CompanionReply) {
    const row = document.createElement('div'); row.className = `heritage-message ${kind}`;
    if (kind === 'bot') {
      const avatar = document.createElement('span'); avatar.className = 'heritage-avatar';
      avatar.textContent = 'H'; avatar.setAttribute('aria-hidden', 'true'); row.append(avatar);
    }
    const bubble = document.createElement('div'); bubble.className = 'heritage-bubble';
    if (kind === 'bot') {
      const label = document.createElement('div'); label.className = 'heritage-msg-label'; label.textContent = national && reply?.kind ? t(reply.kind === 'scripted' ? companion.scripted : companion.editorial) : 'HERITAGE'; bubble.append(label);
    }
    const copy = document.createElement('div'); copy.textContent = body;
    bubble.append(copy);
    if (national && reply?.href && reply.label) {
      const link = document.createElement('a');
      link.href = reply.href;
      link.textContent = reply.label + ' ↗';
      bubble.append(link);
    }
    row.append(bubble); messages.append(row);
  }
  function renderPrompts(items: string[]) {
    suggestions.replaceChildren();
    for (const text of items.slice(0, national ? 5 : 4)) {
      const button = document.createElement('button'); button.type = 'button'; button.textContent = text;
      button.addEventListener('click', () => { input.value = text; form.requestSubmit(); });
      suggestions.append(button);
    }
  }
  form.addEventListener('submit', async event => {
    event.preventDefault();
    const query = input.value.trim();
    if (busy || !query || query.length > input.maxLength) { input.focus({ preventScroll: true }); return; }
    busy = true; send.disabled = true; messages.setAttribute('aria-busy', 'true');
    try {
      if (national) {
        const { getCompanionReply } = await import('../lib/heritage-companion');
        const result = await getCompanionReply(query, lang);
        addMessage('user', query); addMessage('bot', result.text, result);
        renderPrompts(initialPrompts);
      } else {
        const result = answerHeritage(query);
        addMessage('user', query); addMessage('bot', result.reply); renderPrompts(result.chips);
      }
      input.value = ''; input.style.height = '';
      status.textContent = national ? t(companion.sent) : 'Đã trả lời bằng kịch bản demo.';
      conversation.scrollTop = conversation.scrollHeight;
    } catch {
      status.textContent = national ? t(companion.retry) : 'Chưa thể trả lời. Câu hỏi được giữ lại; bạn hãy thử lại.';
    } finally {
      busy = false; send.disabled = false; messages.setAttribute('aria-busy', 'false');
      input.focus({ preventScroll: true });
    }
  });
  input.addEventListener('keydown', event => {
    if (event.key === 'Enter' && !event.shiftKey && !event.isComposing) {
      event.preventDefault(); form.requestSubmit();
    }
  });
  input.addEventListener('input', () => {
    input.style.height = 'auto'; input.style.height = `${Math.min(input.scrollHeight, 107)}px`;
  });
  renderPrompts(initialPrompts);
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
