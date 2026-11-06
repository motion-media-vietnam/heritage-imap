# Hỏi Heritage trên các trang iMAP

`HeritageLauncher.astro` cung cấp một nút nổi và một panel hội thoại trên mỗi trang. National Layout đã tích hợp component. Với Destination Layout, đặt component vào slot `assistant` để dùng cả mục mở từ thanh điều hướng và menu điện thoại. Trang dùng layout riêng cần đặt một nút `type="button"` với `data-heritage-header-open`, tên truy cập, `aria-haspopup="dialog"`, `aria-controls="heritage-drawer"` và `aria-expanded="false"`.

## Vị trí và vùng an toàn

- Tab dọc màu teal dùng cạnh phải viewport, chừa khoảng trống cho thanh điều hướng và mép dưới. Khi đặt trên vùng an toàn, tab rộng 36 px và cao 152 px.
- Dưới 768 px, dùng biểu tượng Heritage với vùng chạm 44 × 44 px. Tablet và desktop cũng có thể dùng nút gọn khi tab dọc thiếu chỗ.
- Nút ưu tiên vị trí giữa cạnh phải. Khi cần, nó thử hai vị trí cố định gần đó và giữ vị trí đang dùng nếu vẫn an toàn. Nếu cả hai dạng đều vướng, người dùng vẫn mở được từ thanh điều hướng hoặc menu.
- Giữ nguyên bố cục trang. Vùng an toàn dành cho launcher được tính từ kích thước nút, thanh điều hướng, khoảng đệm theo thiết bị và vị trí các thành phần hiện có.

## Khai báo vùng

| Thuộc tính | Cách dùng |
| --- | --- |
| `data-heritage-chat-zone="immersive"` | Đặt trên đúng vùng ảnh của hero, banner tài trợ tràn trang hoặc hình điện ảnh chiếm toàn chiều ngang. Khi ảnh chạm vùng dành cho launcher, nút mờ đi trong 200 ms. Nút trở lại sau khi ảnh qua khỏi vùng đệm. |
| `data-heritage-chat-zone="content"` | Đặt trên khung cần bảo vệ, như cụm ảnh điểm đến, bản đồ, panel bản đồ, trình phát hoặc CTA gần mép. Nút sẽ tìm chỗ an toàn bên ngoài khung. Với bottom sheet có vị trí riêng, đánh dấu trực tiếp cả sheet. |

Đánh dấu vùng ảnh tài trợ riêng để phần tiêu đề, bộ chọn và liên kết bên dưới vẫn dùng quy tắc nội dung thường. Ảnh trong thẻ biên tập dùng vùng nội dung nếu cần tránh va chạm. Controller theo dõi các vùng gần cạnh phải bằng `IntersectionObserver` và gom cập nhật cuộn vào một lần mỗi khung hình. Quy tắc dựa trên vùng khai báo và hình học của trang.

## Hội thoại và bàn phím

- Vùng ảnh và va chạm chỉ chi phối launcher. Panel tiếp tục hoạt động cho đến khi người dùng đóng bằng điều khiển hiện có, kể cả Escape. Nội dung đang nhập, các tin nhắn và phản hồi trong phiên thuộc về panel.
- Khi nút nổi mất vị trí an toàn trong lúc được focus, focus chuyển sang nút mở thay thế hoặc nút menu nếu đang thấy trên màn hình. Nếu thanh điều hướng đã cuộn khỏi màn hình, focus chuyển tới nội dung đang xem để giữ vị trí đọc. Khi đóng panel, focus quay về điểm mở còn dùng được. Nút ẩn rời thứ tự tab và ngừng nhận thao tác ngay khi bắt đầu mờ.
- Giữ focus ring và tên truy cập cho cả biểu tượng và tab dọc. Với chế độ giảm chuyển động, nút đổi trạng thái ngay. Mỗi trang mới cần thử chuột, chạm, Tab, Enter và Escape ở cả vùng ảnh tràn trang lẫn vùng bản đồ.
