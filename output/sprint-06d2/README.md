# Sprint 06D.2 — story-panel typography

**Source implemented; preview delivery and visual review pending. STOP here.**

## Changes

Only application file changed in this pass: `src/styles/imap-prototype.css`.

Removed scattered panel font declarations and centralized roles in the `06D.2` block, with reusable `--story-*` variables scoped to `.story`:

| Role | Typeface / weight | Desktop | Mobile |
| --- | --- | --- | --- |
| Destination title | Lora Regular | 30px / 1.2 | 26–28px / 1.2 |
| All three section headings | Be Vietnam Pro SemiBold | 18px / 1.35 | 17px / 1.35 |
| Description / related prose | Be Vietnam Pro Regular | 14px / 1.65 | same |
| Practical values | Be Vietnam Pro Medium | 13px / 1.65 | same |
| Labels / secondary notes / source links | Be Vietnam Pro Regular | 11px / 1.65 | same |
| Buttons / directions / nearby names | Be Vietnam Pro SemiBold | 13px / 1.5 | same |
| Related-item titles | Be Vietnam Pro SemiBold | 14px / 1.5 | same |

The close glyph remains 25px as a functional icon, not a headline. Description bottom margin decreases from 24px to 18px, alongside the tighter requested reading leading. Long names/addresses can wrap within the panel; nearby button names can shrink and wrap rather than force overflow. Section headings share one rule. Existing panel headings use Lora only for the destination title; nearby names and related-item titles no longer compete in serif.

No font request changes: Lora and Be Vietnam Pro and the required 400/500/600 weights were already loaded. No changes to content, prices, video attributes, autoplay, Google Maps links, controller, markers, map/layout geometry, surface colors, tactile card padding, shadows, radii, interaction states or pill shape. Other pre-existing uncommitted work is preserved.

`docs/billing.md` records $0 added configured recurring service fees before tax under unchanged-provider/traffic assumptions, with hosting/labor and other exclusions.

## Preview findings

- HTTP connection to `127.0.0.1:4321` refused: the previously started dev server is no longer listening. No cause established.
- `https://preview.code.arvigeus.one/imap-prototype/` still fails TLS before HTTP (`tlsv1 alert internal error`). It is not a verified working public URL.
- Memory check: cgroup limit 2,684,354,560 bytes, current use 2,655,703,040 bytes, approximately 27 MiB headroom. Starting another server was deferred under the instance responsiveness policy, despite existing authorization to run one dev preview.
- Source review only. No build, application tests, browser rendering, screenshot or PDF generation performed. Editor diagnostics are not a rendered-layout pass.

## Recovery

1. Save/preserve workspace files. Use the Arvigeus workspace resource controls to stop unnecessary workloads, or ask the administrator to safely restart the workspace while retaining its project volume. Exact interface labels are not verified. Do not discard/recreate the checkout or reset uncommitted files.
2. After sufficient memory is available, use the existing installed toolchain (no package bootstrap needed). In this container no mise/Pixi project files were found; the mise manager is available and reports no trusted configuration. Inspect status, then run one dev server, not a second static preview:

```sh
mise trust --show
mise current
mise exec -- node node_modules/astro/bin/astro.mjs dev status
# If status reports a stale/nonfunctional dev instance, clear it first:
mise exec -- node node_modules/astro/bin/astro.mjs dev stop
NODE_OPTIONS=--max-old-space-size=256 UV_THREADPOOL_SIZE=1 RAYON_NUM_THREADS=1 \
  mise exec -- node node_modules/astro/bin/astro.mjs dev --background --host 0.0.0.0 --port 4321

curl -fI http://127.0.0.1:4321/imap-prototype/
curl -fsS 'http://127.0.0.1:4321/src/styles/imap-prototype.css?direct' -o /tmp/mm-06d2.css
cmp src/styles/imap-prototype.css /tmp/mm-06d2.css
```

3. In Arvigeus open the generated browser preview for port **4321**, then append `/imap-prototype/`. This development preview needs no full build/deployment. Select Sofitel Legend Metropole Hanoi; repeat with another story to review consistent panel type roles.
4. If the generated URL still points to the broken public hostname, ask the administrator to repair its TLS certificate/reverse-proxy mapping to workspace port 4321, or supply the actual forwarded URL. Restarting Astro cannot fix a TLS failure before HTTP.

## Checks on a capable machine

Do not run here without the necessary resource-policy override:

```sh
NODE_OPTIONS=--max-old-space-size=192 UV_THREADPOOL_SIZE=1 RAYON_NUM_THREADS=1 \
  mise exec -- node --experimental-strip-types --test --test-concurrency=1 \
  tests/imap-featured.test.ts tests/imap-prototype-content.test.ts \
  tests/imap-interactions.test.ts tests/imap-marker-color.test.ts

uv run --with reportlab python scripts/build-billing-brief.py
pdftoppm -png -r 100 output/pdf/ha-long-billing-brief.pdf /tmp/ha-long-billing-brief
```

Inspect every PDF page before sharing; current PDF is stale. In the browser review desktop 1440×900 and 1024px width, mobile 390×844 and 360px width, plus 200% zoom: title dominance, uniform section headings, reduced description density, readable values/qualifiers, Vietnamese wrapping, no overflow, retained rounded cards/pill and keyboard focus, and unchanged playback/directions/map interactions. These are pending acceptance steps, not claimed results.
