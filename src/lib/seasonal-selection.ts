import { activeWindow, httpsLink, type DateWindow } from './national-selection.ts';

export type SeasonalMode = 'auto' | 'sponsored' | 'editorial';

export interface SeasonalSponsor extends DateWindow {
  id: string;
  sponsorName: string;
  status: 'draft' | 'approved';
  visualApproved: boolean;
  priority: number;
  bookingUrl: string;
}

export function seasonalPreviewMode(value: string | null, preview: boolean): SeasonalMode {
  return preview && (value === 'sponsored' || value === 'editorial') ? value : 'auto';
}

export function selectSeasonal<T extends SeasonalSponsor, D extends { bookingUrl: string }>(
  mode: SeasonalMode, sponsors: readonly T[], today: string, preview?: D,
) {
  if (mode === 'editorial') return { mode: 'editorial' } as const;
  const eligible = sponsors.filter(item => item.status === 'approved' && item.visualApproved && item.sponsorName.trim()
    && Number.isFinite(item.priority) && activeWindow(item, today) && httpsLink(item.bookingUrl))
    .sort((a, b) => b.priority - a.priority || a.start.localeCompare(b.start) || a.id.localeCompare(b.id));
  const sponsor = eligible[0];
  if (sponsor) return { mode: 'sponsored', campaign: sponsor, demo: false } as const;
  if (mode === 'sponsored' && preview && httpsLink(preview.bookingUrl)) {
    return { mode: 'sponsored', campaign: preview, demo: true } as const;
  }
  return { mode: 'editorial' } as const;
}
