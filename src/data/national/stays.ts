import type { NationalPhoto } from './assets';
import type { Language, Localized } from './locale';
import { approvalCollectionHref, approvalReview } from '../../lib/national-approval';
import type { ListingEditorialFields } from './listing';

export function staysHref(lang: Language) {
  if (approvalReview) return approvalCollectionHref('luu-tru', lang);
  return '/national-preview/luu-tru/' + (lang === 'en' ? '?lang=en' : '');
}

export const staysPreviewPhoto: NationalPhoto = {
  src: '/images/Metropole%20legand.jpeg',
  small: '/images/Metropole%20legand.jpeg',
  width: 2048,
  height: 1365,
  alt: ['Hành lang khách sạn di sản với lan can gỗ, đèn vàng và rèm xanh', 'A heritage hotel gallery with timber balustrades, warm lamps and green curtains'],
};

export const stayTypes = {
  hotel: ['Khách sạn', 'Hotel'],
  boutique: ['Khách sạn boutique', 'Boutique hotel'],
  heritage: ['Khách sạn di sản', 'Heritage hotel'],
  homestay: ['Homestay', 'Homestay'],
  resort: ['Khu nghỉ dưỡng', 'Resort'],
} satisfies Record<string, Localized>;

export interface Stay extends ListingEditorialFields {
  id: string;
  name: string;
  destinationId: string;
  accommodationType: keyof typeof stayTypes;
  description: Localized;
  image: NationalPhoto;
  selectionYear: number;
  detailsUrl: string;
  bookingUrl?: string;
  status: 'draft' | 'approved';
}

export const stayCollection: readonly Stay[] = [];

export const stayCopy = {
  headline: ['Những điểm dừng chân tốt nhất cho hành trình của bạn', 'The best places to stay along your journey'],
  intro: ['Khách sạn và resort đáng trải nghiệm được Heritage tuyển chọn.', 'Hotels and resorts worth experiencing, selected by Heritage.'],
  explore: ['Khám phá lưu trú', 'Explore stays'],
  guide: ['Tuyển tập lưu trú', 'The stay collection'],
  empty: ['Danh sách đang được tuyển chọn.', 'The selection is in the making.'],
  emptyDetail: ['Heritage sẽ giới thiệu các địa chỉ tại đây sau khi thông tin, hình ảnh và trải nghiệm lưu trú được biên tập và duyệt.', 'Places to stay will appear here once their information, photography and guest experience have been reviewed and approved.'],
  back: ['Về Heritage List', 'Back to the Heritage List'],
  details: ['Xem chi tiết', 'View details'],
  book: ['Đặt lưu trú', 'Book a stay'],
} satisfies Record<string, Localized>;
