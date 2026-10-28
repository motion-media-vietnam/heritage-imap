# Sprint 04B.1 — category foundation rollback

The original Sprint 04B checkpoint is preserved in the parent directory.

`rollback.tar` contains `docs/billing.md` immediately before 04B.1; its digest is in `rollback.tar.sha256`. The new source file `src/lib/imap-categories.ts` did not exist before this task. No other existing source files were edited.

For an approved future rollback, verify the archive digest and extract to a separate directory for comparison first. Restoring the archived billing file and removing the new category module would undo this phase only if no later edits depend on them. Do not overwrite later work or reset the dirty worktree.

Implemented: four typed category definitions and an `ImapDestinationRecord` type reusing `DestinationRecord`, replacing only its category type. No destination data is migrated; all six records and coordinates remain untouched. The module is intentionally not imported by any runtime page/controller. Existing SVG identifiers are reused; no icons are rendered by this phase.

Proposed 04B.2 connection (not implemented): adapt the six verified sightseeing records to `stamp-worthy-spot` without changing IDs/coordinates, resolve marker paths via each registry entry's `icon`, and derive filter labels/values from the same registry. Food/drink, stay and experience remain empty until verified records are approved. Keep legacy production categories separate. Any behavior/UI wiring requires approval.

Validation commands were not run: no build, type-check, tests, worker launch or server start. The harness automatically reported the new TypeScript file clean; this is not a full project check. Billing PDF generation was deferred under instance policy. On a capable machine, run `npm run check`, `npm run build` and `npm test` before accepting later integration.

Stop after 04B.1; await approval for 04B.2.
