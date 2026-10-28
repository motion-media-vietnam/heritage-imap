# Sprint 04A — initialization-order repair evidence

Main report and exact changed-file list: [`docs/sprint-04a-map-repair.md`](../../../docs/sprint-04a-map-repair.md).

## Confirmed root cause and minimal fix

The radius circle was queued on a map with no initial view. `focusDiscovery()` called real Leaflet `Circle.getBounds()` before projection, throwing `Cannot read properties of undefined (reading 'layerPointToLatLng')`. Catch cleanup removed the map before tiles/marker filtering. The static controls/count therefore appeared while the map remained blank.

Only application change: seed `map.setView([state.center.lat, state.center.lng], 15, { animate:false })` immediately after creating the prototype map, before adding layers. Existing radius fit happens before tile attachment. No provider/cache/UX/data/CSS rewrite.

## Evidence

- `modules-before.json`: correct route/controller/Leaflet all HTTP 200, JS MIME, no Outdated Optimize Dep/504. Static production preview, not Vite optimized dependency mode.
- `runtime-before.json`: actual controller startup functions plus real Leaflet Map readiness/layer and Circle methods reproduce the exception at nonzero 960×640 controlled dimensions; zero tile attachments/filter calls.
- `runtime-after.json`: no exception, one tile-layer attachment, one radius fit and the two actual default IDs. It is a controlled lifecycle, **not** rendered marker/image evidence.
- `probe-initialization.mjs`: original bounded diagnostic. Runs against current controller and writes its report; before-fix report is preserved separately.
- `tile-network.json`: one real, identified single-tile diagnostic GET returned HTTP 200 / image/png / valid PNG signature / 256×256 / 36,316 bytes. No automated geographic pan/zoom scan or repeat tile probes.
- `css-data-before.json`: both served stylesheets HTTP 200; expected map sizing and Leaflet tile/marker z-index rules; real filtering returns Hồ Hoàn Kiếm and Phố Cổ. Computed browser dimensions/visibility remain unmeasured.
- `modules-after.json`: fresh controller hash served HTTP 200; unchanged Leaflet bundle HTTP 200; default 1 km and count 2 preserved.

## Validation

- `tests-init.log`: 3 focused lifecycle tests passed.
- `check.log`: final **43 files, zero errors/warnings/hints**. `check-initial.log` retains the earlier new-fixture array-inference type error; JSDoc types fixed it without weakening tsconfig.
- `build.log`: **9 production routes passed**.
- `tests-offline.log`: **57 passed, 4 live-only deferred** in that phase.
- `tests-live.log`: **61 passed, 0 failed, 0 skipped** in the final full live-configured suite.
- `frozen-results.log`, `checkpoint-results.log`: protected pre-existing files and repair archive verified. Only the intended prototype controller changed in application source.

The permanent fixture in `tests/fixtures/prototype-init-runtime.mjs` preserves real Circle/Map layer-readiness/projection behavior but stubs DOM construction/drawing/controls/tile transport. New tests intentionally remove the seed view to reproduce the original bug, then exercise repaired startup at controlled desktop/mobile-sized dimensions and all radius choices. These do not replace a real browser.

**Browser/visual verification is pending.** No installed browser/Playwright/tooling was available or installed. No screenshots, actual visible tile/marker confirmation, device-computed geometry, live marker clicks, mobile gesture or real HD-playback success is claimed. A server-side PNG response does not prove the user's browser renders it.

## Preview and checkpoint

Reload the same correct route to obtain the rebuilt controller:

**http://localhost:4321/imap-prototype/?presentation=1**

One bounded static production preview remains; external/public hostname unverified. Stop:

```sh
mise exec -- node node_modules/astro/bin/astro.mjs preview stop
```

`rollback.tar` preserves the pre-repair prototype controller, neighborhood test and billing record; verify its hash and extract into a separate directory for inspection/recovery. The earlier full Sprint 04A rollback is also retained. No reset/commit or dependency change.

Validation used sequential capped heaps (checker 384 MB, build/tests 192 MB, preview 96 MB), with own idle TypeScript workers stopped before checks. Shared cgroup cumulative counters now read 28 OOM events/5 kills versus the previous checkpoint's 16/4; PID/timestamp attribution is unavailable and an OOM-free interval is **not** claimed. All final reported validation commands completed successfully. This resource finding is separate from the reproduced client initialization exception.

`docs/billing.md` records no new configured vendor fees, restored intended tile traffic and existing exclusions. The previous PDF remains stale under the document-generation restriction. **Stop after repair. No production integration without approval.**
