# Sprint 04A — final mobile UX polish evidence

Main report / exact changed files: [`docs/sprint-04a-mobile-polish.md`](../../../docs/sprint-04a-mobile-polish.md).

## Behavior

- Explicit radius selection returns to compact exploration and fits the real circle above the target sheet/overlays. All fits currently eligible records; no-match All does not issue an invalid/world fit.
- Asymmetric padding includes safe area, browser clipping, actual status/attribution band and toolbar/zoom control bounds.
- Story opening measures the full 16:9 frame plus content padding/borders/rounding. Existing 90% cap/scrolling handles physically short screens without cropping video.
- Minimal selected-marker pan only when needed/possible, without zoom. Drag/arrow-pan/user zoom cancels correction; accepting a new area never moves the camera. Close returns compact without resetting selection/camera.
- No CSS, HTML page markup, original records, media, production/editorial code, provider/configuration or dependencies changed. No integration into production.

## Results

- `check.log`: **45 files; 0 errors, 0 warnings, 0 hints**.
- `build.log`: **9 routes passed**.
- `tests-focused.log`: **19 camera/init/neighborhood checks passed**.
- `tests-offline.log`: **65 passed, 4 live-only deferred** in the offline phase.
- `tests-live.log`: **69 passed, 0 failed, 0 skipped**, including the entire existing integration suite.
- `frozen-results.log` and `checkpoint-results.log`: protected source/styles/data/assets/config and archive checks passed.

The extended fixture uses real Leaflet fit planning/projection to verify fitted bounds inside padded rectangles at controlled 360/390/430px widths. Actual extracted radius, marker, manual-camera and sheet callbacks run with controlled elements. These are not browser renders, actual touch/OS permission dialogs or screenshots.

The client confirmed that the prior mobile screenshots showed a visually functioning baseline. **No new visual acceptance is claimed for this polish.** No browser/Chromium/Firefox/Playwright/tool is installed or was added. Real viewport/safe-area measurements, circle appearance, marker visibility, focus, gestures and horizontal video presentation still require client/browser review. No automated geographic tile scan or new external tile fetch was performed by this phase's tests.

## Resources and reproducibility

Old preview stopped before compilation; only this harness's own idle TypeScript workers were stopped to preserve headroom, not other sessions. Full checker required at least 600 MB free before its 384 MB V8 cap. Build/tests used 192 MB, preview 96 MB. Shared OOM snapshots stayed **28 events / 5 kills** before/after this phase (no new OOM kill observed).

```sh
# With preview stopped and sufficient safe headroom:
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
sha256sum -c output/sprint-04a/polish/frozen.sha256
sha256sum -c output/sprint-04a/polish/rollback.tar.sha256
```

## Preview, checkpoint and stop

**http://localhost:4321/imap-prototype/?presentation=1**

One bounded static preview remains, external/public hostname unverified. Stop with `mise exec -- node node_modules/astro/bin/astro.mjs preview stop`.

`rollback.tar` preserves the pre-edit controller, initialization fixture/test and billing source. Verify the hash and inspect/extract to a separate directory. Restore related source/fixture/tests coherently if reverting; do not overwrite ongoing work. New helper/test/report files are listed in the main handoff. Earlier full checkpoints remain available; no reset/commit was made.

`docs/billing.md` records conditional $0 incremental configured subscription/API fees before tax, with updated unmeasured tile-demand calculations for extra framing actions and ordinary hosting/labor exclusions. No paid service was selected; the old billing PDF remains stale under the instance's document-generation restriction.

**Stop for client approval. No production integration, new records/media or further sprint work.**
