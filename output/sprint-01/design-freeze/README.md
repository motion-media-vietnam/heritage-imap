# Sprint 01 — approved Heritage design freeze

Recorded October 17, 2026 following the owner's explicit approval of the current Heritage Guide's Choice desktop design.

## Contract

Freeze the current section's layout, typography, spacing, colors, image ratios, hierarchy, photography, verified YouTube metadata and video interactions. Do not alter it during Sprint 02 iMap work unless explicitly authorized, or necessary to repair a demonstrated integration issue. A necessary integration repair must document the failing reproduction, minimal change and regression results; it does not authorize a visual redesign.

Approved state includes the current asymmetric 1.85:1 grid, #F8F7F3 section surface, 3:2 featured cover, 11:5 desktop supporting covers, existing type scales/measures, compact supporting spacing/excerpts and 44px play controls. Full source is authoritative for exact values and responsive rules. Current supplied photographs remain approved for this design checkpoint; their internal original-still approval flags are retained unchanged.

Canonical records and original video associations:

- `2CxNZtrFedo` — https://www.youtube.com/watch?v=2CxNZtrFedo
- `Sige0y8XxeU` — https://www.youtube.com/watch?v=Sige0y8XxeU
- `-jVXCHcCoiw` — https://www.youtube.com/watch?v=-jVXCHcCoiw

## Recoverable checkpoint

- `approved-state.tar.gz`: current `src/`, all existing regression tests, the three published cover JPEGs, package/tooling configuration and canonical billing document. Map source is included as integration context, not as an approved Sprint 02 design.
- `approved-files.sha256`: checksums for the frozen section, its shared rendering dependencies, cover images and all existing regression tests.
- `base-revision.txt`: underlying Git revision, `f28849f160a8cacfb0efd273ce3d797dbf17dcd6`.
- `tracked-worktree.patch`: tracked changes relative to that revision; the archive additionally preserves relevant untracked source files and assets.

This checkout was already dirty. No Git commit, reset, source edit or test modification was made to record the freeze. Extract into a separate directory for comparison; never blindly overwrite subsequent iMap work. Shared files such as global styles, the page and layout are dependencies to review, not a prohibition on isolated iMap changes that leave Heritage rendering intact. Protect shared tokens/cascade and do not substitute the editorial component for the separate map-story player.

## Regression baseline

Keep `tests/heritage.test.ts`, `tests/explore.test.ts` and `tests/districts.test.ts` intact. The latest preceding implementation validation passed a 7-page build and all 11 tests (none skipped), including built/live homepage completion, the three video/link/cover associations and six inert map-story players. No tests or build were rerun for this inspection-only task.

There is no browser screenshot baseline from this environment. The freeze records owner approval and exact source/assets, not a new browser visual-QA claim. Future visual regression should compare to the owner's approved desktop rendering.

## Billing

This checkpoint and read-only inspection introduce no feature, vendor, API integration or published runtime asset: incremental configured recurring vendor fees are USD $0/month before tax, assuming unchanged hosting, traffic and delivery. Local checkpoint storage is not deployed. Existing operating estimates/exclusions remain applicable; no new supplier rate or full-business-cost claim is made. No new paid decision is required. Source and canonical billing files remain untouched during inspection; no PDF was regenerated.
