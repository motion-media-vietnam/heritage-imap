# Sprint 02B — isolated prototype UX correction

October 19, 2026. **Not visually approved. Stop for another owner review.**

Preview: http://localhost:4321/imap-prototype/

## Scope

Changed only prototype route assets/helpers/tests plus the required business cost record:

- `src/pages/imap-prototype.astro`
- `src/styles/imap-prototype.css`
- `src/scripts/imap-prototype.ts`
- `src/lib/imap-prototype.ts`
- `tests/imap-prototype.test.ts`
- `docs/billing.md`

No homepage integration. The homepage, Heritage section and shared styles, production map script/components, original destination/district data and existing production regression files match `protected-files.sha256`. The prototype's existing OSM tile URL/options/attribution block was separately compared with the starting archive and is byte-for-byte unchanged. No proxy, cache bypass, retries, API integration or destination-video URL was introduced.

## Corrected UX

- Desktop: explicit grid areas at 22% directory / 45% map / 33% story when selected; map expands to 78% when the story is closed. Directory and marker selection share one slug. Close retains the selected marker and camera; reopen is available. Existing ResizeObserver preserves center/zoom when column geometry changes.
- Mobile/tablet (up to 960px): search and two compact filters above the primary map viewport. Directory and story live inside one non-modal sheet over the map, not below it in page flow. Sheet has collapsed, half and expanded states with explicit buttons and drag-to-nearest-state behavior. Expansion is bounded by the map viewport, not the full page. Collapsed content is hidden/inert where appropriate; Escape/close and skip navigation have keyboard paths.
- Districts: a compact control lists only four populated historical areas, not thirty empty/occupied district entries. Counts respond to search/category. Zero-result options are hidden unless explicitly selected, so an empty filter remains understandable/resettable. The existing administrative-history caveat is retained.
- Media: six per-destination placeholders explicitly state that no dedicated verified video exists. No overview player, playable-looking icon, invented duration or embedded video appears. Original destination facts, practical notes, approximate coordinate warnings and external directions remain.
- Visual treatment: prototype-only Lora / Be Vietnam Pro typography, restrained ink/moss/vermilion palette, warm-white directory/sheet, reduced borders/effects. No shared/global palette edits.
- Attribution is offset above the mobile sheet. Expanded state hides nonessential map overlays and positions attribution away from the zoom controls. Actual overlap/crop needs browser verification.

## Validation results

```sh
mise exec -- npm run build
HERITAGE_PREVIEW_URL=http://localhost:4321/ mise exec -- npm run test
sha256sum -c output/sprint-02b/ux-correction/protected-files.sha256
```

Final results: **8 production pages built; 22 tests passed, zero failures/skips; all protected checksums matched.** Added tests cover populated districts/combined filters, three distinct map-bounded sheet states and snapping, route/layout contracts, all six built placeholder records/directions, live prototype rendering and absence of homepage integration. Existing selection/nearby/data/Heritage/OSM-policy tests remain and pass. The tile configuration was checked against `before.tar.gz` without contacting OSM.

Initial live tests failed with ECONNREFUSED on localhost:4321. Astro had a stale recorded background PID. `mise exec -- npm run dev -- stop` followed by `mise exec -- npm run dev -- --background --host 0.0.0.0` restored the preview; the final suite passed with no skips. No application source workaround was added for that environment problem.

## Browser QA limitations / review checklist

No browser binary or automation package/tool is available in this session. No screenshots, touch tests, actual geographic camera measurements, font rendering or visual approval are claimed. Source/HTML assertions are not visual QA.

Please review at 1440px desktop and 390px mobile (also intermediate widths and landscape):

1. Desktop initial map expansion, selected 22/45/33 composition, directory scrolling and independently scrolling story panel.
2. Mobile search/filter sizing and map as the primary viewport; no directory below the map.
3. Sheet collapsed/half/expanded via buttons and touch drag; no clipping, focusable hidden content, excessive page scroll or accidental map movement while dragging the handle.
4. Attribution remains readable above the sheet and away from zoom controls at every state; no control/status collisions.
5. Select by marker/directory/nearby; close/reopen; change filters; verify matching pressed marker/list state and unchanged center/zoom except explicit “Toàn cảnh”.
6. Empty search/filter feedback, keyboard selection/Escape/skip, focus restoration, reduced motion and mobile safe areas.
7. Vietnamese fonts/diacritics, colors, directions links and truthful destination-video placeholders.

The user-verified desktop OSM fix from Sprint 02A is preserved, not re-certified across this prototype's devices/contexts. No extra tile requests were made by automated tests; browser review should use normal cached interactive viewing, not bulk/preload or cache-bypassing tile requests.

## Recoverable artifacts and costs

- `before.tar.gz`: the prototype's starting route/style/script/helper/test files.
- `protected-files.sha256`: approved homepage/Heritage/production-map/data/test dependencies, verified unchanged.
- `corrected-prototype.tar.gz` and its checksum: corrected prototype files, regression tests, billing note and this report for review/rollback comparison.

The project was already dirty; no reset/commit was made. Extract archives into a separate directory for comparison, not over unrelated work.

Incremental configured vendor fees remain USD $0/month before tax under existing hosting/traffic assumptions. No new runtime service or video delivery is added. Font transfer and viewport-dependent map demand remain unmeasured; existing forecasts are not guaranteed bills/quotas. Labor, hosting/domains, taxes, currency conversion and future media production are excluded/unquoted. See canonical `docs/billing.md`; PDF regeneration remains deferred under instance policy and its stale notice still applies.
