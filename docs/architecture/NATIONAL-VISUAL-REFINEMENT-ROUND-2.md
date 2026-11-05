# National Homepage - Visual Refinement Round 2

Bản duyệt ngày 05/11/2026 tại <http://127.0.0.1:4322/national-preview/>. Tiếp nối commit `133058c`. Không triển khai Site; giữ route `/` và các Destination Hub.

## Audit và kết quả thiết kế

Bản trước có nút vàng/teal phẳng, mode switch chia thành các ô riêng, panel collage chiếm ưu thế và bản đồ cao 515 px trên desktop. Offers là khối nền phẳng với ảnh và chữ đặt cạnh nhau.

- Controls được gom vào `src/styles/national-controls.css`, nạp sau National theme và composition. Bề mặt champagne/petrol có gradient nhẹ, hairline border, inset highlight, bo 4-7 px và shadow mỏng. Hover đổi sắc, active có inset/nhấn 1 px, focus có viền rõ và reduced motion bỏ chuyển động. Tái sử dụng cho utilities, language, mode switch, CTA, map controls và seasonal disclosure. Không theme lại Hỏi Heritage.
- Header giữ wordmark giữa, gọn hơn; hero có line-height và khoảng cách headline/copy/CTA thoáng hơn. Advertising và Vietnam Airlines dùng hai biến thể gold/petrol của cùng hệ controls.
- Featured rộng hơn nhẹ, title tăng authority, mode switch nằm trong một segmented rail. Panel editorial giảm từ tối đa 610 xuống 520 px, tỷ lệ rộng từ 48% xuống 41%, chữ Lora thanh hơn. Portrait Huế trở thành ảnh neo cao và rộng hơn, panel dịch sang vùng trống giữa các ảnh. Sáu ảnh và nội dung giữ nguyên; mobile có composition riêng.
- Sponsored giữ một ảnh neo lớn và bốn ảnh phụ, nhãn champagne nhỏ, overlay gradient sâu hơn, tên điểm đến khác cấp độ và arrow mảnh. Không đổi logic tài trợ hay gắn booking mới.
- Map lớn và chắc hơn, khung và sidebar có viền nhẹ. Row 01-05 cao 55 px, active có sắc petrol/ivory và đường gold mảnh; marker dùng petrol/champagne. Preview có ảnh và vùng chữ lớn hơn, chừa khoảng cho floating tab trên mobile. Không sửa map controller hoặc config điểm đến.
- Seasonal dùng headline Lora lớn hơn, block chữ có đường nhấn dọc và khoảng thở riêng, CTA cùng hệ champagne. Nội dung và disclosure cũ được giữ.
- Wonders chỉnh tỷ lệ landscape/portrait, gutter và caption có rule mảnh, số thứ tự gold, tên câu chuyện Lora. Taste giữ cảm giác gần gũi với cân bằng ảnh đứng/chữ và hairline frame.
- Offers empty state là một composition chữ/ảnh có chiều sâu: text panel ivory chồng nhẹ lên landscape. Tablet/mobile xếp lại theo trục dọc. Nội dung chờ tuyển chọn, nhãn ảnh và link xem demo vẫn rõ ràng; Offers luôn hiện.
- Footer dùng đường champagne mảnh và nền sáng chuyển sắc rất nhẹ để nối với hệ controls.

## Tokens và component styles

Giữ palette tham chiếu, Be Vietnam Pro và Lora đã chốt ở vòng trước. Các sắc sau là lựa chọn thiết kế của bản duyệt, không tuyên bố là brand specification chính thức.

| Token | Giá trị / vai trò |
| --- | --- |
| `--national-petrol` | `#254E5D` - chức năng, tên/active states |
| `--national-petrol-deep` | `#193D4B` - chữ và bề mặt petrol sâu |
| `--national-champagne` | `#E1C68E` - nhấn, rim marker |
| `--national-honey` | `#CDA964` - hairline và accent |
| `--national-control-radius` | `5px` - bo mặc định |
| `--national-control-border` | `#A88B5D66` - hairline |
| `--national-control-highlight` | inset highlight trắng mờ |
| `--national-control-elevation` | shadow 0 3px 9px, alpha thấp |
| `--national-control-surface` | gradient trắng ấm |
| `--national-control-gold` | `#ECDBB8` đến `#D8B879` |
| `--national-control-petrol` | `#345C6A` đến `#1E4352` |

Các biến `--control-surface`, `--control-hover`, `--control-ink`, `--control-edge` là giao diện nội bộ của hệ control, chỉ đặt trên controls được chọn trong `.national-homepage`. `:root` và style của Destination Hubs không thay đổi.

## QA và giới hạn

- Type check 142 tệp: 0 lỗi, 0 cảnh báo, 0 gợi ý.
- Build cuối thành công, 19 trang. Đối chiếu manifest: toàn bộ 91 tệp phát hành trùng từng byte với bản trước vòng 2, gồm các tuyến Hà Nội và `/`. Route National vẫn chỉ nạp ở dev.
- Regression: 204 ca, 169 qua, 7 bỏ qua và 28 lỗi cũ. Đối chiếu tên từng ca lỗi với vòng trước, không thêm ca lỗi mới. Không sửa snapshot/harness cũ ngoài phạm vi này.
- Kiểm tra viewport thực tế báo 1440, 1280, 768, 390 và 360 px: không tràn ngang, panel nằm trong stage, sáu ảnh editorial, một widget, đúng thứ tự section và Offers có mặt. Chiều cao map lần lượt khoảng 634, 590, 500, 440 và 440 px.
- Map giữ 16 marker và đúng năm dòng Hà Nội, TP. Hồ Chí Minh, Ninh Bình, Quảng Ninh, Điện Biên. Chọn dòng mở đúng preview và giữ trang. Nơi chưa có hub không có route giả.
- Tap lần lượt cả năm dòng tại 390 px: preview đúng, marker được chọn dùng petrol gradient, tâm marker lệch tối đa 1 px so với tâm map đo trên DOM. Chỉ Hà Nội có CTA `/hanoi/`; bốn địa phương nháp không có link hub.
- Sponsored có năm mục, hai nhãn demo theo fixture hiện có. Đã thử bằng Enter. Language/menu tiếng Anh ở 360 px không tràn, menu ẩn floating tab khi mở, focus-visible rõ. Chatbot tiếp tục mở từ menu, nhập/gửi câu hỏi và đóng bằng Escape.
- Trong QA, chạy check/build đồng thời với dev từng làm cache tối ưu dependency Leaflet bị cũ (HTTP 504 Outdated Optimize Dep). Đã làm mới cache phát triển và khởi động lại server. Map hoạt động lại với 16 marker; không giữ code chẩn đoán hoặc sửa logic bản đồ. Các lần kiểm tra cuối tách khỏi dev server rồi khởi động lại preview.
- Các cặp màu control đại diện: chữ dark trên gold 7,40:1; trắng trên petrol 7,28:1; trắng trên petrol hover 5,73:1; chữ petrol sâu trên surface sáng 10,47:1. Hỏi Heritage giữ màu nền `#173D38`, bo góc và font đã duyệt.
- CSS riêng National tăng từ 27.133 lên 36.946 byte nguồn; phép nén gzip hai nhóm nguồn chênh 1.947 byte. Đây không phải số đo truyền tải qua mạng. PDF chi phí đã cập nhật và kiểm tra bố cục cả tám trang.

Ảnh và nội dung hiện có chưa trở thành dữ liệu du lịch thời gian thực hay ưu đãi thật. Chatbot vẫn dùng dữ liệu biên tập/kịch bản trong trình duyệt, chưa nối AI backend. Responsive được kiểm tra bằng viewport, chưa trên điện thoại vật lý. Chưa đo LCP/CLS với mạng di động thực. Không thêm ảnh, font, JavaScript hoặc thư viện mới. Map lớn hơn cần đo lượng ô ảnh khi chuẩn bị công khai.

## Bàn giao và tệp thay đổi

Ảnh gốc ở `C:/Users/minhtu/Documents/ChatGPT/Imap/national-preview-captures/round-2/` gồm full-page desktop và riêng Hero, Featured Editorial, Featured Sponsored, Explore, Seasonal, Offers; có thêm ảnh mobile/tablet và QA JSON.

| Ảnh | Tệp |
| --- | --- |
| Desktop toàn trang, viewport 1440 px | `national-desktop-1440.jpg` |
| Hero và header | `hero-1440.jpg` |
| Featured Editorial | `featured-editorial-1440.jpg` |
| Featured Sponsored | `featured-sponsored-1440.jpg` |
| Explore Vietnam | `explore-vietnam-1440.jpg` |
| Seasonal Campaign | `seasonal-1440.jpg` |
| Travel Offers empty state | `offers-1440.jpg` |
| Mobile toàn trang, viewport 390 px | `national-mobile-390.jpg` |

Ảnh bàn giao đã chụp với khung tương ứng toàn trang/section và đối chiếu đủ hình sau lazy-load. File ảnh có thể không rộng đúng số pixel viewport vì phần scrollbar được loại khỏi vùng nội dung.

- `src/styles/national-theme.css`
- `src/styles/national-controls.css`
- `src/styles/national.css`
- `src/layouts/NationalLayout.astro`
- `docs/architecture/NATIONAL-VISUAL-REFINEMENT-ROUND-2.md`
- `docs/architecture/NATIONAL-HOMEPAGE-PREVIEW.md`
- `docs/billing.md`
- `output/pdf/ha-long-billing-brief.pdf`
