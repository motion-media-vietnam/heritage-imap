import type { MapSpotlightPlacement } from '../../lib/national-map-selection';

export const mapDirectoryPriority = ['ho-chi-minh', 'hue', 'da-nang', 'khanh-hoa', 'an-giang'] as const;
export const editorialSpotlightOrder = ['hanoi', 'ninh-binh', 'quang-ninh', 'ho-chi-minh', 'dien-bien'] as const;

// No actual sponsor contracts. Dates are inclusive in Vietnam's local calendar.
export const mapSpotlightPlacements: MapSpotlightPlacement[] = [];

// Development-only review fixture: two-month window, then the next valid placement wins.
export const previewMapSpotlights: MapSpotlightPlacement[] = [
  { destinationId: 'quang-ninh', status: 'approved', start: '2026-11-01', end: '2026-12-31', priority: 2, display: true, visualApproved: true },
  { destinationId: 'ho-chi-minh', status: 'approved', start: '2026-12-01', end: '2027-02-28', priority: 1, display: true, visualApproved: true },
];
