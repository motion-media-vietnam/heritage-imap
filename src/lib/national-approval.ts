import type { Language } from '../data/national/locale';
import type { FeaturedMode } from './national-selection';
import type { SeasonalMode } from './seasonal-selection';

export const approvalReview = import.meta.env.PUBLIC_NATIONAL_APPROVAL === '1';
export const reviewModes = ['auto', 'sponsored', 'editorial'] as const;
export const reviewLanguages = ['vi', 'en'] as const;

export function approvalHomeHref(lang: Language, featured: FeaturedMode = 'auto', seasonal: SeasonalMode = 'auto') {
  return lang === 'vi' && featured === 'auto' && seasonal === 'auto' ? '/' : `/review/${lang}/${featured}/${seasonal}/`;
}

export function approvalCollectionHref(collection: 'am-thuc' | 'luu-tru', lang: Language) {
  return (lang === 'en' ? '/en/' : '/') + collection + '/';
}

export function nationalCollectionLanguage(url: URL): Language {
  if (approvalReview) return url.pathname.startsWith('/en/') ? 'en' : 'vi';
  return url.searchParams.get('lang') === 'en' ? 'en' : 'vi';
}
