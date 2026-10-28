# Sprint 02A — verified OSM tile fix checkpoint

Finalized October 17, 2026.

## Status: desktop preview issue user-verified resolved

The owner confirms that the Windows desktop preview now displays geographic map tiles and Chrome Network confirms the real preview origin is sent in the tile request's Referer header. This is user-provided evidence. The assistant did not independently operate a browser. No cross-device or production-domain validation is claimed. Earlier investigation notes marked browser verification pending; this record supersedes that status for the confirmed Windows desktop preview only.

## Exact implementation retained

`src/scripts/explore.ts:207`:

```ts
referrerPolicy: 'strict-origin-when-cross-origin',
```

This remains on the single existing Leaflet layer at `https://tile.openstreetmap.org/{z}/{x}/{y}.png`. The working script was checksummed before finalization and verified unchanged afterward. No implementation was duplicated or rewritten. Provider, attribution, cache behavior, map interactions, data, filters, layout, global headers and retry logic remain unchanged. No proxy, request-header spoofing or additional tile requests were used during finalization.

## Changed during finalization

- Added `tests/map-tile-policy.test.ts`: uses the existing TypeScript dependency to inspect the actual script AST. Asserts one existing OSM layer, its exact URL, and exactly one explicit `strict-origin-when-cross-origin` option on that layer. Does not execute the map or contact OSM.
- Updated `docs/billing.md`: records user-confirmed resolution and unchanged incremental vendor costs.
- Added checkpoint files under `output/sprint-02a/`.

All pre-existing regression tests remain unchanged. The approved Heritage design, shared rendering dependencies, metadata and photographs match the Sprint 01 freeze checksums.

## Validation performed

```sh
mise exec -- npm run build
HERITAGE_PREVIEW_URL=http://localhost:4321/ mise exec -- npm run test
sha256sum -c output/sprint-02a/working-tile-implementation.sha256
sha256sum -c output/sprint-01/design-freeze/approved-files.sha256
```

Results: seven production pages built; 12 tests passed, zero failures/skips; working script and all frozen Heritage checksums match. Existing live-page tests request only local homepage HTML and local cover JPEGs, not OSM tiles. Automated tests prove configuration and existing data/render associations, not browser referrer-policy enforcement. The actual Windows desktop outcome is separately user verified.

## Recoverable checkpoint

- `verified-checkpoint.tar.gz`: full current `src/`, `tests/`, `public/`, locked package/config files, canonical billing document and this checkpoint record/checksum manifests. No dependencies or generated build directory included.
- `verified-files.sha256`: key implementation, frozen Heritage, data, configuration and regression file hashes.
- `verified-checkpoint.sha256`: checksum of the archive itself.
- `working-tile-implementation.sha256`: script hash taken before finalization edits, which were limited to test/documentation/output files.
- `base-revision.txt` and `tracked-worktree.patch`: underlying Git revision and tracked worktree differences. Full archive also contains relevant untracked source/assets/tests.

The working tree was already dirty; no Git reset or commit was made. Extract into a separate directory for comparison/recovery rather than overwriting unrelated future work. Preserve the approved Heritage freeze when beginning subsequent iMap work.

## Billing and remaining scope

No new recurring vendor service, subscription, runtime API call or delivery asset is introduced. Incremental configured vendor fees remain USD $0/month before tax under unchanged traffic/hosting assumptions; hosting/transfer, domains, tax, currency conversion and labor remain unquoted/excluded as in `docs/billing.md`. This is not a full operating budget or an unlimited OSM availability guarantee. Checkpoint files are local recovery artifacts, not published assets. No PDF regeneration was performed; existing stale-PDF notice remains applicable.
