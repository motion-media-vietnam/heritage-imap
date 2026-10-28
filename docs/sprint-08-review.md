# Sprint 08 — source handoff; stop for visual review

## Reused Heritage interface

- Existing route: `/heritage-mach-ban/`, from `src/pages/heritage-mach-ban.astro`; form anchor `#hoi-heritage`.
- No routing defect found in source; Astro file routing and default config support this page. Runtime access is unverified because the preview server is offline.
- Existing capabilities are client-side recommendations over six places, optional user-authorized location and preference filtering. The page explicitly says conversational AI and live research are not connected. No backend, model, fake response, account or iframe was added.
- Desktop/mobile header CTA links to the existing page. Shared floating `Hỏi Heritage nhé` links to `/heritage-mach-ban/#hoi-heritage`, not a duplicate panel.
- On the Heritage page no redundant floating launcher is rendered: its existing inline CTA and form remain. Elsewhere it has visible keyboard focus, a 44px minimum mobile target and safe-area-aware spacing. It yields to open stories, gallery dialogs and mobile navigation/sheets. On narrow map pages it is raised above the collapsed map/sheet controls. Real-device overlap still needs visual verification.

## Anchors and preservation

- Header `Khám phá` targets `/#unmissable-experiences`, not the embedded map's `#experiences`. Homepage clicks and subpage arrivals use reduced-motion-aware scrolling and move keyboard focus to the unchanged heading. Sticky-header clearance is local to the destination section plus existing root scroll padding.
- Heritage carousel eyebrow: `Kho báu của Hà Nội`; shared component default remains `Khám phá Hà Nội theo cách của bạn` for the experience section. No carousel data/controller changes.
- New homepage event section ID: `homepage-events`, heading `events-heading`; header Events link points there. Existing E-magazine `#events` and footer markup are deliberately unchanged.
- Existing three-card `composition-tips` layout classes are retained for events, avoiding a CSS redesign. Experience/food/attractions/hero/Heritage Choice/media content and global styles were not edited in this sprint.

## Visitor category migration

The four shared categories (plus an All reset option) are:

| ID | Label | Icon | Homepage/prototype records |
| --- | --- | --- | --- |
| `stamp-worthy-spot` | Điểm tham quan | Landmark | Hồ Hoàn Kiếm, Phố Cổ, Văn Miếu, Hoàng thành Thăng Long, Hồ Tây, Cầu Long Biên, Đền Ngọc Sơn, Nhà thờ Lớn, Nhà hát Opera Hà Nội |
| `experience` | Khám phá | Compass | Nhà hát Múa rối Thăng Long; Metropole (provisional) |
| `food-drink` | Ẩm thực | Utensils | None currently mapped; existing empty state remains |
| `shopping` | Mua sắm | Shopping bag | Phố sách Đinh Lễ |

- Metropole's old `stay` assignment has no direct new equivalent. It is retained as discovery for its architectural/editorial story, **pending client approval**. No destination was dropped or silently classified as dining/shopping.
- Đinh Lễ moves from experience to shopping. The source audit JSON remains unchanged; migration is an explicit display overlay.
- Homepage/prototype retains all 12 records; `/imap/` retains its original six sightseeing records, now using the same four category options and marker icon paths. Do not confuse these previously different catalog sizes with a deletion.
- Coordinates, portraits, galleries, videos, practical facts, map colors, cluster/radius code and immersive story CSS are unchanged. Search/district/radius logic remains; dedicated-map category filtering now recognizes the shared IDs. Empty categories do not receive fabricated records.

## Event image report

Requested `public/imagine/` does not exist; uploads are in `public/images/`.

| Exact title, in order | Uploaded filename | Status |
| --- | --- | --- |
| Concert BIGBANG tại Hà Nội | `Bigbang hanoi 2026.jpg` | Mapped; client-supplied performance/news image, not confirmation of a Hanoi event |
| Festival Thu Hà Nội 2026 | `festival Thu Hafnoi 2026.jpg` | Mapped; client-supplied festival illustration |
| Liên hoan Phim Quốc tế Hà Nội lần thứ VIII (HANIFF VIII) | Candidate: `Haniff2026.jpg` | **Withheld:** artwork visibly says HANIFF VII and 07–11 November 2024; correct VIII asset required |

All three cards are non-clickable, carry a pending-verification category and no descriptions, venues, dates, prices or booking links. The third card uses the existing neutral pending-image treatment, not an unrelated substitute. Originals are untouched. The section intro explicitly states that these are client editorial proposals awaiting factual/event confirmation. Image publication rights still require client confirmation.

## Files changed for Sprint 08

Application:

- `src/components/EditorialEyebrow.astro`
- `src/components/HeritageExperiences.astro`
- `src/components/HeritageLauncher.astro` (new)
- `src/components/LowerHomepage.astro`
- `src/components/imap/IMap.astro`
- `src/data/imap-prototype.ts`
- `src/layouts/Layout.astro`
- `src/lib/imap-categories.ts`
- `src/lib/imap-neighborhood.ts`
- `src/lib/imap.ts`
- `src/pages/imap.astro`
- `src/pages/imap-prototype.astro`
- `src/scripts/imap.ts`

Regression/documentation:

- `tests/imap-neighborhood.test.ts`
- `tests/imap-prototype-content.test.ts`
- `tests/imap-featured.test.ts`
- `tests/sprint-08.test.ts` (new)
- `docs/billing.md`
- `docs/sprint-08-review.md` (new)

The checkout already contained substantial unrelated edits; they were not reverted or treated as Sprint 08 work.

## Verification status and preview

**Source reviewed, not runtime accepted.** Original event images were inspected directly. Edit-time TypeScript checks reported clean for changed TS files after replacing an initial unsafe-HTML sink with SVG DOM construction; this is not an Astro build/type-check or browser pass. Regressions were updated/added but not executed. No claim of successful desktop/mobile filtering, smooth scrolling, cropping or launcher overlap QA.

Container checks: `mise trust --show` reported no trusted configs; `mise current` and `mise ls --installed` listed no tools. No repository mise/Pixi config exists; `package.json` requires Node >=22.12.0. No missing leaf tool was probed directly. Provisioning a Node toolchain/dependencies requires approved bootstrap under the resource policy; no versions or dependencies were installed.

- Current workspace preview: **https://code.arvigeus.one/workspaces/mm-guide/preview**
- HTTP HEAD returned **303 to `/login`** from this unauthenticated session.
- `http://127.0.0.1:4321/` refused connections. No server restart or authenticated preview refresh was performed.
- Builds, tests, server startup and PDF generation were skipped under instance policy/toolchain limitations. No new standalone preview URL was created.

On a capable machine with the project's dependencies and a suitable Node toolchain already provisioned (use the mise wrapper in this container):

```sh
mise exec -- npm run check
mise exec -- node --experimental-strip-types --test tests/sprint-08.test.ts tests/imap-neighborhood.test.ts tests/imap-prototype-content.test.ts tests/imap-featured.test.ts
mise exec -- npm test
mise exec -- npm run build
mise exec -- npm exec -- astro dev --background --host 127.0.0.1 --port 4321
mise exec -- npm exec -- astro dev status
uv run --with reportlab python scripts/build-billing-brief.py
```

Then sign in to the existing workspace preview and refresh it. Visually inspect the generated PDF before sharing (currently stale). An older gallery regression still expects one Đinh Lễ image although the pre-existing source gallery contains six; this is a source-observed test-contract discrepancy, not an executed test failure, and was not changed as unrelated sprint work.

### Required desktop/mobile acceptance

1. Transparent and sticky headers: Heritage CTA has contrast, hover/focus and no navigation overflow. Mobile menu still closes normally.
2. Homepage and subpage `Khám phá` links land on the experience heading below the sticky header. Check keyboard activation, modified-click behavior, reduced motion and back/forward history.
3. Only Heritage carousel eyebrow changes; experience eyebrow and both headings stay exact.
4. Test All and every map category on homepage/prototype and `/imap/`, combined with search, radius and districts. All previous records remain reachable under All; food shows an honest empty state.
5. Open clustered markers, destination videos/galleries, desktop immersive stories and full-height mobile sheets; verify unchanged closing and navigation behavior.
6. Events: exactly three exact titles, correct first two photos and explicit third pending image; no article/booking anchors. No new event date/confirmation claims.
7. Launcher: correct destination, safe-area spacing, keyboard target, no auto popup; verify no overlap with map controls, dialogs or sheets. Heritage page uses its existing inline entry without a duplicate launcher.
8. Spot-check hero, brand, Heritage Choice, existing experience cards, food, attractions, E-magazine and footer unchanged.

**Stop for visual review. Outstanding: correct HANIFF VIII artwork, Metropole category approval, provisioned toolchain/preview runtime and authenticated browser acceptance.**
