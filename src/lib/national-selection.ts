export type FeaturedMode = 'auto' | 'sponsored' | 'editorial';
export type DateWindow = { start: string; end: string };

export interface Sponsorship extends DateWindow {
  destinationId: string;
  priority: number;
  display: boolean;
  visualApproved: boolean;
}

export function activeWindow(window: DateWindow, today: string) {
  const isoDate = /^\d{4}-\d{2}-\d{2}$/;
  return isoDate.test(window.start) && isoDate.test(window.end) && window.start <= today && today <= window.end;
}

export function activeSponsorships(records: readonly Sponsorship[], today: string, eligible: ReadonlySet<string>) {
  const sorted = records.filter(record => record.display && record.visualApproved
    && eligible.has(record.destinationId) && activeWindow(record, today))
    .sort((a, b) => b.priority - a.priority || a.end.localeCompare(b.end));
  const selected = new Set<string>();
  return sorted.filter(record => {
    if (selected.has(record.destinationId)) return false;
    selected.add(record.destinationId);
    return true;
  });
}

export function featuredDestinations<T extends { id: string }>(selections: readonly T[], sponsors: readonly Sponsorship[]) {
  const sponsored = new Set(sponsors.map(record => record.destinationId));
  return [
    ...sponsors.flatMap(record => selections.find(item => item.id === record.destinationId) ?? []),
    ...selections.filter(item => !sponsored.has(item.id)),
  ].slice(0, 5).map(item => ({ item, sponsored: sponsored.has(item.id) }));
}

export function activeOffers<T extends DateWindow & { approved: boolean; partner: string; booking: string }>(offers: readonly T[], today: string) {
  return offers.flatMap(offer => {
    const booking = httpsLink(offer.booking);
    return offer.approved && offer.partner.trim() && activeWindow(offer, today) && booking ? [{ ...offer, booking }] : [];
  });
}

export function httpsLink(value: string | undefined) {
  if (!value) return;
  try {
    const url = new URL(value);
    if (url.protocol === 'https:' && !url.username && !url.password) return url.href;
  } catch { /* Incomplete partner data is hidden. */ }
}
