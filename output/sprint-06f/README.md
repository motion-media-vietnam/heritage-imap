# Sprint 06F — destination portraits, source ready

October 21, 2026. STOP for visual review. No production pages, CMS, new destinations, coordinates or category changes.

## Assets and missing mappings

All seven supplied JPEG files exist in `public/images/`; original filenames and bytes are retained. URLs encode spaces. Canonical assignments live only in prototype destination records as optional `portraitImage` fields:

| Destination ID | Supplied file |
| --- | --- |
| ho-hoan-kiem | Ho Hoan kiem.jpg |
| pho-co | Pho co.jpg |
| den-ngoc-son | den ngoc son.jpg |
| nha-tho-lon-ha-noi | Nha tho lon.jpg |
| sofitel-legend-metropole-hanoi | Metropole legand.jpeg |
| pho-sach-dinh-le | pho sach Dinh Le.jpg |
| nha-hat-mua-roi-thang-long-hoan-kiem | nha hat mua roi nuoc Thang Long.jpg |

**No supplied portrait:** `van-mieu` (Văn Miếu), `hoang-thanh-thang-long` (Hoàng thành Thăng Long), `ho-tay` (Hồ Tây), `cau-long-bien` (Cầu Long Biên). Both lists intentionally show neutral tiles for them. Do not use unrelated site assets or YouTube thumbnails to fill these gaps.

## Source implementation

- `src/lib/imap-neighborhood.ts`: optional `portraitImage?: string` on the prototype destination type; filtering/marker logic unchanged.
- `src/data/imap-prototype.ts`: assign seven local portrait paths. Original production records are never mutated: two prototype copies add photo fields, with original content and coordinate objects retained. Other original objects remain untouched. Candidate facts/IDs/pins remain unchanged.
- `src/components/DestinationPortrait.astro`: one component with a neutral 3:4 frame, rounded corners, lazy-loaded decorative image and consistent cover crop. Capture-phase load/error handling covers initial directory images and nearby images inserted later from story templates. Failed/pending images remain invisible over a neutral tile; no broken-image flash. No image is requested when no source is assigned.
- `src/pages/imap-prototype.astro`: directory passes `place.portraitImage`; nearby passes `nearby.place.portraitImage`. No second image mapping. Remove row 3D icons, YouTube previews/source labels and obsolete mappings. Category, name, concise/clamped location remain on the right; full name remains available without truncation. Whole-row buttons and existing IDs/nearby distances remain.
- `src/styles/imap-prototype.css`: 72px directory portraits, 64px at narrower widths, 40px nearby portraits; flexible text, soft selected elevation and hover background. No top strip or explorer-column changes; original mobile sheet retained.
- Remove thumbnail-only helper/controller handling, not video player/embed/autoplay code.
- `tests/imap-portraits.test.ts` replaces obsolete category-illustration tests, covering seven exact paths/files, four missing mappings, shared field/component, whole-row click binding and cached/pending/failed portrait handling. `tests/imap-prototype-content.test.ts` now checks content/coordinate preservation rather than requiring pointer identity for prototype copies with photo fields. Tests were NOT run.
- `docs/billing.md`: no new configured subscription/API fees; seven originals total 6,692,998 bytes. At 1k/10k/100k uncached all-image visits, portrait-only host transfer is 6.692998/66.92998/669.2998 GB. This is demand, not a quoted hosting bill. No duplicated nearby files. Recommend optimized approved local renditions before release; none generated on this constrained instance. PDF remains stale.

Existing uncommitted work is preserved. Photo identity/rights and exact crops still need client visual approval. Intrinsic dimensions were not verified (`file` is unavailable); no image-processing or application code was executed for validation.

## Preview blocker

Configured public URL: **https://preview.code.arvigeus.one/imap-prototype/** — NOT currently working/refreshed.

- Local port 4321 refuses connections.
- Public HTTPS fails TLS before HTTP with `tlsv1 alert internal error`.
- Latest cgroup usage: 2,631,008,256 / 2,684,354,560 bytes, about 51 MiB free. Earlier this pass had about 7 MiB free. A server start is unsafe; none attempted.

Administrator must free unnecessary workloads or safely restart the workspace while preserving its project volume, and repair TLS/port-4321 forwarding. Do not reset the dirty checkout. No alternative working URL is known. Starting Astro cannot fix the public TLS failure.

After memory recovery, inspect tool-manager trust/status before starting one background preview. No local mise/Pixi config/lock files were present; mise is installed. Review any new configuration before trusting it.

```sh
mise trust --show
mise current
mise exec -- node node_modules/astro/bin/astro.mjs dev status
# Only if stale preview state needs clearing:
mise exec -- node node_modules/astro/bin/astro.mjs dev stop
NODE_OPTIONS=--max-old-space-size=256 UV_THREADPOOL_SIZE=1 RAYON_NUM_THREADS=1 \
  mise exec -- node node_modules/astro/bin/astro.mjs dev --background --host 0.0.0.0 --port 4321
curl -fI http://127.0.0.1:4321/imap-prototype/
curl -fI https://preview.code.arvigeus.one/imap-prototype/
```

Use the administrator-confirmed public forwarding URL for workspace port 4321 plus `/imap-prototype/` for visual review.

## Validation deferred under instance policy

No tests, build, browser rendering/interaction validation or PDF regeneration. Exact commands for a capable machine:

```sh
NODE_OPTIONS=--max-old-space-size=192 UV_THREADPOOL_SIZE=1 RAYON_NUM_THREADS=1 \
  mise exec -- node --experimental-strip-types --test --test-concurrency=1 \
  tests/imap-portraits.test.ts tests/imap-prototype-content.test.ts \
  tests/imap-featured.test.ts tests/imap-interactions.test.ts \
  tests/imap-marker-color.test.ts tests/imap-neighborhood.test.ts
uv run --with reportlab python scripts/build-billing-brief.py
pdftoppm -png -r 100 output/pdf/ha-long-billing-brief.pdf /tmp/ha-long-billing-brief
```

Inspect every PDF page before sharing. Browser checklist at desktop 1440/1024px and mobile 390/360/320px:

1. One portrait on the left per row; category/name/location on the right. No 3D row icons, YouTube row previews/labels or top image strip.
2. Verify seven photo-to-destination assignments and 3:4 crops. Four missing-photo neutral rows are intentional. Block one local JPEG and check clean neutral fallback, including after opening a nearby list. Test cached images and slow loads.
3. Directory and nearby use the exact same image URL for each destination, not duplicate thumbnail assets. Inspect network caching with normal cache enabled.
4. Click row portrait/text and keyboard Enter/Space: corresponding story opens. Nearby portrait/name/distance clicks still navigate correctly. Distances stay legible.
5. Long names remain fully readable; no horizontal overflow; soft selected state/focus remain clear. Test mobile sheet states and desktop three-column selection.
6. Map/navy markers/clusters, search/category/radius filters, all three muted-autoplay videos, prices/schedules/directions remain unchanged.

STOP for visual review after preview recovery. No broader rollout.
