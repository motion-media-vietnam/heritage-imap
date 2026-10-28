# Agent delivery and maintenance

Read `AGENTS.md` first. The owner supplies design/product direction in Vietnamese; agents deliver the whole change. On October 28, 2026 her husband authorized installing missing tools, routine maintenance, commits and publication using the same account, public link access and free-first services.

## Source and hosting

- Reuse `.openai/hosting.json` and its exact Site ID. Static output: `dist/`.
- Public URL: https://heritage-imap-ha-noi.hushedhill22.chatgpt.site
- Primary editable source: the Sites-managed Git repository returned by the source-credential tool. It enables cloud work without the office laptop.
- GitHub `origin`: `https://github.com/motion-media-vietnam/heritage-imap.git`, a secondary copy. No GitHub-to-Sites deployment webhook is configured. Arbitrary GitHub pushes do not publish this Site.
- No database, payment processor, server-side AI or application API key is required.

## Complete each requested update

1. Read the installed Sites skill and inspect uncommitted work. Get the existing Site/access and source credential. Open/synchronize its source with the skill's helper before editing: phone edits may be newer than this checkout. Keep credentials in session memory and pass through hidden stdin, never shell arguments or files. Reconcile history without force pushes or losing unrelated work.
2. Implement the requested result, preserving existing approvals outside its scope. Install missing prerequisites as authorized. Use bundled runtimes and `node scripts/project.mjs setup` on a fresh checkout, or ordinary `npm ci` when npm is available.
3. For application/hosting changes run `check`, `test`, `build` through the project runner or equivalent npm scripts. Repair relevant failures without weakening assertions. Inspect representative desktop/mobile pages, navigation, maps and fallback states with available browser tools. State device-verification limits accurately.
4. Update `docs/billing.md`, including zero incremental cost where applicable; reverify affected rates before release. Regenerate its PDF using `scripts/build-billing-brief.py` with bundled Python/ReportLab, render every page and inspect it. Historical estimates are archived and are not current tariffs.
5. Review the diff for secrets, generated tools and unrelated edits. Create a descriptive commit and push the exact tested source through the Sites source helper. It can own the commit, but may stage the whole checkout: resolve unrelated work first. Build with the skill's `build-site.mjs` when a build is still needed; avoid redundant successful builds with unchanged inputs. Package static output with the source helper into an ignored temporary archive outside `dist/`.
6. Use the returned project ID, commit SHA and archive unchanged with `save_site_version`, then `deploy_site_version` for this public Site. Do not use the owner-private shortcut. Preserve public access; change the audience only on explicit instruction. Every deployment URL is production. A draft request means save without deployment.
7. Wait for a terminal successful result. Reuse version/deployment IDs from partial failures instead of creating duplicates. Keep the previous stable release if checks fail. Return the working URL, changes, verification and material limits in brief Vietnamese. An HTTP 200 response alone is not proof of successful publication.
8. Mirror commits to GitHub origin when authenticated and safely reconcilable. An unavailable secondary mirror does not block a Site release; report exactly what was saved where.

There is no background watchdog or paid maintenance service. Agents maintain the project during requested work. Do not add scheduled usage/monitoring or a standing automation without a request.

## Laptop tooling

Find bundled Node/Git/Python through `load_workspace_dependencies`. Avoid the Windows Store Python app alias. Node >=22.12 and tar are prerequisites; agents install a missing prerequisite within authorized scope. `scripts/project.mjs` uses an existing npm CLI or bootstraps npm 11.6.2 (compatible with Node 22.12) from the official npm registry, checks archive integrity and installs the lockfile. Generated tooling stays in ignored `.tools/`. Source files use LF line endings through `.gitattributes` so Windows and cloud source-contract checks agree.

Use `node scripts/project.mjs dev` for `astro dev --background`. Manage via `dev:status`, `dev:logs`, `dev:stop` through the same runner. Reuse an existing server; stop temporary QA servers when done. A foreground laptop server is not the publishing workflow.

The native Sites helpers call npm by name. If no system npm exists, add this checkout's `.tools/bin` to PATH after setup. Do not install tools globally merely for that purpose.

## Recovery and owner access

Retain the previous stable Site version for rollback. On failure, repair or redeploy it through Sites while preserving public access. Do not promise instant or guaranteed publication. Free-tier limits may require waiting or reducing usage; notifications are not spending caps. No credit purchases, paid upgrades or new subscriptions without a business decision.

Cloud editing uses the existing Site in ChatGPT Work / Sites, not a remotely exposed office laptop. Use the same account and https://chatgpt.com/sites from a mobile browser if the app lacks Sites. Confirm access on the actual phone before claiming a device pass.

Official references checked October 28, 2026: [Sites](https://learn.chatgpt.com/docs/sites), [phone editing](https://developers.openai.com/training/walkthroughs/building-a-shareable-site), [Astro deployment](https://docs.astro.build/en/guides/deploy/).
