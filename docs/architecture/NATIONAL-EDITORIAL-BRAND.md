# Taste of Vietnam, Vietnam Airlines và Global Footer

Bản duyệt ngày 06/11/2026 tại `/national-preview/` và `/national-preview/am-thuc/`. Hai route được đăng ký trong chế độ phát triển và dùng chung layout, kiểu chữ và thành phần National. Phần điều hướng trên chuyên trang trỏ về các section hoạt động của trang chủ. Cả hai route đều dùng noindex.

## Nội dung, ảnh và nguồn

- Trang chủ ưu tiên chuyện ẩm thực, với lối vào Cẩm nang nhà hàng bên cạnh. Chuyên trang đặt Cẩm nang nhà hàng ngay sau ảnh bìa. Ba bài được giới thiệu bằng tóm tắt mới và liên kết đến bài gốc. Hai câu chuyện ngắn dùng bố cục chữ trong khi chờ ảnh được duyệt. [Bún bò Huế](https://heritagevietnamairlines.com/tan-man-to-bun-bo-tren-dat-co-do-hue/) · [Ẩm thực Chợ Lớn](https://heritagevietnamairlines.com/bo-doi-huong-vi-ke-chuyen-am-thuc-cho-lon/) · [Vị thu Hà Nội](https://heritagevietnamairlines.com/vietnam-airlines-goi-tron-tinh-hoa-am-thuc-mua-thu-ha-noi-tren-nhung-chuyen-bay/)
- Taste và chuyên trang dùng `src/assets/national/taste-1536.webp` và `taste-720.webp`, ghi rõ ảnh AI minh họa. Footer dùng chữ ký Heritage có sẵn và hoa sen nét mảnh vẽ để trang trí.
- Offers dùng đúng PNG SKYBAG 853 × 1200 từ tệp chủ dự án cung cấp, lưu tại `src/assets/national/vietnam-airlines/skybag.png`, giữ nguyên tỉ lệ và toàn bộ artwork. Dùng lại `src/assets/national/brand/vietnam-airlines-lotus.svg` qua thành phần chữ ký hãng có sẵn. CTA mặc định nối thẳng tới website hãng. [Trang đặt vé Vietnam Airlines](https://www.vietnamairlines.com/vi-vn/ve-may-bay)
- Footer dự kiến bốn địa phương. Hà Nội dùng tên Sở Văn hóa và Thể thao theo cổng thành phố. TP. Hồ Chí Minh chờ xác nhận đơn vị. Tên cơ quan và quyền công bố cần được đối chiếu khi có hợp đồng. Chỉ hồ sơ confirmed hoặc active có quyền công bố mới xuất hiện với danh nghĩa đối tác. [Hà Nội](https://hanoi.gov.vn/chi-dao-cua-ubnd-thanh-pho-ha-noi/quy-dinh-chuc-nang-nhiem-vu-quyen-han-va-co-cau-to-chuc-cua-so-van-hoa-va-the-thao-4251201093241542.htm) · [Quảng Ninh](https://quangninh.gov.vn/So/sovanhoathethao/Trang/default.aspx) · [Điện Biên](https://svhttdl.dienbien.gov.vn/portal/KenhTin/So-Van-Hoa-The-thao-va-Du-lich.aspx)
- Các liên kết pháp lý ghi rõ phạm vi của nơi đến. Chính sách riêng của Heritage iMAP vẫn chờ duyệt. [Bảo mật Vietnam Airlines](https://www.vietnamairlines.com/vn/vi/legal/privacy-policy) · [Điều khoản Heritage](https://heritagevietnamairlines.com/dieu-khoan-chinh-sach/)

## Dữ liệu chờ duyệt

Cẩm nang chưa có nhà hàng đã duyệt. Khi có dữ liệu, bộ lọc lấy tỉnh/thành từ danh mục quốc gia và chỉ hiện các nhóm có giá trị. Các địa chỉ tài trợ được đánh dấu riêng. Liên kết bản đồ chỉ xuất hiện khi có tọa độ hợp lệ. Cần dữ liệu và ảnh được duyệt để kiểm tra bộ lọc với địa chỉ thật. Chưa có ưu đãi Vietnam Airlines được cấu hình. Campaign tương lai cần thời hạn, artwork, trạng thái duyệt và liên kết HTTPS chính thức của hãng.

## Tệp thay đổi

| Phần | Tệp |
| --- | --- |
| Định tuyến và layout | `astro.config.mjs`, `src/layouts/NationalLayout.astro`, `src/national/Preview.astro`, `src/national/Cuisine.astro` |
| Ẩm thực | `src/components/national/Taste.astro`, `src/components/national/RestaurantGuide.astro`, `src/data/national/cuisine.ts`, `src/data/national/content.ts` |
| Vietnam Airlines | `src/components/national/Offers.astro`, `src/data/national/offers.ts`, `src/assets/national/vietnam-airlines/skybag.png` |
| Footer và dọn CSS cũ | `src/components/national/Footer.astro`, `src/data/national/partners.ts`, `src/styles/national.css` |
| Bàn giao | Báo cáo này, `docs/billing.md`, `output/pdf/ha-long-billing-brief.pdf` |

## QA

- Trình duyệt ở 1440, 1280, 768, 390 và 360 px. Kiểm tra độ tràn ngang, ảnh, bố cục và danh sách đối tác. Thử hai CTA Taste, tiêu chí tuyển chọn, điều hướng theo địa phương, footer, bản tiếng Anh và chuyển sang trang đặt vé chính thức qua CTA.
- Type check và build đạt. Bản dựng công khai gồm 91 tệp khớp từng byte với bản trước. Bộ hồi quy có 182 ca qua, 28 lỗi trùng với bản trước và 7 ca bỏ qua. Kiểm tra đủ tám tổ hợp trạng thái đối tác và quyền công bố.
- Kiểm tra responsive dùng khung trình duyệt. Chưa thử trên điện thoại vật lý, dữ liệu nhà hàng được duyệt hoặc chiến dịch giá vé thật.
