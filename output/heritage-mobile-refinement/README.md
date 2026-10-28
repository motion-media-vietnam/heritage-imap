# Heritage mobile refinement — visual approval handoff

Implemented October 19, 2026. **Stop for visual approval; no release or unrelated change.**

## Changes

- `src/components/HeritageVideo.astro`: mobile featured/supporting covers explicitly use 16:9, min-height:0, height:auto, and centered object-fit:contain. This overrides the conflicting desktop/inherited ratios and old 240px minimum. All three preserve full image composition; neutral side gutters are intentional for non-16:9 source photographs. The existing 44px play buttons and their position/behavior are unchanged. Image positioning uses a CSS variable so inline desktop positioning cannot override mobile centering. Optional actual image dimensions are used when supplied.
- `src/components/HeritageChoice.astro`: a scoped background gradient occupies only existing bottom padding, from the existing warm ivory through soft paper white/barely tinted neutral to #fff at the iMap boundary. No new spacer/overlay or change to section dimensions, desktop columns, typography or cards.
- `src/data/heritage.ts`: only the lotus cover record changes, plus optional cover dimensions/approval-state typing. Video IDs, URLs, titles, descriptions, dates, excerpts and verification metadata are hash-protected and unchanged. Both other cover records are unchanged.
- `public/images/heritage-lotus.webp`: owner-supplied JPEG converted with existing Sharp tooling, one worker, WebP quality 88, 1600×1064, 268,726 bytes. Original: 1821×1211, 648,061 bytes; full composition retained, no generated/substituted imagery. The supplied original is archived in `source/lotus-supplied.jpg` outside public delivery. The optimized file was directly inspected as an image. The previous local tea JPEG remains untouched for rollback but is not referenced by the lotus story.
- `tests/heritage-refinement.test.ts`: four regressions covering unchanged editorial data/playback/other covers, mobile ratios/fit, scoped gradient/desktop geometry and the actual optimized/built image.
- `tests/heritage.test.ts`: the existing live image check now expects WebP only for the new .webp cover; other two covers still require JPEG.
- `docs/billing.md`: measured image-transfer/storage impacts and conditional $0 incremental subscription/API fees, with exclusions and approval status. Existing PDF remains stale; document generation was not authorized under this instance's policy.

No changes to homepage markup, Hero, navigation, shared styles, iMap components/controller/styles, approved prototype or other approved sections. All 11 files in `protected.sha256` matched after implementation. The playback script and non-cover editorial data also matched their pre-change hashes.

## Validation performed

All operations sequential, with a bounded V8 heap and one worker. Stopped the old dev server before production build; restarted exactly one background dev server afterward. No new package or browser installation.

```sh
mise exec -- npm run dev -- stop
NODE_OPTIONS=--max-old-space-size=192 UV_THREADPOOL_SIZE=1 RAYON_NUM_THREADS=1 mise exec -- npm run build
env -u HERITAGE_PREVIEW_URL NODE_OPTIONS=--max-old-space-size=192 UV_THREADPOOL_SIZE=1 RAYON_NUM_THREADS=1 \
  mise exec -- node --experimental-strip-types --test --test-concurrency=1 tests/*.test.ts
NODE_OPTIONS=--max-old-space-size=192 UV_THREADPOOL_SIZE=1 RAYON_NUM_THREADS=1 \
  mise exec -- npm run dev -- --background --host 0.0.0.0
HERITAGE_PREVIEW_URL=http://localhost:4321/ NODE_OPTIONS=--max-old-space-size=192 UV_THREADPOOL_SIZE=1 RAYON_NUM_THREADS=1 \
  mise exec -- node --experimental-strip-types --test --test-concurrency=1 \
  tests/heritage.test.ts tests/heritage-refinement.test.ts tests/imap-integration.test.ts tests/imap-prototype.test.ts
sha256sum -c output/heritage-mobile-refinement/protected.sha256
```

Results:

- Production build: **9 pages passed**, `build.log`.
- All offline tests: **37 passed, 0 failed; 4 live checks skipped**, `tests.log`.
- Live selected tests: **29 passed, 0 failed, 0 skipped**, including all 4 previously deferred checks, `tests-live.log`. Across the two phases, all 41 unique regression cases passed; this is not a claim of one 41-case live run.
- Live homepage rendering completed with HTTP 200 and references `/images/heritage-lotus.webp`; the live regression fetched that image as image/webp. Built output contains the new path and its file bytes exactly match the public asset. Both other cover paths remain present and their image bytes are checksum-protected.
- Static geometry checks at **360/390/430px**: all three frames share the same 16:9 rule, with respective widths/heights **312×175.5 / 342×192.375 / 382×214.875px** using existing 24px mobile gutters. These are CSS-derived values, **not browser measurements**.
- Single-file diagnostics reported no errors in checked TypeScript; one file was unconfirmed and both Astro files lack configured LSP support. Actual Astro production compilation passed.
- A later `astro dev status` call timed out after 10 seconds; a subsequent bounded HTTP fetch succeeded immediately with complete HTML and the new cover reference. This is not treated as a failed application build/test or proof of a healthy status-management command.

## Preview and pending visual review

**http://localhost:4321/** — one background Astro dev preview was restored. Local HTTP availability verified; no external/public preview URL was verified.

No Chromium/Firefox/browser automation is installed. **Browser visual verification and screenshots are pending**, explicitly including:

1. At 360, 390 and 430px, inspect all three equal-width 16:9 frames, uncropped composition, neutral gutters and consistent play controls.
2. Open the lotus video from cover/title/read-more; confirm original video ID and playback/close/focus behavior.
3. At desktop widths, compare the unchanged large-left/two-stacked-right composition and existing frame ratios. Check the new lotus photograph's desktop crop; it retains the existing centered cover behavior on desktop, while mobile shows the full source.
4. Inspect the paper transition on desktop/mobile: no visible edge at iMap, no color band, no added whitespace, no thumbnail overlay from this change.
5. Check overflow, focus/contrast and unchanged Hero/navigation/iMap behavior.

The optimized image was directly visually inspected, but that is not a substitute for rendered browser checks or owner approval. No additional design change, media substitution, deployment or paid commitment is made.
