# Hotfix 06K.1 — hero typography only

October 21, 2026. Source updated; STOP for visual review.

## Changes

- `src/pages/index.astro`: explicit headline break after “Khám phá Hà Nội”; exact revised subheadline with a break after “Di sản – Văn hiến – Sáng tạo.”.
- `src/styles/editorial.css`: Lora/400 headline, `clamp(36px, 4.2vw, 60px)`, 680px maximum, 1.14 line height and mild negative tracking. Tablet 42–48px; mobile 32–38px/1.16 with the forced headline break hidden to allow natural wrapping. Be Vietnam Pro/400 subheadline, 16–18px/1.65 with 26px desktop and 24px mobile top spacing. Its intentional sentence break is retained on mobile; further wrapping is allowed there.
- `tests/homepage-hero-06k.test.ts`: updated copy/break/size assertions, NOT run.
- `docs/billing.md`: no added configured subscription/API costs or requests under unchanged traffic/media assumptions; existing forecasts/exclusions/PDF status retained.

Before/after source diffs show no other application changes: video/poster, brightness, overlay, hero height, transparent/sticky header, navigation, CTA, iMap, video listing and footer remain untouched. The main-page diff contains only two text-markup lines; stylesheet diff contains only type sizes/width/tracking/spacing and the responsive line-break rule. No runtime controller changes, package changes, restart or production deployment.

## Checks / preview

**Source confirmed:** requested text, desktop line break, revised sentence break, requested clamp/weights/leading and unchanged CTA link. This does not prove rendered font metrics or visibility.

**NOT TESTED:** desktop/mobile rendering, actual two-line fit, overlap/clipping, balanced whitespace, CTA visibility/clicks. No tests/build/browser rendering/PDF generation under instance policy.

Target: https://code.arvigeus.one/workspaces/mm-guide/preview

Actual HTTP probe: **303 → /login**, not a signed-in rendered page. Memory: 2,642,276,352 / 2,684,354,560 bytes (about 40 MiB headroom). Existing app-render refresh was deferred for safety; no successful visual refresh is claimed. Once memory is available, sign in and reload the existing workspace preview frame; do not start another server. Obtain approval before a disruptive restart if one becomes necessary.

## Capable-machine validation (NOT run here)

Use the configured toolchain; container wrappers shown, no bootstrap/install authorized on this instance:

```sh
mise exec -- node --experimental-strip-types --test --test-concurrency=1 tests/homepage-hero-06k.test.ts
mise exec -- uv run --with reportlab python scripts/build-billing-brief.py
pdftoppm -png -r 100 output/pdf/ha-long-billing-brief.pdf /tmp/ha-long-billing-brief
```

The PDF remains stale; inspect every regenerated page before sharing. In the signed-in browser review desktop 1440/1280px, tablet 1024/768px and mobile 390/360/320px: desktop headline exactly “Khám phá Hà Nội” / “của riêng bạn”; subheadline breaks after “Sáng tạo.”; no oversized/overlapping lines, clipping or horizontal overflow; CTA visible. Confirm unchanged media/header/height/below-hero appearance. STOP for visual review.
