# Sprint 04B.2 — prototype category integration

## Scope and changed files

- `src/lib/imap-categories.ts`: retain the approved four IDs/labels; Experience now uses the requested `ticket` SVG identifier instead of `theater`.
- `src/lib/imap-neighborhood.ts`: alias the shared registry (no duplicate taxonomy), resolve approved category IDs for all consumers, adapt existing legacy sightseeing categories without editing records, and supply four SVG paths plus a neutral grid for clusters. Existing search/category/district/radius conjunction remains intact.
- `src/pages/imap-prototype.astro`: shared category options, directory category labels/icons, accessible filter name and matching story category label. No video, story layout or bottom-sheet structure changes.
- `src/scripts/imap-prototype.ts`: neutral icon for every cluster, including selected/mixed clusters. Marker grouping, positions, sizes, selection/click/keyboard handlers and camera functions are unchanged.
- `src/styles/imap-prototype.css`: category-ID color selectors, restrained existing palette, neutral cluster fill and dark selected ring. All markers retain 48px circular targets; selected singles retain red fill; selected clusters retain neutral fill with the selected ring/name.
- `tests/imap-neighborhood.test.ts`: update legacy taxonomy assertions; add shared-registry identity, exact labels/icon IDs, neutral-cluster source assertions and combined category/search/radius cases using only existing destinations. Not executed.
- `docs/billing.md`: conditional USD $0/month incremental configured vendor subtotal, unchanged service demand, unmeasured inline-byte impact and exclusions. PDF remains stale; no generator run.

The six unchanged records all resolve to `stamp-worthy-spot`. Food/drink, stay and experience remain honest empty options with counts. No new destinations, assets, dependencies, servers or paid services. Homepage, production iMap and Heritage Guide's Choice were not edited.

## Checkpoint and source-only verification

`rollback.tar` contains all seven pre-change files; `rollback.tar.sha256` verified successfully. Existing 04B/04B.1 checkpoints remain untouched. `protected.sha256` verified the destination data, approved camera helpers, prototype story helpers, mobile sheet helpers, homepage, production iMap page and HeritageChoice component unchanged.

For an approved rollback, verify the archive checksum and extract into a separate directory first. Compare against later work before restoring; do not reset the existing dirty/untracked worktree. The archive does not include this new handoff directory.

## Unverified / approval required

No builds, explicit type-check commands, tests, parallel workers or server starts were run. Harness automatic per-file diagnostics occurred; they are not full-project verification. Source review and checkpoint/protected-file checksum checks only; no browser execution or screenshots.

The existing static preview still serves the previous build: these source changes will not appear until an authorized rebuild on a capable runtime. Do not mistake the old preview for 04B.2 acceptance.

On a capable machine, run sequentially (not executed here):

```sh
npm run check
npm run build
npm test
```

Use the repository tool-manager wrapper if required by that environment. Then refresh the existing preview/review environment without duplicating servers and visually inspect desktop/mobile:

1. Shared four category options/labels/counts; search + category + 500m/1km/2km/All composition. The existing records yield 1/2/5/6 sightseeing results before other filters; the other categories remain empty.
2. Single marker landmark icon, 48px consistent target, keyboard name/focus, red selection with a dark ring and persistent selected name.
3. Neutral grid/count for clusters, including selected members; activation still opens the scoped list without camera fitting. Mixed-category runtime behavior cannot be demonstrated from this six-record single-category catalog; do not invent production data for screenshots.
4. Label wrapping and map framing at narrow widths, story opening/closing, original video-first layout, sheet gestures and radius camera cancellation/settling. No browser-level accessibility, visual contrast, gesture or camera regression acceptance is claimed.
5. Other category SVGs are implemented but have no real destinations to render on the map; review them separately without publishing invented records.

Stop after implementation; await visual approval before more work.
