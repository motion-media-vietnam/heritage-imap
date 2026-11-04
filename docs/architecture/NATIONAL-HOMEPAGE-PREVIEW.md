# Heritage Vietnam iMAP · National Homepage preview

Bản duyệt ngày 04/11/2026. Tiếp nối `9c4754e` trên nhánh `refactor/national-platform`. Mốc trước khi dựng là `checkpoint/national-homepage-before-build`. Mốc kiến trúc là `c29b2ed`, mốc khôi phục Hà Nội là `d80a433`.

## Duyệt trên máy này

- `/national-preview/` mở bản tiếng Việt và tự chọn Editorial khi không có tài trợ hợp lệ.
- `/national-preview/?featured=editorial#featured` mở collage biên tập.
- `/national-preview/?featured=sponsored#featured` mở mosaic với hai vị trí mẫu và ba vị trí biên tập. Nhãn mẫu không đại diện cho hợp đồng.
- `?lang=en` hiển thị bản tiếng Anh của National Homepage. Các trang địa phương giữ ngôn ngữ hiện có.
- Tuyến nhận tham số theo yêu cầu trên máy chủ phát triển, khai báo noindex và nằm ngoài bản dựng phát hành. Chuyển sang `/` cần duyệt thiết kế, nội dung và kế hoạch URL.

## Các phần đã dựng

| Phần | Mã nguồn và dữ liệu |
| --- | --- |
| Header và hero | `NationalLayout.astro`, `Brand.astro`, `Hero.astro` và `national-hero.ts`. Menu bàn phím, chuyển VI/EN, ảnh đầu tải ưu tiên, hai ảnh sau chỉ chèn khi cần, crossfade và điều khiển dừng/phát. |
| Featured | `FeaturedDestinations.astro`, `national-selection.ts`. Hai bố cục dùng chung dữ liệu, hỗ trợ tự động, điều kiện thời hạn, thứ tự, nhãn và lấp vị trí còn lại. Collage tham chiếu cách xếp lớp của ảnh đính kèm. |
| Bản đồ | `NationalMap.astro`, `national-map.ts`, `data/national/map.ts`. Leaflet nạp khi gần vùng xem hoặc qua nút mở bản đồ. Có ghim, thu phóng, thẻ địa phương, danh sách thay thế và bật/tắt thao tác bản đồ trên mobile. |
| Seasonal | `Seasonal.astro`. CTA mở tuyển tập ngay trên trang. Mẫu Theo dấu mùa vàng được đánh dấu là bản duyệt. Cấu hình campaign hoạt động theo thời gian, URL booking hợp lệ mới sinh nút. |
| Wonders và Taste | `Wonders.astro`, `Taste.astro`. Hai nhịp ảnh khác nhau. Liên kết sang hub hoặc thẻ điểm đến. Taste dẫn đến mục ẩm thực Hà Nội đang hoạt động. |
| Offers và footer | `Offers.astro`, `Footer.astro`. Ưu đãi và mục menu tự ẩn khi không có dữ liệu hợp lệ. Footer có Heritage, Vietnam Airlines, liên hệ, quảng cáo, danh sách hub đã mở và attribution. |
| Dữ liệu và thiết kế | `data/national/{content,assets,map,locale}.ts`, `styles/national.css`, `assets/national/`. Tiếp tục dùng Astro, token typography Lora và Be Vietnam Pro, icon dùng chung và registry địa phương. |

15 tọa độ khớp với ID bản ghi trong dữ liệu GeoNames Việt Nam. Điểm đại diện Quảng Ninh là Hạ Long, Ninh Bình là Hoa Lư và Phú Quốc là Dương Đông. Chúng là điểm tham chiếu du lịch, không phải ranh giới hành chính. Bản đồ dùng ô ảnh OpenStreetMap với referrer policy và attribution như hệ thống hiện có. [GeoNames](https://www.geonames.org/export/), [bộ dữ liệu Việt Nam](https://download.geonames.org/export/dump/VN.zip), [chính sách ô ảnh OpenStreetMap](https://operations.osmfoundation.org/policies/tiles/).

Nguồn tham chiếu sáng tạo gồm hình collage đính kèm, nhận diện biên tập của Heritage và cách các trang du lịch trình bày hình ảnh, khám phá và nội dung theo mùa. [Heritage](https://heritagevietnamairlines.com/), [The Aficionados](https://theaficionados.com/), [Design Hotels](https://www.designhotels.com/), [Visit Norway](https://www.visitnorway.com/), [Visit Iceland](https://www.visiticeland.com/).

## Cần trước khi phát hành

- File logo quốc gia chính thức. Bản duyệt dùng tên thương hiệu dạng chữ. Chưa có hình dấu hiệu hoa sen chính thức trong kho mã nguồn.
- Ảnh có quyền sử dụng và crop đã duyệt cho hero, collage, mosaic, mùa, kỳ quan, ẩm thực và thẻ điểm đến. Sáu ảnh AI chỉ là minh họa nội bộ. Ảnh Hồ Hoàn Kiếm dùng để xem thử thẻ Hà Nội, cần xác nhận quyền dùng ở National Hub. Chín điểm còn lại chưa có ảnh riêng.
- Chốt nội dung VI/EN và thông tin địa phương. Hà Nội có tuyến mở trong bản dựng, Ninh Bình và 13 điểm còn lại hiển thị trạng thái chờ.
- Hợp đồng, tài sản quảng cáo, campaign, ưu đãi, điều kiện và URL booking có xác nhận. Bản duyệt không có hợp đồng hoặc ưu đãi thực.
- URL chính sách quyền riêng tư và điều khoản cấp National Hub. Các mục này hiện ẩn. Liên hệ và quảng cáo trong bản duyệt dẫn về kênh chính thức của Heritage. [Liên hệ Heritage](https://heritagevietnamairlines.com/lien-he/), [quảng cáo Heritage](https://advertisement.heritagevietnamairlines.com/), [Vietnam Airlines](https://www.vietnamairlines.com/).

## Ảnh minh họa trong kho mã nguồn

Tạo bằng ImageGen tích hợp. Mỗi ảnh có hai bản WebP trong `src/assets/national/`, với cạnh dài tối đa 720 hoặc 1536 pixel. Các prompt đã sử dụng nằm dưới đây.

- `bay-*.webp` — Cinematic landscape photo illustration inspired by Ha Long Bay, Vietnam. Wide 3:2 full-bleed luxury travel magazine hero. Deep jade water, overlapping limestone karst islands falling into pale warm gray dawn mist, tiny traditional boat at middle right with soft wake, clean bottom left darker water for text overlay added later. Natural muted green, stone and warm ivory, fine analog grain, documentary realism, quiet scale. No text, no branding, no watermark.
- `terraces-*.webp` — Cinematic landscape photo illustration inspired by Mù Cang Chải, Vietnam, 3:2 editorial photograph. High oblique panorama of gently curving golden rice terraces in harvest season cascading diagonally across a hillside, darker forest edge, muted sage mist and amber late-afternoon light, a distant small farm hut, immersive framing. High-end documentary travel magazine realism, no text or watermark.
- `lantern-*.webp` — Cinematic travel editorial photo illustration inspired by a lane in Hội An, Vietnam at dusk. Wide 3:2 composition, ochre timber shop houses and clay tile eaves, silk lanterns glowing along a lane with depth, an anonymous cyclist with motion blur in middle distance, cool shaded foreground and warm points of light, restrained film colors. No readable text, no logos, no watermark.
- `river-*.webp` — Museum-quality editorial travel photo illustration inspired by Tràng An in Ninh Bình, Vietnam. 3:2 landscape, winding jade river reflecting sheer limestone mountains, small human-scale rowing sampan, mossy lush vegetation, subdued overcast morning with white fog, composition with central river for a vertical crop. Distinct from a coastal bay. Natural photography, no text or watermark.
- `hue-*.webp` — Vertical 2:3 editorial travel photo illustration inspired by Huế imperial architecture, Vietnam. One richly weathered vermilion entrance and shaded timber corridor, elegant roof details, fallen leaves and warm paper-like texture, light breaking through soft overcast, human-free. Muted brick, charcoal, antique gold. Documentary realism, avoid any legible signage or watermark.
- `taste-*.webp` — Vertical 2:3 refined editorial food photography illustration. Vietnamese bún bowl with rice noodles, fresh herbs, slices of grilled pork and a small ceramic dipping bowl on a simple dark worn wooden table, anonymous hands setting down herbs. Soft directional warm window light with dark charcoal shadows, tactile textures and deep sage accents. Vietnam regional culinary travel journal, realistic restrained composition, no readable text or watermark.

## Kiểm tra

- Bản dựng sản xuất có 19 trang và 91 tệp trùng từng byte với mốc trước triển khai. Bao gồm `/`, CSS, JS, hình ảnh và các tuyến Hà Nội. Tuyến xem trước và tài nguyên mới không nằm trong sản phẩm phát hành.
- Kiểm tra kiểu dữ liệu không có lỗi, cảnh báo hoặc gợi ý. Bộ hồi quy có 166 ca qua, 7 ca bỏ qua và đúng 28 ca lỗi đã có ở mốc trước thay đổi. Bốn kiểm thử mới kiểm tra lựa chọn tài trợ, lấp cửa sổ, URL booking và điều kiện ưu đãi.
- Trình duyệt đã kiểm tra cả hai bố cục ở 1440, 1280, 768, 390 và 360 px. Không tràn ngang. Trục thương hiệu căn giữa. Đã thử menu Enter/Escape, chỉ báo slide, chuyển ngôn ngữ, chuyển chế độ, nạp ô bản đồ, ghim Ninh Bình, thẻ Hà Nội, bật/tắt thao tác map ở viewport mobile, CTA Seasonal và ẩn Offers.
- Đã mở trang chủ Hà Nội, link sâu `/imap/?place=van-mieu`, trang Hồ Hoàn Kiếm và Heritage mách bạn. Video Heritage mở iframe 16:9 và bắt đầu phát. Chưa thử hết thời lượng hoặc trên thiết bị vật lý.
- Ảnh chụp toàn trang của hai chế độ ở desktop và mobile lưu trong thư mục bàn giao `national-preview-captures` của workspace. Bản xem trước dùng địa chỉ loopback trên máy này. Chưa triển khai Site.
