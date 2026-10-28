import type { ExperienceCategory, ExperienceFilter } from './types.ts';

export const EXPERIENCE_WINDOW_SIZE = 3;

export interface ExperienceItem {
  readonly id: string;
  readonly category?: ExperienceCategory;
}

/** Pure selection model. Pagination hides only on desktop; mobile uses matchingIds. */
export function selectExperienceWindow(
  items: readonly ExperienceItem[],
  category: ExperienceFilter,
  requestedStart = 0,
) {
  const matchingIds = items
    .filter(item => category === 'all' || item.category === category)
    .map(item => item.id);
  const requested = Number.isFinite(requestedStart) ? Math.trunc(requestedStart) : 0;
  const start = Math.max(0, Math.min(requested, matchingIds.length - EXPERIENCE_WINDOW_SIZE));
  const visibleIds = matchingIds.slice(start, start + EXPERIENCE_WINDOW_SIZE);
  const end = start + visibleIds.length;

  return {
    matchingIds,
    visibleIds,
    start,
    canPrevious: start > 0,
    canNext: end < matchingIds.length,
    label: matchingIds.length ? `${start + 1}–${end} / ${matchingIds.length} trải nghiệm` : '0 / 0 trải nghiệm',
  };
}
