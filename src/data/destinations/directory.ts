import { destinations } from './index.ts';

export interface DirectoryDestination {
  id: string; name: string; code: string; geonameId: number;
  coordinates: readonly [number, number]; region: 'north' | 'central' | 'south';
}

// Provincial names/codes: Decision 19/2025/QD-TTg. Coordinates: GeoNames VN.txt, 05/11/2026.
// Pins are representative travel points, not administrative centres or boundaries.
export const destinationDirectory: readonly DirectoryDestination[] = [
  { id: 'hanoi', name: destinations['hanoi'].name, code: '01', geonameId: 1581130, coordinates: [21.0245, 105.84117], region: 'north' },
  { id: 'cao-bang', name: "Cao Bằng", code: '04', geonameId: 1586185, coordinates: [22.66568, 106.25786], region: 'north' },
  { id: 'tuyen-quang', name: "Tuyên Quang", code: '08', geonameId: 1563287, coordinates: [21.82356, 105.21424], region: 'north' },
  { id: 'dien-bien', name: destinations['dien-bien'].name, code: '11', geonameId: 1583477, coordinates: [21.38602, 103.02301], region: 'north' },
  { id: 'lai-chau', name: "Lai Châu", code: '12', geonameId: 8456741, coordinates: [22.39644, 103.45824], region: 'north' },
  { id: 'son-la', name: "Sơn La", code: '14', geonameId: 1567681, coordinates: [21.3256, 103.91882], region: 'north' },
  { id: 'lao-cai', name: "Lào Cai", code: '15', geonameId: 1576303, coordinates: [22.48556, 103.97066], region: 'north' },
  { id: 'thai-nguyen', name: "Thái Nguyên", code: '19', geonameId: 1566319, coordinates: [21.59422, 105.84817], region: 'north' },
  { id: 'lang-son', name: "Lạng Sơn", code: '20', geonameId: 1576633, coordinates: [21.85264, 106.76101], region: 'north' },
  { id: 'quang-ninh', name: destinations['quang-ninh'].name, code: '22', geonameId: 1580410, coordinates: [20.95045, 107.07336], region: 'north' },
  { id: 'bac-ninh', name: "Bắc Ninh", code: '24', geonameId: 1591449, coordinates: [21.18608, 106.07631], region: 'north' },
  { id: 'phu-tho', name: "Phú Thọ", code: '25', geonameId: 1562820, coordinates: [21.32274, 105.40198], region: 'north' },
  { id: 'hai-phong', name: "Hải Phòng", code: '31', geonameId: 1581298, coordinates: [20.86481, 106.68345], region: 'north' },
  { id: 'hung-yen', name: "Hưng Yên", code: '33', geonameId: 1580142, coordinates: [20.64637, 106.05112], region: 'north' },
  { id: 'ninh-binh', name: destinations['ninh-binh'].name, code: '37', geonameId: 1571968, coordinates: [20.25809, 105.97965], region: 'north' },
  { id: 'thanh-hoa', name: "Thanh Hóa", code: '38', geonameId: 1566166, coordinates: [19.8, 105.76667], region: 'north' },
  { id: 'nghe-an', name: "Nghệ An", code: '40', geonameId: 1562798, coordinates: [18.67337, 105.69232], region: 'central' },
  { id: 'ha-tinh', name: "Hà Tĩnh", code: '42', geonameId: 1581047, coordinates: [18.34282, 105.90569], region: 'central' },
  { id: 'quang-tri', name: "Quảng Trị", code: '44', geonameId: 1582886, coordinates: [17.46885, 106.62226], region: 'central' },
  { id: 'hue', name: "Huế", code: '46', geonameId: 1580240, coordinates: [16.4619, 107.59546], region: 'central' },
  { id: 'da-nang', name: "Đà Nẵng", code: '48', geonameId: 1583992, coordinates: [16.06778, 108.22083], region: 'central' },
  { id: 'quang-ngai', name: "Quảng Ngãi", code: '51', geonameId: 1568770, coordinates: [15.12047, 108.79232], region: 'central' },
  { id: 'gia-lai', name: "Gia Lai", code: '52', geonameId: 1569684, coordinates: [13.98333, 108], region: 'central' },
  { id: 'khanh-hoa', name: "Khánh Hòa", code: '56', geonameId: 1572151, coordinates: [12.24507, 109.19432], region: 'central' },
  { id: 'dak-lak', name: "Đắk Lắk", code: '66', geonameId: 1586896, coordinates: [12.66747, 108.03775], region: 'central' },
  { id: 'lam-dong', name: "Lâm Đồng", code: '68', geonameId: 1584071, coordinates: [11.94646, 108.44193], region: 'central' },
  { id: 'dong-nai', name: "Đồng Nai", code: '75', geonameId: 1587923, coordinates: [10.94469, 106.82432], region: 'south' },
  { id: 'ho-chi-minh', name: destinations['ho-chi-minh'].name, code: '79', geonameId: 1566083, coordinates: [10.82302, 106.62965], region: 'south' },
  { id: 'tay-ninh', name: "Tây Ninh", code: '80', geonameId: 1566559, coordinates: [11.31004, 106.09828], region: 'south' },
  { id: 'dong-thap', name: "Đồng Tháp", code: '82', geonameId: 1586151, coordinates: [10.46017, 105.63294], region: 'south' },
  { id: 'vinh-long', name: "Vĩnh Long", code: '86', geonameId: 1562693, coordinates: [10.25369, 105.9722], region: 'south' },
  { id: 'an-giang', name: "An Giang", code: '91', geonameId: 1575627, coordinates: [10.38639, 105.43518], region: 'south' },
  { id: 'can-tho', name: "Cần Thơ", code: '92', geonameId: 1586203, coordinates: [10.03711, 105.78825], region: 'south' },
  { id: 'ca-mau', name: "Cà Mau", code: '96', geonameId: 1586443, coordinates: [9.17682, 105.15242], region: 'south' },
];

// Keep established travel-area links working without counting them as extra provinces.
export const travelAreaParents: Readonly<Record<string, string>> = {
  'ha-giang': 'tuyen-quang', 'sa-pa': 'lao-cai', 'mu-cang-chai': 'lao-cai',
  'dong-hoi': 'quang-tri', 'hoi-an': 'da-nang', 'nha-trang': 'khanh-hoa',
  'da-lat': 'lam-dong', 'phu-quoc': 'an-giang',
};
