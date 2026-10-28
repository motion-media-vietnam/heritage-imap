# Sprint 06C — white-first visual refinement

October 20, 2026. Visual-only implementation complete; local preview refreshed. **Public TLS delivery and rendered browser acceptance remain blocked/pending. STOP after 06C.**

## Changes

- `src/styles/imap-prototype.css`: pure-white content/list/header/mobile-sheet surfaces; `#E5E7E5` dividers; near-black text and navy selected navigation. Vermilion is limited to restrained selection underlines. Practical information is unshaded editorial rows, not a filled data card. Directions is a thin blue-grey outline on white with navy icon/text, explicit hover and 2px focus ring. Existing fonts remain, with refined title spacing and reading rhythm. Recommendation headings/links use the existing editorial serif family. Grid, responsive breakpoints, sheet sizing, marker dimensions/fill and OSM tiles are not redesigned.
- `src/pages/imap-prototype.astro`: “Chỉ đường đến đây” label and matching accessible name, decorative navigation icon and external arrow; exact existing href/target/rel/coordinate guard retained. The same linked-story content is shown in an editorial section rather than a details/summary accordion; headings use h3/h4 hierarchy. No added recommendations or facts.
- `tests/imap-featured.test.ts`: only the expected visible directions label updated. Tests **not run** under the instance resource policy.
- `docs/billing.md`: no-new-service-cost assessment and delivery limits; shareable PDF remains stale under the document-generation restriction.
- `output/sprint-06c/README.md`: handover.

All supplied descriptions, three video IDs, muted-autoplay parameters, prices, schedules, addresses, qualifications and hidden affiliate configuration remain unchanged. No homepage/production source, CMS/backend, destination, dependency, account, tracking or new feature was added.

## Preservation and delivery evidence

Pre/post SHA-256 comparisons passed for `src/data/imap-featured.ts`, `src/data/imap-prototype.ts`, `src/data/places.ts`, `src/lib/imap-directions.ts` and `src/scripts/imap-prototype.ts`. All eleven served Google Maps directions URLs are byte-identical to the prior 06B preview, including coordinates, walking mode and absent origin. All three supplied iframe URLs still contain `autoplay=1`, `mute=1`, `playsinline=1`. No map/filter/cluster algorithm changed.

Changed-path diagnostics reported no errors, but coverage was incomplete (Astro has no configured LSP; one result inconclusive). No full clean typecheck or regression-test pass is claimed. Own-session temporary CSS/TypeScript diagnostic workers were stopped after probing to preserve memory; other sessions/services were not touched. Memory headroom recovered to about 664 MiB before building.

The owner's preview-refresh request authorized the necessary build/restart. With no project mise/Pixi bootstrap config present, the installed toolchain was used through the available mise wrapper. Executed sequentially:

```sh
NODE_OPTIONS=--max-old-space-size=96 UV_THREADPOOL_SIZE=1 RAYON_NUM_THREADS=1 \
  mise exec -- node node_modules/astro/bin/astro.mjs preview stop
NODE_OPTIONS=--max-old-space-size=192 UV_THREADPOOL_SIZE=1 RAYON_NUM_THREADS=1 \
  mise exec -- npm run build
NODE_OPTIONS=--max-old-space-size=96 UV_THREADPOOL_SIZE=1 RAYON_NUM_THREADS=1 \
  mise exec -- node node_modules/astro/bin/astro.mjs preview --background --host 0.0.0.0 --port 4321
```

**Build passed: nine static pages, about 1.34 seconds.** The one existing preview was replaced, not supplemented; background PID 99957. This is a prototype build, not production deployment.

Verified local preview: **http://localhost:4321/imap-prototype/**. Downloaded HTML matches `dist/imap-prototype/index.html`; downloaded `/_astro/imap-prototype.B-Q7t-E0.css` matches the new built stylesheet. Served styles contain white surfaces, `#e5e7e5` dividers and the white outlined directions action. Native media playback retains its own dark player canvas; no OSM tile styling/filter is applied.

## Public preview blocker

**https://preview.code.arvigeus.one/imap-prototype/** still fails before HTTP with:

`curl: (35) TLS connect error: error:0A000438:SSL routines::tlsv1 alert internal error`

This is not a working public URL. The workspace administrator must repair/confirm TLS and public forwarding to **port 4321**, or provide the actual public forwarding URL. No alternative authenticated forwarding URL is supplied. Localhost/container-private URLs are not public delivery. Public browser caching and visible delivery cannot be verified until that external routing issue is resolved.

## Remaining acceptance

No browser executable is available here; no screenshot, rendered desktop/mobile visual pass or real playback/handoff check is claimed. On desktop 1440×900 and mobile 390×844/360px width, inspect white surfaces, reading rhythm, recommendation headings, full 16:9 video, preserved muted autoplay, practical qualifiers, directions hover/keyboard focus, no horizontal overflow and unchanged list/map/sheet behavior.

Application tests were skipped under instance policy. On a capable machine run:

```sh
NODE_OPTIONS=--max-old-space-size=192 UV_THREADPOOL_SIZE=1 RAYON_NUM_THREADS=1 \
  mise exec -- node --experimental-strip-types --test --test-concurrency=1 \
  tests/imap-featured.test.ts tests/imap-prototype-content.test.ts \
  tests/imap-interactions.test.ts tests/imap-marker-color.test.ts \
  tests/imap-neighborhood.test.ts tests/imap-prototype-camera.test.ts \
  tests/imap-prototype-init.test.ts
```

PDF generation/visual inspection instructions remain in `docs/billing.md`; the old PDF must not be shared as this updated record. No next sprint or production work.
