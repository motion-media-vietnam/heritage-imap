# Sprint 08A.1 — vertical Heritage tab / in-page drawer

## Status and scope

Source refined; **not browser-verified or release-accepted**. The working tree already contained an uncommitted vertical-tab/dialog draft when this task began. This pass retained it, corrected state/placement issues and replaced obsolete launcher-navigation test expectations. Other pre-existing changes were preserved.

Files changed by this pass:

- `src/components/HeritageLauncher.astro`: scoped edge-tab/dialog presentation retained; accessible conversation log, input disclosure, contained overscroll and disabled-action styling added.
- `src/scripts/heritage-assistant.ts`: retain current-page native modal and shared matcher; preserve scrollbar space while locking page scroll, restore original inline styles/focus/scroll, isolate assistant clicks and Escape, keep drawer below the visible header during viewport/keyboard resizing, measure the actual tab and avoid actual video buttons rather than treating an entire video surface as an obstruction. Observe native menu/dialog `open` changes.
- `tests/heritage-quiet-luxury-08a.test.ts` and `tests/sprint-08.test.ts`: replace superseded pill-navigation contracts with vertical drawer, shared-engine, disclosure and state-preservation source contracts; retain header CTA test.
- `docs/billing.md`: incremental cost, forecast assumptions and missing-backend disclosure.
- `docs/sprint-08a1-visual-review.md`: this handoff.

No header, hero, map controller, sheet, destination/media, editorial section, e-magazine, footer, global design token, dependency or dedicated Q&A-page change was made by this pass.

## Actual backend status

**AI chat is NOT operational.** Both entry points import `recommend` from `src/lib/concierge.ts`: a synchronous deterministic matcher over six catalog destinations, not an AI service. There is no existing AI request/conversation backend to reuse. The drawer exposes a real form, suggested-question submissions, local result history, status and retry-on-error handling, with explicit Vietnamese disclosure that AI is not connected. It does not pretend that catalog results are AI messages. Follow-up questions are independently matched; no conversational context is inferred. Unsupported meeting/date/day-plan prompts may honestly return no match. No arbitrary intent mapping or fabricated venue data was added to make these prompts appear supported.

The dedicated page remains `/heritage-mach-ban/`; the tab is a button, not a route link. The dialog does not manipulate history, URL, map camera, filters, selected destination or story-sheet controllers. Native modality isolates focus/background interaction; close/Escape restores saved page scroll and focus. Actual browser behavior, especially mobile Safari scroll locking and keyboard dismissal, remains to be verified.

## Validation results

- Manual source inspection completed: right-edge fixed vertical button, neutral palette, minimal sparkle, 410px desktop drawer, mobile viewport sizing, header clearance, safe areas, independent scrolling, persistent header/close region, reduced-motion handling and same matcher import.
- Source inspection confirms the header route/label remains intact and this pass does not edit unrelated components.
- **No tests, build, type-check, runtime/browser QA, preview refresh or PDF generation were executed**, per instance policy. Automatically surfaced editor diagnostics are not a test/build/browser pass. There is no passing test-count claim.
- Existing preview was previously recorded at `http://localhost:4321/`; its current availability, watched updates and rendered state were not checked. No server was started/restarted.
- Billing Markdown is canonical; `output/pdf/ha-long-billing-brief.pdf` remains stale until regenerated and inspected.

On a capable machine with the existing locked environment, run individually:

```sh
node --experimental-strip-types --test tests/heritage-quiet-luxury-08a.test.ts tests/sprint-08.test.ts tests/concierge.test.ts
npm run check
npm run build
uv run --with reportlab python scripts/build-billing-brief.py
```

Inspect all PDF pages. Refresh the **existing** preview in the browser; do not start a second server. If no preview exists, use the project-required background form on an authorized capable environment: `npm run dev -- --background`.

## Visual/interaction checklist — all pending

Use homepage, standalone `/imap/`, prototype and dedicated Q&A page. Check 1440px desktop, 768px tablet, 390px/320px mobile, short landscape, 200% zoom and reduced motion.

1. Scroll from hero through map and footer: the slim tab stays flush right, near viewport middle, with only left corners rounded; no avatar/red/blink. Check label orientation and collision avoidance against zoom, map toolbar, story close, gallery and video controls. If a viewport has no unobstructed edge space, the existing safety guard hides the tab rather than covering controls; verify ordinary supported sizes do not reach that fallback.
2. With a destination selected, pan/zoom and choose filters, scroll the page/story, then record URL including hash/query, page scroll, map camera, filter values, destination and sheet state. Open the tab: no navigation, reload, iframe, new tab or map remount; drawer slides from right without changing underlying geometry.
3. Desktop width about 410px; mobile fills available screen below the visible header. Open/close keyboard, rotate and change browser chrome: close stays visible, input respects safe areas and conversation scrolls independently. Check no page jump when scrollbar/keyboard appears.
4. Submit all three prompts, a known catalog place and unsupported text. Results must be catalog matches/explicit no-match, never claimed AI replies. Check retained history across close/reopen, empty/600-character input, literal HTML-like text, screen-reader result announcements and input error retention. No recommendation network request should occur. The local matcher is synchronous; no artificial network delay/loading spinner is introduced.
5. Close by X, Escape and desktop backdrop; compare every recorded state value exactly. Test rapid open/close and browser back/forward restoration. Escape must not close the underlying story; assistant clicks must not trigger outside-click story actions.
6. Keyboard tab/shift-tab stays in modal; visible focus, descriptive close label and focus restoration work. Test mobile screen reader and unsupported/native-dialog-disabled fallback (tab hidden; header route still available).
7. Desktop/mobile header **Heritage mách bạn** still navigates to `/heritage-mach-ban/`; tab **Hỏi Heritage nhé** always opens the current-page drawer. Native mobile menu/gallery dialogs hide the tab only while those dialogs/menus are open.
8. Compare baseline header, hero, editorial sections, map filters/markers/zoom/media, desktop immersive video, mobile full-height sheet, e-magazine and footer. No unrelated changes from this pass.
9. Inspect host transfer/error monitoring before release; confirm no AI supplier/payment decision is implied by this prototype.

**STOP FOR VISUAL REVIEW.** Do not treat the missing AI backend, pending preview refresh or pending browser/PDF acceptance as completed QA.
