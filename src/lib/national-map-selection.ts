import type { NationalPhoto } from '../data/national/assets.ts';
import type { Localized } from '../data/national/locale.ts';

export interface MapSpotlightPlacement {
  destinationId: string;
  status: 'draft' | 'approved';
  start: string; end: string; priority: number;
  display: boolean; visualApproved: boolean;
  image?: NationalPhoto; teaser?: Localized; cta?: Localized;
  bookingUrl?: string; destinationUrl?: string;
}

function calendarDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(value + 'T00:00:00Z');
  return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

export function chooseMapSpotlight<T extends { id: string; photo?: NationalPhoto; description?: Localized }>(
  destinations: readonly T[], placements: readonly MapSpotlightPlacement[], today: string, fallback: readonly string[],
) {
  const active = calendarDate(today) ? placements.filter(record => {
    const item = destinations.find(item => item.id === record.destinationId);
    return item && record.status === 'approved' && record.display && record.visualApproved
      && Number.isFinite(record.priority) && calendarDate(record.start) && calendarDate(record.end)
      && record.start <= today && today <= record.end
      && (record.image ?? item.photo) && (record.teaser ?? item.description)?.every(text => text.trim());
  }).sort((a, b) => b.priority - a.priority || a.start.localeCompare(b.start) || a.destinationId.localeCompare(b.destinationId)) : [];
  const placement = active[0];
  const destination = placement ? destinations.find(item => item.id === placement.destinationId)
    : fallback.flatMap(id => destinations.find(item => item.id === id) ?? [])[0] ?? destinations[0];
  return destination ? { destination, placement } : undefined;
}

export function orderedMapDirectory<T extends { id: string; name: string }>(items: readonly T[], spotlightId: string, priority: readonly string[]) {
  const rest = items.filter(item => item.id !== spotlightId);
  return [
    ...priority.flatMap(id => rest.find(item => item.id === id) ?? []),
    ...rest.filter(item => !priority.includes(item.id)).sort((a, b) => a.name.localeCompare(b.name, 'vi')),
  ];
}

// Only real Hub paths supplied by the caller or approved HTTPS destinations can be used.
export function mapSpotlightHref(hub: string | undefined, placement?: MapSpotlightPlacement) {
  for (const value of [placement?.bookingUrl, placement?.destinationUrl]) {
    if (!value) continue;
    try {
      const url = new URL(value);
      if (url.protocol === 'https:' && !url.username && !url.password) return url.href;
    } catch { /* An incomplete campaign never creates a guessed route. */ }
  }
  return hub;
}

export interface ProjectedLandmark { id: string; x: number; y: number }

// Spread photo pins in screen space at overview zoom. Leaders retain the actual coordinates.
export function landmarkOffsets(points: readonly ProjectedLandmark[], width: number, height: number, spread: boolean) {
  const placed: { x: number; y: number }[] = [];
  const candidates = [[0, 0], [0, 64], [64, 0], [-64, 0], [0, -64], [64, 64], [-64, 64], [64, -64], [-64, -64], [0, 128], [128, 0], [-128, 0], [128, 64], [64, 128], [128, 128], [-128, 128], [0, 192], [192, 0]];
  return new Map(points.map(point => {
    if (!spread || point.x < -52 || point.x > width + 52 || point.y < 0 || point.y > height + 64) return [point.id, [0, 0] as const] as const;
    const options = candidates.map(([dx, dy]) => ({
      x: Math.max(30, Math.min(width - 30, point.x + dx!)),
      y: Math.max(70, Math.min(height - 12, point.y + dy!)),
    }));
    const target = options.find(option => placed.every(other => Math.hypot(option.x - other.x, option.y - other.y) >= 59))
      ?? options.reduce((best, option) => {
        const distance = (p: { x: number; y: number }) => Math.min(...placed.map(other => Math.hypot(p.x - other.x, p.y - other.y)));
        return distance(option) > distance(best) ? option : best;
      });
    placed.push(target);
    return [point.id, [target.x - point.x, target.y - point.y] as const] as const;
  }));
}
