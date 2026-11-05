import { destinations } from '../destinations/index';
import { hanoiPhoto, photos, type NationalPhoto } from './assets';
import type { Sponsorship } from '../../lib/national-selection';
import saigon from '../../assets/national/featured/ho-chi-minh-1536.webp?url';
import saigonSmall from '../../assets/national/featured/ho-chi-minh-720.webp?url';
import quangNinh from '../../assets/national/featured/quang-ninh-1536.webp?url';
import quangNinhSmall from '../../assets/national/featured/quang-ninh-720.webp?url';
import dienBien from '../../assets/national/featured/dien-bien-600.webp?url';

interface FeaturedDestination {
  id: keyof typeof destinations;
  name: string;
  photo: NationalPhoto;
  position: string;
  mobilePosition: string;
}

// Assets belong to the sponsored showcase; shared map and editorial images stay intact.
export const featured = [
  { id: 'hanoi', name: destinations.hanoi.name, photo: hanoiPhoto, position: '44% 58%', mobilePosition: '45% 60%' },
  { id: 'ho-chi-minh', name: destinations['ho-chi-minh'].name, position: '45% 59%', mobilePosition: '45% 59%',
    photo: { src: saigon, small: saigonSmall, width: 1536, height: 1023, alt: ['Toàn cảnh TP. Hồ Chí Minh và sông Sài Gòn trong nắng chiều', 'Ho Chi Minh City and the Saigon River in late afternoon light'] } },
  { id: 'ninh-binh', name: destinations['ninh-binh'].name, photo: photos.river, position: '50% 54%', mobilePosition: '50% 54%' },
  { id: 'quang-ninh', name: destinations['quang-ninh'].name, position: '52% 62%', mobilePosition: '52% 62%',
    photo: { src: quangNinh, small: quangNinhSmall, width: 1536, height: 1024, alt: ['Phụ nữ Dao Thanh Phán ở Bình Liêu, Quảng Ninh trong ánh nắng', 'Dao Thanh Phan women in the sunlight in Binh Lieu, Quang Ninh'] } },
  { id: 'dien-bien', name: destinations['dien-bien'].name, position: '56% 50%', mobilePosition: '56% 50%',
    photo: { src: dienBien, small: dienBien, width: 600, height: 600, alt: ['Cành hoa nở trước những thửa ruộng bậc thang, ảnh minh họa Điện Biên được cung cấp', 'Blossoms above terraced fields, supplied as an illustration for Dien Bien'] } },
] satisfies FeaturedDestination[];

// Demonstration placements only; actual contracts still require a published hub.
export const previewSponsorships: Sponsorship[] = [
  { destinationId: 'hanoi', start: '2000-01-01', end: '2099-12-31', priority: 2, display: true, visualApproved: true },
  { destinationId: 'ho-chi-minh', start: '2000-01-01', end: '2099-12-31', priority: 1, display: true, visualApproved: true },
];
