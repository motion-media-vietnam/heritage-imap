# Sprint 04B.3B — interactions and empty states

Implemented only for `/imap-prototype/`. Stop for client acceptance; no production integration or content population.

## Changed files

- `src/lib/imap-neighborhood.ts`: pure helpers for explicit default-filter reset (retaining the accepted center) and distinct empty messages. Existing matching, category definitions/icons, radius, distance and clustering algorithms are untouched.
- `src/scripts/imap-prototype.ts`: wire Xóa bộ lọc to default search/category/radius/neighborhood values and refresh the circle/results without fitting/recentering the camera; focus the stable search control without scrolling. Synchronize empty copy, accessible feedback, clear-action visibility and removal of selections excluded by filters. Existing marker selection, story open/close, video, sheet, camera/zoom/radius-choice and location handlers are unchanged.
- `src/pages/imap-prototype.astro`: conditional friendly empty-message region, explicit clear action below the list/empty state and screen-reader live feedback near existing counts. Existing controls, headline, layout, story templates and sheet structure retained.
- `src/styles/imap-prototype.css`: exactly three added rules: selected list-name underline (not color-only), empty paragraph margin, and 44px underlined clear action. No changes to approved layout/scrolling/sheet/video rules or marker styles/rings.
- `tests/imap-interactions.test.ts`: six focused tests using only existing destinations and controlled DOM/callback execution.
- `docs/billing.md`: conditional USD $0/month incremental configured service subtotal, scope, exclusions and browser/PDF limitations. No new supplier or price claim.

## Interaction contract

Xóa bộ lọc is available below the directory when any filter differs from defaults or the result is empty. It resets query to empty, category/neighborhood to All, and radius to 1 km. It never changes the accepted center, requests a camera fit, or widens a radius automatically. A previously selected destination stays selected if still eligible; otherwise existing story/video cleanup runs, selection/reopen state clears, and accessible feedback explains the change. Existing map camera position/zoom is retained. The approved explicit radius-choice behavior remains unchanged.

Empty messages distinguish:

1. Selected category has no published entries in the complete six-record catalog, independent of query/radius/neighborhood.
2. Search term matches no entries in the complete catalog.
3. Search/category may have entries, but combined radius/neighborhood filters have no results.

No fabricated entries or automatic filter/center changes. All three currently empty categories remain honestly empty. On mobile, open the existing discovery sheet to see the empty copy/action; the persistent count and screen-reader feedback remain outside the sheet. The three-state draggable sheet implementation is unchanged. No new map-facing controls or toolbar rows.

## Checkpoint and preservation

`rollback.tar` contains the five pre-change files; `rollback.tar.sha256` passed. The new interaction test did not exist before this phase. Older checkpoints remain untouched. Extract a rollback archive to a separate directory and compare later edits before any approved restore; never reset the dirty worktree.

`protected.sha256` passed for destination records/coordinates, districts, camera helpers, mobile-sheet helpers, story helpers, category registry, global stylesheet, homepage, production iMap and HeritageChoice. A direct comparison of all marker/cluster CSS rules against the rollback archive matched exactly. The stylesheet diff contains only the three additive interaction rules, preserving approved layout and navy `#203A5E`, white icons, geometry and light selection rings.

## Sequential validation — passed

This session's own idle TypeScript diagnostic process tree was confirmed under the current Pi parent and released, together with the single preview before compilation. Other Pi sessions were not stopped. Headroom recovered from near the 2.50 GiB container limit to about 828 MiB before validation. No parallel validation workers. JavaScript heaps were bounded.

1. `NODE_OPTIONS=--max-old-space-size=384 UV_THREADPOOL_SIZE=1 RAYON_NUM_THREADS=1 mise exec -- npm run check`: 48 files, 0 errors/warnings/hints.
2. `NODE_OPTIONS=--max-old-space-size=192 UV_THREADPOOL_SIZE=1 RAYON_NUM_THREADS=1 mise exec -- node --experimental-strip-types --test --test-concurrency=1 tests/imap-interactions.test.ts tests/imap-marker-color.test.ts tests/imap-neighborhood.test.ts tests/imap-prototype-camera.test.ts tests/imap-prototype-init.test.ts`: **33 passed, 0 failed/skipped**, about 3.87 seconds.
3. `NODE_OPTIONS=--max-old-space-size=192 UV_THREADPOOL_SIZE=1 RAYON_NUM_THREADS=1 mise exec -- npm run build`: **9 pages passed**, about 1.14 seconds.
4. `NODE_OPTIONS=--max-old-space-size=96 UV_THREADPOOL_SIZE=1 RAYON_NUM_THREADS=1 mise exec -- node node_modules/astro/bin/astro.mjs preview --background --host 0.0.0.0 --port 4321`: one preview, PID 93170 at validation time.

The six new tests cover center-preserving default reset, distinct empty reasons, actual filter callback count/list/marker-input/selection synchronization, no automatic fallback, actual clear callback control/circle/result synchronization without camera calls, composed search/category/radius/neighborhood filtering, live-feedback markup and non-color list cue. Existing tests cover correct marker/story and cluster routing, close/minimize context, real Leaflet geometry/RAF cancellation, radius counts 1/2/5/6, initialization, native camera invariants and video-first sheet contracts.

These are controlled VM/geometry/source checks, not browser screenshots or real touch/keyboard/screen-reader trials. The full unrelated project test suite was not run.

## Refreshed preview / delivery evidence

- http://localhost:4321/imap-prototype/
- http://localhost:4321/imap-prototype/?presentation=1

Both served HTML responses exactly match fresh `dist/imap-prototype/index.html`:
`e14d0efb6ff9ec1eecc7cd8eab522ef24c1ef198d9823ff4164039a98bd179fd`.

Fresh stylesheet `/_astro/imap-prototype.DpXBdojY.css` matches its served asset SHA-256:
`46db0081fc99ed6104dc9ff3a3455f053f048da577cbec5f55b642d5758c7cdf`.

Fresh controller `/_astro/imap-prototype.astro_astro_type_script_index_0_lang.D7DXYtbu.js` matches its served asset SHA-256:
`4f4f7e017cf7207272e8ea19affd620c5ebbd91d3bd29b5da6f3ed641df21cf6`.

Only one Astro server was found after restart. Final measured container usage ~1.89/2.50 GiB; OOM counters stayed at 29 events / 6 kills. Public/external hostname is not provided/configured, so external routing/cache delivery is not verified. No browser executable was found; no packages/browsers installed.

## Manual acceptance remaining

Hard-refresh at 1440 × 900 desktop and 390 × 844 mobile (also 360px width):

- Choose Food & Drink/Stay/Experience: zero count, honest category-empty copy, no fake markers. Open the discovery sheet on mobile to access the directory/clear action.
- Search an unmatched term in All: distinct search-empty copy. Search Phố Cổ with sightseeing + Hoàn Kiếm: 500m excludes it, 1km includes it.
- Pan/zoom manually, set combined filters, then activate Xóa bộ lọc: all four filter defaults restore; accepted center and camera stay put. Confirm focus moves to search without page scrolling.
- Open stories from markers and list rows: correct name/content, underline on selected list row, existing selected marker ring/name. Filter out that destination: close story, clear highlight/reopen state, synchronize counts/list/markers and accessible feedback.
- Close/minimize/reopen stories and drag all three sheet states: no unexpected map jumps, 16:9 frame preserved, map usable minimized, focus/touch controls and attribution remain accessible.
- Confirm real screen-reader announcements, keyboard focus and mobile gestures; these cannot be established by the automated fixture.

PDF remains stale under instance generation restrictions. Stop after 04B.3B; no production integration or content population.
