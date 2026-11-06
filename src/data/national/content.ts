import { destinations } from '../destinations/index';
import { destinationRoutes } from '../../lib/destination-routes';
import type { FeaturedMode, Sponsorship } from '../../lib/national-selection';
import { photos, type NationalPhoto } from './assets';
import { ninhBinhPhoto } from './hero';
import haLongWonder from '../../assets/national/ha-long-wonder-1536.webp?url';
import haLongWonderSmall from '../../assets/national/ha-long-wonder-720.webp?url';
import type { Localized } from './locale';

export const identity = {
  name: 'Heritage Vietnam iMAP',
  heritage: 'https://heritagevietnamairlines.com/',
  airline: 'https://www.vietnamairlines.com/',
  advertise: 'https://advertisement.heritagevietnamairlines.com/',
  contact: 'https://heritagevietnamairlines.com/lien-he/',
};

export const nationalSettings = { featuredMode: 'auto' as FeaturedMode, slideInterval: 7000 };

export { heroSlides } from './hero';

export interface MapDestination {
  id: string;
  name: string;
  coordinates: readonly [number, number];
  geonameId: number;
  region: Localized;
  description?: Localized;
  photo?: NationalPhoto;
}

export function hubHref(id: string) {
  const hub = Object.values(destinations).find(item => item.id === id && item.status === 'published');
  return hub ? destinationRoutes(hub.id).home : undefined;
}

export const hanoiHref = destinationRoutes(destinations.hanoi.id).home;
export { featured, previewSponsorships } from './featured';

export const collage = [photos.hue, photos.river, photos.bay, photos.taste, photos.terraces, photos.lantern];

export const sponsorships: Sponsorship[] = [];

interface Story {
  title: Localized;
  description: Localized;
  photo: NationalPhoto;
  destinationId: string;
  booking?: string;
}

export const wonders: Story[] = [
  { title: ['Trong lòng núi đá', 'Among limestone peaks'], description: ['Tràng An · Ninh Bình', 'Tràng An · Ninh Bình'], photo: ninhBinhPhoto, destinationId: 'ninh-binh' },
  { title: ['Dấu son cung đình', 'The vermilion of imperial Huế'], description: ['Kiến trúc và ký ức ở Huế', 'Architecture and memory in Huế'], photo: photos.hue, destinationId: 'hue' },
  {
    title: ['Vịnh của những tầng sương', 'A bay in layers of mist'],
    description: ['Hạ Long · Quảng Ninh', 'Hạ Long · Quảng Ninh'],
    photo: {
      src: haLongWonder, small: haLongWonderSmall, width: 1536, height: 864,
      alt: ['Tàu trên Vịnh Hạ Long giữa những đảo đá vôi trong nắng sớm', 'Boats among Hạ Long Bay’s limestone islands in the morning light'],
    },
    destinationId: 'quang-ninh',
  },
];
