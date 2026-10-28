# Approved category illustrations — source ready, visual review pending

The four uploaded files were found as `public/images/imap-icon-*.png.png` and renamed to the requested single `.png` suffix without altering image bytes. PNG headers confirm all four are 800×800 RGBA images. No placeholders, remote images, image processing or package installation.

## Scope

- `src/pages/imap-prototype.astro`: explicit four-file mapping and four native category buttons above the explorer; existing Vietnamese labels, empty decorative image alt text, group description, pressed states and controls associations.
- `src/scripts/imap-prototype.ts`: choices update the existing category select and call the same filter function; clicking a selected category returns to All. The filter function synchronizes pressed states after dropdown changes and filter resets. No filtering rules, map/cluster rendering, category registry, data, coordinates, story templates/media, autoplay or directions changes.
- `src/styles/imap-prototype.css`: equal 96px desktop / 64px mobile illustration boxes, proportional contain scaling, four-column responsive row, label wrapping, selected border/shadow, gentle hover lift/press scaling and reduced-motion handling. Existing keyboard focus remains. The approved three-column explorer grid and story-panel styling are untouched by this pass.
- `tests/imap-category-illustrations.test.ts`: unexecuted source/asset contract checks for mappings, RGBA dimensions, filter hooks, accessible markup and SVG-marker separation.
- `docs/billing.md`: actual storage and reproducible forecast transfer; no new configured subscription/API fees. Existing stale PDF is not current.

Other pre-existing uncommitted changes were preserved. No visual acceptance claimed; STOP here.

## Delivery blocker

HTTP probe: port 4321 is not listening. Public `https://preview.code.arvigeus.one/imap-prototype/` still fails TLS before HTTP with `tlsv1 alert internal error`. These are separate local-service and public-routing issues.

Initial memory was approximately 2.30 GB used of a 2.68 GB container limit; before a server start could be attempted, usage reached 2,683,252,736 of 2,684,354,560 bytes (about 1 MiB remaining). A later check still had only about 7 MiB remaining. Despite existing authorization for one background development preview, starting it was deferred to preserve responsiveness. No build, test execution, browser screenshot or PDF generation was run under instance policy. Source and PNG-header review are not runtime or visual acceptance.

## Latest refresh recheck

On the repeated refresh request, local port 4321 still refused connections and the public HTTPS origin still failed before HTTP with `tlsv1 alert internal error`. Container usage was 2,383,298,560 / 2,684,354,560 bytes (about 287 MiB headroom). That remains insufficient safe headroom for starting the development preview on this shared instance; no server was started and no application code was changed. Public preview refresh remains blocked, not completed. Existing cost assumptions are unchanged; no service or paid commitment was added.

## Recovery / access

1. Preserve the project files and ask the workspace administrator to free memory from unnecessary workloads or safely restart the workspace with its project volume retained. Do not reset the checkout or discard uncommitted files.
2. After adequate memory is available, inspect manager status and start one background dev preview, not a production build. No project mise/Pixi config was present; mise itself is available.

```sh
mise trust --show
mise current
mise exec -- node node_modules/astro/bin/astro.mjs dev status
# Clear a stale dev record only if needed:
mise exec -- node node_modules/astro/bin/astro.mjs dev stop
NODE_OPTIONS=--max-old-space-size=256 UV_THREADPOOL_SIZE=1 RAYON_NUM_THREADS=1 \
  mise exec -- node node_modules/astro/bin/astro.mjs dev --background --host 0.0.0.0 --port 4321
curl -fI http://127.0.0.1:4321/imap-prototype/
```

3. Open Arvigeus's generated browser preview for workspace port **4321**, then append `/imap-prototype/`. Exact interface labels are not verified. If it uses the broken hostname, ask the administrator to repair its TLS certificate/reverse-proxy mapping or supply the actual forwarded URL. An Astro restart cannot fix TLS failing before HTTP.
4. Verify each `/images/imap-icon-{heritage,food-drink,stay,experience}.png` loads successfully through that same preview origin.

## Validation commands for a capable machine

```sh
NODE_OPTIONS=--max-old-space-size=192 UV_THREADPOOL_SIZE=1 RAYON_NUM_THREADS=1 \
  mise exec -- node --experimental-strip-types --test --test-concurrency=1 \
  tests/imap-category-illustrations.test.ts tests/imap-prototype-content.test.ts \
  tests/imap-interactions.test.ts tests/imap-marker-color.test.ts tests/imap-neighborhood.test.ts
uv run --with reportlab python scripts/build-billing-brief.py
pdftoppm -png -r 100 output/pdf/ha-long-billing-brief.pdf /tmp/ha-long-billing-brief
```

Visually inspect every PDF page before sharing. Browser review: desktop 1440px and 1024px, mobile 390px and 360px, keyboard and reduced motion. Check consistent PNG proportions/labels, no horizontal overflow, category click and deselect-to-All, select-to-buttons synchronization, clear filters and honest empty states (food/drink currently has no matching records). Confirm map marker/cluster SVGs, three-column geometry, selected story/video/autoplay, directions and mobile sheet interactions remain intact. No automated map-tile scan is needed. Stop for visual review.
