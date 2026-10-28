# Sprint 05B.1 — conditional prototype destination integration

Stop for visual/functional review. No production integration, media population or Sprint 05C.

## Result and conditional content scope

`/imap-prototype/` now uses a route-only catalog derived from the approved local 05A.1 manifest. The explicit five-ID allowlist adds:

- `den-ngoc-son`
- `nha-tho-lon-ha-noi` — explicitly provisional reference pin, not a verified entrance
- `pho-sach-dinh-le` — exact approved angle: “Nơi Hà Nội cất giữ những trang sách cũ.”
- `sofitel-legend-metropole-hanoi`
- `nha-hat-mua-roi-thang-long-hoan-kiem`

The original six Place objects/IDs/coordinates/content are retained. Therefore there are **seven destinations within the default 1 km**, **eleven across All**, not eleven new destinations. The four original out-of-radius records remain available in wider filters, rather than being deleted to force a seven-record global catalog.

| Radius, before other filters | Destination results |
| --- | ---: |
| 500 m | 5 |
| 1 km | 7 |
| 2 km | 10 |
| All | 11 |

Default 1 km categories: four `stamp-worthy-spot`, two `experience`, one `stay`, zero `food-drink`. The category registry remains the approved four IDs/labels/icons. Zero food markers are honest: Café Giảng stays held in the untouched manifest with its coordinate conflict. It has no display record, directory button, template or marker. La Terrasse is a food/drink story inside Metropole, not an independently filterable food destination or another pin.

Exactly two linked stories remain: La Terrasse → Metropole; pedestrian experience → Hồ Hoàn Kiếm. Neither has coordinates/markers. Nhà sách Mão is not added as another destination. Retired ice cream is not integrated. No invented coordinates, records, prices, opening hours or media.

New story text uses the approved draft angles, with short visitor-facing excerpts for hotel/theatre/pedestrian entries that omit internal editorial instructions without introducing historical/schedule claims. Five new 16:9 frames explicitly say photos/video are not approved and are waiting for content; no stock/generated/borrowed destination pictures, SVG pseudo-photos, video URLs or embeds were introduced. Existing six labeled illustrations remain confined to the original records. Linked stories have explicit missing-media/access notices. This implements the owner's conditional prototype placeholder exception, not full publication/media approval under the shared verified-content contract.

## Changed files

- **New** `src/data/imap-prototype.ts`: local JSON-backed allowlist/catalog, source-address notes, held ID, two linked stories and prototype-only neighborhood membership/counts. No runtime fetch/geocoder/Places API. Original production data/district files remain untouched.
- `src/lib/imap-neighborhood.ts`: allow absent illustration metadata for new content and accept an optional district-membership argument. Existing callers retain their original default; search/category/distance/radius/clustering/reset/empty-state algorithms unchanged.
- `src/lib/imap-prototype.ts`: type-only generic widening of `nearbyDestinations` to the slug/coordinate fields it already uses. Runtime helper body and legacy data stay unchanged.
- `src/scripts/imap-prototype.ts`: import the isolated catalog/membership and supply membership to the four filtering calls. All marker, camera/zoom, radius-choice, reset, selection, story, video, gesture and sheet implementation remains unchanged.
- `src/pages/imap-prototype.astro`: shared isolated catalog for initial count/list/templates/options; original illustrations only for original records; explicit new media placeholders; reference addresses/source links and provisional-pin warning; linked-story text within existing scrollable story panel. Main layout/controls/sheet/video architecture retained.
- `tests/imap-interactions.test.ts`: parameterize the controlled filter harness without losing legacy cases; add actual filter/reset callback checks for the new catalog.
- **New** `tests/imap-prototype-content.test.ts`: audit identity/pin preservation, 5/7/10/11 counts, composed search/category/neighborhood filters, held/linked exclusions, placeholders, Dinh Le angle, selection and nearby contracts, production-route isolation.
- `docs/billing.md`: conditional USD $0/month incremental configured vendor subtotal, unmeasured extra static-byte transfer/storage, existing map-limit uncertainty and exclusions. PDF remains stale under generation restrictions.

No changes to the prototype stylesheet, marker shape/size/white icons/navy `#203A5E`/selected rings, global palette, camera helpers, mobile sheet helpers, original places/districts, homepage, production iMap or HeritageChoice.

## Checkpoint and audit commit

`rollback.tar` contains the six pre-existing changed files (page/controller/neighborhood helper/prototype helper/interaction tests/billing). `rollback.tar.sha256` passed. The new data module and new content test did not exist before this task. Existing checkpoints are preserved. For a future approved rollback, extract to a separate directory and compare later work first; do not reset/rewrite Git history or overwrite later edits.

`protected.sha256` passed for original places/districts, category registry, camera/mobile helpers, prototype/global stylesheets, production pages/HeritageChoice and both 05A audit deliverables. The approved audit commit remains HEAD:

`94690029a30a28c6185baf68bdefbfe9e7d6325c`

No commit, push, authentication/configuration change, reset or force operation was attempted in 05B.1. GitHub delivery is not a prerequisite and was not changed.

## Sequential validation — passed

Before validation, this harness's own idle diagnostic worker trees were released and the previous single preview was stopped. Other Pi sessions/services and the GPG agent were not touched. The container remains limited to 2.50 GiB. OOM kills increased from 6 to 7 during editing/background pressure; counters alone do not identify which process was killed. After releasing owned diagnostics and the preview, headroom recovered to about 789 MiB. **No further OOM kill occurred during checker/tests/build/preview verification.**

Executed one at a time:

```sh
NODE_OPTIONS=--max-old-space-size=384 UV_THREADPOOL_SIZE=1 RAYON_NUM_THREADS=1 \
  mise exec -- npm run check
# 50 files: 0 errors, 0 warnings, 0 hints

NODE_OPTIONS=--max-old-space-size=192 UV_THREADPOOL_SIZE=1 RAYON_NUM_THREADS=1 \
  mise exec -- node --experimental-strip-types --test --test-concurrency=1 \
  tests/imap-prototype-content.test.ts tests/imap-interactions.test.ts \
  tests/imap-marker-color.test.ts tests/imap-neighborhood.test.ts \
  tests/imap-prototype-camera.test.ts tests/imap-prototype-init.test.ts
# 41 passed, 0 failed/skipped; about 3.74 seconds

NODE_OPTIONS=--max-old-space-size=192 UV_THREADPOOL_SIZE=1 RAYON_NUM_THREADS=1 \
  mise exec -- npm run build
# 9 pages passed; about 1.34 seconds

NODE_OPTIONS=--max-old-space-size=96 UV_THREADPOOL_SIZE=1 RAYON_NUM_THREADS=1 \
  mise exec -- node node_modules/astro/bin/astro.mjs preview --background --host 0.0.0.0 --port 4321
# Exactly one Astro preview, PID 96073 at verification time
```

Tests cover both the preserved six-record baseline and the new combined catalog. Real Leaflet geometry/RAF fixture checks remain independent of rendered DOM/browser layout. The complete unrelated test suite was not run. No packages/browsers installed and no external tile scanning/automated media playback.

## Refreshed origin preview and delivery evidence

- http://localhost:4321/imap-prototype/
- http://localhost:4321/imap-prototype/?presentation=1

Both local HTTP responses match fresh `dist/imap-prototype/index.html` SHA-256:
`c42eedfe164bfc4280687980e3bafecdd57505217de9ecc6f34f698d90f2a4ab`.

Served CSS `/_astro/imap-prototype.DpXBdojY.css` matches build SHA-256:
`46db0081fc99ed6104dc9ff3a3455f053f048da577cbec5f55b642d5758c7cdf`.
This CSS asset is unchanged from 04B.3B.

Served controller `/_astro/imap-prototype.astro_astro_type_script_index_0_lang.C2EaJDE1.js` matches build SHA-256:
`1b12320b20a216cecd2380db2bc766f4dc02c5c47409e2bc5bc4a20f68f7d0c7`.

Built/live HTML confirms initial **7 địa điểm**, seven initially visible directory entries, four preserved wider-radius entries hidden initially, eleven story templates, exactly two linked-story sections and five explicit new-media placeholders. No Giang/retired-ice-cream/linked-story directory or marker record is generated. Geographic clustering may combine multiple destinations into one neutral icon/count; result count refers to destinations, not necessarily independent rendered pin icons.

Only one Astro server was found. Final measured memory about 1.94/2.50 GiB, OOM counters 47 events / 7 kills. No public hostname is supplied/configured in preview URL variables, so **external/public proxy routing, CDN/browser caching and client-visible delivery are not verified**. The local origin is demonstrably fresh; use the existing public forwarding URL if available and hard-refresh. Do not present the container-private network address as a public URL.

## Browser acceptance still required

No Chromium/Firefox/browser executable is available. No screenshots, rendered layout, touch gestures, keyboard focus or real screen-reader playback trials are claimed. On desktop 1440 × 900 and mobile 390 × 844 (also 360px width), hard-refresh and check:

1. Default 1 km lists seven; 500 m / 2 km / All show 5 / 10 / 11. Hoàn Kiếm grouping includes all five new records without changing the old four out-of-radius records.
2. Search Đinh Lễ and rối Thăng Long with Experience + Hoàn Kiếm; stay category shows Metropole at 1 km and honest zero at 500 m. Food remains empty while Giang is held. Clear restores defaults without changing accepted center or camera.
3. Each new marker/list selection opens the correct title/angle; list underline, navy marker rings/name, cluster scoped lists, counts and results stay synchronized. Changing filters hides/clears an excluded selection correctly.
4. Closing/minimizing/reopening and dragging all three sheet states preserves map context. The complete original 16:9 video frame remains; placeholders are obvious, not purported real media. No new asset playback should occur.
5. Cathedral warning is visible; source-address links are reference-only. La Terrasse appears only inside Metropole and pedestrian story only inside the lake; neither becomes another marker/category result.
6. No horizontal overflow from longer destination names/addresses, accessible 44px controls/focus/live feedback, attribution above the mobile sheet, and unchanged radius flight/manual-pan cancellation behavior. No Google Places or runtime content/geocoding requests.

Stop after 05B.1 for visual/functional acceptance. No Sprint 05C or production publication.
