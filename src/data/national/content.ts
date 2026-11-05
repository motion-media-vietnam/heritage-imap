import { destinations } from '../destinations/index';
import { destinationRoutes } from '../../lib/destination-routes';
import type { DateWindow, FeaturedMode, Sponsorship } from '../../lib/national-selection';
import { photos, hanoiPhoto, type NationalPhoto } from './assets';
import type { Localized } from './locale';

export const identity = {
  name: 'Heritage Vietnam iMAP',
  heritage: 'https://heritagevietnamairlines.com/',
  airline: 'https://www.vietnamairlines.com/',
  advertise: 'https://advertisement.heritagevietnamairlines.com/',
  contact: 'https://heritagevietnamairlines.com/lien-he/',
  privacy: undefined as string | undefined,
  terms: undefined as string | undefined,
};

export const nationalSettings = { featuredMode: 'auto' as FeaturedMode, slideInterval: 7000 };

export { heroSlides } from './hero';

export interface MapDestination {
  id: string;
  name: string;
  coordinates: readonly [number, number];
  geonameId: number;
  region: Localized;
  description?: Localized;
  photo?: NationalPhoto;
}

export function hubHref(id: string) {
  const hub = Object.values(destinations).find(item => item.id === id && item.status === 'published');
  return hub ? destinationRoutes(hub.id).home : undefined;
}

export const hanoiHref = destinationRoutes(destinations.hanoi.id).home;
export const featured = [
  { id: 'ninh-binh', name: destinations['ninh-binh'].name, photo: photos.river },
  { id: 'quang-ninh', name: 'Quảng Ninh', photo: photos.bay },
  { id: 'hoi-an', name: 'Hội An', photo: photos.lantern },
  { id: 'hue', name: 'Huế', photo: photos.hue },
  { id: 'hanoi', name: destinations.hanoi.name, photo: hanoiPhoto },
];

export const collage = [photos.hue, photos.river, photos.bay, photos.taste, photos.terraces, photos.lantern];

export const sponsorships: Sponsorship[] = [];
// Fixtures are available only when the editor chooses the sponsored preview.
export const previewSponsorships: Sponsorship[] = [
  { destinationId: 'quang-ninh', start: '2000-01-01', end: '2099-12-31', priority: 2, display: true, visualApproved: true },
  { destinationId: 'hanoi', start: '2000-01-01', end: '2099-12-31', priority: 1, display: true, visualApproved: true },
];

interface Story {
  title: Localized;
  description: Localized;
  photo: NationalPhoto;
  destinationId: string;
  booking?: string;
}

interface Campaign extends DateWindow {
  title: Localized;
  description: Localized;
  photo: NationalPhoto;
  sponsored: boolean;
  stories: readonly Story[];
}

export const campaigns: Campaign[] = [];
export const previewCampaign: Campaign = {
  title: ['Theo dấu mùa vàng', 'Following the golden season'],
  description: ['Khi những thửa ruộng ngả màu mật ong, miền cao kể câu chuyện của mình qua ánh sáng.', 'When rice terraces turn the colour of honey, the highlands tell their story through light.'],
  photo: photos.terraces,
  start: '2000-01-01', end: '2099-12-31', sponsored: false,
  stories: [
    { title: ['Đường cong của mùa gặt', 'The curves of harvest'], description: ['Một góc nhìn biên tập về ruộng bậc thang Tây Bắc.', 'An editorial view of the northwestern rice terraces.'], photo: photos.terraces, destinationId: 'mu-cang-chai' },
    { title: ['Hà Nội qua một ngày thu', 'An autumn day in Hanoi'], description: ['Dạo một vòng hồ và để phố cũ dẫn đường.', 'Follow the lake and let the old streets lead the way.'], photo: hanoiPhoto, destinationId: 'hanoi' },
  ],
};

export const wonders: Story[] = [
  { title: ['Trong lòng núi đá', 'Among limestone peaks'], description: ['Tràng An · Ninh Bình', 'Tràng An · Ninh Bình'], photo: photos.river, destinationId: 'ninh-binh' },
  { title: ['Dấu son cung đình', 'The vermilion of imperial Huế'], description: ['Kiến trúc và ký ức ở Huế', 'Architecture and memory in Huế'], photo: photos.hue, destinationId: 'hue' },
  { title: ['Vịnh của những tầng sương', 'A bay in layers of mist'], description: ['Hạ Long · Quảng Ninh', 'Hạ Long · Quảng Ninh'], photo: photos.bay, destinationId: 'quang-ninh' },
];

export const foodStories = [
  { title: ['Một bát bún, nhiều lớp vị', 'A bowl with layers of flavour'], description: ['Rau thơm, nước chấm và một chút khói bếp. Những chi tiết nhỏ làm nên ký ức về một bữa ăn Việt.', 'Fresh herbs, dipping sauce and a little kitchen smoke. The small details that make a Vietnamese meal memorable.'] },
  { title: ['Dừng lại ở bàn ăn Hà Nội', 'Take a seat in Hanoi'], description: ['Theo nhịp hàng quán để khám phá hương vị quen thuộc của thành phố.', 'Follow the rhythm of local tables to discover the city’s familiar flavours.'], href: hanoiHref + '#food' },
] satisfies { title: Localized; description: Localized; href?: string }[];
