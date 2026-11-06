# Tìm điểm đến và chế độ Seasonal

Bản duyệt ngày 06/11/2026 tại `/national-preview/`. Explore Vietnam hiển thị bản đồ minh họa trên lượt mở thông thường. Liên kết sâu `#destination-…` hoặc `#place-…` là thao tác mở trực tiếp một kết quả. Ô tìm kiếm dùng chung cho hai trạng thái. Gõ từ khóa chỉ lọc chỉ mục trong trình duyệt. Chọn tỉnh/thành mở ghim và preview tỉnh. Chọn địa danh mở ghim riêng, chỉnh góc nhìn và hiển thị mô tả ngắn. Hai điểm Hà Nội dùng tên, bí danh, nội dung và route từ bộ dữ liệu Hanoi iMap với tọa độ đối chiếu riêng cho bản đồ National.

## Dữ liệu địa danh

| Địa danh | Tọa độ (vĩ độ, kinh độ) | Điểm tham chiếu |
| --- | --- | --- |
| Vịnh Hạ Long | 20.9, 107.1 | Điểm đại diện cho vịnh do Việt Nam báo cáo, khác ghim thành phố Hạ Long. [Báo cáo UNESCO](https://whc.unesco.org/document/164771) |
| Cố đô Hoa Lư | 20.28555556, 105.90333333 | Đền Vua Đinh Tiên Hoàng, đổi từ 20°17′08″ N, 105°54′12″ E. [Danh mục địa danh BTNMT](https://vbpl.vn/FileData/TW/Lists/vbpq/Attachments/136022/VanBanGoc_06-2019-tt-btnmt.pdf) |
| Hồ Hoàn Kiếm | 21.0287747, 105.8505791 | Điểm tham chiếu cho hồ. [GeoNames](https://www.geonames.org/search.html?country=VN&q=H%E1%BB%93+Ho%C3%A0n+Ki%E1%BA%BFm) |
| Văn Miếu | 21.02748333, 105.8354 | Điểm Văn Miếu trong danh mục khảo sát, đổi từ 21°01.649′ N, 105°50.124′ E. [Đại học Kyoto](https://archive-db.cseas.kyoto-u.ac.jp/hanoidb/E/files/Hanoi%20Places%20of%20Interests%20with%20locations.pdf) |
| Tràng An | 20.25666667, 105.89638889 | Điểm tham chiếu của quần thể, đổi từ 20°15′24″ N, 105°53′47″ E. [Bản đồ UNESCO](https://whc.unesco.org/en/list/1438/maps/) |
| Fansipan | 22.30343, 103.77494 | Điểm đỉnh núi. Nhóm khám phá Sa Pa, Lào Cai phản ánh hướng tham quan của chiến dịch. [GeoNames](https://www.geonames.org/1582023) · [Tuyến tham quan Sun World](https://sunworld.vn/vi/fansipan/di-chuyen/lo-trinh-tham-quan-fansipan-chi-tiet-tu-a-den-z-29945) |
| Hoàng Su Phì | 22.68388, 104.68332 | Điểm đại diện vùng Hoàng Su Phì, dùng cho khám phá khu vực ruộng bậc thang. [GeoNames](https://www.geonames.org/1905033) · [Vietnam Tourism](https://www.vietnam.travel/vi/things-to-do/where-see-vietnams-rice-terraces) |

Tọa độ vùng dùng để định vị khi khám phá. Chỉ Văn Miếu và Hồ Hoàn Kiếm có liên kết bài Heritage riêng trong nhóm địa danh này.

## Seasonal và artwork

- Auto lấy chiến dịch đã duyệt, có artwork được duyệt, liên kết HTTPS và nằm trong ngày hiệu lực. Nhiều chiến dịch được xếp theo ưu tiên. Ngày được tính theo giờ Việt Nam khi tải trang. Danh sách hợp đồng của bản duyệt hiện trống, nên Auto hiển thị Editorial.
- Sponsored mở bằng `?seasonal=sponsored#seasonal` để duyệt bản mẫu. Dùng lại `fansipan-2-1672.webp` và `fansipan-2-720.webp`. Booking đặt dưới dòng năm ở desktop và trong lớp phủ nhẹ sát đáy ở mobile. [Trang Sun World Fansipan](https://sunworld.vn/vi/fansipan)
- Editorial mở bằng `?seasonal=editorial#seasonal`. Dùng một visual chủ đạo từ `terraces-1536.webp` và `terraces-720.webp` với CTA tới tuyển tập. Danh sách gọn đổi từ Fansipan và Sa Pa sang Mù Cang Chải và Hoàng Su Phì. Các mục chưa có ảnh được duyệt dùng biểu tượng ghim.

## Tệp thay đổi

| Nhóm | Tệp |
| --- | --- |
| Explore Vietnam | `src/components/national/MapSearch.astro`, `src/components/national/NationalMap.astro`, `src/styles/national-discovery-map.css`, `src/scripts/national-map-search.ts`, `src/scripts/national-map.ts`, `src/data/national/map-locale.ts` |
| Chỉ mục tìm kiếm | `src/data/destinations/search-index.ts`, `src/lib/destination-search.ts` |
| Seasonal | `src/components/national/Seasonal.astro`, `src/data/national/seasonal.ts`, `src/lib/seasonal-selection.ts`, `src/data/national/content.ts` |
| Kiểm thử | `tests/national-destination-search.test.ts`, `tests/seasonal-selection.test.ts` |
| Bàn giao | Báo cáo này, `docs/billing.md`, `output/pdf/ha-long-billing-brief.pdf` |

## QA

- Trình duyệt tại 1440, 1280, 768, 390 và 360 px. Kiểm tra thứ tự kết quả với Hạ Long, Ha Long, Hoa Lư, Hoa Lu, Hà Nội, Hồ Gươm, Văn Miếu, Tràng An, Fansipan và truy vấn trống kết quả. Thử phím mũi tên, Enter, Escape và click ở kích thước mobile. Xác nhận bản đồ mặc định có 0 ô ảnh Leaflet và chọn Hạ Long/Hoa Lư mở popup đúng địa danh. Chọn Hà Nội khôi phục ghim cấp thành phố. Popup Hồ Gươm hiển thị liên kết bài hiện có.
- Kiểm tra Auto, Sponsored và Editorial, danh sách theo chế độ, CTA Editorial cuộn tới danh sách và CTA Booking điều hướng thực tế tới Sun World. Thử liên kết Fansipan trong danh sách trên viewport 360 px. Logic hợp đồng hợp lệ, hết hạn và ưu tiên được kiểm thử với ngày mẫu.
- Build và type check qua. Toàn bộ 91 tệp production khớp từng byte với baseline. Sáu ca kiểm thử mới qua. Bộ hồi quy đầy đủ có 182 ca qua, 28 lỗi từ baseline và 7 ca bỏ qua.
- Kiểm tra responsive bằng viewport trình duyệt. Chưa kiểm tra trên điện thoại vật lý, screen reader hoặc hợp đồng tài trợ thật. Năm ảnh bàn giao nằm trong thư mục `national-preview-captures/precision-refinement` ngoài kho nguồn.
