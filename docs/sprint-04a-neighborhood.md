# Sprint 04A — neighborhood-first map discovery

October 19, 2026. **Implemented in the isolated `/imap-prototype/` only; awaiting visual approval. No production integration or destination migration.**

## 1. Review preview and screenshots

Prototype: **http://localhost:4321/imap-prototype/**

Cleaner presentation: **http://localhost:4321/imap-prototype/?presentation=1**. This only hides the existing development labels, not radius/location controls, factual media notices or OSM attribution.

**No screenshots are supplied.** No browser, Chromium/Firefox executable, Playwright installation or browser automation tool is available in this environment. No browser/package was installed and no screenshot/mockup was fabricated. Rendered desktop/mobile layout, real touch/permission dialogs, attribution visibility and geographic tiles remain **pending browser review**, not passed checks. Local production HTTP and module delivery were verified; no public/external preview hostname was verified.

Stop for owner visual approval before integrating anything into homepage or `/imap/`.

## 2. Exact source changes

- `src/pages/imap-prototype.astro`: isolated 04A labels, five discovery-category options, independent former-district filter, radius controls, explicit location/privacy text, compact discovery bar, area-search/retry controls and category symbols in the directory. Initial HTML already filters the directory to the actual default area; all six story templates remain available.
- `src/scripts/imap-prototype.ts`: neighborhood state, geographic filtering, explicit one-shot location, pending-area behavior after manual pan, category markers/clusters, accessible cluster directory, selected names and measured video-first sheet opening. Adds lifecycle cleanup and guarded map retry; retains OSM configuration and native no-autoplay story/video behavior.
- `src/styles/imap-prototype.css`: isolated control-row layout, restrained category palette, 48px marker targets/count badges and compact 52px mobile discovery. Existing desktop 22/45/33 selected and 22/78 closed proportions, landscape media framing, story typography and attribution-offset/reduced-motion behavior remain.
- `src/lib/imap-neighborhood.ts` **(new)**: pure radius/category/search/district filtering, center/location validation, manual-area threshold, static icon definitions and screen-space clustering. Prototype-only category types can represent future approved food/coffee/culture/accommodation records without mislabeling them as production sightseeing data.
- `tests/imap-neighborhood.test.ts` **(new)**: eight bounded geographic/category/location/pan/cluster/selection/accessibility-contract regressions.
- `docs/billing.md`: business impact and current primary OSM policy review.
- `docs/sprint-04a-neighborhood.md` **(new)**: this handoff.

Generated evidence/checkpoint files are under `output/sprint-04a/`; the requested validation refreshed `dist/`. No existing production source, existing regression, dependency manifest/lockfile, destination record, coordinate or public asset was changed. The old isolated 02B presentation is recoverable from the pre-work archive; this explicitly authorized 04A prototype iteration is not a new production design approval.

## 3. Discovery behavior

### Geographic area, not administrative boundaries

- Initial center is the existing sample coordinate for Hồ Hoàn Kiếm: **21.0286, 105.8525**. This is public sample data, not a captured user location.
- Initial radius is **1 km**. Options are **500 m, 1 km, 2 km, All**.
- Haversine distance uses the existing geographic-distance helper and actual approved coordinates. Search, category and the former-district filter intersect with the radius; radius is never inferred from district membership.
- The dashed circle represents the geographic radius. It is **not** a walking route, verified entrance or guarantee that every included point is safely walkable. No walking time or routing result is invented.
- Initial camera frames the chosen radius circle, not the dispersed six-place bounds. Marker selection, close/reopen, category/search/district/radius filtering do not automatically fit all places or recenter the camera.
- **All** removes the radius filter and circle but leaves the camera where it is. It does not automatically zoom out to all of Hanoi. Off-screen results remain reachable through the directory/manual exploration.
- **Về Hồ Hoàn Kiếm** explicitly restores the discovery center and 1 km radius. Existing query/category/district filters are retained, so a conflicting filter can honestly yield zero results.

### Location and manual panning

- `getCurrentPosition` is called only from **Dùng vị trí của tôi**, once per click; the button is disabled while the request is pending. No automatic permission prompt or location watcher.
- Denial, unsupported/insecure context, error or invalid coordinates preserves the existing manual center/filters. The user can still use the directory, radius/category/district/search controls and, when the map works, pan to another area.
- A real map drag or keyboard pan enables an area suggestion. Once the camera is at least **100 m** from the discovery center, **Khám phá khu vực này** is offered. Panning itself never changes the discovery center/results or continuously recenters.
- Accepting that button adopts the current camera center and refreshes results **without moving the camera**. If the radius was All, accepting a new neighborhood explicitly switches to 1 km so the action actually searches an area.
- A successful explicit location request may move the camera once to the requested area; normal exploration afterwards is not followed/recentered. Reset is also an explicit action.
- The application keeps location in page memory only: no storage, cookies, query-string coordinates or precise coordinate labels. Browser/OS location processing is outside this app; the UI notes that OSM loads tiles for the viewed area. No reverse geocoder or paid location API is added.

## 4. Category markers and density handling

Supported symbols: **landmark, utensils, coffee, theater, bed**. All six current records are honestly classified as heritage/sightseeing; the four other category filters show **zero**, not fabricated venues. Future approved prototype records can use those categories; none were created here.

- Markers have **48×48px** targets, names/action labels, keyboard support and a red selected state. Selected destination names remain visible in a permanent tooltip; selected clustered groups retain the selected destination's name.
- The original record index remains as non-visible `data-marker-number` metadata for a possible future numbering presentation. There is **no itinerary mode toggle, itinerary planning, route ordering or route API**.
- Markers whose projected screen points are closer than **56px** form connected groups, including cross-cell/transitive collisions. This is client-side grouping, not a new service/plugin.
- A group is represented at one of its **existing real member coordinates**; when selected, it uses the selected member. No destination pin is shifted/jittered and no destination coordinate/record is invented.
- A cluster displays its count and opens a scoped destination list, rather than automatically zooming/recentering or repeatedly requesting tiles. Choosing a member opens that member's original story. The list has a return-to-all-filtered-results action; coincident positions remain selectable even if zoom cannot separate them.
- Reprojection/grouping follows viewport changes and manual pan/zoom. No 12-marker/database cap or automatic radius widening is applied. 8–12 is an editorial density target, not a truncation rule. Large-catalog performance still needs measurement before a later scale-up; only six real records exist today.

## 5. Video-first and mobile/desktop behavior

The prototype now uses the existing approved geometry helper for a **52px discovery bar plus safe-area padding**, collapsed by default. Both directory and story are absent from the collapsed mobile view. Tap/keyboard activation or upward drag opens discovery. The map remains the primary surface; header/tools and browser visual viewport changes are accounted for without adding spacer elements.

Destination selection uses the existing story templates: category/title, then the original uncropped **16:9** media area, then introduction/practical/directions/nearby information. The sheet is unhidden before measuring title/frame height and opens at half-or-required height, capped at 90% of the available explorer; short screens scroll rather than crop/shrink the original landscape frame. Native controls, inline/fullscreen compatibility and no-autoplay behavior are preserved. Practical content remains below the video area.

Closing/collapsing stops the media, keeps selection/camera and returns to map-focused discovery. Desktop still uses the original three-area story panel and closed map proportions. Resize/transition invalidation preserves center/zoom. Handle pointer capture/touch-action prevents map dragging through the sheet; directory and story retain their own single scroll owner. Actual touch behavior and safe areas still need browser verification.

No dedicated destination videos exist in the registry. Honest prototype-only illustrative frames remain, not playable missing-media thumbnails. No unrelated Hanoi overview, new source URL or video asset was substituted. HTML sizing alone is not proof of real HD/codec/playback compatibility; verify original Vietnam Airlines-compatible horizontal files when supplied.

## 6. Real density and client records needed

Derived from unchanged coordinates; rounded straight-line distances, not measured walks:

| Existing destination | Distance from default center |
| --- | ---: |
| Hồ Hoàn Kiếm | 0 m |
| Phố Cổ | 830 m |
| Hoàng thành Thăng Long | 1,464 m |
| Văn Miếu | 1,770 m |
| Cầu Long Biên | 1,788 m |
| Hồ Tây | 2,688 m |

| Radius | Actual destinations | Count |
| --- | --- | ---: |
| 500 m | Hồ Hoàn Kiếm | 1 |
| **1 km — default** | Hồ Hoàn Kiếm, Phố Cổ | **2** |
| 2 km | Above plus Hoàng thành Thăng Long, Văn Miếu, Cầu Long Biên | 5 |
| All | All six approved records | 6 |

Evidence: `output/sprint-04a/density.json`. No existing location was moved inward to meet the target.

**Need 6–10 additional verified destinations inside the default 1 km geographic area** to reach 8–12, subject to actual public access and review. A useful intake request, **not invented destination records**, is two food/restaurants, two coffee/tea, one performing-arts/culture and one accommodation record: six additional records would reach eight with the two existing sights. Up to four further suitable verified records could support the upper target. Do not force a category quota or add unsuitable venues merely to fill a count.

For each real record, request stable ID, approved name/category, actual sourced WGS84 coordinates and entrance/access meaning, short editorial introduction, cover/alt/credit/rights and destination-specific original 16:9 HD video metadata/rights when available. Optional address/hours/tickets/accessibility/transport details need official sources, checked dates and reviewer approval. No prices, venues, opening hours, coordinates, rights or video links were guessed. Approve record sourcing and any later adapter/schema changes before adding them; no production migration occurs in this sprint.

## 7. Validation results and limits

| Check | Result |
| --- | --- |
| Astro type check | **Pass: 42 files, 0 errors/warnings/hints**, bounded 384 MB heap |
| Production build | **Pass: 9 routes** |
| New focused neighborhood regressions | **8 passed** |
| Complete offline regressions | **54 passed, 4 live-only cases deferred** in that phase |
| Complete live-configured regressions | **58 passed, 0 failed, 0 skipped**, including all existing homepage/full-map/prototype integration regressions |
| Local prototype HTTP | Complete document; default 1 km selected, count 2, exactly Hồ Hoàn Kiếm/Phố Cổ initially visible in directory, all six templates retained |
| Frozen production/data/assets/config and rollback hash | **Pass** |
| Browser, screenshots, actual geographic tiles, real HD playback | **Not performed / pending** |

New tests exercise actual extracted permission-denied and map/click callbacks in a controlled Node VM, plus real-coordinate distance/category/filter helpers. They prove denied permission preserves manual state, panning only offers a change, explicit acceptance does not move the camera, single markers route to stories and groups route to lists. These are **not** OS permission dialogs or real Leaflet DOM interactions.

Clustering tests cover transitive/negative-cell collisions, a 20-screen-point group (no 12-record cap), and Web Mercator projections of the **six real coordinates** at simulated 360/390/430px widths and zooms 11/13/15/17. Cross-group points remain at least 56px apart. Synthetic screen points are not destination records. These are geometry simulations, **not screenshots, rendered hit-target measurements or proof of mobile touch usability**.

Source/contracts preserve selected names, 48px marker sizing, measured sheets, native no-autoplay 16:9 framing, OSM endpoint/referrer/attribution, single guarded connection and cleanup. Geographic tiles were not requested by automated tests; the current OSM policy prohibits automated pan/zoom tile scans. Browser automation added later should stub/block external tile traffic or use an appropriately permitted provider; normal human review follows the provider policy.

### Missing browser evidence / visual-approval checklist

On a capable machine/browser, capture **real** preview screenshots (none currently exist):

1. Initial map at 360, 390 and 430px: compact discovery bar, radius 1 km/count 2, no empty story heading, attribution/controls accessible and no horizontal overflow.
2. Select Hồ Hoàn Kiếm or Phố Cổ: title/landscape frame prominent, selected icon/name visible; close/reopen retains camera and selection.
3. All + manual zoom-out/grouping: tap cluster, choose member, return to all-filtered list; test keyboard Enter/Space/focus and tight tap targets. Confirm no fake pin movement.
4. Location button with actual denied permission: no prompt before click; manual center and filters survive denial. Do not screenshot precise personal coordinates.
5. Pan away: results stay anchored until “Khám phá khu vực này”; accept and verify no automatic camera movement, including zero-result areas. Reset explicitly returns to Hồ Hoàn Kiếm.
6. Desktop closed/story panel plus mobile drag, scroll, pointer cancellation, orientation/browser chrome and safe-area changes. Confirm map gestures do not fire through the handle and OSM attribution remains visible.
7. Real HD native playback/fullscreen only after original approved files are supplied; current placeholders cannot verify codecs, duration or viewing quality.

## 8. Checkpoint, resources, costs and stop point

Pre-work rollback: `output/sprint-04a/rollback.tar` and `.sha256`. It contains source/tests/docs/config/images, not dependencies/generated build output. Verify the hash and extract to a separate directory for review/recovery, not over ongoing work. Git HEAD alone does not capture this project's existing untracked approved work.

`frozen.sha256`/`frozen-results.log` cover unchanged production homepage and `/imap/`, layouts/components/Heritage, production map logic/styles/helpers, original destination/district/Heritage records, all public images and dependency manifests. No approved Hero/navigation, thumbnail, Heritage transition or production iMap architecture changed.

Validation ran sequentially. The old preview was stopped before compilation, this harness's own idle TypeScript workers were stopped to preserve headroom, and type-check startup required at least 600 MB free before its 384 MB heap cap. Build/tests used 192 MB, preview 96 MB. Other agent sessions were not terminated. Cgroup OOM counters remained `oom 16`, `oom_kill 4`; no new OOM kill was added. See `memory.log` and the separate check/build/test logs.

`docs/billing.md` records **USD $0/month incremental configured subscription/API fees before tax** under existing hosting/traffic assumptions, not a full business bill. Current OSM policy was reviewed at its primary source; no provider change or purchase occurred. New-record curation, hosting/transfer, rights and future HD delivery remain unquoted. The existing billing PDF is still stale; document generation is not authorized by this instance policy.

One bounded static production preview remains running; stop with `mise exec -- node node_modules/astro/bin/astro.mjs preview stop`. **Stop for visual approval. Do not integrate this prototype into homepage or `/imap/`, migrate destination data, add invented records or implement itinerary planning.**
