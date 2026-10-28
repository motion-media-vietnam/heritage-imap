# Sprint 02B — owner-approved iMap UX / visual freeze

Recorded October 19, 2026. **The current desktop and mobile prototype designs are approved and locked.** No prototype, homepage, Heritage, map configuration or destination source was modified while recording this checkpoint.

Canonical approved-state documentation and proposed integration plan:

`docs/imap-sprint-02b-freeze.md`

## Checkpoint contents

- `approved-state.tar.gz`: full current `src/`, `tests/`, `public/`, `docs/`, locked package/configuration files, project instructions/README and the checkpoint records listed below.
- `approved-state.tar.gz.sha256`: archive checksum, stored alongside the archive.
- `approved-files.sha256`: source/assets/tests/document/configuration hashes, usable after extracting the archive.
- `approved-prototype.sha256`: prototype route, styles, script, helper and regression test hashes recorded before this documentation-only task.
- `base-revision.txt`: underlying Git revision `f28849f160a8cacfb0efd273ce3d797dbf17dcd6`.
- `tracked-worktree.patch`: tracked diff against that revision. The archive additionally includes the approved untracked implementation/assets/tests; the commit alone is not the checkpoint.

Dependencies, caches, generated builds and other output archives are not bundled. No original destination-video files exist in the configured source list. Remote fonts and OSM tiles are not mirrored; this is a source/asset recovery checkpoint, not a frozen external-service or browser image.

## Safe recovery / comparison

Extract into a new directory, never directly over the working tree:

```sh
mkdir -p /tmp/mm-guide-02b-restore
tar -xzf output/sprint-02b/design-freeze/approved-state.tar.gz -C /tmp/mm-guide-02b-restore
cd /tmp/mm-guide-02b-restore
sha256sum -c output/sprint-02b/design-freeze/approved-files.sha256
```

Review and restore only authorized files from that separate copy. Do not reset to the base commit or overwrite unrelated later work. Existing Sprint 01 Heritage and Sprint 02A tile checkpoints remain independent safeguards.

## Approval and acceptance boundary

Approved: desktop 22/45/33 selected layout (22/78 closed), mobile map-first architecture with 960px breakpoint, one synchronized selected destination, map-bounded three-state sheet, camera-preserving close/reopen/resize, full 16:9 landscape presentation, editorial typography/tokens and presentation-mode treatment.

**Pending acceptance, not completed:** real browser touch/drag/safe-area/gesture testing; actual original-video playback/codec/audio/autoplay/fullscreen/orientation testing; production-domain tile/referrer behavior and homepage integration. Conditional native-player markup and automated source tests are not evidence of real playback. The original destination-video source list remains empty and honest placeholders remain visible.

Latest preceding implementation validation: production build passed 8 pages; all 27 tests passed, none skipped. No tests/build/browser run was performed for this documentation-only freeze. Checkpoint hashes were verified, and existing homepage/Heritage/protected-file checksums matched. Owner design approval is recorded separately from those automated checks.

## Integration boundary

Integration is proposed only. The short plan and dependencies/risks/regression gates are in the canonical document. Scope global prototype CSS into an explorer wrapper; reconcile legacy search/category/distance/location/card state; preserve anchors, one Leaflet instance, error handling, actual header-relative viewport, legal attribution and the approved visual contract. Do not copy the standalone page header/root resets into the homepage or mix the map player with Heritage's video contract. No integration has been performed and no automatic permission to integrate is implied.

Billing: USD $0/month incremental configured vendor fees for this local freeze; future integration/media/hosting assumptions remain conditional and documented in `docs/billing.md`. No new service or paid commitment; existing PDF remains stale.
