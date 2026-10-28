# Sprint 03 final QA checkpoint

Main handoff: [`docs/sprint-03-final-qa.md`](../../../docs/sprint-03-final-qa.md).
Proposed contract: [`docs/architecture/destination-content.schema.ts`](../../../docs/architecture/destination-content.schema.ts).

## Status

- Frozen application source, six identities/coordinates and public assets unchanged; all entries in `runtime.sha256` passed (`frozen-verification.log`). Owner Heritage desktop/mobile approval is recorded, not claimed as agent browser verification.
- Production build: 9 routes passed (`build.log`).
- Regressions: 41 passed, 0 failed, 4 live-only checks skipped (`tests-offline.log`). Four added QA tests exercise the actual extracted lifecycle/status callbacks plus construction guards and identity/selection invariants. These are not real browser/Leaflet interaction tests.
- Full Astro type check: **failed at 256 MB heap**, exit 134 (`check-baseline.log`). No large-memory retry on this shared container.
- Proposed schema-only strict type check: passed at 128 MB (`check-contract.log`), including negative contract tests. This is not a full application type check.
- Separate production HTTP verification: passed for `/` and `/imap/`, one explorer/six title-frame templates each, actual controller/Leaflet JS delivered, approved lotus image exact bytes (`http.log`, `http-results.json`). No external map/media traffic. This does not claim the four skipped live-only test cases ran.
- **Confirmed gap:** standalone `/imap/` has no compact mobile discovery opt-in and retains the old collapsed-sheet path. No UI/runtime fix was made under the frozen-design/architecture scope.
- Browser visual, gesture, real pan/zoom/camera, visible attribution, safe-area and actual HD playback acceptance remain pending. No browser installed and no HD files approved/configured.

## Changes in this phase

Only documentation, proposed types and QA tests/evidence:

- `docs/sprint-03-final-qa.md`
- `docs/architecture/destination-content.schema.ts`
- `docs/architecture/tsconfig.schema.json`
- `tests/fixtures/destination-content.contract.ts`
- `tests/imap-final-qa.test.ts`
- `docs/billing.md` (includes owner approval and proposed future HD bandwidth scenarios, no paid-service selection)
- This evidence/checkpoint directory; generated `dist` refreshed by the requested build.

No edits to `src`, existing tests, public assets, dependency manifests or the runtime configuration. No new services/packages/video sources, content records, map configuration or coordinate changes.

## Rollback and preview

`rollback.tar` is a 3.5 MiB uncompressed pre-work checkpoint of source, tests, docs, images and configuration. Verify `rollback.tar.sha256` (`checkpoint-verification.log` passed). Inspect/extract to a separate directory; do not overwrite ongoing work. The pre-existing dirty/untracked project was not reset or committed.

One low-footprint production preview remains running at:

- http://localhost:4321/ — homepage, iMap at `/#explore`
- http://localhost:4321/imap/ — standalone

See `preview.log`. No public/external hostname is verified. Stop with:

```sh
mise exec -- node node_modules/astro/bin/astro.mjs preview stop
```

The old dev server was stopped before checks/build; a heavier dev server was not restarted. The current shared container has little spare memory. Use a capable machine for full Astro checking and browser QA; do not run a larger check alongside the preview here.

**Approval requested:** review the schema and the bounded parity/reliability/publish-gating source-change list in the main handoff before implementing it. Client destination-specific covers/videos, rights and verified per-field practical evidence are still needed. The existing billing PDF remains stale; document generation was not authorized under instance policy.
