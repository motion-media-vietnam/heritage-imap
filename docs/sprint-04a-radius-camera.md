# Sprint 04A — consistent geographic-radius camera

October 20, 2026. **Isolated `/imap-prototype/` only; stop for visual approval. No production integration.**

## Inspection and correction

The earlier finite-radius path already distinguished itself from All, but read bounds from the **rendered Circle's current layer pixels**. It also used integer zoom snapping, a maximum zoom 16 fit cap and fixed 36px margins on top of obstruction allowances. Radius handlers, initialization, viewport/ResizeObserver callbacks and sheet transitions could all participate in camera updates; `resizeMap()` captured a center/zoom and called `setView()` after invalidation. That replay is unsafe during a camera transition. These source-level findings motivated this correction; the screenshot-reported inversion was not independently reproduced in a real browser here.

### One authoritative finite-radius calculation

For 500 m / 1 km / 2 km:

1. Use only the **accepted search center and radius in meters**, not eligible marker coordinates, marker count, cluster extents, or rendered-circle caches.
2. Derive spherical geographic bounds using Leaflet's Earth-distance calculation (the same Earth model as Circle). Latitude extent is radius / Leaflet's distance for one latitude degree; longitude extent uses the spherical angular-distance tangent. Build native `L.latLngBounds`.
3. Measure the actual map canvas, browser-clipped edges, toolbar/zoom controls and bottom status/attribution area. On mobile subtract the stable target sheet height including safe area. Desktop directory/story columns are outside the measured map element, not counted twice as padding.
4. Reserve **10% per side of the remaining rectangle**, then use Leaflet `getBoundsZoom` with fractional zoom (`zoomSnap: 0`). Thus the circle's geographic diameter occupies about **80% of the limiting unobstructed dimension**. The old extra fixed 36px margins and arbitrary max-16 cap are not applied to finite-radius framing; ordinary map/tile zoom limits remain.
5. Compute the camera offset in Leaflet projected pixels so the **accepted geographic center lands at the usable rectangle's midpoint**, within native one-pixel paint rounding. Asymmetric obstruction means `map.getCenter()` can intentionally differ from the search center: the search center remains unchanged and visually centered above the sheet, not behind it.

No fixed radius → zoom lookup table is used. Identical center/viewport/padding yields strictly descending zoom for 500 m → 1 km → 2 km; doubling radius lowers zoom by approximately one level and doubles geographic scale. The radius circle/filter/center still use the original geographic values.

### Separate All mode

All alone uses the currently eligible destinations' bounds with existing marker-safe 36px padding/max zoom 16. An explicit All choice uses the same animation mechanism. No-match All leaves an existing camera alone. If startup has no eligible All records or its visible area is wholly obstructed, initialization creates a valid base view using a **viewport-derived 1 km geographic fit**, not an arbitrary fixed zoom. No fake destination is introduced.

### Eliminate competing updates

- Initialization calculates the geographic camera **before adding/projecting the circle and attaching tiles**. The old fixed zoom-15 seed and subsequent second view are removed. `connect()` still guards against duplicate initialization.
- Explicit radius selection closes to compact exploration, updates circle/filter, invalidates changed map dimensions and starts a **0.4-second Leaflet `flyTo`/`flyToBounds`**. Reduced-motion users get an immediate view.
- All programmatic flights use Leaflet's cancellable RAF path. Prototype CSS zoom animation is disabled, so an older queued CSS transition cannot later replace a newer radius target. Tile endpoint/referrer/maxZoom/attribution are unchanged.
- A newer explicit choice stops an older flight before measuring/planning the next one. Stopping/restarting does not replay the old target.
- ResizeObserver, visual viewport, window/page-show and sheet-transition callbacks **never fit a radius or set a captured zoom**. They invalidate size with native center-preserving, non-animated panning; during a flight invalidation is deferred until completion. No radius fit runs from `moveend`.
- The final chosen zoom survives later layout/selection/initialization callbacks. A real subsequent resize deliberately retains that zoom; reselecting a radius recalculates its fit for the new dimensions. Opening a narrower desktop story panel may therefore expose less of the circle rather than silently zoom out; selected-pin visibility still uses the existing minimal non-zooming pan.
- Opening a destination cancels any pending flight before applying the existing video-first sheet/marker visibility behavior. Selection is never a marker-based zoom fit. Close retains selection/current camera.
- Native user zoom, drag and arrow panning cancel the flight and establish manual camera intent. Pointer/mouse/touch down during a flight also clears the guard: Leaflet can stop its RAF on a simple tap without ever emitting `dragstart`, which must not leave layout updates suspended.
- Manual movement never silently changes the accepted search center. Existing **Khám phá khu vực này** explicitly accepts the current map center without moving it; its All → 1 km behavior remains. An explicit radius choice intentionally frames the currently accepted center. No automatic location request/watch/persistence.

## Deterministic results

These are **real Leaflet 1.9.4 geometry/RAF calculations with controlled dimensions**, not browser screenshots or measurements of the client's desktop. Center: `{lat:21.0286,lng:105.8525}`. Toolbar/zoom obstruction 76px; bottom status/attribution 57px. Mobile target sheet 86px (52px compact + 34px safe area); no clipping in these examples.

| Map canvas | Unobstructed rectangle | Zoom 500 m | Zoom 1 km | Zoom 2 km |
| --- | --- | ---: | ---: | ---: |
| Desktop 1050 × 640 | 1050 × 507 | 15.853284 | 14.853284 | 13.853284 |
| Narrow desktop 560 × 640 | 560 × 507 | 15.853284 | 14.853284 | 13.853284 |
| Mobile 360 × 500 | 360 × 281 | 15.001868 | 14.001868 | 13.001868 |
| Mobile 390 × 500 | 390 × 281 | 15.001868 | 14.001868 | 13.001868 |
| Mobile 430 × 500 | 430 × 281 | 15.001868 | 14.001868 | 13.001868 |

Height limits each of these examples, explaining equal zoom for different widths. Different real dimensions/controls/clipping produce their own computed zooms; this is not a set of hardcoded production zoom values. Geographic bounds fit within the usable rectangle, focus is at its midpoint within 1px and projected diameter occupancy is within 75–85%. Independent fits can differ at ~1e-13 zoom due to floating-point arithmetic; tests compare independent plans within 1e-10, and assert the settled zoom is **exactly unchanged** by later callbacks.

### Regression evidence

- `check.log`: **45 files, 0 errors/warnings/hints**.
- `build.log`: **9 routes passed**.
- Final offline suite: **69 passed, 4 live-only skipped** in that phase.
- Final live-configured suite: **73 passed, 0 failed, 0 skipped**.
- Earlier focused camera/init/neighborhood suite: **23 passed**; the final full suite also includes the later pointer-down cancellation and updated resize contract assertions.
- Protected-source/style/data/asset/config checks and rollback SHA-256 verification are recorded alongside the logs.

Added/extended checks verify:

- Monotonic zoom at five desktop/mobile canvas sizes, geographic bounds containment, 75–85% limiting-dimension occupancy and accepted-center alignment.
- Identical finite bounds/zoom with full, Phố Cổ-only and empty destination matches, proving marker independence.
- Native Leaflet RAF flights with a deterministic clock: rapid 500 m → All → 1 km → 2 km ends at the latest 2 km target; resize calls during/after flight and repeated `connect()` cannot replace it.
- Manual drag and a simple pointer-down cancel pending native RAF work; later frames/layout cannot restore the old target or leave the flight guard stuck.
- Selection/close/layout paths never write a zoom or fit markers; minimal marker pan and all previous sheet/filter/cluster/permission regressions remain.
- Geographic initialization succeeds before circle projection without an arbitrary seed or rendered-circle bounds read; all radius result counts remain 1 / 2 / 5 / 6.

The fixture preserves native Leaflet Earth/CRS, projection, bounds planning, Circle lifecycle and `flyTo`/RAF cancellation, with a declared simulated 3D-capable browser. DOM drawing, actual layout, controls and tile transport are substituted. No automated external tile pan/zoom scan was performed. Browser animation quality and non-3D fallback behavior are not visually verified; Leaflet's non-3D fallback can quantize zoom and cannot promise exact 80% occupancy.

## Scope and exact files

Application:

- `src/lib/imap-prototype-camera.ts` — obstruction margin parameter and geographic radius plan.
- `src/scripts/imap-prototype.ts` — geographic initialization, explicit animated camera authority, cancellation and non-overwriting layout/selection paths.

Direct tests:

- `tests/fixtures/prototype-init-runtime.mjs` — native geometry and deterministic RAF clock.
- `tests/imap-prototype-camera.test.ts` — monotonic/occupancy/focus/filter-independence and final-camera lifecycle assertions.
- `tests/imap-prototype-init.test.ts` — view-before-circle readiness under new geographic initialization.
- `tests/imap-neighborhood.test.ts` — supply the new flight-state field to its actual move-handler context; preserve manual-center assertions.
- `tests/imap-prototype.test.ts` — update the old `pan:false` text expectation to native center-preserving invalidation and reject captured-view replay; retain all OSM/isolation assertions.

Required documentation: `docs/billing.md` and this report. Evidence: `output/sprint-04a/radius-camera/`. Build refreshes `dist/`.

**No page/component/style, approved production/editorial UI, marker/icon/clustering algorithm, six destination identities/coordinates, media asset, package/lockfile or OSM configuration changed.** The existing video-first landscape sheet, categories, permission flow, attribution and compact discovery remain.

## Checkpoint, resources and review

`output/sprint-04a/radius-camera/rollback.tar` contains the eight pre-existing edited source/test/billing files. It includes the neighborhood test reconstructed by removing this phase's sole `cameraFlight:false` fixture-field addition, plus the untouched pre-edit prototype test. Verify `rollback.tar.sha256`, inspect/extract to a separate directory and restore coherently; do not reset the dirty worktree or overwrite unrelated approved work. This report/evidence are new. Protected hashes originate in the accepted prior checkpoint.

Validation was sequential, with the preview stopped during compilation, guarded memory headroom and bounded V8 heaps (checker 384 MB, build/tests 192 MB, preview 96 MB). Only this harness's own idle language workers were released; other sessions/services were not stopped. Shared OOM counters remained **28 events / 5 kills** at this phase's recorded snapshots; memory pressure occurred but no new OOM kill was observed.

The canonical billing record now includes a conditional **$0/month incremental configured subscription/API subtotal before tax**, unmeasured animated-tile scenarios and the OSM primary-policy review dated October 20, 2026. Host transfer/storage/compute, labor, rights, tax/currency conversion and future HD costs remain excluded/unquoted. No provider purchase/change. Existing PDF remains stale under the document-generation restriction.

### Review URL and remaining acceptance

**http://localhost:4321/imap-prototype/?presentation=1** — fresh bounded static preview; public/external hostname not verified. Stop: `mise exec -- node node_modules/astro/bin/astro.mjs preview stop`.

No browser/Chromium/Firefox/Playwright is installed or was added. **No new screenshots or rendered-browser acceptance claimed.** Please verify on desktop/mobile:

1. Fresh reload at 1 km; toggle 500 m / 1 km / 2 km, including rapid reversals. Observe distinct geographic scales, complete ~80% circle, center above sheet/controls and smooth final settling.
2. Repeat with narrower/empty filters: finite radius framing must not follow marker density. All should fit only eligible destinations and avoid an invalid empty jump.
3. Pan/zoom or tap during a flight, then resize/open/close a story. No late snapback/zoom reset; explicit area acceptance still required to change search center.
4. Check real status wrapping, safe-area/browser chrome, resizing/orientation, selected-marker visibility, full uncropped 16:9 frame, gestures/focus and visible attribution. After a real size change, reselect radius to verify its new viewport fit.

**Await visual approval. Do not integrate into production or start another feature sprint.**
