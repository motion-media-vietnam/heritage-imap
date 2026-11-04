import { hanoi } from './hanoi/config.ts';
import type { DestinationHub, DraftDestination } from './types.ts';

export const destinations = {
  hanoi,
  'ninh-binh': { id: 'ninh-binh', name: 'Ninh Bình', language: 'vi', status: 'draft' },
} as const satisfies Record<string, DestinationHub | DraftDestination>;
