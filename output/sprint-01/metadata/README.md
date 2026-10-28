# Heritage metadata verification — 17 October 2026

No YouTube Data API credentials were found in the environment (credential names only inspected) or root `.env*` files. No packages, videos, frames or thumbnails were downloaded. Only official YouTube metadata/page responses were retrieved. No live metadata-fetch integration has been added to the site.

## Verified fields

For all three IDs, official YouTube oEmbed verified the Vietnamese title, canonical watch URL, channel name and thumbnail URL/dimensions (480 × 360). The official public watch-page `ytInitialData.videoSecondaryInfoRenderer.attributedDescription.content` supplied the full Vietnamese description with `hl=vi`. `videoPrimaryInfoRenderer.dateText` supplied the publication date, cross-checked with `hl=en`.

| ID | Exact Vietnamese title | Verified publication date |
| --- | --- | --- |
| `2CxNZtrFedo` | Những Trải Nghiệm Mùa Thu Hà Nội Không Thể Bỏ Lỡ \| Heritage | 2026-09-11 |
| `Sige0y8XxeU` | Thu Rồi, Đến Hà Nội Ăn Cốm Thôi! \| Heritage | 2026-08-25 |
| `-jVXCHcCoiw` | Hương Sen Hà Nội - Thử Thách Ăn Hết Một Cây Sen! \| Heritage Guide | 2026-06-14 |

Each adjacent JSON file records the verified text, source URLs and retrieval timestamp. Its `publishedAt` and `uploadedAt` remain null: those player/API fields were unavailable, while the separate watch-page `publicationDateText`/`vietnameseDateText` are verified. This is date-only verification, not a verified timestamp or upload time.

## Unavailable / not inferred

- Exact publication timestamp, timezone and original upload timestamp.
- Data API v3 snippet response (no credentials).
- Original high-resolution editorial stills or approval of the supplied temporary photographs.
- Playback availability: the fetched player response reported LOGIN_REQUIRED in this environment; this is not a browser playback test or a claim that visitors cannot play the video.

The verified YouTube preview is only 480 × 360; it is stored as metadata, not substituted for the existing supplied high-resolution cover. Cover approval status is retained internally in `src/data/heritage.ts` and not displayed publicly.

## Canonical application data

`src/data/heritage.ts` holds one structured record per video: exact title, full description, concise description-derived excerpt, date, canonical URL, thumbnail, current local cover/crop/approval status and provenance. Components receive the same record, with no separate image-by-ID mapping or sample-month labels. Main links and modal IDs all derive from that record.

The original sample titles, dates and unrelated read-more links were corrected, not treated as verified historical publication data. The approved layout, font families, headline scales and image ratios remain unchanged. Polish is limited to 44px play controls at the same 20px bottom/left position, removal of overlay text and approval labels, 12px consistent date text, headline measures and supporting-story spacing. Description-derived excerpts now appear on all three cards.

## Validation status

Source inspection only. No application test/build or browser QA was executed, consistent with this instance's resource policy. No visual success, screenshot, playback or keyboard-testing claim is made.

On a browser-capable machine, run `npm run dev -- --background` and inspect the homepage at 1440px and 390px: titles/diacritics, date labels, the three exact video associations, cover crops, uniform play controls, no public approval labels, no overflow, and modal activation/Escape/focus-return. Optional static checking: `npm run check`. Follow the target environment's tool-manager wrapper where applicable.

Earlier `output/sprint-01/QA.md` is a historical sprint checkpoint report. Its missing-metadata/sample-title notes are superseded by this verification, not its still-pending browser acceptance or original-still approval.
