import fansipan from '../../assets/national/seasonal/fansipan-2-1672.webp?url';
import fansipanSmall from '../../assets/national/seasonal/fansipan-2-720.webp?url';
import { photos, type NationalPhoto } from './assets';
import type { Localized } from './locale';
import type { SeasonalSponsor } from '../../lib/seasonal-selection';

interface SeasonalStop {
  id: string;
  kind: 'area' | 'place';
  teaser?: Localized;
  photo?: NationalPhoto;
}

export interface SeasonalArtwork {
  title: Localized;
  artwork: NationalPhoto;
  stops: readonly SeasonalStop[];
}

export const editorialSeason = {
  title: ['Theo dấu mùa vàng', 'Following the golden season'],
  intro: ['Những mùa lúa chín đẹp nhất trên những cung đường Việt Nam.', 'Follow the golden rice terraces along Vietnam’s highland roads.'],
  artwork: photos.terraces,
  stops: [
    { id: 'mu-cang-chai', kind: 'area', photo: photos.terraces, teaser: ['Ruộng bậc thang Tây Bắc.', 'Northwestern rice terraces.'] },
    { id: 'hoang-su-phi', kind: 'place', teaser: ['Những thửa ruộng trên sườn núi.', 'Rice terraces on the mountainsides.'] },
  ],
} satisfies SeasonalArtwork & { intro: Localized };

type SeasonalCampaign = SeasonalSponsor & SeasonalArtwork;

// Only approved contracts belong in this list. Preview art has no contract dates.
export const seasonalCampaigns: readonly SeasonalCampaign[] = [];

export const previewSeasonalCampaign = {
  id: 'fansipan-winter-2026',
  sponsorName: 'Sun World',
  title: ['Khám phá Fansipan', 'Explore Fansipan'],
  artwork: {
    src: fansipan,
    small: fansipanSmall,
    width: 1672,
    height: 941,
    alt: ['Sun World · Lễ hội mùa đông trên đỉnh Fansipan 2026', 'Sun World · Winter Festival on Mount Fansipan 2026'],
  },
  bookingUrl: 'https://sunworld.vn/vi/fansipan',
  stops: [
    { id: 'fansipan', kind: 'place', teaser: ['Đỉnh núi trên dãy Hoàng Liên Sơn.', 'A summit in the Hoàng Liên Sơn range.'] },
    { id: 'sa-pa', kind: 'area', teaser: ['Điểm khởi hành tới Fansipan.', 'Gateway to Fansipan.'] },
  ],
} satisfies SeasonalArtwork & { id: string; sponsorName: string; bookingUrl: string };
