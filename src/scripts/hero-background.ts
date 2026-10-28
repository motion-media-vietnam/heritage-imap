export {};

const VIDEO_ID = 'tSPlSlfo-to';
interface HeroPlayer {
  mute(): void;
  setVolume(value: number): void;
  playVideo(): void;
  pauseVideo(): void;
  destroy(): void;
}
interface PlayerEvent { target: HeroPlayer; data?: number }
interface YouTubeAPI {
  Player: new (frame: HTMLIFrameElement, options: {
    events: {
      onReady(event: PlayerEvent): void;
      onStateChange(event: PlayerEvent): void;
      onError(): void;
      onAutoplayBlocked(): void;
    };
  }) => HeroPlayer;
}
type YouTubeWindow = Window & { YT?: YouTubeAPI; onYouTubeIframeAPIReady?: () => void };
const youtubeWindow = window as YouTubeWindow;
let apiPromise: Promise<YouTubeAPI> | undefined;

/** Only the visible, motion-eligible homepage requests this official script. */
function loadYouTubeAPI(): Promise<YouTubeAPI> {
  if (youtubeWindow.YT?.Player) return Promise.resolve(youtubeWindow.YT);
  if (apiPromise) return apiPromise;
  apiPromise = new Promise((resolve, reject) => {
    const previous = youtubeWindow.onYouTubeIframeAPIReady;
    const timeout = window.setTimeout(() => finish(new Error('YouTube API timeout')), 15000);
    const finish = (error?: Error) => {
      window.clearTimeout(timeout);
      if (youtubeWindow.onYouTubeIframeAPIReady === ready) youtubeWindow.onYouTubeIframeAPIReady = previous;
      if (error) reject(error);
      else if (youtubeWindow.YT?.Player) resolve(youtubeWindow.YT);
      else reject(new Error('YouTube API unavailable'));
    };
    const ready = () => { finish(); previous?.(); };
    youtubeWindow.onYouTubeIframeAPIReady = ready;
    const existing = document.querySelector<HTMLScriptElement>('script[src="https://www.youtube.com/iframe_api"]');
    const script = existing ?? document.createElement('script');
    script.addEventListener('error', () => finish(new Error('YouTube API blocked')), { once: true });
    if (!existing) {
      script.src = 'https://www.youtube.com/iframe_api';
      script.async = true;
      document.head.append(script);
    }
  });
  return apiPromise;
}

function initHeroBackground(hero: HTMLElement, mount: HTMLElement, toggle: HTMLButtonElement) {
  // Older engines keep the poster rather than rendering a non-covering iframe.
  if (typeof CSS === 'undefined' || !CSS.supports('width', '1cqw') || !CSS.supports('height', '1cqh')) return;
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
  let player: HeroPlayer | undefined;
  let inView = false;
  let pageReady = document.readyState === 'complete';
  let pending = false;
  let failed = false;
  let userPaused = false;
  let generation = 0;
  let watchdog: number | undefined;
  let scheduled: number | undefined;

  const wantsPlayback = () => inView && !document.hidden && !motion.matches && !connection?.saveData && !userPaused;
  const showPoster = () => { mount.removeAttribute('data-playing'); };
  function stopPlayer() {
    generation++;
    pending = false;
    window.clearTimeout(watchdog);
    showPoster();
    player?.destroy();
    player = undefined;
    mount.replaceChildren();
    toggle.hidden = true;
  }
  function fallback() {
    failed = true; // No automatic retry loop for blocked/deleted/region-restricted media.
    stopPlayer();
  }
  function playMuted(target: HeroPlayer) {
    // Keep API muting as well as the requested mute URL flag; do not rely
    // on URL handling alone for muted scripted playback.
    target.mute();
    target.setVolume(0);
    target.playVideo();
  }
  async function startPlayer() {
    if (player || pending || failed || !pageReady || !wantsPlayback()) return;
    pending = true;
    const current = ++generation;
    try {
      const api = await loadYouTubeAPI();
      if (current !== generation) return;
      if (!wantsPlayback()) { stopPlayer(); return; }
      const frame = document.createElement('iframe');
      frame.title = 'Video nền Hà Nội';
      frame.tabIndex = -1;
      frame.setAttribute('aria-hidden', 'true');
      frame.setAttribute('allow', 'autoplay; encrypted-media');
      frame.referrerPolicy = 'strict-origin-when-cross-origin';
      const url = new URL(`https://www.youtube-nocookie.com/embed/${VIDEO_ID}`);
      url.search = new URLSearchParams({
        enablejsapi: '1', origin: window.location.origin,
        autoplay: '1', mute: '1', controls: '0', disablekb: '1', playsinline: '1',
        loop: '1', playlist: VIDEO_ID, rel: '0',
      }).toString();
      frame.src = url.href;
      mount.replaceChildren(frame);
      watchdog = window.setTimeout(() => { if (current === generation) fallback(); }, 12000);
      player = new api.Player(frame, { events: {
        onReady(event) {
          if (current !== generation) return;
          pending = false;
          if (wantsPlayback()) playMuted(event.target);
        },
        onStateChange(event) {
          if (current !== generation) return;
          if (!wantsPlayback()) {
            showPoster();
            if (event.data === 1) event.target.pauseVideo();
            return;
          }
          if (event.data === 1) {
            event.target.mute();
            event.target.setVolume(0);
            window.clearTimeout(watchdog);
            mount.dataset.playing = 'true';
            toggle.hidden = false;
          } else if (event.data === 2) {
            showPoster();
          }
          // Let loop + playlist replay in this same player. ENDED/BUFFERING/
          // CUED/UNSTARTED must not toggle opacity after the first PLAYING:
          // that adds a poster flash but cannot remove YouTube's replay UI.
          // Before first playback, the poster remains visible as usual.
        },
        onError() { if (current === generation) fallback(); },
        onAutoplayBlocked() { if (current === generation) fallback(); },
      } });
    } catch {
      if (current === generation) fallback();
    }
  }
  function schedulePlayback() {
    if (scheduled !== undefined || !pageReady || failed || !wantsPlayback()) return;
    // Poster/copy/navigation paint first. No video/API preload or speculative preconnect.
    scheduled = window.setTimeout(() => { scheduled = undefined; void startPlayer(); }, 500);
  }
  function updatePlayback() {
    if (motion.matches || connection?.saveData) { stopPlayer(); return; }
    if (!wantsPlayback()) {
      showPoster();
      player?.pauseVideo();
      if (pending && !player) stopPlayer();
      return;
    }
    if (player && !pending) playMuted(player);
    else schedulePlayback();
  }
  const observer = new IntersectionObserver(entries => {
    inView = entries.some(entry => entry.isIntersecting && entry.intersectionRatio >= .5);
    updatePlayback();
  }, { threshold: [0, .5] });
  observer.observe(hero);
  toggle.addEventListener('click', () => {
    userPaused = !userPaused;
    toggle.dataset.paused = String(userPaused);
    toggle.setAttribute('aria-label', userPaused ? 'Phát video nền' : 'Tạm dừng video nền');
    updatePlayback();
  });
  motion.addEventListener('change', updatePlayback);
  document.addEventListener('visibilitychange', updatePlayback);
  window.addEventListener('load', () => { pageReady = true; schedulePlayback(); }, { once: true });
  window.addEventListener('pagehide', () => {
    window.clearTimeout(scheduled); scheduled = undefined;
    stopPlayer();
  });
  window.addEventListener('pageshow', () => { pageReady = true; updatePlayback(); });
}

const hero = document.querySelector<HTMLElement>('.hero');
const mount = hero?.querySelector<HTMLElement>('[data-hero-video]');
const toggle = hero?.querySelector<HTMLButtonElement>('[data-hero-video-toggle]');
if (hero && mount && toggle) initHeroBackground(hero, mount, toggle);
