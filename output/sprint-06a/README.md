# Sprint 06A — three featured destinations

**Prototype origin refreshed · October 20, 2026 · STOP after 06A.** Static build and served content verified at port 4321. Public-origin TLS/routing and rendered desktop/mobile acceptance remain blocked/pending. This is not production publication, CMS implementation or media-rights verification.

## Changed files in this sprint

- `src/data/imap-featured.ts` — new route-only editorial overlay for exactly three existing destination IDs. Exact client descriptions, supplied YouTube watch URLs, practical labels/caveats and disabled Metropole affiliate settings. Strict YouTube URL-to-embed conversion and explicit-enable/valid-HTTPS affiliate guard.
- `src/pages/imap-prototype.astro` — existing story templates render featured content with a privacy-enhanced YouTube iframe, always-visible original-URL fallback, practical definition list and conditional booking anchor. Other destinations retain their original story/placeholder branches. No new map catalog entries.
- `src/styles/imap-prototype.css` — iframe fills the existing responsive 16:9 frame; featured-only typography/spacing, compact practical facts and link styling. No map layout, category, marker, radius, clustering, sheet-height or camera CSS redesign.
- `src/scripts/imap-prototype.ts` — only the existing `stopVideo` cleanup gains iframe unload before content removal. Existing shared selection, list, cluster, filtering, radius and camera paths unchanged.
- `tests/imap-featured.test.ts` — six new focused tests for three-ID mapping, practical caveats, URL guards/default-hidden affiliate, frame/fallback/template isolation and real iframe cleanup callback.
- `docs/billing.md` — configured incremental subscription/API subtotal, unmeasured usage scenarios, third-party delivery/rights/platform risks and exclusions. Existing PDF remains stale; not regenerated.
- `output/sprint-06a/README.md` — this handover.

The pre-existing uncommitted 05B.1 application/data/test changes and earlier architecture/editorial deliverables were preserved. No homepage, `/imap/`, production destination pages, original catalog, coordinates, category registry or backend was edited. No package installation, commit, push, purchase, CMS, affiliate tracking, payment, booking implementation or video-library development.

## Video mapping and checks

| Existing destination ID | Category | Supplied video ID | Referrer-aware player-page result |
| --- | --- | --- | --- |
| `sofitel-legend-metropole-hanoi` | `stay` | `LpleBDMdAMc` | `status: OK`, `playableInEmbed: true` |
| `pho-sach-dinh-le` | `experience` | `lfqbodYX8ow` | `status: OK`, `playableInEmbed: true` |
| `nha-hat-mua-roi-thang-long-hoan-kiem` | `experience` | `-bezb1tRCZM` | `status: OK`, `playableInEmbed: true` |

Checks performed October 20, 2026. YouTube oEmbed returned valid iframe markup for all three. That external HTML was **not** inserted into the application; the app constructs only validated `youtube-nocookie.com/embed/<id>` URLs. Direct no-referrer player-page fetches initially returned Error 153 (`EMBEDDER_IDENTITY_MISSING_REFERRER`), which the [YouTube help page](https://support.google.com/youtube/answer/171780) documents as expected outside an embedding context. Sequential HTTP checks with a Referer then returned the successful metadata above. No uploader-level embedding block was observed in those responses; actual playback on the final browser/origin/region remains unverified.

Sources:

- [Metropole original](https://www.youtube.com/watch?v=LpleBDMdAMc) · [oEmbed](https://www.youtube.com/oembed?url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3DLpleBDMdAMc&format=json) · [player](https://www.youtube-nocookie.com/embed/LpleBDMdAMc).
- [Đinh Lễ supplied original](https://www.youtube.com/watch?v=lfqbodYX8ow) · [oEmbed](https://www.youtube.com/oembed?url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3DlfqbodYX8ow&format=json) · [player](https://www.youtube-nocookie.com/embed/lfqbodYX8ow).
- [Theatre original](https://www.youtube.com/watch?v=-bezb1tRCZM) · [oEmbed](https://www.youtube.com/oembed?url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3D-bezb1tRCZM&format=json) · [player](https://www.youtube-nocookie.com/embed/-bezb1tRCZM).
- [YouTube supported player parameters](https://developers.google.com/youtube/player_parameters).
- [Astro components](https://docs.astro.build/en/basics/astro-components/) and [styling](https://docs.astro.build/en/guides/styling/) consulted for the route template/CSS changes.

YouTube identifies the Đinh Lễ supplied video as **“VÒNG QUANH PHỐ CỔ MÙA ĐÔNG | VTVTravel”**, from S Vietnam. It is retained exactly as supplied, but is a broader Old Quarter title, not independently verified as a dedicated Đinh Lễ-only film. The location remains Đinh Lễ, not the separate 19/12 book street. No transcript, captions, thumbnail, video crop, stock media, HD assertion or ownership claim was fabricated. No third-party video was downloaded or rehosted.

## Presentation and practical information

All selections still clone the same destination template via `openPlace`: list selection, a single marker and a cluster's scoped list resolve the same stable ID. The iframe is inside an inert template until selected; one selected story is attached at a time. Frame aspect ratio remains 16:9 without cover cropping. Embed parameters specify `autoplay=0` and `playsinline=1`; autoplay permission is not granted. A browser referrer policy permits the origin referrer required by YouTube. Closing/switching removes/unloads the selected iframe. The fallback “Xem video trên YouTube” is always visible below the frame, not dependent on detecting cross-origin player errors.

- **Metropole:** `Lễ tân` = `24/7`; `Giá tham khảo` = `Từ 6.000.000 VNĐ/đêm`. Note limits 24/7 to reception and identifies a client-supplied, variable starting price, not a live rate.
- **Đinh Lễ:** `08:00–21:00` is indicative and individual bookshops may vary; `Miễn phí tham quan`. Explicit distinction from the separate 19/12 book street.
- **Theatre:** “Khung giờ có suất diễn (tham khảo)” gives Monday–Saturday 13:45–22:00 and Sunday from 09:30 into the evening, explicitly not continuous performance durations or exact bookable showtimes. Venue schedule recheck note present; no invented price or ticket URL.
- **Booking:** Metropole `affiliateUrl: null`, `affiliateEnabled: false`, `affiliateLabel: 'Đặt phòng'`. The template emits no booking anchor unless explicitly enabled with a valid absolute HTTPS URL. `#`, relative, javascript/data, missing and credential-bearing URLs are rejected. No tracking/network integration exists.

Text uses escaped Astro expressions, not raw external HTML. The overlay is independent of the original map catalog, so other descriptions, pins and categories are not replaced and search/count inputs do not change. Hoàn Kiếm remains a provisional demonstration center, not a product-scope commitment.

## Focused validation — sequential, 47 passed

The user's Sprint 06A request authorized focused checks; no broad application suite or full build was run. Container markers/tool-manager status were inspected first. `mise` was available, with no trusted configs or configured project tools found; the execution wrapper used the installed system Node, with no tool bootstrap/install.

```sh
NODE_OPTIONS=--max-old-space-size=192 UV_THREADPOOL_SIZE=1 RAYON_NUM_THREADS=1 \
  mise exec -- node --experimental-strip-types --test --test-concurrency=1 \
  tests/imap-featured.test.ts tests/imap-prototype-content.test.ts \
  tests/imap-interactions.test.ts tests/imap-marker-color.test.ts \
  tests/imap-neighborhood.test.ts tests/imap-prototype-camera.test.ts \
  tests/imap-prototype-init.test.ts
```

Result: **47 passed, 0 failed/skipped, approximately 6.63 seconds**. Coverage includes exact video mapping, client-information caveats, disabled/invalid affiliate cases, source-level iframe sizing/fallback, actual iframe cleanup, 5/7/10/11 radius counts, synchronized controls/list/marker inputs, navy styling, cluster selection routing, real Leaflet geometry/RAF fixtures and startup behavior.

An active changed-path LSP probe was attempted sequentially. Astro had no configured LSP; CSS timed out. Auxiliary findings included existing controller style warnings and Vietnamese spelling false positives. This is **not** a clean full Astro/typecheck result. The focused tests do not compile/render the Astro route or prove real browser playback/layout. No full build/check was attempted at the observed memory pressure.

## Preview status — origin refreshed; public delivery blocked

At the owner's refresh follow-up on October 20, memory pressure had eased to 1,828,106,240 of 2,684,354,560 bytes (about 817 MiB headroom). The existing stale preview was stopped, the existing source built successfully (9 static pages, approximately 1.52 seconds), and one background preview restarted on the same port 4321, bound to `0.0.0.0` (PID 98627). No features/layout/source code were changed in this follow-up. No unrelated processes were stopped.

Executed sequentially, with `UV_THREADPOOL_SIZE=1 RAYON_NUM_THREADS=1`, through the existing mise wrapper:

```sh
NODE_OPTIONS=--max-old-space-size=96 mise exec -- node node_modules/astro/bin/astro.mjs preview stop
NODE_OPTIONS=--max-old-space-size=192 mise exec -- npm run build
NODE_OPTIONS=--max-old-space-size=96 mise exec -- node node_modules/astro/bin/astro.mjs preview --background --host 0.0.0.0 --port 4321
```

Verified with a bounded HTTP/content check:

- **http://localhost:4321/imap-prototype/** returns HTTP 200 and exactly matches freshly built `dist/imap-prototype/index.html`.
- **http://localhost:4321/imap-prototype/?presentation=1** serves the same fresh HTML.
- All three destination templates contain their correct supplied embed IDs, new descriptions, practical facts and YouTube fallback links; exactly 3 iframes and 11 destination templates; no affiliate-booking anchor.

**Public blocker:** both HTTPS checks to `https://preview.code.arvigeus.one/imap-prototype/` failed before HTTP with curl error 35, `TLS connect error: ... tlsv1 alert internal error`. The environment's port 8080 is the private-workspace login service, not the Astro server. No working authenticated public forwarding URL for port 4321 is supplied or verifiable. Do not describe localhost/container-private addresses as public URLs.

**Required action:** the workspace/preview administrator must confirm the actual public forwarding URL for port 4321, or restore TLS and configure/confirm that the intended public preview route forwards to the running Astro server at port 4321. Then open `/imap-prototype/` on that verified forwarding URL. No further source changes or rebuild are currently needed. Public delivery, browser caching and browser playback remain unverified; no working public URL is claimed.

## Desktop/mobile acceptance still required

No Chromium/Firefox executable was available; no installation, screenshots, browser playback or visual pass is claimed. After preview refresh, check desktop 1440×900 and mobile 390×844 plus 360px width:

1. Open all three stories through list and marker/cluster selection. Confirm exact supplied video, title/category and Vietnamese description, no mixed destination content or horizontal overflow.
2. Confirm full responsive 16:9 frame, readable practical labels/caveats, visible YouTube fallback, user-initiated playback/inline/fullscreen behavior and no sound autoplay. Test a blocked YouTube network and use the original-link fallback.
3. Close/switch/reopen: no orphan audio/player, correct selected navy marker/list cue and preserved map context. Test sheet collapsed/half/expanded, scroll, resize, keyboard and touch focus.
4. Confirm no “Đặt phòng” anchor by default, including keyboard traversal. No ticket booking URL or invented theatre price.
5. At defaults show seven destinations; 500 m / 1 km / 2 km / All show 5 / 7 / 10 / 11. Experience gives the two featured experiences, Stay gives Metropole at 1 km, Food remains honestly empty. Search/category/area/radius/clear stay synchronized.
6. Confirm the remaining eight destinations retain their existing content/placeholders, including the provisional cathedral pin warning. No new IDs, coordinates, markers or linked-story pins.
7. Verify actual public-origin iframe playback/referrer and any region/age/consent/ad-blocker restrictions before executive presentation.

## Remaining limitations and stop

Source implementation, focused regression checks, static compilation and refreshed local-origin delivery are complete; **public TLS/forwarding and visual/playback acceptance remain pending**. Client copy/hours/prices/schedule are not independently verified; YouTube availability/embedding metadata can change. Privacy-enhanced embedding is not zero tracking, and player ads/platform controls remain outside this mockup's control. Rights approval and final product geographic scope are not established by this sprint. Billing PDF is stale and must be regenerated/visually inspected on a capable machine before sharing.

**STOP after 06A. No CMS, full video library, production migration or deployment.**
