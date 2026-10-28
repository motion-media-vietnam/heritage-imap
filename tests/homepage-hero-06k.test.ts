import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import ts from 'typescript';

const read = (path: string) => readFileSync(new URL(path, import.meta.url), 'utf8');
const main = read('../src/pages/index.astro');
const layout = read('../src/layouts/Layout.astro');
const css = read('../src/styles/editorial.css');
const script = read('../src/scripts/hero-background.ts');
const hero = main.slice(main.indexOf('<section class="hero"'), main.indexOf('</section>') + 10);

test('hero has the exact two copy levels, approved Hồ Tây poster and unchanged discovery CTA', () => {
  assert(hero.includes('<h1 id="hero-heading">Khám phá Hà Nội<br class="hero-headline-break" /> của riêng bạn</h1>'));
  assert(hero.includes('<p class="hero-description">Di sản – Văn hiến – Sáng tạo.<br />Thiết lập hành trình mang đậm phong cách cá nhân.</p>'));
  assert(css.includes('font-size: clamp(36px, 4.2vw, 60px)'));
  assert(css.includes('max-width: 680px;'));
  assert(css.includes('font-size: clamp(42px, 4.4vw, 48px)'));
  assert(css.includes('font-size: clamp(32px, 8.8vw, 38px)'));
  assert(css.includes('.hero .hero-headline-break { display: none; }'));
  assert(!hero.includes('eyebrow') && !hero.includes('hero-bottom'));
  assert.equal(hero.match(/<p\b/g)?.length, 1);
  assert(hero.includes('src="/images/Ho%20tay%20binh%20minh%20tren%20cao.jpg"'));
  assert(hero.includes('class="button hero-button" href="#explore">Khám phá ngay cùng iMap'));
  assert(!hero.includes('<iframe'), 'no speculative YouTube player before motion/visibility checks');
  assert(hero.includes('aria-hidden="true" inert'));
  assert(hero.includes('data-hero-video-toggle'));
});

test('overlay/header geometry and background cover rules do not depend on a scrolled layout change', () => {
  assert(css.includes('position: fixed;\n  inset: 0 0 auto;\n  z-index: 2000;'));
  assert(css.includes('margin-bottom: 0;'));
  assert(css.includes('background-color .25s ease'));
  assert(css.includes('.site-header.header-overlay:not(.is-scrolled) { color: #FFFFFF; background: transparent;'));
  assert(css.includes('.site-header.header-overlay.is-scrolled { color: var(--deep-ink); background: var(--homepage-header-surface);'));
  assert(css.includes('min-height: 100svh;'));
  assert(css.includes('width: max(100cqw, 177.778cqh)'));
  assert(css.includes('height: max(100cqh, 56.25cqw)'));
  assert(css.includes('pointer-events: none;'));
  assert(css.includes('brightness(1.05)'));
  assert(!css.includes('text-wrap: nowrap'));
  assert(css.includes('white-space: normal;'));
  assert(css.includes('.hero .hero-video { display: none; }'));
});

test('homepage header state changes at scroll without measuring/resizing hero or touching navigation', () => {
  const body = layout.split('<script>')[1]!.split('</script>')[0]!;
  const source = ts.transpileModule(body, { compilerOptions: { target: ts.ScriptTarget.ES2022 } }).outputText;
  const events = new Map<string, () => void>();
  let solid = false;
  const header = { classList: { toggle(name: string, value: boolean) { assert.equal(name, 'is-scrolled'); solid = value; } } };
  const window = { scrollY: 0, addEventListener: (event: string, fn: () => void) => events.set(event, fn) };
  runInNewContext(source, { window, document: {
    querySelector: (selector: string) => selector === '.header-overlay' ? header : null,
    addEventListener() {},
  } }, { timeout: 1000 });
  assert.equal(solid, false);
  window.scrollY = 25; events.get('scroll')!(); assert.equal(solid, true);
  window.scrollY = 0; events.get('pageshow')!(); assert.equal(solid, false);
});

type Events = { onReady(event: unknown): void; onStateChange(event: unknown): void; onError(): void; onAutoplayBlocked(): void };
function backgroundHarness(reduced = false, saveData = false) {
  const ast = ts.createSourceFile('hero.ts', script, ts.ScriptTarget.Latest, true);
  const init = ast.statements.find(node => ts.isFunctionDeclaration(node) && node.name?.text === 'initHeroBackground');
  assert(init);
  const source = ts.transpileModule(`${init.getText(ast)}\ninitHeroBackground(hero, mount, toggle);`, {
    compilerOptions: { target: ts.ScriptTarget.ES2022 },
  }).outputText;
  const timers = new Map<number, { fn: () => void; ms: number }>();
  let nextTimer = 0; let apiLoads = 0; let playerCreates = 0; let replacements = 0; let playerEvents: Events | undefined;
  let observed: ((entries: Array<{ isIntersecting: boolean; intersectionRatio: number }>) => void) | undefined;
  let motionChange: (() => void) | undefined;
  let click: (() => void) | undefined;
  let frames: Array<{ src: string }> = [];
  const calls: string[] = [];
  const motion = { matches: reduced, addEventListener(_name: string, fn: () => void) { motionChange = fn; } };
  const mount = { dataset: {} as Record<string, string>,
    removeAttribute(name: string) { if (name === 'data-playing') delete mount.dataset.playing; },
    replaceChildren(...next: Array<{ src: string }>) { replacements++; frames = next; },
  };
  const toggle = { hidden: true, dataset: {} as Record<string, string>, setAttribute() {},
    addEventListener(_event: string, fn: () => void) { click = fn; },
  };
  class Player {
    constructor(_frame: unknown, options: { events: Events }) { playerCreates++; playerEvents = options.events; }
    mute() { calls.push('mute'); }
    setVolume(value: number) { calls.push(`volume:${value}`); }
    playVideo() { calls.push('play'); }
    pauseVideo() { calls.push('pause'); }
    destroy() { calls.push('destroy'); }
  }
  const player = { mute: () => calls.push('mute'), setVolume: (value: number) => calls.push(`volume:${value}`),
    playVideo: () => calls.push('play'), pauseVideo: () => calls.push('pause') };
  const context = {
    hero: {}, mount, toggle, VIDEO_ID: 'tSPlSlfo-to', URL, URLSearchParams,
    CSS: { supports: () => true }, navigator: { connection: { saveData } },
    loadYouTubeAPI() { apiLoads++; return Promise.resolve({ Player }); },
    window: { location: { origin: 'https://preview.example.test' }, matchMedia: () => motion,
      setTimeout(fn: () => void, ms: number) { const id = ++nextTimer; timers.set(id, { fn, ms }); return id; },
      clearTimeout(id?: number) { if (id !== undefined) timers.delete(id); }, addEventListener() {},
    },
    document: { readyState: 'complete', hidden: false, addEventListener() {},
      createElement: () => ({ src: '', setAttribute() {} }),
    },
    IntersectionObserver: class {
      constructor(fn: typeof observed) { observed = fn; }
      observe() { observed!([{ isIntersecting: true, intersectionRatio: 1 }]); }
    },
  };
  runInNewContext(source, context, { timeout: 1000 });
  return { mount, toggle, calls, motion,
    apiLoads: () => apiLoads, frames: () => frames, player,
    playerCreates: () => playerCreates, replacements: () => replacements,
    events: () => { assert(playerEvents); return playerEvents; },
    async start() {
      const task = [...timers.entries()].find(([, timer]) => timer.ms === 500);
      if (task) { timers.delete(task[0]); task[1].fn(); }
      await Promise.resolve(); await Promise.resolve();
    },
    changeMotion(value: boolean) { motion.matches = value; motionChange!(); },
    visible(value: boolean) { observed!([{ isIntersecting: value, intersectionRatio: value ? 1 : 0 }]); },
    click() { click!(); },
  };
}

test('reduced motion and data saver make no player/API request', async () => {
  for (const [reduced, saveData] of [[true, false], [false, true]]) {
    const h = backgroundHarness(reduced, saveData);
    await h.start();
    assert.equal(h.apiLoads(), 0); assert.equal(h.frames().length, 0);
    assert.equal(h.toggle.hidden, true);
  }
});

test('background requests muted autoplay, also mutes via API, and first reveals only on PLAYING', async () => {
  const h = backgroundHarness(); await h.start();
  assert.equal(h.apiLoads(), 1);
  const url = new URL(h.frames()[0]!.src);
  assert.equal(url.origin, 'https://www.youtube-nocookie.com');
  assert.equal(url.pathname, '/embed/tSPlSlfo-to');
  for (const [key, value] of Object.entries({ autoplay: '1', mute: '1', controls: '0', loop: '1', playlist: 'tSPlSlfo-to', playsinline: '1' })) assert.equal(url.searchParams.get(key), value);
  assert.equal(url.searchParams.has('showinfo'), false);
  assert.equal(url.searchParams.has('modestbranding'), false);
  assert.equal(h.mount.dataset.playing, undefined);
  for (const data of [-1, 5, 3]) h.events().onStateChange({ target: h.player, data });
  assert.equal(h.mount.dataset.playing, undefined, 'startup transitions must retain the poster');
  h.events().onReady({ target: h.player });
  assert.deepEqual(h.calls.slice(0, 3), ['mute', 'volume:0', 'play']);
  h.events().onStateChange({ target: h.player, data: 1 });
  assert.equal(h.mount.dataset.playing, 'true');
  assert.equal(h.toggle.hidden, false);
  h.click(); assert(h.calls.includes('pause')); assert.equal(h.mount.dataset.playing, undefined);
});

test('three simulated replay cycles reuse one player without poster flashes, seeks or scripted restarts', async () => {
  // Event simulation only: not a rendered desktop/mobile branding acceptance test.
  const h = backgroundHarness(); await h.start();
  h.events().onReady({ target: h.player });
  h.events().onStateChange({ target: h.player, data: 1 });
  const frame = h.frames()[0];
  const playCalls = h.calls.filter(call => call === 'play').length;
  for (let loop = 0; loop < 3; loop++) {
    for (const data of [0, -1, 5, 3, 1]) {
      h.events().onStateChange({ target: h.player, data });
      assert.equal(h.mount.dataset.playing, 'true');
      assert.equal(h.frames()[0], frame);
      assert.equal(h.frames().length, 1);
    }
  }
  assert.equal(h.playerCreates(), 1); assert.equal(h.replacements(), 1);
  assert.equal(h.apiLoads(), 1);
  assert.equal(h.calls.filter(call => call === 'play').length, playCalls);
  assert(!h.calls.includes('destroy'));
  h.click();
  for (const data of [0, 3, 1]) h.events().onStateChange({ target: h.player, data });
  assert.equal(h.mount.dataset.playing, undefined, 'late replay events must not override pause');
});

test('blocked/error media cleanly reverts to poster, while offscreen/reduced motion stops background work', async () => {
  for (const event of ['onAutoplayBlocked', 'onError'] as const) {
    const h = backgroundHarness(); await h.start();
    h.events()[event]();
    assert.equal(h.frames().length, 0); assert.equal(h.toggle.hidden, true);
    assert.equal(h.mount.dataset.playing, undefined); assert(h.calls.includes('destroy'));
  }
  const h = backgroundHarness(); await h.start(); h.events().onReady({ target: h.player });
  h.visible(false); assert(h.calls.includes('pause'));
  h.changeMotion(true); assert(h.calls.includes('destroy')); assert.equal(h.frames().length, 0);
});
