# Heritage List · Section 05

Bản duyệt ngày 06/11/2026 tại `/national-preview/#taste`. Heritage List thay phần Taste of Vietnam trên trang chủ. Mốc `#taste` được giữ để các liên kết cũ vẫn hoạt động. Hai cửa sổ có tỷ lệ 63/37 trên desktop, với cửa sổ lưu trú lùi xuống 34 px ở 1440 px. Cửa sổ nhà hàng đặt chữ ivory lên lớp chuyển tối ở chân ảnh. Cửa sổ lưu trú dùng lớp ivory 92% và làm mờ nền 8 px. Trên mobile, nhà hàng đứng trước lưu trú. [Gourmet Traveller](https://www.gourmettraveller.com.au/dining-out/restaurant-guide/) · [Condé Nast Traveller Gold List](https://www.cntraveller.com/gold-list-2026) · [The World's 50 Best Hotels](https://www.theworlds50best.com/hotels/) · [The Aficionados](https://www.theaficionados.com/)

## Ảnh và dữ liệu

- Nhà hàng dùng ảnh sân thượng lúc chạng vạng từ `public/images/hanoi-rooftop-bar.jpg`. Lưu trú dùng ảnh nội thất khách sạn di sản từ `public/images/Metropole legand.jpeg`. Cả hai ảnh từ thư viện dự án và mang nhãn minh họa chờ duyệt cho vị trí mới. Ảnh không đại diện cho một mục đã được chọn.
- CTA nhà hàng mở `/national-preview/am-thuc/#nha-hang`. Cẩm nang, bài viết và dữ liệu hiện có vẫn dùng cấu trúc cũ. Hồ sơ nhà hàng có thêm trường năm tuyển chọn và URL chính thức tùy chọn.
- CTA lưu trú mở `/national-preview/luu-tru/`, một route bản duyệt tương tự chuyên trang Ẩm thực. Hồ sơ lưu trú quản lý riêng và dùng danh mục điểm đến chung. Chỉ hồ sơ đã duyệt, có điểm đến và liên kết hợp lệ mới hiển thị. Danh sách hiện trống và trang hiển thị trạng thái đang tuyển chọn.
- Cần xác nhận ảnh dùng ở hai vị trí mới, địa chỉ được duyệt và quy trình biên tập trước khi công bố danh sách với tiêu đề “tốt nhất”.

## Tệp thay đổi

| Phần | Tệp |
| --- | --- |
| Section 05 | `src/components/national/HeritageList.astro`, thay `src/components/national/Taste.astro`; `src/national/Preview.astro` |
| Trang lưu trú | `astro.config.mjs`, `src/national/Stays.astro`, `src/data/national/stays.ts` |
| Cấu hình nhà hàng | `src/data/national/cuisine.ts` |
| Bàn giao | Báo cáo này, `docs/billing.md`, `output/pdf/ha-long-billing-brief.pdf` |

## QA

- Trình duyệt ở 1440, 1280, 768, 390 và 360 px. Kiểm tra độ tương phản, chủ thể, lớp phủ và tràn ngang. Chụp 1440 và 390 px. Không có thử nghiệm trên điện thoại vật lý.
- Bấm hai CTA và mở đúng cẩm nang nhà hàng, trang lưu trú. Xác nhận ba bài ẩm thực còn hiện, lưu trú chưa có mục nào được duyệt, liên kết quay lại hoạt động bằng bàn phím và bản tiếng Anh tải đúng.
- Type check và build đạt. Toàn bộ 91 tệp bản dựng công khai khớp với bản trước. Bộ hồi quy có 182 ca qua, 28 lỗi trùng với bản trước và 7 ca bỏ qua.
