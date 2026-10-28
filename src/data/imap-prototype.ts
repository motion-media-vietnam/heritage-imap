/** 05B.1 conditional prototype integration only. Never imported by production pages.
 * Facts/pins come from the locally approved 05A.1 audit; this is not media approval.
 */
import audit from '../../output/sprint-05a/candidates.draft.json' with { type: 'json' };
import { places as originalPlaces } from './places.ts';
import { migrateImapCategory } from '../lib/imap-categories.ts';
import { districtPlaceSlugs } from './districts.ts';
import { discoveryCategories, filterNeighborhoodPlaces, type NeighborhoodState, type DiscoveryCategory, type DiscoveryPlace } from '../lib/imap-neighborhood.ts';

const { candidates } = audit;

// Explicit allowlist: later audit edits cannot silently populate additional destinations.
export const integratedPrototypeIds = [
  'den-ngoc-son', 'nha-tho-lon-ha-noi', 'pho-sach-dinh-le',
  'sofitel-legend-metropole-hanoi', 'nha-hat-mua-roi-thang-long-hoan-kiem',
] as const;

function candidateById(id: string) {
  const candidate = candidates.find(candidate => candidate.id === id);
  if (!candidate) throw new Error(`Missing approved prototype candidate: ${id}`);
  return candidate;
}
function isCategory(value: string): value is DiscoveryCategory {
  return discoveryCategories.some(category => category.id === value);
}
// Visitor-facing excerpts of the audit angles, omitting internal editorial instructions.
const angleExcerpts: Readonly<Record<string, string>> = {
  'sofitel-legend-metropole-hanoi': 'Một địa chỉ lưu trú để kể về kiến trúc và ký ức đô thị.',
  'nha-hat-mua-roi-thang-long-hoan-kiem': 'Từ mặt nước sân khấu đến câu chuyện làng quê.',
  'khong-gian-di-bo-hoan-kiem': 'Khi không gian quanh hồ dành chỗ cho người đi bộ: nhịp gặp gỡ và sinh hoạt cộng đồng.',
};
function editorialText(id: string) {
  const candidate = candidateById(id);
  return angleExcerpts[id] ?? candidate.proposedEditorialStoryAngle;
}

const approvedPrototypePlaces: DiscoveryPlace[] = [
  // Prototype-only photo fields: production records/content are never mutated.
  ...originalPlaces.map((place): DiscoveryPlace => {
    if (place.slug === 'ho-hoan-kiem') return { ...place, portraitImage: '/images/Ho%20Hoan%20kiem.jpg' };
    if (place.slug === 'pho-co') return { ...place, portraitImage: '/images/Pho%20co.jpg' };
    // 06I: client files visually inspected against the supplied destination identities.
    if (place.slug === 'van-mieu') return { ...place, portraitImage: '/images/văn%20miếu%20quốc%20tử%20giám%20ht.jpg' };
    if (place.slug === 'ho-tay') return { ...place, portraitImage: '/images/Ho%20tay.jpg' };
    if (place.slug === 'cau-long-bien') return { ...place, portraitImage: '/images/Cau%20Long%20Bien.jpg' };
    if (place.slug === 'hoang-thanh-thang-long') return { ...place, portraitImage: '/images/Hoang%20thanh%20Thang%20Long.jpg' };
    return place;
  }),
  ...integratedPrototypeIds.map((id): DiscoveryPlace => {
    const candidate = candidateById(id);
    const category = migrateImapCategory(candidate.categoryId, id);
    if (!candidate.coordinates || !isCategory(category)) {
      throw new Error(`Approved prototype candidate lacks a pin/category: ${id}`);
    }
    return {
      slug: candidate.id, name: candidate.name, vietnamese: candidate.name,
      category, discoveryCategory: category,
      coordinates: { ...candidate.coordinates }, area: candidate.address.value,
      description: editorialText(id), story: editorialText(id),
      tip: 'Kiểm tra lối vào và điều kiện tham quan tại nguồn trước khi đi.',
      visit: 'Khám phá theo nhịp riêng', access: 'Lối vào chưa được xác minh',
      // Client-supplied files only; one source field for both list placements.
      portraitImage: {
        'den-ngoc-son': '/images/den%20ngoc%20son.jpg',
        'nha-tho-lon-ha-noi': '/images/Nha%20tho%20lon.jpg',
        'pho-sach-dinh-le': '/images/pho%20sach%20Dinh%20Le.jpg',
        'sofitel-legend-metropole-hanoi': '/images/Metropole%20legand.jpeg',
        'nha-hat-mua-roi-thang-long-hoan-kiem': '/images/nha%20hat%20mua%20roi%20nuoc%20Thang%20Long.jpg',
      }[id],
      // No invented video, art classification, price or opening hours.
    };
  }),
];

// 07A.1: exact published Nominatim position of OSM's named Opera House building,
// not an inferred coordinate, viewport center or surveyed public entrance.
export const operaLocationEvidence = {
  checked: '2026-10-24',
  coordinates: { lat: 21.0242022, lng: 105.8578344 },
  mapSourceUrl: 'https://nominatim.openstreetmap.org/lookup?osm_ids=W37933050&format=jsonv2',
  osmFeatureUrl: 'https://www.openstreetmap.org/way/37933050',
  osmWayVersion: 16,
  addressSourceUrl: 'https://bvhttdl.gov.vn/ban-quan-ly-nha-hat-lon-ha-noi-606555.htm',
  addressDiscrepancy: 'Ministry: 01 Tràng Tiền, phường Cửa Nam. OSM: 1A Phố Tràng Tiền, Cua Nam Ward.',
} as const;
const operaPlace: DiscoveryPlace = {
  slug: 'nha-hat-opera-ha-noi', name: 'Nhà hát Opera Hà Nội',
  vietnamese: 'Nhà hát Lớn Hà Nội · Hanoi Opera House',
  category: 'stamp-worthy-spot', discoveryCategory: 'stamp-worthy-spot',
  coordinates: { ...operaLocationEvidence.coordinates },
  area: '1 Tràng Tiền, phường Cửa Nam, Hà Nội',
  description: 'Nội dung đang được cập nhật.', story: 'Nội dung đang được cập nhật.',
  tip: '', visit: '', access: 'Lối vào chưa được xác minh',
  // No video, photograph, hours, prices or invented editorial copy.
};
// One canonical record, inserted once; both collection and markers consume it.
export const prototypePlaces: DiscoveryPlace[] = approvedPrototypePlaces.flatMap(place =>
  place.slug === 'pho-co' ? [place, operaPlace] : [place]);
export type PrototypeCollectionEntry = DiscoveryPlace;
export const prototypeCollection = prototypePlaces;
export function isMappedPrototypePlace(place: PrototypeCollectionEntry): place is DiscoveryPlace {
  return place.coordinates !== undefined;
}
export function filterPrototypeCollection(state: NeighborhoodState): PrototypeCollectionEntry[] {
  const mapped = new Set(filterNeighborhoodPlaces(prototypePlaces, state, prototypeDistrictPlaceSlugs).map(place => place.slug));
  // Keep editorial collection order; every row now obeys the normal geographic,
  // category and search filters. There is no radius exemption for Opera House.
  return prototypeCollection.filter(place => mapped.has(place.slug));
}

// Prototype editorial grouping, not a change to production district data/boundaries.
export const prototypeDistrictPlaceSlugs: Readonly<Record<string, readonly string[]>> = {
  ...districtPlaceSlugs,
  'Hoàn Kiếm': [...(districtPlaceSlugs['Hoàn Kiếm'] ?? []), ...integratedPrototypeIds, operaPlace.slug],
};
export const populatedPrototypeDistricts = Object.entries(prototypeDistrictPlaceSlugs)
  .map(([name, slugs]) => ({ name, count: prototypePlaces.filter(place => slugs.includes(place.slug)).length }))
  .filter(district => district.count > 0);

export const prototypeReferences = {
  ...Object.fromEntries(integratedPrototypeIds.map(id => {
    const candidate = candidateById(id);
    return [id, { address: candidate.address.value, sourceUrl: candidate.sourceUrls[0] }] as const;
  })),
  [operaPlace.slug]: { address: operaPlace.area, sourceUrl: operaLocationEvidence.addressSourceUrl },
};

const linkedStoryCandidates: ReadonlyArray<readonly [string, readonly string[]]> = [
  ['sofitel-legend-metropole-hanoi', ['la-terrasse-metropole']],
  ['ho-hoan-kiem', ['khong-gian-di-bo-hoan-kiem']],
];
export const prototypeLinkedStories = Object.fromEntries(linkedStoryCandidates.map(([parentId, ids]) => [
  parentId, ids.map(id => {
    const candidate = candidateById(id);
    const category = migrateImapCategory(candidate.categoryId, id);
    if (!isCategory(category)) throw new Error(`Invalid linked-story category: ${id}`);
    return { id, name: candidate.name, categoryId: category,
      description: editorialText(id), sourceUrl: candidate.sourceUrls[0] };
  }),
] as const));

// Giang stays in the audit with unresolved coordinates; no display record/pin is created.
export const heldPrototypeIds = ['cafe-giang-nguyen-huu-huan'] as const;
