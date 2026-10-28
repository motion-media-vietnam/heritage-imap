# Sprint 03 conditional implementation evidence

Acceptance report and exact changed-file list: [`docs/sprint-03-conditional-acceptance.md`](../../../docs/sprint-03-conditional-acceptance.md).

## Results

- Same shared mobile discovery control/state path on homepage and `/imap/`, initially collapsed. Standalone main padding is accounted for. Existing iMap CSS is byte-identical.
- Published supplementary-content gates implemented; no real media/facts or sample-catalog migration. Missing video remains a non-playable illustration; prototype notices are not shipped in published templates.
- Canonical shared type contract supports future city IDs/timezones, stable IDs/coordinates, reviewed original HD video, independent approved posters/covers, image credits, rights and sourced optional practical fields. The proposal entry re-exports types; no duplicate catalog or UI city selector.
- Full Astro check **passed: 40 files, 0 errors/warnings/hints** (`check.log`). Prior bounded-heap OOM remains a failed historical result, not counted as success.
- Strict schema/negative type contract check passed (`check-schema.log`).
- Production build **passed: 9 routes** (`build.log`).
- Offline tests **46 passed, 4 live-only checks skipped** (`tests-offline.log`).
- Full live regression run **50 passed, 0 failed, 0 skipped**, including all four previously skipped checks (`tests-live.log`). This is a complete live-configured Node regression run, not browser automation.
- All 21 frozen-file hashes and pre-work rollback checksum passed (`frozen-results.log`, `checkpoint-results.log`). No dependency manifest/lockfile or public asset was changed.
- No browser installed or added; real touch, camera interaction, safe-area/attribution visibility, screenshots and actual HD playback remain pending.

## Bounded resource handling

The old production preview was stopped before compilation. The old 256 MB heap failure was investigated alongside cgroup pressure. This harness's own TypeScript-language-server workers were identified by parent PID and stopped to free roughly 750 MB; other sessions were not terminated. `type-memory.log` records 783,003,648 bytes available before a bounded 512 MB full-check attempt, which completed within its 90-second safety deadline. The tsconfig now explicitly includes all application/test/architecture source rather than generated QA artifacts.

Cgroup counters at the start and after validation were unchanged: `oom 16`, `oom_kill 4`. No system OOM kill was added. Do not rerun a large checker alongside language services/preview without checking available memory; a V8 heap cap is not a total-process RSS cap.

Commands used sequentially:

```sh
# After stopping the old preview and this harness's own idle TS workers,
# and confirming safe memory headroom:
NODE_OPTIONS=--max-old-space-size=512 UV_THREADPOOL_SIZE=1 RAYON_NUM_THREADS=1 \
  timeout 90s mise exec -- node node_modules/astro/bin/astro.mjs check
NODE_OPTIONS=--max-old-space-size=192 UV_THREADPOOL_SIZE=1 RAYON_NUM_THREADS=1 \
  mise exec -- npm run build
env -u HERITAGE_PREVIEW_URL NODE_OPTIONS=--max-old-space-size=192 UV_THREADPOOL_SIZE=1 RAYON_NUM_THREADS=1 \
  mise exec -- node --experimental-strip-types --test --test-concurrency=1 tests/*.test.ts
NODE_OPTIONS=--max-old-space-size=96 UV_THREADPOOL_SIZE=1 RAYON_NUM_THREADS=1 \
  mise exec -- node node_modules/astro/bin/astro.mjs preview --background --host 0.0.0.0
HERITAGE_PREVIEW_URL=http://localhost:4321/ NODE_OPTIONS=--max-old-space-size=192 UV_THREADPOOL_SIZE=1 RAYON_NUM_THREADS=1 \
  mise exec -- node --experimental-strip-types --test --test-concurrency=1 tests/*.test.ts
NODE_OPTIONS=--max-old-space-size=128 UV_THREADPOOL_SIZE=1 \
  mise exec -- node node_modules/typescript/bin/tsc -p docs/architecture/tsconfig.schema.json
sha256sum -c output/sprint-03/conditional/frozen.sha256
sha256sum -c output/sprint-03/conditional/rollback.tar.sha256
```

## Rollback and preview

`rollback.tar` preserves the pre-work source, tests, docs, public images and config/lockfiles. Verify its hash before inspecting/extracting into a separate directory; do not blindly overwrite ongoing work. The pre-existing dirty/untracked worktree was not reset or committed.

One bounded production preview remains running (`preview.log`):

- http://localhost:4321/#explore
- http://localhost:4321/imap/

No public/external hostname is verified. Stop it with:

```sh
mise exec -- node node_modules/astro/bin/astro.mjs preview stop
```

Billing impact is documented in `docs/billing.md`: no new configured paid vendor or real-video delivery; future hosting/media/rights/labor costs remain unquoted. The old billing PDF remains stale under the document-generation restriction. **Stop after this implementation; no Sprint 04 or full content migration has begun.**
