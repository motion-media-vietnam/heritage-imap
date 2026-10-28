import { distanceKm, findPlaces } from './explore.ts';
import { demoLocation, places, type Category, type Place } from '../data/places.ts';
import { districtPlaceSlugs } from '../data/districts.ts';

export const populatedDistricts = Object.entries(districtPlaceSlugs)
  .map(([name, slugs]) => ({ name, count: places.filter(place => slugs.includes(place.slug)).length }))
  .filter(district => district.count > 0);

export function filterPrototypeDestinations(all: Place[], query: string, category: Category | 'All', district = 'All') {
  const slugs = district === 'All' ? undefined : new Set(districtPlaceSlugs[district] ?? []);
  return findPlaces(all, query, category, demoLocation).filter(place => !slugs || slugs.has(place.slug));
}

export type SheetState = 'collapsed' | 'half' | 'expanded';
export const sheetStates: SheetState[] = ['collapsed', 'half', 'expanded'];
export function sheetStateHeight(state: SheetState, available: number) {
  const height = Math.max(0, available);
  return state === 'collapsed' ? Math.min(112, height * .32) : height * (state === 'half' ? .5 : .9);
}
// Keep the three existing snap states. Open larger when title + landscape frame
// cannot fit in the half sheet; never shrink/crop the original video to make it fit.
export function videoSelectionSheetState(requiredHeight: number, available: number): SheetState {
  return requiredHeight <= sheetStateHeight('half', available) ? 'half' : 'expanded';
}
export function nearestSheetState(height: number, available: number): SheetState {
  return sheetStates.reduce((nearest, state) => Math.abs(sheetStateHeight(state, available) - height)
    < Math.abs(sheetStateHeight(nearest, available) - height) ? state : nearest, 'collapsed');
}

export function nearbyDestinations<T extends Pick<Place, 'slug' | 'coordinates'>>(place: T, all: T[], limit = 3) {
  return all.filter(candidate => candidate.slug !== place.slug)
    .map(candidate => ({ place: candidate, km: distanceKm(place.coordinates, candidate.coordinates) }))
    .sort((a, b) => a.km - b.km).slice(0, limit);
}

// Selection survives closing the sheet. Filtering never silently changes the map camera.
export function selectDestination(current: string | undefined, next: string, visible: Set<string>) {
  return visible.has(next) ? next : current;
}
export function sheetHeight(start: number, deltaY: number, viewport: number) {
  return Math.min(viewport * .85, Math.max(160, start - deltaY));
}

// No destination-specific original video files have been supplied/verified.
// Add only approved original horizontal HD file URLs (16:9), never an overview,
// inferred YouTube link, cropped derivative or unverified replacement.
export const dedicatedVideos: Record<string, { url: string; durationSeconds: number }> = {};
export const practicalInformation: Record<string, { text: string; source: string; checked: string }> = {
  'van-mieu': {
    text: 'Tham quan ban ngày: 08:00–17:00, tất cả các ngày. Chương trình buổi tối có lịch và vé riêng. Kiểm tra lại với di tích trước khi đến.',
    source: 'https://vanmieu.gov.vn/en', checked: '2026-10-17',
  },
};
