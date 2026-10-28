# Sprint 02A — referrer-policy investigation (no implementation)

Investigated October 17, 2026. All application source, configuration, Heritage assets/metadata/design and regression tests remain unchanged. No build or test was run; no new OSM tile request was made during this investigation.

## Observed browser evidence supplied by owner

Desktop Chrome: tile response HTTP 200, image/png, 6,987 bytes; effective request policy `no-referrer`; visible Access blocked tiles. Mobile reportedly works, but its exact URL/request headers/context were not supplied. This strongly implicates desktop request identification/referrer handling, but does not identify which layer supplied the policy or establish that mobile and desktop use identical documents/caches.

## Application inspection

- `src/layouts/Layout.astro`: no `<meta name="referrer">`, Referrer-Policy/CSP directive or inline policy-setting code.
- Source scan of application components/scripts/pages: no `no-referrer` policy. Existing `rel="noopener noreferrer"` applies only to specific outbound links, not map image requests. Existing `strict-origin-when-cross-origin` applies to YouTube iframes, not Leaflet tiles.
- `astro.config.mjs`: `defineConfig({})`, no adapter, custom response/security headers or referrer configuration.
- No root Vercel/Netlify/Wrangler configuration or public `_headers` file; no generated `dist/_headers` or `_redirects` found.
- Built `dist/index.html` and the live local document contain no referrer/security meta tag.
- Current Leaflet layer in `src/scripts/explore.ts` sets maxZoom/attribution only, not `referrerPolicy`.
- Installed Leaflet `src/layer/tile/TileLayer.js` defaults `referrerPolicy: false` (meaning no image attribute, not `no-referrer`). Its `createTile()` sets `img.referrerPolicy` only when an explicit string option is supplied, before assigning `src`. Tiles therefore inherit the document/browser policy today.

## Response and hosting inspection

A GET of `http://localhost:4321/` returned HTTP 200 with Vary, content-type, Date, connection/transfer headers, **no Referrer-Policy and no Content-Security-Policy header**. Saved in `referrer-local.headers` with document body `referrer-local.html`.

The local port-8080 service returns a 303 redirect to `/login`, not the authenticated application preview, and exposes no referrer header on that redirect. It cannot establish the policy of the protected preview document.

The configured external origin `https://preview.code.arvigeus.one/` cannot be inspected from this environment: TLS handshake fails. No hosting proxy/security configuration defining the actual preview response is present in this repository. The available `/opt/syntaxis-pi` installation contains the coding-agent runtime, not an identifiable preview-host header configuration; no broad filesystem/config search was attempted.

**Exact origin is not identifiable from available evidence.** No application-controlled `no-referrer` source was found. Remaining candidates include injected preview-document HTML/response headers, an inherited policy in a synthetic/about:blank/srcdoc document, a tile attribute added at runtime outside the inspected code, browser extensions/privacy settings or enterprise policy. A normal iframe's policy for loading its URL alone does not prove it controls all requests inside a separately loaded document.

## What no-referrer does

An effective `no-referrer` policy instructs the browser to omit `Referer`, including requests to `tile.openstreetmap.org`. Confirm its actual absence under the failed tile's Request Headers; do not confuse `document.referrer` (how the page was reached) with an outgoing request policy. Missing Referer conflicts with OSM's requirements for web tile requests. A 200/PNG response can be a denial image; status/content type alone are not success evidence. The 6,987-byte size matches the earlier denial response but is not an independent image-content verification.

## Smallest conditional application correction — proposal only

If a scoped application correction is approved and compatible with the hosting/browser privacy requirements, add only this option to the existing Leaflet tile layer:

```ts
referrerPolicy: 'strict-origin-when-cross-origin',
```

Leaflet supports it natively. It sets the policy per tile image before the request and sends only the originating site's origin on HTTPS cross-origin requests, not the page path/query. It does not change global HTML/header policy, Heritage/YouTube behavior, provider, destinations or layout. No fetch wrapper/proxy, User-Agent spoofing or cache bypass is needed. Stronger extension/browser/network restrictions may still remove the header; success must be measured, not promised. No global meta/header change is justified until the actual policy source is identified.

If the preview's response/meta tag is the intended policy owner, inspect that owner before altering it; a hosting-wide change would affect more resources than a tile-only option. Do not modify an unknown platform security configuration or attempt to evade a user-enforced privacy restriction.

## Evidence needed to locate the exact policy owner

In desktop DevTools, select the document/frame that owns `.leaflet-tile` elements, not merely the outer preview shell:

1. Network > Doc: inspect that document's final response headers for Referrer-Policy/CSP and its response HTML for a referrer meta tag. Compare its URL and headers with mobile.
2. Elements: inspect an actual `.leaflet-tile` image for `referrerpolicy`; inspect the owning document's `<head>` for injected `<meta name="referrer">` tags.
3. Compare the embedded preview with the same document opened directly where permitted. If needed, compare in a clean Chrome profile while retaining normal security defaults; do not disable referrer protection globally.
4. For the blocked tile capture request Referer/User-Agent, effective policy, response `x-blocked`, response image, URL and timestamp. A sanitized tile-only capture avoids leaking preview authentication data.

## Safe validation after approval

Keep DevTools Disable cache **unchecked** and normal browser caching enabled. After an approved correction, perform one ordinary reload of one visible viewport (no cache busting, loops, panning sweeps, prefetch or repeated forced retry). Inspect a newly requested/revalidated tile where one occurs naturally: effective policy should be strict-origin-when-cross-origin, Request Headers should show the real preview origin in Referer, and the response should contain actual map imagery without a denial header/message. Existing cached tiles alone cannot prove new request behavior. If needed, wait for normal revalidation rather than force an OSM cache bypass.

Confirm normal attribution, inspect the desktop map and compare mobile using the same URL. Then run the authorized build/regression suite as a separate approved implementation validation. HTTP 200, PNG type or `tileload` alone is not enough. No unrelated section should change.

Primary sources checked October 17, 2026:

- https://operations.osmfoundation.org/policies/tiles/
- https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Referrer-Policy
- https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement/referrerPolicy

Await owner approval before implementing any correction.
