# Sprint 06G — four story updates and heading refinement

October 21, 2026. Source implemented; runtime/browser acceptance pending. Scope `/imap-prototype/` only. STOP for review; no redesign, new destinations, CMS or production rollout.

## Implemented content

The existing slug-keyed `featuredPrototypeStories` overlay now adds four client-supplied story records. Base destination IDs, categories, titles, coordinates and `portraitImage` fields are unchanged.

| Existing ID | Video ID | Client reference facts |
| --- | --- | --- |
| ho-hoan-kiem | xI_NOm3MYJI | Free visit; public lake surroundings 24/7; Khu vực Hồ Hoàn Kiếm, Hà Nội |
| nha-tho-lon-ha-noi | 4i9crZgDwSE | Free; Mon–Sat 08:00–11:00 and 14:00–17:00; Sunday 07:00–11:30 and 15:00–21:00; 40 Nhà Chung, Hà Nội |
| pho-co | lfqbodYX8ow | Free neighborhood visit; public neighborhood 24/7; Khu vực Phố cổ, quận Hoàn Kiếm, Hà Nội |
| den-ngoc-son | GyC4fn_7T0o | 50,000 VNĐ/visit; students 25,000 VNĐ/visit with valid card; Mon–Thu 07:00–19:00; Fri–Sun and holidays/Tết 07:00–22:00; Đền Ngọc Sơn, Hồ Hoàn Kiếm, Hà Nội |

All four descriptions are the supplied Vietnamese copy. No independent verification is claimed. Notes distinguish public-space 24/7 access from individual attraction/business hours, flag cathedral religious services/special events, and warn of changes. Ngọc Sơn displays both supplied reference links, explicitly labeled client references, not independently verified sources.

Metropole, Đinh Lễ and Múa rối entries remain unchanged, including descriptions, prices/schedules, videos and disabled affiliate settings. Đinh Lễ retains `lfqbodYX8ow`; Phố Cổ shares that video URL, not the destination identity or player instance.

## Heading changes

- Thông tin tham quan → **Thông tin tham khảo**
- Câu chuyện cùng nơi → **Trải nghiệm cùng nơi**
- Tiếp tục khám phá gần đây → **Địa điểm gần đây**
- Actual current Chọn câu chuyện → **Chọn một địa điểm**, in both initial markup and dynamically restored directory heading. The alternate legacy wording Lựa chọn câu chuyện was not present.

Cluster-specific count headings and unrelated copy/category labels are retained.

## Changed files

- `src/data/imap-featured.ts`: four additions plus optional address/reference-link fields in the existing story interface. Existing embed validator and `autoplay=1&mute=1&playsinline=1&rel=0` URL construction unchanged.
- `src/pages/imap-prototype.astro`: requested heading strings; optional featured-address override and client-reference anchors using existing practical-source styling. Existing iframe, fallback link, portrait component calls, directions, title, practical facts and booking guard retained.
- `src/scripts/imap-prototype.ts`: ONE heading-string replacement only. No selection/filter/map/player logic changes.
- `tests/imap-featured.test.ts`: seven expected existing-destination video assignments and new heading strings; prior three-story practical/booking/video/directions checks retained.
- `tests/imap-content-06g.test.ts`: exact four descriptions/addresses/practical arrays/caveats/reference URLs, headings and controlled execution of the real switching callbacks with the shared Phố Cổ/Đinh Lễ video. Authored, NOT run.
- `docs/billing.md`: no added configured subscription/API fees; usage assumptions for additional player selections, supplier exclusions, fallbacks and stale-PDF status.

No edits this sprint to the stylesheet, portrait component/assets, destination catalog, coordinates, category registry, camera, directions helper or production pages. Pre-existing dirty work is preserved. Pre-existing controller style diagnostics were session-deferred; no unrelated refactor/suppression comments were introduced to satisfy a content-only change.

## Acceptance status

1. **Source confirmed:** four supplied URLs/descriptions are keyed to the four existing destination IDs; template renders them through the existing player/content path. Actual playback/rendering not tested.
2. **Source confirmed:** all supplied free/admission prices, student-card requirement, schedules, exact addresses and qualifying notes are present. The visitor facts are client-supplied, not independently verified.
3. **Source architecture confirmed:** Phố Cổ and Đinh Lễ have separate slug-keyed templates but the same video URL. `openPlace` still calls `stopVideo` before cloning the next selected template, and `stopVideo` sets the prior iframe to `about:blank` before removing it. Only the selected template is mounted. A regression exercises both directions and verifies at most one mounted frame; it has not been executed. Shared-video browser behavior is not claimed tested.
4. **Source unchanged:** muted autoplay URL, player controls, original YouTube fallback, hidden booking guard, portraits/nearby sources, map/filter/radius behavior and approved design. Browser autoplay remains subject to browser/provider restrictions.

No application execution, tests, build, rendered/browser inspection or PDF generation under instance resource policy. Automatic cached diagnostics are not a comprehensive clean validation claim.

## Preview status

Configured URL: **https://preview.code.arvigeus.one/imap-prototype/** — NOT currently working/refreshed.

Latest probes: local port 4321 refuses connections; public HTTPS fails TLS before HTTP with `tlsv1 alert internal error`. Memory at the probe: 2,355,875,840 / 2,684,354,560 bytes, about 313 MiB headroom, following very low headroom in prior sprints. No server start or build was attempted. Memory recovery and administrator TLS/port-4321 forwarding repair remain necessary; an Astro restart cannot fix TLS failing before HTTP. No alternate working public URL is known.

## Exact validation commands for a capable machine

Do not execute on the constrained instance without an explicit resource-policy override. In a container first read current manager files, inspect trust/status, and bootstrap only with approval if a locked toolchain is missing. No project mise/Pixi config was present in the prior checks; mise is installed. Never blindly trust a newly added config.

```sh
mise trust --show
mise current
NODE_OPTIONS=--max-old-space-size=192 UV_THREADPOOL_SIZE=1 RAYON_NUM_THREADS=1 \
  mise exec -- node --experimental-strip-types --test --test-concurrency=1 \
  tests/imap-content-06g.test.ts tests/imap-featured.test.ts tests/imap-portraits.test.ts \
  tests/imap-prototype-content.test.ts tests/imap-interactions.test.ts \
  tests/imap-marker-color.test.ts tests/imap-neighborhood.test.ts
uv run --with reportlab python scripts/build-billing-brief.py
pdftoppm -png -r 100 output/pdf/ha-long-billing-brief.pdf /tmp/ha-long-billing-brief
```

Visually inspect every PDF page before sharing; the existing PDF remains stale. After sufficient memory and public routing are restored, use the project's background dev-preview flow (no production build needed):

```sh
mise exec -- node node_modules/astro/bin/astro.mjs dev status
# Stop stale preview state only if necessary:
mise exec -- node node_modules/astro/bin/astro.mjs dev stop
NODE_OPTIONS=--max-old-space-size=256 UV_THREADPOOL_SIZE=1 RAYON_NUM_THREADS=1 \
  mise exec -- node node_modules/astro/bin/astro.mjs dev --background --host 0.0.0.0 --port 4321
curl -fI http://127.0.0.1:4321/imap-prototype/
curl -fI https://preview.code.arvigeus.one/imap-prototype/
```

Browser review on desktop/mobile: open each updated destination and compare its description/video/price/hours/address/caveats; switch Phố Cổ → Đinh Lễ → Phố Cổ during playback, confirming no overlapping player/audio and correct distinct story titles/descriptions; check manual playback and fallback with blocked autoplay; verify prior three stories, heading reset after filtering/clusters, portrait reuse, directions, hidden booking CTA, long-hours wrapping and no overflow. Do not label this release-ready before that review.
