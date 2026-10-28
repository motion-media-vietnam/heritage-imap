# Sprint 06H — shared approved design, final visual review pending

October 21, 2026. Prototype source updated. STOP for final visual review; no production rollout, new destinations, CMS or packages.

## Changes

- `src/pages/imap-prototype.astro`: exact slogan **Chạm để khám phá** in the existing responsive h1. Remove only the Metropole-specific tactile class condition; every story already has the unconditional `destination-story` class. Seven client-populated video stories and all 11 existing catalog destinations remain intact.
- `src/styles/imap-prototype.css`: promote existing `.tactile-metropole` rules to `.destination-story`, and the Metropole-ID-specific directory rules to `.directory .directory-row`. Reuse the approved values unchanged: 14px video corners/elevation, 18px white practical cards with spacing instead of table dividers, 52px white pill directions with navy icon color/shadows, 12px elevated nearby cards, rounded/softly elevated row states and shared hover/press/focus/reduced-motion treatment. Existing shared Lora title / Be Vietnam Pro UI, description/visitor-note/related-experience rules and mobile media queries remain. No independent redesign or per-destination copies.
- Leave the existing Metropole **map pin** shadow selectors alone: map/cluster presentation is explicitly preserved, not part of the story-design rollout.
- `tests/imap-design-06h.test.ts`: authored source/data contracts for unconditional shared styling, all 11 catalog records / seven client stories, five required practical-information types, current headings/slogan, portrait calls and reduced motion. NOT executed.
- `docs/billing.md`: no new configured subscription/API fees, unchanged image/player request assumptions, incremental CSS/HTML transfer formula, exclusions and preview/PDF status.

No edits to content/catalog, portrait files/component, controller, camera, direction URLs, existing heading strings or production pages. Existing dirty work preserved. No empty practical fields added and no missing facts invented. Catalog records without client media retain honest existing placeholders and existing available information.

## Required review matrix

| Destination | Existing information retained | Shared treatment in source | Browser status |
| --- | --- | --- | --- |
| Metropole | Reception 24/7, indicative room price | Same approved values, now shared selectors | Not rendered/tested |
| Đinh Lễ | Free visit, 08:00–21:00 reference hours | Same video/card/directions/nearby rules | Not rendered/tested |
| Múa rối | Ticket price and performance windows | Same rules; wide schedule field preserved | Not rendered/tested |
| Hồ Gươm | Free public-space visit, qualified 24/7 access | Same rules; public-space caveat preserved | Not rendered/tested |
| Đền Ngọc Sơn | 50,000 / 25,000 VNĐ prices, student card, day-specific hours | Same rules; wide facts and client reference links preserved | Not rendered/tested |

Source/template scope covers every other existing destination too, not just these five. A CSS/source review is not a rendered visual, autoplay or mobile-overflow acceptance pass.

## Preservation evidence

Before/after SHA-256 outputs match exactly for these explicitly checked files:

```text
038198008b1c85023d3cdd5b029abe952deb700de3b2975b7f566a6765217d9b  src/data/imap-featured.ts
b0aed42630234e0e4115eeebfbf4ac2afa6a01556947aebd7f505b6be70ea0e8  src/data/imap-prototype.ts
d9fd2e9f75e6a6fa9ee2f58fcd429f06d4e1460b54df124fdd0bc7d2303229de  src/data/places.ts
e95a1300ee6785ae0bc26d9fe2346173d3673b714879ddb3c2e4faa98986ad80  src/components/DestinationPortrait.astro
7d2c538208bd2b50e674e9ebf523ffd514f21c654f607ddf267fe12ce2c386ec  src/scripts/imap-prototype.ts
628d0e813b4d2a048ef283cc635a2dc0bfd7c8c34008e5f5927a829d267f7196  src/lib/imap-directions.ts
bfc38539c646735a96b71ab861d553776bcaa6a89d516179f20d40ea22720dca  src/lib/imap-prototype-camera.ts
e2b959bc59b7e90bf5700af1a479c2da6493754cf2fe266ace6a377382cd2442  src/pages/index.astro
27b222a4d0972fb32493c2868bfbf38a71ea52eccefd0fa992a97ea00f54642f  src/pages/imap.astro
```

Pre-existing controller style findings were session-deferred: the controller is byte-identical and not part of this CSS/slogan change. No suppressions, unrelated refactoring or claim of a clean analyzer run. Resource policy prohibits executing tests/builds/linters/browser validation; none was deliberately run. Hash comparison/source inspection and bounded HTTP probes are the only performed checks.

## Public preview: blocked, NOT refreshed

Configured URL: **https://preview.code.arvigeus.one/imap-prototype/** — currently NOT working.

- Local port 4321 refuses connections.
- Public HTTPS fails before HTTP with `tlsv1 alert internal error`.
- Latest memory: 2,492,940,288 / 2,684,354,560 bytes, about 183 MiB headroom. A dev-server start was not safe; none attempted.

The workspace administrator must free unnecessary workloads or safely restart the workspace preserving the project volume, and repair public TLS/port-4321 forwarding. Do not reset the dirty checkout. No alternate working public URL is known; restarting Astro cannot fix TLS failing before HTTP.

After recovery, inspect current repository manager files and trust/status before starting one background preview. No mise/Pixi project config/lock files were present in this pass; mise is installed. Review any newly added config before trusting it; installs require separate approval.

```sh
mise trust --show
mise current
mise exec -- node node_modules/astro/bin/astro.mjs dev status
# Stop stale state only if needed:
mise exec -- node node_modules/astro/bin/astro.mjs dev stop
NODE_OPTIONS=--max-old-space-size=256 UV_THREADPOOL_SIZE=1 RAYON_NUM_THREADS=1 \
  mise exec -- node node_modules/astro/bin/astro.mjs dev --background --host 0.0.0.0 --port 4321
curl -fI http://127.0.0.1:4321/imap-prototype/
curl -fI https://preview.code.arvigeus.one/imap-prototype/
```

Use the administrator-confirmed working forwarding origin plus `/imap-prototype/` for review. Do not report a successful public refresh until both the local route and public delivery actually work.

## Deferred validation commands (capable machine)

```sh
NODE_OPTIONS=--max-old-space-size=192 UV_THREADPOOL_SIZE=1 RAYON_NUM_THREADS=1 \
  mise exec -- node --experimental-strip-types --test --test-concurrency=1 \
  tests/imap-design-06h.test.ts tests/imap-content-06g.test.ts tests/imap-featured.test.ts \
  tests/imap-portraits.test.ts tests/imap-prototype-content.test.ts \
  tests/imap-interactions.test.ts tests/imap-marker-color.test.ts tests/imap-neighborhood.test.ts
uv run --with reportlab python scripts/build-billing-brief.py
pdftoppm -png -r 100 output/pdf/ha-long-billing-brief.pdf /tmp/ha-long-billing-brief
```

Tests, build, rendered browser checks and PDF generation were skipped under instance policy. The PDF remains stale; visually inspect every regenerated page before sharing.

Browser checklist: compare all five required destinations at desktop 1440/1024px and mobile 390/360/320px; confirm identical approved media/card/pill/nearby surfaces, title/body fonts, visitor notes, hover/focus/selected and reduced-motion behavior. Check long schedule/address wrapping, no overflow, nearby portraits/distances/clicks, three-column geometry and mobile sheet states. Verify exact slogan in desktop/mobile, all current headings, original seven videos/content/portraits, muted autoplay/manual playback/fallback, no overlapping players, hidden affiliate CTA, directions, navy markers/clusters and search/category/radius/camera behavior. No final visual pass is claimed.

STOP for final visual review after preview recovery. No broader rollout.
