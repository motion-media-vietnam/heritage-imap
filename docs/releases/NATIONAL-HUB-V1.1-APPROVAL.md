# Heritage Vietnam iMAP National Hub 1.1 Approval

Bản gửi duyệt đã xuất bản trên Netlify ngày 07/11/2026. [National Homepage](https://minhtudo-heritageimap.netlify.app/) · [Heritage Listing](https://minhtudo-heritageimap.netlify.app/heritage-listing/)

- Tag `national-hub-v1.1-approval`, commit bản dựng `2edd8348e0efeead891259cb2271f7d4aaabca34`. Nhánh `release/national-hub-v1.1-approval` giữ tài liệu bàn giao sau kiểm tra.
- Dự án Netlify `minhtudo-heritageimap`, mã triển khai `6aee92d8fc8ca76342eb9b19`. Tải thủ công thư mục `dist-approval/` tạo từ `npm run build:approval`. Gói lưu có 113 trang HTML trong 237 tệp và SHA-256 `85dec53f58be5b99fb36881675519c5cfea9dba09e4eeed26a324f77a394c724`.
- Người có liên kết có thể mở qua HTTPS mà không cần đăng nhập. Netlify gửi `X-Robots-Tag: noindex, nofollow, noarchive`. Bản gửi duyệt không đặt mật khẩu và nên được chia sẻ trong nhóm duyệt.
- `/` mở National Homepage. Các đường dẫn Hà Nội trong gói duyệt vẫn mở được tại `/hanoi/`. Website Hà Nội trên Sites và tag Approval 1.0 vẫn độc lập.

## Nội dung và kiểm thử

- Thêm Heritage Listing tiếng Việt và tiếng Anh, ảnh Hang Múa có ghi tác giả, tìm kiếm 34 tỉnh thành và đường dẫn về National Homepage từ logo. Kết quả địa phương được dựng sẵn để tìm kiếm hoạt động trên Netlify Free mà không cần máy chủ riêng.
- Nhà hàng, lưu trú, lựa chọn hằng tháng và quảng cáo hiển thị trạng thái chờ biên tập. Danh sách đối tác National vẫn chờ xác nhận. Hỏi Heritage dùng gợi ý biên tập trên trình duyệt, không kết nối AI toàn quốc hoặc dịch vụ ChatGPT Sites.
- Kiểm tra tĩnh tìm được 0 đường dẫn nội bộ thiếu và 0 đường dẫn máy cá nhân hoặc mẫu khóa trong đầu ra. Astro check 0 lỗi. Cả 89 tệp đầu ra của cấu hình thông thường khớp bản Hà Nội trước đó. Bộ regression có 186 ca đạt, 7 bỏ qua và đúng 28 lỗi đã ghi nhận từ trước.
- Đã mở bản Netlify trong phiên Chrome mới và kiểm tra ở 1440, 390 và 360 px. Đã thử liên kết từ trang chủ, ảnh, tìm kiếm có dấu và không dấu theo cấu hình, VI/EN, nút logo và các đường dẫn `/national-preview/`, `/hanoi/`, `/hanoi/map/`, trang địa điểm Hà Nội, Ẩm thực và Lưu trú.

- Trang chủ Netlify qua kiểm tra Chrome ở 1920, 1440, 1280, 768, 390 và 360 px. Đã thử Atlas, tìm Hạ Long và Hoa Lư, các chế độ Featured và Seasonal, Hỏi Heritage, liên kết đặt vé, map, gallery và vùng trình phát của Hà Nội. Kiểm tra tự động không ghi nhận lỗi JavaScript, yêu cầu về localhost hoặc lỗi tải tài nguyên từ Netlify. Chưa thử trên thiết bị vật lý hoặc phát toàn bộ video.

## Cập nhật và khôi phục

Từ nhánh phát hành, tạo commit riêng cho lần chỉnh sửa và chạy lại cấu hình Approval. Chỉ tải `dist-approval/` đã kiểm tra lên mục **Deploys** của dự án `minhtudo-heritageimap`. Giữ cấu hình phát hành thủ công để chủ động chọn bản gửi duyệt. Xác nhận National Homepage, Heritage Listing, `/hanoi/` và chế độ truy cập sau mỗi lần tải.

Nếu cần khôi phục, chọn lại bản triển khai đã xác minh trong **Deploys**, hoặc tải lại gói từ tag tương ứng. Lưu bản 1.0 và 1.1 để quay lại đúng mốc. [Hướng dẫn quản lý deploy của Netlify](https://docs.netlify.com/deploy/manage-deploys/) · [Sổ chi phí](../billing.md)
