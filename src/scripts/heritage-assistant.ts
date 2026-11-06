import { answerHeritage, defaultChips } from '../lib/hoi-heritage';
import { companion, companionPrompts } from '../data/national/companion';
import { translate, type Localized } from '../data/national/locale';
import type { CompanionReply } from '../lib/heritage-companion';
import { setupHeritageChatVisibility } from './heritage-chat-visibility';

const root = document.querySelector<HTMLElement>('[data-heritage-assistant]');
if (root) {
  const national = (import.meta.env.DEV || import.meta.env.PUBLIC_NATIONAL_APPROVAL === '1') && root.dataset.heritageScope === 'national';
  const lang = root.dataset.heritageLang === 'en' ? 'en' : 'vi';
  const t = (value: Localized) => translate(value, lang);
  const initialPrompts = national ? companionPrompts.map(item => t(item.question)) : defaultChips;
  const headerSelector = '.site-header, .imap-page-header, .prototype-header' + (national ? ', .n-header' : '');
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
  const setExpanded = (value: boolean) => { for (const trigger of [tab, ...headerTriggers]) trigger.setAttribute('aria-expanded', String(value)); };
  let saved: { overflow: string; gutter: string; focus: HTMLButtonElement } | undefined;
  let busy = false;

  const headerBottom = () => Math.max(0, ...Array.from(document.querySelectorAll<HTMLElement>(headerSelector)).map(header => header.getBoundingClientRect().bottom));
  function sizeDrawer() {
    const viewport = window.visualViewport;
    const bottom = (viewport?.height ?? window.innerHeight) + (viewport?.offsetTop ?? 0);
    // Never move the close control behind the site header to make room for a keyboard.
    const top = Math.min(bottom, Math.max(headerBottom(), viewport?.offsetTop ?? 0));
    drawer.style.setProperty('--heritage-drawer-top', `${top}px`);
    drawer.style.setProperty('--heritage-viewport-height', `${bottom}px`);
  }
  function focusTarget(trigger: HTMLButtonElement) {
    const menu = trigger.closest<HTMLDetailsElement>('details');
    return menu && !menu.open ? menu.querySelector('summary') : trigger;
  }
  function isOnScreen(element: HTMLElement | null): element is HTMLElement {
    if (!element || element.inert || !element.getClientRects().length) return false;
    const rect = element.getBoundingClientRect();
    return rect.bottom > 0 && rect.top < window.innerHeight;
  }
  function focusFallback() {
    // A header that has scrolled away must not pull the reader back to the top.
    const entry = headerTriggers.map(focusTarget).find(isOnScreen);
    const content = document.elementFromPoint(window.innerWidth / 2, window.innerHeight / 2)
      ?.closest<HTMLElement>('a[href], button, [data-heritage-chat-zone], section, main');
    const target = entry ?? content;
    if (!target) return;
    if (!target.matches('a[href], button, summary, [tabindex]')) target.tabIndex = -1;
    target.focus({ preventScroll: true });
  }
  const placeTab = setupHeritageChatVisibility({ root, tab, drawer, headerBottom, sizeDrawer, focusFallback });

  function openDrawer(trigger: HTMLButtonElement) {
    if (drawer.open || document.querySelector('dialog[open]')) return;
    saved = { overflow: document.documentElement.style.overflow, gutter: document.documentElement.style.scrollbarGutter, focus: trigger };
    sizeDrawer();
    try { drawer.showModal(); }
    catch { saved = undefined; status.textContent = national ? t(companion.unavailable) : 'Trình duyệt chưa mở được bảng gợi ý. Vui lòng thử lại.'; return; }
    // Reserve the existing scrollbar space: locking the page must not resize the map.
    if (window.innerWidth > document.documentElement.clientWidth) document.documentElement.style.scrollbarGutter = 'stable';
    document.documentElement.style.overflow = 'hidden';
    setExpanded(true);
    placeTab();
  }
  function restorePage() {
    if (!saved) return;
    const previous = saved; saved = undefined;
    const position = { left: window.scrollX, top: window.scrollY };
    document.documentElement.style.overflow = previous.overflow;
    document.documentElement.style.scrollbarGutter = previous.gutter;
    setExpanded(false);
    // No URL/history changes and no calls to map/sheet/story controllers.
    window.scrollTo({ ...position, behavior: 'instant' });
    placeTab();
    const target = focusTarget(previous.focus);
    if (isOnScreen(target)) target.focus({ preventScroll: true });
    else focusFallback();
  }
  // Assistant interactions must not become outside-click actions for a map story.
  root.addEventListener('click', event => event.stopPropagation());
  tab.addEventListener('click', () => openDrawer(tab));
  for (const trigger of headerTriggers) trigger.addEventListener('click', event => {
    event.stopPropagation();
    const menu = trigger.closest<HTMLDetailsElement>('details');
    if (menu) menu.open = false;
    openDrawer(trigger);
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
  window.addEventListener('pagehide', () => { if (drawer.open) drawer.close(); restorePage(); });
}
