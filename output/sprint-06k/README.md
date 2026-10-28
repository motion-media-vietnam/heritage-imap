# Sprint 06K — cinematic hero / overlay header

October 21, 2026. Homepage hero/header source implemented. **STOP for visual review.** No iMap, video-list, footer, destination, package, CMS, booking, payment or deployment work.

## Files changed in this sprint

- `src/pages/index.astro`: exact headline/subheadline, remove hero eyebrow/decorative bottom copy, retain original poster and `#explore` CTA. Add an initially empty background-media mount and a small accessible pause/resume icon button (hidden until playback). Import the homepage-only controller. Content after the hero is unchanged.
- `src/styles/editorial.css`: homepage overlay header fixed at the top, transparent/white at initial scroll, ivory/dark after scrolling; 250ms color/surface transitions without geometry changes. Full-width approximately 100svh hero on desktop/mobile, natural Lora title wrapping, Be Vietnam Pro subheadline, cover geometry, localized contrast, +5% poster brightness on the existing gamma correction, click-safe layers, responsive sizing and reduced-motion rules. Existing logo treatment preserved.
- `src/layouts/Layout.astro`: only the handler guarded by `.header-overlay` changes state at `scrollY > 24`; no navigation/footer markup changes and no active change to non-overlay page headers.
- `src/scripts/hero-background.ts` (new): official YouTube IFrame API lifecycle and poster fallback.
- `tests/homepage-hero-06k.test.ts` (new): source contracts plus mocked header/API lifecycle regressions, NOT executed.
- `docs/billing.md`: explicit incremental cost/demand estimate, alternatives, provider-policy limitations and validation/PDF status.
- `output/sprint-06k/README.md`: this handoff.

Existing uncommitted work from earlier sprints remains intact. This is workspace source work, not a production deployment.

## Exact copy / media

Headline: **Khám phá Hà Nội của riêng bạn**

Subheadline: **Di sản- văn hiến- sáng tạo, thiết lập hành trình mang đậm phong cách cá nhân**

The CTA stays **Khám phá Hà Nội**, linking to **#explore**. No additional heading, eyebrow or explanatory hero paragraph. The pause control is an icon-only functional action, not a third copy level.

Poster: `/images/mev9zaoqveug1.jpeg`, unchanged source file/attributes/alt text. CSS lifts brightness without generating or replacing the approved asset.

Exact client video: https://www.youtube.com/watch?v=tSPlSlfo-to

## Playback / fallback implementation

- No iframe or external API script is present initially in hero markup. The poster is always underneath the media layer.
- After the page load event plus a short defer, only a visible hero (at least 50%), visible tab, non-reduced-motion and non-data-saver session may request the official API. Unsupported cover-unit engines stay poster-only.
- The embed uses `https://www.youtube-nocookie.com/embed/tSPlSlfo-to`, real `window.location.origin`, `enablejsapi=1`, `controls=0`, `disablekb=1`, `playsinline=1`, `loop=1`, `playlist=tSPlSlfo-to`, `rel=0`.
- **`autoplay=0` is intentional:** onReady calls `mute()`, `setVolume(0)`, then `playVideo()` automatically. This is an autoplay attempt without allowing the URL parameter to race ahead with sound. No unmute action is implemented.
- Reveal the iframe only on API PLAYING. Loading, paused/buffering, blocked and error states show the original poster rather than a black/unstarted/error player.
- API load/start timeouts, `onAutoplayBlocked` and `onError` cleanly remove the failed player; no automatic error retry loop. Late callbacks after reduced-motion/page-hide cancellation are generation-guarded.
- Pause when the hero is offscreen or the tab is hidden; destroy on reduced motion/page hide. A small keyboard-accessible pause/resume action allows decorative motion to be stopped.
- Cover sizing preserves the 16:9 **player rectangle** using container query units and clips overflow, with no iframe border. Source-encoded letterboxing/provider overlays still need actual video inspection; their absence is not guaranteed by CSS.
- The media mount is inert/aria-hidden and pointer-inactive, below the hero copy/CTA. It cannot take focus or intercept the CTA. This requested non-interactive treatment has a provider-policy limitation noted below.
- No download, video rehosting, heavy-media preload, speculative YouTube preconnect, Data API/key, player package or deprecated branding-removal flag.

## Header / art direction

The homepage's fixed header has no flow height above the hero: its existing dimensions are stable in both states, with margin compensation removed for that fixed overlay. At scroll 0 it is transparent with white navigation/search/language/menu summary; the red My Hanoi logo treatment is unchanged. After 24px it gets a light ivory background, dark labels and a subtle border/shadow. The header z-index is above the isolated map section.

The open mobile dropdown retains a light surface with dark links and a contrast-appropriate focus outline; the top menu action inherits the white/dark header state even when open. Other pages do not opt into `.header-overlay` and retain their existing header behavior.

Hero text stays on the existing left grid. Title width/balanced wrapping aims for two desktop lines; no nowrap or forced line-breaking spans. Mobile remains full-bleed behind the header, not the former separate image-plus-ivory-text panel. Padding allows short viewports to grow rather than clipping text/actions. Poster/video layers are behind localized gradients/text shadows, not a uniform opaque black overlay.

## What was actually verified

| Requested check | Evidence | Browser result |
| --- | --- | --- |
| Hero reaches the top behind header | Source uses fixed overlay out of normal flow and 100svh hero; no reserved top band | NOT TESTED |
| Transparent header, white labels at top | Initial CSS state reviewed, including mobile summary/dropdown distinction | NOT TESTED |
| Solid/dark sticky state on scroll | Guarded handler and 250ms state-only CSS reviewed; mock test authored | NOT TESTED |
| Muted autoplay / continuous loop | Exact video ID, mute-before-play ordering, official loop+playlist fields reviewed | NOT TESTED with real YouTube/browser |
| Poster while loading / blocked / reduced motion | Permanent image layer and API/error/motion guards reviewed; mock tests authored | NOT TESTED with real browser/network failure |
| Exact headline/subheadline | Verified in source diff, one h1 and one hero description | Rendered wrapping NOT TESTED |
| No desktop/mobile overlap or clipping | Responsive source/layering reviewed | NOT TESTED |
| CTA clickable | Existing href retained; inert/pointer-inactive iframe below CTA in source | NOT TESTED by clicking |
| Rest of homepage unchanged | Source diffs and protected-file SHA-256 comparison below | Live interaction/layout NOT TESTED |

No tests, build, browser rendering, YouTube playback, scroll simulation in a live browser or PDF generation was run under instance policy. The mocked regressions are authored test code, not executed evidence. Automatic per-file diagnostics are not a comprehensive runtime/visual pass.

## Preservation evidence

A before/after source diff of `index.astro` shows changes only inside the hero plus its new script import. A before/after diff of `Layout.astro` shows only the homepage header-state handler change; header navigation and footer markup are untouched. Temporary before snapshots were retained at `/tmp/mm-guide-06k-{index,layout,editorial}-before.*` for this session, not a permanent rollback artifact.

Matching pre/post hashes:

```text
25048eac768c284996c7564ad534aae77e07935134d85127b5751b3d2e81706e  src/components/imap/PrototypeExplorer.astro
eea16bd86948710556b44696de0dfa5d5c890a19e2872cffb715d546d9e6fbad  src/styles/imap-prototype.css
3404eb4e7c2400e95b6f7a3f645f99f9376e954f8d345332692d02c88d24bf06  src/scripts/imap-prototype.ts
87314150f70862d86058a81456257b3b254ff2f38ef7a3359a75c4b04a425a24  src/data/imap-featured.ts
fc41b82097f113d1349d4f3020673caa967bc102523ab37341c27cba5a16319e  src/data/imap-prototype.ts
327738edfa25faa996a7b515f398997a072018e860c13fbbdfeb0abda45d14ee  src/components/HeritageChoice.astro
af3cbacc46ee06acdcc98076494a867236eb1ff28a6c6fb1e33cbc11d30b67b8  src/components/HeritageVideo.astro
e95a1300ee6785ae0bc26d9fe2346173d3673b714879ddb3c2e4faa98986ad80  src/components/DestinationPortrait.astro
```

## Preview status / next action

Target: **https://code.arvigeus.one/workspaces/mm-guide/preview**

Current bounded HTTP probe: **HTTPS 303 → `/login`**. This confirms the workspace endpoint responds, not that its signed-in app has been rendered. Do not confuse it with the previously unavailable standalone preview hostname.

The existing Astro service was listening on IPv6 loopback 4321 at initial inspection. No new server, forced SSR/app reload, restart, reverse-proxy/TLS modification or production deployment was performed. Last memory check: **2,644,553,728 / 2,684,354,560 bytes**, about **38 MiB free**. Further application-render requests were deferred rather than risking responsiveness. Source is saved for the existing Astro/Vite preview path; successful authenticated refresh is NOT claimed.

**User action:** once adequate memory headroom is restored, open the target while signed in and reload the existing preview frame. No second dev server is needed. If the running preview actually needs restarting, first obtain explicit approval for that single potentially disruptive action; do not alter TLS/proxy settings. No credentials were accessed or login bypass attempted.

## YouTube/provider limitations before wider release

Primary sources checked October 21, 2026:

- https://developers.google.com/youtube/iframe_api_reference
- https://developers.google.com/youtube/player_parameters
- https://developers.google.com/youtube/terms/developer-policies

Documented controls/loop/API playback options do not guarantee autoplay, availability, ad-free output or absence of YouTube branding/provider overlays. Rights-holder embedding settings, region restrictions, browser policy and the workspace's iframe permissions may prevent playback; poster fallback is intentional.

**Important policy fit:** developer policies restrict obscuring attribution and disabling player links. A cover-cropped, copy-overlaid, non-interactive decorative player must not be represented as commercially cleared just because the API supports controls=0. Resolve the requested treatment's compatibility with those requirements before wider/public production use. No ad blocking or brand-stripping workaround was added. Poster-only is the existing safer/simpler fallback; a separately licensed original suitable for a background-video service would require a future approved media/hosting decision, not downloading this YouTube clip.

Privacy-enhanced hosting is not anonymous playback: automated playback still shares data with Google/YouTube. Applicable privacy/consent and media rights remain a business review item; this sprint did not silently redesign the footer or add a consent system.

## Exact capable-machine checks (NOT run here)

Use the repository's configured toolchain. In a container review current manager files/trust/status; do not install missing tools on this constrained instance without approval. No local mise/Pixi config was present in the earlier environment inspection. The wrapper examples below are for an already provisioned capable environment:

```sh
mise trust --show
mise current
NODE_OPTIONS=--max-old-space-size=256 UV_THREADPOOL_SIZE=1 RAYON_NUM_THREADS=1 \
  mise exec -- node --experimental-strip-types --test --test-concurrency=1 \
  tests/homepage-hero-06k.test.ts tests/imap-workspace-preview.test.ts
mise exec -- npm run build
mise exec -- uv run --with reportlab python scripts/build-billing-brief.py
pdftoppm -png -r 100 output/pdf/ha-long-billing-brief.pdf /tmp/ha-long-billing-brief
```

The shareable billing PDF remains stale; inspect every regenerated page before sharing. No tests/build/installs/PDF generation on this instance are authorized by these handoff commands.

Visual matrix after authenticated refresh: desktop 1440/1024px, mobile 390/360/320px and short landscape. At y=0 confirm no top band and white navigation; at y>24 confirm dark/ivory header with stable geometry. Check open mobile menu/focus, exact copy/natural wrapping, CTA clicks and pause/resume. Verify the exact video plays muted and loops where permitted; then test reduced motion before load and while playing, data saver, blocked API/embed, error and slow loading, background tab, scrolling out/back, and network loss. Poster must remain clean, with no exposed error player/borders. Inspect actual crop/letterboxing/branding rather than assuming CSS removes it. Finally confirm unchanged iMap, existing video listing and footer remain usable below the hero.

STOP for visual review. No additional refinements or promotion in this sprint.
