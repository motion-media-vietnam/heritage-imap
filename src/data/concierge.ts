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
  { id: 'di-san', category: 'Văn hóa & ký ức', title: 'Dấu tích nghìn năm trong từng bước chân.',
    description: 'Đi chậm qua những lớp sân, đọc một tấm bia, nghe câu chuyện kinh thành xưa.',
    image: destinationPhotos['van-mieu']!, alt: 'Không gian Văn Miếu – Quốc Tử Giám',
    slugs: ['van-mieu', 'hoang-thanh-thang-long'] },
  { id: 'am-thuc', category: 'Hương vị Hà Nội', title: 'Ăn một ngày, nhớ một đời.',
    description: 'Một lời hẹn với những hương vị quen mà luôn có điều để khám phá.',
    image: heritageExperiences[1]!.image!.src, alt: heritageExperiences[1]!.image!.alt,
    slugs: [], pending: 'Bộ sưu tập đang biên soạn. Chưa có địa chỉ ẩm thực trong danh mục iMap này.' },
  { id: 'khoang-lang', category: 'Nhịp sống chậm', title: 'Những khoảng lặng rất Hà Nội.',
    description: 'Một khoảng trời bên hồ, một nhịp nghỉ giữa phố. Đôi khi, thế là đủ.',
    image: destinationPhotos['ho-tay']!, alt: 'Không gian ven Hồ Tây', slugs: ['ho-tay', 'ho-hoan-kiem'] },
  { id: 'con-nguoi', category: 'Con người & nếp sống', title: 'Gặp những con người làm nên Hà Nội.',
    description: 'Những câu chuyện về người giữ nghề, giữ ký ức và giữ một nét riêng của thành phố.',
    image: heritageExperiences[2]!.image!.src, alt: heritageExperiences[2]!.image!.alt,
    slugs: [], pending: 'Ý tưởng biên tập đang phát triển. Chưa mở đăng ký gặp gỡ hay trải nghiệm.' },
  { id: 'goc-pho', category: 'Dạo phố', title: 'Những góc phố ít người biết.',
    description: 'Bắt đầu từ Phố Cổ quen thuộc, rồi dành thời gian nhìn kỹ những chi tiết thường đi qua.',
    image: destinationPhotos['pho-co']!, alt: 'Nếp phố ở khu phố cổ Hà Nội', slugs: ['pho-co'],
    pending: 'Phố Cổ là điểm khởi đầu; danh sách ngõ nhỏ riêng đang được biên soạn.' },
];
export const itineraries = [
  { id: 'hai-gio', title: 'Hà Nội trong 2 giờ.', duration: 'Quỹ thời gian gợi ý: 2 giờ', area: 'Hoàn Kiếm',
    description: 'Dành một khoảng ngắn cho mặt hồ và nhịp phố. Chọn một điểm dừng nếu muốn thong thả hơn.',
    image: destinationPhotos['ho-hoan-kiem']!, slugs: ['ho-hoan-kiem', 'pho-co'] },
  { id: 'pho-co-cham', title: 'Một ngày thật chậm ở phố cổ.', duration: 'Quỹ thời gian gợi ý: cả ngày', area: 'Hoàn Kiếm',
    description: 'Không cần đi thật nhiều. Hãy để những nếp nhà và câu chuyện trên phố dẫn lối.',
    image: destinationPhotos['pho-co']!, slugs: ['pho-co', 'ho-hoan-kiem'] },
  { id: 'yeu-nghe-thuat', title: 'Hà Nội cho người yêu nghệ thuật.', duration: 'Ý tưởng cho nửa ngày', area: 'Hà Nội · khu vực đang chọn',
    description: 'Một buổi dành cho sáng tạo và cảm hứng. Các không gian nghệ thuật đang được biên soạn.',
    image: heritageExperiences[2]!.image!.src, slugs: [] },
] as const;
export const imapHref = (slug: string) => `/imap/?place=${encodeURIComponent(slug)}`;
export const collectionDestinations = (slugs: readonly string[]) => slugs.flatMap(slug => {
  const place = places.find(place => place.slug === slug);
  return place ? [place] : [];
});
