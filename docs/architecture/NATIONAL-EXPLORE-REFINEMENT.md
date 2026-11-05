# Explore Vietnam: Discovery map refinement

Ngày 05/11/2026, trên `refactor/national-platform`, dựa trên `36f5481`. Chỉ section `/national-preview/#explore-vietnam`. Không xuất bản hoặc đổi Header, Hero, Featured, Seasonal, Wonders, Taste, Offers, Footer, Hỏi Heritage và website Hà Nội.

## Nội dung và thiết kế

Heading **Một Việt Nam, vạn hành trình.** Intro **Chọn 1 ghim hoặc điểm đến để khám phá điểm đến của bạn.** Giữ hai cột heading/intro ở desktop, xếp trái gọn trên mobile; hỗ trợ VI/EN. Tile OSM hiện có được giảm saturation/contrast, thêm tông ấm nhẹ; không đổi nhà cung cấp. Controls, viền, nền ngà, champagne và teal đồng bộ hệ thiết kế Heritage.

Map/panel desktop tỷ lệ 2,15:1, cao 760px; tablet map 540px; mobile 500px. Panel đưa ảnh spotlight lên trước danh mục, bố cục ảnh - vùng - tên - teaser - trạng thái/CTA. Các nơi chưa có ảnh hiện khung biên tập đang tuyển chọn, không dùng ảnh generic giả địa điểm.

## Marker

Năm `DivIcon` riêng chứa thumbnail 192 × 192, hiển thị đầu tròn 48px với stroke ngà, đuôi định vị và chiều sâu nhẹ; selected tăng khoảng 7%, viền champagne. Không dùng marker mặc định. Enter và Space kích hoạt tương đương click. Ảnh lỗi có chữ đầu tên làm fallback, giữ hình pin custom.

| Pin | Ảnh nguồn hiện có | Thumbnail / byte |
| --- | --- | --- |
| Hà Nội | `public/images/Ho Hoan kiem.jpg`, crop tập trung Tháp Rùa | `hanoi-pin.webp` / 9.620 |
| TP. Hồ Chí Minh | `src/assets/national/featured/ho-chi-minh-1536.webp`, crop tháp cao và sông | `ho-chi-minh-pin.webp` / 13.610 |
| Ninh Bình | `src/assets/national/river-1536.webp`, thuyền giữa núi đá, ảnh minh họa đã có | `ninh-binh-pin.webp` / 9.236 |
| Quảng Ninh | `src/assets/national/featured/quang-ninh-1536.webp`, ảnh văn hóa Bình Liêu chủ dự án cung cấp | `quang-ninh-pin.webp` / 11.488 |
| Điện Biên | `src/assets/national/featured/dien-bien-600.webp`, ảnh hoa/ruộng được cung cấp để minh họa Điện Biên | `dien-bien-pin.webp` / 15.628 |

Năm thumbnail ở `src/assets/national/map/`, tổng 59.582 byte. Không tạo ảnh AI mới hoặc sửa ảnh nguồn; chỉ crop/resize WebP bằng Sharp có sẵn. Không khẳng định tên hoa/danh thắng của ảnh Điện Biên. Ở overview, thuật toán tách các đầu pin gần nhau trong không gian màn hình; đường dẫn mảnh và chấm neo vẫn giữ tọa độ thực. Khi xem gần, offset về 0. Resize giữ đủ năm pin trong overview; khi đã chọn/xem gần, giữ vùng nhìn. Cập nhật đường dẫn theo chuyển động camera.

Các điểm cấp tỉnh còn lại là chấm ivory 7px, hoặc 8,5px nếu đã có ảnh/teaser biên tập. Đây là độ đầy đủ nội dung, không đồng nghĩa Hub đã phát hành. Selected có ring nhẹ; vùng nhận tương tác lớn hơn phần chấm. Không dùng chấm xám cũ.

## Danh mục 34/33

Theo xác nhận của chủ dự án: **34 địa phương toàn quốc, danh mục 33 ngoài spotlight khởi đầu**. Nguồn tên/mã [Quyết định 19/2025/QĐ-TTg qua Báo Chính phủ](https://baochinhphu.vn/bang-danh-muc-va-ma-so-cua-34-tinh-thanh-moi-3321-don-vi-hanh-chinh-cap-xa-moi-102250704153652947.htm), đối chiếu ngày 05/11/2026. Tọa độ điểm đại diện lấy từ GeoNames `VN.txt` tải cùng ngày; không khẳng định là tâm hành chính hoặc bản đồ ranh giới.

- `src/data/destinations/directory.ts`: 34 tên, ID, mã, tọa độ WGS84, GeoNames ID và vùng; các tên đã có Hub config tiếp tục lấy từ registry hiện hữu.
- `src/data/national/map.ts`: ảnh, teaser, năm pin chính và mức hoàn thiện biên tập. Ở overview có 5 pin ảnh + 29 chấm cấp tỉnh.
- Danh mục 33 giữ thứ tự đầu **TP. Hồ Chí Minh, Huế, Đà Nẵng, Khánh Hòa, An Giang** khi các nơi này không phải spotlight. Năm hàng 01-05 hiện trước, 28 hàng còn lại mở bằng “Xem thêm điểm đến”; vùng cuộn bên trong có giới hạn chiều cao. Không dồn cả 33 thành một cột dài ngoài trang.
- Tám điểm du lịch cũ Hà Giang, Sa Pa, Mù Cang Chải, Đồng Hới, Hội An, Nha Trang, Đà Lạt, Phú Quốc giữ anchor/card/pin riêng. Hiện khi zoom từ 7 hoặc được chọn trực tiếp, không tính thêm vào danh mục cấp tỉnh. Tổng tối đa 42 marker khi xem gần; các liên kết cũ vẫn có mục tiêu.
- Click danh mục hoặc pin cập nhật marker, preview và pan/zoom; tự chọn không dẫn sang Hub. Chỉ CTA có đích thực mới điều hướng. Hà Nội có `/hanoi/`; các Hub chưa phát hành giữ “Sắp ra mắt”.

## Sponsored Spotlight

`src/data/national/map-spotlight.ts` quản lý `mapSpotlightPlacements` (hiện rỗng), `editorialSpotlightOrder` và `mapDirectoryPriority`. Record hỗ trợ destination ID, trạng thái duyệt, ngày bắt đầu/kết thúc, priority, display/visual approval, ảnh, teaser, CTA và optional booking/destination URL. Tên lấy từ danh mục chung.

`chooseMapSpotlight` kiểm tra ngày lịch thực, khoảng ngày bao gồm cả hai đầu, trạng thái duyệt, ảnh/nội dung và độ ưu tiên. Hết hạn thì record hợp lệ kế tiếp được chọn; không còn tài trợ thì về thứ tự biên tập cấu hình. Hà Nội chỉ là mục đầu cấu hình fallback, không hardcode trong component/controller. URL ngoài phải HTTPS, không chứa thông tin đăng nhập; không tự suy ra route cho Hub nháp.

Bản duyệt on-demand đánh giá ngày theo `Asia/Ho_Chi_Minh` khi tải trang; tab mở xuyên ngày cần tải lại để nhận lựa chọn thời hạn mới. Chưa có CMS, scheduler hoặc hợp đồng thực. Trước khi phát hành National dạng tĩnh cần quyết định cơ chế cập nhật theo ngày; không coi một bản build tĩnh là lịch tự chạy.

`?spotlight=demo#explore-vietnam` là fixture chỉ trong phát triển: Quảng Ninh ưu tiên từ 01/11 đến 31/12/2026; TP.HCM từ 01/12/2026 đến 28/02/2027. Nhãn **Mẫu spotlight tài trợ**; không đại diện hợp đồng hoặc liên kết booking thật. Chọn nơi khác tạm chuyển card sang “Điểm đến bạn chọn”; nút “Về spotlight” khôi phục lựa chọn đầu, thu gọn danh mục và đưa camera tới spotlight. Không tự xoay slot khi người dùng đang đọc.

## Tệp thay đổi

- `src/components/national/NationalMap.astro`.
- `src/scripts/national-map.ts`.
- `src/styles/national-discovery-map.css` (mới).
- `src/data/destinations/directory.ts` (mới).
- `src/data/national/map.ts`, `src/data/national/locale.ts`.
- `src/data/national/map-spotlight.ts`, `src/data/national/map-locale.ts` (mới).
- `src/lib/national-map-selection.ts` và `tests/national-map-selection.test.ts` (mới).
- Năm ảnh trong bảng thumbnail.
- Tài liệu này, `NATIONAL-HOMEPAGE-PREVIEW.md`, `docs/billing.md`, PDF chi phí tương ứng.

## QA

- Type check: 150 tệp, 0 lỗi/cảnh báo/gợi ý. Production build tạo 19 trang. Preview không nằm trong bản phát hành.
- Hồi quy: 209 ca, 174 qua, 28 lỗi cũ, 7 bỏ qua. So tên lỗi với vòng Sponsored: cùng tập 28 lỗi, không có lỗi mới. Năm ca mới về lịch tài trợ, kiểm duyệt, URL, danh mục và khoảng cách pin đều qua. Chưa coi toàn bộ bộ hồi quy là xanh vì snapshot/harness cũ còn tồn tại.
- SHA-256 toàn bộ 91 tệp `dist/` giống hệt trước lần sửa. Không thay website Hà Nội hoặc route `/`. Header/Hero, Featured, các section dưới, widget và các stylesheet đã duyệt không có diff.
- Viewport thực đo: 1440 × 1360, 1280 × 1000, 768 × 1000, 390 × 844, 360 × 844. Không tràn ngang; đủ 5 pin ảnh và 29 chấm cấp tỉnh ở overview. Năm thumbnail tải đúng 192px, đầu pin không đè nhau và nằm trong khung. Map cao 760/760/540/500/500px tương ứng.
- Thử click thumbnail Ninh Bình, Enter trên pin TP.HCM, Space trên chấm Huế, click/tap danh mục TP.HCM, mở 28 mục bổ sung và Enter chọn Cà Mau. Selected marker, preview và camera cập nhật; Cà Mau không tạo CTA/route giả. Chọn trực tiếp Phú Quốc vẫn mở đúng card, neo cấp tỉnh An Giang, marker được chọn và zoom gần có 42 marker.
- Đã thử khôi phục spotlight sau khi chọn nơi khác, overview reset, fixture tài trợ Quảng Ninh và nội dung English. Danh mục đủ 33 và đúng năm mục ưu tiên. Hiệu lực/hết hạn/chuyển lượt/mặc định được kiểm tra bằng các ngày cụ thể trong unit tests; không chờ hai tháng theo thời gian thực.
- Mobile dùng spotlight trên danh mục, ảnh trên copy; summary mở/đóng bằng điều khiển gốc, danh sách có vùng cuộn riêng. CTA và nút trở về chừa cạnh phải cho tab Hỏi Heritage, không sửa widget. Chỉ một widget tồn tại trên trang.
- Ảnh bàn giao: `desktop-section.png` (riêng section đầy đủ), `desktop.png` (viewport), `mobile-map.png`, `mobile-panel.png`; kèm `qa-viewports.json`. Các ảnh ở bộ artifact ngoài repository để không đưa ảnh QA vào website.
- Mobile được kiểm tra bằng viewport, chưa thử điện thoại vật lý. Chưa giả lập riêng thiết lập giảm chuyển động của hệ điều hành hoặc mất mạng; code giữ đường xử lý tương ứng. Một lượt browser bị treo khi chờ tải, đã mở lại phiên và kiểm tra lại English/Phú Quốc thành công; không ghi nhận console error/warning trong phiên xác nhận sau đó.
- PDF chi phí đã dựng lại và kiểm tra bố cục cả 9 trang. Không xuất bản, không thêm dịch vụ trả phí, hợp đồng hoặc CMS.
