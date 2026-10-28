# Sprint 02 iMap Explorer — inspection only

October 17, 2026. No application source, styles, metadata, tests, configuration or canonical billing files were modified. Sprint 02 has not been implemented. The approved Heritage design is frozen in `output/sprint-01/design-freeze/`.

## 1. Current architecture

- Static Astro homepage, no framework island, backend, database, CMS or places API.
- `src/pages/index.astro` renders search/categories, `MapExplorer`, then destination results within the white `#explore` canvas. It imports bundled Leaflet CSS and the client exploration script.
- `src/components/MapExplorer.astro` renders the historical district directory, hidden selected-place panel, illustrated fallback/live-map containers, status/retry controls and six inert place-story templates. Desktop grid is directory:map = 1:2, with 640px panels. It stacks below 900px; map height is 440px, then 350px below 540px.
- `src/scripts/explore.ts` owns DOM references and in-memory filter/location/selection state. It dynamically imports Leaflet, creates markers, handles tile/fallback/retry, swaps story templates, and synchronizes directory/cards/pins. It is coupled to homepage IDs using non-null assertions; it is not an independent reusable widget.
- `src/components/DemoMap.astro` is a local SVG schematic with manually positioned, clickable place links. It is explicitly not to scale and not for navigation.
- `src/lib/explore.ts` contains pure normalization, filtering, Haversine distance and distance-formatting functions.
- Styling is split between `MapExplorer.astro`, `src/styles/global.css`, and the homepage-local white Explorer background. Shared files also affect frozen Heritage; changes there require cascade/scope review.

## 2. Provider and tile loading

Map library: Leaflet (`^1.9.4` dependency). Base tiles: public OpenStreetMap raster endpoint:

`https://tile.openstreetmap.org/{z}/{x}/{y}.png`

No Mapbox/Google provider, API key, geocoder, route service or paid tile plan is configured. Tiles have max zoom 19 and visible OSM attribution. The map initially fits all six destinations with padding/max zoom 14; mouse-wheel zoom is disabled, with explicit zoom controls. Filtering does not recalculate map bounds.

Loading starts automatically when the homepage client script runs. The illustrated map is initially available. On initialization, the live map is revealed, the illustration hidden, markers added and tile requests started.

### Existing failure/retry behavior (source inspection)

- A 12-second timeout restores the schematic if tile initialization does not progress.
- The first `tileload` clears that timeout and marks the map interactive.
- `tileerror` increments a count; completion with zero successes and errors restores the schematic. Partial failure produces a warning.
- Module/map setup exceptions also restore the schematic with generic messaging.
- Fallback removes the Leaflet map/markers, shows the illustration and exposes a manual retry button.
- No failed tile URL, HTTP status, browser exception or error code is captured. The broad catch discards the underlying error.
- Diagnostic limitation: the timeout is cleared after the first successful tile; subsequent stalled/partial loading is not covered by that initial watchdog. A later all-error batch can also trigger fallback. These are source-level observations, not a proven explanation for the reported failure.

### Evidence collected now

One representative tile was requested without changing configuration:

```sh
curl --silent --show-error --max-time 15 \
  --referer http://localhost:4321/ \
  --dump-header output/sprint-02/tile-probe.headers \
  -o /dev/null -w 'HTTP %{http_code}; %{content_type}; %{size_download} bytes\n' \
  https://tile.openstreetmap.org/12/3252/1803.png
```

Initial result: **HTTP 200, image/png, 6,987 bytes**, but importantly the saved response also includes:

```
x-blocked: Access denied. See https://operations.osmfoundation.org/policies/tiles/
cache-control: no-cache
```

**Correction to the initial inspection:** this is not evidence of a successful geographic tile. The denial header was missed in the earlier status-code-only summary. Its body was discarded, so the exact pixels/message in that first image were not inspected.

### Follow-up: identified client and response inspection

A second single-tile diagnostic used the same URL and local Referer, with an honest application identifier rather than curl's generic default:

```sh
curl --silent --show-error --max-time 15 \
  --user-agent 'MyHanoiDiagnostics/0.1 (single-tile inspection)' \
  --referer http://localhost:4321/ \
  --dump-header output/sprint-02/identified-tile-response.headers \
  -o output/sprint-02/identified-tile-response.png \
  https://tile.openstreetmap.org/12/3252/1803.png
```

Result: **HTTP 200, image/png, 43,384 bytes**, no `x-blocked` header; `x-tilerender`, ETag and cache directives are present. The saved PNG was opened directly and contains actual Hanoi map imagery. This is a single provider-response inspection, not browser/map visual QA. The image is diagnostic output only, not a published site asset or bulk tile download.

The [official OSM tile policy](https://operations.osmfoundation.org/policies/tiles/), checked October 17, 2026, explicitly blocks generic library User-Agents including curl. It requires correct HTTPS URLs, visible attribution, normal caching, and a valid browser Referer; browser default User-Agent is appropriate for normal web viewing. The initial generic-curl request and denial header, followed by a genuine tile from an identified request, are strongly consistent with identification-based blocking. These requests occurred at different times/cache states, so this is not proof that every reported website 403 has the same cause. The successful diagnostic does not authorize replacing or spoofing browser User-Agents.

### Causes of 403/access denial: evidence vs hypotheses

- **Supported for the initial diagnostic:** generic curl User-Agent blocking, explicitly documented by OSM. The observed denial response used HTTP 200, not a literal HTTP 403.
- **Potential browser/deployment causes, not yet established:** Referer suppressed by privacy settings, `Referrer-Policy`, or a proxy; a proxy replacing identity with a generic client; network/IP blocking; excessive requests, cache-bypassing or prohibited prefetch patterns. None of these was demonstrated for this site's browser traffic.
- The source uses the correct HTTPS endpoint, has attribution, and adds no cache-bypass headers or tile proxy/prefetch/offline feature. Browser default caching/identity should normally apply. An expired/missing paid API key is not supported by this configuration: there is no key-based provider configured.
- CORS is not established as the cause. The observed responses allow `Access-Control-Allow-Origin: *`, and standard Leaflet image tiles do not require a fetch-based API or authenticated CORS setup. A browser CSP/mixed-content failure is distinct from an actual provider 403; the configured URL is HTTPS.
- **Detection gap:** Leaflet's image `tileload` can fire for a successfully decoded denial PNG served with HTTP 200. Current code would count it as success, clear the watchdog and display the normal status. No response headers or image semantics are checked. Genuine failed image requests may trigger `tileerror`, but the application records only a count, not URL/status/reason. This is a demonstrated source-level diagnostic gap, not proof that the browser received the same denial PNG.

A local homepage HEAD request returned HTTP 200 without a CSP header in that local response. Production/proxy headers and the actual browser request identity remain unverified. **The reported browser 403 is not reproduced or root-caused.** Next diagnosis needs the failing browser's exact tile URL, Request/Response headers (including Referer and `x-blocked`), response body, console output, timestamp and any intervening proxy. Do not bulk-test or repeatedly retry a denied service, spoof identities, or treat the schematic as a live-tile fix. No provider/configuration change was made.

## 3. Search and filters

Search is local, live on input, over only the six curated records. It strips Vietnamese combining diacritics, normalizes đ/Đ, ignores case and splits the query into words. Every word must be a substring of the combined name/alternative Vietnamese name/category/area/description. It does not query street addresses, all district names, full story text, OSM or a geocoding service; no suggestions, fuzzy search or search history exists.

The form submit scrolls to results. Filters are one selected category (All, Hồ & cảnh quan, Phố & cầu, Di sản) plus an optional 10km radius from the current origin. Query/category/radius combine with AND; results sort nearest-first. Changes synchronize destination cards, schematic pins, live markers, directory counts/links and the empty state. A selected story excluded by filters closes. Filter state is not persisted or encoded in the URL. District grouping is a directory, not a geographic boundary/filter layer.

## 4. Location data

`src/data/places.ts` holds six static places: Hồ Hoàn Kiếm, Phố Cổ, Văn Miếu, Hoàng thành Thăng Long, Hồ Tây and Cầu Long Biên. Each includes slug, category, area, approximate lat/lng, descriptive/story/advice text and illustration identity. Coordinates are explicitly approximate representatives, not verified entrances.

Default origin is Hồ Hoàn Kiếm: **21.0286, 105.8525**. Distances are Haversine straight-line estimates, not route lengths or travel times.

The location button uses browser `getCurrentPosition` only after activation, with permission and HTTPS/localhost required. Options: low accuracy, 10s timeout, maximum cached age 60s. It updates origin, distance sorting/radius and the map location marker/viewport. Denied/unavailable location has a message; reset returns to the sample origin. State is in memory, not stored in an application backend or local storage; no continuous tracking is implemented. Tile requests still go to the external provider for the displayed viewport.

`src/data/districts.ts` lists **30 former district-level areas before 1 July 2025**, not current administrative units: 12 urban districts, 17 rural districts, Sơn Tây. Four have curated place assignments; 26 have no entries. No boundaries, complete Hanoi POI dataset, district centroid geometry or current administrative hierarchy is present.

## 5. Video integration and Heritage boundary

All six map-place templates reuse the same city-overview video:

https://www.youtube.com/watch?v=cmY1LfX3Aa4

It is labeled a Hanoi overview from Vietnam Tourism, not destination-specific footage. Selecting a live/schematic pin or directory place clones its inert `<template>` into the sidebar. This creates one `youtube-nocookie.com` iframe, with no autoplay parameter. Replacement/Back removes the previous iframe and stops it. The directory's scroll position is restored, and focus moves to the selected heading or back to its trigger. Links remain available when script interception does not apply.

The map uses **`MapStoryVideo.astro` with `videoId`/`title` props**. Frozen editorial cards use **`HeritageVideo.astro` with a full `video` record**. Do not merge these contracts: a missed map caller caused the earlier homepage crash. The current isolation is intentional.

Frozen Heritage IDs remain `2CxNZtrFedo`, `Sige0y8XxeU`, `-jVXCHcCoiw`. Their records/photographs/modal behavior must not be repurposed for map stories. Map video playback/title metadata was not reverified on YouTube in this inspection.

## 6. Tests, limits and costs

Existing tests are preserved unchanged: geographic/search/filter behavior, 30-area grouping, six place assignments, the three Heritage records and built/live HTML/video-link/image associations. The last authorized run passed 11 tests and a seven-page build. They do not exercise actual Leaflet tile requests, browser geolocation permissions, DOM selection/focus, mobile layout or YouTube playback. No build/test was executed for this inspection-only turn.

No new feature, provider, asset delivery, subscription, API or paid commitment is proposed or implemented by this report. Incremental configured recurring vendor cost is USD $0/month before tax under unchanged traffic/hosting. Existing hosting/labor/rights/tax exclusions and provisional demand estimates remain applicable; public provider availability is not guaranteed by the successful probe. Re-estimate and verify current primary-provider terms/prices if Sprint 02 later changes provider, traffic, assets or infrastructure.
