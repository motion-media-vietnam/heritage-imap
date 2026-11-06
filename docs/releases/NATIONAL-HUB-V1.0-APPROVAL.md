# Heritage Vietnam iMAP National Hub 1.0 Approval

## Phiên bản

- Tên phát hành **National Hub 1.0 Approval**.
- Đóng băng thiết kế ngày 06/11/2026 lúc 21:21:28 ICT, từ commit `8a3c614152838f05d0af33e56ddc58ecb7765d8a`.
- Nhánh `release/national-hub-v1.0-approval` và tag `national-hub-v1.0-approval`.
- Commit đóng gói và tương thích bản tĩnh `426ccbc5c8dea302622c85f9d2c675547a9efc04`. Commit bàn giao kế tiếp chỉ cập nhật tài liệu và bản PDF chi phí.
- Gói phát hành chứa 43 trang HTML trong 162 tệp. SHA-256 của ZIP `54184c05269e602c971e86e45120d300dfe7942e8e9e73fb16a1e6b8d8cddd70`.

## Hosting và truy cập

Bản dựng đã qua kiểm tra tĩnh cục bộ và sẵn sàng tải thủ công lên **một dự án Netlify Free mới**. Phiên Netlify mà Codex truy cập vẫn yêu cầu đăng nhập. Chủ tài khoản đã mở được bảng điều khiển trong Chrome và cần tải thư mục đã chuẩn bị từ phiên đó. Chưa xác nhận bản đã tải lên, URL HTTPS thực tế, quyền truy cập trực tuyến hay kết quả kiểm thử trên Netlify.

Tên ưu tiên là `heritage-vietnam-imap`, tên dự phòng là `heritage-vietnam-imap-review`. Cả hai địa chỉ dự kiến trả HTTP 404 trước khi triển khai. Trạng thái 404 không xác nhận tên còn trống. Dùng địa chỉ Netlify cấp thực tế trong bảng điều khiển. [Cách Netlify đặt địa chỉ](https://docs.netlify.com/manage/domains/domains-fundamentals/understand-domains/)

Bản gửi duyệt có meta robots ở các trang National và tệp `_headers` yêu cầu Netlify gửi `X-Robots-Tag: noindex, nofollow, noarchive` toàn dự án. Người có link có thể mở bản chia sẻ không đăng nhập. Netlify Free không có mật khẩu dùng chung cho khách bên ngoài, còn chế độ riêng tư chỉ cho chủ nhóm xem. Giữ việc chia sẻ trong nhóm duyệt. [Quyền truy cập Netlify](https://docs.netlify.com/deploy/protect-deploys/)

## Bản dựng

Chạy `npm ci` và `npm run build:approval` từ tag, với Node đáp ứng `package.json`. Cấu hình `astro.approval.config.mjs` dùng cùng mã Astro và tạo `dist-approval/`. Chỉ thư mục đầu ra này được tải lên. Bản dựng thường vẫn tạo `dist/` và dùng trang chủ Hà Nội tại `/`.

- `/` của bản duyệt hiển thị National Hub. `/national-preview/` vẫn mở được cùng nội dung. Các URL xem trước dùng tham số đổi chế độ vẫn thuộc quy trình phát triển cục bộ. Trên bản tĩnh, các nút VI/EN và chuyển chế độ dẫn tới trang dựng sẵn tại `/review/{ngôn-ngữ}/{featured}/{seasonal}/`.
- `/am-thuc/`, `/luu-tru/` và hai bản tiếng Anh dưới `/en/` dùng chung cấu hình nội dung. Đường dẫn cũ của hai chuyên mục dưới `/national-preview/` vẫn mở được.
- `/hanoi/`, bản đồ và trang địa điểm Hà Nội có mặt trong gói. Các URL tương thích như `/imap/`, `/heritage-mach-ban/` và `/places/` theo từng địa điểm được giữ. `/ninh-binh/` chưa có hub xuất bản, nên các điểm đến nháp chỉ mở bản đồ và trạng thái sắp ra mắt.
- Bản duyệt bỏ các URL canonical tuyệt đối của môi trường cục bộ trong metadata. Header, hero, các section, ảnh, màu và kiểu chữ dùng từ mốc đóng băng. Cột đối tác giữ vị trí và hiển thị trạng thái chờ xác nhận.

## Kiểm tra đã chạy

- Chrome trên bản tĩnh tại 1920, 1440, 1280, 768, 390 và 360 px. Đã kiểm tra tải ảnh từng section, chiều ngang trang và vùng đặt nút Hỏi Heritage. Thao tác chạm dùng mô phỏng trình duyệt.
- Atlas mở tổng quan, chưa chọn tỉnh và chưa gọi ô bản đồ. Chọn ghim giữ Spotlight Hà Nội. Tìm Hạ Long và Hoa Lư mở đúng địa danh. Ảnh, tên và CTA của Spotlight mở `/hanoi/`.
- Đã chuyển Featured và Seasonal qua các chế độ dựng sẵn, mở VI/EN, đi vào Ẩm thực và Lưu trú. Fansipan giữ link Booking, Heritage Guide giữ ảnh gốc 2.560 × 531 px. QR của ảnh gốc và ảnh duyệt desktop đã đọc được, mở trang Heritage Guide chính thức. Link mở ảnh gốc dành cho màn hình nhỏ vẫn có.
- Đã mở trang chủ, map, tìm kiếm, câu chuyện, khung video, điều khiển gallery, Heritage mách bạn và Hỏi Heritage Hà Nội. Mới xác nhận vùng trình phát hiện diện, chưa xác nhận phát toàn bộ video hoặc thiết bị thật.
- Hỏi Heritage ở National chạy bằng gợi ý biên tập và quy tắc trên trình duyệt, kể cả phản hồi toàn quốc và giới hạn dữ liệu thời gian thực. Đã thử mở từ menu, giữ nội dung khi cuộn và đóng bằng Escape. Tính năng này không dùng backend, API AI, secrets hoặc tính năng riêng của ChatGPT Sites.
- Astro check có 0 lỗi, build thành công, toàn bộ 89 tệp của bản dựng thông thường khớp đối chiếu. Bộ kiểm thử đầy đủ có 221 ca, 186 đạt, 7 bỏ qua và đúng 28 lỗi có từ trước. Kiểm tra tĩnh tìm được 0 đường dẫn nội bộ thiếu và 0 đường dẫn tài nguyên localhost, thư mục riêng hoặc mẫu khóa trong đầu ra.
- Kiểm tra 18 liên kết ngoài National có 17 phản hồi HTTP 200. Natural Earth trả 406 cho bộ kiểm tra tự động. Địa chỉ quảng cáo của nhà xuất bản chuyển đến Heritage Fashion. Đích quảng cáo và truy cập Natural Earth cần xác nhận khi duyệt. Fansipan, ấn phẩm TP.HCM và CTA đặt vé Vietnam Airlines trả 200.

## Nội dung chờ duyệt

Spotlight Hà Nội, các suất tài trợ Featured và Fansipan là mẫu được đánh dấu. Không có hợp đồng hoặc ưu đãi thực tế được khai báo trong bản phát hành. Các ảnh minh họa và artwork SKYBAG mang trạng thái duyệt hiện có. Cần xác nhận quyền công bố rộng rãi với chủ sở hữu trước Public Launch. Các địa phương chưa có hub dùng thông tin bản đồ và trạng thái chuẩn bị nội dung.

## Cách đưa bản lên và cập nhật

1. Trong trình duyệt đã đăng nhập Netlify, mở [Netlify Drop](https://app.netlify.com/drop) và kéo thư mục `dist-approval` vào vùng tải lên. Nếu nhận ZIP, giải nén trước rồi dùng thư mục chứa trực tiếp `index.html` và `_headers`. Không chọn dự án Hà Nội hoặc nối Git tự động cho lần duyệt này.
2. Đặt tên dự án là `heritage-vietnam-imap` nếu Netlify chấp nhận. Sao chép URL HTTPS vừa cấp. Mở trong cửa sổ ẩn danh và kiểm tra `/`, `/hanoi/`, chế độ duyệt, tài nguyên, Hỏi Heritage và các header trước khi gửi đối tác.
3. Khi có chỉnh sửa, lưu commit riêng trên nhánh làm việc, dựng lại cấu hình Approval và chạy lại các kiểm tra liên quan. Chỉ tải thư mục đầu ra đã xác nhận lên tab **Deploys** của đúng dự án duyệt. Ghi commit, phiên bản và URL vào tài liệu.
4. Để khôi phục, mở **Deploys** của dự án duyệt và chọn xuất bản lại bản triển khai trước đã kiểm chứng, hoặc tải lại gói lưu của phiên bản đó. Xác minh URL sau khi khôi phục. Nếu đây là lần triển khai đầu tiên, giữ gói đã kiểm thử làm mốc trước lần cập nhật tiếp theo. [Tải và quản lý bản triển khai](https://docs.netlify.com/deploy/create-deploys/)

Dự toán gói miễn phí và giả định lưu lượng nằm trong [sổ chi phí](../billing.md).
