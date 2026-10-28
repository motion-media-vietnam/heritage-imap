# Sprint 03 — mobile homepage iMap correction

Implemented; **visual acceptance pending. Stop for owner review, not deployment.**

## Scope and behavior

- Only the homepage explorer opts into the new mobile geometry (`data-mobile-discovery`, <=960px). Desktop ratios/layout, `/imap/`, `/imap-prototype/`, Hero, Heritage, shared layout/styles, destinations, original media and OSM configuration are preserved.
- Initial/collapsed view hides both directory and story, with a 52px native discovery button plus actual safe-area padding. Its label tracks the filtered count. Tap/keyboard activation or upward swipe opens the scrollable directory. Zero matches remains an accessible directory empty state.
- Directory selection and marker selection use the same existing selected slug/highlight. Opening the directory stops/hides the story; directory close/Escape returns to the collapsed map. Selection and camera survive closing.
- Selecting a destination reveals the story before measuring the title/frame, then opens to at least half height or the measured title/video height, capped at 90% of available explorer height. Small viewports can show most rather than all of the frame; the remaining content scrolls. Existing native 16:9/contain framing is unchanged.
- Bản đồ collapses/dismisses the mobile story; Mở rộng exposes practical information. Dragging is confined to the touch-action:none handle. The directory and story each have one scroll owner, and collapsed panels are hidden/inert.
- Available height uses actual header and root-to-explorer chrome plus `visualViewport.height`, with a 280px minimum for short/landscape screens (page scrolling may be necessary there). Safe-area padding is included in sheet geometry. A scrolled story's measurement includes its scroll offset.
- Map invalidation preserves center/zoom and runs on state changes, resize and the sheet's transition end. Existing ResizeObserver cleanup remains.

## Checks actually performed

```sh
NODE_OPTIONS=--max-old-space-size=192 UV_THREADPOOL_SIZE=1 RAYON_NUM_THREADS=1 \
  mise exec -- node --experimental-strip-types --test --test-concurrency=1 \
  tests/imap-mobile.test.ts tests/imap-integration.test.ts tests/imap-prototype.test.ts
sha256sum -c output/sprint-03/before/frozen-files.sha256
```

- Final focused test run: **22 passed, 0 failed, 3 live checks skipped**, about 1.4 seconds. Three added mobile regressions cover geometry/safe areas/video fit, snap selection, and source wiring/accessibility/measurement ordering. Existing frozen Hero/section and scoped CSS/OSM/filter/instance regressions passed.
- Two of the 22 passing cases examine existing `dist` artifacts. These are **not evidence of a fresh build of this correction**; no production build was run under the instance policy.
- Frozen file checksum verification: all 20 passed, including Layout, global/editorial styles, Heritage, destination records/images and approved prototype files.
- Changed-file LSP probe: no type/CSS errors reported; Astro files are unsupported by the configured LSP. Existing/advisory AST style warnings remain. This does not replace Astro build/browser acceptance.
- A broader test attempt using `--test-skip-pattern='^built '` timed out after 120 seconds, after the first Heritage case passed. Cause unconfirmed; no passing-suite claim is made for that attempt. No matching test process remained afterward. The focused command above was rerun successfully after all code changes.

## Missing evidence / review checklist

There is no installed Chromium/Firefox/Playwright browser or browser automation tool in this environment. No packages/browsers were installed, no screenshots were fabricated, and no new server/build was started. **No mobile screenshots are supplied.** All seven requested mobile interaction/visual scenarios remain browser-acceptance checks, despite passing source/unit regressions:

1. At 390×844 and 320×568, navigate to the homepage iMap: only the compact “Khám phá 6 địa điểm” bar, no “Chọn câu chuyện” heading; capture `mobile-initial.png`.
2. Tap a marker: one visible title followed immediately by the 16:9 frame; capture `mobile-selected.png`. Verify title/frame visibility and the selected marker.
3. Close/collapse: dominant map returns, selection and camera remain. Reopen story.
4. Open/close directory by tap, upward swipe and keyboard; confirm no story panel or camera reset.
5. Select a directory entry; verify the matching marker and story, then repeat with filters and zero results.
6. Pan/zoom and repeat selections; rotate/change browser chrome height, scroll practical information, resize and dismiss. Verify no scroll traps or unintended map gestures while dragging.
7. Check page `scrollWidth <= clientWidth`, visible OSM attribution at every snap, >=44px controls, focus recovery, safe areas and reduced motion. Compare unchanged desktop layout.

**Video limitation:** `dedicatedVideos` is still empty, as required by the no-content/asset-change constraint. The existing honest 16:9 placeholders remain. Actual HD video playback cannot be accepted until approved files are provided; no city overview or invented source is used.

On a capable machine, run the focused tests above and (outside this instance's restrictions):

```sh
mise exec -- npm run check
mise exec -- npm run build
mise exec -- npm run dev -- --background --host 0.0.0.0
# Capture the two real browser states above, then:
mise exec -- npm run dev -- stop
```

Use the native toolchain instead of mise outside a managed container. Stop any existing dev server before building on this small instance; do not run these commands here without authorization.

## Billing

`docs/billing.md` records $0 incremental configured monthly vendor fees before tax under unchanged hosting/provider/traffic assumptions, with viewport-dependent tile demand and ordinary hosting/labor exclusions. No new dependency, service or asset was added. The billing PDF was already stale and remains so: document generation was not authorized under the instance policy. Regenerate on a capable machine with `uv run --with reportlab python scripts/build-billing-brief.py` and visually inspect it before sharing.
