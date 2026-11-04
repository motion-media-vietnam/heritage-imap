import type { AstroComponentFactory } from 'astro/runtime/server/index.js';
import { destinations } from '../data/destinations/index';
import type { DestinationHub } from '../data/destinations/types';
import type { DestinationPlace } from '../types/place';
import { destinationRoutes } from '../lib/destination-routes';
import Home from './hanoi/Home.astro';
import Map from './hanoi/Map.astro';
import Concierge from './hanoi/Concierge.astro';
import HeritageLauncher from '../components/HeritageLauncher.astro';
import { places } from '../data/destinations/hanoi/places';

interface PublishedDestination {
  hub: DestinationHub;
  places: readonly DestinationPlace[];
  home: AstroComponentFactory;
  map: AstroComponentFactory;
  concierge: AstroComponentFactory;
  assistant: AstroComponentFactory;
}

const publishedDestinations: readonly PublishedDestination[] = [{
  hub: destinations.hanoi,
  places,
  home: Home,
  map: Map,
  concierge: Concierge,
  assistant: HeritageLauncher,
}];

export function destinationPagePaths(page: 'home' | 'map' | 'concierge') {
  return publishedDestinations.map(entry => ({
    params: { destination: entry.hub.id },
    props: { View: entry[page], routes: destinationRoutes(entry.hub.id) },
  }));
}

export function destinationPlacePaths() {
  return publishedDestinations.flatMap(({ hub, places, assistant }) => places.map(place => ({
    params: { destination: hub.id, slug: place.slug },
    props: { hub, place, Assistant: assistant, homePath: destinationRoutes(hub.id).home },
  })));
}
