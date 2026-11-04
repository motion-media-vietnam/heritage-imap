import { destinations } from '../destinations/index';
import { photos, hanoiPhoto } from './assets';
import type { MapDestination } from './content';
import type { Localized } from './locale';

const north = ['Miền Bắc', 'Northern Vietnam'] as const satisfies Localized;
const central = ['Miền Trung', 'Central Vietnam'] as const satisfies Localized;
const south = ['Miền Nam', 'Southern Vietnam'] as const satisfies Localized;

export const featuredMapDestinationIds = ['hanoi', 'ho-chi-minh', 'ninh-binh', 'quang-ninh', 'dien-bien'] as const satisfies readonly (keyof typeof destinations)[];

// GeoNames VN.txt, populated place records. Pins represent travel areas, not boundaries.
export const nationalDestinations: MapDestination[] = [
  { id: 'hanoi', name: destinations.hanoi.name, coordinates: [21.0245, 105.84117], geonameId: 1581130, region: north, photo: hanoiPhoto, description: ['Hồ, phố cổ và những lớp ký ức của thủ đô.', 'Lakes, old streets and the capital’s layers of memory.'] },
  { id: 'ninh-binh', name: destinations['ninh-binh'].name, coordinates: [20.25809, 105.97965], geonameId: 1571968, region: north, photo: photos.river, description: ['Núi đá vôi, dòng nước yên và những hành trình qua cố đô.', 'Limestone peaks, still waters and journeys through the ancient capital.'] },
  { id: 'quang-ninh', name: destinations['quang-ninh'].name, coordinates: [20.95045, 107.07336], geonameId: 1580410, region: north, photo: photos.bay, description: ['Những đảo đá mở ra từ sương trên mặt vịnh.', 'Limestone islands emerging from the bay’s morning mist.'] },
  { id: 'dien-bien', name: destinations['dien-bien'].name, coordinates: [21.38602, 103.02301], geonameId: 1583477, region: north, photo: photos.dienbien, description: ['Điểm đến Tây Bắc đang được Heritage chuẩn bị.', 'A northwestern destination being prepared by Heritage.'] },
  { id: 'ha-giang', name: 'Hà Giang', coordinates: [22.82333, 104.98357], geonameId: 1581349, region: north },
  { id: 'sa-pa', name: 'Sa Pa', coordinates: [22.34023, 103.84415], geonameId: 1568043, region: north },
  { id: 'mu-cang-chai', name: 'Mù Cang Chải', coordinates: [21.85125, 104.08954], geonameId: 1574362, region: north, photo: photos.terraces },
  { id: 'dong-hoi', name: 'Đồng Hới', coordinates: [17.46885, 106.62226], geonameId: 1582886, region: central },
  { id: 'hue', name: 'Huế', coordinates: [16.4619, 107.59546], geonameId: 1580240, region: central, photo: photos.hue },
  { id: 'da-nang', name: 'Đà Nẵng', coordinates: [16.06778, 108.22083], geonameId: 1583992, region: central },
  { id: 'hoi-an', name: 'Hội An', coordinates: [15.87944, 108.335], geonameId: 1580541, region: central, photo: photos.lantern },
  { id: 'nha-trang', name: 'Nha Trang', coordinates: [12.24507, 109.19432], geonameId: 1572151, region: central },
  { id: 'da-lat', name: 'Đà Lạt', coordinates: [11.94646, 108.44193], geonameId: 1584071, region: central },
  { id: 'ho-chi-minh', name: destinations['ho-chi-minh'].name, coordinates: [10.82302, 106.62965], geonameId: 1566083, region: south, photo: photos.saigon, description: ['Khám phá nhịp sống thành phố qua những góc nhìn mới.', 'Discover the rhythm of the city from new perspectives.'] },
  { id: 'can-tho', name: 'Cần Thơ', coordinates: [10.03711, 105.78825], geonameId: 1586203, region: south },
  { id: 'phu-quoc', name: 'Phú Quốc', coordinates: [10.21716, 103.95929], geonameId: 1569973, region: south },
];
