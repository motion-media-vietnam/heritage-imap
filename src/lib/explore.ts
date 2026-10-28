import type { Category, Coordinates, Place } from '../data/places.ts';
export function normalize(text: string): string {
  return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').toLowerCase();
}
export function distanceKm(from: Coordinates, to: Coordinates): number {
  const radians = (n: number) => n * Math.PI / 180;
  const a = Math.sin(radians(to.lat - from.lat) / 2) ** 2
    + Math.cos(radians(from.lat)) * Math.cos(radians(to.lat)) * Math.sin(radians(to.lng - from.lng) / 2) ** 2;
  return 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(Math.max(0, 1 - a)));
}
export function findPlaces(all: Place[], query: string, category: Category | 'All', origin: Coordinates, nearbyOnly = false): Place[] {
  const terms = normalize(query).trim().split(/\s+/).filter(Boolean);
  return all.filter(place => {
    const text = normalize([place.name, place.vietnamese, place.category, place.area, place.description].join(' '));
    return (category === 'All' || place.category === category) && terms.every(term => text.includes(term))
      && (!nearbyOnly || distanceKm(origin, place.coordinates) <= 10);
  }).sort((a, b) => distanceKm(origin, a.coordinates) - distanceKm(origin, b.coordinates));
}
export function formatDistance(distance: number): string {
  return distance < 1 ? `${Math.round(distance * 1000)} m` : `${distance.toLocaleString('vi-VN', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} km`;
}
