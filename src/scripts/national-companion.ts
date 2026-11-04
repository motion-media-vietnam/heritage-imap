import { companion } from '../data/national/companion';
import { translate } from '../data/national/locale';
import { getCompanionReply } from '../lib/heritage-companion';

const root = document.querySelector<HTMLElement>('[data-national-companion]');
if (root) {
  const lang = root.dataset.lang === 'en' ? 'en' : 'vi';
  const t = (value: Parameters<typeof translate>[0]) => translate(value, lang);
  const dialog = root.querySelector<HTMLDialogElement>('#companion-dialog')!;
  const start = root.querySelector<HTMLFormElement>('[data-companion-start]')!;
  const followUp = root.querySelector<HTMLFormElement>('[data-companion-followup]')!;
  const input = followUp.querySelector('textarea')!;
  const transcript = root.querySelector<HTMLElement>('[data-companion-transcript]')!;
  const status = root.querySelector<HTMLElement>('[data-companion-status]')!;
  const send = followUp.querySelector<HTMLButtonElement>('button')!;
  let pending = false;
  let trigger: HTMLElement | null = null;

  function message(label: string, text: string, kind: 'question' | 'reply') {
    const row = document.createElement('article');
    row.dataset.companionMessage = kind;
    const speaker = document.createElement('strong');
    speaker.textContent = label;
    const copy = document.createElement('p');
    copy.textContent = text;
    row.append(speaker, copy);
    transcript.append(row);
    return row;
  }

  async function ask(value: string) {
    const question = value.trim().slice(0, 600);
    if (!question || pending) return false;
    if (!dialog.open) {
      trigger = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      try { dialog.showModal(); }
      catch { status.textContent = t(companion.unavailable); return false; }
    }
    pending = true;
    send.disabled = true;
    message(t(companion.you), question, 'question');
    try {
      const reply = await getCompanionReply(question, lang);
      const row = message(t(reply.scripted ? companion.scripted : companion.title), reply.text, 'reply');
      if (reply.href && reply.label) {
        const link = document.createElement('a');
        link.href = reply.href;
        link.textContent = reply.label + ' ↗';
        row.append(link);
      }
    } catch {
      message(t(companion.title), t(companion.offline), 'reply');
    } finally {
      pending = false;
      send.disabled = false;
      transcript.scrollTop = transcript.scrollHeight;
    }
    return true;
  }

  for (const form of [start, followUp]) {
    form.addEventListener('submit', event => {
      event.preventDefault();
      const value = new FormData(form).get('question');
      if (typeof value !== 'string') return;
      void ask(value).then(accepted => { if (accepted && new FormData(form).get('question') === value) form.reset(); });
    });
  }
  start.querySelector<HTMLButtonElement>('button')!.disabled = false;
  root.querySelectorAll<HTMLButtonElement>('[data-companion-chip]').forEach(chip => {
    chip.disabled = false;
    chip.addEventListener('click', () => void ask(chip.textContent ?? ''));
  });
  dialog.addEventListener('click', event => {
    if (event.target instanceof Element && event.target.closest('[data-companion-transcript] a[href^="#"]')) dialog.close();
  });
  dialog.addEventListener('close', () => {
    trigger?.focus({ preventScroll: true });
    trigger = null;
  });
  dialog.addEventListener('keydown', event => {
    if (event.key === 'Enter' && !event.shiftKey && !event.isComposing && event.target === input) {
      event.preventDefault();
      followUp.requestSubmit();
    }
  });
}
