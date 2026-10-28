import { places } from '../../../data/places.ts';
import type { EditorialCardData, EditorialImage, EditorialSectionData, ExperienceFilter } from './types.ts';

/** Server-side content only. Images are the original client-approved workspace files. */
const images = {
  night: { src: '/images/Dem%20Ha%20noi.jpg', alt: 'Phố Hà Nội đông người ngồi ăn uống dưới ánh đèn buổi tối', width: 547, height: 365, position: '50% 50%' },
  duongLam: { src: '/images/Lang%20co%20duong%20Lam.jpg', alt: 'Cổng làng cổ Đường Lâm dưới tán cây, với hai người đi xe đạp', width: 800, height: 533, position: '50% 65%' },
  batTrang: { src: '/images/kham%20pa%20lang%20nghe%20Bat%20trang%20(1).jpg', alt: 'Đôi tay người thợ tạo hình bát gốm trên bàn xoay ở Bát Tràng', width: 574, height: 584, position: '50% 60%' },
  lotusTea: { src: '/images/tra%20sen.jpg', alt: 'Ấm trà và hai chén trà trên lá sen, bên hoa sen hồng', width: 694, height: 448, position: '60% 45%' },
  baVi: { src: '/images/trekking%20ba%20vi.jpg', alt: 'Những triền rừng xanh Ba Vì dưới mây và sương núi', width: 739, height: 415, position: '50% 60%' },
  hoaLo: { src: '/images/tour%20dem%20hoa%20lo.jpg', alt: 'Hình giới thiệu chương trình Đêm thiêng liêng tại Hỏa Lò với hoạt cảnh và khán giả', width: 800, height: 600, position: '50% 50%' },
  pho: { src: '/images/Pho%20Ha%20Noi.jpg', alt: 'Bát phở bò Hà Nội với hành và rau thơm', width: 1800, height: 1172, position: '55% 50%' },
  com: { src: '/images/heritage-temporary-com.jpg', alt: 'Mâm cốm, hoa quả và bánh bày trên lá sen', width: 1882, height: 1150, position: '50% 60%' },
  vanMieu: { src: '/images/văn%20miếu%20quốc%20tử%20giám%20ht.jpg', alt: 'Khuê Văn Các giữa sân vườn Văn Miếu – Quốc Tử Giám', width: 1000, height: 667, position: '50% 50%' },
  hoanKiem: { src: '/images/Ho%20Hoan%20kiem.jpg', alt: 'Tháp Rùa bên hồ Hoàn Kiếm dưới những tán cây', width: 1200, height: 1031, position: '42% 65%' },
  mausoleum: { src: '/images/lang-chu-tich-ho-chi-minh-8.jpg', alt: 'Lăng Chủ tịch Hồ Chí Minh và cột cờ nhìn từ Quảng trường Ba Đình', width: 1693, height: 1130, position: '50% 83%' },
  oldQuarter: { src: '/images/Pho%20co.jpg', alt: 'Mặt tiền nhà phố với hoa giấy và người mặc áo dài trong khu phố cổ', width: 960, height: 1440, position: '45% 70%' },
} satisfies Record<string, EditorialImage>;

export const experienceFilters: readonly { id: ExperienceFilter; label: string }[] = [
  { id: 'all', label: 'Tất cả' },
  { id: 'nature', label: 'Thiên nhiên' },
  { id: 'culture', label: 'Văn hóa' },
  { id: 'night', label: 'Về đêm' },
];

const pending = 'Nội dung đang được chuẩn bị';
const experiences: readonly EditorialCardData[] = [
  { id: 'ba-vi', title: 'Trekking rừng quốc gia Ba Vì', category: 'Thiên nhiên', experienceCategory: 'nature', description: 'Một khoảng xanh để chậm lại. Nội dung trải nghiệm đang được chuẩn bị.', image: images.baVi, pending: 'Video sắp ra mắt · Ảnh tĩnh' },
  { id: 'bat-trang', title: 'Khám phá làng nghề Bát Tràng', category: 'Văn hóa', experienceCategory: 'culture', description: 'Gặp gỡ những câu chuyện bên bàn xoay và đất gốm.', image: images.batTrang, pending },
  { id: 'hoa-lo', title: 'Tour đêm Hỏa Lò', category: 'Về đêm', experienceCategory: 'night', description: 'Một góc nhìn lịch sử khi thành phố lên đèn.', image: images.hoaLo, pending },
  { id: 'duong-lam', title: 'Làng cổ Đường Lâm', category: 'Văn hóa', experienceCategory: 'culture', description: 'Những nếp nhà, con ngõ và ký ức làng quê.', image: images.duongLam, pending },
  { id: 'hanoi-night', title: 'Đêm Hà Nội', category: 'Về đêm', experienceCategory: 'night', description: 'Dành một buổi tối cho nhịp sống của thành phố.', image: images.night, pending },
];

function destinationCard(slug: string, image: EditorialImage): EditorialCardData {
  const place = places.find(place => place.slug === slug);
  // Never silently reduce an approved three-card section if a source record disappears.
  if (!place) throw new Error(`Missing editorial destination: ${slug}`);
  return { id: slug, title: place.name, category: 'Điểm đến', description: place.description, href: `/places/${place.slug}/`, image };
}

export const editorialSections: readonly EditorialSectionData[] = [
  {
    id: 'unmissable-experiences', headingId: 'experiences-heading', kind: 'experiences',
    title: 'Những trải nghiệm không thể bỏ lỡ', intro: 'Ra ngoài một chút. Mang về một câu chuyện.',
    kicker: 'HÀ NỘI, THEO CÁCH CỦA BẠN', collectionId: 'experience-collection', cards: experiences,
  },
  {
    id: 'food', headingId: 'food-heading', kind: 'food', title: 'Ẩm thực',
    intro: 'Hương vị thân quen, những cuộc hẹn mới.', kicker: 'NẾM MỘT CHÚT HÀ NỘI',
    collectionId: 'food-collection', allLink: { href: '#food-collection', label: 'Khám phá tất cả' },
    cards: [
      { id: 'pho', title: 'Phở – Di sản ẩm thực', category: 'Hương vị Hà Nội', description: 'Một bát phở, bao lớp hương vị và ký ức.', image: images.pho, pending },
      { id: 'com', title: 'Hương cốm mùa thu', category: 'Quà Hà Nội', description: 'Một thức quà nhỏ, một mùa để nhớ.', image: images.com, pending },
      { id: 'lotus-tea', title: 'Chuyện trà sen', category: 'Nếp thưởng thức', description: 'Chậm lại bên một chén trà thơm.', image: images.lotusTea, pending },
    ],
  },
  {
    id: 'attractions', headingId: 'results-heading', kind: 'attractions', title: 'Các điểm tham quan hấp dẫn',
    intro: 'Bắt đầu từ những nơi làm nên ký ức Hà Nội.', kicker: 'HÀ NỘI, THEO CÁCH CỦA BẠN',
    cards: [
      destinationCard('van-mieu', images.vanMieu),
      destinationCard('ho-hoan-kiem', images.hoanKiem),
      // No destination route exists for the mausoleum: intentionally noninteractive.
      { id: 'ho-chi-minh-mausoleum', title: 'Lăng Chủ tịch Hồ Chí Minh', category: 'Điểm đến', description: 'Một điểm đến lịch sử bên Quảng trường Ba Đình.', image: images.mausoleum, pending },
    ],
  },
  {
    id: 'local-tips', headingId: 'tips-heading', kind: 'tips', title: 'Thổ địa mách bạn',
    intro: 'Một vài lời nhắn nhỏ, cho chuyến đi gần gũi hơn.', kicker: 'GÓC NHÌN GẦN GŨI',
    cards: [
      { id: 'morning-lake', title: 'Một sáng đi bộ quanh hồ', category: 'Đi chậm thôi', description: 'Chọn một đoạn ven hồ, dành thời gian quan sát nhịp sống quanh mình.', href: '/places/ho-hoan-kiem/', image: images.hoanKiem },
      { id: 'slow-streets', title: 'Dạo phố theo nhịp riêng', category: 'Lời nhắn từ phố', description: 'Đi thong thả, chú ý xe cộ và hỏi giá trước khi mua hàng.', href: '/places/pho-co/', image: images.oldQuarter },
      { id: 'slow-van-mieu', title: 'Ghé Văn Miếu thật thong thả', category: 'Một chút lưu ý', description: 'Trang phục lịch sự, giữ yên tĩnh và dành thời gian đọc lời giới thiệu.', href: '/places/van-mieu/', image: images.vanMieu },
    ],
  },
];
