import { test } from 'node:test';
import { hanoi } from '../src/data/destinations/hanoi/config.ts';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const source = (path: string) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
const layout = source('src/layouts/DestinationLayout.astro');
const launcher = source('src/components/HeritageLauncher.astro');
const sparkle = source('src/components/shared/HeritageSparkle.astro');

// Source contracts only: rendered contrast, responsive fit and overlap require browser QA.
test('08A: header retains Heritage route/label with an outlined CTA and shared sparkle', () => {
  assert(hanoi.navigation.some(item => item.path === 'heritage-mach-ban/' && item.label === 'Heritage mách bạn' && 'highlight' in item && item.highlight));
  assert(layout.includes('item.highlight && <HeritageSparkle />'));
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

test('HỎI HERITAGE: responsive edge button opens the existing accessible local drawer', () => {
  for (const contract of ['Hỏi Heritage nhé', 'HỎI HERITAGE', 'position: fixed', 'right: env(safe-area-inset-right, 0px)', 'top: var(--heritage-dock-y, 50%)', 'writing-mode: vertical-rl', 'border-radius: 12px 0 0 12px', 'background: var(--heritage-tab-metal)', '--heritage-compact-size: 44px', 'color: #fff', 'min-height: 44px', 'focus-visible', 'prefers-reduced-motion: reduce', 'width: min(416px, calc(100vw - 32px))', 'heritage-enter', 'aria-controls="heritage-drawer"', 'aria-haspopup="dialog"', '<dialog', 'data-heritage-close', 'role="log"']) assert(launcher.includes(contract), contract);
  assert.match(launcher, /\.heritage-drawer-header \{[^}]*background: #173d38/);
  assert(!/<(?:a|img|iframe)\b/.test(launcher));
  assert(!/background:\s*#(?:a73128|86271f)/i.test(launcher));
  assert(sparkle.includes('aria-hidden="true"'));
  assert(sparkle.includes('focusable="false"'));
});

test('08A.1: drawer uses the scoped free travel scripts and discloses its limits', () => {
  const controller = source('src/scripts/heritage-assistant.ts');
  assert(controller.includes("import { answerHeritage, defaultChips } from '../lib/hoi-heritage'"));
  assert(controller.includes('const result = answerHeritage('));
  for (const contract of ["form.addEventListener('submit'", 'form.requestSubmit()', 'send.disabled = true', 'catch {', 'finally {', 'textContent', 'messages.append(row)']) assert(controller.includes(contract), contract);
  assert(!/fetch\(|innerHTML|setTimeout\(/.test(controller));
  assert(launcher.includes('Không gọi AI/API'));
  assert(launcher.includes('không phải dữ liệu thời gian thực'));
  assert(launcher.includes('data-heritage-prompts'));
  assert(launcher.includes('Không lưu hội thoại'));
  assert(source('src/destinations/hanoi/Concierge.astro').includes('chưa sử dụng AI hội thoại'));
  assert(source('src/scripts/concierge.ts').includes('recommend(preferences)'));
});

test('08A.1: source preserves page state and accounts for controls, header and safe areas', () => {
  const controller = source('src/scripts/heritage-assistant.ts');
  const visibility = source('src/scripts/heritage-chat-visibility.ts');
  for (const contract of ['drawer.showModal()', 'window.scrollX', 'window.scrollY', 'previous.overflow', 'previous.gutter', "scrollbarGutter = 'stable'", "behavior: 'instant'", 'preventScroll: true', "drawer.addEventListener('close', restorePage)", "event.stopPropagation()", 'window.visualViewport', 'headerBottom()', 'focusFallback']) assert(controller.includes(contract), contract);
  for (const contract of ['.leaflet-control', 'video[controls]', 'dialog[open]', 'IntersectionObserver', 'tab.inert = !next', 'drawer.open', 'data-heritage-chat-zone="immersive"']) assert(visibility.includes(contract), contract);
  assert(!/history\.(?:pushState|replaceState)|location\.(?:href|assign|replace)|(?:openPlace|setView|flyTo|invalidateSize)\(/.test(controller + visibility));
  for (const contract of ['safe-area-inset-bottom', 'safe-area-inset-right', '100dvh', 'overflow-y: auto', 'overscroll-behavior: contain', 'flex-shrink: 0', 'width: 100vw']) assert(launcher.includes(contract), contract);
});
