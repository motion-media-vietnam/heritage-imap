# Sprint 02B clarification — original 16:9 inflight video

October 19, 2026. Applied only to `/imap-prototype/`; still awaiting visual review.

## Presentation contract

- Destination heading is above the media frame on desktop and mobile.
- One full-width 16:9 frame is retained across breakpoints. Native video uses `object-fit: contain`, not cover; original files are not cropped, re-encoded, stretched or converted to portrait.
- When a mobile destination opens, the script measures title/frame plus sheet controls. It uses the existing half state if that fits, otherwise the existing expanded state. Short viewports can scroll the unchanged landscape frame; it is not distorted to force a fit. Users retain all three sheet controls/drag states and practical information below the player.
- A conditional native file player supports user-controlled inline playback and native fullscreen where the browser/codec supports it. No autoplay attribute or programmatic play is used; metadata/media preload is disabled. Escape is left to native fullscreen rather than closing/destroying the story.
- No forced orientation lock is attempted. A browser that cannot rotate to landscape may letterbox the original frame. Actual provider/codec/fullscreen support requires real source and device testing.

## Source availability — important limitation

`dedicatedVideos` is still empty. All six live destinations therefore show the existing honest placeholders, not playable video. The conditional player accepts original approved directly playable file URLs only; no YouTube/provider URL, production video asset or destination association was invented. External provider-specific embed adapters are not added without verified sources.

The 1920×1080 element dimensions express the native HD landscape presentation ratio; they do not generate or upscale an asset. No original files were modified and no vertical derivatives created. Fullscreen is prepared through browser-native controls, not claimed as tested with nonexistent sources.

## Changed files

- `src/pages/imap-prototype.astro`: title/media ordering, optional native file player, truthful placeholder retained.
- `src/styles/imap-prototype.css`: shared 16:9 frame, contain behavior and fullscreen styling.
- `src/scripts/imap-prototype.ts`: content-aware selection of an existing mobile sheet state; native fullscreen Escape guard. No tile-layer/camera change.
- `src/lib/imap-prototype.ts`: pure sheet-state chooser and explicit original-file source contract.
- `tests/imap-prototype.test.ts`: framing, title order, controls/no-autoplay/fullscreen and sheet-choice regression coverage.
- `docs/billing.md`: no current recurring vendor/video-delivery fee; future HD delivery remains unquoted until sources/host/usage are known.

Homepage, approved Heritage, destination records and production map match the existing protected checksums.

## Validation

Used the safe stop/build/start sequence to avoid serving stale optimized Leaflet dependencies:

```sh
mise exec -- npm run dev -- stop
mise exec -- npm run build
mise exec -- npm run dev -- --background --host 0.0.0.0
HERITAGE_PREVIEW_URL=http://localhost:4321/ mise exec -- npm run test
sha256sum -c output/sprint-02b/ux-correction/protected-files.sha256
```

Results: **8 production pages built; 25 tests passed, none skipped; protected checksums matched.** Live HTML and the actual served Leaflet module are checked without executing browser code or requesting OSM tiles. Native markup remains absent from rendered templates while sources are empty.

No browser visual, touch, playback, fullscreen or landscape-orientation test was performed. Preview: http://localhost:4321/imap-prototype/. Review title/frame visibility on marker selection, collapsed/half/expanded controls, scrolling, map navigation and attribution. Once original files are supplied, verify no cropping/no autoplay and native fullscreen/exit on Windows Chrome and intended mobile browsers. No cross-device success is claimed.

Recovery snapshot before this clarification: `before.tar.gz`. Stop for visual review; no homepage integration.
