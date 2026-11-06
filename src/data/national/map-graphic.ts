import type { featuredMapDestinationIds } from './map';

// Poster-space positions, deliberately spread out from the geographic anchors.
// The interactive map always uses coordinates from the destination directory.
export const discoveryViewBox = { width: 800, height: 760 } as const;
export const discoveryPins = [
  { id: 'hanoi', x: 375, y: 132 },
  { id: 'ho-chi-minh', x: 422, y: 590 },
  // Keep the tip just south of the geographic anchor (361, 193) to clear Hà Nội's label.
  { id: 'ninh-binh', x: 361, y: 230 },
  // Keep the coastal anchor visible beside the photo and clear of Hà Nội's pin.
  { id: 'quang-ninh', x: 448, y: 185 },
  { id: 'dien-bien', x: 258, y: 155 },
] satisfies { id: typeof featuredMapDestinationIds[number]; x: number; y: number }[];

export function discoveryAnchor(coordinates: readonly [number, number]) {
  return { x: 190 + (coordinates[1] - 102) * 43, y: 70 + (23.5 - coordinates[0]) * 38 };
}
