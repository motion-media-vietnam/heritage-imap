# Sprint 04A — final mobile UX polish

October 19, 2026. **Implemented only in `/imap-prototype/`; awaiting client approval. No production integration.** The client confirms the previous mobile screenshots showed working OSM, radius filters, category markers/clustering and the video-first sheet. That is the baseline approval, not a claim of new agent-run browser verification for this polish.

## Implemented behavior

### Radius-aware framing

- Selecting **500 m, 1 km or 2 km** explicitly closes the story/list to compact exploration, updates the geographic circle/filter and fits the circle's real Leaflet bounds.
- Selecting **All** fits bounds of the destinations currently eligible under search/category/former-district filters, not an unconditional city-wide record array. One result uses the existing maximum zoom 16; zero results leave the camera alone instead of fitting invalid/world bounds.
- Default center/radius remain Hồ Hoàn Kiếm / 1 km. The repaired initial view-before-layers ordering remains intact.
- Fitting uses **asymmetric padding** for the stable target sheet height (including safe area), visible map/status/attribution overlays, actual toolbar/zoom-control height and any map portion clipped by the browser visual viewport. This positions the geographic area in the unobstructed part of the map rather than behind the sheet.
- Circle/marker breathing room remains independent of geographic distance; the existing radius in meters and six destination coordinates are unchanged. No invented coordinates, boundary polygons or media.
- Fits remain non-animated and maximum zoom 16. The initial fit still precedes tile attachment, so no extra initial seed-zoom tile layer is requested.

An explicit radius choice is a discovery action, not continuous following. Search/category/district filtering alone still does not force a camera reset; choosing All fits the eligible set at that action. Viewport/layout changes may refresh a discovery fit only while the camera is still in compact automatic-discovery mode.

### Manual-camera protection

Camera intent is tracked as **discovery**, **selection** or **manual**:

- Explicit radius/reset/location framing enters discovery intent. Programmatic fit zoom events are guarded so they are not mistaken for user zoom.
- Dragging, arrow-key panning or native user zoom changes intent to manual. Resize and sheet-transition callbacks then do not fit/snap the camera back.
- `moveend` continues only to reproject markers and update the existing area offer; it does not recenter discovery or change the geographic filter center.
- **Khám phá khu vực này** adopts the existing camera center without moving it and keeps manual intent. Its existing All → 1 km behavior is preserved.
- No automatic geolocation request, watcher, coordinate persistence or new location source was added.

### Bottom sheet and selected markers

- Compact exploration remains **52px plus device safe area**, with the directory/story hidden and most of the map exposed. Existing half/expanded states and 90% height cap remain.
- Marker/list selection first reveals the story, then measures the title/category-to-frame geometry. Required height now includes the **full frame bottom, scroller bottom padding, sheet borders and a 2px rounding allowance**; safe-area padding is added through the existing geometry helper.
- If title plus the complete 16:9 frame fits within the available 90% sheet, the initial story height accommodates it. If it physically cannot fit, content remains scrollable rather than cropping, shrinking the video into portrait or claiming a full-frame guarantee on an impossible viewport.
- Frame measurement includes the scroll offset during layout changes, so resizing a scrolled practical-information view does not accidentally shrink the initial media-height calculation.
- A selected destination can receive the **minimum pixel pan needed** to keep its marker above the sheet/overlays and inside the visible map. Zoom and destination coordinates do not change. No pan occurs if already visible, if the remaining area is too obstructed, after the user manually moves the camera, or once the story is closed.
- Selection/layout changes check visibility; normal pan/zoom does not trigger a correction loop. A transition-end check is guarded by camera intent, so a user pan during the sheet animation is not undone.
- Closing stops media and restores compact exploration while retaining selection/current camera, with no forced radius reset or cached-camera jump.
- Original native horizontal HD compatibility, `16 / 9`, `object-fit:contain`, controls/inline behavior and no autoplay remain unchanged. No new video/cover or overview substitution.

## Padding and practical limits

The pure helper reserves a 24px half-marker plus 12px breathing room. Top padding includes actual toolbar/zoom bounds; bottom padding includes the target sheet plus the larger applicable status/attribution band. Browser-clipped portions are excluded on every side. The status overlay is measured, not assumed to be a fixed one-line height.

Using target sheet geometry avoids fitting against an intermediate animated height and leaving the final view incorrectly framed. If fewer than two usable pixels remain after valid padding, no invalid fit/pan is issued. Extremely short/clipped/expanded views may therefore keep the camera rather than force a meaningless zoom; the sheet/frame can still scroll and the user can return to compact exploration. Manual panning can intentionally move the circle off-screen; no auto-fit fights that choice.

These are implementation rules, **not** newly measured Safari/Android screen results. Actual viewport offsets, safe areas, overlay measurements and transition timing remain browser-review items.

## Exact changed files

1. `src/scripts/imap-prototype.ts` — explicit radius framing, eligible-All bounds, obstruction measurements, camera-intent guards, precise story-height calculation and minimal selected-pin visibility adjustment.
2. `src/lib/imap-prototype-camera.ts` **(new)** — pure pixel-padding, minimal-pan and story-height calculations, used only by prototype code/tests.
3. `tests/fixtures/prototype-init-runtime.mjs` — extend the existing real-Leaflet lifecycle fixture with native `_getBoundsCenterZoom`/projection planning, recorded fit options/projected bounds and controlled query/sheet inputs. DOM drawing/tile transport remain stubbed.
4. `tests/imap-prototype-camera.test.ts` **(new)** — eight focused framing, All-subset/empty, manual-camera and sheet-transition checks.
5. `docs/billing.md` — scoped cost impact and explicit updated tile-demand assumptions.
6. `docs/sprint-04a-mobile-polish.md` **(new)** — this report.

Generated evidence/checkpoint files are under `output/sprint-04a/polish/`; the requested validation refreshed `dist/`. No stylesheet, prototype page markup, production page/component, editorial source/asset, six destination record, shared production helper, dependency manifest/lockfile or OSM configuration was changed. The protected-source/style/data manifest passed.

## Verification

| Check | Result |
| --- | --- |
| Full Astro check | **45 files, zero errors/warnings/hints** |
| Fresh production build | **9 routes passed** |
| Focused camera + initialization + neighborhood suite | **19 passed** |
| Offline full regressions | **65 passed; 4 live-only deferred** in that phase |
| Complete live-configured regressions | **69 passed, 0 failed, 0 skipped** |
| Protected files and rollback hash | **Passed** |
| New browser screenshots/interaction/visual acceptance | **Not performed; pending client review** |

Focused checks cover:

- Padding for compact sheets, a 34px safe area, overlays and clipped viewport sides; invalid/fully obstructed viewport rejection.
- Native Leaflet fit planning/projection for all four radius choices at controlled **360/390/430px widths**, including bottom obstruction. Projected geographic bounds remain inside the padded rectangle within Leaflet's one-pixel rounding tolerance.
- All with six eligible records, a Phố Cổ-only search and zero matches. No fabricated record or world-bounds fallback.
- Actual radius-change callback ordering: compact state → circle/filter → invalidation → fit, retaining other filters.
- Minimal selected-marker pan, no correction after manual camera input and programmatic-vs-user zoom distinction.
- Actual area-accept and resize callbacks preserve manual camera intent.
- Measured story height/safe area with full-frame space where possible and scrolling/cap where not.
- Actual open/close controller functions with controlled elements: correct selected destination, measured story state, compact return, inert state and retained selection.
- Existing startup-readiness regression still reproduces the old missing-view error in an in-memory source copy, and passes with the repaired view-before-circle ordering.

These tests use real Leaflet geometry and actual extracted controller functions with controlled dimensions/elements; **they are not a real rendered browser or touch/device test**. The live suite checks complete local HTML, actual JS/Leaflet delivery and existing integration regressions. No automated OSM tile pan/zoom scan or new external tile request was performed in this phase.

## Browser-only checks still required

No browser/Chromium/Firefox/Playwright/tooling is installed; none was installed. No screenshot or new visual-acceptance claim is made. Please check the new polish on the live prototype:

1. At 360/390/430px and desktop, select 500 m / 1 km / 2 km: complete circle visible above compact sheet, status, attribution and controls, with appropriate breathing room.
2. Choose All with all records, a narrower filter and zero matches. Verify the intended framing, usable markers/clusters and no invalid jump.
3. Select a destination: one title and full 16:9 frame where space permits; practical information scrolls; expanded/collapsed states and close return work.
4. Verify the selected pin/name remains visible when there is enough space, without unexpected zoom or unnecessary movement.
5. Pan/zoom while the sheet is open or transitioning, then rotate/resize: the new camera must not snap back. Accept “Khám phá khu vực này”: no camera movement or permission prompt.
6. Check real safe-area/browser-chrome changes, focus, touch cancellation, overlay/status wrapping, no horizontal overflow and legible attribution. Very short/clipped views need particular review.

Existing media is still illustrative/unconfigured; real HD codec/fullscreen/playback acceptance needs approved original files. The client-approved baseline screenshots do not automatically approve these new framing calculations.

## Preview, checkpoint and costs

**http://localhost:4321/imap-prototype/?presentation=1**

One bounded static production preview remains running. The full live regression suite verified local module/HTML delivery; no public/external hostname was verified. Stop with `mise exec -- node node_modules/astro/bin/astro.mjs preview stop`.

`output/sprint-04a/polish/rollback.tar` preserves the pre-edit controller, initialization fixture/test and billing record; verify its SHA-256 and inspect/extract to a separate directory. New files are listed above; restoring the previous implementation should treat its controller/fixture/tests coherently rather than blindly overwriting ongoing work. Prior full Sprint 04A checkpoints are also retained. No reset/commit was made.

Checks ran sequentially with safe memory headroom and bounded heaps (checker 384 MB, build/tests 192 MB, preview 96 MB), releasing only this harness's own idle TypeScript workers before validation. Shared OOM counters stayed **28 events / 5 kills** between this phase's recorded before/after snapshots; no new OOM kill was observed in this phase.

`docs/billing.md` records conditional **$0/month incremental configured subscription/API fees before tax**, not the full operating budget. Explicit camera changes may fetch additional uncached tiles, so new low/expected/heavy planning scenarios are documented, with actual usage still unmeasured. Hosting/transfer, labor, rights and future HD delivery remain excluded/unquoted; no provider purchase/change. The existing billing PDF remains stale under the document-generation restriction.

**Stop for client approval. Do not integrate into production or add destinations/media without further approval.**
