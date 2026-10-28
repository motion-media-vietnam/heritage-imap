/** Sprint 04A prototype-only discovery helpers. No production records are changed. */
import { demoLocation, type Coordinates, type Place } from '../data/places.ts';
import { districtPlaceSlugs } from '../data/districts.ts';
import { distanceKm, normalize } from './explore.ts';
import { imapCategories, type ImapCategoryId, type ImapCategoryIconId } from './imap-categories.ts';

// Compatibility names, not a second taxonomy: every consumer uses the shared registry.
export const discoveryCategories = imapCategories;
export type DiscoveryCategory = ImapCategoryId;
export type DiscoveryRadius = 500 | 1000 | 2000 | 'All';
// Future approved prototype records can use the four shared categories
// without falsely inheriting a production sample's sightseeing category.
export type DiscoveryPlace = Omit<Place, 'category' | 'art'> & {
  /** New prototype records need no invented illustration classification. */
  art?: Place['art'];
  category: Place['category'] | DiscoveryCategory;
  discoveryCategory?: DiscoveryCategory;
  /** Optional client-supplied local photograph, shared by directory and nearby rows. */
  portraitImage?: string;
};
export interface NeighborhoodState {
  center: Coordinates;
  radius: DiscoveryRadius;
  query: string;
  category: DiscoveryCategory | 'All';
  district: string;
}
export function createNeighborhoodState(): NeighborhoodState {
  return { center: { ...demoLocation }, radius: 1000, query: '', category: 'All', district: 'All' };
}
export function parseDiscoveryRadius(value: string): DiscoveryRadius {
  return value === 'All' ? 'All' : value === '500' ? 500 : value === '2000' ? 2000 : 1000;
}
export function markerCategory(place: DiscoveryPlace): DiscoveryCategory {
  // The current six records are all sightseeing/heritage. Other categories stay empty.
  if (place.discoveryCategory) return place.discoveryCategory;
  return discoveryCategories.some(category => category.id === place.category) ? place.category as DiscoveryCategory : 'stamp-worthy-spot';
}
export function filterNeighborhoodPlaces(all: DiscoveryPlace[], state: NeighborhoodState,
  districtMembership: Readonly<Record<string, readonly string[]>> = districtPlaceSlugs): DiscoveryPlace[] {
  const districts = state.district === 'All' ? undefined : new Set(districtMembership[state.district] ?? []);
  const terms = normalize(state.query).trim().split(/\s+/).filter(Boolean);
  return all.filter(place => {
    const category = markerCategory(place);
    const label = discoveryCategories.find(item => item.id === category)!.label;
    const searchable = normalize([place.name, place.vietnamese, place.category, label, place.area, place.description].join(' '));
    return terms.every(term => searchable.includes(term))
      && (state.category === 'All' || category === state.category)
      && (!districts || districts.has(place.slug))
      && (state.radius === 'All' || distanceKm(state.center, place.coordinates) * 1000 <= state.radius);
  }).sort((a, b) => distanceKm(state.center, a.coordinates) - distanceKm(state.center, b.coordinates));
}
/** Explicit user reset: keep the accepted exploration center, never request a camera fit. */
export function resetNeighborhoodFilters(state: NeighborhoodState): NeighborhoodState {
  return { ...createNeighborhoodState(), center: { ...state.center } };
}

/** The caller shows this only for an empty result; catalog availability ignores active filters. */
export function neighborhoodEmptyMessage(all: DiscoveryPlace[], state: NeighborhoodState): string {
  if (state.category !== 'All' && !all.some(place => markerCategory(place) === state.category)) {
    return 'Danh mục này chưa có địa điểm được giới thiệu. Bạn thử danh mục khác nhé.';
  }
  if (normalize(state.query).trim() && filterNeighborhoodPlaces(all, {
    ...state, category: 'All', district: 'All', radius: 'All',
  }).length === 0) {
    return 'Chưa tìm thấy địa điểm với từ khóa này. Bạn thử từ khóa khác nhé.';
  }
  return 'Chưa có địa điểm phù hợp. Bạn thử đổi khu vực hoặc mở rộng bán kính nhé.';
}

export function validDiscoveryCenter(center: Coordinates) {
  return Number.isFinite(center.lat) && Number.isFinite(center.lng)
    && Math.abs(center.lat) <= 90 && Math.abs(center.lng) <= 180;
}
export type DiscoveryLocationResult = { kind: 'success'; center: Coordinates } | { kind: 'denied' | 'error' };
export function resolveDiscoveryLocation(state: NeighborhoodState, result: DiscoveryLocationResult): NeighborhoodState {
  if (result.kind !== 'success' || !validDiscoveryCenter(result.center)) return state;
  return { ...state, center: { ...result.center } };
}
export function offerDiscoveryArea(center: Coordinates, camera: Coordinates) {
  return validDiscoveryCenter(camera) && distanceKm(center, camera) >= .1;
}

/** Pixel-space connected components: nearby tap targets become one accessible list entry.
 * No geographic points are generated, moved or persisted. No arbitrary marker-count cap.
 */
export function clusterProjectedPoints<T extends { id: string; x: number; y: number }>(points: readonly T[], separation = 56): T[][] {
  if (!Number.isFinite(separation) || separation <= 0) throw new RangeError('Positive marker separation required');
  const parents = points.map((_, index) => index);
  const find = (index: number): number => {
    while (parents[index] !== index) { parents[index] = parents[parents[index]!]!; index = parents[index]!; }
    return index;
  };
  const cells = new Map<string, number[]>();
  points.forEach((point, index) => {
    const x = Math.floor(point.x / separation); const y = Math.floor(point.y / separation);
    for (let dx = -1; dx <= 1; dx++) for (let dy = -1; dy <= 1; dy++) {
      for (const neighbor of cells.get(`${x + dx}:${y + dy}`) ?? []) {
        const other = points[neighbor]!;
        if (Math.hypot(point.x - other.x, point.y - other.y) < separation) parents[find(index)] = find(neighbor);
      }
    }
    const key = `${x}:${y}`; const cell = cells.get(key) ?? []; cell.push(index); cells.set(key, cell);
  });
  const groups = new Map<number, T[]>();
  points.forEach((point, index) => { const key = find(index); const group = groups.get(key) ?? []; group.push(point); groups.set(key, group); });
  return Array.from(groups.values());
}

const categoryPaths: Record<ImapCategoryIconId | 'cluster', string> = {
  landmark: 'M3 10h18L12 3 3 10Zm2 2v7m5-7v7m4-7v7m5-7v7M3 21h18',
  utensils: 'M4 3v6a3 3 0 0 0 6 0V3M7 3v18M19 3c-4 3-4 8 0 9v9m0-18v9',
  compass: 'M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-6-3-2 4-4 2 2-4 4-2Z',
  cluster: 'M3 3h6v6H3V3Zm12 0h6v6h-6V3ZM3 15h6v6H3v-6Zm12 0h6v6h-6v-6',
  'shopping-bag': 'M5 7h14l1 14H4L5 7Zm4 0V5a3 3 0 0 1 6 0v2',
};
export function categoryIconPath(category: DiscoveryCategory | 'cluster') {
  return categoryPaths[category === 'cluster' ? 'cluster' : discoveryCategories.find(item => item.id === category)!.icon];
}
export function categoryIconSvg(category: DiscoveryCategory) {
  // Static trusted paths only; names/record data are never interpolated as HTML.
  return `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="${categoryIconPath(category)}"/></svg>`;
}
