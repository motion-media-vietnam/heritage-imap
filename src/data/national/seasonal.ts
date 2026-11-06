import fansipan from '../../assets/national/seasonal/fansipan-2-1672.webp?url';
import fansipanSmall from '../../assets/national/seasonal/fansipan-2-720.webp?url';
import heritageGuide from '../../assets/national/seasonal/HG Tp HCM.jpg?url';
import type { NationalPhoto } from './assets';
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
  name: ['Heritage Guide TP.HCM', 'Heritage Guide Ho Chi Minh City'],
  title: ['Không gian mới, tầm vóc mới', 'New space, new stature'],
  destination: ['Thành phố Hồ Chí Minh', 'Ho Chi Minh City'],
  artwork: {
    src: heritageGuide,
    small: heritageGuide,
    width: 2560,
    height: 531,
    alt: ['Bìa Heritage Guide, đường chân trời thành phố và mã QR của ấn phẩm', 'Heritage Guide cover, the city skyline and the publication’s QR code'],
  },
  guideUrl: 'https://heritagevietnamairlines.com/cac-an-pham/heritage-guide/tp-ho-chi-minh-nov-2026',
} satisfies { name: Localized; title: Localized; destination: Localized; artwork: NationalPhoto; guideUrl: string };

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
