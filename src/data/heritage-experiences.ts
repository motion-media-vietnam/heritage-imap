/** Sprint 06L.1: static thumbnails only. No destinations or video sources.
 * Populate a missing image only after confidently matching the client upload.
 */
export interface HeritageExperienceThumbnail {
  title: string;
  image: {
    src: string;
    alt: string;
    width: number;
    height: number;
    position: string;
  } | null;
}

export const heritageExperiences: readonly HeritageExperienceThumbnail[] = [
  {
    title: 'Tour đêm Hoàng thành',
    image: {
      src: '/images/tour%20dem%20hoang%20thanh.jpg',
      alt: 'Đoan Môn Hoàng thành Thăng Long được chiếu sáng khi đêm xuống',
      width: 1354,
      height: 760,
      position: '50% 50%',
    },
  },
  {
    title: 'Phở – Di sản ẩm thực',
    image: {
      src: '/images/Pho%20Ha%20Noi.jpg',
      alt: 'Bát phở bò Hà Nội với hành, rau thơm và bánh phở',
      width: 1800,
      height: 1172,
      position: '55% 50%',
    },
  },
  {
    title: 'Ca trù',
    image: {
      src: '/images/ca%20tru.jpg',
      alt: 'Hai nghệ nhân biểu diễn ca trù với nhạc cụ truyền thống',
      width: 1920,
      height: 1080,
      // Keep both central performers and the lute in the square crop.
      position: '62% 50%',
    },
  },
];
