import type { MapSpotlightPlacement } from '../../lib/national-map-selection';

export const mapDirectoryPriority = ['ho-chi-minh', 'hue', 'da-nang', 'khanh-hoa', 'an-giang'] as const;
export const editorialSpotlightOrder = ['hanoi', 'ninh-binh', 'quang-ninh', 'ho-chi-minh', 'dien-bien'] as const;

// No actual sponsor contracts. Dates are inclusive in Vietnam's local calendar.
export const mapSpotlightPlacements: MapSpotlightPlacement[] = [];

// Preview creative only. This does not participate in the contract calendar.
export const previewMapSpotlight = { destinationId: 'hanoi' } as const;
