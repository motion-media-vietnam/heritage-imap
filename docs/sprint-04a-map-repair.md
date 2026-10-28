# Sprint 04A — blank-map diagnosis and repair

October 19, 2026. **Confirmed prototype startup defect repaired. Rendered browser/visual confirmation is still pending; no production integration.**

## Confirmed cause

`connect()` created `L.map(...)` **without a center/zoom**, queued the radius circle with `updateCircle()`, then immediately called `focusDiscovery()` → `radiusCircle.getBounds()`.

Leaflet 1.9.4 defers adding/projecting layers until the map has an initial view. Its real `Circle.getBounds()` reads the circle's map/projected point, which do not exist yet. The unmodified controller sequence reproduced:

```text
TypeError: Cannot read properties of undefined (reading 'layerPointToLatLng')
    at NewClass.getBounds (...leaflet-src.js:8402...)
    at focusDiscovery (...)
    at connect (...)
```

The exception enters the existing initialization catch, which removes the map. Tile-layer attachment and marker filtering are never reached. The server-rendered radius/count/category controls still look correct, explaining why the page shows two matches while the map/markers are blank.

This is an **application initialization-order failure**, not the previously observed stale Vite dependency failure.

## Investigation, in requested order

| Stage | Check actually performed | Evidence / conclusion |
| --- | --- | --- |
| 1. Module delivery | Fetched the exact presentation route, served controller and its resolved Leaflet module before editing | All HTTP **200**, JavaScript MIME for Leaflet, no `Outdated Optimize Dep` response. Preview is a static production build, not an optimized Vite dev dependency URL. `modules-before.json` |
| 2. Runtime initialization | Executed the actual `connect`, `updateCircle`, `focusDiscovery` function bodies with installed real Leaflet Map layer/readiness and Circle projection/bounds methods, controlled DOM/drawing/network | The pre-fix sequence throws the real Leaflet exception above; **0 tile-layer attachments, 0 filtering calls**. `runtime-before.json` |
| 3. Container size | The failing controlled lifecycle has native Leaflet `getSize()` reading **960×640**; inspected served CSS nonzero sizing contracts | Failure reproduces with nonzero dimensions, so a zero-size container is not required to trigger it. Actual browser-computed width/height is **unmeasured**, not claimed verified |
| 4. Tile network | One identified, explicit diagnostic GET to `https://tile.openstreetmap.org/15/26018/14425.png` for the public sample area | HTTP **200**, `image/png`, valid PNG signature, **256×256**, **36,316 bytes**. `tile-network.json`. No pan/zoom scan or further tile fetches; this is not browser rendering or proof of every client network |
| 5. CSS/layer visibility | Fetched both served stylesheets and inspected stacking/sizing rules | HTTP **200**, `text/css`; Leaflet tile pane z-index **200**, marker pane **600**, prototype map height 100%, fixed desktop/minimum mobile explorer heights. No stylesheet changed. Actual computed opacity/stacking/position/visibility remains **browser-pending**. `css-data-before.json` |
| 6. Data/filter/camera | Ran the real neighborhood helpers against unchanged records and traced startup ordering | Default result is exactly `ho-hoan-kiem`, `pho-co`; filtering is not the blank-map cause. Startup reads circle bounds too soon, before tile attachment. Existing radius/camera behavior is retained |

### What the runtime reproduction does and does not prove

The fixture uses **real installed Leaflet 1.9.4** `Map.addLayer`, `whenReady`, projection/size and `Circle` methods. It executes the actual controller startup functions, substituting module loading, DOM feature detection, drawing/controls and tile transport. A controlled map instance supplies lifecycle/view state without a browser DOM constructor. It does not fabricate the exception or substitute a throwing `getBounds` mock.

This proves the native readiness failure and the repaired function sequence, **not** full DOM construction, visible markers, actual device dimensions or successful geographic-image display. `markerCandidates` in the diagnostic is the actual filtered ID list, not a count of rendered browser marker elements. The fixture deliberately leaves image load events unsimulated, rather than setting a false success indicator.

## Smallest source fix

Only one application statement was added, immediately after `L.map(...)`, with explanatory comments:

```ts
map.setView([state.center.lat, state.center.lng], 15, { animate: false });
```

The circle can now attach/project before its bounds are queried. `focusDiscovery()` still performs the original selected-radius fit using the same circle/padding/max zoom. The tile layer is attached **after** that fit, so the seed view does not request an extra initial zoom level. No timer workaround, provider switch, cache deletion, filter rewrite or layout change.

Controlled post-fix evidence (`runtime-after.json`):

- No initialization exceptions.
- One initial seed view and one original circle-bounds fit.
- One tile-layer attachment.
- The two correct default destination candidates.
- Retry not spuriously offered.

The new regression also removes the seed view from an in-memory source copy and reproduces the original failure, ensuring the test detects this defect rather than merely asserting a successful HTML/build shell.

## Exact changed files

1. `src/scripts/imap-prototype.ts` — the one-statement view initialization and comments; no other prototype behavior changed.
2. `tests/fixtures/prototype-init-runtime.mjs` **(new)** — controlled real-Leaflet lifecycle fixture; not application code or a browser renderer.
3. `tests/imap-prototype-init.test.ts` **(new)** — three regressions: reproduce missing-view failure; repaired startup at controlled desktop/mobile-sized dimensions; all radius choices without duplicate tile-layer attachment.
4. `docs/billing.md` — no-new-vendor repair cost impact, restored intended tile traffic and validation caveats.
5. `docs/sprint-04a-map-repair.md` **(new)** — this report.

Generated evidence/checkpoint files are under `output/sprint-04a/repair/`. `dist/` was rebuilt. All pre-existing tests, prototype page/CSS, category/clustering/filter helpers, six records/coordinates, homepage, Heritage, production iMap, media assets, dependency/config files and other protected files match `frozen.sha256` (`frozen-results.log` passed).

## Build and regression results

| Validation | Final result |
| --- | --- |
| Full Astro check | **43 files; 0 errors, 0 warnings, 0 hints** |
| Production build | **9 routes passed** |
| New focused initialization regressions | **3 passed** |
| Offline complete suite | **57 passed; 4 live-only deferred** in that phase |
| Complete live-configured suite | **61 passed, 0 failed, 0 skipped**, including all earlier integration tests |
| Controlled radius startup | 500 m → 1 candidate; 1 km → 2; 2 km → 5; All → 6; one tile-layer attachment per run |
| Frozen files / repair checkpoint hash | **Passed** |

An initial type-check run caught `never[]` inference in the **new test fixture's** empty error array; explicit JSDoc array types corrected it. No strictness/config setting was weakened. That failed run is retained in `check-initial.log`; final results are in `check.log`, `build.log`, `tests-offline.log`, `tests-live.log` and `tests-init.log`.

### Preview/cache handling and current URL

Stopped the old preview before rebuilding, then restarted one bounded production preview. No Vite optimize cache was cleared because module delivery did not fail.

The rebuilt controller changed from:

```text
imap-prototype.astro_astro_type_script_index_0_lang.BBl6LLri.js
```

to:

```text
imap-prototype.astro_astro_type_script_index_0_lang.hExdezwp.js
```

Both old-before/new-after deliveries were checked as HTTP 200. The Leaflet bundle remains `leaflet-src.D_JFGpWf.js`, delivered HTTP 200 with JavaScript MIME. Fresh HTML still selects 1 km and reports `2 địa điểm`. See `modules-after.json`.

**Reload the same correct route to obtain the repaired controller:**

**http://localhost:4321/imap-prototype/?presentation=1**

The static preview listens on all interfaces; its reported internal network URL is `http://172.18.0.5:4321/`. No external/public hostname was verified. This is not advice to switch to another map route; the user was already on the correct route.

## Preserved approved behavior

Unchanged: Hồ Hoàn Kiếm discovery center/default 1 km; 500 m / 1 km / 2 km / All; category icons/grouping; explicit location permission and denied-location manual fallback; accept-area action after panning; desktop three-column layout; compact mobile map-first sheet; original landscape video-first stories/no autoplay; selected marker/camera close/restore; six original records/coordinates; OSM URL/referrer/attribution. No homepage/Heritage/production-iMap/destination-content integration.

## Remaining verification limitations

No installed browser/Chromium/Firefox/Playwright or browser automation tool is available, and none was installed. **No screenshots or visual-fix claim.** Still required in a real desktop/mobile browser:

- Geographic images actually display, with visible attribution and nonzero computed map dimensions.
- The two default destinations appear individually or as an appropriate accessible cluster for that viewport/zoom.
- Radius changes update live visible markers; clicking a destination opens the right story.
- Category selection, manual pan/accept-area, location denial, close/restore, resizing and mobile gestures remain usable.
- Computed stacking/opacity, hit targets, overflow, safe areas and focus behave as intended.

One successful server-side PNG request does not prove the user's browser's tile requests succeed or are displayed. Controlled runtime tests do not replace real Leaflet DOM interaction. No actual HD files exist, so real HD playback remains separately unverified.

## Resource/checkpoint note and stop

The repair archive preserves pre-edit controller, relevant neighborhood test and billing record; verify `rollback.tar.sha256` and inspect/extract into a separate directory, not over ongoing work. The earlier full Sprint 04A checkpoint remains available. No reset/commit or dependency installation occurred.

Validation was sequential with preview stopped before compilation: 384 MB checker heap, 192 MB build/test heaps and 96 MB preview. Only this harness's idle TypeScript-language-server worker tree was intentionally stopped to free safe headroom. Shared cgroup counters now show `oom 28`, `oom_kill 5`, compared with the previous Sprint 04A checkpoint's `16` / `4`. These cumulative counters do not identify the victim or timestamp, so **no claim of an OOM-free interval or exact attribution** is made. All final reported checks completed successfully after resource cleanup. This server resource finding is separate from the independently reproduced client Leaflet initialization exception.

`docs/billing.md` records conditional $0 incremental configured subscription/API fees before tax, not a full business bill. Normal intended tile traffic is restored, not guaranteed free availability. Existing host/labor/rights/future-media exclusions remain, and the billing PDF remains stale under the document-generation restriction.

One preview remains running; stop with `mise exec -- node node_modules/astro/bin/astro.mjs preview stop`. **Stop after repair and browser handoff. No production integration without approval.**
