# Taste of Vietnam và họa tiết sen

Bản duyệt ngày 06/11/2026 tại `/national-preview/#taste`. Bố cục dùng tỷ lệ khoảng 60/40 trên desktop, xếp dọc trên mobile. Ảnh bàn ăn ngoài trời có lớp chữ ivory 91% đặt trong ảnh. Tham khảo cách đặt ảnh và chữ trong ấn phẩm ẩm thực và cách dẫn vào cẩm nang nhà hàng. [The Gourmand](https://thegourmand.co.uk/) · [Gourmet Traveller Restaurant Guide](https://www.gourmettraveller.com.au/dining-out/restaurant-guide/)

## Nội dung và tài nguyên

- Giữ `src/assets/national/taste-1536.webp` và `taste-720.webp`. Ảnh nhà hàng dùng `public/images/hanoi-rooftop-bar.jpg` từ thư viện, ghi chú là minh họa chờ duyệt, không kèm tên địa chỉ hay giải thưởng.
- “Hành trình của gia vị” là tựa minh họa. Ảnh, tựa và CTA “Đọc câu chuyện” dẫn đến `/national-preview/am-thuc/#chuyen-am-thuc`. Ảnh và CTA nhà hàng dẫn đến `/national-preview/am-thuc/#nha-hang`. Danh mục bài viết của chuyên trang vẫn được giữ nguyên.
- Footer chờ xác nhận artwork. PNG đính kèm thể hiện một bông sen đối xứng trên nền kem. Chưa tìm thấy `heritage_lotus_footer_traced.svg` hoặc `heritage_lotus_footer_transparent.png` của cụm sen có nụ, lá và thân như mô tả. Footer hiện dùng họa tiết từ bản duyệt trước.

## Tệp chỉnh sửa

- `src/components/national/Taste.astro`
- `docs/architecture/NATIONAL-TASTE-LOTUS-REVIEW.md`
- `docs/billing.md`
- `output/pdf/ha-long-billing-brief.pdf`

## QA

- Chụp trong trình duyệt ở 1440, 1280, 768, 390 và 360 px. Không thấy tràn ngang. Kiểm tra ảnh tải, lớp chữ nằm trong ảnh, tiêu đề minh họa, và cả hai liên kết bằng thao tác bấm thật. Chuyên trang vẫn đặt Cẩm nang nhà hàng trước nhóm bài.
- Kiểm tra footer hiện tại ở desktop và màn hình hẹp. QA artwork mới chờ tệp hoặc xác nhận mẫu. Responsive được thử bằng khung trình duyệt.
- Type check và build đạt. Toàn bộ 91 tệp bản dựng công khai khớp với bản trước. Bộ hồi quy có 182 ca qua, 28 lỗi trùng với bản trước và 7 ca bỏ qua.
