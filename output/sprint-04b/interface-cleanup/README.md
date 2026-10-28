# Sprint 04B.3A — interface cleanup, awaiting browser approval

## Changed files

- `src/pages/imap-prototype.astro`: neutral page title; short radius/neighborhood labels; accessible radius/location/approximate-position descriptions; technical district tooltip removed; technical paragraph retained but hidden. Destination name/category/area now have separate presentation hooks. Short visitor-facing initial status and no-JavaScript notice. All control IDs, options/values, selection attributes, list ordering, story templates and sheet states remain.
- `src/styles/imap-prototype.css`: development-only notes hidden regardless of presentation query; reduced desktop header/intro/control whitespace; clearer destination typography; compact mobile headline and controls. No marker, camera, story, scroll-container, sheet/drag/transition or attribution rules changed. Existing fonts/colors retained.
- `src/scripts/imap-prototype.ts`: only map-status string literals changed to concise visitor language. No controller logic, timing, event registration, geolocation handling, filtering, radius/camera or marker behavior changed.
- `docs/billing.md`: source implementation status and conditional USD $0/month incremental configured vendor fees, exclusions, viewport/tile-demand uncertainty and validation limits. Existing PDF remains stale.

Technical notes remain in source and existing documentation/checkpoints. Required OSM attribution remains unchanged. Permission/failure messages remain visible and live-announced; concise radius/location/position caveats are associated with their controls/map for assistive technology. Existing approximate-pin/directions and missing-video notices in stories remain because they are important visitor guidance, not density/implementation notes.

## Checkpoint / evidence

`rollback.tar` contains all four pre-change files; its SHA-256 check passed. Older checkpoints remain untouched. Extract into a separate directory for any approved future rollback and compare later work; never reset the dirty worktree or overwrite later edits blindly.

`protected.sha256` passed for destination data, district membership, category registry, neighborhood filtering/icons, camera helpers, story helpers, mobile-sheet helpers, global CSS, homepage, production iMap and HeritageChoice component.

A direct comparison of every `.curated*` and `.cluster-count` CSS rule against the archive matched exactly, including navy `#203A5E`, white SVG color, 48px geometry, cluster badge and selected light double rings. Controller diff showed only map-status text replacements; all map behavior code is unchanged. The old technical notes remain hidden rather than deleting records/documentation. No new destination content was introduced.

## Resource-limited validation

Container limit remains 2.50 GiB. Initial usage was about 2.31 GiB; usage rose to about 2.46 GiB (~44 MiB headroom) at the validation gate. Do not launch a test runner/compiler in that margin. No build, explicit type-check, tests, server starts/restarts or browser session was run. Harness automatic file diagnostics occurred but are not full validation. Source review/diffs/checksums only. OOM counters remained 29 events / 6 kills at the recorded check.

The static preview was left untouched and still serves the previous navy build, NOT this cleanup. No fresh public/browser acceptance is claimed. A smaller header/new viewport can change calculated camera framing through the existing geometry-aware code; no camera logic was edited, and real layout/framing must be reviewed.

## Refresh / desktop and mobile instructions

After recovering sufficient memory or on a capable machine, run sequentially with the repository manager wrapper (commands NOT executed in this task):

```sh
# Stop the current single static preview before compilation on the small runtime.
mise exec -- node node_modules/astro/bin/astro.mjs preview stop
NODE_OPTIONS=--max-old-space-size=192 UV_THREADPOOL_SIZE=1 RAYON_NUM_THREADS=1 \
  mise exec -- node --experimental-strip-types --test --test-concurrency=1 \
  tests/imap-marker-color.test.ts tests/imap-neighborhood.test.ts \
  tests/imap-prototype-camera.test.ts tests/imap-prototype-init.test.ts
# Only with explicit approval for the resource-heavy rebuild:
NODE_OPTIONS=--max-old-space-size=192 UV_THREADPOOL_SIZE=1 RAYON_NUM_THREADS=1 \
  mise exec -- npm run build
NODE_OPTIONS=--max-old-space-size=96 UV_THREADPOOL_SIZE=1 RAYON_NUM_THREADS=1 \
  mise exec -- node node_modules/astro/bin/astro.mjs preview --background --host 0.0.0.0 --port 4321
```

On a non-container/native development machine use the already configured toolchain instead of forcing mise. No package installation is authorized by these instructions.

Review http://localhost:4321/imap-prototype/ and http://localhost:4321/imap-prototype/?presentation=1 after the refresh. No public/external hostname is configured or verified. Hard-refresh to avoid old assets.

Desktop: 1440 × 900 and 1024 × 768. Mobile: 360 × 800, 390 × 844 and 430 × 932, plus landscape/200% text zoom. Check:

1. Headline preserved; no prototype badge, density target, integration note, technical district/session text or lengthy data paragraph in either URL. Technical notes must not flash before CSS loads after page paint.
2. Four discovery controls plus locate/count remain usable, with 44px control heights and no horizontal overflow. Headline/control wrapping and visible map area require actual browser review.
3. Name/category/area hierarchy, selection, directory scrolling, empty results and scoped cluster lists work as before; no new destination content.
4. Navy markers, white icons, selected rings, neutral cluster icon/count, radius result counts 1/2/5/6 and manual pan/zoom behavior remain. Test rapid radius changes and orientation/resize after changing layout dimensions.
5. All three draggable sheet states, original landscape video-first frame, story open/close/reopen and focus restoration. No sheet implementation was changed.
6. Permission denied/unsupported location, map failure/retry, screen-reader live messages, caveat descriptions and unobscured OSM attribution. Do not run automated external tile scans; manual review only unless tiles are appropriately stubbed/permitted.

No screenshots, actual touch/keyboard/screen-reader trials or browser geometry measurements are claimed. Stop for visual approval; do not start 04B.3B or production integration.
