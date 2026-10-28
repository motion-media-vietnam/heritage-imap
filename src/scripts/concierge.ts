import { recommend, type ConciergePreferences } from '../lib/concierge';
import type { Interest } from '../data/concierge';
import type { Coordinates } from '../data/places';

const form = document.querySelector<HTMLFormElement>('#concierge-form');
const panel = document.querySelector<HTMLElement>('#concierge-results');
if (form && panel) {
  const request = form.querySelector<HTMLTextAreaElement>('[name="query"]')!;
  const output = panel.querySelector<HTMLElement>('[data-concierge-results]')!;
  const summary = panel.querySelector<HTMLElement>('[data-concierge-summary]')!;
  const locationStatus = form.querySelector<HTMLElement>('[data-concierge-location-status]')!;
  const locate = form.querySelector<HTMLButtonElement>('[data-concierge-locate]')!;
  const forget = form.querySelector<HTMLButtonElement>('[data-concierge-forget]')!;
  let origin: Coordinates | undefined;
  let locationGeneration = 0;
  const scrollTo = (element: HTMLElement) => element.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'start' });
  function showRecommendations() {
    if (!form || !panel) return;
    const data = new FormData(form);
    const preferences: ConciergePreferences = {
      query: request.value, area: String(data.get('area')), time: String(data.get('time')),
      mobility: String(data.get('mobility')), interests: data.getAll('interest') as Interest[],
      requirements: data.getAll('requirement').map(String), origin,
    };
    const result = recommend(preferences);
    output.replaceChildren();
    const notes = panel.querySelector<HTMLElement>('[data-concierge-notes]')!;
    notes.replaceChildren(...result.notes.map(note => {
      const item = document.createElement('li'); item.textContent = note; return item;
    }));
    for (const match of result.matches) {
      // Templates are keyed by canonical catalog identity; no user-supplied HTML.
      const template = Array.from(panel.querySelectorAll<HTMLTemplateElement>('template[data-concierge-card]')).find(template => template.dataset.conciergeCard === match.place.slug);
      if (!template) continue;
      const card = template.content.cloneNode(true) as DocumentFragment;
      card.querySelector<HTMLElement>('[data-concierge-reason]')!.textContent = match.reason;
      const distance = card.querySelector<HTMLElement>('[data-concierge-distance]')!;
      if (match.distance !== undefined) {
        distance.textContent = `Khoảng ${match.distance.toLocaleString('vi-VN', { maximumFractionDigits: 1 })} km đường chim bay từ vị trí bạn cho phép dùng.`;
        distance.hidden = false;
      }
      output.append(card);
    }
    panel.hidden = false;
    panel.querySelector<HTMLElement>('[data-concierge-introduction]')!.textContent = request.value.trim()
      ? `Với mong muốn “${request.value.trim()}”, Heritage đã đối chiếu những địa điểm đang có. Mình cùng xem điều gì phù hợp nhé.`
      : 'Từ những lựa chọn bạn chia sẻ, đây là vài điểm để bắt đầu. Bạn có thể chọn ít hơn để dành thời gian cảm nhận.';
    summary.textContent = result.matches.length ? `${result.matches.length} điểm gợi ý từ danh mục hiện có.` : 'Chưa tìm thấy địa điểm phù hợp trong danh mục hiện có.';
    panel.querySelector<HTMLElement>('[data-concierge-empty]')!.hidden = result.matches.length > 0;
    panel.querySelector<HTMLElement>('#concierge-results-title')!.focus({ preventScroll: true });
    scrollTo(panel);
  }
  form.addEventListener('submit', event => { event.preventDefault(); showRecommendations(); });
  form.querySelectorAll<HTMLButtonElement>('[data-concierge-prompt]').forEach(button => button.addEventListener('click', () => {
    request.value = button.dataset.conciergePrompt!;
    showRecommendations();
  }));
  document.querySelector('[data-concierge-start]')?.addEventListener('click', event => {
    event.preventDefault(); request.focus({ preventScroll: true }); scrollTo(document.querySelector<HTMLElement>('#hoi-heritage')!);
  });
  const clearLocation = () => {
    locationGeneration++; origin = undefined; forget.hidden = true; locate.disabled = false;
    locationStatus.textContent = 'Không dùng vị trí cá nhân. Bạn có thể chọn khu vực thủ công.';
  };
  forget.addEventListener('click', clearLocation);
  form.querySelector<HTMLSelectElement>('[name="area"]')!.addEventListener('change', clearLocation);
  locate.addEventListener('click', () => {
    if (!navigator.geolocation) { locationStatus.textContent = 'Trình duyệt chưa hỗ trợ vị trí. Bạn hãy chọn khu vực thủ công.'; return; }
    const generation = ++locationGeneration;
    locate.disabled = true; locationStatus.textContent = 'Đang chờ bạn cho phép dùng vị trí…';
    navigator.geolocation.getCurrentPosition(position => {
      if (generation !== locationGeneration) return;
      origin = { lat: position.coords.latitude, lng: position.coords.longitude };
      locate.disabled = false; forget.hidden = false;
      form.querySelector<HTMLSelectElement>('[name="area"]')!.value = 'all';
      locationStatus.textContent = 'Đã nhận vị trí gần đúng. Gợi ý được xếp theo khoảng cách đường chim bay, không giới hạn bán kính. Vị trí không được lưu.';
    }, () => {
      if (generation !== locationGeneration) return;
      locate.disabled = false;
      locationStatus.textContent = 'Chưa lấy được vị trí hoặc bạn chưa cho phép. Lựa chọn hiện tại được giữ nguyên; bạn có thể chọn khu vực thủ công.';
    }, { enableHighAccuracy: false, timeout: 10000, maximumAge: 60000 });
  });
  panel.querySelector('[data-concierge-broaden]')!.addEventListener('click', () => {
    form.reset(); clearLocation(); showRecommendations();
  });
  window.addEventListener('pagehide', clearLocation);
}
