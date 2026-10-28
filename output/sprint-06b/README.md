# Sprint 06B — story panel polish and working directions

**October 20, 2026 · implementation and local preview refresh complete · public TLS delivery blocked · STOP after 06B.**

## Scope and changed files

- `src/pages/imap-prototype.astro`: story-only hierarchy: category/city → title → 16:9 video → discreet YouTube fallback → full supplied description → compact “Thông tin tham quan” rows/address → one visitor caveat → “Chỉ đường” → optional collapsed related-story disclosure → compact “Tiếp tục khám phá gần đây” links. Removed repeated source-audit paragraphs and generic editorial tips; unknown hours/prices and approximate/provisional entrances remain explicit. Booking still emits no anchor unless enabled with a valid URL.
- `src/styles/imap-prototype.css`: only story-content spacing, information rows/card, directions/nearby links and related-story disclosure styles. Existing palette, font families, global three-column grid, map controls, markers, category UI and mobile sheet sizing remain unchanged. Long schedule uses a full-width row; other facts use compact label/value rows with wrap-safe values and accessible touch targets.
- `src/data/imap-featured.ts`: theatre's client-supplied indicative starting price `Từ 100.000 VNĐ/người`; concise client-information caveats; retained all three exact supplied videos/descriptions, hotel price/reception and book-street hours/free admission. YouTube URLs now request muted autoplay with `autoplay=1&mute=1&playsinline=1`; this supersedes the 06A no-autoplay state to meet 06B's requested behavior.
- `src/lib/imap-directions.ts` (new): finite, range-checked latitude/longitude → encoded Google Maps walking-directions URL. No origin, key, SDK, geolocation or network call. Invalid/missing coordinates return no URL, and the template suppresses the action.
- `tests/imap-featured.test.ts`: updated the source/data expectations for 06B; added correct per-destination Maps URL and invalid-coordinate guard tests. **Updated tests were not executed in this sprint** under the instance's test-execution restriction.
- `docs/billing.md`: configured $0 incremental monthly subscription/API subtotal before applicable tax, external-open assumptions, autoplay demand caveat, exclusions, provider dependence and preview limits. Not the full operating cost; PDF remains stale under generation restrictions.
- `output/sprint-06b/README.md`: this handover.

No changes to the map controller, catalog, destination IDs, coordinates, categories, marker rendering, clustering, filtering, search, counts, camera logic, original data, homepage, `/imap/` or production source pages. No CMS, backend, video library, booking integration, Google SDK/key/billing account, package install or production deployment. The static preview build naturally regenerates existing routes; it is not a production release.

## Practical content

- **Metropole:** `Lễ tân: 24/7`; `Giá tham khảo: Từ 6.000.000 VNĐ/đêm`. Note limits 24/7 to reception and the price to an indicative client-supplied starting rate, variable by day/room, not live pricing. Address comes from the unchanged prototype reference.
- **Đinh Lễ:** `08:00–21:00` indicative hours; `Miễn phí tham quan`. Individual shops may vary. The note still distinguishes Đinh Lễ near Hoàn Kiếm from the separate 19/12 book street.
- **Theatre:** “Khung giờ có suất diễn (tham khảo)” retains Monday–Saturday 13:45–22:00 and Sunday from 09:30 into the evening. `Giá vé tham khảo: Từ 100.000 VNĐ/người` is the new client-supplied price, not an independently verified/live quote. Note explicitly rejects continuous-duration/exact-bookable-time interpretation and asks visitors to check the latest venue schedule.
- **Other destinations:** retain honest media placeholders; hours/prices remain unknown where no verified practical record exists. The provisional cathedral entrance warning remains. No unknown fact is filled with invented content.

The three original descriptions and video IDs are unchanged. Autoplay is requested only when the existing selection path attaches a story template. It is muted by URL configuration; browser policy can still block autoplay. The external-player unload behavior from 06A remains unchanged. Actual playback/mute behavior needs browser acceptance. The fallback remains available if playback fails. No fabricated captions/transcripts, replacement media or thumbnails.

## Directions contract

`https://www.google.com/maps/dir/?api=1&destination=LAT%2CLNG&travelmode=walking`

Uses the currently selected template's existing coordinates, opens with `target="_blank" rel="noopener noreferrer"`, and has a destination-specific accessible label. Visible label: **Chỉ đường**. No `origin` parameter and no browser-location request is added; Google Maps chooses/asks for an origin. Google Maps opens outside the Leaflet/OSM map. Neither walking-route availability nor an exact entrance is guaranteed by a reference pin.

Verified built/served featured destinations:

| Destination | Decoded destination parameter |
| --- | --- |
| Metropole | `21.0254649,105.8560628` |
| Đinh Lễ | `21.025672,105.8545573` |
| Thăng Long theatre | `21.0317043,105.853455` |

All eleven existing destination templates have finite valid coordinates and a matching encoded walking link. Missing/nonfinite/out-of-range guards were manually reviewed and added to the unexecuted focused test cases.

Primary sources consulted October 20, 2026: [Google Maps URLs](https://developers.google.com/maps/documentation/urls/guide), [YouTube player parameters](https://developers.google.com/youtube/player_parameters), [Astro components](https://docs.astro.build/en/basics/astro-components/) and [Astro styling](https://docs.astro.build/en/guides/styling/).

## Validation and refreshed local preview

An active changed-file LSP probe found no reported errors but had incomplete coverage: two files confirmed clean, two inconclusive and Astro unsupported. This is not a full clean typecheck. Single-file analysis was used; no repository-wide scan, application test suite, linter or formatter was run.

Memory rose during diagnostics to 2,674,946,048 of 2,684,354,560 bytes. A bounded process inspection identified the temporary CSS/TypeScript language servers and their children as belonging to **this exact Pi session** (parent 96911, also the tool shell's parent). Only those diagnostic workers were stopped; no other Pi/workspace sessions or services were terminated. Usage then fell to 2,021,855,232 bytes (about 632 MiB headroom). No repeated LSP probe was started afterward.

The owner's explicit preview-refresh request authorized the necessary memory-limited build/restart. No project-manager config/locked bootstrap was found; installed Node was used through the available mise wrapper. Executed sequentially:

```sh
NODE_OPTIONS=--max-old-space-size=96 UV_THREADPOOL_SIZE=1 RAYON_NUM_THREADS=1 \
  mise exec -- node node_modules/astro/bin/astro.mjs preview stop
NODE_OPTIONS=--max-old-space-size=192 UV_THREADPOOL_SIZE=1 RAYON_NUM_THREADS=1 \
  mise exec -- npm run build
NODE_OPTIONS=--max-old-space-size=96 UV_THREADPOOL_SIZE=1 RAYON_NUM_THREADS=1 \
  mise exec -- node node_modules/astro/bin/astro.mjs preview --background --host 0.0.0.0 --port 4321
```

**Build passed: nine static pages, approximately 1.67 seconds.** Replaced the existing preview with one background process, PID 99318, same port 4321. No second preview or development watcher was started.

Verified delivery using HTTP download, byte comparison to the built artifact and targeted markup inspection:

- **http://localhost:4321/imap-prototype/** serves the fresh `dist/imap-prototype/index.html` byte-for-byte.
- Exactly the three supplied YouTube embed URLs include `autoplay=1`, `mute=1`, `playsinline=1`.
- Metropole `6.000.000 VNĐ/đêm`, Đinh Lễ `08:00–21:00` and free admission, and theatre `100.000 VNĐ/người` are present.
- All eleven Google directions URLs encode the correct unchanged latitude/longitude with `%2C`, `api=1`, `travelmode=walking` and no origin.
- No `affiliate-booking` anchor, old `openstreetmap.org/directions` URL or `Gợi ý biên tập:` text appears in served markup.

This verifies compilation and served content, not rendered browser geometry, autoplay/mute, app handoff or interaction regression behavior. The controller/catalog/filter algorithms are unchanged by source inspection, but **no new runtime regression pass is claimed**. The 47-pass result belongs to 06A, not to these changed 06B tests.

## Public preview blocker

The configured public-origin request to **https://preview.code.arvigeus.one/imap-prototype/** still fails before HTTP:

`curl: (35) TLS connect error: error:0A000438:SSL routines::tlsv1 alert internal error`

An independent web fetch also failed. Local port 8080 is the private-workspace login service, not the Astro preview. No verified alternative public port-forwarding URL is provided. **The origin preview is refreshed; a working public URL cannot be claimed.**

Required external action: the workspace administrator must repair/confirm public-preview TLS and forwarding to the running Astro server on **port 4321**, or supply the actual public forwarding URL. Then use its `/imap-prototype/` path. Do not present localhost or the container-private network address as a public URL. No further application feature/layout change is required for that routing issue.

## Checks still required on a capable environment

Application tests were not run under the instance policy. Exact focused command:

```sh
NODE_OPTIONS=--max-old-space-size=192 UV_THREADPOOL_SIZE=1 RAYON_NUM_THREADS=1 \
  mise exec -- node --experimental-strip-types --test --test-concurrency=1 \
  tests/imap-featured.test.ts tests/imap-prototype-content.test.ts \
  tests/imap-interactions.test.ts tests/imap-marker-color.test.ts \
  tests/imap-neighborhood.test.ts tests/imap-prototype-camera.test.ts \
  tests/imap-prototype-init.test.ts
```

No browser is available here; rendered desktop/mobile acceptance remains pending. At desktop 1440×900 and mobile 390×844/360px width, verify compact panel spacing, complete 16:9 frame, muted autoplay or usable fallback, scroll/touch/keyboard controls, hidden booking, correct Maps destination and origin selection/app handoff. Check list/marker/cluster selection all resolve the same content and radius/search/category/count behavior remains unchanged (5/7/10/11 at 500m/1km/2km/All). Check blocked player/Google network, missing location permission and narrow/tall schedules without overflow.

Public TLS/routing and actual in-browser playback/navigation remain external acceptance blockers. Billing PDF regeneration/layout inspection are deferred under policy; instructions remain in `docs/billing.md`.

**STOP after 06B. No CMS, library or production work.**
