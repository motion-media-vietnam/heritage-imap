# Hà Nội iMap · Heritage

Cẩm nang khám phá Hà Nội bằng tiếng Việt, có bản đồ tương tác, câu chuyện điểm đến, ảnh và video tuyển chọn.

**[Mở website](https://heritage-imap-ha-noi.hushedhill22.chatgpt.site)** · **[Hướng dẫn dành cho chị](docs/huong-dan-su-dung.md)**

## Chị chỉ cần nói điều muốn thay đổi

Mở [Sites trong ChatGPT](https://chatgpt.com/sites) bằng tài khoản đang dùng, chọn **Hà Nội iMap · Heritage**, chọn **Edit / Chỉnh sửa** rồi nhắn bằng tiếng Việt. Có thể gửi ảnh tham khảo hoặc ảnh chụp màn hình. Ví dụ:

> Em làm phần đầu trang sáng hơn, tiêu đề dễ đọc trên điện thoại, rồi cập nhật lên website giúp chị.

Agent sửa, kiểm tra, lưu phiên bản và đưa thay đổi lên cùng đường dẫn. Chị không cần chạy lệnh, quản lý mã nguồn hoặc để laptop bật. Phải gửi yêu cầu cho agent; sửa tệp trên máy không tự cập nhật website.

Trên điện thoại, mở Sites bằng cùng tài khoản. Nếu ứng dụng chưa có Sites, thử trình duyệt điện thoại. Tính năng phụ thuộc gói tài khoản, khu vực và đợt mở tính năng. Cuộc trò chuyện Codex chỉ truy cập tệp trên laptop không tự chuyển thành môi trường đám mây; hãy mở đúng website trong Sites.

## Dành cho agent

Đọc [AGENTS.md](AGENTS.md) và [quy trình vận hành](docs/operations.md). Chủ dự án đã giao cho agent việc cài công cụ còn thiếu, bảo trì, kiểm tra, commit và xuất bản. Giữ thiết kế đã duyệt và Site hiện có trong `.openai/hosting.json`.

Website tĩnh dùng Astro và Leaflet. Chưa có cơ sở dữ liệu, tài khoản khách, đặt vé, thanh toán hoặc AI hội thoại kết nối thật. Trợ lý Heritage gợi ý từ dữ liệu tuyển chọn trong trình duyệt.

Agent có thể dùng các lệnh sau; chủ dự án không cần thực hiện:

```sh
node scripts/project.mjs setup
node scripts/project.mjs check
node scripts/project.mjs test
node scripts/project.mjs build
node scripts/project.mjs dev
node scripts/project.mjs dev:status
node scripts/project.mjs dev:logs
node scripts/project.mjs dev:stop
```

Cần Node >=22.12, Git và tar. Ưu tiên công cụ sẵn có của Codex. Trình hỗ trợ chuẩn bị npm trong dự án nếu thiếu, cài thư viện đúng `package-lock.json`; không cần cài npm toàn máy hay quyền quản trị. Lệnh phát triển dùng chế độ nền như quy định trong AGENTS.md.

## Chi phí và nguồn dữ liệu

[Bản chi phí hiện hành](docs/billing.md) là nguồn chuẩn; PDF được tạo từ chính tệp này tại `output/pdf/ha-long-billing-brief.pdf`. [Lịch sử chi phí](docs/billing-history-2026-10-25.md) giữ nguyên các đợt cũ, không phải báo giá hiện hành. Ưu tiên dịch vụ trong gói ChatGPT hiện có; không tự mua gói, credits hay tên miền.

Bản đồ: [OpenStreetMap](https://www.openstreetmap.org/copyright), tuân thủ [chính sách sử dụng](https://operations.osmfoundation.org/policies/tiles/). Dịch vụ công cộng không cam kết luôn hoạt động; website có nội dung/sơ đồ dự phòng. Định vị chỉ xin quyền khi bấm và cần HTTPS. Khoảng cách là đường chim bay. Giờ mở cửa, vé và quyền sử dụng truyền thông cần xác minh cho từng nội dung.

Nguồn tổng quan: [Vietnam Tourism](https://vietnam.travel/places-to-go/northern-vietnam/ha-noi). Ghi công ảnh và trạng thái duyệt được giữ trong dữ liệu dự án và tài liệu các đợt thiết kế.
