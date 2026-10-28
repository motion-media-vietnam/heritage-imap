# Sprint 06D.1 — Metropole tactile experiment

**Source ready; public preview refresh and rendered acceptance pending. STOP for art-direction review.**

## Scope and provenance

The working tree already contained the Metropole class, marker identity hook and scoped tactile CSS when this pass began. They were preserved, not represented as newly authored here. This pass edits only `src/styles/imap-prototype.css`, `docs/billing.md` and this handoff. Other pre-existing uncommitted work remains untouched.

The experiment lives only on `/imap-prototype/`. Other destination stories retain the 06C baseline. No production integration, CMS/backend, content, dependency or new feature.

## Exact visual components in the experiment

1. **Metropole video frame:** 14px corners, two restrained navy-tinted shadows. Original landscape aspect ratio, iframe/video attributes and playback behavior remain unchanged.
2. **Practical facts card:** white surface, 18px corners, layered soft elevation, inset spacing. This pass removes internal table rules, separates facts with space and gives fact values medium weight. All labels, prices, address and caveats remain unchanged.
3. **“Chỉ đường đến đây” link:** white 52px-minimum-height pill, existing inline navigation icon, navy text, subtle border/shadow. Hover gently lifts 1px; press lowers 1px; keyboard focus retains an explicit navy outline. Google Maps URL and accessible label are untouched.
4. **Nearby destination buttons inside the Metropole story:** 12px corners, white raised surfaces, small gaps, hover/press/focus feedback. Destinations and selection behavior are untouched.
5. **Metropole directory button:** 14px corners; selected state has an inset navy rail and layered shadow. This pass replaces the selected title underline with a clean title, navy category icon and restrained existing Vietnamese-red arrow accent. Existing serif typography, Vietnamese copy and white-first palette remain; no imported brand assets or decorative motifs.
6. **Unclustered Metropole marker only:** subtle shadow below its existing navy circle; selected rings retain their colors and receive a light shadow. No changes to 48px target, category SVG, navy fill, cluster symbol/count, clustering algorithm or camera behavior. The pre-existing `data-destination` hook is absent from clusters.

Reduced-motion mode now explicitly disables hover/press displacement with selectors that override the interactive rules. No gradients, glass, decorative 3D pins or layout redesign.

## Validation and delivery limits

Source/CSS cascade review only. Builds, application tests, executable validation, server starts/restarts, browser screenshots and PDF generation were skipped because of instance policy. No public preview refresh or rendered visual pass is claimed. Automatic editor diagnostics are not browser acceptance.

The previous `output/sprint-06c/README.md` records a TLS failure at `https://preview.code.arvigeus.one/imap-prototype/`. This pass did not recheck it. The administrator needs to confirm/repair TLS and forwarding to port 4321, or provide the actual public URL. A local preview is not public delivery.

## Commands for an authorized, capable machine

Use the existing locked dependencies; do not install/update them implicitly. In a container retain the mise wrapper and inspect its trust/current status first. No project mise/Pixi config was present at inspection.

```sh
mise trust --show
mise current

NODE_OPTIONS=--max-old-space-size=192 UV_THREADPOOL_SIZE=1 RAYON_NUM_THREADS=1 \
  mise exec -- node --experimental-strip-types --test --test-concurrency=1 \
  tests/imap-featured.test.ts tests/imap-prototype-content.test.ts \
  tests/imap-interactions.test.ts tests/imap-marker-color.test.ts \
  tests/imap-neighborhood.test.ts tests/imap-prototype-camera.test.ts \
  tests/imap-prototype-init.test.ts

# Stop the existing static preview before replacing its build.
mise exec -- node node_modules/astro/bin/astro.mjs preview stop
NODE_OPTIONS=--max-old-space-size=256 UV_THREADPOOL_SIZE=1 RAYON_NUM_THREADS=1 \
  mise exec -- node node_modules/astro/bin/astro.mjs build
# Start only if the build succeeds; retain just one background preview.
mise exec -- node node_modules/astro/bin/astro.mjs preview --background --host 0.0.0.0 --port 4321

uv run --with reportlab python scripts/build-billing-brief.py
pdftoppm -png -r 100 output/pdf/ha-long-billing-brief.pdf /tmp/ha-long-billing-brief
```

Visually inspect every PDF page before sharing; the current PDF is stale. Billing conclusion: $0/month additional configured subscription/API fees before tax, not full operating cost; assumptions, scenarios and exclusions are in `docs/billing.md`.

## Art-direction acceptance after public refresh

- Open `/imap-prototype/`, select Sofitel Legend Metropole Hanoi and capture desktop 1440×900 and mobile 390×844/360px-wide views, including the scrolled practical card.
- Review pill warmth, shadow restraint, selected-item hierarchy, legible facts and preserved Vietnamese editorial character.
- Check keyboard focus, hover/press, reduced motion, no horizontal overflow, video/fullscreen and browser-permitted muted autoplay, actual Google Maps handoff, filter/cluster/close/reopen behavior and mobile sheet states.
- Select at least two other destinations: confirm their flat baseline remains unchanged. Check a Metropole-containing cluster retains neutral cluster styling.
- Do not roll out to other destinations or proceed to another sprint before art-direction approval.
