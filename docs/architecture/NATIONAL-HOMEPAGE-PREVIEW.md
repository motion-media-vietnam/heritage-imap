# Heritage Vietnam iMAP · National Homepage preview

Tinh chỉnh Header và Hero ngày 05/11/2026 được ghi tại [Header + Hero Refinement](NATIONAL-HEADER-HERO-REFINEMENT.md), gồm nội dung mới, bộ ảnh chủ dự án, hoa sen Vietnam Airlines và QA. Chỉ áp dụng bản duyệt cục bộ, không xuất bản.

Vòng refinement tiếp theo được ghi tại [Visual Refinement Round 2](NATIONAL-VISUAL-REFINEMENT-ROUND-2.md), tập trung vào controls, tỷ lệ collage/map, campaign và Offers. Đây là bản duyệt cục bộ, chưa xuất bản.

Art direction ngày 05/11/2026 được ghi tại [National Visual Refinement](NATIONAL-VISUAL-REFINEMENT.md), gồm palette riêng, typography, composition và kết quả QA. Các phần bên dưới giữ lịch sử của những bản duyệt trước.

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
| Offers và footer | `Offers.astro`, `Footer.astro`. Chuyên mục luôn xuất hiện và hiển thị trạng thái chờ khi chưa có ưu đãi hợp lệ. Footer có Heritage, Vietnam Airlines, liên hệ, quảng cáo, danh sách hub đã mở và attribution. |
| Dữ liệu và thiết kế | `data/national/{content,assets,map,locale}.ts`, `styles/national.css`, `assets/national/`. Tiếp tục dùng Astro, token typography Lora và Be Vietnam Pro, icon dùng chung và registry địa phương. |

16 tọa độ khớp với ID bản ghi trong dữ liệu GeoNames Việt Nam. Điểm đại diện Quảng Ninh là Hạ Long, Ninh Bình là Hoa Lư và Phú Quốc là Dương Đông. Chúng là điểm tham chiếu du lịch, không phải ranh giới hành chính. Bản đồ dùng ô ảnh OpenStreetMap với referrer policy và attribution như hệ thống hiện có. [GeoNames](https://www.geonames.org/export/), [bộ dữ liệu Việt Nam](https://download.geonames.org/export/dump/VN.zip), [chính sách ô ảnh OpenStreetMap](https://operations.osmfoundation.org/policies/tiles/).

Nguồn tham chiếu sáng tạo gồm hình collage đính kèm, nhận diện biên tập của Heritage và cách các trang du lịch trình bày hình ảnh, khám phá và nội dung theo mùa. [Heritage](https://heritagevietnamairlines.com/), [The Aficionados](https://theaficionados.com/), [Design Hotels](https://www.designhotels.com/), [Visit Norway](https://www.visitnorway.com/), [Visit Iceland](https://www.visiticeland.com/).

## Cần trước khi phát hành

- File logo quốc gia chính thức. Bản duyệt dùng tên thương hiệu dạng chữ. Chưa có hình dấu hiệu hoa sen chính thức trong kho mã nguồn.
- Ảnh có quyền sử dụng và crop đã duyệt cho hero, collage, mosaic, mùa, kỳ quan, ẩm thực và thẻ điểm đến. Ảnh AI chỉ dùng để minh họa trong bản duyệt. Ảnh Hồ Hoàn Kiếm dùng để xem thử thẻ Hà Nội, cần xác nhận quyền dùng ở National Hub. Tám điểm còn lại chưa có ảnh riêng.
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
- Trình duyệt đã kiểm tra cả hai bố cục ở 1440, 1280, 768, 390 và 360 px. Không tràn ngang. Trục thương hiệu căn giữa. Đã thử menu Enter/Escape, chỉ báo slide, chuyển ngôn ngữ, chuyển chế độ, nạp ô bản đồ, ghim Ninh Bình, thẻ Hà Nội, bật/tắt thao tác map ở viewport mobile, CTA Seasonal và hành vi Offers của bản dựng đầu.
- Đã mở trang chủ Hà Nội, link sâu `/imap/?place=van-mieu`, trang Hồ Hoàn Kiếm và Heritage mách bạn. Video Heritage mở iframe 16:9 và bắt đầu phát. Chưa thử hết thời lượng hoặc trên thiết bị vật lý.
- Ảnh chụp toàn trang của hai chế độ ở desktop và mobile lưu trong thư mục bàn giao `national-preview-captures` của workspace. Bản xem trước dùng địa chỉ loopback trên máy này. Chưa triển khai Site.

## Tinh chỉnh Explore Vietnam

Danh sách cạnh bản đồ hiển thị năm điểm đến theo thứ tự Hà Nội, TP. Hồ Chí Minh, Ninh Bình, Quảng Ninh và Điện Biên. Dữ liệu tên và trạng thái lấy từ danh mục địa phương dùng chung. Các dòng 01–05 chỉ chọn ghim, căn lại vùng nhìn và mở thẻ xem trước. Nút Khám phá chỉ xuất hiện trên thẻ có hub đang hoạt động. Chọn ghim ngoài danh sách vẫn mở được thẻ tương ứng.

Bản đồ giữ 15 ghim ban đầu và thêm Điện Biên, dùng Điện Biên Phủ làm điểm đại diện. Điện Biên, TP. Hồ Chí Minh và Quảng Ninh đã có hồ sơ nháp. [GeoNames Điện Biên Phủ](https://www.geonames.org/1583477/dien-bien-phu.html).

## Cập nhật trước đây về Hỏi Heritage và Travel Offers

- Explore Vietnam giữ năm dòng tuyển chọn và 16 ghim. Thẻ TP. Hồ Chí Minh và Điện Biên dùng ảnh AI có nhãn minh họa, đặt trong `src/assets/national/`. Hai hub này vẫn ở trạng thái nháp.
- Trong bản duyệt trước, `Companion.astro` nằm ngay sau bản đồ. Ô nhập và năm gợi ý đưa câu hỏi vào hội thoại VI/EN. Câu hỏi và lượt tiếp theo tồn tại trong trang đang mở. `heritage-companion.ts` là điểm nối cho dịch vụ toàn quốc. Một số câu tiếng Việt về Hà Nội dùng lại `answerHeritage` và được gắn nhãn kịch bản. Các câu khác hiện thông báo giới hạn và liên kết điều hướng phù hợp. Câu hỏi ba ngày dẫn đến tuyển tập Hà Nội vì kịch bản hiện tại chưa có lịch trình ba ngày.
- Heritage Travel Offers luôn xuất hiện sau Taste of Vietnam. `data/national/offers.ts` quản lý bốn nhóm ưu đãi, trạng thái, thời hạn, đối tác, ảnh và booking URL. Hệ thống hiển thị tối đa ba mục đã duyệt, còn hạn và có URL HTTPS hợp lệ. Mặc định hiển thị trạng thái chờ. `?offers=demo#offers` mở ba thẻ minh họa trong bản duyệt với nhãn rõ ràng, không giá, thương hiệu hoặc booking. [Tham chiếu Design Hotels](https://www.designhotels.com/deals/).
- Đã kiểm tra thứ tự section, câu hỏi từ ô nhập và gợi ý, gửi tiếp, đóng bằng Escape, VI/EN, hai ảnh thẻ và liên kết điểm đến, trạng thái rỗng và ba thẻ minh họa ở 1440, 768, 390 px. Bộ lọc ưu đãi thực qua kiểm thử dữ liệu hợp lệ và không hợp lệ. Chưa thử đặt dịch vụ với đối tác thật hay trên điện thoại vật lý.
- Build và kiểm tra kiểu dữ liệu sạch. Bản dựng vẫn gồm 91 tệp trùng từng byte. Bộ hồi quy 168 ca qua, 7 bỏ qua, 28 ca lỗi cũ. Chỉ bản xem trước cục bộ được cập nhật.

Ảnh minh họa được tạo bằng ImageGen tích hợp, lưu dưới dạng WebP 720 × 480. Prompt sử dụng:

- `saigon-720.webp` — Editorial photo illustration inspired by Ho Chi Minh City, Vietnam, for an internal travel preview. Horizontal 3:2 photograph, a quiet view across the Saigon river at blue hour toward layered city skyline, historic ferry in foreground, warm reflected lights, soft muted gold, blue-green and charcoal, premium travel magazine documentary look, natural perspective. No logos, captions, text or watermark.
- `dienbien-720.webp` — Editorial photo illustration inspired by Điện Biên, northwest Vietnam, for an internal travel preview. Horizontal 3:2 travel magazine photograph of broad Muong Thanh valley, gentle fields in varied shades of green, layered mountains and a narrow lane, soft early light and haze, muted sage green and warm ivory. No text, logos, watermark or famous landmark.

## Tệp thay đổi trong lần cập nhật này

- `docs/architecture/NATIONAL-HOMEPAGE-PREVIEW.md`
- `docs/billing.md`
- `output/pdf/ha-long-billing-brief.pdf`
- `src/assets/national/dienbien-720.webp`
- `src/assets/national/saigon-720.webp`
- `src/components/national/Companion.astro`
- `src/components/national/Footer.astro`
- `src/components/national/Offers.astro`
- `src/data/national/assets.ts`
- `src/data/national/companion.ts`
- `src/data/national/content.ts`
- `src/data/national/map.ts`
- `src/data/national/offers.ts`
- `src/layouts/NationalLayout.astro`
- `src/lib/heritage-companion.ts`
- `src/lib/national-selection.ts`
- `src/national/Preview.astro`
- `src/scripts/national-companion.ts`
- `src/styles/national.css`
- `tests/heritage-companion.test.ts`
- `tests/national-selection.test.ts`

## Hỏi Heritage dùng chung ở cạnh màn hình

Widget `HeritageLauncher.astro` và bộ điều khiển `heritage-assistant.ts` phục vụ cả Hà Nội và National Homepage. `NationalLayout.astro` gắn widget sau footer với cấu hình `scope="national"`. Tab dọc, hộp thoại, chuyển động, chế độ mobile và thao tác bàn phím kế thừa giao diện Hà Nội. Tab tránh menu, nút bản đồ, danh sách địa phương và CTA theo cùng cơ chế dò chỗ trống. Section Hỏi Heritage từng nằm dưới bản đồ và bộ điều khiển riêng đã được gỡ. Seasonal theo ngay sau Explore Vietnam. Travel Offers tiếp tục hiện trước footer.

- Ngữ cảnh mặc định tại Hà Nội giữ bốn gợi ý, nội dung và kịch bản `hoi-heritage.ts`. Các trang Hà Nội tiếp tục gọi cùng component với cấu hình mặc định.
- Ngữ cảnh quốc gia trong bản duyệt dùng `data/national/companion.ts` và bộ điều hợp `heritage-companion.ts`. Hỗ trợ gợi ý biên tập VI/EN cho Hà Nội, Ninh Bình, Quảng Ninh, TP. Hồ Chí Minh và Điện Biên, cùng hướng dẫn lên kế hoạch di chuyển ở mức tổng quát. Một số câu tiếng Việt về Hà Nội được chuyển cho kịch bản hiện có và gắn nhãn. Câu hỏi ngoài du lịch Việt Nam nhận lời từ chối. Câu hỏi chưa có dữ liệu biên tập hoặc cần thông tin thời gian thực nhận thông báo giới hạn.
- Toàn bộ hội thoại chạy trong trình duyệt. Chưa nối backend AI, dữ liệu thời gian thực hoặc lịch sử lưu trữ. Bộ trả lời quốc gia chỉ nạp ở chế độ phát triển, phù hợp với tuyến `/national-preview/` đang giới hạn cục bộ.
- Nguồn đối chiếu gợi ý gồm [Ninh Bình và đầm Vân Long](https://vietnam.travel/things-to-do/10-must-do-activities-ninh-binh/), [di sản Yên Tử](https://csdl.vietnamtourism.gov.vn/dest/?item=1106), [ẩm thực TP. Hồ Chí Minh](https://vietnam.travel/things-to-do/ho-chi-minh-city-cuisine-street-eats-fine-dining/), [Đồi A1](https://svhttdl.dienbien.gov.vn/ditich/pages/2012/Di-tich-doi-A1--5009.aspx) và [mùa hoa ban Điện Biên](https://dienbien.gov.vn/vi/bai-viet/VPUB--Khai-mac-Le-hoi-Hoa-Ban-nam-2026-Lan-toa-bancaizcr).

**QA widget dùng chung.** Trình duyệt xác nhận một widget trên mỗi trang đã thử. National Homepage giữ nguyên thứ tự section còn lại. Tab nằm cạnh phải khi cuộn và tránh các điều khiển quan sát được trên bản đồ ở 390 và 360 px. Đã thử mở bằng click, Enter và menu VI/EN, gửi câu hỏi, mở thẻ Ninh Bình, đóng bằng nút và Escape, phục hồi focus và vị trí cuộn. Đã đối chiếu màu, bo góc, font và bốn gợi ý Hà Nội, gửi kịch bản ở `/hanoi/` và `/hanoi/map/?place=van-mieu`. Kiểm tra mobile dùng viewport trình duyệt.

Build tạo đúng 19 trang. Kiểm tra kiểu dữ liệu sạch. Bộ hồi quy có 169 ca qua, 7 bỏ qua và đúng 28 ca lỗi có sẵn. Các bundle dùng chung được dựng lại. Dữ liệu câu trả lời quốc gia chưa vào bundle phát hành. Chưa xuất bản.

### Tệp của đợt chuyển widget

- `M	docs/architecture/NATIONAL-HOMEPAGE-PREVIEW.md`
- `M	docs/billing.md`
- `M	output/pdf/ha-long-billing-brief.pdf`
- `M	src/components/HeritageLauncher.astro`
- `D	src/components/national/Companion.astro`
- `M	src/data/national/companion.ts`
- `M	src/layouts/NationalLayout.astro`
- `M	src/lib/heritage-companion.ts`
- `M	src/national/Preview.astro`
- `M	src/scripts/heritage-assistant.ts`
- `D	src/scripts/national-companion.ts`
- `M	src/styles/national.css`
- `M	tests/heritage-companion.test.ts`
