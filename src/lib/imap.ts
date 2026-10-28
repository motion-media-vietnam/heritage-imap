import { demoLocation, type Category, type Coordinates, type Place } from '../data/places.ts';
import { districtPlaceSlugs } from '../data/districts.ts';
import { findPlaces, distanceKm } from './explore.ts';
import { imapCategories, type ImapCategoryId } from './imap-categories.ts';
import { filterNeighborhoodPlaces } from './imap-neighborhood.ts';
import type { SheetState } from './imap-prototype.ts';

export interface ExplorerState {
  query: string;
  category: Category | ImapCategoryId | 'All';
  district: string;
  origin: Coordinates;
  nearby: boolean;
  selected?: string;
  sheet: SheetState;
}
export function createExplorerState(): ExplorerState {
  return { query: '', category: 'All', district: 'All', origin: { ...demoLocation }, nearby: false, sheet: 'collapsed' };
}
export function filterExplorerPlaces(all: Place[], state: ExplorerState, includeDistrict = true) {
  const slugs = includeDistrict && state.district !== 'All' ? new Set(districtPlaceSlugs[state.district] ?? []) : undefined;
  const category = imapCategories.find(item => item.id === state.category);
  const matching = category ? filterNeighborhoodPlaces(all, {
    center: state.origin, radius: 'All', query: state.query, category: category.id, district: 'All',
  }).filter(place => !state.nearby || distanceKm(state.origin, place.coordinates) <= 10)
    : findPlaces(all, state.query, state.category as Category | 'All', state.origin, state.nearby);
  return matching.filter(place => !slugs || slugs.has(place.slug));
}

// Each rendered explorer owns one lifetime; nothing is shared between instances.
export function createInstanceLifetime() {
  const controller = new AbortController();
  const cleanups: Array<() => void> = [];
  let disposed = false;
  return {
    signal: controller.signal,
    get disposed() { return disposed; },
    onCleanup(cleanup: () => void) { if (disposed) cleanup(); else cleanups.push(cleanup); },
    dispose() {
      if (disposed) return;
      disposed = true;
      controller.abort();
      for (const cleanup of cleanups.reverse()) {
        try { cleanup(); } catch (error) { console.error('[iMap] cleanup failed', error); }
      }
      cleanups.length = 0;
    },
  };
}
