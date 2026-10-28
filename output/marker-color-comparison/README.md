# Reversible iMap marker color comparison

Await client approval. No color is selected permanently.

## Changed application files

- `src/pages/imap-prototype.astro`: Original/A/B selector replaces the old development badge in the existing header slot. Optional `markerColor=navy` / `markerColor=red` initializes the study before paint. Switching only updates a root data attribute and the URL, without reloading, persisting a preference or invoking any map/controller methods.
- `src/styles/imap-prototype.css`: route-only study variables and marker overrides. A `#203A5E`, B `#FF6666`; white SVG strokes, existing 48px circles / 20px icons, and unchanged anchor/cluster algorithms. Light red adds a dark icon halo and 2px border of the same width; selected markers use an external white/dark double ring without scaling. Clusters coordinate with the variant while retaining their neutral grid/count, including selected clusters.
- `docs/billing.md`: scoped zero incremental configured service-fee assessment, unmeasured transfer/storage effects and limitations. PDF remains stale.

The original palette is restored by selecting “Màu hiện tại” or removing the query parameter. No global palette tokens, destination data, coordinates, category definitions, controller, filters, camera, zoom, story, sheet or production page files were edited. Header/map dimensions and marker target geometry are not intentionally changed; actual responsive layout remains unverified.

## Desktop and mobile review

Open `preview.html` in a browser for the standalone color proof: four labeled panels (desktop A/B, mobile A/B). It contains no external dependencies, map tile requests, destination records or geographic data. Marker/count samples are UI illustrations, not invented destinations. These are NOT actual application screenshots or proof of responsive map behavior.

Actual responsive prototype URLs after an authorized rebuild/restart:

- A: http://localhost:4321/imap-prototype/?presentation=1&markerColor=navy
- B: http://localhost:4321/imap-prototype/?presentation=1&markerColor=red
- Original: http://localhost:4321/imap-prototype/?presentation=1

Inspect both colors at desktop (e.g. 1440 × 900) and mobile (e.g. 390 × 844), keyboard focus, selected singles/clusters, icon readability over tiles, header fit and unchanged pan/zoom/radius/story/sheet behavior. No public/external hostname is verified. The previous preview was stopped after the earlier test-launch failure; this task did not rebuild or start it, so these URLs are not claimed live.

## Contrast assessment

Using WCAG relative-luminance reasoning, approximate color-pair contrast:

- White vs navy: 11.5:1.
- White vs light red: 2.86:1 — below 3:1 for meaningful graphical boundaries and below 4.5:1 for normal text.
- Navy vs light red: 4.0:1.

B retains white icons but adds a navy halo and marker border. This is a mitigation, not proof that thin rasterized SVG strokes meet accessibility requirements in every browser/zoom/device. Do not approve bare white-on-red as compliant based on this experiment. Cluster count text stays dark on the existing light badge; selection is conveyed by rings and the existing selected-name tooltip, not fill alone. Neither variant changes category icons or claims a new category meaning.

## Checkpoint and validation limits

`rollback.tar` holds the three pre-change files; its checksum is in `rollback.tar.sha256`. Existing Sprint checkpoints are untouched. Extract to a separate directory before any approved rollback and compare later edits; do not reset the dirty tree. The new proof and this handoff are not in the pre-change archive.

No tests, explicit type-checks, builds, parallel workers, package installs or server starts. Harness automatic file diagnostics may occur. No browser executable was found by command lookup; no actual screenshots were captured. Source review and protected/checkpoint checksums only.

Before actual map visual acceptance, on an authorized capable runtime, complete the previously blocked test run with the Node test concurrency flag passed directly (not in NODE_OPTIONS), build the refreshed source, and start only one preview. The earlier test launch failed because Node rejects `--test-concurrency` in NODE_OPTIONS. No command retry was attempted in this task.

Stop here for client review; permanent palette selection and runtime refresh require follow-up approval.
