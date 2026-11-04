import type { DestinationHub } from '../types.ts';

export const hanoi = {
  id: 'hanoi',
  name: 'Hà Nội',
  status: 'published',
  language: 'vi',
  languageLabel: 'Tiếng Việt',
  locationLabel: 'Hà Nội, Việt Nam',
  brand: {
    name: 'Hanoi iMap',
    wordmark: 'My Hanoi',
    palette: { '--rice-paper': '#F4F1EB', '--deep-ink': '#242724', '--vermilion': '#A63832', '--moss': '#687367', '--old-gold': '#B59670' },
    logo: { src: '/images/hanoi-imap-brand.png', width: 1536, height: 1024, viewBox: '276 236 962 532' },
  },
  partners: [
    { name: 'Sở Văn hóa, Thể thao và Du lịch Hà Nội' },
    { name: 'Trung tâm Heritage – Tổng công ty Hàng không Việt Nam' },
  ],
  seo: {
    title: 'My Hanoi — khám phá theo cách của bạn',
    description: 'Khám phá Hồ Hoàn Kiếm, Phố Cổ, Văn Miếu, Hoàng thành Thăng Long, Hồ Tây và Cầu Long Biên qua bản đồ Hà Nội.',
  },
  navigation: [
    { path: '#results-heading', label: 'Điểm đến' },
    { path: '#experiences', label: 'Trải nghiệm', header: { path: '#unmissable-experiences', label: 'Khám phá' } },
    { path: '#food', label: 'Ẩm thực' },
    { path: '#events', label: 'Sự kiện', header: { path: '#homepage-events' } },
    { path: 'heritage-mach-ban/', label: 'Heritage mách bạn', highlight: true },
  ],
  search: { path: '#search', label: 'Tìm địa điểm ở Hà Nội' },
  footer: {
    eyebrow: 'KHÁM PHÁ NHỮNG ĐIỀU GẦN GŨI',
    headline: ['Một chút khám phá.', 'Một ngày đáng nhớ.'],
    byline: 'Dạo bước Hà Nội · Bản mẫu',
  },
  placeArtCaption: 'Hình minh họa gợi không khí Hà Nội · không phải ảnh chụp thực tế',
} as const satisfies DestinationHub;
