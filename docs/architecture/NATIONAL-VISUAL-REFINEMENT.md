# National Homepage - Visual Identity Refinement

Bản duyệt cục bộ ngày 05/11/2026 tại <http://127.0.0.1:4322/national-preview/>. Không triển khai Site. Phạm vi riêng National Hub.

## Visual audit

Ba master prompt đính kèm có cùng nội dung. Ảnh Heritage tham chiếu nhận diện, collage The Aficionados tham chiếu bố cục; hai ảnh tạp chí bổ sung tham chiếu nhịp ảnh và khoảng trắng. Đã đối chiếu [Heritage](https://heritagevietnamairlines.com/) và [The Aficionados](https://theaficionados.com/). Không sao chép nội dung hoặc tài nguyên từ các website này.

Bản trước dùng nền giấy ấm, sage và blush ở nhiều section, tiêu đề chủ yếu là Lora. Bản này dùng nền trắng, tiêu đề Be Vietnam Pro, tương tác teal và CTA chọn lọc màu vàng. Lora dành cho statement collage, seasonal storytelling và wordmark chữ hiện có. Wordmark chưa thay thế cho logo quốc gia chính thức được duyệt.

## Design tokens

`src/styles/national-theme.css` khai báo trên `.national-homepage`. National Layout nạp theme trước `national.css`. Các alias `--n-*` phục vụ components hiện hữu. Không sửa `:root` hoặc shared design tokens.

| Token | Giá trị | Vai trò |
| --- | --- | --- |
| `--national-white` | `#FFFFFF` | Canvas, header, text panel, map sidebar, footer |
| `--national-ink` | `#111111` | Headings và body |
| `--national-teal` | `#006885` | Functional links, active state, selected marker, VNA link |
| `--national-yellow` | `#F5C32F` | CTA, advertising link, sponsor label |
| `--national-gold` | `#CFA052` | Decorative rules và underline |
| `--national-soft-grey` | `#EFEFEF` | Dividers và nền phụ |
| `--national-ivory` | `#FAF7F2` | Taste và editorial offers |
| `--national-blush` | `#EAD8CF` | Nền stage collage |
| `--national-muted` | `#777777` | Giá trị tham chiếu được giữ trong palette |
| `--national-gold-text` | `#8A6129` | Small labels, kickers, wordmark trên nền sáng |
| `--national-caption` | `#686868` | Caption và metadata trên nền sáng |
| `--national-teal-wash` | `#EEF5F6` | Active destination row |
| `--national-sans` | Be Vietnam Pro | UI, body, main headlines, destination names |
| `--national-serif` | Lora | Editorial accents |

Palette gốc do chủ dự án cung cấp từ ảnh tham chiếu, không phải bảng màu chính thức đã xác minh của Vietnam Airlines. Hai sắc chữ đậm hơn bảo đảm small labels và captions dễ đọc. Không thêm font, thư viện hoặc ảnh mới.

## Composition

- Header trắng, liên kết quảng cáo vàng và Vietnam Airlines teal. Hero giữ ảnh tràn khung, dùng headline sans. Mobile chừa khoảng cho tab Hỏi Heritage.
- Featured Editorial có sáu ảnh lệch cao độ, tỷ lệ khác nhau và statement trắng chồng có kiểm soát. Blush nằm trong stage của section trắng. Mobile dùng composition riêng.
- Featured Sponsored giữ logic và năm vị trí: một ảnh neo lớn, bốn ảnh hỗ trợ. Không có central panel; preview ghi rõ tài trợ minh họa.
- Explore giữ kích thước, thứ tự năm địa phương, 16 marker và hành vi chọn thẻ. Selected pin đổi màu bằng CSS.
- Seasonal giữ banner và thao tác, Lora làm điểm nhấn storytelling.
- Wonders mở bằng landscape lớn, nối với portrait Huế và ảnh vịnh lệch cao độ. Khai báo image `sizes` theo chiều rộng mới.
- Taste dùng ảnh đứng và đường vàng mảnh. Offers dùng tiêu đề sans và nền ivory trong trạng thái chờ hiện có.
- Footer trắng, đường nhấn vàng và cùng wordmark chữ. Nội dung, liên kết và thứ tự section giữ nguyên.

Widget Hỏi Heritage nằm sau footer trong cùng component dùng chung. Typography heading mới giới hạn vào `main`; không theme lại widget. Không sửa chatbot, prompt, map controller hoặc navigation controller.

## QA

- Type check trên 142 tệp: 0 lỗi, 0 cảnh báo, 0 gợi ý.
- Build thành công, 19 trang. Manifest 91 tệp phát hành trùng từng byte với bản chụp trước chỉnh sửa. Preview tiếp tục chỉ được nạp ở chế độ dev.
- Regression 204 ca: 169 qua, 7 bỏ qua, 28 lỗi cũ. Tên từng ca lỗi trùng log trước chỉnh sửa, không phát sinh ca lỗi mới. Các snapshot/harness của sprint cũ nằm ngoài phạm vi thay đổi này.
- Browser tại 1440, 1280, 768, 390 và 360 px: không tràn ngang, panel nằm trong stage, sáu ảnh editorial, một widget, Offers luôn tồn tại. Chiều cao bản đồ lần lượt 515, 515, 435, 372 và 372 px, giữ breakpoint hiện có.
- Chọn Ninh Bình trên mobile giữ trang preview, đổi selected marker sang teal và mở đúng thẻ nháp. Không tạo hub giả. Chatbot mở bằng Enter, gửi câu hỏi, đóng bằng Escape và trả focus về tab.
- Giữ focus-visible và reduced-motion rules. Ảnh dưới fold vẫn lazy-load, có kích thước khai báo. Không thêm chuyển động cho collage.
- Menu tiếng Anh ở 360 px mở bằng Enter, nằm trong viewport, ẩn floating tab khi mở; Escape đóng và trả focus về nút menu. Sponsored Mode có đủ năm mục, không tràn ngang ở 390 px.
- Đối chiếu font, cỡ chữ, màu các tiêu đề đại diện, nền trang và số widget ở Hà Nội trước/sau tại 1440 px cho kết quả giống nhau.
- Tương phản tính từ màu phẳng: ink/trắng 18,88:1, gold-text/trắng 5,49:1, caption/ivory 5,21:1, teal/trắng 6,33:1, ink/vàng 11,45:1. Gold sáng dành cho đường nhấn. Overlay trên ảnh được xem trực quan; không dùng tỷ số màu phẳng để suy ra toàn bộ ảnh.
- CSS riêng National tăng từ 23.363 lên 27.133 byte trước nén; phép so sánh gzip hai nguồn tăng 575 byte, không phải số đo truyền tải thực tế. Không thêm JavaScript hoặc dịch vụ. Chưa đo LCP/CLS trong điều kiện mạng di động thực.

Responsive dùng viewport trình duyệt; chưa kiểm tra trên điện thoại vật lý. Ảnh AI hiện có tiếp tục mang nhãn chờ duyệt. Chưa tích hợp AI backend hoặc đối tác ưu đãi thật.

Ảnh bàn giao lưu tại `C:/Users/minhtu/Documents/ChatGPT/Imap/national-preview-captures/art-direction/`: `national-desktop-1440.jpg`, `national-mobile-390.jpg`, `editorial-desktop-1440.jpg`, `sponsored-desktop-1440.jpg`. Có thêm ảnh editorial và sponsored mobile, tablet, 360 px và dữ liệu QA trong cùng thư mục. Ảnh toàn trang đã được chụp lại sau khi hình lazy-load tải đủ.

## Tệp thay đổi

- `src/styles/national-theme.css`
- `src/styles/national.css`
- `src/layouts/NationalLayout.astro`
- `src/components/national/Wonders.astro`
- `docs/architecture/NATIONAL-VISUAL-REFINEMENT.md`
- `docs/architecture/NATIONAL-HOMEPAGE-PREVIEW.md`
- `docs/billing.md`
- `output/pdf/ha-long-billing-brief.pdf`
