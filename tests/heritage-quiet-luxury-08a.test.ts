import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const source = (path: string) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
const layout = source('src/layouts/Layout.astro');
const launcher = source('src/components/HeritageLauncher.astro');
const sparkle = source('src/components/HeritageSparkle.astro');

// Source contracts only: rendered contrast, responsive fit and overlap require browser QA.
test('08A: header retains Heritage route/label with an outlined CTA and shared sparkle', () => {
  assert(layout.includes("{ href: '/heritage-mach-ban/', label: 'Heritage mách bạn' }"));
  assert.equal((layout.match(/&& <HeritageSparkle \/>/g) ?? []).length, 2);
  const styles = layout.slice(layout.indexOf('<style>'), layout.indexOf('</style>'));
  assert(styles.includes('border: 1px solid #a58c61'));
  assert(styles.includes('background: transparent'));
  assert(styles.includes('box-shadow: none'));
  assert(styles.includes('.site-header.header-overlay:not(.is-scrolled) .desktop-nav a.heritage-nav-cta'));
  assert(styles.includes('color: #fffaf0'));
  assert(styles.includes('color: #242724'));
  assert(styles.includes('focus-visible'));
  assert(styles.includes('prefers-reduced-motion: reduce'));
  assert(!/background:\s*#(?:a73128|86271f)/i.test(styles));
});

test('08A.1: ivory vertical edge button opens an accessible local drawer, not a link', () => {
  for (const contract of ['Hỏi Heritage nhé', '<HeritageSparkle />', 'position: fixed', 'right: 0', 'top: 50%', 'writing-mode: vertical-rl', 'border-radius: 12px 0 0 12px', 'background: #faf7f0', 'color: #242724', 'min-height: 44px', 'focus-visible', 'prefers-reduced-motion: reduce', 'width: min(410px, 100vw)', 'heritage-enter', 'aria-controls="heritage-drawer"', 'aria-haspopup="dialog"', '<dialog', 'data-heritage-close', 'role="log"']) assert(launcher.includes(contract), contract);
  assert(!/<(?:a|img|iframe)\b|gradient\(/.test(launcher));
  assert(!/background:\s*#(?:a73128|86271f)/i.test(launcher));
  assert(sparkle.includes('aria-hidden="true"'));
  assert(sparkle.includes('focusable="false"'));
});

test('08A.1: drawer reuses the local matcher and discloses the missing AI backend', () => {
  const controller = source('src/scripts/heritage-assistant.ts');
  assert(controller.includes("import { recommend } from '../lib/concierge'"));
  assert(controller.includes('const result = recommend('));
  for (const contract of ["form.addEventListener('submit'", 'form.requestSubmit()', 'send.disabled = true', 'catch {', 'finally {', 'textContent', 'messages.append(turn)']) assert(controller.includes(contract), contract);
  assert(!/fetch\(|innerHTML|setTimeout\(/.test(controller));
  assert(launcher.includes('AI hội thoại chưa được kết nối'));
  assert(launcher.includes('Gợi ý địa điểm tiếp khách đối tác'));
  assert(launcher.includes('Một buổi hẹn hò thật đặc biệt'));
  assert(launcher.includes('Khám phá Hà Nội trong 1 ngày'));
  assert(source('src/pages/heritage-mach-ban.astro').includes('chưa sử dụng AI hội thoại'));
  assert(source('src/scripts/concierge.ts').includes('recommend(preferences)'));
});

test('08A.1: source preserves page state and accounts for controls, header and safe areas', () => {
  const controller = source('src/scripts/heritage-assistant.ts');
  for (const contract of ['drawer.showModal()', 'window.scrollX', 'window.scrollY', 'previous.overflow', 'previous.gutter', "scrollbarGutter = 'stable'", "behavior: 'instant'", 'preventScroll: true', "drawer.addEventListener('close', restorePage)", "event.stopPropagation()", 'window.visualViewport', 'headerBottom()', '.leaflet-control', '.destination-video button', "'open'"]) assert(controller.includes(contract), contract);
  assert(!controller.includes('.destination-video, '));
  assert(!/history\.(?:pushState|replaceState)|location\.(?:href|assign|replace)|(?:openPlace|setView|flyTo|invalidateSize)\(/.test(controller));
  for (const contract of ['safe-area-inset-bottom', 'safe-area-inset-right', '100dvh', 'overflow-y: auto', 'overscroll-behavior: contain', 'flex-shrink: 0', 'width: 100vw']) assert(launcher.includes(contract), contract);
});
