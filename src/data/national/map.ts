import { destinationDirectory, travelAreaParents } from '../destinations/directory';
import { featured } from './featured';
import { photos } from './assets';
import type { MapDestination } from './content';
import type { Localized } from './locale';
import hanoiPin from '../../assets/national/map/hanoi-pin.webp?url';
import saigonPin from '../../assets/national/map/ho-chi-minh-pin.webp?url';
import ninhBinhPin from '../../assets/national/map/ninh-binh-pin.webp?url';
import quangNinhPin from '../../assets/national/map/quang-ninh-pin.webp?url';
import dienBienPin from '../../assets/national/map/dien-bien-pin.webp?url';

const regions = {
  north: ['Miền Bắc', 'Northern Vietnam'],
  central: ['Miền Trung & Tây Nguyên', 'Central Vietnam & Highlands'],
  south: ['Miền Nam', 'Southern Vietnam'],
} as const satisfies Record<string, Localized>;

export const featuredMapDestinationIds = ['hanoi', 'ho-chi-minh', 'ninh-binh', 'quang-ninh', 'dien-bien'] as const;
const pinImages: Readonly<Record<string, string>> = { hanoi: hanoiPin, 'ho-chi-minh': saigonPin, 'ninh-binh': ninhBinhPin, 'quang-ninh': quangNinhPin, 'dien-bien': dienBienPin };
const teasers: Readonly<Record<string, Localized>> = {
  hanoi: ['Hồ, phố cổ và những lớp ký ức của thủ đô.', 'Lakes, old streets and the capital’s layers of memory.'],
  'ninh-binh': ['Núi đá vôi, dòng nước yên và những hành trình qua cố đô.', 'Limestone peaks, still waters and journeys through the ancient capital.'],
  'quang-ninh': ['Từ những mặt vịnh đến nẻo đường văn hóa miền núi.', 'From the bay to the cultural trails of the mountains.'],
  'ho-chi-minh': ['Theo dòng sông, khám phá nhịp sống và những góc nhìn mới của thành phố.', 'Follow the river to discover the city’s rhythm and new perspectives.'],
  'dien-bien': ['Điểm đến Tây Bắc đang được Heritage chuẩn bị.', 'A northwestern destination being prepared by Heritage.'],
  hue: ['Kiến trúc cung đình và những lớp ký ức bên dòng sông.', 'Imperial architecture and layers of memory by the river.'],
  'da-nang': ['Một miền khám phá từ nhịp phố tới những mái ngói bên sông.', 'Explore the rhythm of the city and riverside old streets.'],
  'lao-cai': ['Những nếp ruộng và hành trình miền cao qua góc nhìn Heritage.', 'Terraced landscapes and highland journeys through Heritage’s eyes.'],
};

export interface NationalMapDestination extends MapDestination {
  provinceId: string; featured: boolean; contentReady: boolean;
  pinImage?: string; photoPosition?: string; localPlace?: boolean;
}
export const provinceDestinations: NationalMapDestination[] = destinationDirectory.map(item => {
  const showcase = featured.find(feature => feature.id === item.id);
  const photo = showcase?.photo ?? (item.id === 'hue' ? photos.hue : item.id === 'da-nang' ? photos.lantern : item.id === 'lao-cai' ? photos.terraces : undefined);
  return { id: item.id, name: item.name, coordinates: item.coordinates, geonameId: item.geonameId,
    region: regions[item.region], provinceId: item.id, photo, description: teasers[item.id],
    featured: Boolean(pinImages[item.id]), pinImage: pinImages[item.id], contentReady: Boolean(photo && teasers[item.id]),
    photoPosition: showcase?.position,
  };
});

// Existing travel-area anchors and pins remain available, revealed at closer zoom.
const travelAreas: MapDestination[] = [
  { id: 'ha-giang', name: 'Hà Giang', coordinates: [22.82333, 104.98357], geonameId: 1581349, region: regions.north },
  { id: 'sa-pa', name: 'Sa Pa', coordinates: [22.34023, 103.84415], geonameId: 1568043, region: regions.north },
  { id: 'mu-cang-chai', name: 'Mù Cang Chải', coordinates: [21.85125, 104.08954], geonameId: 1574362, region: regions.north, photo: photos.terraces },
  { id: 'dong-hoi', name: 'Đồng Hới', coordinates: [17.46885, 106.62226], geonameId: 1582886, region: regions.central },
  { id: 'hoi-an', name: 'Hội An', coordinates: [15.87944, 108.335], geonameId: 1580541, region: regions.central, photo: photos.lantern },
  { id: 'nha-trang', name: 'Nha Trang', coordinates: [12.24507, 109.19432], geonameId: 1572151, region: regions.central },
  { id: 'da-lat', name: 'Đà Lạt', coordinates: [11.94646, 108.44193], geonameId: 1584071, region: regions.central },
  { id: 'phu-quoc', name: 'Phú Quốc', coordinates: [10.21721, 103.95929], geonameId: 1569973, region: regions.south },
];
export const nationalDestinations: NationalMapDestination[] = [
  ...provinceDestinations,
  ...travelAreas.map(item => ({ ...item, provinceId: travelAreaParents[item.id]!, featured: false, contentReady: Boolean(item.photo), localPlace: true })),
];
