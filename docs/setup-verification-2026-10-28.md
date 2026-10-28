# Setup verification: October 28, 2026

Scope: agent-owned delivery, Vietnamese onboarding, portable local setup and initial static Sites publication. No application design or content was changed. The Git content of `src/`, `tests/`, `astro.config.mjs`, `tsconfig.json` and `package.json` was compared with initial commit `699773d56f67111fff272f40a3b1fae2558dcfdb`, ignoring CRLF/LF differences: no content differences. `.gitattributes` now keeps source line endings consistent across Windows and cloud checkouts.

## Results

- Setup: passed with bundled Node 24.22.1, Git and project-local npm; locked dependencies install successfully. The runner uses Astro's declared binary path and requires explicit setup before checks when dependency inputs change, avoiding concurrent implicit reinstalls. npm 11.6.2 is the compatible fallback bootstrap; this laptop already has npm 12.2.1 installed locally.
- Astro type checks: 93 files; zero errors, warnings or hints.
- Production build: passed; static output in `dist/`, 10 routes generated.
- Security: compatible transitive updates `fast-uri` 3.1.9 and `undici` 8.12.3. The final npm audit reports zero known vulnerabilities. This is a point-in-time advisory check, not a security guarantee.
- Browser: installed Edge, desktop 1440×1000 and emulated mobile 390×844, reduced motion enabled. Homepage and `/heritage-mach-ban/` returned 200; no JavaScript page errors or horizontal overflow. Heritage drawer opens, accepts a query, renders local results and closes. Mobile menu opens and closes with Escape. Leaflet initializes and loaded 12/9 map tiles in the two contexts. Screenshots were inspected. This is browser emulation, not a real phone/Safari test, complete accessibility audit or autoplay/media-rights validation.
- Billing: current provider sources opened on October 28; host/tile scenario arithmetic checked; canonical Vietnamese Markdown rendered through `scripts/build-billing-brief.py`, all PDF pages visually inspected. The old billing record was preserved separately without treating old prices as current.
- Publication: use the native Sites save/deploy result and current Site state for the exact version and success; this report describes local verification, not proof of a live release. Public access was explicitly requested and confirmed through the access tool.

## Existing automated-test debt

The full suite currently reports **180 tests: 146 passed, 27 failed, 7 skipped**. It is not fully green. No tests were deleted, skipped or weakened for this setup. The same application/test source exists in the original commit, so these failures were not introduced by changes to application behavior here. Windows line-ending normalization resolves two extra portability failures seen in the first run.

Inspected causes include obsolete layout/string assertions and freezes from earlier designs, an old 11-record expectation after the approved Opera record was added, controlled DOM fixtures missing `document.querySelectorAll`, VM fixtures missing imported `filterPrototypeCollection`, and a fixture evaluating raw TypeScript syntax as JavaScript. Treat uninvestigated failures as open; do not assume every failure is only a test issue. Preserve current approved behavior when updating fixtures and use browser checks to distinguish regressions from old expectations.

Reproduce with `node scripts/project.mjs test`. Local diagnostic logs/captures are ignored under `tmp/`; the failed test names below provide a durable handover. This setup makes the existing version available; it does not claim product acceptance or completion of historical design sprints. Future agents should investigate this debt during relevant maintenance without asking the owner to debug it.

- paper transition is scoped to the existing Heritage background, with no geometry changes
- homepage header state changes at scroll without measuring/resizing hero or touching navigation
- templates use escaped text, 16:9 privacy-enhanced iframe and persistent original-URL fallback
- directions use each selected identity’s coordinates, walking mode and no origin
- frozen Hero and sections outside the explorer are byte-identical
- the active shared Leaflet layer retains the approved endpoint, referrer policy and attribution
- real filter callback keeps count, list, marker inputs, selection and empty messages synchronized
- actual clear action updates all controls, radius circle and results without changing map/center or scrolling focus
- search, category, radius and neighborhood compose without silently resetting any filter
- 05B catalog: actual filter callback synchronizes new categories, neighborhoods, selected records and counts
- 05B catalog: held food marker remains absent and explicit reset restores seven defaults without recentering
- comparison control and query handling are removed, so old red links cannot override navy
- pilot maps exactly one existing client image without changing its identity, pin or content
- rapid mobile radius changes refresh size before fitting and leave no queued flight
- mobile radius fit uses the new container size rather than Leaflet cached dimensions
- actual marker click routes single destinations to stories and clusters to a scoped directory
- all eleven records use their supplied local assets with no unrelated photograph
- all rows retain full-row click binding and nearby navigation uses the destination slug
- selection pans minimally only when obscured; manual camera movement cancels correction
- actual marker-open and close functions preserve selection and restore compact sheet state
- selection/close/resize controller paths never set a captured or marker-derived zoom
- route keeps discovery in an overlay sheet and uses the immersive desktop grid
- destination video preserves the original landscape frame and native user controls
- presentation mode hides only marked development chrome without altering map attribution
- mobile header is compact and map-return states preserve destination and camera
- CSS and mobile viewport ownership stay inside the explorer, leaving the footer in normal flow
- approved portraits, source facts, player behavior and directions remain in the shared view
