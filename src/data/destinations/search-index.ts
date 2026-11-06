import { destinationDirectory } from './directory.ts';
import { places as hanoiPlaces } from './hanoi/places.ts';
import { destinationRoutes } from '../../lib/destination-routes.ts';
import type { Localized } from '../national/locale.ts';

export type SearchKind = 'destination' | 'landmark' | 'attraction';

export interface DestinationSearchEntry {
  id: string;
  nameVi: string;
  nameEn: string;
  aliases: readonly string[];
  type: SearchKind;
  provinceId: string;
  coordinates: readonly [number, number];
  description: Localized;
  category?: Localized;
  area?: Localized;
  zoom?: number;
  existingContentUrl?: string;
  sourceUrl: string;
}

const destinations: DestinationSearchEntry[] = destinationDirectory.map(item => ({
  id: item.id,
  nameVi: item.name,
  nameEn: item.id === 'hanoi' ? 'Hanoi' : item.id === 'ho-chi-minh' ? 'Ho Chi Minh City' : item.name,
  aliases: item.id === 'ho-chi-minh' ? ['Sài Gòn', 'Saigon', 'TP HCM', 'TPHCM', 'HCMC', 'Hồ Chí Minh'] : [],
  type: 'destination',
  provinceId: item.id,
  coordinates: item.coordinates,
  description: ['Tỉnh/thành phố', 'Province or city'],
  existingContentUrl: item.id === 'hanoi' ? destinationRoutes(item.id).home : undefined,
  sourceUrl: 'https://www.geonames.org/' + item.geonameId,
}));

// The National map uses independently sourced location anchors while sharing the Hanoi stories.
const hanoiAnchors = {
  'ho-hoan-kiem': {
    nameEn: 'Hoan Kiem Lake',
    coordinates: [21.0287747, 105.8505791],
    sourceUrl: 'https://www.geonames.org/search.html?country=VN&q=H%E1%BB%93+Ho%C3%A0n+Ki%E1%BA%BFm',
    descriptionEn: 'A lakeside walk and a view of Turtle Tower in central Hanoi.',
    category: ['Danh thắng', 'Scenic site'],
  },
  'van-mieu': {
    nameEn: 'Temple of Literature',
    coordinates: [21.02748333, 105.8354],
    sourceUrl: 'https://archive-db.cseas.kyoto-u.ac.jp/hanoidb/E/files/Hanoi%20Places%20of%20Interests%20with%20locations.pdf',
    descriptionEn: 'Courtyards and a legacy of scholarship in the old capital.',
    category: ['Di tích lịch sử', 'Historic site'],
  },
} as const;

const hanoiLandmarks: DestinationSearchEntry[] = Object.entries(hanoiAnchors).map(([slug, anchor]) => {
  const place = hanoiPlaces.find(item => item.slug === slug)!;
  return {
    id: slug,
    nameVi: place.name,
    nameEn: anchor.nameEn,
    aliases: [place.vietnamese],
    type: 'landmark',
    provinceId: place.cityId,
    coordinates: anchor.coordinates,
    description: [place.description, anchor.descriptionEn],
    category: anchor.category,
    zoom: 16,
    existingContentUrl: destinationRoutes(place.cityId).home + 'places/' + place.slug + '/',
    sourceUrl: anchor.sourceUrl,
  };
});

export const destinationSearchIndex: readonly DestinationSearchEntry[] = [
  ...destinations,
  ...hanoiLandmarks,
  {
    id: 'ha-long-bay', nameVi: 'Vịnh Hạ Long', nameEn: 'Ha Long Bay',
    aliases: ['Hạ Long', 'Halong', 'Halong Bay'], type: 'landmark', provinceId: 'quang-ninh',
    // Ha Long Bay reference point in Vietnam's World Heritage periodic report.
    coordinates: [20.9, 107.1], zoom: 12,
    category: ['Danh thắng', 'Scenic site'],
    description: ['Cảnh quan đảo đá vôi và mặt vịnh của di sản thế giới Hạ Long.', 'Limestone islands and waters of the Ha Long World Heritage property.'],
    sourceUrl: 'https://whc.unesco.org/document/164771',
  },
  {
    id: 'hoa-lu', nameVi: 'Cố đô Hoa Lư', nameEn: 'Hoa Lu Ancient Capital',
    aliases: ['Hoa Lư', 'Đền Vua Đinh', 'Đền Vua Đinh Tiên Hoàng'], type: 'landmark', provinceId: 'ninh-binh',
    coordinates: [20.28555556, 105.90333333], zoom: 16,
    category: ['Di tích lịch sử', 'Historic site'],
    description: ['Kinh đô xưa của Việt Nam. Ghim tại đền Vua Đinh Tiên Hoàng.', 'Vietnam’s former capital. The pin marks the temple of King Đinh Tiên Hoàng.'],
    sourceUrl: 'https://vbpl.vn/FileData/TW/Lists/vbpq/Attachments/136022/VanBanGoc_06-2019-tt-btnmt.pdf',
  },
  {
    id: 'trang-an', nameVi: 'Tràng An', nameEn: 'Trang An Landscape Complex',
    aliases: ['Quần thể danh thắng Tràng An'], type: 'landmark', provinceId: 'ninh-binh',
    coordinates: [20.25666667, 105.89638889], zoom: 13,
    category: ['Danh thắng', 'Scenic site'],
    description: ['Di sản với núi đá vôi, thung lũng và những tuyến thuyền qua hang.', 'A World Heritage landscape of limestone hills, valleys and cave waterways.'],
    sourceUrl: 'https://whc.unesco.org/en/list/1438/maps/',
  },
  {
    id: 'fansipan', nameVi: 'Fansipan', nameEn: 'Fansipan',
    aliases: ['Phan Xi Păng', 'Phan Xi Phăng', 'Fan Si Pan', 'Sun World Fansipan Legend'], type: 'attraction',
    // The discovery grouping follows the visitor approach from Sa Pa, not the summit's administrative boundary.
    provinceId: 'lao-cai', area: ['Khu vực Sa Pa, Lào Cai', 'Sa Pa area, Lào Cai'],
    coordinates: [22.30343, 103.77494], zoom: 15,
    category: ['Trải nghiệm', 'Attraction'],
    description: ['Đỉnh núi thuộc dãy Hoàng Liên Sơn, có tuyến tham quan từ Sa Pa.', 'A summit in the Hoàng Liên Sơn range with visitor access from Sa Pa.'],
    sourceUrl: 'https://www.geonames.org/1582023',
  },
  {
    id: 'hoang-su-phi', nameVi: 'Hoàng Su Phì', nameEn: 'Hoàng Su Phì',
    aliases: ['Ruộng bậc thang Hoàng Su Phì'], type: 'attraction', provinceId: 'tuyen-quang',
    coordinates: [22.68388, 104.68332], zoom: 11,
    category: ['Cảnh quan vùng cao', 'Highland landscape'],
    description: ['Vùng ruộng bậc thang của miền núi phía Bắc. Ghim đại diện cho khu vực.', 'A highland rice-terrace region. The pin represents the wider area.'],
    sourceUrl: 'https://www.geonames.org/1905033',
  },
];
