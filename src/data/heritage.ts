export interface HeritageStory {
  videoId: string;
  url: string;
  title: string;
  /** Full Vietnamese description retrieved from YouTube, not editorial copy. */
  description: string | null;
  /** Concise editorial copy derived only from the verified description. */
  excerpt: string | null;
  /** YouTube's displayed publication date, ISO date only; no time inferred. */
  publicationDate: string | null;
  publicationTimestamp: string | null;
  thumbnail: { url: string; width: number; height: number };
  cover: {
    src: string;
    alt: string;
    position: string;
    width?: number;
    height?: number;
    approvalStatus: 'temporary-pending-original-editorial-still' | 'owner-supplied-pending-visual-approval';
  };
  verification: {
    checkedOn: string;
    method: string;
    sourceUrl: string;
    evidenceFile: string;
    unavailable: string[];
  };
}

// Manually verified 2026-10-17 via official oEmbed and public watch-page data.
// No Data API credentials were available. Descriptions/dates use hl=vi;
// date labels were cross-checked against hl=en. No runtime metadata requests.
// Supplied high-resolution covers remain in use, NOT the 480px YouTube previews.
export const heritageVideos: HeritageStory[] = [
  {
    videoId: '2CxNZtrFedo',
    url: 'https://www.youtube.com/watch?v=2CxNZtrFedo',
    title: 'Những Trải Nghiệm Mùa Thu Hà Nội Không Thể Bỏ Lỡ | Heritage',
    description: 'Mùa thu Hà Nội là lời mời gọi bước ra phố và chậm lại để cảm nhận những nét duyên rất riêng của Thủ đô. Tản bộ qua những con phố cổ, ngắm phố phường trong nắng dịu nhẹ, tiết trời mát mẻ; ghé Hàng Mã, nơi sắc màu Trung thu rực rỡ gọi về ký ức tuổi thơ; hoặc tham gia workshop tự tay làm những chiếc bánh Trung thu tròn đầy hương vị truyền thống. Mùa thu này, Hà Nội còn mở ra những không gian trang trí mang dấu ấn xưa như tuyến tàu số 6, mang đến những trải nghiệm văn hóa thú vị. Hãy cùng Hà Pu tận hưởng những trải nghiệm không thể bỏ lỡ của mùa thu Thủ đô nhé!\n\n#Heritageguide #hanoi #culture  #TravelVietnam #ExploreVietnam #food #hanoifood #autumn #trungthu',
    excerpt: 'Cùng Hà Pu dạo phố cổ, ghé Hàng Mã và trải nghiệm làm bánh Trung thu trong tiết thu Hà Nội.',
    publicationDate: '2026-09-11',
    publicationTimestamp: null,
    thumbnail: { url: 'https://i.ytimg.com/vi/2CxNZtrFedo/hqdefault.jpg', width: 480, height: 360 },
    cover: {
      src: '/images/heritage-temporary-autumn.jpg',
      alt: 'Lá thu vàng bên hồ Hoàn Kiếm, Tháp Rùa phía xa',
      position: '50% 55%',
      approvalStatus: 'temporary-pending-original-editorial-still',
    },
    verification: {
      checkedOn: '2026-10-17',
      method: 'YouTube oEmbed + public watch-page metadata (vi/en)',
      sourceUrl: 'https://www.youtube.com/watch?v=2CxNZtrFedo&hl=vi',
      evidenceFile: 'output/sprint-01/metadata/2CxNZtrFedo.json',
      unavailable: ['publicationTimestamp'],
    },
  },
  {
    videoId: 'Sige0y8XxeU',
    url: 'https://www.youtube.com/watch?v=Sige0y8XxeU',
    title: 'Thu Rồi, Đến Hà Nội Ăn Cốm Thôi! | Heritage',
    description: 'Mùa thu Hà Nội mang một vẻ đẹp dịu dàng, trong trẻo, khi những con phố hiu hiu gió nhẹ và hương hoa sữa thoảng qua từng góc phố. Trong bức tranh ấy, cốm – thức quà đặc trưng của mùa thu Hà Nội – gói trọn hương vị của đất trời trong sắc xanh non, hương thơm dịu dàng và vị ngọt thanh của lúa mới. Du khách có thể ghé những hàng cốm truyền thống, thưởng thức cốm tươi gói trong lá sen, nhâm nhi cùng chén trà nóng, hay khám phá những món ngon từ cốm như chuối cốm, chả cốm, bánh cốm… Một buổi dạo phố trong tiết thu se nhẹ, thong thả nếm vị cốm và ghé qua những con phố cũ, hàng quán địa phương, sẽ để lại dư vị khó quên về một mùa đẹp rất riêng của Hà Nội.\n\n#Heritageguide #hanoi #culture  #TravelVietnam #ExploreVietnam #food #hanoifood #autumn',
    excerpt: 'Cốm tươi gói trong lá sen, trà nóng và những món ngon từ cốm giữa mùa thu Hà Nội.',
    publicationDate: '2026-08-25',
    publicationTimestamp: null,
    thumbnail: { url: 'https://i.ytimg.com/vi/Sige0y8XxeU/hqdefault.jpg', width: 480, height: 360 },
    cover: {
      src: '/images/heritage-temporary-com.jpg',
      alt: 'Mâm cốm, hoa quả và bánh trên lá sen',
      position: '50% 60%',
      approvalStatus: 'temporary-pending-original-editorial-still',
    },
    verification: {
      checkedOn: '2026-10-17',
      method: 'YouTube oEmbed + public watch-page metadata (vi/en)',
      sourceUrl: 'https://www.youtube.com/watch?v=Sige0y8XxeU&hl=vi',
      evidenceFile: 'output/sprint-01/metadata/Sige0y8XxeU.json',
      unavailable: ['publicationTimestamp'],
    },
  },
  {
    videoId: '-jVXCHcCoiw',
    url: 'https://www.youtube.com/watch?v=-jVXCHcCoiw',
    title: 'Hương Sen Hà Nội - Thử Thách Ăn Hết Một Cây Sen! | Heritage Guide',
    description: 'Mùa sen Hà Nội đẹp nhất không chỉ để ngắm mà còn để… ăn! Trong tập Heritage Guide này, Cee Jay sẽ dẫn bạn khám phá một mâm cỗ sen đầy hấp dẫn với đủ món ngon được chế biến từ những phần tinh túy nhất của cây sen. Từ các món khai vị thanh mát đến những món ăn đậm đà, tất cả đều mang hương vị rất riêng của mùa hè Hà Nội. Và tất nhiên, trải nghiệm sẽ chưa thể trọn vẹn nếu thiếu một chén trà sen Bách Diệp thơm ngát. Nếu muốn biết sen có thể “biến hóa” thành bao nhiêu món và những món ngon gây bất ngờ thế nào, hãy cùng Cee Jay nhập hội và thưởng thức trọn vẹn tinh hoa ẩm thực sen ngay thôi!\n\n#Heritageguide #hanoi  #foodtour  #TravelVietnam #ExploreVietnam #food  #foodchallenge #lotus',
    excerpt: 'Cùng Cee Jay khám phá mâm cỗ sen và trà sen Bách Diệp của mùa hè Hà Nội.',
    publicationDate: '2026-06-14',
    publicationTimestamp: null,
    thumbnail: { url: 'https://i.ytimg.com/vi/-jVXCHcCoiw/hqdefault.jpg', width: 480, height: 360 },
    cover: {
      src: '/images/heritage-lotus.webp',
      alt: 'Mâm cỗ sen với các món ăn bày trong cánh hoa và lá sen',
      position: '50% 50%',
      width: 1600,
      height: 1064,
      approvalStatus: 'owner-supplied-pending-visual-approval',
    },
    verification: {
      checkedOn: '2026-10-17',
      method: 'YouTube oEmbed + public watch-page metadata (vi/en)',
      sourceUrl: 'https://www.youtube.com/watch?v=-jVXCHcCoiw&hl=vi',
      evidenceFile: 'output/sprint-01/metadata/-jVXCHcCoiw.json',
      unavailable: ['publicationTimestamp'],
    },
  },
];

export const [currentHeritageChoice, ...pastHeritageChoices] = heritageVideos;
