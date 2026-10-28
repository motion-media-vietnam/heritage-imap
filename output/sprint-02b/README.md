# Sprint 02B — iMap UX/UI prototype

Status: ready for visual approval, not integrated or deployed.
Preview route: `/imap-prototype/` (static output: `dist/imap-prototype/index.html`).

## Files introduced by this sprint

- `src/pages/imap-prototype.astro` — isolated document/route, directory, story templates, sourced practical information, external directions and nearby controls.
- `src/styles/imap-prototype.css` — independent visual system; desktop three-pane explorer and mobile map-first bottom sheet.
- `src/scripts/imap-prototype.ts` — Leaflet initialization with the approved explicit OSM referrer policy, synchronized selection/filtering, story teardown, sheet dragging and keyboard resizing, camera preservation.
- `src/lib/imap-prototype.ts` — nearby ranking, selection/drag helpers, explicit missing-video registry, sourced visitor facts.
- `tests/imap-prototype.test.ts` — five additional regression tests.
- `output/sprint-02b/README.md` — this handoff.
- `docs/billing.md` — prototype cost assessment and assumptions (modified).

The existing homepage, production iMap, approved Heritage components/data/styles and tile implementation were not edited by this sprint. Pre-existing uncommitted work remains untouched. The prototype imports existing `places`, `PlaceArt`, distance/search utilities and Leaflet, without adding dependencies.

## Interaction model

Desktop: filters above explorer; compact left directory; center map; right story panel on selection. Numbered markers correspond to directory positions. Selection is highlighted in both surfaces. Opening/closing details does not fit or pan the camera; ResizeObserver preserves map center/zoom across desktop column resizing.

Mobile (≤900px): map first, directory below, non-modal fixed bottom sheet. Drag the handle, use the expand/collapse button, close with X or Escape, or drag below 190px to dismiss. Sheet is clamped between 160px and 85% viewport height. Close preserves selection/map position; the on-map reopen button restores the selected story. It does not trap focus or block map interaction. Story heading receives focus on selection; closing returns focus to the opening control where possible.

Filtering applies to both directory and markers. If a selected place becomes excluded, selection/story are cleared explicitly; nearby entries excluded by filters are disabled. Selecting a new destination replaces story contents, stopping/removing any prior player. There are currently no active players or automatic playback. No destination-detail navigation is needed; only explicit directions/source links open external sites.

## Validation executed 2026-10-17

Commands run serially through the installed tool-manager wrapper (no config/tool installation):

- `mise exec -- npm run build` — PASS, 8 static routes, including `/imap-prototype/`.
- `mise exec -- npm run check` — PASS, 25 files, zero errors/warnings/hints.
- `mise exec -- npm run test` — PASS: 17 total; 16 passed, zero failed, 1 skipped. Includes five new prototype tests and existing Heritage/OSM regressions. Rerun after the final build so the built-homepage regression uses current output.

The skipped existing test requires a running homepage; no dev server or browser automation was started. Tests cover helper behavior, nearby ordering, sheet clamps, absent unverified videos, source metadata, route isolation and the OSM fix. They do not establish actual browser drag, focus, touch, live-tile, external-routing or playback behavior.

## Content and cost limitations

- All six 90-second video areas are explicitly illustrated placeholders. No dedicated, rights-cleared destination videos are available. No city overview is substituted. The empty video registry is an approval/content backlog, not a playback integration; adding approved media requires implementation and a cost/privacy review.
- Existing coordinates are approximate; no new coordinates, video IDs, ticket prices or entrances were invented. Nearby distances are straight-line, not walking routes.
- Văn Miếu daytime hours verified at `https://vanmieu.gov.vn/en` on 2026-10-17: 08:00–17:00 daily. Evening visits differ. Other practical information is marked missing/unverified. Safety tips/story text are inherited editorial content, not certified operational facts.
- Directions open OpenStreetMap with the approximate destination and no stored user location. No routing API or location permission is added.
- Public OSM offers no uptime guarantee; the explicit tile `referrerPolicy: 'strict-origin-when-cross-origin'` is retained. On tile failure, pins/directory remain available. No offline map or production illustrated fallback is added to this isolated route.
- No extra configured recurring service fee. Forecasts/hosting exclusions/OSM interruption risks are documented in `docs/billing.md`.
- Billing PDF regeneration/visual inspection remains deferred under the instance policy; build/test authorization did not authorize document generation.

## Visual-approval checklist (not yet browser-verified)

1. Review at 1440px, 1024px, 900px, 390px and landscape-phone widths.
2. Select every marker/directory entry, then nearby destinations; confirm synchronized highlighting and details without navigation.
3. Pan/zoom map, open/close/reopen story; compare center/zoom and selection.
4. Drag sheet up/down with touch and pointer; expand/collapse by keyboard; verify scrollable story and visible map attribution.
5. Test Escape/focus return and screen-reader announcements; confirm zoom controls and directory remain reachable.
6. Test accented/plain search, combined categories, empty results, selection filtered out, and filter reset.
7. Block OSM tiles/Leaflet requests; verify error messaging and directory stories still work.
8. Confirm every missing video is labeled, no autoplay/network video request occurs, and source/directions links are explicit external actions.

Stop here pending visual approval. Do not move this into the homepage or commit to a paid provider as part of this sprint.
