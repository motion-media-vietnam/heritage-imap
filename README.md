# Một chút Hà Nội

Bản mẫu hướng dẫn khám phá Hà Nội, xây dựng bằng Astro. Ứng dụng có bản đồ tương tác, tìm kiếm, bộ lọc và trang giới thiệu riêng cho sáu địa điểm: **Hồ Hoàn Kiếm, Phố Cổ, Văn Miếu, Hoàng thành Thăng Long, Hồ Tây, Cầu Long Biên**. Giao diện và nội dung bằng tiếng Việt.

Đây là website tĩnh với dữ liệu tuyển chọn, không có cơ sở dữ liệu, tài khoản, đặt vé hay thanh toán.

## Giao diện

Bố cục mới tham khảo [Visit Norway](https://www.visitnorway.com/en/): phần mở đầu tràn chiều ngang, tiêu đề lớn, thanh điều hướng trắng với dấu nhấn đỏ, lưới thẻ địa điểm và chân trang kiểu tạp chí du lịch. Giữ nguyên nội dung Hà Nội, sáu địa điểm, bộ lọc và các chức năng bản đồ. Các trang chi tiết dùng cùng hệ thống trình bày.

- Hình mở đầu ` mev9zaoqveug1.jpeg `.
- Không nhúng tài nguyên hay mã nguồn Visit Norway; không gọi dịch vụ ảnh, video hoặc phông chữ mới.
- Menu điện thoại dùng phần tử `details` có thể mở bằng bàn phím, đóng khi chọn liên kết, bấm bên ngoài hoặc nhấn Escape.
- Không chạy máy chủ hay đối chiếu ảnh trong trình duyệt; đây là bản dựng theo phong cách tham khảo, chưa xác nhận khớp từng pixel với trang gốc. Trang gốc có thể thay đổi, và truy cập HTML/CSS trực tiếp gặp màn hình bảo vệ tự động.
- PDF và kiểm thử được tạm hoãn theo yêu cầu của chủ dự án; các lệnh bên dưới dành cho một đợt kiểm tra sau trên máy phù hợp.

## Bản đồ và tìm kiếm

- Leaflet hiển thị bản đồ OpenStreetMap, không cần khóa API hay tài khoản thanh toán.
- Vị trí xuất phát mẫu ở Hồ Hoàn Kiếm. “Dùng vị trí của tôi” chỉ xin quyền khi được bấm; vị trí được giữ trong bộ nhớ cho lần truy cập, không được ứng dụng lưu lại.
- Định vị cần HTTPS hoặc localhost. Khi dùng vị trí thật, bản đồ và khoảng cách được cập nhật; có nút quay về vị trí mẫu ở Hồ Hoàn Kiếm.
- Tìm tên tiếng Việt có dấu hoặc không dấu, kết hợp với nhóm **Hồ & cảnh quan**, **Phố & cầu**, **Di sản** và giới hạn 10 km. Kết quả gần nhất xuất hiện trước.
- Ghim và thẻ dẫn đến cùng trang địa điểm. Các liên kết bản đồ trên trang chi tiết mở OpenStreetMap.
- Khi bản đồ không tải được, sơ đồ Hà Nội minh họa vẫn cho phép chọn địa điểm. Có nút thử tải lại.
- Hình địa điểm là SVG minh họa đi kèm ứng dụng, không phải ảnh chụp thực tế. Ảnh vịnh cũ không còn được sử dụng trong giao diện.

Tọa độ gần đúng, không phải cổng vào đã xác minh. Ghim Phố Cổ đại diện cho một khu vực; ghim Hồ Tây ở ven hồ phía đông nam. Khoảng cách là đường chim bay, không phải quãng đường hay thời gian di chuyển. Cần kiểm tra vé, giờ mở cửa, lối vào và quy định an toàn thực tế, đặc biệt tại Cầu Long Biên.

Bản đồ chỉ tải các ô ảnh cần cho vùng đang xem từ `tile.openstreetmap.org`, giữ bộ nhớ đệm, thông tin nguồn và ghi công OpenStreetMap. Dịch vụ công cộng không có cam kết thời gian hoạt động; xem [chính sách sử dụng](https://operations.osmfoundation.org/policies/tiles/) trước khi triển khai rộng rãi.

## Chi phí

Xem nguồn chuẩn tại [`docs/billing.md`](docs/billing.md). Việc đổi thành phố, Việt hóa và dùng hình SVG không thêm dịch vụ trả phí; chi phí nhà cung cấp định kỳ tăng thêm dự kiến **0 USD/tháng** nếu giữ nguyên lưu lượng và mô hình website tĩnh. Công sức nội dung, phát triển, tên miền và triển khai chưa được báo giá.

**PDF `output/pdf/ha-long-billing-brief.pdf` hiện là phiên bản Hạ Long cũ, chưa đồng bộ với Markdown mới.** Chưa tạo lại hoặc kiểm tra bố cục PDF do chính sách tài nguyên của môi trường này. Công cụ tạo PDF đã được đổi tiêu đề sang Hà Nội; giữ đường dẫn đầu ra cũ để tương thích.

## Chạy trên máy phát triển

Cần Node 22.12+ và các thư viện đã cài theo `package-lock.json`. Môi trường hiện tại không chạy máy chủ, kiểm thử hay build theo chính sách tài nguyên. Trên máy phù hợp:

```sh
npm run dev -- --background
```

Mở **http://localhost:4321**. Quản lý máy chủ bằng:

```sh
npm run astro -- dev status
npm run astro -- dev logs
npm run astro -- dev stop
```

## Chỉnh sửa nội dung

- `src/data/places.ts`: tên, nội dung, nhóm và tọa độ; các trang chi tiết sinh từ cùng danh sách.
- `src/components/DemoMap.astro`: sơ đồ dự phòng và vị trí ghim minh họa. Ghim trên bản đồ thật lấy tọa độ từ dữ liệu.
- `src/components/PlaceArt.astro`: hình SVG minh họa.
- `src/styles/global.css`: kiểu hiển thị và bố cục màn hình nhỏ.
- `src/layouts/Layout.astro`: thanh điều hướng, menu điện thoại và chân trang chung.
- `public/images/ha-noi-hero.svg`: hình minh họa lớn ở đầu trang chủ.
- `src/scripts/explore.ts`: bản đồ, định vị và cập nhật bộ lọc.

## Kiểm tra trên máy phù hợp

```sh
npm run check
npm test
npm run build
```

Bộ kiểm thử đã được cập nhật cho sáu địa điểm Hà Nội, tìm kiếm tiếng Việt, nhóm mới, sắp xếp khoảng cách, lọc theo vị trí và định dạng số Việt Nam, nhưng chưa chạy trong môi trường này. Kiểm tra trực quan thêm trên điện thoại và máy tính: trang chủ, sáu trang chi tiết, bản đồ tương tác, từ chối quyền định vị, vị trí ngoài Hà Nội, sơ đồ dự phòng và nút thử lại.

Tạo lại tài liệu chi phí trên máy có Python/uv và ReportLab, rồi xuất từng trang thành ảnh để kiểm tra trực quan (không chạy các bước này trên VPS hiện tại):

```sh
uv run --with reportlab python scripts/build-billing-brief.py
pdftoppm -scale-to 1400 -png output/pdf/ha-long-billing-brief.pdf /tmp/ha-noi-billing
```

Sau khi kiểm tra PDF, cập nhật trạng thái tài liệu trong Markdown và README để xác nhận đồng bộ.

## Nguồn và ghi công

Nội dung tham khảo: [Vietnam Tourism — Hà Nội](https://vietnam.travel/places-to-go/northern-vietnam/ha-noi). Nội dung chỉ mang tính giới thiệu, không cung cấp giờ mở cửa hay giá vé hiện hành.

Dữ liệu và ô ảnh bản đồ: © [Những người đóng góp cho OpenStreetMap](https://www.openstreetmap.org/copyright). Thư viện bản đồ: [Leaflet](https://leafletjs.com/), giấy phép BSD-2-Clause. Hình SVG do dự án tạo. Giao diện dùng phông hệ thống Arial/Helvetica/sans-serif, không còn tải Google Fonts.

Ảnh Hạ Long cũ còn lưu trong `public/images/ha-long-bay.jpg` nhưng không được hiển thị: Rafa Prada, [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Ha_Long_Bay,_Vietnam_(Unsplash).jpg), CC0.
