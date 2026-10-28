export type Category = 'Hồ & cảnh quan' | 'Phố & cầu' | 'Di sản';
export type Coordinates = { lat: number; lng: number };
export type Place = {
  slug: string; name: string; vietnamese: string; category: Category;
  coordinates: Coordinates; area: string; description: string; story: string;
  tip: string; visit: string; access: string; art: 'lake' | 'town' | 'temple' | 'citadel' | 'bridge';
};
export const demoLocation: Coordinates = { lat: 21.0286, lng: 105.8525 };
// Nội dung tuyển chọn cho bản mẫu. Tọa độ gần đúng, không phải cổng vào đã xác minh.
export const places: Place[] = [
  {
    slug: 'ho-hoan-kiem', name: 'Hồ Hoàn Kiếm', vietnamese: 'Hồ Gươm', category: 'Hồ & cảnh quan',
    coordinates: { lat: 21.0286, lng: 105.8525 }, area: 'Khu vực Hoàn Kiếm', art: 'lake',
    description: 'Một vòng hồ xanh mát, ngắm Tháp Rùa và cảm nhận nhịp sống giữa lòng Hà Nội.',
    story: 'Hồ Hoàn Kiếm, còn gọi là Hồ Gươm, là điểm bắt đầu nhẹ nhàng để khám phá Hà Nội. Dạo quanh bờ hồ, nghỉ dưới những hàng cây và ngắm Tháp Rùa từ xa. Từ đây, bạn có thể tiếp tục khám phá Phố Cổ ở phía bắc hồ.',
    tip: 'Buổi sáng sớm hoặc chiều muộn thường dễ chịu hơn để đi bộ. Nếu muốn ghé đền Ngọc Sơn, hãy kiểm tra giờ mở cửa và thông tin vé riêng.',
    visit: 'Dạo bộ thong thả', access: 'Lối đi ven hồ',
  },
  {
    slug: 'pho-co', name: 'Phố Cổ', vietnamese: 'Khu phố cổ Hà Nội', category: 'Phố & cầu',
    coordinates: { lat: 21.0358, lng: 105.8504 }, area: 'Khu vực Hoàn Kiếm', art: 'town',
    description: 'Những con phố nhỏ, nếp nhà cũ và bao điều thú vị trong từng góc phố.',
    story: 'Phố Cổ là nơi bạn có thể khám phá Hà Nội qua những con phố mang tên các nghề buôn bán xưa. Đi chậm qua khu vực Hàng Bạc, Mã Mây và những phố lân cận để quan sát kiến trúc, cửa hàng và đời sống thường ngày. Ghim trên bản đồ chỉ là một điểm đại diện cho cả khu phố.',
    tip: 'Chú ý xe cộ khi đi bộ, hỏi giá trước khi mua hàng hoặc gọi món và giữ gìn đồ cá nhân.',
    visit: 'Khám phá theo nhịp riêng', access: 'Khu phố có xe cộ qua lại',
  },
  {
    slug: 'van-mieu', name: 'Văn Miếu', vietnamese: 'Văn Miếu – Quốc Tử Giám', category: 'Di sản',
    coordinates: { lat: 21.0273, lng: 105.8355 }, area: 'Khu vực Đống Đa', art: 'temple',
    description: 'Khoảng sân yên tĩnh và dấu ấn truyền thống hiếu học của kinh thành xưa.',
    story: 'Văn Miếu – Quốc Tử Giám là một điểm đến tiêu biểu để tìm hiểu truyền thống giáo dục và khoa bảng Việt Nam. Những lớp sân, kiến trúc cổ và khu bia tiến sĩ gợi mở câu chuyện về việc học qua nhiều thế kỷ. Hãy dành thời gian đọc thông tin tại di tích thay vì chỉ dừng lại chụp ảnh.',
    tip: 'Kiểm tra giờ mở cửa, giá vé và quy định tham quan trước khi đến. Ăn mặc lịch sự và giữ yên tĩnh trong khu di tích.',
    visit: 'Dành thời gian tìm hiểu', access: 'Di tích có bán vé',
  },
  {
    slug: 'hoang-thanh-thang-long', name: 'Hoàng thành Thăng Long', vietnamese: 'Khu di sản Hoàng thành Thăng Long', category: 'Di sản',
    coordinates: { lat: 21.0352, lng: 105.8403 }, area: 'Khu vực Ba Đình', art: 'citadel',
    description: 'Tìm lại dấu tích kinh đô và những lớp lịch sử giữa trung tâm thành phố.',
    story: 'Hoàng thành Thăng Long lưu giữ những dấu tích của trung tâm quyền lực qua nhiều thời kỳ lịch sử. Khám phá các không gian di tích và trưng bày để hình dung thêm về kinh thành xưa. Các khu vực được tiếp cận có thể thay đổi theo hoạt động bảo tồn và chương trình tham quan.',
    tip: 'Xem thông tin chính thức về lối vào, giờ mở cửa, vé và các khu vực đang đón khách. Mang theo nước nếu tham quan ngoài trời.',
    visit: 'Một hành trình qua lịch sử', access: 'Di sản có bán vé',
  },
  {
    slug: 'ho-tay', name: 'Hồ Tây', vietnamese: 'Không gian ven Hồ Tây', category: 'Hồ & cảnh quan',
    coordinates: { lat: 21.0479, lng: 105.8369 }, area: 'Khu vực Tây Hồ', art: 'lake',
    description: 'Đón gió bên mặt hồ rộng, ngắm trời chiều và tìm một góc nghỉ chân.',
    story: 'Hồ Tây mang đến một khoảng không gian thoáng đãng giữa thành phố. Bạn có thể chọn một đoạn đường ven hồ để dạo chơi, quan sát nhịp sống xung quanh hoặc nghỉ ở một quán gần đó. Ghim minh họa nằm ở phía đông nam hồ, gần đường Thanh Niên, không phải tâm hồ hay một cổng vào duy nhất.',
    tip: 'Chọn đoạn ven hồ có lối đi phù hợp, chú ý giao thông và thời tiết. Hỏi giá trước khi sử dụng dịch vụ quanh hồ.',
    visit: 'Hợp cho buổi chiều thư thả', access: 'Điểm đại diện ven hồ',
  },
  {
    slug: 'cau-long-bien', name: 'Cầu Long Biên', vietnamese: 'Cầu Long Biên bắc qua sông Hồng', category: 'Phố & cầu',
    coordinates: { lat: 21.0436, lng: 105.8587 }, area: 'Khu vực sông Hồng', art: 'bridge',
    description: 'Dáng cầu thép quen thuộc, dòng sông Hồng và một góc nhìn khác về Hà Nội.',
    story: 'Cầu Long Biên là một dấu ấn kiến trúc và lịch sử nổi bật của Hà Nội, nối hai bờ sông Hồng. Ghim chỉ vị trí gần đầu cầu phía trung tâm thành phố. Đây vẫn là công trình giao thông đang hoạt động, không phải một điểm ngắm cảnh tách biệt với xe cộ và đường sắt.',
    tip: 'Tuân thủ biển báo và hướng dẫn tại chỗ. Chỉ đi ở phần đường được phép; không vào đường ray, dừng chụp ảnh gây cản trở hoặc đi vào khu vực bị hạn chế.',
    visit: 'Ngắm cầu, ưu tiên an toàn', access: 'Cầu đang khai thác giao thông',
  },
];
