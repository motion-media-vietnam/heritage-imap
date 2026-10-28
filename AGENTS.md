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
