import { collections as hanoiRecommendations } from '../destinations/hanoi/concierge';
import type { ListingCategory, ListingEntry } from './listing';

type ListingAwardArticle = Pick<ListingEntry, 'name' | 'province' | 'coverImage' | 'shortDescription' | 'destinationUrl'>;

const fairmont = hanoiRecommendations.find(collection => collection.id === 'di-san');
const akunaDish = 'https://heritagevietnamairlines.cdn.vccloud.vn/wp-content/uploads/2024/07/5-1024x683.jpg';

// The editorial slots may feature Heritage articles before a Destination Hub has a venue detail page.
export const listingAwardArticles: Partial<Record<ListingCategory, ListingAwardArticle>> = {
  ...(fairmont && {
    stay: {
      name: 'Fairmont Hanoi',
      province: 'hanoi',
      coverImage: {
        src: fairmont.image, small: fairmont.image, width: 2560, height: 1708,
        alt: [fairmont.alt, 'The lobby at Fairmont Hanoi'],
      },
      shortDescription: [
        'Không gian lưu trú gần Nhà hát Lớn, kết hợp bản sắc Hà Nội với kiến trúc đương đại.',
        'A stay near the Opera House that brings Hanoi’s heritage into a contemporary setting.',
      ],
      destinationUrl: 'https://heritagevietnamairlines.com/fairmont-hanoi-su-ket-hop-giua-luu-tru-sieu-sang-va-ban-sac-ha-noi/',
    },
  }),
  restaurant: {
    name: 'AKUNA',
    province: 'ho-chi-minh',
    coverImage: {
      src: akunaDish, small: akunaDish, width: 1024, height: 683,
      alt: ['Món ăn của AKUNA được trình bày trên đĩa sứ trắng', 'An AKUNA dish plated on white porcelain'],
    },
    shortDescription: [
      'Trải nghiệm fine dining lấy cảm hứng từ nguyên liệu, gia vị và thảo mộc Việt Nam.',
      'A fine-dining experience inspired by Vietnamese ingredients, spices and herbs.',
    ],
    destinationUrl: 'https://heritagevietnamairlines.com/akuna-nha-hang-fine-dining-nhan-sao-michelin-danh-tieng-2/',
  },
};
