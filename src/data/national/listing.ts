import { destinationSearchIndex } from '../destinations/search-index';
import { restaurantCategories, restaurants } from './cuisine';
import { stayCollection, stayTypes } from './stays';
import type { NationalPhoto } from './assets';
import type { Language, Localized } from './locale';

export const listingPath = '/heritage-listing/';
export const listingHref = (lang: Language) => listingPath + (lang === 'en' ? '?lang=en' : '');

export const listingProvinces = destinationSearchIndex.filter(entry => entry.type === 'destination');
export type ListingCategory = 'restaurant' | 'stay';

export interface ListingEditorialFields {
  featuredMonth?: string; // YYYY-MM in Vietnam.
  editorialOrder?: number;
}

export interface ListingEntry extends ListingEditorialFields {
  id: string;
  name: string;
  province: string;
  category: ListingCategory;
  subcategory: Localized;
  coverImage: NationalPhoto;
  shortDescription: Localized;
  destinationUrl: string;
  editorialOrder: number;
  publicationStatus: 'draft' | 'approved';
}

// Derive the listing from existing collections. Each place is still edited in one place.
export const listingEntries: readonly ListingEntry[] = [
  ...restaurants.map((entry): ListingEntry => ({
    id: entry.id,
    name: entry.name,
    province: entry.destinationId,
    category: 'restaurant',
    subcategory: restaurantCategories[entry.category],
    coverImage: entry.image,
    shortDescription: entry.description,
    destinationUrl: entry.detailsUrl,
    featuredMonth: entry.featuredMonth,
    editorialOrder: entry.editorialOrder ?? Number.MAX_SAFE_INTEGER,
    publicationStatus: entry.placement === 'editorial' ? entry.status : 'draft',
  })),
  ...stayCollection.map((entry): ListingEntry => ({
    id: entry.id,
    name: entry.name,
    province: entry.destinationId,
    category: 'stay',
    subcategory: stayTypes[entry.accommodationType],
    coverImage: entry.image,
    shortDescription: entry.description,
    destinationUrl: entry.detailsUrl,
    featuredMonth: entry.featuredMonth,
    editorialOrder: entry.editorialOrder ?? Number.MAX_SAFE_INTEGER,
    publicationStatus: entry.status,
  })),
];

export interface ListingAdvertisement {
  image: NationalPhoto;
  copy: Localized;
  cta: Localized;
  url: string;
}

export const listingAdvertisement: ListingAdvertisement | undefined = undefined;

export const listingCopy = {
  title: ['Những lựa chọn của Heritage.', 'The Heritage selection.'],
  search: ['Tìm điểm đến, nhà hàng, khách sạn...', 'Search destinations, restaurants, hotels...'],
  searchButton: ['Tìm kiếm', 'Search'],
  suggestions: ['Gợi ý tỉnh, thành phố', 'Province and city suggestions'],
  noMatch: ['Hãy chọn một tỉnh hoặc thành phố trong danh sách gợi ý.', 'Choose a province or city from the suggestions.'],
  clear: ['Xem toàn quốc', 'Show all of Vietnam'],
  results: ['Điểm đến đang xem', 'Selected destination'],
  awardsIntro: ['Những lựa chọn nổi bật của tháng.', 'The highlights of the month.'],
  monthlyStay: ['Điểm lưu trú của tháng', 'Stay of the month'],
  monthlyRestaurant: ['Quán ăn của tháng', 'Restaurant of the month'],
  monthlyEmpty: ['Đang chờ lựa chọn được duyệt.', 'The monthly selection is pending approval.'],
  restaurant: ['20 nhà hàng được Heritage tuyển chọn', '20 restaurants selected by Heritage'],
  stay: ['20 điểm lưu trú được Heritage tuyển chọn', '20 stays selected by Heritage'],
  localRestaurant: ['Nhà hàng tại', 'Restaurants in'],
  localStay: ['Điểm lưu trú tại', 'Stays in'],
  empty: ['Danh sách đang được tuyển chọn. Các địa chỉ sẽ xuất hiện sau khi được duyệt.', 'The selection is in progress. Places will appear after editorial approval.'],
  localEmpty: ['Chưa có địa chỉ được duyệt tại điểm đến này.', 'There are no approved listings for this destination yet.'],
  explore: ['Khám phá địa điểm', 'Explore this place'],
  previous: ['Xem mục trước', 'Previous places'],
  next: ['Xem mục tiếp theo', 'Next places'],
  advertising: ['Quảng cáo', 'Advertising'],
  adEmpty: ['Vị trí quảng cáo · Chờ nội dung được duyệt', 'Advertising space · Awaiting approved artwork'],
} satisfies Record<string, Localized>;
