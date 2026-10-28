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
