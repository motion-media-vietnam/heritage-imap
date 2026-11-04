import { hanoi } from './hanoi/config.ts';
import type { DestinationHub, DraftDestination } from './types.ts';

export const destinations = {
  hanoi,
  'ninh-binh': { id: 'ninh-binh', name: 'Ninh Bình', language: 'vi', status: 'draft' },
  'ho-chi-minh': { id: 'ho-chi-minh', name: 'TP. Hồ Chí Minh', language: 'vi', status: 'draft' },
  'quang-ninh': { id: 'quang-ninh', name: 'Quảng Ninh', language: 'vi', status: 'draft' },
  'dien-bien': { id: 'dien-bien', name: 'Điện Biên', language: 'vi', status: 'draft' },
} as const satisfies Record<string, DestinationHub | DraftDestination>;
