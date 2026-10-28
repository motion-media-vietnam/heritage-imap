# Sprint 06I — executive-preview handoff

**October 21, 2026. Four stories populated in source; public executive presentation is NOT yet ready.** No production promotion, new destinations, CMS, payments, booking or redesign. STOP for executive acceptance after the infrastructure and presentation checks below.

## Four completed story/video assignments

| Existing ID | Exact supplied video | Portrait file in public/images |
| --- | --- | --- |
| van-mieu | https://www.youtube.com/watch?v=3_7tOtNattU | văn miếu quốc tử giám ht.jpg |
| ho-tay | https://www.youtube.com/watch?v=KPwNA0PidEY | Ho tay.jpg |
| cau-long-bien | https://www.youtube.com/watch?v=ewsKEvRHtvs | Cau Long Bien.jpg |
| hoang-thanh-thang-long | https://www.youtube.com/watch?v=ABbiKgWuhrA | Hoang thanh Thang Long.jpg |

Each has an original Vietnamese editorial description intended for the requested 100–150-word range, practical facts/limitations, address context and references in the existing `featuredPrototypeStories` overlay. The existing video validator/player constructs `autoplay=1&mute=1&playsinline=1&rel=0`; prior-player unload, manual controls and original YouTube fallback remain unchanged. No duplicate catalog entry, marker or separately running player is added.

IDs, categories, coordinates and base content remain unchanged; new portrait fields are prototype-only copies of original records. The current title **Hoàng thành Thăng Long** is already correctly spelled; targeted inspection found no “Hoành” in the catalog/story/route files, so no unnecessary title change was made. Existing short title “Văn Miếu” is retained; its editorial text identifies Văn Miếu – Quốc Tử Giám.

## Research findings and exact sources

Checked **October 21, 2026**, by reading operator pages, including raw HTML when readable extraction omitted header/schedule text. These are operator-listed reference rates/hours on the retrieval date, not a guarantee against subsequent changes. Sources do not separately specify VAT treatment for these visitor prices. Visitor admissions are not the site's operating bills.

### Văn Miếu – Quốc Tử Giám — operator verified

Primary: https://vanmieu.gov.vn/vi/introduction/visitor-information

- Standard daytime admission: **70,000 VNĐ/adult**.
- Priority daytime ticket: **35,000 VNĐ**, including eligible school/university students with required valid cards; other priority categories follow the operator rules.
- Daytime hours: **08:00–17:00, every day**. Direct HTML reads “8:00 AM - 5:00 PM” and “Tất cả các ngày trong tuần”; this section was omitted by the readable extractor, not absent from the source.
- Entrance: **58 Quốc Tử Giám, Hà Nội**; operator distinguishes the exits at Văn Miếu street/Vườn Giám.
- Night schedule shown on that visitor page: **18:30–22:00, Wednesday, Saturday and Sunday**; reconfirm programme operation before travelling.

Separate night-programme source: https://www.vanmieu.gov.vn/vi/experience/night-tour

- Adult package **299,000 VNĐ (one show)** / **399,000 VNĐ (two shows)**. The operator defines ticket categories by height; consult the linked page for child/height eligibility rather than treating these adult quotes as a complete family tariff.
- Night admission is explicitly separate from the standard daytime visit; no assumption that the 70,000 VNĐ ticket includes a night experience.

Each displayed numerical price/hour fact has its own source URL beside it. Facts and dated change caveat use existing practical-card styles. No booking CTA or booking API.

### Hoàng thành Thăng Long — historical conflict resolved by operator notice

Admission: https://hoangthanhthanglong.vn/thong-bao-thau-doi-gia-ve-tham-quan-hoang-thanh-thang-long/

- Operator notice explicitly says **70,000 VNĐ from January 1, 2024**, then **100,000 VNĐ from January 1, 2025**. Use **100,000 VNĐ/visit/person**, not the historical number from the first half of the notice.
- This is the currently published operator notice retrieved on the check date, not an independently guaranteed live ticket quote; reconfirm before travel. Search for a newer 2026 rate did not establish a superseding operator rate.

Hours/address: https://hoangthanhthanglong.vn/

- Direct homepage HTML: “Mở cửa từ 8h00 - 17h00 (Tất cả các ngày)”. Display **08:00–17:00 daily**.
- Operator address: **19C Hoàng Diệu, Hà Nội**.
- Do not assume special/night programmes are included in the standard admission.

Editorial context: https://hoangthanhthanglong.vn/doan-mon/ — Đoan Môn, central axis and Kính Thiên context. Original prose does not copy the operator's description.

### Hồ Tây — public urban area, fees/hours provisional

Context: https://vietnam.travel/node/193 — national-tourism account of the lake's shoreline, cafés, gardens and pagodas. Old incidental restaurant/rental prices elsewhere on that itinerary are NOT adopted.

- Treat as a lake/public lakeside area, not a single gated attraction.
- **No universal lakeside fee or access timetable verified.** Display explicitly provisional fee/service and access-hour information, not an invented “free/24/7” guarantee.
- Individual restaurants, activities and attractions have separate policies. Choose permitted public sections and follow local notices.
- Address context remains the existing approximate pin near Thanh Niên, not a newly invented entrance.

### Cầu Long Biên — active transport landmark, fees/hours provisional

Historical context: https://vietnam.travel/things-to-do/vietnams-amazing-architecture

Active-crossing context: https://vietnam.travel/node/914 — its Long Biên section describes trains, motorcycles and pedestrians using the steel bridge over the Red River. This is context, not a current pedestrian-access permit or operating timetable. Unsafe photography suggestions elsewhere on the tourism page are NOT repeated or adopted.

- **No separate visitor fee or guaranteed pedestrian access schedule verified.** Fee/access-hour fields explicitly remain provisional.
- Do not present a museum-style ticket or a 24/7 pedestrian-access promise.
- Visible editorial/practical notes prohibit entering railway tracks, climbing structures or using restricted areas; observe signs and permitted paths. The supplied track photograph is not an instruction to reproduce its camera position.

### Search-method limitation

A direct Google Search retrieval was attempted, but its results page required JavaScript and could not be read by this research tool. Available web search was used to find sources; final quantitative claims were checked against the primary fetched pages, not accepted from snippets. One Hanoi public-authority lake page also failed retrieval and was not used to support an asserted fee/hour claim. No scraping, account/configuration change or paid research integration was introduced.

## Portrait inspection and rights/presentation status

All four uploads were opened visually, not matched by filename alone:

- Văn Miếu: recognizable **Khuê Văn Các** and its garden/path, not a Hoàng thành gate despite the filename suffix “ht”. Source is landscape **1000×667**, displayed with the existing centred 3:4 cover crop.
- Hồ Tây: aerial **Thanh Niên/lakeside landscape**, consistent with the supplied lake identity. **Visible Getty watermark**: client must confirm publication rights and supply a clean licensed original for a polished public presentation. No watermark removal or unrelated substitute.
- Hoàng thành: recognizable **Đoan Môn gate**, with a visitor in the foreground; visually consistent with the operator's gate description. Not a Văn Miếu photo.
- Long Biên: low-resolution **steel railway-truss span** image consistent with the supplied bridge identity. No independent geolocation/provenance certification; retain explicit railway safety cautions. Final client photo approval still matters.

All 11 `portraitImage` fields are now assigned; **no missing file mapping**. One record field feeds both directory and nearby components, with existing 3:4 frames, lazy load and neutral failure handling. No copied thumbnail mapping/files, YouTube substitutes, generated photos, remote photo downloads or image processing. Browser crop/failure rendering remains unverified.

## Complete 11-destination manifest

| Existing ID | Video ID | Canonical portrait filename |
| --- | --- | --- |
| ho-hoan-kiem | xI_NOm3MYJI | Ho Hoan kiem.jpg |
| pho-co | lfqbodYX8ow | Pho co.jpg |
| van-mieu | 3_7tOtNattU | văn miếu quốc tử giám ht.jpg |
| hoang-thanh-thang-long | ABbiKgWuhrA | Hoang thanh Thang Long.jpg |
| ho-tay | KPwNA0PidEY | Ho tay.jpg |
| cau-long-bien | ewsKEvRHtvs | Cau Long Bien.jpg |
| den-ngoc-son | GyC4fn_7T0o | den ngoc son.jpg |
| nha-tho-lon-ha-noi | 4i9crZgDwSE | Nha tho lon.jpg |
| pho-sach-dinh-le | lfqbodYX8ow | pho sach Dinh Le.jpg |
| sofitel-legend-metropole-hanoi | LpleBDMdAMc | Metropole legand.jpeg |
| nha-hat-mua-roi-thang-long-hoan-kiem | -bezb1tRCZM | nha hat mua roi nuoc Thang Long.jpg |

Ten unique video IDs for eleven separate slug-keyed stories. Phố Cổ/Đinh Lễ sharing is intentional. For a full-catalog executive walkthrough, choose radius **Tất cả**, all categories/areas and empty search: the preserved default **1 km** intentionally excludes farther reference destinations. No radius default/camera behavior was changed to force them into view.

## Changes and checks performed

- `src/data/imap-featured.ts`: four new story overlays and optional `sourceUrl` on practical facts. Earlier seven entries, autoplay/embed validator and affiliate guard retained.
- `src/data/imap-prototype.ts`: four portrait assignments on the original-record prototype copies; no added IDs/pins or production mutation.
- `src/pages/imap-prototype.astro`: optional accessible source anchor beside a practical fact, using existing typography; no structural redesign.
- Tests updated for eleven story/video/portrait assignments. New `tests/imap-content-06i.test.ts` covers exact videos, source citations, description length, preserved originals, no affiliate links, historical-price conflict, separate night tickets and provisional public-access fields. **Authored, NOT run.**
- `docs/billing.md`: no new configured subscription/API fees; new referenced photos total 419,322 bytes, all eleven 7,112,320 bytes. Existing large cathedral image remains a host-transfer concern. No duplicate nearby storage or video rehosting. PDF remains stale.

**Actually completed:** direct source research, visual inspection of four uploaded photos, targeted source/path/title review and bounded local/public HTTP probes. Source construction remains the original six records plus five integrated IDs; all eleven have story/photo mappings. Existing approved CSS, portrait component, controller, marker/cluster/filter/radius/camera logic, directions, heading/slogan and hidden affiliate setup were not edited.

**Not completed:** app execution, automated tests, build, rendered desktop/mobile checks, live playback/interaction/tile checks or PDF regeneration, under the instance resource policy. No functional/browser pass or release-ready assertion. Pre-existing controller style findings are unrelated unchanged code, not introduced defects or a reason to refactor this content sprint.

## Public preview blocker and smallest required action

Configured URL: **https://preview.code.arvigeus.one/imap-prototype/** — NOT accessible/refreshed; no working URL can be provided honestly.

- Public probe fails TLS **before HTTP**: `tlsv1 alert internal error`.
- Local `http://127.0.0.1:4321/imap-prototype/` refuses connections; no preview is listening.
- Final cgroup memory: **2,621,636,608 / 2,684,354,560 bytes**, about **60 MiB free**. Starting a development preview would be unsafe; none attempted.

**Smallest infrastructure action:** ask the workspace administrator to safely free unnecessary workloads or restart this workspace with the project volume retained, and restore HTTPS forwarding to port **4321** (or supply its correct working public origin). These are separate resource/local-service and TLS/public-routing blockers; an Astro restart cannot repair TLS failing before HTTP. Do not reset the dirty checkout or promote this prototype into production to work around the preview.

After adequate headroom is available, inspect current manager files/trust/status and start ONE background dev preview. No local mise/Pixi config/lock files were present; mise is installed. Review any new config before trusting it. Missing tools require approved bootstrap, not opportunistic package installation.

```sh
mise trust --show
mise current
mise exec -- node node_modules/astro/bin/astro.mjs dev status
# Clear stale state only if necessary:
mise exec -- node node_modules/astro/bin/astro.mjs dev stop
NODE_OPTIONS=--max-old-space-size=256 UV_THREADPOOL_SIZE=1 RAYON_NUM_THREADS=1 \
  mise exec -- node node_modules/astro/bin/astro.mjs dev --background --host 0.0.0.0 --port 4321
curl -fI http://127.0.0.1:4321/imap-prototype/
curl -fI https://preview.code.arvigeus.one/imap-prototype/
```

## Deferred validation on a capable machine

```sh
NODE_OPTIONS=--max-old-space-size=192 UV_THREADPOOL_SIZE=1 RAYON_NUM_THREADS=1 \
  mise exec -- node --experimental-strip-types --test --test-concurrency=1 \
  tests/imap-content-06i.test.ts tests/imap-content-06g.test.ts tests/imap-design-06h.test.ts \
  tests/imap-featured.test.ts tests/imap-portraits.test.ts tests/imap-prototype-content.test.ts \
  tests/imap-interactions.test.ts tests/imap-marker-color.test.ts tests/imap-neighborhood.test.ts
uv run --with reportlab python scripts/build-billing-brief.py
pdftoppm -png -r 100 output/pdf/ha-long-billing-brief.pdf /tmp/ha-long-billing-brief
```

Inspect every regenerated PDF page before sharing. Browser acceptance at desktop 1440/1024px and mobile 390/360/320px:

1. Full-radius/all-filter manifest: eleven unique destinations/markers, correct eleven stories/videos/photos; seven previous stories unchanged.
2. All supplied portraits in both lists, correct centred 3:4 crops; confirm client licensing/clean Hồ Tây replacement. Block a JPEG and check neutral fallback/no broken icon, including dynamically inserted nearby rows.
3. Open each new story; review original prose, sourced prices/hours, provisional lake/bridge fields, day/night distinction and railway safety. Check source links and address text wrapping.
4. Switch videos, including shared Phố Cổ/Đinh Lễ: previous player stops, only one active iframe, muted autoplay where permitted, controls/manual playback and fallback work.
5. Search/category/radius filters, cluster expansion and marker/list selection remain synchronized; no unintended recentering. Google Maps walking directions retain the existing coordinates.
6. Shared approved tactile surfaces, Lora/Be Vietnam Pro, slogan and headings; desktop columns/mobile sheet remain usable without overflow. No debug labels/errors or unauthorized booking/affiliate links.

Outstanding presentation issues: public/local preview recovery, unexecuted functional/browser checks, Hồ Tây watermark/rights, provisional lake/bridge fees/access, source-rate changes after retrieval, original-image bandwidth and browser/provider playback restrictions. STOP for executive preview acceptance, not production deployment.
