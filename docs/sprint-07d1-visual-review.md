# Sprint 07D.1 — gallery visual review

## Delivered in source

- Full-width, rounded 4:3 mobile browsing frame; `object-fit: cover`, adjustable gallery-local focal position (default 50% 40%). No padded portrait/white 16:9 box.
- Desktop 16:9 image area with a large featured image and up to two supporting tiles, separated by 6px. One/two images adapt without empty tiles.
- Slim toolbar directly below the image: previous, live counter, next and an accessible expand icon; 44px minimum touch targets. The featured image is also still clickable.
- Existing original-image dialog uses `contain`, retaining the complete image and original proportions. Existing swipe/keyboard/delegated controller is unchanged.
- No changes to gallery records/assets, video branch, shared layout, mobile story sheet, map, content or global design system.

The workspace already has six approved pilot image records. They were left unchanged. Existing unrelated worktree modifications were not reverted.

## QA status

**Not executed:** tests, type checks/build, preview refresh, real browser/device interaction and PDF generation/inspection. Instance policy prohibits executing validation code and document generators. Source review is not visual acceptance. New source-contract tests are unexecuted; historical 07D passing results do not validate this revision.

On a capable machine:

```sh
node --experimental-strip-types --test tests/imap-gallery-visual-07d1.test.ts tests/imap-media-07d.test.ts tests/imap-gallery-interactions-07d.test.ts
npm run check
npm run build
uv run --with reportlab python scripts/build-billing-brief.py
```

Refresh the existing preview at `http://localhost:4321/` (not refreshed here). Do not start a second server. If the existing preview is stopped, use the project-approved `astro dev --background` on that machine.

## Visual acceptance checklist — all pending

1. At 320/375/430px mobile widths, select Phố sách Đinh Lễ: image reaches both edges of the available story content, rounded corners remain, no portrait letterboxing/padding.
2. Navigate all six images: portrait, square and landscape crops look intentional and undistorted; main subjects remain useful in the 4:3 crop. Review the default upper-biased focal position visually rather than assuming every crop is approved.
3. Toolbar sits immediately below the photo, balanced and compact; icon has an accessible label, and keyboard focus is visible.
4. Swipe horizontally, tap both arrows and use keyboard arrows; counter stays synchronized, wraps correctly, and swipe does not accidentally open enlargement. Vertical scrolling/pinch behavior remains native.
5. Tap the photo and expand icon: complete original photograph is visible without cropping/distortion. Verify navigation, X, Escape, focus trapping and return focus in the native dialog.
6. At desktop widths above 960px, inspect featured/support hierarchy and small gaps across all six images. Check breakpoint resizing. Use isolated synthetic one/two-image fixtures for graceful adaptation; do not edit production gallery data.
7. Switch video → gallery → video → map: unchanged video rendering/playback, desktop immersive arrangement, mobile full-height story sheet, content/scrolling and map/filter/camera restoration.
8. Inspect the regenerated billing PDF before sharing; its current checked-in copy is stale.

**STOP for client visual review.** No deployment or visual acceptance is claimed.
