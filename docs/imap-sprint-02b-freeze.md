# Sprint 02B iMap — approved design and integration boundary

**Status: APPROVED AND LOCKED by the owner, October 19, 2026.**

The current desktop and mobile `/imap-prototype/` designs are approved. Preserve the implemented UX and visual architecture; do not redesign or silently simplify them. No homepage integration is authorized by this approval/checkpoint task. Future integration needs a separately authorized implementation step and must preserve the approved appearance and behavior. Any demonstrated integration repair must be minimal, evidence-based and regression-tested, not used as permission for a redesign.

The homepage and the separately frozen Heritage Guide's Choice remain unchanged. Existing verified video metadata, destination data and working OSM referrer configuration must be preserved.

## 1. Authoritative checkpoint

- Archive: `output/sprint-02b/design-freeze/approved-state.tar.gz`.
- Archive checksum: `output/sprint-02b/design-freeze/approved-state.tar.gz.sha256`.
- Approved prototype hashes: `output/sprint-02b/design-freeze/approved-prototype.sha256`.
- Complete source/assets/tests/configuration/document hashes: `output/sprint-02b/design-freeze/approved-files.sha256`.
- Underlying Git revision: `f28849f160a8cacfb0efd273ce3d797dbf17dcd6`; the archive, not that revision alone, contains the approved dirty/untracked working state.

The archive contains current source, tests, public assets, locked package/configuration files and canonical documents. It excludes dependencies, caches, running processes and generated builds. Extract into a separate directory for comparison/recovery; never reset to the underlying commit or blindly overwrite future authorized work. Shared file hashes are review baselines, not permission to change the frozen Heritage or homepage during this task.

This is a recoverable source/asset checkpoint, not a hermetic snapshot of remote Google Fonts, OSM tiles, browser behavior or a production deployment. No browser screenshots were produced here; visual approval is the owner's explicit confirmation.

## 2. Approved desktop layout

- Standalone route, no homepage integration. Content maximum width **1600px**; main horizontal padding `clamp(24px, 3.3vw, 48px)` and 28px vertical padding.
- Search plus compact experience/district controls above the explorer. District choices are populated historical areas, not a long thirty-district discovery list. Empty options are hidden except an explicitly selected empty filter, which remains understandable/resettable.
- With a story open: **22% directory / 45% map / 33% story**. With it closed: **22% directory / 78% map**.
- Explorer height `clamp(640px, 74svh, 860px)`. Directory and story content scroll independently. Desktop story toolbar remains as implemented.
- Main mobile breakpoint **960px**. The 961–1150px range only tightens existing inner panel padding/gaps; do not replace the three-area architecture there.

## 3. Approved mobile/responsive behavior

- Map is the primary viewport, with search and two compact filters above it. No directory is placed beneath the map in page flow.
- Standalone mobile header is 56px; main height is `calc(100svh - 56px)`. Explorer flexes into remaining space with a 280px minimum. Mobile tools use 20px side padding.
- One non-modal overlay sheet contains discovery or selected-story content. It stays within the map viewport, not fixed over unrelated page sections.
- Three states, relative to available map height: collapsed = `min(112px, 32%)`, half = 50%, expanded = 90%. Buttons and drag-to-nearest-snap behavior remain. “Bản đồ” collapses the sheet without changing selection/camera.
- Marker/directory selection measures title/frame/control space: use half if it fits, otherwise the existing expanded state. Do not crop video or invent another layout to force it into half height.
- Only one visible large serif destination title on mobile. The compact sticky label is visually hidden but remains accessible; close action sits beside the handle controls.
- Height/bottom-offset transitions: **180ms ease**; direct tracking while dragging; reduced-motion disables animation. Attribution remains above the sheet. Extra map status/toolbar overlays are hidden in expanded mode, but OSM attribution is not hidden.

## 4. Marker selection, filtering and camera contract

- One selected place slug synchronizes directory state, live marker styling/pressed state and story content. Nearby buttons respect active filters.
- Closing or collapsing retains the chosen destination and map center/zoom. Reopening restores its story. Only explicit “Toàn cảnh” resets bounds; selection/filtering must not silently recenter.
- If filters exclude the selected place, its story closes and selection clears, as currently implemented.
- Container resizing uses `invalidateSize({ pan: false })` plus restoration of geographic center/zoom. Mobile sheet motion does not resize/recreate the map.
- Preserve button/marker keyboard paths, skip navigation, focus restoration, Escape behavior and native-fullscreen Escape handling.
- Data remains the existing six approximate destination coordinates, original district grouping and straight-line nearby distances. No routing/geocoding API or live location tracking is added by this freeze.

## 5. Video presentation contract

- Original Vietnam Airlines inflight horizontal HD format, **16:9**, typically 1920×1080. Full frame on desktop/mobile with `object-fit: contain`; no cover crop, stretching, portrait conversion or altered source assets.
- Destination title precedes the media frame. Practical information remains scrollable below. Preserve the conditional native controls/inline/fullscreen-ready file player, no autoplay and `preload="none"`.
- Browser-native fullscreen/orientation support is conditional on the actual browser/provider/codec. Do not promise forced landscape rotation.
- `dedicatedVideos` is **currently empty**. Keep honest per-destination placeholders until original approved file URLs are supplied. Do not substitute shared Hanoi-overview or Heritage videos, infer URLs, or imply that placeholder artwork is playable.

## 6. Typography and visual tokens

| Token / treatment | Approved value |
| --- | --- |
| Editorial display | Lora, Georgia, serif; normal 400-weight hierarchy |
| Body/UI | Be Vietnam Pro, Arial, sans-serif |
| Warm-white surface | `--prototype-paper: #F8F7F3` |
| Ink | `--prototype-ink: #242724` |
| Moss | `--prototype-moss: #687367` |
| Restrained accent | `--prototype-red: #A63832` |
| Old gold | `--prototype-gold: #B59670` |
| Fine rule | `--prototype-line: #24272424` |
| Main/story canvas | `#FFFFFF` |
| Map loading canvas | `#e3e7e0` |
| Intro headline | Lora 400, `clamp(28px, 3vw, 40px)`, line-height 1.3 |
| Story headline | Lora 400, desktop `clamp(26px, 2.2vw, 34px)`; mobile 30px |
| Directory headline | Lora 400, desktop 24px; mobile 22px |
| Story body | 15px, line-height 1.8 |
| Kicker | 9px, weight 500, .12em tracking |
| Primary control tap height | 44px minimum |
| Numbered map markers | 42px, ink fill; vermilion selection |

Full CSS in the archive is authoritative for exact spacing, border, secondary type and responsive values. Keep the restrained editorial direction; do not add generic card shadows, new type systems or decorative redesigns.

## 7. Presentation mode and map provider

`/imap-prototype/?presentation=1` hides three marked development labels/notices, the local Astro dev toolbar and the prototype browser-title suffix. Factual coordinate/verification notices, honest media placeholders and legal OSM attribution remain. Development view remains available without the query flag.

Preserve Leaflet, the existing OSM tile URL `https://tile.openstreetmap.org/{z}/{x}/{y}.png`, max zoom 19, copyright attribution and `referrerPolicy: 'strict-origin-when-cross-origin'`. No proxy, identity spoofing, cache bypass, bulk tile downloads or aggressive retries. Prototype English and homepage Vietnamese attribution both retain the OSM copyright link; do not introduce a provider change to reconcile wording.

The user verified the Sprint 02A Windows desktop preview fix, not every production domain/device. A later prototype outage was reproduced as HTTP 504 `Outdated Optimize Dep` for local Leaflet JavaScript and repaired by stopping the dev server, building, then restarting. Preserve the served-module regression so successful HTML alone cannot hide this failure.

## 8. Acceptance status — do not overclaim

| Check | Status |
| --- | --- |
| Current desktop/mobile design and UX architecture | **Owner approved** |
| Latest preceding production build | Passed: 8 pages |
| Latest preceding automated regressions | Passed: 27 tests, no skips |
| Protected homepage/Heritage/production-map/data checksums | Matched during checkpoint recording |
| Browser touch drag, snap, gesture conflict and safe-area handling | **Pending acceptance** |
| Real destination-video playback, codec, audio, no-autoplay and fullscreen/rotation/exit | **Pending acceptance; sources not configured** |
| Production-domain tile/referrer/CSP behavior and broad cross-device map testing | **Pending acceptance** |
| Homepage integration and its regression acceptance | **Not implemented / not authorized yet** |

No build/tests or browser checks were rerun to record this documentation-only freeze. Prior reports remain historical; this owner approval supersedes their “not visually approved” status for the current layout/design, not their uncompleted behavioral/video acceptance checks.

## 9. Short homepage integration plan — proposed, not implemented

1. **Extract and scope, without redesign.** Create an embeddable explorer from the approved route. Do not copy its standalone header, intro, root/body/main resets or presentation initializer into the homepage. Scope tokens/selectors to the explorer wrapper and match the approved computed appearance. Reuse already-loaded fonts/Leaflet CSS.
2. **Connect one state/controller.** Replace only the old map/discovery instance and reconcile the prototype controls with existing homepage search, category, 10km radius, browser location and destination-result cards. Preserve public anchors `#explore`, `#search`, `#experiences`, `#results-heading` or provide equivalent compatibility targets. Avoid duplicate controls and stale non-null DOM references in the legacy `explore.ts` controller.
3. **Preserve lifecycle and content boundaries.** Initialize one Leaflet map, retain approved provider/referrer/caching/attribution, synchronize cards/directory/markers, and clean up safely on navigation. Never reuse the Heritage player contract. Retire the old shared overview only in the replaced map story, retaining destination-specific placeholders until originals are supplied. Reconcile the existing outage fallback/retry and location messaging explicitly rather than silently dropping functionality.
4. **Adapt the container, not the approved architecture.** The standalone mobile calculation subtracts 56px, whereas the actual homepage header is 84px or 72px at its breakpoint. Derive available explorer height from the real homepage header/tool region and keep the sheet contained in that map; never overlay Heritage/nav/footer. Preserve 22/45/33 areas, three snap states, title/frame order and camera across resize.
5. **Regression and controlled release.** Keep the prototype/checkpoint as the comparison/rollback reference. Extend tests for embedded initialization, one shared filter state, existing cards/location/radius/anchors, camera/selection, fallback, module availability and Heritage isolation. Perform real browser/touch/video checks below. Review paired desktop/mobile screenshots, then obtain integration acceptance before replacing the live homepage instance. Roll back only the integration diff if acceptance fails.

### Dependencies, risks and gates

- **CSS bleed:** current prototype uses global `:root`, `body`, `main`, button and heading rules. Scoped extraction is essential to protect Heritage and other approved sections.
- **Legacy JS coupling:** existing homepage script binds search/cards/location/fallback/map DOM in one module. A direct markup swap can crash initialization or silently remove filters/geolocation. Refactor/adapt only under later integration authorization.
- **Viewport/stacking:** homepage sticky header, toolbar height, nested scrolling, mobile browser chrome/safe areas and sheet attribution need actual-browser checks.
- **Media:** originals/URLs/codec metadata are absent. Keep placeholders honest; do not turn configured-markup tests into a claim of actual playback.
- **External services:** OSM is best-effort; deployed headers/browser policy must preserve actual Referer. Hosted fonts may fail or change, so retain readable fallbacks and compare Vietnamese diacritics.
- **Development tooling:** build while the dev server is stopped, then restart it; verify the served Leaflet module, not just HTML status.

### Required regression checklist before integration acceptance

- All existing 27 tests plus new embedded-controller/anchor/filter/card/location tests pass; production build includes all routes.
- Desktop/mobile approved visual comparison: no Heritage/hero/nav/footer/destination-card regression, no horizontal overflow, correct type/crops and legal attribution.
- Marker/directory/nearby selection, close/collapse/reopen, filter-excluded selection, center/zoom preservation and one-map lifecycle.
- Real touch/pointer drag and cancellation, keyboard controls/skip/Escape/focus, reduced motion, safe areas and nested scrolling.
- Native video user gesture, full 16:9 frame, fullscreen/exit/rotation and practical-info scroll with actual source files; mark untested devices explicitly.
- Actual target-domain Referer/tile imagery, partial failures, slow network/outage states, normal caching and no duplicate initializations/requests. No bulk/headless tile panning or cache bypass.

## 10. Billing boundary

This freeze and plan add no runtime service or published media: incremental configured vendor fees are USD $0/month before applicable tax under unchanged hosting/traffic. Future integration is proposed, not implemented or a paid commitment. Reusing the existing Leaflet/OSM/fonts approach introduces no new subscription/API fee, but changed viewport/engagement can change tile/hosting transfer. Traffic, host limits and eventual original-HD delivery must be measured/re-estimated before release. Existing forecasts, exclusions and provider controls are maintained in `docs/billing.md`; no new current supplier price is asserted by this plan.
