# Taste of Vietnam và họa tiết sen

Bản duyệt ngày 06/11/2026 tại `/national-preview/#taste`. Bố cục dùng tỷ lệ khoảng 60/40 trên desktop, xếp dọc trên mobile. Ảnh bàn ăn ngoài trời có lớp chữ ivory 91% đặt trong ảnh. Tham khảo cách đặt ảnh và chữ trong ấn phẩm ẩm thực và cách dẫn vào cẩm nang nhà hàng. [The Gourmand](https://thegourmand.co.uk/) · [Gourmet Traveller Restaurant Guide](https://www.gourmettraveller.com.au/dining-out/restaurant-guide/)

## Nội dung và tài nguyên

- Giữ `src/assets/national/taste-1536.webp` và `taste-720.webp`. Ảnh nhà hàng dùng `public/images/hanoi-rooftop-bar.jpg` từ thư viện, ghi chú là minh họa chờ duyệt, không kèm tên địa chỉ hay giải thưởng.
- “Hành trình của gia vị” là tựa minh họa. Ảnh, tựa và CTA “Đọc câu chuyện” dẫn đến `/national-preview/am-thuc/#chuyen-am-thuc`. Ảnh và CTA nhà hàng dẫn đến `/national-preview/am-thuc/#nha-hang`. Danh mục bài viết của chuyên trang vẫn được giữ nguyên.
- Footer dùng bông sen đối xứng được chủ dự án xác nhận. Họa tiết SVG lấy đường viền từ PNG đính kèm, bỏ nền kem và khoảng trống quanh hình. Nét sen màu champagne nằm sau nội dung ở góc dưới bên phải, với độ mờ 12% trên desktop và 9% trên mobile.

## Tệp chỉnh sửa

- `src/components/national/Taste.astro`
- `src/components/national/Footer.astro`
- `src/assets/national/brand/heritage-lotus-footer.svg`
- `docs/architecture/NATIONAL-TASTE-LOTUS-REVIEW.md`
- `docs/billing.md`
- `output/pdf/ha-long-billing-brief.pdf`

## QA

- Chụp trong trình duyệt ở 1440, 1280, 768, 390 và 360 px. Không thấy tràn ngang. Kiểm tra ảnh tải, lớp chữ nằm trong ảnh, tiêu đề minh họa, và cả hai liên kết bằng thao tác bấm thật. Chuyên trang vẫn đặt Cẩm nang nhà hàng trước nhóm bài.
- Kiểm tra và chụp họa tiết sen trên footer ở 1440, 1280, 768, 390 và 360 px. Hình hiển thị trong suốt, đúng tỷ lệ, nằm sau chữ và không tạo tràn ngang. Bốn mục đối tác, 18 liên kết và chiều cao footer giữ theo bố cục trước. Đã thử liên kết Heritage mách bạn. Responsive được thử bằng khung trình duyệt.
- Type check và build đạt. Toàn bộ 91 tệp bản dựng công khai khớp với bản trước. Bộ hồi quy có 182 ca qua, 28 lỗi trùng với bản trước và 7 ca bỏ qua.
