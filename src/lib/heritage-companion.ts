import { companion, companionPrompts } from '../data/national/companion.ts';
import { translate, type Language } from '../data/national/locale.ts';
import { destinationRoutes } from './destination-routes.ts';

type CompanionReply = { text: string; scripted?: boolean; href?: string; label?: string };

/** Local adapter for the shared Hỏi Heritage experience. Replace with the approved service when available. */
export async function getCompanionReply(question: string, lang: Language): Promise<CompanionReply> {
  const normalized = ' ' + question.toLowerCase().normalize('NFD').replace(/\p{M}/gu, '')
    .replace(/đ/g, 'd').replace(/[^a-z0-9]+/g, ' ').trim() + ' ';
  const matches = companionPrompts.filter(entry => entry.terms.some(term => normalized.includes(' ' + term + ' ')));
  const destination = matches.length === 1 ? matches[0]?.id : undefined;
  const t = (value: Parameters<typeof translate>[0]) => translate(value, lang);
  if (destination === 'hanoi') {
    const hanoi = { href: destinationRoutes(destination).home + 'heritage-mach-ban/', label: t(companion.hanoiCollection) };
    const threeDays = /\b(?:3|ba) ngay\b|\b(?:3|three) days?\b/.test(normalized);
    if (threeDays) return { text: t(companion.hanoiThreeDays), ...hanoi };
    if (lang === 'vi') {
      const { answerHeritage, HERITAGE_REFUSAL } = await import('./hoi-heritage.ts');
      const answer = answerHeritage(question);
      if (answer.reply !== HERITAGE_REFUSAL) return { text: answer.reply, scripted: true, ...hanoi };
    }
    return { text: t(companion.offline), ...hanoi };
  }
  return { text: t(companion.offline), href: destination ? '#destination-' + destination : '#explore-vietnam', label: t(companion.exploreMap) };
}
