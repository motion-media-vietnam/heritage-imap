# Explore Vietnam: hai lớp khám phá - 06/11/2026

Bản nháp chỉ tại `/national-preview/#explore-vietnam`, chưa xuất bản. Thay thế cách hiển thị mặc định trong báo cáo [vòng trước](NATIONAL-EXPLORE-REFINEMENT.md). Không thay Header, Hero, Featured, các section dưới, Hỏi Heritage, route `/` hoặc `/hanoi/`.

## Đồ họa mặc định

`VietnamDiscoveryMap.astro` dùng SVG riêng `src/assets/national/map/vietnam-discovery.svg` (12.055 byte), nền giấy ấm, đất liền sage/champagne, contour nhẹ, biển sáng và dấu núi. Đây là vector trong mã nguồn, không phải screenshot ô bản đồ hoặc ảnh AI. Đường nét đất liền/ven bờ từ [Natural Earth 1:50m](https://github.com/nvkelso/natural-earth-vector/blob/master/geojson/ne_50m_admin_0_countries.geojson), tải 06/11/2026; [public domain](https://www.naturalearthdata.com/about/terms-of-use/). Sơ đồ Hoàng Sa/Trường Sa là inset không theo tỷ lệ; hình chỉ để khám phá du lịch, không dùng dẫn đường hay thể hiện địa giới hành chính.

Năm pin Hà Nội, TP.HCM, Ninh Bình, Quảng Ninh, Điện Biên dùng lại thumbnail đã duyệt ở vòng trước; tên/ảnh đọc từ dữ liệu shared. `map-graphic.ts` chỉ chứa tọa độ poster và phép chiếu cho đường nối tới vị trí thật. Pin được giãn để không đè nhau. Leaflet vẫn dùng tọa độ du lịch thực từ directory, không dùng vị trí poster.

## Chuyển trạng thái

- `defaultGraphicMap`: hiện đồ họa và năm pin, canvas tương tác ẩn khỏi cây truy cập và inert. Bỏ IntersectionObserver tải map; không khởi tạo Leaflet khi cuộn tới section.
- Chọn pin ảnh, chọn mục danh sách hoặc bấm **Khám phá trên bản đồ** mới import Leaflet/CSS và ô ảnh. Hash `#destination-*` trực tiếp cũng mở điểm được yêu cầu.
- `interactiveMap`: fade sang bản đồ, căn camera và đồng bộ marker/preview. CTA mở map không kèm điểm đến bắt đầu bằng toàn cảnh. **Xem dạng tổng quan** đưa về đồ họa, giữ lựa chọn trong panel; map đã khởi tạo được tái sử dụng lần sau.
- Chọn địa phương chỉ đổi preview. CTA thật mới dẫn vào Hub; Hà Nội đang hoạt động, các địa phương chưa có Hub giữ nhãn sắp ra mắt, không tạo route giả.
- Import lỗi giữ lớp đồ họa/danh mục và cho thử lại. Nền tile lỗi có thông báo; có thể trở về đồ họa. Chưa giả lập mất mạng trong browser QA.
- Hai lớp thay nhau inert/aria-hidden. Pin hỗ trợ Enter/Space và focus vào map khi mở bằng bàn phím; trở về đưa focus tới nút mở. Hỗ trợ giảm chuyển động và giữ touch control, không đổi widget.

Giữ 34 marker cấp tỉnh tại overview (5 pin ảnh, 29 chấm); tám vùng du lịch cũ xuất hiện khi zoom gần, tổng 42. Giữ chọn ghim, pan/zoom, đường nối và danh mục theo tỉnh.

## Spotlight và danh mục

Ảnh desktop tăng từ 172 lên 246px, mobile từ 176 lên 228px, tablet 290px. Bỏ min-height copy 214px, rút teaser và khoảng cách, title/region/CTA gọn hơn. Chỉ sửa teaser của map National, không sửa nội dung Hà Nội.

Desktop cao 800px, tỷ lệ map:panel khoảng 1,95:1; tablet/mobile xếp dọc, map 650/560px. Danh mục dùng serif, số nhỏ, divider mảnh, hover dịch nhẹ và nền ấm. Số 33 dùng serif italic; summary “Xem thêm điểm đến +28” nhấn chữ và mũi tên. Giữ năm mục đầu TP.HCM, Huế, Đà Nẵng, Khánh Hòa, An Giang; phần còn lại mở rộng trong vùng cuộn. Khi tỉnh ưu tiên là spotlight, loại tỉnh ấy khỏi 33 theo logic hiện hữu.

Lịch tài trợ/phê duyệt/hết hạn/chuyển lượt giữ nguyên `map-spotlight.ts` và `national-map-selection.ts`. Chưa có hợp đồng thật/CMS. Ngày hiệu lực đánh giá theo ngày Việt Nam khi tải trang; tab mở xuyên ngày cần reload. Cần xử lý giới hạn này trước bản National phát hành tĩnh.

## Tệp thay đổi

- `src/components/national/NationalMap.astro`, `VietnamDiscoveryMap.astro` (mới).
- `src/assets/national/map/vietnam-discovery.svg` (mới).
- `src/data/national/map-graphic.ts` (mới), `map-locale.ts`, `map.ts`.
- `src/scripts/national-map.ts`, `src/styles/national-discovery-map.css`.
- `tests/national-map-graphic.test.ts` (mới).
- Báo cáo này, ghi chú ở báo cáo vòng trước, `docs/billing.md` và PDF chi phí.

## Kiểm tra

- Type check: 153 tệp, 0 lỗi/cảnh báo/gợi ý. Production build: 19 trang.
- Toàn bộ 91 tệp production giống byte với bản trước tinh chỉnh. Preview không nằm trong production; không thay route `/` hoặc Hà Nội.
- 211 ca hồi quy: 176 qua, 28 lỗi cũ, 7 bỏ qua. Tên 28 lỗi trùng vòng trước; không có lỗi mới. Bảy ca liên quan map đều qua (hai ca mới về poster/dữ liệu/asset; năm ca về lịch tài trợ, URL, directory và khoảng cách pin).
- Viewport đã kiểm tra: 1440×1100, 1280×1000, 768×1000, 390×844, 360×844. Không tràn ngang. Cold load ở section có 0 Leaflet container/tile, đủ năm pin đồ họa. Đã sửa giao thoa tiêu đề poster/ghim ở 360px.
- Đã thử click pin Ninh Bình, Enter pin Hà Nội (focus vào canvas), tap danh mục TP.HCM từ trạng thái mặc định, CTA mở map (34 marker overview), nút trở về đồ họa, khôi phục spotlight, mở danh mục và Enter chọn Cà Mau. Card, selected marker và camera đồng bộ; TP.HCM chưa có Hub nên không tạo link giả.
- Đã thử English và fixture tài trợ Quảng Ninh: 33 mục ngoài spotlight, đúng năm mục ưu tiên, mặc định vẫn là đồ họa. CTA Hà Nội dẫn thực tế sang `/hanoi/` đúng heading hiện có. Deep link Phú Quốc mở marker được chọn, card Phú Quốc, danh mục An Giang; 42 marker ở zoom gần và tâm marker lệch tâm map dưới 1px.
- Một widget global, thứ tự section giữ nguyên. Không ghi nhận console warning/error ở phiên QA xác nhận. Mobile được kiểm tra bằng viewport, chưa thử điện thoại vật lý, mạng mất kết nối hoặc thiết lập giảm chuyển động của hệ điều hành.
- Ảnh bàn giao ngoài repository: `national-preview-captures/explore-two-states/desktop-default.jpg`, `desktop-interactive.jpg`, `mobile390-default.jpg`, `mobile390-selected.jpg`, `mobile360-default.jpg`; kèm `qa-summary.json`. Hai ảnh desktop chụp riêng trọn section. Tab preview cũ giữ trang lỗi kết nối từ lần dừng server; đã mở tab preview mới và xác nhận hiển thị đúng, máy chủ cục bộ trả HTTP 200.
- PDF chi phí dựng lại, đã kiểm tra bố cục đủ 10 trang.

Chi phí: không thêm dịch vụ hay phí định kỳ ở bước duyệt cục bộ; xem [bản ghi kinh doanh](../billing.md). Không publish hoặc lưu phiên bản production.
