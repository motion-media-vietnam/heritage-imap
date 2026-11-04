import type { Localized } from './locale';
import type { destinations } from '../destinations/index';

export const companion = {
  title: ['Hỏi Heritage', 'Ask Heritage'],
  label: ['Bạn đồng hành du lịch', 'Your travel companion'],
  kicker: ['HERITAGE GUIDE · VIỆT NAM', 'HERITAGE GUIDE · VIETNAM'],
  intro: ['BẮT ĐẦU MỘT HÀNH TRÌNH Ở VIỆT NAM', 'START A JOURNEY THROUGH VIETNAM'],
  welcome: ['Chào bạn, mình là Heritage. Bạn muốn tìm một điểm đến, món ngon hay ý tưởng hành trình ở Việt Nam?', 'Hello, I’m Heritage. Looking for a place to visit, something to taste, or an itinerary in Vietnam?'],
  placeholder: ['Hỏi về du lịch Việt Nam…', 'Ask about travel in Vietnam…'],
  questionLabel: ['Câu hỏi của bạn', 'Your question'],
  send: ['Gửi câu hỏi', 'Send question'],
  close: ['Đóng Hỏi Heritage', 'Close Ask Heritage'],
  suggestions: ['Gợi ý để bắt đầu', 'Ideas to get started'],
  conversation: ['Trao đổi với Heritage', 'Conversation with Heritage'],
  capability: ['Du lịch Việt Nam · Gợi ý biên tập và theo kịch bản · Chưa kết nối AI toàn quốc', 'Vietnam travel · Editorial and scripted suggestions · No nationwide AI connection'],
  foot: ['BẢN DUYỆT · Không gọi AI/API · Không lưu hội thoại', 'PREVIEW · No AI/API calls · Chat is not saved'],
  offline: ['Heritage chưa có dữ liệu biên tập cho câu hỏi này. Bạn có thể xem bản đồ hoặc thử một điểm đến trong phần gợi ý.', 'Heritage does not yet have editorial information for this question. Try the map or one of the suggested destinations.'],
  refusal: ['Hình như chúng mình đi hơi xa rồi nhỉ! Heritage chỉ chuyên mách bạn những điều thú vị về du lịch và khám phá Việt Nam thôi. Mình quay lại hành trình nhé?', 'We may have wandered a little far! Heritage focuses on travel and discovery in Vietnam. Shall we get back to the journey?'],
  clarify: ['Bạn đang muốn đi đâu ở Việt Nam? Hãy thử hỏi về một điểm đến, món ăn hay cách lên lịch trình.', 'Where would you like to go in Vietnam? Try asking about a destination, a dish, or how to plan your trip.'],
  liveData: ['Bản duyệt chưa có thông tin thời gian thực. Bạn nên kiểm tra giờ mở cửa, giá vé, thời tiết và lịch phương tiện với nguồn chính thức trước khi đi.', 'This preview has no live information. Check opening hours, ticket prices, weather, and transport schedules with official sources before you go.'],
  transport: ['Hãy chốt điểm đi và điểm đến trước, rồi so sánh tàu, xe và máy bay theo thời gian cả hành trình. Nếu đi nhiều nơi, gom các điểm gần nhau và chừa thời gian cho chặng nối. Kiểm tra lịch và giá trực tiếp với nhà vận chuyển.', 'Start with your origin and destination, then compare train, road and air travel by total journey time. Group nearby stops and allow time for connections. Check schedules and fares with the carrier.'],
  dienBienSeason: ['Nếu muốn ngắm hoa ban, mùa xuân quanh tháng Ba là thời điểm đáng cân nhắc ở Điện Biên. Mùa hoa thay đổi theo thời tiết, nên xem thông báo địa phương trước khi chốt ngày.', 'For ban blossoms in Điện Biên, consider spring around March. Bloom timing varies with the weather, so check local updates before choosing dates.'],
  hanoiCollection: ['Xem tuyển tập Hà Nội', 'Browse the Hanoi selection'],
  exploreMap: ['Xem trên bản đồ', 'See on the map'],
  editorial: ['Gợi ý biên tập', 'Editorial suggestion'],
  scripted: ['Gợi ý theo kịch bản · Hà Nội', 'Scripted suggestion · Hanoi'],
  unavailable: ['Trình duyệt chưa mở được hội thoại. Vui lòng thử lại.', 'The browser could not open the conversation. Please try again.'],
  sent: ['Đã hiện phản hồi của bản duyệt.', 'Preview response displayed.'],
  retry: ['Chưa thể trả lời. Câu hỏi được giữ lại; bạn hãy thử lại.', 'The response could not be displayed. Your question is still here. Please try again.'],
} satisfies Record<string, Localized>;

type Guide = {
  id: keyof typeof destinations;
  question: Localized;
  terms: readonly string[];
  reply: Localized;
};

export const companionPrompts = [
  { id: 'hanoi', question: ['Tôi có 3 ngày ở Hà Nội, nên đi đâu?', 'I have three days in Hanoi. Where should I go?'], terms: ['ha noi', 'hanoi'], reply: ['Bạn có thể chia ba ngày theo nhịp nhẹ. Ngày 1 dạo Hồ Hoàn Kiếm và phố cổ. Ngày 2 dành cho Văn Miếu và Hoàng thành Thăng Long. Ngày 3 đi chậm quanh Hồ Tây. Kiểm tra giờ mở cửa trước khi chốt lịch.', 'Take three unhurried days. Walk around Hoàn Kiếm Lake and the Old Quarter on day one. Visit the Temple of Literature and Imperial Citadel on day two. Spend day three around West Lake. Check opening hours before finalising your plans.'] },
  { id: 'ninh-binh', question: ['Khám phá Ninh Bình theo cách ít người biết?', 'How can I explore a quieter side of Ninh Binh?'], terms: ['ninh binh', 'trang an', 'tam coc', 'van long'], reply: ['Thử dành một buổi cho đầm Vân Long để ngắm núi đá và mặt nước từ thuyền nhỏ. Nếu có thêm thời gian, chọn một chuyến đạp xe quanh Tam Cốc hoặc ghé Hoa Lư để tìm hiểu cố đô.', 'Try a morning on a small boat at Vân Long Wetland Reserve. If you have time, cycle near Tam Cốc or visit Hoa Lư to learn about the former capital.'] },
  { id: 'quang-ninh', question: ['Ở Quảng Ninh có gì ngoài Vịnh Hạ Long?', 'What is there to see in Quang Ninh beyond Ha Long Bay?'], terms: ['quang ninh', 'ha long', 'halong', 'yen tu'], reply: ['Nếu muốn đổi nhịp sau vịnh Hạ Long, dành một buổi khám phá Yên Tử. Những ngôi chùa và dấu tích của Thiền phái Trúc Lâm là điểm khởi đầu để tìm hiểu di sản nơi đây. Kiểm tra điều kiện đường lên trước khi đi.', 'For a change of pace after Hạ Long Bay, spend part of a day exploring Yên Tử. Its pagodas and traces of the Trúc Lâm Zen tradition offer a starting point for understanding the site. Check route conditions before visiting.'] },
  { id: 'ho-chi-minh', question: ['Gợi ý hành trình ẩm thực Sài Gòn.', 'Suggest a food itinerary in Saigon.'], terms: ['sai gon', 'saigon', 'ho chi minh', 'hcmc', 'tphcm'], reply: ['Bắt đầu với bánh mì hoặc hủ tiếu. Đến bữa trưa, thử cơm tấm sườn nướng. Chọn các điểm ăn cùng khu vực để dành thời gian đi bộ và quan sát nhịp phố. Heritage chưa có dữ liệu theo giờ của từng quán.', 'Start with bánh mì or hủ tiếu, then try broken rice with grilled pork for lunch. Keep your stops in one neighbourhood so you have time to walk and enjoy the streets. Heritage does not have live opening hours for individual eateries.'] },
  { id: 'dien-bien', question: ['Khám phá Điện Biên mùa nào đẹp?', 'When is a good time to explore Dien Bien?'], terms: ['dien bien'], reply: ['Nếu muốn tìm hiểu lịch sử Điện Biên Phủ, bắt đầu từ di tích Đồi A1 ở Mường Thanh. Dành thời gian xem các dấu tích tại điểm và kiểm tra thông tin tham quan của địa phương trước khi đi.', 'If you are interested in Điện Biên Phủ’s history, start at A1 Hill in Mường Thanh. Take time to look at the surviving traces of the site and check official visitor information before going.'] },
] as const satisfies readonly Guide[];
