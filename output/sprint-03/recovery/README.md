# Sprint 03 — safe recovery report

October 19, 2026. **Saved integration recovered and ready for visual review, not full Sprint 03 acceptance.** No implementation restart, design edit or application-code change was made during recovery.

## Work successfully saved before the interruption

- `src/pages/index.astro`: legacy homepage map/controls replaced by the shared explorer; legacy `src/scripts/explore.ts` is no longer imported. Frozen Hero and sections outside the explorer remain byte-identical to the pre-integration fixture.
- `src/components/imap/IMap.astro`: reusable scoped explorer with unique instance IDs, controls, directory, sheet and map regions, plus optional homepage result/radius bindings.
- `src/components/imap/IMapStory.astro`: shared destination story with truthful placeholders/conditional native 16:9 player; no fabricated destination videos.
- `src/scripts/imap.ts`: per-instance controller/custom-element lifecycle, filtering/card synchronization, location, camera/sheet behavior and resource cleanup.
- `src/lib/imap.ts`: shared origin/filter/state utilities and independently disposable listener/resource lifetimes.
- `src/styles/imap.css`: root-scoped extraction of the approved design; no standalone root/body/main resets applied to homepage sections.
- `src/pages/imap.astro`: full iMap route using the same component.
- `tests/imap-integration.test.ts` and `tests/fixtures/homepage-frozen-sections.json`: saved integration/source-isolation/lifecycle/module regressions.
- `tests/heritage.test.ts`: original Heritage checks retained; obsolete map-overview assertions updated to the new destination placeholders.

The dirty worktree also contains earlier Sprint 01/02 changes, not new recovery edits. Git was inspected without reset, checkout or commit.

## Preservation / checkpoints

- `saved-work.tar.gz`: source, tests, public assets, docs and locked configuration exactly as recovered before validation. This includes the saved untracked integration files; Git HEAD alone does not contain the approved/current work.
- `tracked-worktree.patch`: tracked worktree differences captured at recovery start.
- `app-files.sha256`: current source/test/public-asset checksums after successful recovery, with no application edits.
- Original pre-integration rollback remains `output/sprint-03/before/rollback.tar.gz`.
- Protected styles/layout/Heritage/data/prototype hashes in `output/sprint-03/before/frozen-files.sha256` all matched.

`docs/billing.md` was updated only to document the already-saved integration, conditional operating-cost assumptions and the limited acceptance/recovery result. No original work was discarded.

## SIGKILL/resource evidence — attribution is limited

Observed container memory limit: **2,684,354,560 bytes (2.5 GiB)**. Recorded peak: **2,684,809,216 bytes**, approximately the limit. Initial cumulative `memory.events` counters were `oom 16`, `oom_kill 4`, `oom_group_kill 0`; memory-limit pressure counters were also nonzero. Host memory is about 4 GiB with no swap.

This proves that OOM kills have occurred in this container, but it does **not** identify which PID/timestamp corresponds to the reported SIGKILL. Kernel ring-buffer access is denied (`dmesg: Operation not permitted`), and no accessible per-process OOM log was found. The preceding run also reported an execution timeout. The exact interrupted kill therefore cannot be conclusively attributed to memory pressure versus an execution supervisor/limit from available evidence.

One old Astro dev process was present: PID 56855, roughly 398 MiB RSS. Other agent/TypeScript services were present; they were not killed or reconfigured. No orphaned test job was identified in the inspected process summary. The old preview was stopped to free memory before building/testing. High `memory.current` also included reclaimable file cache; resource decisions considered anonymous/kernel memory separately.

Recovery used bounded V8 old-space heaps (not total-process RSS caps), `UV_THREADPOOL_SIZE=1`, `RAYON_NUM_THREADS=1` and one test worker. Native/WASM/file-cache allocations still exist outside the V8 old-space cap. No new OOM kill was observed: after all validation, counters remained `oom 16`, `oom_kill 4`. Memory-limit/reclaim counters did increase, so this remains a constrained environment; do not resume unbounded concurrent checks.

## Sequential validation performed

### 1. Build with preview stopped

```sh
NODE_OPTIONS=--max-old-space-size=192 UV_THREADPOOL_SIZE=1 RAYON_NUM_THREADS=1 mise exec -- npm run build
```

**Passed: 9 production routes.** Log: `build.log`.

### 2. Source/built-output tests, still without preview

```sh
env -u HERITAGE_PREVIEW_URL NODE_OPTIONS=--max-old-space-size=192 UV_THREADPOOL_SIZE=1 RAYON_NUM_THREADS=1 \
  mise exec -- node --experimental-strip-types --test --test-concurrency=1 tests/*.test.ts
```

**30 passed, 0 failed; 4 live-only checks deliberately skipped in this phase.** Log: `tests-offline.log`. Includes frozen Hero/source comparison, Heritage/video associations, scoped CSS, filter/radius/origin behavior, independent instance state/disposal, approved sheet/video source contracts and built homepage/full-map output.

### 3. Restore one bounded preview, then lightweight HTTP checks

```sh
NODE_OPTIONS=--max-old-space-size=192 UV_THREADPOOL_SIZE=1 RAYON_NUM_THREADS=1 \
  mise exec -- npm run dev -- --background --host 0.0.0.0
mise exec -- node --max-old-space-size=64 output/sprint-03/recovery/verify-preview.mjs
```

**Passed** for `/`, `/imap/`, `/imap-prototype/`: doctype and complete closing body/html, correct map instance/story templates, and actual Leaflet dependency HTTP 200 with JavaScript content and module exports. Homepage's three Heritage associations and three local JPEGs were also checked. Not merely HTTP 200. Log: `preview-verification.log`.

### 4. Run only the four deferred live regression cases, one worker

```sh
HERITAGE_PREVIEW_URL=http://localhost:4321/ NODE_OPTIONS=--max-old-space-size=128 UV_THREADPOOL_SIZE=1 RAYON_NUM_THREADS=1 \
  mise exec -- node --experimental-strip-types --test --test-concurrency=1 \
  --test-name-pattern='running homepage|live homepage and full route|isolated prototype preview|prototype Leaflet browser module' \
  tests/heritage.test.ts tests/imap-integration.test.ts tests/imap-prototype.test.ts
```

**4 passed, 0 failed, none skipped in this phase.** Log: `tests-live.log`. Across the separated phases all **34 regression cases passed**. This is not a claim that one combined concurrent test run passed.

### 5. Frozen content and process checks

`sha256sum -c output/sprint-03/before/frozen-files.sha256` passed. Hero and non-explorer homepage sections also passed exact source comparisons against the pre-integration fixture. Styles, Layout, Heritage components/data/images and the approved prototype remain unchanged. These are source/assets/cascade-scope guarantees, not new pixel-level screenshot verification.

A process inspection found exactly one project Astro dev server after recovery: **PID 57565**, port **4321**. It is the restored preview, not a second duplicate. Its RSS varied around 396–446 MiB after serving warmed pages. No build/test job is intentionally left running. Do not run a production build while keeping this dev server active; use the stop/build/offline-tests/start/live-check sequence above.

## Working local previews

- Homepage: http://localhost:4321/
- Full iMap: http://localhost:4321/imap/
- Approved isolated reference: http://localhost:4321/imap-prototype/?presentation=1

The plain `/imap-prototype/` route was also verified. External/public preview-domain routing was not newly verified here.

## Still unverified / acceptance boundary

- No browser or screenshot review was performed; frozen Hero/Heritage visual equality remains a screenshot acceptance check despite unchanged source/styles/assets.
- Real desktop/mobile geographic tiles, outgoing Referer on target domains, marker clicks, actual Leaflet camera behavior and component reconnect behavior still require browser verification.
- Touch drag/snap, safe areas, scroll/overflow, actual header offsets and attribution placement are pending.
- Dedicated destination-video sources remain absent; real playback/fullscreen/codec/orientation acceptance is pending. No overview was substituted.
- HTTP verification and tests do not execute browser code or make OSM tile requests.

**Ready for owner desktop/mobile visual review. Do not declare Sprint 03 complete until screenshots and pending acceptance checks have been reviewed. No further design changes were made during recovery.**
