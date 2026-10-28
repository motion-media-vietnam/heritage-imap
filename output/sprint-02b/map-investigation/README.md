# Sprint 02B — restore prototype map: diagnostic evidence and operational repair

October 19, 2026. **Local Leaflet-module failure repaired; actual geographic map display still awaits user browser verification.**

Preview: http://localhost:4321/imap-prototype/

## Root cause established before application changes

The local preview served `/src/scripts/imap-prototype.ts` successfully, but that transformed client module dynamically imported:

`/node_modules/.vite/deps/leaflet.js?v=ed338213`

That exact dependency returned **HTTP 504, status text `Outdated Optimize Dep`, empty response body**. The referenced optimized Leaflet artifact was absent from the current Vite dependency cache. The current homepage script referenced the same failing dependency. This is stale preview-server dependency optimization state, not an OSM authentication/tile response. A previously working homepage can encounter this later because both routes share the preview's optimized Leaflet module.

The failure occurs at `await import('leaflet')`, before `L.map`, marker creation, `fitBounds` or any OSM tile request. The prototype's generic catch replaces it with an unavailable-map message without preserving the exception. Existing HTML-only tests missed the problem because HTML and application source URLs still returned HTTP 200.

Evidence:

- `imap-prototype-leaflet-response.json` and `explore-leaflet-response.json`: exact old URL, HTTP 504/status text and headers.
- `served-prototype-module.js`: served module containing the old dependency URL before repair.
- `imap-prototype-leaflet-after.json` and `explore-leaflet-after.json`: new URL `/node_modules/.vite/deps/leaflet.js?v=9c516a5d`, HTTP 200, JavaScript content, non-empty body after repair.
- The new targeted test first failed with `504 !== 200: Outdated Optimize Dep`, then passed after the operational repair.

The immediate stale-dependency failure is reproduced. Build/dev optimizer cache interference is a plausible origin (earlier builds ran while the dev server stayed active), but the exact historical invalidation event was not observed. Do not present that specific trigger as independently proven.

## Comparison with the working homepage

- Both map layers retain exactly `https://tile.openstreetmap.org/{z}/{x}/{y}.png`, maxZoom 19 and `referrerPolicy: 'strict-origin-when-cross-origin'`.
- Both retain copyright attribution linking to the same OSM copyright URL. Text differs by language (homepage Vietnamese; prototype English); both identify OSM contributors. No attribution rewrite is required for this failure.
- Homepage initializes its live-map DOM element and fits existing destinations; prototype initializes `prototype-map` and fits the same existing destination coordinates.
- Homepage has an initial 12-second tile watchdog and illustrated fallback. Prototype has tileload/tileerror status messaging and a generic catch, but no timeout. Those diagnostic limitations do not cause this demonstrated import failure and were not changed speculatively.
- Prototype already observes container resizing and calls `invalidateSize({ pan: false })`, then restores center/zoom. It does not need a second unconditional invalidation loop to fix a failed library import.
- CSS source gives desktop explorer a 640–860px height range, and mobile a viewport-based flex layout with a 280px minimum map region. Actual browser pixel dimensions were not measured. A 504 prevents map construction regardless of container size; no evidence justifies altering the user-approved responsive geometry.

## Smallest repair performed

No application code changes. The stale dev server was stopped, the requested production build completed while it was stopped, and the preview was started again with refreshed dependency state:

```sh
mise exec -- npm run dev -- stop
mise exec -- npm run build
mise exec -- npm run dev -- --background --host 0.0.0.0
HERITAGE_PREVIEW_URL=http://localhost:4321/ mise exec -- npm run test
```

Use this sequence when rebuilding the local preview instead of continuing to serve a stale optimizer state. No source/config rewrite, cache-busting tile parameters, static map, new provider, proxy, header spoofing or automated retry was introduced. The repair affects local preview runtime state only; this is not a production-domain deployment change.

## Exact files changed

- `tests/imap-prototype.test.ts`: one additional live-module regression resolves the real script entry and Leaflet dependency, checks HTTP 200 + JavaScript response + module exports, and never executes map code or requests OSM tiles. It also supports the bundled production entry format when used with a static preview server.
- `docs/billing.md`: zero-incremental-service-cost repair note and accurately limited verification status.
- Diagnostic output under `output/sprint-02b/map-investigation/`.

No source under `src/` changed. `application-before.sha256` verifies the prototype route, styles, script and helper byte-for-byte. `../ux-correction/protected-files.sha256` also verifies homepage, frozen Heritage, production map, original destination/district data and production regression files unchanged. The responsive three-column layout, mobile map-first sheet, existing editorial text and video placeholders are preserved exactly.

## Results

- Targeted regression before repair: **failed**, reproducing the 504 Leaflet dependency.
- Production build after stopping stale preview: **passed, 8 pages**.
- Full regression suite after restarting: **23 passed, zero failures/skips**.
- Prototype and homepage actual served Leaflet dependency: **HTTP 200, JavaScript, non-empty body**.
- All prototype/protected-file checksums: **matched**.
- No additional OSM tile requests or browser-driven panning/zooming were made for these checks.

## Browser verification limitation / stop for user review

No browser binary or browser automation tool/package is available here. The regression proves that the failing library dependency is now served, not that JavaScript executed successfully in the real desktop/mobile browser, that tiles are geographic, or that the layout/interactions are visually correct.

Please perform one normal reload of `/imap-prototype/` with regular caching retained:

1. Network: the actual Leaflet JS dependency must load successfully, with no `Outdated Optimize Dep` response; Console must have no initialization error.
2. Confirm real geographic tiles, markers and OSM attribution on desktop and mobile. Tile requests must retain the approved Referer behavior. Do not disable cache, bulk-fetch, or repeatedly retry OSM.
3. Select/close/reopen a destination, change filters and resize the sheet; verify marker synchronization and retained center/zoom.
4. If it still fails, capture the first Console exception, actual Leaflet dependency URL/status, and tile request outcome. A module failure and tile denial are different diagnoses; do not change provider/layout without evidence.

Stop here for user visual verification. No claim of restored browser map display is made solely from successful build/tests.
