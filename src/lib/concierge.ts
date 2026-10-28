import { places, type Coordinates } from '../data/places.ts';
import { destinationInterests, interests, type Interest } from '../data/concierge.ts';
import { distanceKm } from './explore.ts';

export interface ConciergePreferences {
  query: string;
  area: string;
  time: string;
  mobility: string;
  interests: Interest[];
  requirements: string[];
  origin?: Coordinates;
}
export const normalizeRequest = (value: string) => value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd');
export function recommend(preferences: ConciergePreferences) {
  const query = normalizeRequest(preferences.query.trim());
  const notes: string[] = [];
  const inferred: Interest[] = [];
  const intent: readonly [Interest, RegExp][] = [
    ['food', /an uong|am thuc|quan an|mon an|an chay|ca phe|cafe|pho bo|bun cha/],
    ['culture', /van hoa|di san|lich su|nghin nam|kinh thanh/],
    ['art', /nghe thuat|trien lam|phong tranh/],
    ['shopping', /mua sam|cua hang/], ['relaxation', /thu gian|thu thai|khoang lang|that cham|yen tinh/],
    ['local', /ban dia|nguoi dia phuong|goc pho|dao pho/],
  ];
  for (const [interest, pattern] of intent) if (pattern.test(query)) inferred.push(interest);
  const wanted = [...new Set([...preferences.interests, ...inferred])];
  const strictRequirement = preferences.requirements.length > 0 || /an chay|^chay$|halal|gia dinh|tre em|xe lan|tiep can|khuyet tat/.test(query);
  if (strictRequirement) {
    return { matches: [], notes: ['Danh mục hiện chưa có dữ liệu xác nhận nhu cầu đặc biệt của bạn. Heritage không muốn gợi ý một nơi chưa đủ căn cứ; hãy liên hệ điểm đến để xác nhận hoặc bỏ yêu cầu này để xem gợi ý chung.'] };
  }
  const unsupported = wanted.filter(interest => !places.some(place => destinationInterests[place.slug]?.includes(interest)));
  if (unsupported.length) notes.push(`Chưa có địa điểm đủ dữ liệu cho: ${unsupported.map(id => interests.find(item => item[0] === id)?.[1]).join(', ')}. Nếu có gợi ý khác, những gợi ý đó chỉ đáp ứng các sở thích còn lại, không thay thế nhu cầu này.`);
  const supported = wanted.filter(interest => !unsupported.includes(interest));
  if (wanted.length && !supported.length) return { matches: [], notes };
  if (/gan day|gan toi|gan nhat/.test(query) && !preferences.origin && preferences.area === 'all') {
    return { matches: [], notes: ['Để tìm gần bạn, hãy cho phép dùng vị trí hoặc chọn một khu vực. Heritage không tự suy đoán vị trí của bạn.'] };
  }
  const area = preferences.area !== 'all' ? preferences.area
    : /ho guom|hoan kiem|pho co/.test(query) ? 'Khu vực Hoàn Kiếm' : 'all';
  const named = places.filter(place => [place.name, place.vietnamese].some(name => query.includes(normalizeRequest(name))));
  // Broad verbs alone must not turn unknown requests (e.g. sushi) into false matches.
  const general = /^(?:(?:toi|minh) (?:muon|can) |cho toi )?(?:ha noi|kham pha ha noi|goi y(?: hanh trinh)?(?: ha noi)?|nen di dau|hanh trinh ha noi|(?:tim diem |tim dia diem )?gan (?:day|toi|nhat))[.!?]*$/.test(query);
  if (query && !wanted.length && !named.length && !general && area === 'all') {
    return { matches: [], notes: ['Chưa nhận ra địa điểm hoặc sở thích này trong danh mục nhỏ hiện có. Bạn thử một câu gợi ý, tên địa điểm hoặc chọn sở thích bên trên nhé.'] };
  }
  // A time budget limits the number of suggestions, never asserts travel/visit times.
  const budget = preferences.time || (/2 gio/.test(query) ? '2' : /1 gio/.test(query) ? '1' : '');
  const limit = budget === '1' ? 1 : budget === '2' ? 2 : budget === 'half' ? 3 : 4;
  notes.push('Đây là các điểm để bạn lựa chọn, không phải tuyến đã tính đường. Chưa có thời lượng tham quan được xác nhận; số điểm gợi ý không bảo đảm vừa quỹ thời gian.');
  if (preferences.mobility) notes.push(`Bạn chọn ${preferences.mobility}. Chưa có dữ liệu tuyến phù hợp từng phương tiện; hãy kiểm tra lối vào và điều kiện di chuyển trên iMap.`);
  const matches = places.filter(place => (area === 'all' || place.area === area)
    && (!supported.length || supported.some(interest => destinationInterests[place.slug]?.includes(interest)))
    && (!named.length || wanted.length > 0 || named.some(candidate => candidate.slug === place.slug)))
    .map(place => {
      const fitting = supported.filter(interest => destinationInterests[place.slug]?.includes(interest));
      const distance = preferences.origin ? distanceKm(preferences.origin, place.coordinates) : undefined;
      const reason = fitting.length ? `Hợp với sở thích ${fitting.map(id => interests.find(item => item[0] === id)?.[1].toLowerCase()).join(', ')}: ${place.description}`
        : `${place.area}: ${place.description}`;
      return { place, reason, distance, score: fitting.length + (named.some(candidate => candidate.slug === place.slug) ? 3 : 0) };
    }).sort((a, b) => preferences.origin ? (a.distance! - b.distance!) : b.score - a.score).slice(0, limit);
  if (preferences.origin) notes.push('Khoảng cách là đường chim bay tới tọa độ đại diện gần đúng, không phải quãng đường đi hay vị trí lối vào. Vị trí chỉ dùng trong phiên này, không được lưu hoặc gửi đến dịch vụ gợi ý.');
  return { matches, notes };
}
