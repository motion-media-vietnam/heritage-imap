# National Homepage: Header và Hero

Ngày 05/11/2026. Bản duyệt cục bộ `/national-preview/`, dựa trên `7178af9`, nhánh `refactor/national-platform`. Không xuất bản. Không đổi `/`, `/hanoi/`, các section bên dưới hoặc logic slideshow.

## Nội dung và bố cục

- Kicker: **Bản đồ hành trình số**.
- Headline: **Việt Nam - 1 chạm, muôn vạn hành trình.** Chia sau dấu phẩy thành hai dòng.
- Subheadline: **Người bạn đồng hành đáng tin cậy trên hành trình khám phá dải đất chữ S diệu kỳ**.
- EN tương ứng: “A digital journey map”, “Vietnam - one touch, countless journeys.”, “Your trusted companion for discovering the wonders of Vietnam.”
- CTA giữ đích Explore Vietnam; tinh chỉnh chữ, viền, đệm, icon và chiều cao theo headline.

Headline desktop 1440px từ khoảng 104px xuống 54,72px, leading 1,22; mobile 390/360px là 28,08/25,92px, leading 1,27. Căn trái và chừa sân khấu phía phải cho ảnh. Giảm phủ tối ở chân để giữ cảnh thuyền.

Header dùng lưới ba cột cân hai bên, wordmark đúng trục giữa. Heritage chuyển champagne trầm, subtitle tách rõ bằng khoảng đệm. Quảng cáo có bề mặt champagne nhiều sắc độ; Vietnam Airlines xanh petrol và hoa sen champagne; VI/EN cùng menu dùng nền ngà, viền mảnh, highlight nhẹ. Giữ hệ controls đã duyệt. Header cao tối thiểu 88/84/76px ở desktop/tablet/mobile; tại 1440px cao thực tế 90px để đủ khoảng thở cho wordmark. Liên kết trái tiếp tục chuyển vào menu trên mobile.

## Bộ ảnh riêng của Hero

Chọn ba trong năm ảnh được cung cấp để giữ ánh sáng dịu, tông ấm và chiều sâu cảnh. Thứ tự Ninh Bình, Hà Nội mùa thu, Hội An. Hai ảnh thác nước tilt-shift và phụ nữ trong nắng ngược giữ làm tham khảo để tránh đổi mood quá mạnh. Không thêm ảnh AI.

| Slide | Tệp nguồn chủ dự án | Kích thước nguồn | Desktop WebP | Mobile WebP | Focal desktop / mobile |
| --- | --- | --- | --- | --- | --- |
| Ninh Bình | `codex-clipboard-9158564b-c0c0-4458-b5c4-4208342cbb92.jpg` | 2560 × 1704 | 1920 × 1278; 416.588 byte | 720 × 479; 68.670 byte | 50% 64% / 53% 65% |
| Hà Nội | `codex-clipboard-b59781e2-0f01-49b8-a4b3-8d90420584a8.jpg` | 2000 × 1334 | 1920 × 1281; 378.742 byte | 720 × 480; 99.234 byte | 50% 57% / 45% 62% |
| Hội An | `codex-clipboard-ae6d3f88-e9f5-4715-a02b-bb9786884d88.png` | 2000 × 1124 | 1920 × 1079; 360.466 byte | 720 × 405; 72.106 byte | 52% 55% / 62% 53% |

Tổng sáu WebP: 1.395.806 byte. Sharp có sẵn tối ưu quality 84, không thêm dependency. Giữ ảnh gốc ngoài repository; không crop phá hủy hoặc sửa chi tiết ảnh. CSS giảm saturation còn 0,9 và phủ gradient để đọc chữ. Focal points ở `data/national/hero.ts`. Không thay ảnh dùng chung trong các section dưới. Chú thích gọi cấp tỉnh Ninh Bình, không suy đoán danh thắng cụ thể. Gỡ nhãn ảnh AI ở riêng Hero vì đã dùng ảnh người dùng.

SHA-256 nguồn:

- Ninh Bình: `9ceed1cde5718a736d9ba04bc67f129e9429a6f296a08bade8995500bf1a0059`.
- Hà Nội: `eae5b11c2b6718ecd7d2be22dd115006db190e77bb34f48337ef416958851cae`.
- Hội An: `e5985cb28b74880c4872ddb63abe1c115933814c23f424d0bb6681075b30601d`.

## Hoa sen Vietnam Airlines

Dùng nguyên đường vector của [SVG hoa sen trên CDN chính thức Heritage](https://heritagevietnamairlines.cdn.vccloud.vn/wp-content/uploads/2025/12/Vector-lotus-1.svg), đối chiếu từ [trang Heritage](https://heritagevietnamairlines.com/) ngày 05/11/2026. Tệp 3.157 byte, viewBox 206 × 124; không có script hay liên kết ngoài. Lưu tại `src/assets/national/brand/vietnam-airlines-lotus.svg`, hiển thị 22 × 14px bằng CSS mask giữ đúng hình và hòa màu giao diện. `AirlineLockup.astro` dùng cho header và menu; hoa sen trang trí, tên liên kết chỉ đọc một lần. Không dùng biểu tượng tự vẽ hoặc ảnh món ăn tên lotus trong kho cũ.

## Tệp thay đổi

- `src/components/national/Hero.astro`: bố cục chữ và focal variables, giữ selectors/lazy-load/controls.
- `src/components/national/AirlineLockup.astro`: lockup dùng chung cho header/menu.
- `src/layouts/NationalLayout.astro`: gắn stylesheet và lockup.
- `src/data/national/hero.ts`: ảnh, alt VI/EN, caption, focal desktop/mobile.
- `src/data/national/content.ts`: re-export bộ Hero mới.
- `src/data/national/locale.ts`: ba chuỗi nội dung VI/EN.
- `src/styles/national-opening.css`: chỉ Header/Hero và hoa sen trong menu.
- `src/assets/national/hero/`: `ninh-binh-1920.webp`, `ninh-binh-720.webp`, `hanoi-autumn-1920.webp`, `hanoi-autumn-720.webp`, `hoi-an-1920.webp`, `hoi-an-720.webp`.
- `src/assets/national/brand/vietnam-airlines-lotus.svg`.
- Tài liệu này, `NATIONAL-HOMEPAGE-PREVIEW.md`, `docs/billing.md` và PDF tương ứng.

## QA

- Astro check: 144 tệp, 0 lỗi, 0 cảnh báo, 0 gợi ý.
- Production build: 19 trang; `/national-preview/` không nằm trong bản phát hành. So sánh SHA-256 toàn bộ `dist/`: 91/91 tệp giống hệt baseline trước lần sửa, không thêm/xóa/đổi tệp. Hanoi và route `/` giữ nguyên bản dựng.
- Hồi quy: 204 ca, 169 qua, 28 lỗi cũ, 7 bỏ qua. Đối chiếu tên cả 28 lỗi với log vòng 2: cùng tập lỗi, không có lỗi mới. Không coi bộ hồi quy là đã xanh; lỗi snapshot/harness từ các sprint cũ còn tồn tại.
- Browser viewport thực đo: 1440 × 1000, 1280 × 1000, 768 × 844, 390 × 844, 360 × 844. Cả năm không tràn ngang; mỗi span headline VI là một dòng. Wordmark lệch trục giữa tối đa 0,004px; khoảng cách với VI/EN còn 8,35px tại 360px.
- Đã duyệt cả ba ảnh ở desktop/mobile, lưu sáu ảnh chụp và thêm bản 360px. Focal points giữ cảnh thuyền Ninh Bình, tháp Rùa và dòng sông Hội An; chữ không che hết chủ thể.
- Thử VI/EN, mở menu và Escape trả focus, slide indicator, trước/sau, Enter, tạm dừng và tiếp tục/tự chuyển. Slideshow vẫn dùng `national-hero.ts` nguyên bản; reduced-motion giữ cơ chế có sẵn, chưa giả lập riêng tùy chọn hệ điều hành.
- CTA tới `#explore-vietnam`; bản đồ tải được 16 marker, cao 440px trên mobile; thứ tự bảy section chính giữ nguyên, Offers hiện và chỉ có một widget Hỏi Heritage. Không đổi JavaScript/widget hoặc các section dưới.
- Sau build dừng/mở lại dev server, tải mới trang không có console error/warning được ghi nhận. Bản xem trước mở ở đầu trang để duyệt.
- Mobile được kiểm tra bằng viewport trình duyệt, chưa thử điện thoại vật lý. Không xuất bản, không tạo Site mới hoặc cam kết chi phí trả phí.
