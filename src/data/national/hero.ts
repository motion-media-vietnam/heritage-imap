import ninhBinh from '../../assets/national/hero/ninh-binh-1920.webp?url';
import ninhBinhSmall from '../../assets/national/hero/ninh-binh-720.webp?url';
import hanoi from '../../assets/national/hero/hanoi-autumn-1920.webp?url';
import hanoiSmall from '../../assets/national/hero/hanoi-autumn-720.webp?url';
import hoiAn from '../../assets/national/hero/hoi-an-1920.webp?url';
import hoiAnSmall from '../../assets/national/hero/hoi-an-720.webp?url';
import type { NationalPhoto } from './assets';
import type { Localized } from './locale';

// Owner-supplied photography. Dedicated objects keep imagery below the hero intact.
export const heroSlides = [
  {
    photo: { src: ninhBinh, small: ninhBinhSmall, width: 1920, height: 1278, alt: ['Thuyền nhỏ dưới vách núi đá trong ánh sáng dịu ở Ninh Bình', 'Small boats beneath limestone cliffs in soft light in Ninh Bình'] },
    caption: ['Ninh Bình · Miền Bắc', 'Ninh Bình · Northern Vietnam'],
    position: '50% 64%', mobilePosition: '53% 65%',
  },
  {
    photo: { src: hanoi, small: hanoiSmall, width: 1920, height: 1281, alt: ['Lá vàng trước Tháp Rùa và hồ Hoàn Kiếm trong sương nhẹ', 'Golden leaves framing Turtle Tower and Hoàn Kiếm Lake in light mist'] },
    caption: ['Hà Nội · Sắc thu bên hồ', 'Hanoi · Autumn by the lake'],
    position: '50% 57%', mobilePosition: '45% 62%',
  },
  {
    photo: { src: hoiAn, small: hoiAnSmall, width: 1920, height: 1079, alt: ['Phố cổ Hội An và dòng sông bên những mái ngói trong ánh chiều', 'Hội An’s tiled roofs and riverside in soft evening light'] },
    caption: ['Hội An · Miền Trung', 'Hội An · Central Vietnam'],
    position: '52% 55%', mobilePosition: '62% 53%',
  },
] satisfies { photo: NationalPhoto; caption: Localized; position: string; mobilePosition: string }[];
