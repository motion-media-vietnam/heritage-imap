# Sprint 04A — isolated prototype handoff

Main report / changed-file list / intake requirements: [`docs/sprint-04a-neighborhood.md`](../../docs/sprint-04a-neighborhood.md).

## Preview and scope

- http://localhost:4321/imap-prototype/
- http://localhost:4321/imap-prototype/?presentation=1

Only this isolated route was enhanced. Production homepage, `/imap/`, Hero/navigation, Heritage/thumbnails/transition, shared production map architecture, all six destination identities/coordinates and public assets passed frozen-file checks. No production integration, new records, video sources, dependencies, itinerary planner or purchased service.

## Actual data, not target inflation

Default: Hồ Hoàn Kiếm, 1 km. Measured geographic counts from unchanged coordinates:

- 500 m: **1**
- 1 km: **2** — Hồ Hoàn Kiếm and Phố Cổ
- 2 km: **5**
- All: **6**

See `density.json`. Need **6–10 additional verified records within 1 km** to reach the presentation target of 8–12. Other category filters currently show zero honestly. The five category/icon types support future approved prototype records without changing production data. No automatic radius widening or twelve-record cap is applied.

48px targets are grouped when projected positions are closer than 56px. Groups open a member list without autozoom; selecting a member opens its story and highlights its real position/name. No jittered/invented destination coordinates. Number metadata is retained only for a possible future numbering mode, with no itinerary UI or planning.

## Validation

- `check.log`: **42 files, 0 errors/warnings/hints**.
- `build.log`: **9 routes passed**.
- `tests-neighborhood.log`: **8 new focused cases passed** (earlier focused run; all eight also pass in the final full run).
- `tests-offline.log`: **54 passed, 4 live-only skipped** in the offline phase.
- `tests-live.log`: **58 passed, 0 failed, 0 skipped** in the final complete live-configured regression run.
- `http.json`: complete prototype response, actual default radius/count, only the two real in-radius directory entries initially visible; six story templates remain.
- `frozen-results.log`, `checkpoint-results.log`: all manifest/archive checks passed.

Geolocation-denial, map-pan/accept and marker-click tests execute actual extracted callbacks in a controlled Node VM, not an OS/browser UI. Projection/clustering checks at 360/390/430px are geometry simulations of real coordinates, not rendered screenshots. Existing live checks fetch actual controller/Leaflet modules and approved local assets, but do not execute a browser or request OSM tiles/video.

**No screenshots were captured.** Browser binaries/Playwright/browser tooling are unavailable; none were installed. Real desktop/mobile visual layout, gestures/safe areas, marker tap targets, focus, permission dialog, manual Leaflet camera, attribution visibility and HD playback remain pending. Capture the initial/selected/cluster states from the main report's checklist on a capable browser before visual approval. Do not treat these logs as screenshots or approval.

## Reproducible bounded commands

The previous preview was stopped before compiling; this session's own idle TypeScript workers were released to preserve shared-VPS responsiveness. At least 600 MB free headroom was required before the bounded 384 MB full checker. Other sessions were not terminated. Memory counters stayed `oom 16`, `oom_kill 4` (no new OOM kill).

```sh
# Only after stopping preview and confirming sufficient headroom:
NODE_OPTIONS=--max-old-space-size=384 UV_THREADPOOL_SIZE=1 RAYON_NUM_THREADS=1 \
  timeout 75s mise exec -- node node_modules/astro/bin/astro.mjs check
NODE_OPTIONS=--max-old-space-size=192 UV_THREADPOOL_SIZE=1 RAYON_NUM_THREADS=1 \
  mise exec -- npm run build
env -u HERITAGE_PREVIEW_URL NODE_OPTIONS=--max-old-space-size=192 UV_THREADPOOL_SIZE=1 RAYON_NUM_THREADS=1 \
  mise exec -- node --experimental-strip-types --test --test-concurrency=1 tests/*.test.ts
NODE_OPTIONS=--max-old-space-size=96 UV_THREADPOOL_SIZE=1 RAYON_NUM_THREADS=1 \
  mise exec -- node node_modules/astro/bin/astro.mjs preview --background --host 0.0.0.0
HERITAGE_PREVIEW_URL=http://localhost:4321/ NODE_OPTIONS=--max-old-space-size=192 UV_THREADPOOL_SIZE=1 RAYON_NUM_THREADS=1 \
  mise exec -- node --experimental-strip-types --test --test-concurrency=1 tests/*.test.ts
sha256sum -c output/sprint-04a/frozen.sha256
sha256sum -c output/sprint-04a/rollback.tar.sha256
```

No package installation, unrelated formatter/linter, benchmark, offline download or automated geographic pan/zoom scan was run. The primary OSM policy was reviewed; normal human browsing is distinct from prohibited automated tile scanning. Future browser automation should stub/block external tiles or use an appropriately permitted provider.

## Rollback and stop

`rollback.tar` is an uncompressed pre-work checkpoint of source/tests/docs/config/images, not dependencies/generated output. Verify `rollback.tar.sha256`; extract to a separate directory for recovery rather than overwriting ongoing work. The existing dirty/untracked tree was not reset or committed.

One bounded static preview remains running (`preview.log`). Stop it with:

```sh
mise exec -- node node_modules/astro/bin/astro.mjs preview stop
```

Billing impact is recorded in `docs/billing.md`: conditional **$0/month incremental configured subscription/API fees before tax**, not a full operating budget or free HD-delivery promise. Host transfer/storage, labor, curation/rights and future video remain excluded/unquoted; the existing PDF remains stale under the document-generation restriction.

**Stop for visual approval before production integration.**
