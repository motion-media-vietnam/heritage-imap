import type { DateWindow } from '../../lib/national-selection';
import type { destinations } from '../destinations/index';
import { photos, type NationalPhoto } from './assets';
import type { Localized } from './locale';

export const offerCategories = {
  accommodation: ['Lưu trú', 'Accommodation'],
  experiences: ['Trải nghiệm du lịch', 'Travel experiences'],
  transportation: ['Di chuyển', 'Transportation'],
  tours: ['Tour và hoạt động', 'Tours & activities'],
} satisfies Record<string, Localized>;

export interface OfferStory {
  id: string;
  title: Localized;
  description: Localized;
  destinationId: keyof typeof destinations;
  category: keyof typeof offerCategories;
  photo: NationalPhoto;
}

export interface Offer extends OfferStory, DateWindow {
  status: 'draft' | 'approved';
  partner: string;
  details: Localized;
  booking: string;
}

export const offers: Offer[] = [];

export const offerExamples: readonly OfferStory[] = [
  { id: 'stay-example', title: ['Một kỳ nghỉ chậm', 'A slower escape'], description: ['Hình dung một kỳ nghỉ với nhiều thời gian cho cảnh sắc và những khoảng lặng.', 'Picture a stay with room for scenery and quiet moments.'], destinationId: 'ninh-binh', category: 'accommodation', photo: photos.river },
  { id: 'water-example', title: ['Một ngày trên mặt vịnh', 'A day on the bay'], description: ['Góc nhìn khác về một hành trình qua miền nước và núi đá.', 'Another way to imagine a journey through waters and limestone islands.'], destinationId: 'quang-ninh', category: 'tours', photo: photos.bay },
  { id: 'taste-example', title: ['Qua những bàn ăn', 'Around the table'], description: ['Gợi mở những trải nghiệm bắt đầu từ hương vị địa phương.', 'A glimpse of experiences that begin with local flavours.'], destinationId: 'ho-chi-minh', category: 'experiences', photo: photos.taste },
];

export const offerCopy = {
  title: ['Heritage Travel Offers', 'Heritage Travel Offers'],
  subtitle: ['Những ưu đãi đáng giá cho hành trình tiếp theo của bạn.', 'Worthwhile offers for your next journey.'],
  awaiting: ['Những hành trình đáng mong đợi', 'Journeys worth looking forward to'],
  empty: ['Heritage đang tuyển chọn những trải nghiệm và ưu đãi đặc biệt dành cho chuyến đi tiếp theo của bạn.', 'Heritage is curating special experiences and offers for your next trip.'],
  showDemo: ['Xem bố cục minh họa', 'Preview the sample layout'],
  exitDemo: ['Về trạng thái chưa có ưu đãi', 'Return to the no-offers view'],
  demoLabel: ['Dữ liệu minh họa', 'Illustrative data'],
  demoDescription: ['Bố cục để duyệt. Các mục minh họa chưa mở đặt dịch vụ.', 'Layout preview. These sample entries are unavailable to book.'],
  view: ['Khám phá ưu đãi', 'Explore offer'],
} satisfies Record<string, Localized>;
