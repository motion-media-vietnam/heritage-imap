import bay from '../../assets/national/bay-1536.webp?url';
import baySmall from '../../assets/national/bay-720.webp?url';
import terraces from '../../assets/national/terraces-1536.webp?url';
import terracesSmall from '../../assets/national/terraces-720.webp?url';
import lantern from '../../assets/national/lantern-1536.webp?url';
import lanternSmall from '../../assets/national/lantern-720.webp?url';
import river from '../../assets/national/river-1536.webp?url';
import riverSmall from '../../assets/national/river-720.webp?url';
import hue from '../../assets/national/hue-1536.webp?url';
import hueSmall from '../../assets/national/hue-720.webp?url';
import taste from '../../assets/national/taste-1536.webp?url';
import tasteSmall from '../../assets/national/taste-720.webp?url';
import saigon from '../../assets/national/saigon-720.webp?url';
import dienbien from '../../assets/national/dienbien-720.webp?url';
import type { Localized } from './locale';

export interface NationalPhoto {
  src: string;
  small: string;
  width: number;
  height: number;
  alt: Localized;
}

export const photos = {
  saigon: { src: saigon, small: saigon, width: 720, height: 480, alt: ['Minh họa thành phố bên sông Sài Gòn lúc chạng vạng', 'Illustration of the city along the Saigon River at dusk'] },
  dienbien: { src: dienbien, small: dienbien, width: 720, height: 480, alt: ['Minh họa cánh đồng giữa thung lũng Điện Biên', 'Illustration of fields in a valley in Điện Biên'] },
  bay: { src: bay, small: baySmall, width: 1536, height: 1024, alt: ['Núi đá vôi và thuyền nhỏ trên vịnh trong sương', 'Limestone islands and a small boat in morning mist'] },
  terraces: { src: terraces, small: terracesSmall, width: 1536, height: 1024, alt: ['Ruộng bậc thang vàng uốn theo sườn núi', 'Golden terraces tracing a mountainside'] },
  lantern: { src: lantern, small: lanternSmall, width: 1536, height: 1024, alt: ['Phố mái ngói vàng ấm dưới ánh đèn lồng', 'Ochre shop houses beneath glowing lanterns'] },
  river: { src: river, small: riverSmall, width: 1536, height: 1024, alt: ['Thuyền chèo trên dòng nước xanh giữa núi đá vôi', 'A rowboat on jade water between limestone mountains'] },
  hue: { src: hue, small: hueSmall, width: 1024, height: 1536, alt: ['Cửa son và hành lang gỗ trong kiến trúc cung đình', 'A vermilion gate and timber corridor in imperial architecture'] },
  taste: { src: taste, small: tasteSmall, width: 1024, height: 1536, alt: ['Bún, rau thơm và bát nước chấm trên bàn gỗ', 'Rice noodles, herbs and dipping sauce on a wooden table'] },
} satisfies Record<string, NationalPhoto>;

export const hanoiPhoto: NationalPhoto = {
  src: '/images/Ho%20Hoan%20kiem.jpg',
  small: '/images/Ho%20Hoan%20kiem.jpg',
  width: 1200,
  height: 1031,
  alt: ['Tháp Rùa bên Hồ Hoàn Kiếm', 'Turtle Tower on Hoàn Kiếm Lake'],
};
