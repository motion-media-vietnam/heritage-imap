# Sprint 06E — source ready, public preview blocked

October 21, 2026. Stop for visual review; no CMS, production-page changes, new destinations or paid infrastructure.

## Implemented

- `src/pages/imap-prototype.astro`: remove the top category strip/help text; retain search/dropdowns. Directory rows use the four existing PNG mappings: heritage → stamp-worthy-spot, food/drink → food-drink, stay → stay, experience → experience. Remove row arrows. Only the three existing featured records receive remote video thumbnails. Whole rows remain native story-opening buttons with existing IDs, labels and selected states.
- `src/styles/imap-prototype.css`: category images 36px (32px narrow desktop), contain scaling; thumbnails 60px (56px narrow desktop), rounded corners, preserved aspect ratio. Neutral pending/failure tile and YouTube source text on successful previews. Flexible text with min-width zero/wrapping. Narrow desktop lets the name span above metadata/right thumbnail rather than squeezing it into a few letters per line. Subtle hover/selected backgrounds respect existing white-first styling and reduced motion. Explorer columns/mobile sheet remain unchanged.
- `src/scripts/imap-prototype.ts`: remove strip-only hooks; retain native select/filter and exact row click binding. Add image success/error/cached-image handling; reject low-resolution unavailable-image responses. Images remain invisible until successful load, so errors cannot flash broken-image symbols. No retries. Markers/clusters, map camera/filter rules and story/video logic unchanged.
- `src/data/imap-featured.ts`: add a thumbnail URL helper using the existing strict YouTube watch-URL validator. Existing client content, embed URLs and autoplay/mute behavior unchanged.
- `tests/imap-category-illustrations.test.ts`: replace obsolete strip tests with asset/placement/thumbnail contracts and controlled row-click/fallback regressions. Authored, NOT executed.
- `docs/billing.md`: scope, primary-source terms/rights caveats, measured image-response sizes, reproducible usage scenarios, exclusions and preview blocker. No new configured subscription/API fees; this is not a full operating-cost quote. Existing PDF remains stale.

Other existing uncommitted work was preserved.

## Checks actually performed

Source review confirms no category-strip markup/controller hooks/CSS; PNG markup occurs only inside the directory; featured thumbnail mapping is derived from the existing three supplied IDs; whole-row click binding still passes that row's slug to `openPlace`. Min-width/wrapping and narrow desktop rules are present, but rendered overflow and interaction acceptance remain unverified.

Three small image HEAD requests returned HTTP 200, JPEG:

| Destination | Existing video ID | Response bytes |
| --- | --- | ---: |
| Metropole | LpleBDMdAMc | 8,671 |
| Đinh Lễ | lfqbodYX8ow | 12,395 |
| Nhà hát Múa rối | -bezb1tRCZM | 8,907 |

Direct image inspection confirmed each `https://i.ytimg.com/vi/ID/mqdefault.jpg` returns a 320×180 video preview. These are actual supplied-video thumbnails, not curated destination photos: Metropole's preview features a woman, Đinh Lễ's a presenter on a street, and Múa rối's puppets. No video extraction/rehosting. Successful retrieval is not proof of rights; client/rights-holder clearance and applicable YouTube terms/branding requirements must be confirmed before release. External image delivery shares visitor network information with Google; no-referrer suppresses the page URL, not the IP address.

Application tests/build/browser rendering and PDF generation were skipped under the instance resource policy. No runtime or mobile visual pass claimed.

## Public preview: NOT refreshed

Configured URL: **https://preview.code.arvigeus.one/imap-prototype/** — currently fails TLS before HTTP, not a working review URL.

Local port 4321 refuses connections. Latest memory: 2,648,363,008 / 2,684,354,560 bytes (about 34 MiB free); starting a dev server would be unsafe. No server start/restart or production build attempted. Administrator must free unnecessary workloads or safely restart the workspace preserving the project volume, and repair public TLS/port-4321 forwarding. Do not discard the dirty checkout. No actual alternative forwarding URL is known.

After memory recovery, inspect tool-manager status and start only one background preview. No local mise/Pixi config/lock files were present; mise is installed. Review any newly added manager config before trusting it.

```sh
mise trust --show
mise current
mise exec -- node node_modules/astro/bin/astro.mjs dev status
# Stop stale preview state only if needed:
mise exec -- node node_modules/astro/bin/astro.mjs dev stop
NODE_OPTIONS=--max-old-space-size=256 UV_THREADPOOL_SIZE=1 RAYON_NUM_THREADS=1 \
  mise exec -- node node_modules/astro/bin/astro.mjs dev --background --host 0.0.0.0 --port 4321
curl -fI http://127.0.0.1:4321/imap-prototype/
curl -fI https://preview.code.arvigeus.one/imap-prototype/
```

An Astro restart cannot repair TLS failing before HTTP. Use the administrator-confirmed forwarded URL for port 4321 with `/imap-prototype/`; do not invent a working URL.

## Validation on a capable machine

```sh
NODE_OPTIONS=--max-old-space-size=192 UV_THREADPOOL_SIZE=1 RAYON_NUM_THREADS=1 \
  mise exec -- node --experimental-strip-types --test --test-concurrency=1 \
  tests/imap-category-illustrations.test.ts tests/imap-featured.test.ts \
  tests/imap-interactions.test.ts tests/imap-prototype-content.test.ts \
  tests/imap-marker-color.test.ts tests/imap-neighborhood.test.ts
uv run --with reportlab python scripts/build-billing-brief.py
pdftoppm -png -r 100 output/pdf/ha-long-billing-brief.pdf /tmp/ha-long-billing-brief
```

Visually inspect every PDF page before sharing. Desktop 1440/1024px and mobile 390/360/320px review:

1. No top strip; compact original controls, dropdown category labels/filter counts/reset retained.
2. All directory icons use correct PNGs, stay aligned, and selected text remains readable; navy map/cluster SVGs unchanged.
3. Three exact video thumbnails, no arrows or fabricated images for other destinations. Block `i.ytimg.com` to confirm neutral fallback/no broken-image symbol. Test cached responses and filters hiding/showing rows.
4. Click each row's text, icon and thumbnail; keyboard Enter/Space opens its corresponding story. Close/reset/filter behavior unchanged.
5. No horizontal overflow or unusable name wrapping; narrow desktop thumbnail remains on the right below the full-width name. Mobile discovery sheet and story states remain usable.
6. Existing story prices/schedules/directions and all three muted-autoplay videos remain unchanged.

STOP for visual review after preview recovery; do not broaden scope.
