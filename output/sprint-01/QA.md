# Sprint 01 — implementation and acceptance status

## Status

Source implementation delivered; **browser acceptance incomplete, not release-ready**.
No browser automation package, browser binary, or interactive browser tool is available in this session. No screenshots were captured and no rendered visual success is claimed. No packages were installed. Application tests/builds and billing PDF generation were not executed under the instance resource policy. The owner's explicit instruction permitted starting the preview, not unrelated validation or dependency installation.

## Preview

- Running local URL: http://localhost:4321/ (Astro background mode; HTTP 200 observed).
- Configured external preview origin: https://preview.code.arvigeus.one/ — direct TLS connection failed from this session. Its routing/authentication and public availability are not verified. Port 8080 responds with a login redirect, not the Astro page.
- Status: `mise exec -- npm run dev -- status`
- Logs: `mise exec -- npm run dev -- logs`
- Stop: `mise exec -- npm run dev -- stop`
- Start if needed: `mise exec -- npm run dev -- --background --host 0.0.0.0`

## Recoverable checkpoint

Created before this continuation's edits:

- `output/sprint-01/resume-checkpoint.tar.gz`: starting `src/` and `docs/billing.md`, including all pre-existing uncommitted map work and partial Sprint 01 implementation.
- `output/sprint-01/resume-checkpoint.patch`: starting tracked diff against Git HEAD.

The checkout was already dirty. Do not reset to HEAD or overwrite unrelated map changes. Extract the archive into a separate directory and compare/copy only the sprint files if rolling back. Older `pre-sprint-source.tar.gz` and `pre-sprint.patch` artifacts were already present; they were not created by this continuation.

## Source changes

- `src/styles/global.css`: scoped palette, font, spacing, image-ratio and responsive typography tokens. Unrelated map/destination/footer rules retained.
- `src/styles/editorial.css`: Lora/Be Vietnam Pro navigation and hero; restrained brand block; transparent desktop header/light scrolled header, light mobile navigation; original incense photo with gentle gamma shadow-detail recovery and localized text gradient; two-line requested headline; independent mobile photo/text panels; reduced-motion support.
- `src/pages/index.astro`: requested hero copy and original photo retained; inline static tone-map definition. No discovery/map/results changes made by this continuation.
- `src/layouts/Layout.astro`: font loading includes real Lora italic, existing navigation interactions retained. No footer redesign.
- `src/components/HeritageChoice.astro`: asymmetric feature/supporting layout, preserved editorial data/read-more links; cover and headline activate associated video; scoped typography and focus styling.
- `src/components/HeritageVideo.astro`: explicitly labeled non-black temporary covers, optional rights-cleared image support and image-error fallback, lazy user-activated privacy-enhanced video dialogs, native Escape/focus containment, focus return to the actual triggering link, player removal on close and original YouTube fallback. No initial editorial iframe or autoplay.
- `docs/billing.md`: Sprint 01 incremental cost/usage/alternatives/limits record, with unresolved asset and QA status. The old PDF remains stale and should not be shared as this revision.

Some of this source existed as partial implementation at the checkpoint; the archive records the distinction. No editorial data, video IDs, publication labels, map logic, destination grid or footer content was changed during this continuation.

## Missing photography and content-association issues

All three require approved, text-free, high-resolution stills tied to the exact video. Suggested target: at least 1600 px wide, with crop-safe subject placement and documented rights. Do not simply substitute the downloaded YouTube collages.

| Existing issue/title (unchanged) | Original video ID (unchanged) | Inspection finding |
| --- | --- | --- |
| October 2026: Hà Nội — nơi ký ức gặp nhịp sống hôm nay | `2CxNZtrFedo` | Thumbnail says Hanoi autumn experiences, Hà Pu; existing summary refers to Nga Phạm. Confirm association. |
| September 2026: Huế — những câu chuyện bên dòng Hương | `Sige0y8XxeU` | Thumbnail says Hanoi/cốm/Hà Pu, not Huế. Confirm association before release. |
| August 2026: Văn Miếu — khám phá di sản khi đêm xuống | `-jVXCHcCoiw` | Thumbnail says Hanoi lotus food/Cee Jay, not Văn Miếu at night. Confirm association before release. |

Dates remain explicit sample issue dates, not newly claimed video publication dates. No facts were silently rewritten to match thumbnails. Source image inspection does not verify playback or rights.

## Mandatory browser acceptance — still to perform

On a browser-capable machine:

1. Use the checkpoint in a separate working copy for before screenshots; do not roll back this running working tree. Capture before/after at **1440 × 1000** and **390 × 844**, including hero, Heritage section and mobile menu. Keep identical viewport, zoom and font-ready timing. Include a modal-open screenshot. Screenshots must be actual browser renders, not source/mockup images.
2. Wait for fonts and images. Check Vietnamese marks in “Hà Nội”, “của riêng bạn.”, eyebrow, story titles; no clipping or unexpected font shift. Evaluate photo shadow recovery and contrast visually; adjust the gamma exponent or localized scrim if necessary, without darkening the artisan.
3. At desktop and mobile, verify hat, hands and incense remain visible; text does not cover the subject. Check 320 px and intermediate widths as extra overflow safeguards.
4. Verify transparent desktop header at top, light header after the hero, restored state when scrolling up, readable mobile dropdown, menu link close, outside-click close and Escape/focus return.
5. Activate every cover and every headline by mouse/keyboard. Confirm exact IDs above; no editorial iframe before activation; playback availability; close button/Escape/backdrop; focus containment and return to the actual cover/headline; player teardown and restored page scrolling. Test open-in-new-tab, disabled JavaScript and YouTube failure fallback.
6. Test future cover loading/error fallback when approved assets are supplied. Current cards intentionally have no image requests.
7. Verify `document.documentElement.scrollWidth <= window.innerWidth`, no layout shifts after font loading, no console errors, reduced-motion behavior, and preserved search/filter/map/destination navigation. No unapproved map redesign or claimed map fix.
8. Correct weaknesses, recapture screenshots and attach paths before marking this sprint complete.

Optional static/project checks on a capable machine (not run here):

```sh
npm run check
npm run build
npm run test
uv run --with reportlab python scripts/build-billing-brief.py
pdftoppm -scale-to 1400 -png output/pdf/ha-long-billing-brief.pdf /tmp/ha-noi-billing
```

Visually inspect every generated PDF page; pricing/assumption/link/arithmetic review is required for the billing document, not an unrelated application test suite. Follow repository tool-manager wrappers if configured in the target environment. Refresh estimates after final images/traffic/hosting are selected.
