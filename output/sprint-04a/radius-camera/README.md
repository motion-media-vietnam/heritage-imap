# Sprint 04A radius-camera correction evidence

October 20, 2026. Full implementation/zoom table/browser-review checklist: [handoff](../../../docs/sprint-04a-radius-camera.md).

## Final evidence

- `check.log`: 45 files, zero diagnostics.
- `build.log`: 9 routes passed; fresh controller built after the final pointer-down cancellation fix.
- `tests-offline.log`: 69 passed; four live-only skipped in that phase.
- `tests-live.log`: **73 passed, zero failures/skips** against the refreshed local preview.
- `tests-focused.log`: earlier 23/23 focused checks; final full suite includes the subsequent pointer-down and resize-contract assertions too.
- `frozen-results.log`: protected pages/styles/records/assets/configuration hashes.
- `checkpoint-results.log`: rollback SHA-256 verification.
- `rollback.tar`: pre-edit controller, camera helper, five related test/fixture files and billing source. The neighborhood fixture backup is reconstructed by removing this phase's sole new boolean field from an otherwise untouched copy. `before/tests/imap-neighborhood.test.ts` preserves that copy for inspection. Inspect/extract elsewhere rather than blindly overwrite a dirty worktree.
- `memory-events-before.txt`, `memory-events-editing.txt`, `memory-events-after.txt`: shared OOM counters 28 / 5 kills, no observed increment; pressure/reclaims occurred, so this is not a claim of no memory pressure.

Finite radii derive bounds exclusively from accepted center/meters; Leaflet fractional zoom targets 80% of unobstructed dimensions. All alone fits eligible markers. Native Leaflet geographic/RAF tests verify monotonic scales, containment, focus alignment, filtering independence, latest-flight wins, drag/tap cancellation and protection against later layout/init/selection zoom resets. These substitute DOM layout/drawing/tile transport and simulate 3D support, not a rendered browser. No external tile scan/prefetch or new geographic tile diagnostic request.

Initial QA failures were controlled-fixture extraction/state/float-rounding issues and the legacy textual `pan:false` expectation. They were fixed without relaxing the core geographic assertions; final full results above supersede them. Source/UI styles, records, media and production were not changed to accommodate tests.

## Reproduce on a capable machine

No dependency installation, browser tooling or new service was added. Use existing tools through mise. Run sequentially with safe memory headroom; stop the preview before compilation:

```sh
mise exec -- node node_modules/astro/bin/astro.mjs preview stop
NODE_OPTIONS=--max-old-space-size=384 UV_THREADPOOL_SIZE=1 RAYON_NUM_THREADS=1 \
  mise exec -- node node_modules/astro/bin/astro.mjs check
NODE_OPTIONS=--max-old-space-size=192 UV_THREADPOOL_SIZE=1 RAYON_NUM_THREADS=1 \
  mise exec -- npm run build
env -u HERITAGE_PREVIEW_URL NODE_OPTIONS=--max-old-space-size=192 \
  mise exec -- node --experimental-strip-types --test --test-concurrency=1 tests/*.test.ts
NODE_OPTIONS=--max-old-space-size=96 \
  mise exec -- node node_modules/astro/bin/astro.mjs preview --background --host 0.0.0.0
HERITAGE_PREVIEW_URL=http://localhost:4321/ NODE_OPTIONS=--max-old-space-size=192 \
  mise exec -- node --experimental-strip-types --test --test-concurrency=1 tests/*.test.ts
sha256sum -c output/sprint-04a/radius-camera/frozen.sha256
sha256sum -c output/sprint-04a/radius-camera/rollback.tar.sha256
```

One bounded static preview remains: **http://localhost:4321/imap-prototype/?presentation=1** (PID 85771 at startup). Public/external host unverified. No installed browser/Playwright; no new screenshots or browser visual acceptance claimed. Native geometry numbers are in the live log and handoff. Review actual desktop/mobile framing, rapid animations/cancellation, safe areas and video-first sheet before approval.

Billing source updated, primary OSM policy re-read October 20; configured added subscription/API subtotal remains conditional $0 before tax, not full operating costs. Animated tile demand is an unmeasured forecast. PDF remains stale under the document-generation restriction.

**Stopped for visual approval. No production integration.**
