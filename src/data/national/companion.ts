import type { Localized } from './locale';
import type { destinations } from '../destinations/index';

export const companion = {
  title: ['Hỏi Heritage', 'Ask Heritage'],
  label: ['Bạn đồng hành du lịch', 'Your travel companion'],
  intro: ['Bạn muốn khám phá Việt Nam theo cách riêng? Hãy để Heritage mách bạn.', 'Want to explore Vietnam your way? Let Heritage show you around.'],
  placeholder: ['Bạn muốn khám phá điều gì ở Việt Nam?', 'What would you like to discover in Vietnam?'],
  followUp: ['Bạn muốn hỏi thêm điều gì?', 'What else would you like to ask?'],
  send: ['Gửi câu hỏi', 'Send question'],
  close: ['Đóng hội thoại', 'Close conversation'],
  suggestions: ['Gợi ý để bắt đầu', 'Ideas to get started'],
  conversation: ['Hội thoại Hỏi Heritage', 'Ask Heritage conversation'],
  you: ['Bạn', 'You'],
  capability: ['Bản duyệt hội thoại · AI toàn quốc chưa kết nối. Một số câu hỏi tiếng Việt về Hà Nội dùng gợi ý theo kịch bản.', 'Conversation preview · Nationwide AI is offline. Selected Hanoi questions in Vietnamese use scripted suggestions.'],
  offline: ['Heritage chưa thể trả lời câu hỏi này trong bản duyệt. Bạn có thể khám phá điểm đến trên bản đồ và tiếp tục thử câu hỏi khác.', 'Heritage cannot answer this question in the preview. Explore the destination on the map or try another question.'],
  hanoiThreeDays: ['Heritage chưa có lịch trình ba ngày để trả lời trong bản duyệt. Bạn có thể bắt đầu từ tuyển tập Hà Nội và chọn các điểm dừng phù hợp.', 'A three-day itinerary is not available in this preview. Browse the Hanoi selection to choose your stops.'],
  hanoiCollection: ['Xem tuyển tập Hà Nội', 'Browse the Hanoi selection'],
  exploreMap: ['Xem trên bản đồ', 'See on the map'],
  scripted: ['Gợi ý theo kịch bản · Hà Nội', 'Scripted suggestion · Hanoi'],
  unavailable: ['Trình duyệt này chưa mở được hội thoại.', 'This browser could not open the conversation.'],
} satisfies Record<string, Localized>;

export const companionPrompts = [
  { id: 'hanoi', question: ['Tôi có 3 ngày ở Hà Nội, nên đi đâu?', 'I have three days in Hanoi. Where should I go?'], terms: ['ha noi', 'hanoi'] },
  { id: 'ninh-binh', question: ['Khám phá Ninh Bình theo cách ít người biết?', 'How can I explore a quieter side of Ninh Binh?'], terms: ['ninh binh', 'trang an', 'tam coc'] },
  { id: 'quang-ninh', question: ['Ở Quảng Ninh có gì ngoài Vịnh Hạ Long?', 'What is there to see in Quang Ninh beyond Ha Long Bay?'], terms: ['quang ninh', 'ha long', 'halong'] },
  { id: 'ho-chi-minh', question: ['Gợi ý hành trình ẩm thực Sài Gòn.', 'Suggest a food itinerary in Saigon.'], terms: ['sai gon', 'saigon', 'ho chi minh', 'hcmc', 'tphcm'] },
  { id: 'dien-bien', question: ['Khám phá Điện Biên mùa nào đẹp?', 'When is a good time to explore Dien Bien?'], terms: ['dien bien'] },
] as const satisfies readonly { id: keyof typeof destinations; question: Localized; terms: readonly string[] }[];
