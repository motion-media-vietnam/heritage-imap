import { places } from '../../data/destinations/hanoi/places.ts';

export function hanoiPlacePaths() {
  return places.map(place => ({ params: { slug: place.slug }, props: { place } }));
}
