/** Prototype story overlay: earlier client copy plus 06I source-researched reference stories.
 * Research is dated in visitor notes; it is not a guarantee of future access or CMS approval.
 * Route-only overlay: never changes the map catalog, identities, coordinates or categories.
 * Videos are embedded from the supplied URLs; no asset ownership/HD/transcript claim.
 */
import type { DestinationMedia } from '../lib/destination-media.ts';

export interface FeaturedStory {
  /** Optional discriminated presentation; legacy YouTube mappings remain intact. */
  media?: DestinationMedia;
  youtubeUrl?: string;
  description: string;
  practical: ReadonlyArray<{ label: string; value: string; wide?: boolean; sourceUrl?: string }>;
  practicalNote: string;
  address?: string;
  referenceLinks?: ReadonlyArray<{ label: string; url: string }>;
  affiliateUrl?: string | null;
  affiliateEnabled?: boolean;
  affiliateLabel?: string;
}

const vanMieuVisitorUrl = 'https://vanmieu.gov.vn/vi/introduction/visitor-information';
const vanMieuNightUrl = 'https://www.vanmieu.gov.vn/vi/experience/night-tour';
const citadelAdmissionUrl = 'https://hoangthanhthanglong.vn/thong-bao-thau-doi-gia-ve-tham-quan-hoang-thanh-thang-long/';
const citadelVisitorUrl = 'https://hoangthanhthanglong.vn/';

export const featuredPrototypeStories: Readonly<Record<string, FeaturedStory | undefined>> = {
  'van-mieu': {
    youtubeUrl: 'https://www.youtube.com/watch?v=3_7tOtNattU',
    description: 'Bước qua cổng Văn Miếu – Quốc Tử Giám, tiếng phố dần nhường chỗ cho những khoảng sân, mái ngói và bóng cây. Trên trục tham quan, Khuê Văn Các mở ra một góc nhìn thanh nhã về kiến trúc truyền thống; những tấm bia tiến sĩ gợi câu chuyện học hành và khát vọng lập thân của người xưa. Hãy đi chậm, đọc phần giới thiệu và dành một lúc quan sát những chi tiết trên đá thay vì chỉ tìm một khung ảnh. Không gian gắn với truyền thống tôn sư trọng đạo này cũng là dịp để trò chuyện cùng người đồng hành về giá trị của việc học. Trải nghiệm ban ngày và chương trình đêm có cách tổ chức, vé vào cửa riêng.',
    address: 'Cổng vào: 58 Quốc Tử Giám, Hà Nội',
    practical: [
      { label: 'Vé tiêu chuẩn ban ngày', value: '70.000 VNĐ/người lớn', sourceUrl: vanMieuVisitorUrl },
      { label: 'Vé ưu tiên ban ngày', value: '35.000 VNĐ; học sinh, sinh viên tại Việt Nam cần mang thẻ. Các diện ưu tiên khác theo quy định.', wide: true, sourceUrl: vanMieuVisitorUrl },
      { label: 'Giờ tham quan ban ngày', value: '08:00–17:00, tất cả các ngày trong tuần', wide: true, sourceUrl: vanMieuVisitorUrl },
      { label: 'Trải nghiệm đêm — vé riêng', value: 'Người lớn: 299.000 VNĐ (gói 1 show) hoặc 399.000 VNĐ (gói 2 show); không dùng giá vé ban ngày.', wide: true, sourceUrl: vanMieuNightUrl },
      { label: 'Lịch trải nghiệm đêm', value: '18:30–22:00, Thứ Tư, Thứ Bảy và Chủ Nhật; xác nhận lại lịch trước khi đến.', wide: true, sourceUrl: vanMieuVisitorUrl },
    ],
    practicalNote: 'Đối chiếu website đơn vị quản lý ngày 21/10/2026; giá và lịch có thể thay đổi. Vé ban ngày không thay thế vé chương trình đêm. Trang phục lịch sự, không chạm vào bia đá.',
    referenceLinks: [{ label: 'Thông tin du khách · Văn Miếu – Quốc Tử Giám', url: vanMieuVisitorUrl }],
  },
  'ho-tay': {
    youtubeUrl: 'https://www.youtube.com/watch?v=KPwNA0PidEY',
    description: 'Hồ Tây đem đến một nhịp Hà Nội thoáng rộng hơn, nơi mặt nước và đường chân trời trở thành phần chính của chuyến đi. Dọc những đoạn ven hồ, quán nhỏ, vườn cây và các công trình tín ngưỡng tạo nên nhiều lớp cảnh quan khác nhau. Bạn không cần đi hết một vòng để cảm nhận nơi này: hãy chọn một đoạn đường công cộng phù hợp, dừng ở vị trí an toàn và để ánh sáng trên mặt hồ dẫn nhịp quan sát. Một buổi dạo có thể kết hợp nghỉ chân ở quán quen hoặc tìm hiểu một điểm văn hóa gần đó. Mỗi cơ sở có quy định riêng; không gian ven hồ không đồng nghĩa với việc mọi dịch vụ đều mở cửa.',
    address: 'Khu vực ven Hồ Tây, Hà Nội; ghim tham khảo gần đường Thanh Niên',
    practical: [
      { label: 'Không gian tham quan', value: 'Khu vực hồ và các đoạn ven hồ công cộng; từng điểm tham quan, nhà hàng và hoạt động có quy định riêng.', wide: true },
      { label: 'Phí / dịch vụ — tạm thời', value: 'Chưa xác minh biểu phí chung; kiểm tra giá của từng dịch vụ hoặc điểm tham quan riêng.', wide: true },
      { label: 'Giờ tiếp cận — tạm thời', value: 'Chưa xác minh khung giờ chung cho toàn bộ ven hồ; tuân thủ thông báo tại từng khu vực. Không bảo đảm tiếp cận 24/7.', wide: true },
    ],
    practicalNote: 'Nguồn du lịch quốc gia được đọc ngày 21/10/2026 không công bố biểu phí hay lịch tiếp cận chung cho toàn bộ ven hồ. Các trường thông tin này còn tạm thời; không áp dụng giờ của một cơ sở cho cả Hồ Tây.',
    referenceLinks: [{ label: 'Bối cảnh điểm đến · Du lịch Việt Nam (không phải bảng giá/lịch chung)', url: 'https://vietnam.travel/node/193' }],
  },
  'cau-long-bien': {
    youtubeUrl: 'https://www.youtube.com/watch?v=ewsKEvRHtvs',
    description: 'Những nhịp thép của cầu Long Biên nối hai bờ sông Hồng, đồng thời gợi một lớp ký ức về giao thông và đời sống Hà Nội. Dáng cầu hiện lên khác nhau theo khoảng cách: từ bờ sông là một đường nét dài giữa trời nước, đến gần mới thấy sự đan cài của các thanh thép và nhịp chuyển động qua cầu. Đây vẫn là công trình giao thông đang hoạt động, không phải một sân khấu chụp ảnh tách khỏi đời sống thường ngày. Hãy chọn điểm quan sát công cộng an toàn, tôn trọng người qua lại và biển báo. Tuyệt đối không bước vào đường ray, trèo lên kết cấu hoặc dừng ở khu vực cấm để đổi lấy một bức hình.',
    address: 'Cầu Long Biên bắc qua sông Hồng, Hà Nội; ghim gần đầu cầu phía trung tâm',
    practical: [
      { label: 'Tính chất điểm đến', value: 'Cầu giao thông đang hoạt động; chỉ sử dụng phần đường được phép và tuân thủ hướng dẫn tại chỗ.', wide: true, sourceUrl: 'https://vietnam.travel/node/914' },
      { label: 'Phí tham quan — tạm thời', value: 'Chưa xác minh một khoản phí tham quan riêng; không áp dụng mô hình vé bảo tàng cho cây cầu.', wide: true },
      { label: 'Giờ tiếp cận — tạm thời', value: 'Chưa xác minh lịch dành cho khách đi bộ; không bảo đảm tiếp cận 24/7. Hạn chế tại chỗ có thể thay đổi.', wide: true },
    ],
    practicalNote: 'Nguồn du lịch quốc gia được đọc ngày 21/10/2026 xác nhận đây là cầu giao thông, không xác nhận giờ đi bộ hay phí tham quan riêng. Không vào đường ray hoặc khu vực hạn chế; ảnh minh họa không phải hướng dẫn vị trí chụp an toàn.',
    referenceLinks: [{ label: 'Bối cảnh cầu Long Biên · Du lịch Việt Nam (không xác nhận giờ/phí)', url: 'https://vietnam.travel/things-to-do/vietnams-amazing-architecture' }],
  },
  'hoang-thanh-thang-long': {
    youtubeUrl: 'https://www.youtube.com/watch?v=ABbiKgWuhrA',
    description: 'Hoàng thành Thăng Long mở ra một cách đọc Hà Nội qua những lớp dấu tích, thay vì chỉ qua một công trình còn nguyên vẹn. Từ Đoan Môn hướng về khu vực điện Kính Thiên, trục không gian gợi lại nghi lễ và tổ chức của kinh thành xưa. Những nền móng, vật liệu và phần giới thiệu khảo cổ giúp người xem hình dung các giai đoạn nối tiếp trên cùng một vùng đất. Hãy dành thời gian đọc bảng thuyết minh, quan sát tương quan giữa cổng thành, sân và dấu tích kiến trúc. Một chuyến thăm chậm rãi sẽ thú vị hơn việc vội tìm một cung điện hoàn chỉnh; giá trị của nơi này nằm cả trong những gì còn lại và những câu hỏi lịch sử mở ra.',
    address: '19C Hoàng Diệu, Hà Nội',
    practical: [
      { label: 'Vé tham quan tiêu chuẩn', value: '100.000 VNĐ/lượt/khách; thông báo đơn vị quản lý áp dụng từ 01/01/2025.', wide: true, sourceUrl: citadelAdmissionUrl },
      { label: 'Giờ mở cửa', value: '08:00–17:00, tất cả các ngày trong tuần', wide: true, sourceUrl: citadelVisitorUrl },
    ],
    practicalNote: 'Đối chiếu website đơn vị quản lý ngày 21/10/2026. Mức 70.000 VNĐ trên phần đầu thông báo là giá năm 2024, không phải mức áp dụng từ 2025. Kiểm tra lại trước khi đến; tour đêm và chương trình riêng không được mặc định bao gồm trong vé này.',
    referenceLinks: [{ label: 'Đoan Môn và trục di sản · Đơn vị quản lý', url: 'https://hoangthanhthanglong.vn/doan-mon/' }],
  },
  'ho-hoan-kiem': {
    youtubeUrl: 'https://www.youtube.com/watch?v=xI_NOm3MYJI',
    description: 'Hồ Gươm là biểu tượng văn hóa lâu đời ngay giữa lòng thủ đô Hà Nội. Nơi đây mang nét đẹp thơ mộng với làn nước xanh ngọc phẳng lặng, rủ bóng hàng liễu bên quần thể kiến trúc cổ kính gồm Tháp Rùa, cầu Thê Húc và đền Ngọc Sơn trầm mặc.',
    practical: [
      { label: 'Giá tham khảo', value: 'Miễn phí tham quan' },
      { label: 'Giờ tham quan', value: '24/7' },
    ],
    address: 'Khu vực Hồ Hoàn Kiếm, Hà Nội',
    practicalNote: 'Thông tin do khách hàng cung cấp, có thể thay đổi. 24/7 chỉ áp dụng cho không gian công cộng quanh hồ; các điểm tham quan có giờ mở cửa và quy định riêng.',
  },
  'nha-tho-lon-ha-noi': {
    youtubeUrl: 'https://www.youtube.com/watch?v=4i9crZgDwSE',
    description: 'Nhà thờ Lớn Hà Nội là công trình kiến trúc Gothic cổ kính mang đậm dấu ấn phong cách châu Âu giữa lòng thủ đô. Nơi đây thu hút du khách bởi vẻ đẹp uy nghiêm của những bức tường rêu phong, mái vòm nhọn cao vút và ô cửa kính màu lộng lẫy. Đây là điểm check-in và biểu tượng văn hóa không thể bỏ qua.',
    practical: [
      { label: 'Giá tham khảo', value: 'Miễn phí' },
      { label: 'Giờ tham quan tham khảo', value: 'Thứ Hai – Thứ Bảy: 08:00–11:00 và 14:00–17:00. Chủ Nhật: 07:00–11:30 và 15:00–21:00.', wide: true },
    ],
    address: '40 Nhà Chung, Hà Nội',
    practicalNote: 'Giờ tham quan do khách hàng cung cấp, chỉ mang tính tham khảo; thánh lễ và sự kiện đặc biệt có thể ảnh hưởng việc đón khách. Thông tin có thể thay đổi, không bảo đảm vào tham quan không hạn chế.',
  },
  'pho-co': {
    // Deliberately shared with Đinh Lễ; player/template identity remains the destination slug.
    youtubeUrl: 'https://www.youtube.com/watch?v=lfqbodYX8ow',
    description: 'Phố cổ Hà Nội là không gian văn hóa đặc sắc lưu giữ hồn cốt nghìn năm văn hiến của thủ đô. Nơi đây nổi tiếng với 36 phố phường xưa cũ, những ngôi nhà mái ngói rêu phong cổ kính cùng lối sống thanh lịch của người Tràng An. Đây là điểm hẹn lý tưởng để khám phá ẩm thực và nhịp sống di sản tinh tế.',
    practical: [
      { label: 'Giá tham khảo', value: 'Miễn phí tham quan khu phố' },
      { label: 'Giờ tham quan', value: '24/7' },
    ],
    address: 'Khu vực Phố cổ, quận Hoàn Kiếm, Hà Nội',
    practicalNote: 'Thông tin do khách hàng cung cấp, có thể thay đổi. 24/7 áp dụng cho khu phố công cộng; cửa hàng, bảo tàng và điểm tham quan có giờ mở cửa, giá vé và quy định riêng.',
  },
  'den-ngoc-son': {
    youtubeUrl: 'https://www.youtube.com/watch?v=GyC4fn_7T0o',
    description: 'Đền Ngọc Sơn là di tích quốc gia đặc biệt, biểu tượng tâm linh và văn hóa linh thiêng của thủ đô Hà Nội. Tọa lạc trên đảo Ngọc giữa Hồ Gươm, đền mang nét kiến trúc cổ kính hòa quyện cùng thiên nhiên thơ mộng. Nơi đây tôn vinh tinh thần hiếu học và lòng yêu nước sâu sắc của dân tộc.',
    practical: [
      { label: 'Giá vé tham khảo', value: '50.000 VNĐ/lượt' },
      { label: 'Học sinh, sinh viên', value: '25.000 VNĐ/lượt, yêu cầu xuất trình thẻ hợp lệ', wide: true },
      { label: 'Thứ Hai – Thứ Năm', value: '07:00–19:00', wide: true },
      { label: 'Thứ Sáu – Chủ Nhật, ngày Lễ/Tết', value: '07:00–22:00', wide: true },
    ],
    address: 'Đền Ngọc Sơn, Hồ Hoàn Kiếm, Hà Nội',
    practicalNote: 'Giá vé và lịch do khách hàng cung cấp, chưa xác minh độc lập; thông tin có thể thay đổi. Kiểm tra lại trước khi đến.',
    referenceLinks: [
      { label: 'Tham khảo do khách hàng cung cấp · Ban quản lý', url: 'https://banqldtdthanoi.vn/lien-he/lien-he-danh-thang/' },
      { label: 'Tham khảo do khách hàng cung cấp · Tgroup', url: 'https://tgroup.vn/service/den-ngoc-son-ha-noi' },
    ],
  },
  'sofitel-legend-metropole-hanoi': {
    youtubeUrl: 'https://www.youtube.com/watch?v=LpleBDMdAMc',
    description: 'Sofitel Legend Metropole Hà Nội mang vẻ đẹp hoài cổ, kết hợp hoàn hảo giữa kiến trúc Pháp thuộc địa trang nhã và nét duyên dáng Hà thành. Không gian chia làm hai khu độc đáo: khu Heritage cổ kính với nội thất gỗ quý, quạt trần cổ và khu Opera tân cổ điển sang trọng, ngập tràn ánh sáng hướng ra Nhà hát Lớn.',
    practical: [
      { label: 'Lễ tân', value: '24/7' },
      { label: 'Giá tham khảo', value: 'Từ 6.000.000 VNĐ/đêm' },
    ],
    practicalNote: 'Giá khởi điểm do khách hàng cung cấp, không phải giá trực tiếp; tùy ngày và loại phòng. 24/7 chỉ áp dụng cho lễ tân.',
    affiliateUrl: null,
    affiliateEnabled: false,
    affiliateLabel: 'Đặt phòng',
  },
  'pho-sach-dinh-le': {
    // 07D: original portrait plus five additional client-supplied gallery photos.
    // Preserve the legacy URL below, but do not play the shared video.
    media: {
      type: 'gallery',
      images: [{
        src: '/images/pho%20sach%20Dinh%20Le.jpg',
        alt: 'Những kệ sách cao và tranh hoa bên cầu thang trong hiệu sách ở phố Đinh Lễ',
        width: 655, height: 874,
      }, {
        src: '/images/pho%20sach%20dinh%20le%201.jpg',
        alt: 'Góc phố rợp bóng cây với nắng chiếu trên đường và các cửa hàng bên vỉa hè',
        width: 1080, height: 809,
      }, {
        src: '/images/pho%20sach%20dinh%20le%202.jpg',
        alt: 'Khách ngồi tô tượng trên vỉa hè trước cửa tiệm nghệ thuật',
        width: 841, height: 630,
      }, {
        src: '/images/pho-sach-dinh-le%203.jpg',
        alt: 'Lối vào nhà sách với tường xanh, cửa chớp và những kệ sách ngoài cửa',
        width: 1000, height: 1000,
      }, {
        src: '/images/pho%20sach%20Dinh%20le%204.jpg',
        alt: 'Góc quán ngoài trời dưới tán cây, có người ngồi bên bàn cà phê',
        width: 447, height: 447,
      }, {
        src: '/images/pho%20sach%20dinh%20le%205.jpg',
        alt: 'Mặt tiền quán Vintage 1976 Cafe với bàn ghế và khách ngồi bên trong',
        width: 409, height: 488,
      }],
    },
    youtubeUrl: 'https://www.youtube.com/watch?v=lfqbodYX8ow',
    description: "Phố sách Đinh Lễ – 'kho báu' chữ yên bình giữa lòng Hà Nội, nơi mỗi trang sách mở ra một hành trình khám phá.",
    practical: [
      { label: 'Giờ mở cửa (tham khảo)', value: '08:00–21:00' },
      { label: 'Tham quan', value: 'Miễn phí tham quan' },
    ],
    practicalNote: 'Giờ tham khảo do khách hàng cung cấp; giờ từng hiệu sách có thể khác nhau. Phố Đinh Lễ gần Hồ Hoàn Kiếm, không phải Phố sách Hà Nội ở đường 19/12.',
  },
  'nha-hat-mua-roi-thang-long-hoan-kiem': {
    youtubeUrl: 'https://www.youtube.com/watch?v=-bezb1tRCZM',
    description: 'Giữa lòng phố cổ, Nhà hát Múa rối Thăng Long là một khoảng trời di sản kỳ diệu, nơi những chú rối gỗ nhảy múa trên làn nước lung linh, đánh thức cái hồn của làng quê Việt và dệt nên những giấc mơ dân gian đầy sắc màu đầy cảm hứng.',
    practical: [
      { label: 'Khung giờ có suất diễn (tham khảo)', value: 'Thứ Hai–Thứ Bảy: các suất được xếp trong khung 13:45–22:00. Chủ nhật: có suất từ 09:30 và tiếp tục vào buổi tối.', wide: true },
      { label: 'Giá vé tham khảo', value: 'Từ 100.000 VNĐ/người' },
    ],
    practicalNote: 'Giá và lịch do khách hàng cung cấp, chưa xác minh độc lập; không phải thời lượng biểu diễn liên tục hay giờ đặt vé cụ thể. Kiểm tra lịch mới nhất với nhà hát trước khi đến.',
  },
};

// Preserve the legacy import API without shipping story records to the gallery controller.
export { featuredYouTubeEmbedUrl } from '../lib/destination-media.ts';

/** No anchor at all unless explicitly enabled AND a valid absolute HTTPS URL exists. */
export function featuredAffiliateUrl(story: FeaturedStory): string | undefined {
  if (story.affiliateEnabled !== true || !story.affiliateUrl) return;
  try {
    const url = new URL(story.affiliateUrl);
    if (url.protocol !== 'https:' || url.username || url.password || !url.hostname.includes('.')) return;
    return url.href;
  } catch { return; }
}
