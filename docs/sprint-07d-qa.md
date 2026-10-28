# Sprint 07D — QA continuation

Date: October 24, 2026. **Not client visual acceptance.** Inspected the current workspace first; did not restart/reimplement Sprint 07D or change application source, destination records, media mappings, map controls or sheet code.

## Implementation present

- `src/components/DestinationMedia.astro`
- `src/lib/destination-media.ts`
- `src/scripts/destination-media.ts`
- Existing integration in `src/components/imap/PrototypeExplorer.astro`
- Existing pilot gallery metadata in `src/data/imap-featured.ts`
- Existing regression coverage in `tests/imap-media-07d.test.ts`

Pilot: `/images/pho%20sach%20Dinh%20Le.jpg`, 655 × 874 pixels, 142,932 bytes. It is the same client-provided asset already used for the portrait. There is one approved gallery image; `1 / 1` and disabled previous/next controls are intentional, not a broken multi-image gallery. No production photographs were added to manufacture a multi-image test.

## Executed results

| Check | Result |
| --- | --- |
| `npm run build` | **PASS**, static output, 9 pages |
| Focused media/interaction/immersive/mobile tests | **25 passed, 0 failed, 0 skipped** |
| Entire regression suite, including preview-dependent cases | **129 passed, 31 failed, 0 skipped** (160 total) |
| `npm run check` | **INCOMPLETE**, timed out after 120 seconds; no clean type-check result |
| Existing preview status | Running; not restarted |
| Homepage and pilot photo | HTTP 200; image response is 142,932 bytes |
| Served pilot template | Gallery mode, supplied image URL, `1 / 1`, disabled previous/next, no iframe |
| Actual desktop/mobile browser rendering | **NOT RUN**: no installed Chromium/Firefox or Playwright/Puppeteer/browser automation tooling was found; none was installed |

Focused and full-suite counts overlap; do not add them together. Tests were serialized and memory-limited. The initial suite without a preview URL skipped four live cases; they were subsequently enabled and executed. The dev server binds IPv6 localhost: use `http://[::1]:4321` for Node live tests. Earlier IPv4/Node-localhost attempts could not connect; the final complete run used the reachable IPv6 endpoint and those live cases reached their assertions.

### Focused coverage that passed

- Legacy video mappings and autoplay/mute/inline embed parameters; explicit gallery override; placeholder/empty-gallery resolution.
- One/two/three/five-image index/support-tile logic; single-image navigation disabled.
- **Actual gallery controller executed in a controlled DOM/event harness:** desktop previous/next/support selection, image source and counter updates, horizontal swipe, synthesized-click suppression, ignoring vertical/small/pinch/cancelled gestures, enlargement/close handlers, keyboard navigation, Escape propagation, and detached-story gesture safety.
- Video → video → gallery → video → map unload-before-replace controller path.
- Existing geographic filtering/selection and desktop hide-not-destroy behavior.
- Mobile automatic expanded state, measured header bounds, close path and preservation of selected pin, map camera and filters in controlled controller tests.

These are controlled tests and source contracts, **not rendered UI tests**. The modal harness checks that `showModal()`/`close()` are invoked and Escape does not prevent the browser default. It does not simulate native focus trapping/restoration or claim a real mobile swipe occurred.

## Outstanding full-suite failures

The suite is not green. No unrelated implementation or old tests were edited to hide failures.

| Test file | Failures | Observed area |
| --- | ---: | --- |
| `heritage-refinement.test.ts` | 1 | Existing background/source expectation |
| `heritage.test.ts` | 2 | Built/live homepage media/template expectations |
| `imap-featured.test.ts` | 2 | Older description and directions source strings (`place.story`/`place.coordinates` rather than current mapped-place expressions) |
| `imap-integration.test.ts` | 3 | Frozen unrelated-section snapshot and old shared-renderer markup expectations |
| `imap-interactions.test.ts` | 5 | VM fixture lacks `filterPrototypeCollection` |
| `imap-marker-color.test.ts` | 1 | Source contract |
| `imap-mobile-07c1.test.ts` | 2 | Exact-coordinate comparison differs by ~1.4e-14 degrees; resize fixture lacks DOM style needed by Leaflet transform |
| `imap-neighborhood.test.ts` | 1 | Marker-handler source contract |
| `imap-portraits.test.ts` | 2 | Catalog expectation and VM source-extraction syntax error |
| `imap-prototype-camera.test.ts` | 3 | VM contexts lack `sheetState` or `syncMobileStoryLayout` |
| `imap-prototype.test.ts` | 7 | Older route/source/build/live expectations, placeholder-only media, development/presentation and header contracts |
| `imap-workspace-preview.test.ts` | 2 | Older map-height/directions source expectations |

Some failures clearly involve stale source assertions or incomplete controlled fixtures. This QA run did not establish that **all** failures are harmless or pre-existing runtime bugs. Reconcile the suite before treating the project as release-ready; do not change the approved application layouts simply to satisfy outdated assertions.

Full-suite log: `/tmp/mm-guide-07d-complete.log`. Focused log: `/tmp/mm-guide-07d-focused.log`. Build/check logs: `/tmp/mm-guide-07d-build.log`, `/tmp/mm-guide-07d-check.log`. These temporary files are session evidence, not committed artifacts.

## Reproduction

No repository mise/Pixi/tool-manager configuration was present. Used the existing npm/Node environment; no dependency/browser installation.

```sh
NODE_OPTIONS=--max-old-space-size=1536 nice -n 10 npm run build

NODE_OPTIONS=--max-old-space-size=1536 nice -n 10 npm run env -- node \
  --experimental-strip-types --test --test-concurrency=1 --test-reporter=tap \
  tests/imap-media-07d.test.ts tests/imap-gallery-interactions-07d.test.ts \
  tests/imap-mobile-07c.test.ts tests/imap-immersive-07a.test.ts

HERITAGE_PREVIEW_URL='http://[::1]:4321' NODE_OPTIONS=--max-old-space-size=1536 \
  nice -n 10 npm run env -- node --experimental-strip-types --test \
  --test-concurrency=1 --test-reporter=tap tests/*.test.ts

# Incomplete here; run on a capable machine and record the final result:
npm run check
```

## Files changed by this QA continuation

- Added `tests/imap-gallery-interactions-07d.test.ts`: six controlled interaction tests, synthetic metadata only.
- Added `docs/sprint-07d-qa.md`: this report.
- Updated `docs/billing.md`: actual QA status; no cost/scope/vendor change.
- Build regenerated ignored `dist/` output and Astro-generated metadata. Existing dirty application files predate this QA continuation and were left intact.

## Client review still required

Open **http://localhost:4321/** at desktop and mobile widths. Select Phố sách Đinh Lễ, verify image containment, counter, enlargement, native dialog X/Escape/focus, then switch video → gallery → video → map. Confirm full-height sheet/header boundary and story X/back controls, scrolling, radius/filters and exact camera restoration. Three-plus-image visual/swipe QA needs an isolated synthetic test fixture or further approved client images; do not publish unrelated photos. Check real Chrome/Safari and touch devices; screenshots, native playback, browser UI resizing and actual visual acceptance remain unverified.

**STOP for client visual review.**
