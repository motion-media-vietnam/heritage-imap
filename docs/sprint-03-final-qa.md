# Sprint 03 — final QA and destination-content architecture

October 19, 2026. **QA/architecture handoff, not release approval.** Heritage desktop/mobile and its thumbnails/content/transition are visually approved by the owner. This session did not perform browser visual verification. Hero/navigation and the approved iMap visual architecture remain frozen. No application source, destination record, coordinate, media asset, CSS, layout or playback logic was changed during this phase.

## 1. Result and remaining issues

**Recommendation: retain the frozen design, but do not call final iMap QA complete.** Build, source/unit regressions and local production HTTP delivery pass. The full Astro type check is blocked by its bounded heap, browser interaction checks are pending, and the standalone route has a confirmed mobile-parity gap.

| Area | Evidence obtained | Result / boundary |
| --- | --- | --- |
| Production build | Fresh `astro build`, 9 routes | Pass; build transpilation is not a full type check |
| Regression suite | 45 cases: 41 passed, 0 failed, 4 live-only cases skipped | Includes homepage/full-map built integration, selection/filter/radius/location helpers, bottom-sheet geometry, Heritage and tile-policy regressions |
| Full type check | `astro check` with 256 MB V8 heap, preview stopped | **Failed, exit 134:** JavaScript heap exhaustion before diagnostics completed; do not claim type-clean |
| Proposed schema type check | Isolated strict `tsc`, no emit, 128 MB heap | Pass; includes negative compile tests for draft publication, overview/portrait media, mismatched destination IDs and unsupported unverified facts |
| Homepage and `/imap/` delivery | Fresh production preview, complete HTML, unique IDs, one explorer per route, six title/frame templates, actual controller and Leaflet module HTTP 200 with JS MIME | Pass; does not execute browser code |
| Frozen Hero/navigation/Heritage/iMap/assets/data | `runtime.sha256`, made before this work | Exact source/asset equality; owner visual approval recorded, not newly re-verified pixels |
| Single mount / lifecycle | Execute the actual extracted custom-element class with a controlled animation-frame scheduler | Repeated connect notifications mount once; disconnect cleans once; reconnect creates a fresh lifetime; detach-before-frame cancels mount |
| Leaflet construction / listeners | Source guard + existing lifetime unit test | One guarded `L.map` construction site and one tile layer; `connecting` set before async import; abort-scoped DOM listeners; marker/layer/observer cleanup. Actual browser reconnect and duplicate-request counts remain pending |
| Marker/list synchronization | Same `openPlace` handler in source; repeated visible/filtered selection tests | Pass at source/unit level; real marker tapping is pending |
| Camera preservation | Close does not clear selected slug or call fitBounds; invalidateSize restores center/zoom; existing selection tests | Source verified. Live pan/zoom and reopen require browser acceptance |
| Search/filters | Existing tests combine accented/plain queries, category, district, origin and radius | Pass at unit/built-integration level; DOM synchronization visually unverified |
| Map failure indicators | Execute the actual extracted `loading`, `tileerror`, `load` callbacks | Failed tiles retain the failure message on load; stalled loading shows a timeout; success follows a no-error load cycle. Real browser network blocking/import failure injection remains pending |
| OSM configuration | Existing policy/AST tests and unchanged controller hash | URL, strict-origin-when-cross-origin referrer policy, attribution, max zoom and normal browser delivery preserved; no prefetch/proxy/provider change |
| Homepage mobile | Compact 52px + safe-area discovery path; hidden/inert collapsed panels; measured title/video snap; geometry tests | Source/unit checks pass. Dragging, Safari/browser chrome, attribution visibility, focus and scrolling remain pending browser checks |
| Standalone mobile | Production HTML lacks `data-mobile-discovery="true"`; `IMap.astro` opts in only for `home-imap` | **Known gap:** `/imap/` retains the old collapsed sheet (up to 112px) and directory heading, with no compact discovery button |

### Approval items, not silently implemented fixes

1. **High: standalone mobile parity.** Authorize extending the existing approved compact discovery behavior to `/imap/` (not redesigning it). Current full-route CSS also uses the older viewport/chrome calculation; account for its page/main padding when bringing it into parity. Keep the approved isolated prototype unchanged.
2. **Release gate: full project types.** Rerun `npm run check` on a capable machine. This container had roughly 2.18 GiB already in use against a 2.5 GiB limit before a larger retry would have been needed. Do not raise the heap or restart a heavier dev server here merely to force a green result.
3. **Release gate: browser acceptance.** Verify both routes at 360/390/430px and desktop widths: marker/list selections, close/reopen with pan/zoom, filtering to zero results, gestures/cancel, scrolling, safe areas, orientation/browser UI changes, visible attribution, keyboard focus and no horizontal overflow. No browser is installed; these are not passed tests.
4. **Content gate: production vs prototype.** Both current production-built routes show honest unverified video/practical placeholders, without an explicit prototype-only content gate. A later adapter/render policy must omit unverified optional facts and restrict editorial placeholders to explicit prototype mode.
5. **Category visibility decision.** The story template has category before title, but the frozen homepage mobile CSS hides that category kicker. Phase C's visible title/category requirement therefore needs a small approved presentation decision; it was not silently exposed here.
6. **Reliability follow-up.** Initialization exceptions destroy the map and offer manual retry, but a later ResizeObserver/window resize can invoke `connect()` again because no map remains. This is a source-observed retry path, not a reproduced request storm. Decide whether failure should wait exclusively for manual retry; do not add automated retries or new services.

The six videos remain absent. Real video loading, codecs, full-screen behavior, HD quality and viewing bandwidth cannot be accepted using illustrative frames. No general Hanoi overview is substituted.

## 2. Proposed reusable typed schema

The complete **proposal-only** contract is [`architecture/destination-content.schema.ts`](architecture/destination-content.schema.ts). It lives outside runtime source and is not imported into the app. No destination catalog has been migrated and no media URL has been invented.

| Requirement | Proposed field / rule |
| --- | --- |
| Stable ID | `DestinationId`: exactly the six existing slugs, reused as immutable IDs; `slug` remains separate for routing |
| Name / English name | `name`, optional `englishName`; existing Vietnamese alternate names become `aliases`, never invented English translations |
| Category / coordinates | Existing `Category`, readonly coordinates and explicit `approximate-editorial-pin` meaning |
| Short introduction | `introduction`; initially preserve existing approved editorial story, request approval for any shortening |
| Destination cover | Required `cover` slot: missing, pending-verification, or verified; real image path/alt/dimensions/bytes and destination ID when supplied |
| Destination HD video | Required `video` slot with the same states; destination-specific scope, original file source/MIME, 16:9 tuple, actual encoded dimensions, seconds and file bytes |
| Verification | Media has provenance, destination-match review, named approval, rights reference and review date; each optional practical field has its own non-empty official evidence list and checked date/reviewer |
| Practical information | Optional verified address, hours/timezone/exceptions, ticket price/conditions/tax treatment, recommended minutes, best time, accessibility, transport advice, official website and directions link |
| Related places | Optional `relatedDestinationIds`, validated against the catalog; no self/duplicate references |
| Last verified date | Optional `lastVerifiedOn` means last record review, not blanket verification of all facts |
| Prototype notes | Explicit `prototypeNotes`; omitted from the proposed published type and stripped by a future runtime allowlist |

`DestinationCatalog` correlates catalog keys with record/media IDs. `PublishedDestination` proposes a video-first release gate requiring verified cover/video and no exposed prototype notes. Current destinations are drafts, not silently promoted to publish-ready. If the business wants a production destination without real media, approve an explicit no-video policy separately; never substitute overview footage.

### Validation still required when integration is approved

Types are a contract, **not a runtime validator or proof of truth/rights**. A later small build-time validator must check:

- Unique six IDs; unchanged names/coordinates for this migration; matching record/cover/video IDs; valid category and related-ID references.
- Actual calendar dates, numeric ranges, valid currency codes and URLs. The ISO-date template type alone accepts invalid calendar values.
- Approved local asset paths or trusted HTTPS media sources; reject executable/data URLs, unavailable files and unapproved external sources. No new geocoder or video provider is required.
- Positive duration/byte counts, integer encoded dimensions >=1280×720, exact original 16:9 ratio and browser-supported codecs. Do not infer HD from a thumbnail or HTML width attributes.
- Source provenance, destination match and approved usage/rights conditions, including any expiry. Types cannot determine whether a file really depicts the destination.
- Verified per-field official evidence; date freshness and exceptions, especially holidays, night visits, ticket eligibility and access restrictions. Missing facts stay absent, not free/always-open/accessible defaults.
- Production allowlisting: only verified optional fields, no draft candidate URLs or prototype notes. Require explicit prototype mode for placeholders; do not rely solely on a public query parameter to grant publication.

### Minimal content architecture

Recommend local static typed records for six destinations, plus a pure adapter/view model. Keep the record files free of Astro/DOM/Leaflet imports; keep rendering in `IMapStory.astro` and map interaction in the existing controller. One catalog feeds homepage and standalone templates through stable IDs. No CMS, database, API, paid hosting product or new runtime dependency is needed.

Astro content collections can provide schema validation, but migrating the six existing records into a collection is not required for this bounded phase. The [Astro content-collections guide](https://docs.astro.build/en/guides/content-collections/) was consulted; no collection, loader or remote content source was added.

### Existing data → proposed records (after approval)

- `place.slug` → ID and initial slug; keep all six current coordinates byte-identical.
- `place.name/category/coordinates` → same fields; `place.vietnamese` → optional aliases, not English name.
- `place.story` → introduction without rewriting approved copy.
- Existing `PlaceArt` → prototype illustration only, **not** a verified destination photograph.
- Empty `dedicatedVideos` → `{ status: 'missing' }` for every destination. Unknown cover → missing cover state. Required slots need not pretend assets exist.
- Existing `practicalInformation['van-mieu']` is one dated prose record (checked October 17), not a complete set of structured verified facts. Reconfirm original evidence/reviewer and individual fields before importing; no current price/hours re-verification was performed in this phase.
- Existing editorial tips → prototype notes unless independently approved/verified; do not turn them into factual accessibility/transport claims.
- Existing nearest-neighbor suggestions are computed straight-line proximity, not client-curated related destinations. Keep that distinction; use explicit related IDs only when provided/approved.
- Existing OSM directions can remain derived from approximate coordinates, clearly labeled as approximate. An optional verified entrance directions link is a different field and must not silently change current coordinates.

## 3. Story UX contract (no redesign)

Retain the current panel/sheet, not a new page or player:

1. Destination title and category (mobile category decision above).
2. Original horizontal 16:9 HD video, object-fit:contain, native controls/inline behavior, no autoplay.
3. Short editorial introduction.
4. Compact, verified optional practical facts; omit absent fields in production.
5. Existing directions and relevant approved actions, distinguishing approximate pins from verified entrances.
6. Related destinations only when available, using existing in-panel selection.

Keep title/video measurement, panel expansion and close/camera preservation. On mobile, don't add a second title or put practical fields before video. On desktop, render in the existing story panel; do not navigate away or alter the approved column proportions. Media verification is separate from marker selection: selecting a draft must not fetch its candidate video.

## 4. Required future source changes — approval list

**No items below were implemented in runtime source.**

| File / area | Small change needed after approval |
| --- | --- |
| `src/components/imap/IMap.astro`, `src/scripts/imap.ts`, `src/styles/imap.css`, full-route configuration | Extend the existing approved mobile discovery contract to `/imap/`; account for its chrome/padding, keep desktop/prototype unchanged |
| New content types/records/validator and a pure adapter under `src/data` / `src/lib` | Adopt approved proposal, retain six identities/coordinates, add supplied verified assets/facts only; validate at build time |
| `src/components/imap/IMapStory.astro` | Consume the adapter rather than prototype fact/video registries, preserve existing markup/classes/order; use actual video dimensions and verified cover; enforce production/prototype field visibility |
| `src/lib/imap-prototype.ts` | Keep the frozen isolated prototype intact; stop using its prototype registries as production editorial storage via the new adapter, not a broad rewrite |
| Controller reliability | If approved, make post-failure retry policy explicit; retain existing lifecycle guards and OSM layer/configuration |
| Tests | Add publish-gate, invalid metadata/ID, missing asset and real browser interaction tests; keep current frozen-design regressions |

No required change to Hero/navigation, Heritage components/assets/content, Heritage transition, map provider, original coordinates, approved desktop composition or other homepage sections.

## 5. Client content and evidence needed

For **each** destination below, provide one approved destination-specific cover and its alt/credit/rights information, and the approved original landscape HD video file or directly playable source. Supply actual pixel dimensions, duration, MIME/codec, file size, poster choice and usage/rights approval (including geographic/expiry restrictions). Please identify captions/transcript availability and any required credit; do not infer ownership or accessibility from a file upload.

| Stable ID | Existing identity | Current coordinate (approximate; unchanged) | Missing required media |
| --- | --- | --- | --- |
| `ho-hoan-kiem` | Hồ Hoàn Kiếm | 21.0286, 105.8525 | Approved cover + destination-specific HD video |
| `pho-co` | Phố Cổ | 21.0358, 105.8504 | Approved cover + destination-specific HD video |
| `van-mieu` | Văn Miếu | 21.0273, 105.8355 | Approved cover + destination-specific HD video |
| `hoang-thanh-thang-long` | Hoàng thành Thăng Long | 21.0352, 105.8403 | Approved cover + destination-specific HD video |
| `ho-tay` | Hồ Tây | 21.0479, 105.8369 | Approved cover + destination-specific HD video |
| `cau-long-bien` | Cầu Long Biên | 21.0436, 105.8587 | Approved cover + destination-specific HD video |

Optional only when verified: official address/entrance, hours plus exceptions, ticket amount/currency/unit/conditions, recommended visit duration, best time, actual accessibility facilities/limitations, transport advice, official website, official directions link and relevant related-destination IDs. For each fact include its official source/document, checked date and responsible reviewer. Supply approved English names if desired; none will be invented. Reconfirm the existing Văn Miếu evidence instead of assuming its dated prose covers all fields.

Also needed: expected monthly viewers, average minutes watched, source bitrate/file size and hosting decision before estimating real HD transfer bills. No service purchase or media integration is authorized by this proposal.

## 6. Reproducible commands, checkpoint and previews

Evidence is in `output/sprint-03/final-qa/`: rollback tar/hash, runtime equality manifest, bounded-check/build/test logs, contract-check log, HTTP script/results and preview log. The pre-work **3.5 MiB uncompressed** `rollback.tar` contains source, tests, docs, config/lockfiles and current public images, not dependencies/generated output. Verify `rollback.tar.sha256`; inspect/extract into a separate directory for recovery, not over ongoing work. Git HEAD alone is not a checkpoint for this already-dirty/untracked project.

Commands actually used, sequentially:

```sh
mise exec -- npm run dev -- stop
# Attempted; failed at bounded heap before diagnostics completed:
NODE_OPTIONS=--max-old-space-size=256 UV_THREADPOOL_SIZE=1 RAYON_NUM_THREADS=1 mise exec -- npm run check
# Narrow proposed-schema type check; passed:
NODE_OPTIONS=--max-old-space-size=128 UV_THREADPOOL_SIZE=1 \
  mise exec -- node node_modules/typescript/bin/tsc -p docs/architecture/tsconfig.schema.json
NODE_OPTIONS=--max-old-space-size=192 UV_THREADPOOL_SIZE=1 RAYON_NUM_THREADS=1 mise exec -- npm run build
env -u HERITAGE_PREVIEW_URL NODE_OPTIONS=--max-old-space-size=192 UV_THREADPOOL_SIZE=1 RAYON_NUM_THREADS=1 \
  mise exec -- node --experimental-strip-types --test --test-concurrency=1 tests/*.test.ts
# Lower-footprint static production preview, not a second dev server:
NODE_OPTIONS=--max-old-space-size=96 UV_THREADPOOL_SIZE=1 RAYON_NUM_THREADS=1 \
  mise exec -- node node_modules/astro/bin/astro.mjs preview --background --host 0.0.0.0
NODE_OPTIONS=--max-old-space-size=48 UV_THREADPOOL_SIZE=1 \
  mise exec -- node output/sprint-03/final-qa/verify-http.mjs
sha256sum -c output/sprint-03/final-qa/runtime.sha256
sha256sum -c output/sprint-03/final-qa/rollback.tar.sha256
```

The separate lightweight HTTP verification checks both production routes and real module delivery without loading TypeScript or running a browser. It is not a claim that the four skipped live-only Node cases ran. No OSM tile or video requests were made.

Verified local production preview URLs:

- Homepage: **http://localhost:4321/** (iMap at `/#explore`)
- Standalone: **http://localhost:4321/imap/**

No externally reachable preview hostname was verified. One bounded production preview remains running; use `mise exec -- node node_modules/astro/bin/astro.mjs preview stop` to stop it. On a capable machine, rerun full `npm run check` without this container's tight heap ceiling and run the browser acceptance matrix before release. Do not raise this instance's resource use to do so.

## Decision requested

Approve or revise the proposed content contract and minimal migration plan; authorize only the listed parity/reliability/content-gating fixes next. Supply the client media/evidence and complete browser/full-type acceptance before major integration. **No broad redesign, paid service, unapproved video or live schema migration has begun.**
