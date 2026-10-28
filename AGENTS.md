## Owner workflow and standing authorization

The owner is a Vietnamese-speaking, non-technical designer. She decides the design, content and features; agents own delivery. Reply in friendly, plain Vietnamese by default, matching another language when the current speaker uses it. Show the working website link and explain the result. Do not require her to use a terminal, edit files, manage Git, configure hosting or keep her laptop running.

Her husband authorized project setup, installing missing development tools, routine maintenance, commits and publishing completed changes. Use the existing ChatGPT account, prefer free services, and preserve public link access. Do not ask again for these routine actions. Ask only for missing creative/business decisions, human sign-in, a paid commitment or destructive work outside the request. Never buy credits, enable paid overages, add subscriptions or register paid domains without authorization. Native permission checks still apply.

Carry each change through implementation, relevant verification, billing documentation, a descriptive Git commit, source synchronization and deployment to the existing Site. Repair relevant failures, preserve unrelated work and existing visual approvals, and verify publication. If blocked, finish independent work and explain the precise blocker. Never claim unrun checks or failed deployments passed. Routine regression fixes are authorized; broader redesigns need a request.

Historical sprint/README notes about a previous instance prohibiting installation, tests, builds or PDF generation are historical observations, not restrictions here. Current user instructions govern; historical design/content approvals still apply.

## Publishing and phone access

- Read `docs/operations.md`. Reuse the Site in `.openai/hosting.json`; never create another for routine updates.
- Public URL: https://heritage-imap-ha-noi.hushedhill22.chatgpt.site . Preserve this audience unless explicitly asked to change it.
- The Sites-managed repository is the primary editable source. Before editing, use the Sites skill to open/synchronize the latest hosted source: phone edits can advance it independently of this laptop. Reconcile divergences without force-pushing or losing work.
- Commit/push the tested source and package static `dist/` through the Sites source helper, save a version, then use the public deployment operation. Deployment is part of completion unless the user requests a draft or no publication. Verify success and return the URL.
- GitHub `origin` is a secondary copy, not an automatic publication trigger. Mirror safely when authenticated; report an unavailable mirror separately. Phone work must not depend on this laptop or GitHub credentials.
- On her phone, open the existing Site in ChatGPT Work / Sites using the same account and request edits there. Local Codex chats/files do not automatically become cloud-editable. Mobile app/region/account availability must be confirmed; try mobile web where supported.

## Local tooling and verification

Prefer bundled Codex Node/Git/Python runtimes, located using `load_workspace_dependencies`. Do not use the Windows Store Python placeholder. Node must meet `package.json` (>=22.12). Install missing prerequisites within authorized scope; prefer project-local installations and ignore generated tools.

`node scripts/project.mjs setup` installs locked dependencies and bootstraps integrity-checked local npm if absent. The runner also supports `check`, `test`, `build`, `dev`, `dev:status`, `dev:logs`, `dev:stop`; system npm is unnecessary. The owner never needs to run these commands.

For application or hosting changes run type checks, regression tests and a production build, then representative desktop/mobile browser checks when available. Report browser/device verification limits accurately. Fix relevant test harness issues without weakening assertions. Keep credentials out of tracked files, browser code, logs and deployment archives. Documentation-only changes follow the checks below.

## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Business billing estimates

Maintain `docs/billing.md` as the business-facing record of operating costs, alternatives, and assumptions. Keep its shareable PDF in `output/pdf/ha-long-billing-brief.pdf` consistent with the Markdown source when that deliverable exists.

For every proposed or implemented feature, integration, or infrastructure change, assess its billing impact and update this record as part of the work. This applies to requests from the project owner or their boss. A change is not complete until its cost impact is documented; for a change with no billing impact, record that conclusion and the assumptions that make it true. Do not create an extra permission gate for preparing estimates or for work already authorized.

- Write for a business person: explain the recommendation, what the business pays for, the expected recurring subtotal, what is excluded, and what decision is needed. Define billing units such as requests, map views, credits, storage, or active users in plain language.
- Verify current prices, plan eligibility, commercial-use and geographic restrictions, quotas, and overage behavior from primary provider sources. Include direct links, the verification date, currency, billing interval, and tax treatment. Never present an old rate, temporary promotion, or unverified quote as a current price.
- Separate verified unit prices from forecast usage. Show explicit low, expected, and high/heavy-use scenarios, with reproducible calculations. Use measured usage where available; otherwise label assumptions and uncertainty. Do not describe forecasts as guaranteed bills.
- Compare suitable alternatives, including the current approach and a cheaper or simpler approach where feasible. Explain differences in features, reliability, maintenance, vendor dependence, and commercial eligibility. If an option needs a quote or eligibility confirmation, say so instead of inventing a price.
- Cover all cost drivers affected by the change: subscriptions, API calls, hosting/compute, storage, bandwidth, third-party services, and any transaction charges. Separate implementation and maintenance effort from recurring vendor bills. Do not label a partial subtotal as the full business cost; identify unquoted domains, taxes, currency conversion, labor, and other exclusions.
- Explain what happens at a limit: automatic overage charges, throttling, service suspension, or a required plan change. Recommend appropriate usage monitoring, budget alerts or supported spending caps, and a fallback. Never imply that an alert is a hard spending cap.
- Refresh the estimate whenever scope, traffic assumptions, rates, or plan selection change, and before a release or paid service commitment. Flag unresolved assumptions clearly. Document new features as proposed until they are actually implemented.

For this project, regenerate the PDF from the canonical Markdown with `scripts/build-billing-brief.py` and visually verify it after substantive updates. Documentation-only changes need pricing/arithmetic/link and document-layout checks, not an unrelated application test run.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)
