# Hà Nội iMap: chi phí và cách vận hành

Cập nhật và kiểm chứng nguồn: **28/10/2026**. Tiền tệ: **USD**; chu kỳ dự toán: **mỗi tháng**; các số tiền chưa gồm thuế, phí chuyển đổi ngoại tệ và công sức thực hiện. Đây là dự toán theo giả định, không phải cam kết hóa đơn.

## Khuyến nghị và quyết định đã có

Dùng **OpenAI Sites** với tài khoản ChatGPT hiện có. Chị yêu cầu thay đổi bằng tiếng Việt; agent kiểm tra, lưu mã nguồn, commit và xuất bản lên cùng website. Không cần máy tính văn phòng chạy liên tục. Gia đình đã chọn dùng cùng tài khoản, cho phép người có đường dẫn truy cập công khai, ưu tiên miễn phí. Site đã được đăng ký; chỉ coi xuất bản hoàn tất khi công cụ triển khai trả kết quả thành công.

**Mục tiêu chi phí phát sinh định kỳ: 0 USD/tháng**, với điều kiện gói hiện tại đủ điều kiện dùng Sites, công việc nằm trong hạn mức được bao gồm và không mua thêm credits/dịch vụ. Không có khoản mua mới nào được cho phép trong cấu hình này. Đây là phần phát sinh ngoài gói ChatGPT đã có, không phải tổng chi phí kinh doanh hoặc bảo đảm phục vụ mọi mức truy cập miễn phí.

Các đợt thiết kế và báo giá lịch sử được bảo toàn trong `docs/billing-history-2026-10-25.md`. Giá cũ không được dùng làm báo giá hiện hành. Tài liệu này là nguồn chuẩn cho quyết định mới; PDF cùng tên đường dẫn cũ được tạo lại từ tài liệu này.

## Doanh nghiệp trả cho những gì

| Hạng mục | Chi phí/đơn vị đã xác minh | Điều kiện và phần chưa biết |
| --- | --- | --- |
| Sites | Được bao gồm trong gói ChatGPT đủ điều kiện trong beta; không công bố đơn giá riêng cho lượt xem/GB trên trang giá đã đọc | Phụ thuộc gói, khu vực và thiết lập tài khoản. Đã tạo được Site bằng tài khoản này. Hạn mức chính xác và quyền công khai phải đối chiếu giao diện tài khoản; không suy ra quyền dùng không giới hạn |
| ChatGPT đang dùng | Không thay gói; chi phí phát sinh do cấu hình này: 0 USD/tháng nếu trong hạn mức | Phí thuê bao sẵn có nằm ngoài ngân sách phát sinh gia đình yêu cầu. Nếu cần tài khoản mới: Plus được niêm yết 20 USD/tháng; chưa gồm thuế địa phương, không đăng ký mới |
| Công cụ phát triển | Node/Git/Python dùng bản có sẵn của Codex; npm cục bộ và thư viện theo lockfile không có phí thuê bao mới | Có tải dữ liệu khi cài; công sức cài đặt/bảo trì và internet của văn phòng không nằm trong số 0 USD |
| Bản đồ hiện có | Không cấu hình API trả phí hoặc tài khoản thanh toán mới | OpenStreetMap công cộng có chính sách sử dụng, không có hạn mức thương mại bảo đảm hay SLA; có thể chặn truy cập không báo trước |
| Dữ liệu ứng dụng | Không thêm cơ sở dữ liệu, lưu trữ đối tượng, đăng nhập khách, AI máy chủ, xử lý thanh toán hoặc giao dịch | Trợ lý Heritage vẫn dùng dữ liệu trong trình duyệt; AI tra cứu trực tiếp chỉ là khả năng tương lai, chưa triển khai/chưa báo giá |

Nguồn giá đã mở ngày 28/10/2026: [OpenAI Pricing](https://learn.chatgpt.com/docs/pricing), [Sites](https://learn.chatgpt.com/docs/sites). Điều khoản quốc gia, hạn mức tài khoản và thuế tại nơi thanh toán không được suy ra chỉ từ việc tạo Site thành công. Nếu giao diện yêu cầu mua gói hoặc credits để tiếp tục, dừng phần phát sinh phí và trình quyết định; không tự thanh toán.

<!-- pagebreak -->

## Nhu cầu thấp, dự kiến và cao

Chưa có dữ liệu truy cập sản xuất. Các con số sau là **giả định để lập kế hoạch**, không phải đo lường thực tế hay dung lượng được nhà cung cấp cam kết. Một lượt truy cập là một lần khách sử dụng website; một lần xuất bản là một bản cập nhật hoàn tất; GB là một tỷ byte dữ liệu tải về từ host. Giả sử mỗi lượt tải 5 MB tài nguyên của website và mỗi lần cập nhật tạo một lần build.

| Kịch bản/tháng | Lượt truy cập / xuất bản | Dữ liệu website: lượt × 5 MB ÷ 1.000 | Phần chi phí phát sinh dự kiến |
| --- | --- | --- | --- |
| Thấp | 1.000 / 8 | 5 GB | 0 USD nếu vẫn trong quyền lợi/hạn mức gói hiện có |
| Dự kiến | 10.000 / 30 | 50 GB | 0 USD có điều kiện; phải theo dõi hạn mức thực tế |
| Cao | 100.000 / 120 | 500 GB | Chưa thể báo giá bảo đảm; 0 USD chỉ khi còn được bao gồm, nếu chạm giới hạn phải giảm tải/chờ hoặc xin quyết định |

Công thức tái lập: `GB = số lượt × 5.000.000 / 1.000.000.000`; số build giả định bằng số lần xuất bản. Các lượt agent chạy kiểm tra, sinh ảnh và sửa lại có thể tiêu hao hạn mức ChatGPT riêng; không có tỷ lệ cố định một tin nhắn bằng một credit. Credits là đơn vị hạn mức của tài khoản, không phải lượt khách mở website. Không bật tự mua thêm credits.

**Bản đồ tách riêng:** giả sử 50% lượt truy cập mở bản đồ, mỗi lần cần 24 ô ảnh và trung bình 30 KB/ô. Số yêu cầu ô ảnh = lượt × 0,5 × 24: **12.000 / 120.000 / 1.200.000**. Dữ liệu bản đồ = số yêu cầu × 30.000 / 1e9: **0,36 / 3,6 / 36 GB**. Một yêu cầu ô ảnh tải một mảnh bản đồ; không phải một API credit trả phí. Đây không phải hạn mức được OSM chấp thuận; lưu lượng cao cần chọn nhà cung cấp phù hợp trước khi mở rộng.

Các giả định 5 MB và 24 ô ảnh cần thay bằng số đo khi có lưu lượng. Cache, số trang xem, ảnh, số lần kéo/phóng bản đồ và lần tải lại làm thay đổi thực tế. Video YouTube, phông Google và ô ảnh OSM tải từ dịch vụ ngoài, không nằm trong 5 MB giả định của host; dữ liệu di động khách trả theo gói của họ. Không chuyển video sang tự lưu trữ trong lần thiết lập này.

## Khi chạm hạn mức

Sites/Work có giới hạn theo gói; trang giá hiện hành không cho đủ thông số để bảo đảm công khai ở kịch bản cao hoặc tính giá vượt hạn mức theo GB. Đối chiếu phần sử dụng/hạn mức trong tài khoản trước mỗi đợt phát hành lớn. Không tuyên bố có trần chi tiêu cứng của Sites hoặc tự động vượt mức trả phí khi chưa xác minh. Nếu bị ngăn tạo/xuất bản hoặc yêu cầu thay gói, giữ bản ổn định, chờ reset/giảm nhu cầu và chỉ mua thêm khi chủ dự án đồng ý.

Theo dõi số lần cập nhật, hạn mức Work, lỗi tải trang/bản đồ và dữ liệu thực tế nếu nền tảng cung cấp. Kiểm tra thủ công sau phát hành; chưa bật dịch vụ giám sát trả phí hoặc tự động chạy định kỳ. Cảnh báo ngân sách chỉ là cảnh báo, không phải trần chặn phí. OSM có thể chặn tải ô ảnh; dùng danh sách/nội dung/sơ đồ dự phòng có sẵn và không tải hàng loạt/offline.

<!-- pagebreak -->

## So sánh lựa chọn

| Lựa chọn | Phí định kỳ và giới hạn đã kiểm tra | Đánh đổi và quyết định |
| --- | --- | --- |
| OpenAI Sites: chọn dùng | Phần host được bao gồm trong gói đủ điều kiện trong beta; 0 USD phát sinh có điều kiện, hạn mức tài khoản chưa công bố đầy đủ | Ít thao tác, sửa qua Work trên điện thoại; phụ thuộc tài khoản, rollout và runtime Sites. Giữ Git nguồn để có thể chuyển host |
| Chỉ chạy trên laptop | 0 USD tiền host mới, chưa gồm điện/internet/laptop/công sức | Đơn giản và rẻ cho bản nháp, nhưng không đáp ứng truy cập công khai và làm việc khi laptop tắt |
| Cloudflare Pages Free: phương án dự phòng, chưa kết nối | Gói Free 0 USD/tháng, static requests/bandwidth miễn phí; 500 build/tháng, 1 build đồng thời, tối đa 20.000 tệp và 25 MiB/tệp | Cần tài khoản/liên kết repo và quy trình triển khai riêng. Static phù hợp; chưa chọn Functions/Workers/R2. Xác nhận điều khoản, quốc gia và hạn mức tài khoản trước chuyển host |

Nguồn Cloudflare ngày 28/10/2026: [sản phẩm và gói Free](https://www.cloudflare.com/products/pages/), [giới hạn Pages](https://developers.cloudflare.com/pages/platform/limits/), [giá static và Functions](https://developers.cloudflare.com/pages/functions/pricing/). Chỉ so sánh website tĩnh: Functions có hạn mức/giá Workers riêng, không dùng trong dự toán. Trên Free, build vượt hạn mức có thể cần chờ hoặc đổi gói; tệp quá lớn phải giảm dung lượng hoặc dùng sản phẩm khác. Không suy ra static bandwidth miễn phí là mọi sản phẩm đều miễn phí.

Cả ba kịch bản 8/30/120 build thấp hơn 500 build/tháng của phương án Pages, nhưng chưa phải bảo đảm tài khoản đủ điều kiện. Các trang giá/giới hạn đã đọc không giải quyết đầy đủ quyền thương mại và điều kiện pháp lý tại Việt Nam của phương án chưa chọn; phải xác nhận trước khi cam kết. Phương án dự phòng chưa được triển khai, không tự tạo tài khoản hay phát sinh hóa đơn.

## Thương mại, khu vực và các khoản loại trừ

Sites cho phép bán hàng/dịch vụ qua đơn vị thanh toán bên thứ ba theo điều kiện của OpenAI, nhưng dự án không thu tiền/thu thẻ. Không có hệ thống đặt chỗ, giao dịch hay phí phần trăm được thêm. Tạo Site thành công xác nhận quyền thao tác hiện tại, không xác nhận mọi quốc gia có thể truy cập hoặc tạo cam kết lưu trú dữ liệu. Khả năng dùng điện thoại cần kiểm tra trên chính thiết bị/tài khoản; hướng dẫn chính thức hỗ trợ tiếp tục chỉnh sửa qua Work từ điện thoại.

Không bao gồm trong tổng phát sinh nêu trên: thuê bao ChatGPT đã có; tên miền riêng và gia hạn; thuế/VAT; tỷ giá/phí thẻ; quyền sử dụng ảnh/video/nhãn hiệu/nội dung; điện, laptop, internet; công sức phát triển, biên tập, kiểm thử và bảo trì. Không có báo giá nhân công. Không có SLA trả phí hoặc giám sát 24/7. Các giá bản đồ/AI thương mại trong lịch sử không được kiểm chứng lại và không được chọn ở đây.

Nguồn thương mại và vận hành: [Sites và giới hạn sử dụng](https://learn.chatgpt.com/docs/sites), [làm website và chỉnh sửa từ điện thoại](https://developers.openai.com/training/walkthroughs/building-a-shareable-site), [chính sách ô ảnh OSM](https://operations.osmfoundation.org/policies/tiles/), [triển khai Astro tĩnh](https://docs.astro.build/en/guides/deploy/). Tất cả được mở kiểm tra ngày 28/10/2026; các điểm chưa xác nhận được ghi rõ, không thay bằng giá tự ước đoán.

## Công việc thiết lập và duy trì

Đã bổ sung hướng dẫn tiếng Việt, trách nhiệm agent từ đầu đến cuối, công cụ cục bộ và cấu hình Site tĩnh. Không thêm dịch vụ trả phí hay thay đổi thiết kế. Công sức triển khai/bảo trì chưa báo giá và không được mặc định là miễn phí.

Bảo trì đi kèm: vá fast-uri/undici, chuẩn hóa xuống dòng Windows/đám mây và tạo PDF tiếng Việt bằng phông hệ thống; không thêm dịch vụ trả phí. Lỗi kiểm tra cũ được ghi trong tài liệu xác minh. Quy tắc phối hợp mới giảm câu hỏi/thao tác cho chủ dự án: chỉ đổi tài liệu hướng dẫn agent, chi phí nhà cung cấp phát sinh **0 USD/tháng** ở cả ba kịch bản, giả định giữ nguyên gói, lưu lượng và dịch vụ; công sức vẫn chưa báo giá.

Mỗi thay đổi/phát hành phải cập nhật dự toán, kiểm tra nguồn/số học và tạo lại PDF bằng `scripts/build-billing-brief.py`, rồi xem tất cả trang. Kết quả triển khai hiện tại phải lấy từ công cụ triển khai, không từ ghi chú lịch sử.

<!-- pagebreak -->

## Đề xuất: một mã nguồn, nhiều website thành phố

**28/10/2026 - mới là đề xuất, chưa triển khai.** Dự kiến ba website riêng: Hà Nội, TP.HCM và Đà Nẵng, cùng giao diện/tính năng, mỗi nơi có dữ liệu riêng. Không có bộ chọn thành phố cho khách. Agent sửa giao diện chung một lần, rồi tạo bản dựng và xuất bản cho từng thành phố. Chưa tạo Site mới, mua dịch vụ hoặc cấu hình tự động xuất bản nhiều website trong lần đánh giá này.

Khuyến nghị giữ Astro tĩnh và quy trình Sites hiện có, bổ sung gói dữ liệu thành phố và thao tác xuất bản tất cả do agent thực hiện. Mỗi Site có danh tính/phiên bản riêng; Sites không được giả định tự đồng bộ các bản sao. Giao diện chung đổi thì cần xuất bản mọi thành phố; chỉ đổi dữ liệu một thành phố thì thường chỉ xuất bản nơi đó. Phần phát triển này chưa được báo giá công sức và chưa được thực hiện.

**Ngân sách phát sinh mục tiêu: 0 USD/tháng trước thuế**, chỉ khi tài khoản hiện có cho phép đủ ba Site và tổng sử dụng nằm trong quyền lợi được bao gồm. Giá Sites được xác minh lại từ [OpenAI Pricing](https://learn.chatgpt.com/docs/pricing) ngày 28/10/2026: nằm trong gói đủ điều kiện khi beta, tùy gói/khu vực/cấu hình. Nguồn đã đọc không cung cấp đủ hạn mức số Site, GB, lượt xem hay đơn giá vượt mức để bảo đảm ba website miễn phí. Việc Hà Nội đang hoạt động không chứng minh quyền tạo thêm hai Site. Kiểm tra điều kiện tài khoản trước khi mở rộng; không tự mua credits hay nâng gói.

## Dự toán cho ba thành phố

Giữ giả định 5 MB/lượt truy cập và nhu cầu thấp/dự kiến/cao của mỗi website như phần trước; không phải lưu lượng đo được. Mỗi lần đổi giao diện chung cần ba bản dựng/xuất bản. Nếu tổng lượng khách chỉ được chia lại giữa các thành phố, băng thông không tự tăng gấp ba; bảng này giả định mỗi thành phố có riêng lượng khách như website ban đầu.

| Kịch bản/tháng | Lượt truy cập tổng: 3 × mỗi thành phố | Bản dựng / dữ liệu host | Phần phí phát sinh dự kiến |
| --- | --- | --- | --- |
| Thấp | 3 × 1.000 = 3.000 | 3 × 8 = 24 bản; 15 GB | 0 USD có điều kiện, chưa xác nhận hạn mức ba Site |
| Dự kiến | 3 × 10.000 = 30.000 | 3 × 30 = 90 bản; 150 GB | 0 USD chỉ khi được bao gồm; theo dõi tổng sử dụng |
| Cao | 3 × 100.000 = 300.000 | 3 × 120 = 360 bản; 1.500 GB | Chưa thể báo giá bảo đảm; cần xác nhận dung lượng/gói trước mở rộng |

Cách tính: dữ liệu host `3 × lượt mỗi thành phố × 5.000.000 / 1e9` GB. Với N thành phố, U lần sửa chung và C lần sửa nội dung riêng: số bản dựng/xuất bản giả định là `N × U + C`; chưa gồm lần chạy lại, bản xem thử, kiểm thử và lỗi xuất bản. Chi phí/hạn mức chạy agent không có tỷ lệ cố định một build bằng một credit.

Ô ảnh bản đồ, với giả định cũ 50% lượt mở bản đồ, 24 ô ảnh/lần và 30 KB/ô: tổng `3 × lượt mỗi thành phố × 0,5 × 24` = **36.000 / 360.000 / 3.600.000 yêu cầu**, tương ứng **1,08 / 10,8 / 108 GB**. Đây không phải hạn mức OSM được chấp thuận. Giữ ghi công/cache, không tải hàng loạt; lưu lượng cao cần xác nhận nhà cung cấp bản đồ phù hợp, chưa có báo giá trả phí được chọn.

<!-- pagebreak -->

## Các chi phí và giới hạn khi mở rộng

Không cần thêm cơ sở dữ liệu, CMS, AI máy chủ hoặc thanh toán chỉ để chọn dữ liệu lúc dựng website. Tuy vậy, nhiều Site tăng số bản dựng, lượt gọi công cụ triển khai và bản lưu nguồn/tài nguyên. Dung lượng mỗi phiên bản là tổng kích thước gói của từng thành phố; giữ nhiều phiên bản để quay lại làm tăng lưu trữ. Nếu các gói có kích thước S như nhau, ba Site cần khoảng `3 × S` cho một bộ phiên bản, chưa gồm nguồn/lịch sử/bản sao. S và số phiên bản giữ lại chưa được đo cho các thành phố mới; không suy ra phí lưu trữ bằng 0 khi chưa biết hạn mức.

Video YouTube, phông Google và ảnh bản đồ vẫn là lưu lượng ngoài host, không nằm trong giả định 5 MB. Chi phí tên miền/thuế/tỷ giá/công sức/quyền nội dung vẫn bị loại trừ như phần trên. Dùng đường dẫn do nền tảng cấp trước; tên miền riêng và gia hạn cho từng thành phố chưa được báo giá. Nội dung/ảnh cho TP.HCM và Đà Nẵng chưa có bộ được duyệt. Công sức tách dữ liệu, kiểm thử ba thành phố và bảo trì xuất bản phải được tính riêng với hóa đơn nhà cung cấp.

| Phương án | Phí/giới hạn đã kiểm tra | Đánh đổi |
| --- | --- | --- |
| Giữ một Site Hà Nội hiện có | Không có thay đổi phí do đánh giá tài liệu này | Đơn giản nhất hiện tại, nhưng chưa đáp ứng nhiều thành phố |
| Ba Site, chung mã nguồn, agent xuất bản | 0 USD phát sinh có điều kiện trong gói hiện có; hạn mức ba Site chưa được xác nhận | Giữ quy trình điện thoại; cần xây dựng đồng bộ nguồn và xuất bản từng Site |
| Cloudflare Pages Free, cùng repo Git | 0 USD/tháng cho static trong điều kiện Free; tối đa 5 dự án/repo, 500 build/tháng, 1 build đồng thời | Có thể tự dựng/xuất bản các dự án khi push Git; cần thêm tài khoản/liên kết và chứng minh agent trên điện thoại có quyền sửa nguồn chung |
| Sao chép website rồi sửa độc lập | Không chọn dịch vụ trả phí mới; công sức đồng bộ không được báo giá | Dễ khởi đầu nhưng dễ lệch thiết kế, không đáp ứng sửa giao diện một lần cho tất cả |

Nguồn mở lại ngày 28/10/2026: [Pages cùng repo](https://developers.cloudflare.com/pages/configuration/monorepos/), [giới hạn Free](https://developers.cloudflare.com/pages/platform/limits/), [giá Pages](https://www.cloudflare.com/products/pages/). Ba dự án và 24/90/360 build nằm dưới các giới hạn công bố nêu trên, nhưng còn build nội dung riêng/lần thử lại và điều kiện tài khoản. Free có 20.000 tệp/site, tối đa 25 MiB/tệp; Functions/Workers/R2 không được chọn. Xác nhận điều khoản thương mại, quốc gia và tài khoản trước cam kết phương án dự phòng; chưa kết nối hoặc chuyển host.

Nếu bị chặn hạn mức, giữ phiên bản ổn định, chờ reset/giảm tải hoặc trình quyết định gói; không tự mua thêm. Cảnh báo không phải trần chi tiêu. Theo dõi sử dụng chung của tài khoản, traffic từng thành phố, số build, dung lượng giữ lại và lỗi bản đồ. Sites xuất bản từng Site riêng: chưa có cam kết đổi đồng thời cả ba. Quy trình tương lai phải kiểm tra mọi bản dựng trước, ghi kết quả từng nơi và thử lại/khôi phục khi chỉ một phần thành công. Đó là yêu cầu cần triển khai, không phải khả năng đã được kiểm chứng.

**Quyết định cần có trước triển khai:** xác nhận bắt đầu tách dữ liệu/xây quy trình chung, chốt thành phố và nguồn nội dung đã duyệt, kiểm tra hạn mức ba Site. Không cần mua dịch vụ chỉ để chuẩn bị kiến trúc. Đề xuất kỹ thuật ở `docs/architecture/multi-city-sites.md`; website hiện tại vẫn chỉ là Hà Nội.


<!-- pagebreak -->

## HỎI HERITAGE: demo du lịch Hà Nội

**29/10/2026 - triển khai bộ trả lời theo kịch bản có sẵn, không kết nối AI trả phí.** Chat chạy ngay trên trình duyệt; không gọi dịch vụ AI, không tạo backend, cơ sở dữ liệu, thuê bao mới hay yêu cầu định vị. Hội thoại chỉ ở bộ nhớ trong trang, không lưu lâu dài hoặc gửi tới máy chủ. Bản đồ và các dịch vụ hiện có giữ nguyên.

**Phí API của tính năng chat: 0 USD/tháng trước thuế ở mọi kịch bản dưới đây.** Đây là kết quả không phát sinh lượt gọi API, không phải ưu đãi giá hoặc cam kết toàn bộ website miễn phí. Thuê bao ChatGPT, quyền lợi Sites, lưu trữ/băng thông website, công sức biên tập và bảo trì vẫn theo giả định/giới hạn ở các phần trước.

| Kịch bản/tháng (giả định) | Câu hỏi chat | Lượt gọi AI/API | Phí API phát sinh |
| --- | --- | --- | --- |
| Thấp | 1.000 | 0 | 0 USD |
| Dự kiến | 10.000 | 0 | 0 USD |
| Cao | 100.000 | 0 | 0 USD |

Cách tính: số câu hỏi x 0 lượt gọi/câu hỏi = 0 lượt gọi, nên không có hóa đơn API. Các tài nguyên chat tĩnh được tải cùng website; không có phí theo câu hỏi. Tăng lượng truy cập vẫn có thể chạm hạn mức host hiện có. Nguồn [Sites](https://learn.chatgpt.com/docs/sites) được mở lại ngày 29/10/2026 để đối chiếu; không suy ra hạn mức GB hay lượt xem chưa công bố. Nếu bị chặn hạn mức, giữ bản ổn định/chờ khôi phục hoặc trình quyết định, không tự mua thêm credits. Không có cam kết trả phí mới và không đổi phạm vi sử dụng thương mại/khu vực của host.

Phương án hiện tại đơn giản, không cần khóa và không có chi phí API; hạn chế là chỉ hiểu các mẫu câu du lịch được hỗ trợ, có thể từ chối nhầm cách diễn đạt mới, không tra cứu dữ liệu thời gian thực hay tự hiểu GPS. Giữ bộ gợi ý địa điểm cũ đơn giản hơn nhưng không đáp ứng hội thoại mẫu. AI trả phí có thể linh hoạt hơn nhưng cần dịch vụ máy chủ, kiểm soát chủ đề và ngân sách riêng; chưa chọn nhà cung cấp, chưa báo giá và chưa kết nối. Không cần quyết định mua dịch vụ ở giai đoạn demo này.


## Cập nhật giao diện Heritage mách bạn - 03/11/2026

Thay tiêu đề theo nội dung chủ dự án, đồng bộ typography hero, nút Heritage và nền trắng khu vực hỏi đáp. Dùng nguyên tệp ảnh JPEG Phố Bình Yên do chủ dự án cung cấp (254.116 byte, khoảng 0,254 MB) làm ảnh nền thay thế; không sinh ảnh hoặc thêm dịch vụ ảnh. Không thêm package, API, cơ sở dữ liệu, thuê bao hoặc dịch vụ trả phí; không thay gói, quyền truy cập hoặc cách tính phí hiện có. Phí API tăng thêm của thay đổi bằng 0 vì không thêm lời gọi API. Băng thông thực tế phụ thuộc cache và số lượt tải ảnh; chưa có đơn giá vượt hạn mức của tài khoản được xác nhận nên không suy ra tổng hóa đơn bằng 0. Các bảng giá lịch sử phía trên giữ ngày kiểm chứng cũ, không phải báo giá mới ngày 03/11. Công sức sửa và kiểm tra tách khỏi phí nhà cung cấp.


<!-- pagebreak -->

## Heritage mách bạn V2 - 03/11/2026

Tinh chỉnh trình bày bằng CSS, dùng lại ảnh đã có, component bản đồ Leaflet/OSM và footer trang chủ. Không thêm package, dịch vụ trả phí, AI/API chat, lưu trữ hoặc tài khoản thanh toán. Trang Heritage mách bạn nay có một bản đồ tương tác thật, vì bản trước chỉ có liên kết tới iMap; người mở trang có thể tải thêm ô bản đồ OSM. Không tải hàng loạt hoặc thêm prefetch/offline. Lượng tải phụ thuộc cache, viewport và thao tác; chưa có số đo traffic để dự báo chi phí hosting hoặc nhà cung cấp tile thương mại. Phí API chat tăng thêm vẫn là 0 vì không thêm lời gọi API, không có cam kết tổng vận hành miễn phí. Giữ điều kiện/hạn mức hiện có và không tự nâng gói.

**Thu gọn khung hỏi - 03/11/2026:** Giảm khoảng đệm và chiều cao thẻ câu hỏi mẫu; giới hạn chiều ngang khung nhập, cho ô nhập giãn theo nội dung và giảm kích thước nút tìm gợi ý. Chỉ đổi HTML/CSS, không đổi logic gợi ý hoặc bản đồ, không thêm thư viện, tài nguyên ảnh, lượt gọi dịch vụ, gói hay cam kết thanh toán. Không phát sinh hạng mục phí nhà cung cấp mới; công sức chỉnh sửa/kiểm tra tách khỏi chi phí vận hành. Các mức phí và giả định lịch sử phía trên không được coi là báo giá mới.

**Thẻ Fairmont và rooftop - 03/11/2026:** Thay nội dung biên tập theo chủ dự án và dùng hai ảnh JPEG được cung cấp, tổng dung lượng 426.923 byte (khoảng 0,427 MB). Ảnh tải khi cuộn tới thẻ; giữ cơ chế lazy-loading. Không thêm dịch vụ ảnh, thư viện, API, gói hoặc cam kết thanh toán. Ảnh mới thay vị trí ảnh cũ trên trang; không suy ra lưu lượng ròng tăng thêm 0,427 MB mỗi lượt truy cập vì còn phụ thuộc ảnh cũ, cache và cách duyệt. Không có hạng mục phí nhà cung cấp mới; chi phí lưu trữ/băng thông vẫn theo điều kiện tài khoản hiện có, chưa có số đo hoặc đơn giá vượt hạn mức để dự báo hóa đơn. Công sức biên tập và kiểm tra tách riêng; không cập nhật hay xác nhận lại các mức giá lịch sử ở phần trên.

**Ẩm thực, hành trình một ngày, Trekking & Yoga và Hanoia - 03/11/2026:** Cập nhật chữ và bốn ảnh theo ghi chú chủ dự án, tổng tệp mới 8.709.458 byte (khoảng 8,71 MB). Hai PNG được cung cấp trực tiếp; hai JPEG lấy từ bài gốc Heritage và đối chiếu khớp ảnh trong comment. Dùng tệp tĩnh tại Sites, không hotlink, không thêm thư viện, API, tài khoản hay dịch vụ ảnh trả phí. Giữ lazy-loading; dữ liệu thực tải phụ thuộc cache, phần trang được xem và ảnh cũ được thay, nên tổng dung lượng tệp không phải mức tăng băng thông chắc chắn mỗi lượt truy cập. Không có hạng mục phí nhà cung cấp mới; hạn mức và điều kiện lưu trữ/băng thông của tài khoản hiện có vẫn áp dụng. Chưa có số đo để dự báo hóa đơn, không cam kết toàn bộ vận hành miễn phí; công sức biên tập/kiểm tra tính riêng. Các mức giá lịch sử phía trên giữ nguyên ngày kiểm chứng.

**Logo Home dùng chung - 03/11/2026:** Dùng nguyên PNG nền trong suốt của chủ dự án, 553.723 byte (khoảng 0,554 MB), trên trang chủ và các trang con. Khung SVG chỉ căn vùng hiển thị, không sinh ảnh hay đổi tệp gốc. Mọi trang dùng cùng URL ảnh để trình duyệt có thể dùng cache; lưu lượng thực phụ thuộc cache và lượt tải. Không thêm thư viện, dịch vụ ảnh, API, tài khoản hoặc khoản phí mới. Lưu trữ/băng thông vẫn theo điều kiện tài khoản hiện có; không cam kết tổng vận hành miễn phí. Công sức triển khai và kiểm tra tính riêng; không xác nhận lại các mức giá lịch sử ở phần trên.

**Trạng thái logo và nút Hỏi Heritage - 03/11/2026:** Thu hình logo còn 75%, hiển thị trắng khi header phủ hero và đỏ khi vào nội dung; nút cạnh phải xuất hiện sau vùng mở đầu. Chỉ dùng CSS và xử lý cuộn trong trình duyệt, tái sử dụng PNG hiện có; không thêm ảnh, thư viện, API, lưu trữ người dùng hoặc dịch vụ trả phí. Không phát sinh hạng mục phí nhà cung cấp mới; công sức triển khai/kiểm tra tính riêng. Giữ điều kiện hosting/băng thông hiện có và không xác nhận lại giá lịch sử.


<!-- pagebreak -->

## Nền tảng Heritage iMap toàn quốc, giai đoạn chuyển tuyến ngày 04/11/2026

Một bản dựng tĩnh và một Site hiện hữu phục vụ cả tuyến cũ lẫn tuyến `/hanoi/`. Việc thêm đường dẫn tạo thêm HTML khi dựng, còn ảnh, video, phông chữ, thư viện bản đồ và cơ chế Hỏi Heritage vẫn dùng chung. Ninh Bình ở danh mục nháp nên chưa có lượt phục vụ công khai. Không thêm gói thuê bao, kho dữ liệu, máy chủ AI, API trả phí, Site hoặc tên miền.

**Dự kiến phát sinh 0 USD/tháng ngoài gói hiện có** nếu dùng trong quyền lợi tài khoản, ở cùng mức truy cập. Với giả định thấp, dự kiến và cao ở trên, chi phí phát sinh do chuyển tuyến vẫn là 0 USD khi quyền lợi đủ dùng. Việc xuất bản lại dùng hạn mức của gói. Mức lưu lượng cao và lượt tải ô bản đồ do các địa phương mới tạo thêm cần đánh giá trước khi mở công khai. Dự toán ba website ở trên thuộc phương án lịch sử tách Site, không áp dụng cho kiến trúc một Site. Chưa gồm thuế, thời gian biên tập, phát triển hoặc chi phí nhà cung cấp bản đồ nếu phải đổi.

Đối chiếu ngày 04/11/2026. Sites thuộc gói ChatGPT đủ điều kiện trong beta, tùy gói, khu vực và workspace. OpenStreetMap có thể giới hạn truy cập ô ảnh khi sử dụng gây ảnh hưởng tới dịch vụ. [Giá và quyền lợi ChatGPT](https://learn.chatgpt.com/docs/pricing), [Sites](https://learn.chatgpt.com/docs/sites), [Chính sách ô ảnh OpenStreetMap](https://operations.osmfoundation.org/policies/tiles/).

**Phase 2, tuyến xem trước cục bộ ngày 04/11/2026.** Phần chuẩn bị `/national-preview/` chỉ chạy trong môi trường phát triển có sẵn. Chi phí dịch vụ phát sinh là 0 USD/tháng ở bước này. Chưa có thêm lượt truy cập công khai, dịch vụ hoặc tài nguyên trả phí.

**Phase 2, bản dựng giao diện để duyệt ngày 04/11/2026.** Tám phần trang chủ dùng cùng Astro và Leaflet. Bản duyệt không có lượt truy cập công khai, giao dịch, dịch vụ lưu trữ mới hoặc API trả phí. Chi phí vận hành phát sinh là 0 USD/tháng ở giai đoạn này. Bộ ảnh minh họa ImageGen dùng quyền lợi của tài khoản hiện có và không tạo khoản phí vận hành định kỳ. Sau khi duyệt, cần đo dung lượng ảnh đã chốt và tỷ lệ mở bản đồ để cập nhật dự toán lưu lượng. Nhà cung cấp ô ảnh hiện phục vụ theo chính sách và năng lực dịch vụ. [Giá và quyền lợi ChatGPT](https://learn.chatgpt.com/docs/pricing), [chính sách ô ảnh OpenStreetMap](https://operations.osmfoundation.org/policies/tiles/).

**Tinh chỉnh Explore Vietnam ngày 04/11/2026.** Danh sách năm điểm đến và thao tác căn lại bản đồ dùng cùng bản duyệt cục bộ, thư viện và nguồn ô ảnh hiện có. Chi phí dịch vụ định kỳ phát sinh là 0 USD/tháng ở bước này.

**Hỏi Heritage và Travel Offers trong bản duyệt ngày 04/11/2026.** Hội thoại xử lý trong trình duyệt, dùng kịch bản Hà Nội hiện có. Offers đọc cấu hình tĩnh, hiện chưa có ưu đãi thực. Chi phí dịch vụ định kỳ phát sinh của bản duyệt là 0 USD/tháng. Chi phí tích hợp AI toàn quốc, vận hành nội dung và booking của đối tác sẽ được xác định khi có yêu cầu tích hợp.

**Widget Hỏi Heritage dùng chung ngày 04/11/2026.** National Homepage và Hà Nội dùng cùng thành phần giao diện. Bản duyệt trả lời từ dữ liệu biên tập và kịch bản chạy cục bộ trong trình duyệt. Không phát sinh chi phí định kỳ cho backend, lưu trữ hoặc API. Chi phí tích hợp AI toàn quốc sẽ được đánh giá nếu triển khai dịch vụ.

**Art direction National ngày 05/11/2026.** Chỉnh palette, typography và bố cục bằng CSS riêng của bản xem trước. Tái sử dụng ảnh, phông chữ và thư viện hiện có. Chi phí dịch vụ định kỳ phát sinh là 0 USD/tháng trong bản duyệt cục bộ, không xuất bản. Công sức thiết kế và kiểm tra tính riêng. Chưa thay đổi giả định lưu lượng hoặc xác nhận lại giá dịch vụ lịch sử.

**Visual refinement vòng 2 ngày 05/11/2026.** Hệ controls và tỷ lệ section tiếp tục dùng CSS, ảnh và phông chữ hiện có, không thêm dịch vụ hoặc thư viện. Chi phí dịch vụ định kỳ phát sinh của bản duyệt cục bộ là 0 USD/tháng. Khung bản đồ lớn hơn có thể tải thêm ô ảnh theo vùng nhìn và mức zoom; cần đo lại lưu lượng trước khi mở công khai. Công sức thiết kế/kiểm tra tính riêng; không xác nhận lại các mức giá lịch sử.

**Header và Hero ngày 05/11/2026.** Dùng ba ảnh chủ dự án cung cấp, tối ưu thành sáu WebP (tổng 1.395.806 byte); tải theo màn hình, cache và slide được xem. Hoa sen từ SVG chính thức Heritage, lưu cùng mã nguồn. Chỉ đổi bản duyệt cục bộ, không thêm thư viện, dịch vụ ảnh, AI/API, tài khoản hoặc lượt truy cập công khai. Phí dịch vụ định kỳ tăng thêm là 0 USD/tháng trước thuế ở bước này; chưa phải dự toán khi mở công khai. Ảnh tĩnh đơn giản và tiết kiệm hơn dịch vụ ảnh trả phí, vẫn cần công sức tuyển chọn/tối ưu. Trước phát hành cần đo lại băng thông; giữ hạn mức host và không tự mua thêm. Công sức triển khai, bảo trì, thuế và quy đổi tiền tệ tách riêng; không xác nhận lại giá lịch sử. Không cần quyết định mua dịch vụ.

<!-- pagebreak -->

## Featured Destinations Sponsored - 05/11/2026

Chỉ tinh chỉnh khung tài trợ trong bản duyệt cục bộ. Năm vị trí hiện là Hà Nội, TP. Hồ Chí Minh, Ninh Bình, Quảng Ninh và Điện Biên. Hai nhãn “Mẫu tài trợ” vẫn là dữ liệu minh họa, không đại diện hợp đồng hay doanh thu thực tế. Không có thanh toán, tracking quảng cáo, đấu giá vị trí hoặc tích hợp đối tác mới.

Dùng lại ảnh Hà Nội và Ninh Bình; ba ảnh được cung cấp tạo năm WebP tĩnh, tổng 878.974 byte, không thêm dịch vụ ảnh hoặc thư viện. Ảnh tải khi gần vùng xem; tệp thực tải tùy màn hình và cache, không phải cả năm tệp mỗi lượt truy cập. Giữ ảnh tĩnh sẵn có là phương án đơn giản và không cần mua dịch vụ quản lý ảnh; công sức tối ưu, tuyển chọn và bảo trì tính riêng.

**Phí dịch vụ định kỳ tăng thêm: 0 USD/tháng trước thuế ở bước duyệt này.** Chưa xuất bản, không phát sinh truy cập công khai, API, AI, backend, cơ sở dữ liệu, thuê bao hoặc dịch vụ lưu trữ mới. Không thay gói và không xác nhận lại mức giá lịch sử. Trước khi mở công khai cần đo lại lưu lượng ảnh/bản đồ và kiểm tra hạn mức host; chưa có đơn giá vượt hạn mức được xác nhận để dự báo hóa đơn. Nếu chạm hạn mức, giữ bản ổn định, giảm tải hoặc chờ khôi phục; không tự mua thêm. Thuế, quy đổi tiền tệ và công sức triển khai/bảo trì chưa tính vào phí nhà cung cấp. Không cần quyết định mua dịch vụ cho lần sửa này.

## Explore Vietnam: pin ảnh, danh mục và spotlight - 05/11/2026

Bản duyệt dùng 34 tỉnh/thành, 33 mục ngoài spotlight và cấu hình tài trợ có ngày hiệu lực. Chưa có hợp đồng thật, CMS, thanh toán, theo dõi quảng cáo, backend hoặc tác vụ trả phí. Không thêm Site, thư viện hay nhà cung cấp. Phí dịch vụ định kỳ tăng thêm là **0 USD/tháng trước thuế trong bước duyệt cục bộ**; không phải cam kết toàn bộ vận hành miễn phí khi phát hành.

Năm thumbnail WebP mới tổng 59.582 byte (khoảng 59,6 KB); ảnh spotlight dùng lại kho hiện có, tải theo thao tác và cache. Khung bản đồ lớn hơn và thao tác pan/zoom có thể tải thêm ô ảnh. GeoNames tải dữ liệu tĩnh một lần, không gọi API theo lượt xem; giấy phép CC BY 4.0 và attribution được giữ. Nguồn kiểm tra ngày 05/11/2026: [GeoNames readme](https://download.geonames.org/export/dump/readme.txt), [chính sách ô ảnh OSM](https://operations.osmfoundation.org/policies/tiles/). Dịch vụ cộng đồng có thể chặn truy cập không phù hợp; không tải hàng loạt, offline hoặc prefetch. Khi không tải được nền, danh mục và preview vẫn dùng được.

Giữ cách hiện tại đơn giản và không cần mua dịch vụ; bản đồ thương mại hoặc CMS có thể hỗ trợ vận hành/quản lý tốt hơn nhưng cần dự toán và lựa chọn riêng trước khi tích hợp. Trước mở công khai cần đo lượt xem, ô ảnh và dung lượng thực, kiểm tra hạn mức tài khoản và cập nhật kịch bản thấp/dự kiến/cao; hiện chưa có traffic công khai của National để dự báo hóa đơn. Công sức biên tập, triển khai/bảo trì, thuế và quy đổi tiền tệ tính riêng; giá lịch sử không được xác nhận lại. Không cần quyết định mua dịch vụ ở bước này.

<!-- pagebreak -->

## Explore Vietnam: bản đồ minh họa và mở tương tác theo yêu cầu - 06/11/2026

**Đã triển khai trong bản duyệt cục bộ, không xuất bản. Phí dịch vụ định kỳ tăng thêm: 0 USD/tháng trước thuế.** Dùng một SVG riêng khoảng 12,1 KB và năm thumbnail hiện có; Leaflet cùng ô ảnh OpenStreetMap chỉ khởi tạo khi người xem chọn ghim, địa phương hoặc nút mở bản đồ. Không thêm tài khoản, thư viện, máy chủ, API AI, CMS, tracking quảng cáo, thanh toán, cơ sở dữ liệu, Site hoặc tên miền. Không thay gói hay bật tính phí vượt hạn mức. Chi phí công sức thiết kế, kiểm tra, biên tập và bảo trì tính riêng.

Đường nét đất liền/ven bờ lấy từ Natural Earth 1:50m và biên tập thành vector tĩnh. Kiểm tra ngày 06/11/2026: dữ liệu thuộc public domain, được chỉnh sửa và dùng thương mại không phải mua giấy phép. Đây là bản đồ du lịch minh họa, không phải dữ liệu dẫn đường; hai quần đảo được thể hiện bằng sơ đồ thu nhỏ. [Điều khoản Natural Earth](https://www.naturalearthdata.com/about/terms-of-use/).

SVG lưu cùng website, không phát sinh lượt gọi API cho lớp minh họa. Với giả định 1.000 / 10.000 / 100.000 lượt tải SVG chưa có cache mỗi tháng, lượng truyền riêng SVG tương ứng khoảng 12,1 MB / 120,6 MB / 1,21 GB (12.055 byte nhân số lượt; GB thập phân). Đây chỉ là ba giả định lưu lượng để chuẩn bị phát hành, chưa phải hóa đơn hoặc toàn bộ băng thông; chưa gồm ảnh spotlight, thumbnail, phông chữ, HTML và ô ảnh. Trong giai đoạn cục bộ hiện tại cả ba kịch bản đều có 0 lượt phục vụ National công khai, nên khoản phát sinh dịch vụ vẫn là 0 USD/tháng.

Tỷ lệ người mở tương tác chưa được đo. Không suy từ giảm tải ô ảnh ra một khoản tiết kiệm tiền cố định. OSM vẫn là dịch vụ cộng đồng dung lượng hữu hạn, có thể chặn truy cập và không có cam kết sẵn sàng. Giữ attribution, Referer và cache trình duyệt; không tải trước hoặc tải offline. Khi lỗi tải, lớp đồ họa/danh mục/preview vẫn là đường khám phá dự phòng. Kiểm tra ngày 06/11/2026: [chính sách ô ảnh OSM](https://operations.osmfoundation.org/policies/tiles/).

Giữ cách hiện tại đơn giản hơn mua dịch vụ thiết kế bản đồ. Bản đồ thương mại có thể hỗ trợ thiết kế và độ ổn định tốt hơn nhưng cần dự toán riêng khi có nhu cầu. Trước mở công khai cần đo tỷ lệ mở map, số ô ảnh và băng thông, kiểm tra quyền lợi hosting hiện có, rồi cập nhật dự toán. Chưa xác nhận đơn giá vượt hạn mức, thuế, quy đổi tiền tệ hoặc báo giá dịch vụ thương mại; các mức giá lịch sử không được xác nhận lại. Khi chạm giới hạn, giảm tải hoặc giữ lớp minh họa trong lúc xử lý; không tự nâng gói. Không cần quyết định mua dịch vụ cho lần tinh chỉnh này.

**Seasonal Heritage, 06/11/2026.** Bản duyệt tăng **0 USD/tháng**. Ảnh Fansipan có hai bản WebP 123 KB và 451 KB, tải theo màn hình. Bấm ảnh hoặc Booking đều mở trang Sun World, với 0 lượt gọi API đặt vé và 0 giao dịch trên Heritage. Chi phí biên tập, vận hành và giá vé của đối tác tính riêng.

**Tìm điểm đến và chế độ Seasonal, 06/11/2026.** Phí dịch vụ định kỳ tăng thêm trong bản duyệt là **0 USD/tháng**. Tìm kiếm 34 tỉnh/thành và 7 địa danh bằng chỉ mục tĩnh trên trình duyệt, với 0 lượt gọi dịch vụ tra tọa độ khi gõ. Leaflet tải ô ảnh OpenStreetMap khi người xem mở bản đồ hoặc chọn kết quả. Seasonal dùng lại ảnh tĩnh và liên kết Sun World hiện có. Trước khi phát hành, đo lưu lượng ô ảnh theo tỷ lệ chọn kết quả và kiểm tra giới hạn của nhà cung cấp bản đồ. Công sức biên tập và kiểm tra tính riêng.

**Vị trí ghim Ninh Bình và Quảng Ninh, 06/11/2026.** Điều chỉnh vị trí hiển thị trên bản đồ minh họa. Chi phí dịch vụ tăng thêm là **0 USD/tháng** vì dùng lại tọa độ, ảnh và luồng tải bản đồ tương tác hiện có.

**Ẩm thực, Vietnam Airlines và footer, 06/11/2026.** Phí dịch vụ tăng thêm cho bản duyệt là **0 USD/tháng**. Chuyên trang dùng dữ liệu tĩnh và lọc trên trình duyệt, với 0 yêu cầu tới dịch vụ tìm kiếm hoặc cơ sở dữ liệu. Artwork SKYBAG được cung cấp có dung lượng 1,07 MB và chỉ tải khi cần. Liên kết đặt vé mở trang chính thức, với 0 giao dịch hoặc yêu cầu đặt vé xử lý trên Heritage. Lượt tải cục bộ không làm tăng lưu lượng website công khai. Nếu phát hành sau khi duyệt, tính dung lượng ảnh vào hạn mức lưu trữ và truyền tải hiện có. Công sức biên tập, xác minh địa chỉ, quyền sử dụng ảnh và giá vé tính riêng. [Trang đặt vé Vietnam Airlines](https://www.vietnamairlines.com/vi-vn/ve-may-bay)

**Taste, họa tiết sen và Heritage List, 06/11/2026.** Phí dịch vụ tăng thêm cho bản duyệt là **0 USD/tháng**. Bản Taste dùng ảnh bún. Heritage List dùng lại ảnh sân thượng 96 KB và Metropole 961 KB, chờ duyệt vị trí mới. Footer dùng SVG 4,9 KB từ mẫu đã chọn. Trang lưu trú dùng dữ liệu tĩnh và không xử lý đặt phòng. Ảnh tải khi cần. Công sức biên tập tính riêng.

**Tinh chỉnh giao diện, 06/11/2026.** Bản duyệt tăng **0 USD/tháng**. Ảnh Hạ Long thêm tệp tĩnh 32 và 152 KB. Ảnh Ninh Bình dùng tệp có sẵn. Nút nổi Hỏi Heritage chạy trên trình duyệt, không thêm lượt gọi API hoặc hạ tầng.
