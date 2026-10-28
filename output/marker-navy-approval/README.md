# Client-approved navy marker default — prototype only

## Implementation

- `src/styles/imap-prototype.css`: all destination/cluster pins default to exact `#203A5E`, with unchanged white icons, 48px circular targets and 20px SVG geometry. Remove category-specific fills, red-selected fill and experiment overrides. Selection uses two light rings separated by navy, without scaling or changing target size. Neutral grid/count clusters retain a light badge with navy text/border. Global brand tokens remain untouched.
- `src/pages/imap-prototype.astro`: remove the visible comparison select, explanatory note, query initialization and change listener. Restore the former development badge in the existing header slot. Old `markerColor=red`/`original` links cannot override navy; presentation-mode initialization remains.
- `tests/imap-marker-color.test.ts`: four focused source-contract/contrast regressions. No new destinations or synthetic catalog entries.
- `docs/billing.md`: approved status and unchanged configured service-fee impact, exclusions and validation limitations.

Controller, camera, radius/filter logic, bottom sheet, video/story interactions, all six destination records/coordinates, global stylesheet and protected production pages are byte-for-byte unchanged against `protected.sha256`.

## Rollback

`rollback.tar` contains the pre-change prototype page, stylesheet and canonical billing file; `rollback.tar.sha256` verifies it. All older checkpoints remain. The new focused test did not exist before this phase. For a future approved rollback, extract the archive into a separate directory, compare against later work, and restore coherently; do not reset the dirty worktree or overwrite subsequent edits. No rollback was performed.

## Focused validation

Executed sequentially:

```sh
NODE_OPTIONS=--max-old-space-size=192 UV_THREADPOOL_SIZE=1 RAYON_NUM_THREADS=1 \
  mise exec -- node --experimental-strip-types --test --test-concurrency=1 \
  tests/imap-marker-color.test.ts tests/imap-neighborhood.test.ts
```

Result: **12 passed, 0 failed/skipped**, approximately 1.77 seconds. Checks cover default fill, removal of alternative fill overrides/switch/query handling, inherited selected fill plus rings, neutral cluster/count contract, white/navy luminance contrast, combined category/search/radius behavior, existing geolocation/movement callbacks, clustering geometry, marker clicks and existing sheet/video-first source contracts. These tests are not rendered-browser verification or the complete regression suite.

Rollback/archive and protected-file SHA-256 checks passed, including the earlier color-experiment archive. OOM counter stayed at 29 events / 6 kills. Before work, approximately 936 MiB container headroom was available; no workers or extra servers were launched.

No full application build, type-check, full suite, PDF generation or browser visual inspection. The existing static preview was not rebuilt/restarted and still serves the previous experiment revision. After an authorized build, inspect http://localhost:4321/imap-prototype/?presentation=1 on desktop/mobile: every marker navy, white icons, light double selection rings, clear cluster counts, no switch. Old red-query links should also show navy. Full follow-up commands on a capable machine: `npm run check`, `npm run build`, `npm test` (use the environment's required manager wrapper). Do not run these implicitly as part of this focused source task.

Stop after this implementation. Sprint 04B.3 has not begun.
