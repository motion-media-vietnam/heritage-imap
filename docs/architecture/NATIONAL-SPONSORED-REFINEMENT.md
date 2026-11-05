# Featured Destinations: Sponsored refinement

Ngày 05/11/2026, dựa trên `6503747`, nhánh `refactor/national-platform`. Chỉ áp dụng `/national-preview/?featured=sponsored#featured`, không xuất bản.

## Nội dung và nguồn ảnh

| Vị trí | Trước | Sau | Ảnh thực dùng |
| --- | --- | --- | --- |
| Ô lớn trái | Quảng Ninh | Hà Nội | `public/images/Ho Hoan kiem.jpg` hiện có; dùng lại đúng ảnh Hà Nội cũ |
| Trên giữa | Hà Nội | TP. Hồ Chí Minh | PNG được cung cấp `codex-clipboard-d7cfc50a-0c82-4b0d-ae82-6f7d55e6c01b.png` |
| Trên phải | Ninh Bình | Ninh Bình | `src/assets/national/river-1536.webp` / `river-720.webp`, giữ ảnh minh họa cũ |
| Dưới giữa | Hội An | Quảng Ninh | `heritage-imap/public/images/Quang Ninh/Binh lieu Dao thanh phan.jpg` trong thư mục dự án gốc |
| Dưới phải | Huế | Điện Biên | PNG được cung cấp `codex-clipboard-fdf9321d-50b7-4a74-b474-a5f3a0c83e4e.png` |

Đường dẫn Quảng Ninh được xác minh là **`public/images/Quang Ninh/Binh lieu Dao thanh phan.jpg`**, không phải `publics/imagine/Quang Ninh`. Ảnh là cảnh người Dao Thanh Phán ở Bình Liêu theo tên tệp do chủ dự án cung cấp; không thay bằng ảnh vịnh chung. Tệp này có ở thư mục dự án gốc, chưa có trong checkout Sites; bản WebP riêng của Sponsored được đưa vào source Sites để giữ tính di động. Không thêm ảnh gốc vào `public/`, tránh làm đổi bản phát hành Hà Nội.

Tên năm địa phương lấy từ destination config dùng chung. Chỉ Hà Nội có Hub hoạt động và liên kết `/hanoi/`, nhãn “Có thể khám phá”. Bốn nơi còn lại giữ “Sắp ra mắt”, mở preview tương ứng trên bản đồ qua anchor có sẵn. Không tạo route giả hoặc đổi trạng thái xuất bản. Hai fixture “Mẫu tài trợ” chuyển sang Hà Nội và TP. Hồ Chí Minh để giữ đúng vị trí minh họa; chưa có hợp đồng. Cơ chế xếp ưu tiên, kiểm tra ngày, ảnh đã duyệt và Hub đủ điều kiện giữ nguyên.

## Asset tối ưu

| Asset mới tại `src/assets/national/featured/` | Kích thước | Byte |
| --- | --- | --- |
| `ho-chi-minh-1536.webp` | 1536 × 1023 | 421.422 |
| `ho-chi-minh-720.webp` | 720 × 480 | 95.238 |
| `quang-ninh-1536.webp` | 1536 × 1024 | 186.246 |
| `quang-ninh-720.webp` | 720 × 480 | 56.488 |
| `dien-bien-600.webp` | 600 × 600 | 119.580 |

Tổng 878.974 byte. Dùng Sharp có sẵn, WebP quality 85, không phóng lớn ảnh Điện Biên 600px, không sửa chi tiết hoặc xóa dấu bản quyền trong tệp nguồn. Giữ lazy-load và responsive srcset. Hai PNG nguồn lần lượt 1920 × 1279 và 600 × 600; Quảng Ninh 2560 × 1707. Không dùng dịch vụ tạo ảnh hoặc ảnh generic mới. Ảnh Điện Biên được dùng theo chỉ định minh họa của chủ dự án; không khẳng định tên hoa/danh thắng từ hình.

## Tinh chỉnh thị giác

- Lưới desktop 1,6 : 1 : 1, hai hàng đều 288px. Hà Nội chiếm hai hàng, bốn ô phụ thẳng mép; bỏ lệch hàng cũ. Gutter 16-24px.
- Mốc 900px chuyển sang Hà Nội toàn hàng, bốn ô nhỏ trong lưới 2 × 2. Mobile: ô lớn 340px, ô phụ 220px, gutter 12px.
- Title section giảm tối đa 52px, mô tả minh họa ngay dưới cụm title/control, khoảng cách tới ảnh 28px. Riêng Sponsored dùng đệm section 76-96px desktop, 64px mobile.
- Overlay gradient xanh mực tập trung ở chân ảnh, trong dần tới 66%; không phủ đen toàn ảnh. Crop/focal riêng từng ảnh trong config, giữ tháp Rùa, Landmark 81, nhóm người Bình Liêu và cành hoa/ruộng bậc thang.
- Hà Nội dùng tên lớn hơn, đệm 32px desktop/24px mobile. Ô phụ dùng tên 23-30px desktop, 18-21px mobile; tên cân dòng bằng `text-wrap: balance`, status nhỏ bên dưới, mũi tên champagne nhỏ và thẳng hàng.
- Nhãn “Mẫu tài trợ” compact, champagne ngà, viền mảnh, góc 2px; card góc 3px và shadow rất nhẹ. Focus bàn phím vẫn rõ.
- CSS chỉ khớp `.n-featured--sponsored`; không đổi Header, Hero, Editorial Collage, widget, bản đồ, các section dưới hoặc JavaScript chung.

## Tệp thay đổi

- `src/components/national/FeaturedDestinations.astro`.
- `src/data/national/content.ts` (re-export cấu hình Featured).
- `src/data/national/featured.ts` (mới, dữ liệu, ảnh và focal points).
- `src/styles/national-sponsored.css` (mới).
- Năm WebP được liệt kê trong bảng asset.
- Tài liệu này, `NATIONAL-HOMEPAGE-PREVIEW.md`, `docs/billing.md`, `output/pdf/ha-long-billing-brief.pdf`.

## Kiểm thử và bàn giao

- Astro check: 145 tệp, 0 lỗi, 0 cảnh báo, 0 gợi ý.
- Production build: 19 trang. So sánh SHA-256 91/91 tệp `dist/` với trước lần sửa: giống hệt, không thêm/xóa/đổi tệp. Preview không vào bản phát hành. Route `/` và Hà Nội giữ nguyên.
- Hồi quy: 204 ca, 169 qua, 28 lỗi cũ, 7 bỏ qua. So tên lỗi với log Header/Hero: cùng tập 28 lỗi, không có lỗi mới. Các ca chọn/xếp tài trợ và điều kiện hiển thị vẫn qua. Bộ đầy đủ chưa xanh vì snapshot/harness cũ còn tồn tại.
- Browser thực đo 1440 × 1100, 1280 × 1100, 768 × 844, 390 × 844, 360 × 844: không tràn ngang; đủ năm ảnh tải được, nhãn nằm trong khung. Desktop ô phụ đều 288px; tablet 250px; mobile 220px. Hà Nội lần lượt khoảng 599/596/360/340/340px.
- Đã duyệt crop và typography ở desktop/tablet/mobile. Tên TP. Hồ Chí Minh trên mobile cân thành “TP. Hồ” / “Chí Minh”. Lưu riêng section desktop, khung full width desktop và hai viewport mobile (phần đầu/nhóm ô phụ) làm bàn giao.
- Click/tap TP. Hồ Chí Minh và Điện Biên mở đúng preview hiển thị trên bản đồ. Enter trên card TP. Hồ Chí Minh cũng hoạt động. Chỉ Hà Nội trỏ `/hanoi/`; bốn anchor khác dùng controller bản đồ hiện có. Bản đồ giữ 16 marker và chỉ một widget Hỏi Heritage.
- VI/EN hiển thị đúng nhãn minh họa và trạng thái. Editorial và Auto vẫn có sáu ảnh collage, không có mosaic hoặc class CSS Sponsored. Không đổi thứ tự Hero, Featured, Explore, Seasonal, Wonders, Taste, Offers; footer giữ nguyên.
- Sau build mở lại dev server và tải mới trang, không ghi nhận console error/warning. Header, Hero, các stylesheet đã duyệt, bộ điều khiển và dữ liệu bản đồ không có diff.
- Mobile kiểm tra bằng viewport trình duyệt, chưa thử trên điện thoại vật lý. Không xuất bản hoặc tạo Site mới. Cập nhật chi phí/PDF: không thêm dịch vụ trả phí, chưa có hợp đồng tài trợ thực.
