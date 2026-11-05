import type { Localized } from './locale';

export const mapUi = {
  spotlight: ['Heritage Spotlight', 'Heritage Spotlight'],
  editorial: ['Góc nhìn Heritage', 'The Heritage view'],
  selected: ['Điểm đến bạn chọn', 'Your selected destination'],
  sponsored: ['Điểm đến tài trợ', 'Sponsored destination'],
  sponsorDemo: ['Mẫu spotlight tài trợ', 'Sponsored spotlight demo'],
  directory: ['Khám phá điểm đến', 'Discover destinations'],
  more: ['Xem thêm điểm đến', 'More destinations'],
  return: ['Về spotlight', 'Back to spotlight'],
  preparing: ['Heritage đang tuyển chọn câu chuyện và trải nghiệm cho điểm đến này.', 'Heritage is curating stories and experiences for this destination.'],
  photoPending: ['Góc nhìn đang được tuyển chọn', 'A new view is being curated'],
  featuredPins: ['Điểm đến nổi bật', 'Featured destinations'],
  otherPins: ['Điểm đến khác', 'More destinations'],
} satisfies Record<string, Localized>;
