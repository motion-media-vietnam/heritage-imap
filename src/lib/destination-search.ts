import type { DestinationSearchEntry } from '../data/destinations/search-index.ts';

function normalized(value: string) {
  return value.toLowerCase().normalize('NFD').replace(/\p{M}/gu, '').replace(/đ/g, 'd')
    .replace(/[^a-z0-9]+/g, ' ').trim();
}

export function searchDestinations(index: readonly DestinationSearchEntry[], value: string, limit = 7) {
  const query = normalized(value);
  if (!query) return [];
  const words = query.split(' ');
  const scored = index.flatMap(entry => {
    const names = [entry.nameVi, entry.nameEn].map(normalized);
    const aliases = entry.aliases.map(normalized);
    const terms = [...names, ...aliases];
    let rank = 5;
    if (names.includes(query)) rank = 0;
    else if (aliases.includes(query)) rank = 1;
    else if (terms.some(term => term.startsWith(query))) rank = 2;
    else if (terms.some(term => term.includes(query))) rank = 3;
    else if (terms.some(term => words.every(word => term.split(' ').some(part => part.startsWith(word))))) rank = 4;
    return rank < 5 ? [{ entry, rank }] : [];
  }).sort((a, b) => a.rank - b.rank || a.entry.nameVi.localeCompare(b.entry.nameVi, 'vi'));

  // Show the exact place first and its containing destination as a separate option.
  const first = scored[0];
  if (first && first.rank < 2 && first.entry.type !== 'destination') {
    const parent = index.find(entry => entry.id === first.entry.provinceId && entry.type === 'destination');
    if (parent && !scored.some(result => result.entry.id === parent.id)) scored.splice(1, 0, { entry: parent, rank: 5 });
  }
  return scored.slice(0, limit).map(result => result.entry);
}
