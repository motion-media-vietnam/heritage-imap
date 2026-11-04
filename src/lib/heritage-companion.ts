import { companion, companionPrompts } from '../data/national/companion.ts';
import { translate, type Language } from '../data/national/locale.ts';
import { destinationRoutes } from './destination-routes.ts';

export type CompanionReply = { text: string; kind?: 'editorial' | 'scripted'; href?: string; label?: string };
const outsideTravel = /\b(?:viet code|lap trinh|javascript|python|hack|system prompt|ignore instructions|chung khoan|bitcoin|bai tap|politics|write code|programming|stock price|medical|medicine|nhat ban|thai lan|han quoc|tokyo|japan|thailand|seoul|paris)\b/;
const travel = /\b(?:di dau|di choi|co gi|ngay|tham quan|kham pha|du lich|nen di|lich trinh|hanh trinh|diem den|di san|van hoa|lich su|am thuc|an gi|mon ngon|nha hang|quan an|trai nghiem|di chuyen|tau|xe|may bay|mua nao|thoi tiet|gia ve|gio mo cua|travel|visit|explore|itinerary|where|things to do|what is there to see|beyond|heritage|culture|history|food|eat|restaurant|experience|transport|train|bus|flight|weather|opening hours|ticket|days?)\b/;
const transport = /\b(?:di chuyen|tau|xe|may bay|transport|train|bus|flight|how to get)\b/;
const live = /\b(?:hom nay|ngay mai|gia ve|gia cuoc|gio mo cua|thoi tiet|du bao|today|tomorrow|ticket price|opening hours|weather|departure time)\b/;

export async function getCompanionReply(question: string, lang: Language): Promise<CompanionReply> {
  const normalized = ' ' + question.toLowerCase().normalize('NFD').replace(/\p{M}/gu, '')
    .replace(/đ/g, 'd').replace(/[^a-z0-9]+/g, ' ').trim() + ' ';
  const matches = companionPrompts.filter(entry => entry.terms.some(term => normalized.includes(' ' + term + ' ')));
  const guide = matches.length === 1 ? matches[0] : undefined;
  const t = (value: Parameters<typeof translate>[0]) => translate(value, lang);
  const map = { href: guide ? '#destination-' + guide.id : '#explore-vietnam', label: t(companion.exploreMap) };
  const destination = guide?.id === 'hanoi'
    ? { href: destinationRoutes('hanoi').home + 'heritage-mach-ban/', label: t(companion.hanoiCollection) }
    : map;
  if (outsideTravel.test(normalized)) return { text: t(companion.refusal) };
  const placeNameOnly = guide?.terms.some(term => normalized.trim() === term);
  if (!travel.test(normalized) && !placeNameOnly) {
    const greeting = /^\s*(?:chao|xin chao|hello|hi|hey)\s*$/.test(normalized);
    return { text: t(greeting ? companion.clarify : companion.refusal) };
  }
  if (live.test(normalized)) return { text: t(companion.liveData), ...destination };
  if (guide?.id === 'dien-bien' && /\b(?:mua nao|mua hoa ban|best time|good time|when to visit)\b/.test(normalized)) {
    return { text: t(companion.dienBienSeason), kind: 'editorial', ...destination };
  }
  if (guide?.id === 'hanoi') {
    if (/\b(?:3|ba) ngay\b|\b(?:3|three) days?\b/.test(normalized)) return { text: t(guide.reply), kind: 'editorial', ...destination };
    if (lang === 'vi') {
      const { answerHeritage, HERITAGE_REFUSAL } = await import('./hoi-heritage.ts');
      const answer = answerHeritage(question);
      if (answer.reply !== HERITAGE_REFUSAL) return { text: answer.reply, kind: 'scripted', ...destination };
    }
  }
  if (transport.test(normalized)) return { text: t(companion.transport), kind: 'editorial', ...destination };
  if (guide && placeNameOnly) {
    return { text: t(guide.reply), kind: 'editorial', ...destination };
  }
  const topicMatches = guide && (
    (guide.id === 'ninh-binh' && /\b(?:it nguoi|yen tinh|van long|tam coc|hoa lu|quieter|quiet|experience)\b/.test(normalized))
    || (guide.id === 'quang-ninh' && /\b(?:yen tu|ngoai vinh|beyond ha long|di san|heritage|van hoa)\b/.test(normalized))
    || (guide.id === 'ho-chi-minh' && /\b(?:am thuc|an gi|mon ngon|food|eat|hu tieu|banh mi|com tam)\b/.test(normalized))
    || (guide.id === 'dien-bien' && /\b(?:dien bien phu|doi a1|lich su|history|heritage|di san)\b/.test(normalized))
  );
  if (guide && topicMatches) return { text: t(guide.reply), kind: 'editorial', ...destination };
  return { text: t(companion.offline), ...destination };
}
