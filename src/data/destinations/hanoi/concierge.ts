import { places } from './places.ts';
import { heritageExperiences } from './heritage-experiences.ts';

/** Editorial presentation only. Identity, facts and coordinates stay in places.ts,
 * the catalog actually served by /imap/. No draft-audit catalog is published here. */
export const destinationPhotos: Readonly<Record<string, string>> = {
  'ho-hoan-kiem': '/images/Ho%20Hoan%20kiem.jpg',
  'pho-co': '/images/Pho%20co.jpg',
  'van-mieu': '/images/văn%20miếu%20quốc%20tử%20giám%20ht.jpg',
  'hoang-thanh-thang-long': '/images/Hoang%20thanh%20Thang%20Long.jpg',
  'ho-tay': '/images/Ho%20tay.jpg',
  'cau-long-bien': '/images/Cau%20Long%20Bien.jpg',
};
export const examplePrompts = [
  'Tôi có 2 giờ quanh Hồ Gươm, nên đi đâu?',
  'Tìm quán ăn chay và cà phê gần đây.',
  'Một buổi chiều nghệ thuật và thư giãn.',
  'Cho tôi khám phá Hà Nội như người bản địa.',
];
export const interests = [
  ['food', 'Ẩm thực'], ['culture', 'Văn hóa'], ['art', 'Nghệ thuật'],
  ['shopping', 'Mua sắm'], ['relaxation', 'Thư giãn'], ['local', 'Khám phá bản địa'],
] as const;
export type Interest = typeof interests[number][0];
export const specialRequirements = ['Ăn chay', 'Halal', 'Phù hợp gia đình', 'Hỗ trợ tiếp cận'] as const;
export const destinationInterests: Readonly<Record<string, readonly Interest[]>> = {
  'ho-hoan-kiem': ['relaxation', 'local'], 'pho-co': ['culture', 'shopping', 'local'],
  'van-mieu': ['culture'], 'hoang-thanh-thang-long': ['culture'],
  'ho-tay': ['relaxation', 'local'], 'cau-long-bien': ['culture', 'local'],
};
export interface EditorialCollection {
  id: string; category: string; title: string; description: string;
  image: string; alt: string; slugs: readonly string[]; pending?: string;
}
export const collections: readonly EditorialCollection[] = [
  { id: 'di-san', category: 'Chốn dừng chân', title: 'Fairmont- Sự kết hợp giữa lưu trú siêu sang và bản sắc Hà Nội',
    description: 'Fairmont Hanoi sở hữu 241 phòng nghỉ được thiết kế tinh tế, bao gồm 38 phòng Fairmont Gold và 12 phòng suite rộng rãi, mỗi không gian là một chốn nghỉ ngơi tĩnh tại.',
    image: '/images/fairmont-hanoi-lobby.jpg', alt: 'Không gian sảnh Fairmont Hanoi',
    slugs: [], pending: 'Bài viết về Fairmont Hanoi đang được cập nhật.' },
  { id: 'am-thuc', category: 'Hương vị Hà Nội', title: 'Ăn một ngày, nhớ một đời.',
    description: 'Một lời hẹn với những hương vị quen mà luôn có điều để khám phá.',
    image: '/images/hanoi-vietnamese-meal.png', alt: 'Mâm cơm Việt với nhiều món ăn truyền thống',
    slugs: [], pending: 'Bộ sưu tập đang biên soạn. Chưa có địa chỉ ẩm thực trong danh mục iMap này.' },
  { id: 'khoang-lang', category: 'Nhịp sống chậm', title: '"Chill" cùng Hà Nội trên cao',
    description: 'Một khoảng trời bên hồ, một nhịp nghỉ giữa phố. Đôi khi, thế là đủ.',
    image: '/images/hanoi-rooftop-bar.jpg', alt: 'Không gian rooftop ngắm Hà Nội lúc hoàng hôn', slugs: ['ho-tay', 'ho-hoan-kiem'] },
  { id: 'con-nguoi', category: 'Thư giãn', title: 'Trekking&Yoga- Bộ đôi lý tưởng cho mùa thu',
    description: '“Wellness-date” – hẹn hò vì sức khỏe – đang trở thành một xu hướng toàn cầu, và sự kết hợp giữa trekking cùng yoga đôi chính là lựa chọn hoàn hảo cho một ngày thu đầy thi vị',
    image: '/images/trekking-yoga-couple.jpg', alt: 'Cặp đôi nắm tay trên đồi cỏ giữa khung cảnh núi mờ sương',
    slugs: [], pending: 'Bài viết Trekking & Yoga đang được cập nhật.' },
  { id: 'goc-pho', category: 'Quà Hà nội', title: 'Bức tranh đô thị tĩnh lặng của Hanoia',
    description: 'Mang thiên nhiên vào từng ngóc ngách của cuộc sống, đó là cảm giác bao trùm nhất khi nhìn ngắm bộ sưu tập mới có tên Urban Forest của Hanoia',
    image: '/images/hanoia-urban-forest.jpg', alt: 'Bộ dụng cụ trang trí họa tiết vẹt thuộc bộ sưu tập Urban Forest của Hanoia', slugs: [],
    pending: 'Bài viết về bộ sưu tập Urban Forest của Hanoia đang được cập nhật.' },
];
export const itineraries = [
  { id: 'hai-gio', title: 'Khám phá Hà Nội trong 1 ngày', duration: 'Quỹ thời gian gợi ý: 7:00- 23:00', area: 'Hoàn Kiếm',
    description: 'Nếu chỉ có 24 giờ trải nghiệm tại Hà Nội, hãy để Heritage giúp bạn liệt kê những điểm vui chơi không thể bỏ lỡ tại bài viết dưới đây nhé.',
    image: '/images/hanoi-one-day-cyclo.png', slugs: ['ho-hoan-kiem', 'pho-co'] },
  { id: 'pho-co-cham', title: 'Một ngày thật chậm ở phố cổ.', duration: 'Quỹ thời gian gợi ý: cả ngày', area: 'Hoàn Kiếm',
    description: 'Không cần đi thật nhiều. Hãy để những nếp nhà và câu chuyện trên phố dẫn lối.',
    image: destinationPhotos['pho-co']!, slugs: ['pho-co', 'ho-hoan-kiem'] },
  { id: 'yeu-nghe-thuat', title: 'Hà Nội cho người yêu nghệ thuật.', duration: 'Ý tưởng cho nửa ngày', area: 'Hà Nội · khu vực đang chọn',
    description: 'Một buổi dành cho sáng tạo và cảm hứng. Các không gian nghệ thuật đang được biên soạn.',
    image: heritageExperiences[2]!.image!.src, slugs: [] },
] as const;
export const imapHref = (slug: string, mapPath = "/imap/") => `${mapPath}?place=${encodeURIComponent(slug)}`;
export const collectionDestinations = (slugs: readonly string[]) => slugs.flatMap(slug => {
  const place = places.find(place => place.slug === slug);
  return place ? [place] : [];
});
