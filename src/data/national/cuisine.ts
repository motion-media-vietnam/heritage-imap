import { photos, type NationalPhoto } from './assets';
import type { Language, Localized } from './locale';
import { approvalCollectionHref, approvalReview } from '../../lib/national-approval';

export function cuisineHref(lang: Language) {
  if (approvalReview) return approvalCollectionHref('am-thuc', lang);
  return '/national-preview/am-thuc/' + (lang === 'en' ? '?lang=en' : '');
}

interface CulinaryStory {
  id: string;
  destinationId: string;
  category: Localized;
  title: Localized;
  teaser: Localized;
  href: string;
  image?: NationalPhoto;
}

export const culinaryStories: readonly [CulinaryStory, ...CulinaryStory[]] = [
  {
    id: 'bun-bo-hue',
    destinationId: 'hue',
    category: ['Nếp ăn miền Trung', 'Central Vietnam'],
    title: ['Tản mạn tô bún bò trên đất cố đô Huế', 'A bowl of bún bò in imperial Huế'],
    teaser: ['Từ nồi nước lèo đến thìa tương ớt, một tô bún đưa ta vào nhịp sống của xứ Huế.', 'From the simmering broth to a spoonful of chilli, a bowl of noodles opens a window onto life in Huế.'],
    href: 'https://heritagevietnamairlines.com/tan-man-to-bun-bo-tren-dat-co-do-hue/',
    image: photos.taste,
  },
  {
    id: 'cho-lon',
    destinationId: 'ho-chi-minh',
    category: ['Ký ức phố thị', 'City memories'],
    title: ['Bộ đôi hương vị kể chuyện ẩm thực Chợ Lớn', 'Two flavours that tell the story of Chợ Lớn'],
    teaser: ['Cà phê vợt và những món quà phố kể chuyện giao thoa văn hóa trong lòng Sài Gòn.', 'Cloth-filter coffee and street snacks tell a story of cultures meeting in Saigon.'],
    href: 'https://heritagevietnamairlines.com/bo-doi-huong-vi-ke-chuyen-am-thuc-cho-lon/',
  },
  {
    id: 'vi-thu-ha-noi',
    destinationId: 'hanoi',
    category: ['Thức quà theo mùa', 'Seasonal flavours'],
    title: ['Vị thu Hà Nội trên những chuyến bay', 'The flavours of Hanoi’s autumn in flight'],
    teaser: ['Cốm, sấu và hồng gợi nhớ những ngày thu Hà Nội, ngay cả khi đã rời mặt đất.', 'Green rice, sấu fruit and persimmons evoke autumn in Hanoi, even after take-off.'],
    href: 'https://heritagevietnamairlines.com/vietnam-airlines-goi-tron-tinh-hoa-am-thuc-mua-thu-ha-noi-tren-nhung-chuyen-bay/',
  },
];

export const restaurantCategories = {
  'fine-dining': ['Fine Dining', 'Fine dining'],
  local: ['Ẩm thực địa phương', 'Local cuisine'],
  traditional: ['Quán ăn truyền thống', 'Traditional eateries'],
  vegetarian: ['Quán chay', 'Vegetarian dining'],
} satisfies Record<string, Localized>;

export interface Restaurant {
  id: string;
  destinationId: string;
  name: string;
  category: keyof typeof restaurantCategories;
  cuisine: Localized;
  experience: Localized;
  description: Localized;
  image: NationalPhoto;
  selectionYear: number;
  detailsUrl: string;
  officialUrl?: string;
  coordinates?: readonly [latitude: number, longitude: number];
  status: 'draft' | 'approved';
  placement: 'editorial' | 'sponsored';
}

export const restaurants: readonly Restaurant[] = [];

export const cuisineCopy = {
  intro: ['Mỗi món ăn là một câu chuyện. Mỗi vùng đất là một hương vị đáng nhớ.', 'Every dish tells a story. Every place leaves a flavour to remember.'],
  stories: ['Ẩm thực kể chuyện đất nước', 'A country told through food'],
  read: ['Đọc câu chuyện', 'Read the story'],
  discover: ['Khám phá văn hóa ẩm thực', 'Explore culinary culture'],
  recommends: ['Heritage mách bạn', 'Heritage recommends'],
  restaurantInvitation: ['Những nhà hàng đáng khám phá nhất Việt Nam.', 'The Vietnamese tables worth discovering.'],
  restaurantIntro: ['Từ quán quen của người địa phương đến những bàn ăn dành cho một dịp đặc biệt, Heritage tuyển chọn những nơi đáng để bạn dừng chân.', 'From neighbourhood favourites to tables for special occasions, Heritage curates places worth stopping for.'],
  find: ['Khám phá nhà hàng', 'Explore restaurants'],
  hero: ['Khám phá Việt Nam qua những hương vị đáng nhớ.', 'Discover Vietnam through flavours worth remembering.'],
  guide: ['Heritage mách bạn — Ăn gì, ở đâu?', 'Heritage recommends — What to eat, where to go?'],
  guideIntro: ['Những địa chỉ ẩm thực đáng trải nghiệm trên khắp Việt Nam.', 'Memorable places to eat across Vietnam.'],
  empty: ['Danh sách đang được tuyển chọn', 'The selection is in the making'],
  emptyDetail: ['Heritage sẽ giới thiệu các địa chỉ tại đây sau khi thông tin và hình ảnh được duyệt. Trong lúc chờ, mời bạn đọc các câu chuyện ẩm thực bên dưới.', 'Addresses will appear here once their details and images have been approved. In the meantime, explore the culinary stories below.'],
  criteria: ['Tiêu chí tuyển chọn', 'How we select'],
  criteriaDetail: ['Heritage xem xét bản sắc món ăn, chất lượng trải nghiệm và khả năng xác minh thông tin trước khi duyệt. Nội dung tài trợ được ghi nhãn riêng.', 'Heritage considers culinary identity, the dining experience and verifiable information before approval. Sponsored placements are labelled separately.'],
  region: ['Khám phá theo địa phương', 'Explore by destination'],
} satisfies Record<string, Localized>;
