# Sprint 05C.0 — confirmed editorial workflow

**Design proposal · October 20, 2026 · STOP for approval.** The two-level workflow below is a confirmed requirement, not an optional enhancement. The architecture and implementation sequence are recommendations only. No CMS, roles, security controls or publication integration have been implemented by this document. Existing 05B.1 application changes and 05C.1 editorial drafts remain untouched and are not newly approved for publication.

## 1. Recommendation and decision

Use a private headless CMS for authoring, an explicit server-enforced revision/review service, and a separate approved-only publication snapshot consumed by the existing Astro site. Keep Astro as the public presentation layer. Recommend **Payload as a provisional implementation candidate**, subject to a bounded proof of permissions, immutable revision approval, restoration and deployment feasibility after authorization. Do not select a paid plan or assume its default Draft/Publish buttons satisfy this workflow.

Public requests must not query the private authoring store. For the current static-site approach, prepare a complete, versioned site release from one approved content manifest; publish by an atomic deployment/active-release switch. All affected iMap data, destination pages and video-category lists must derive from the same manifest, not independent collection webhooks or manually copied datasets. Keep the prior complete release for rollback.

Approval requested: this architecture, role matrix, separation-of-duties rule, publication contract, and staged implementation plan. CMS/vendor/hosting procurement, implementation and production migration are **not authorized** by this proposal. Before a provider commitment, confirm current licensing, commercial/geographic eligibility, hosting compatibility, limits and full costs. See `../billing.md`, Sprint 05C.0.

## 2. Roles and permissions

Default deny; enforce permissions on the server for UI, REST/GraphQL, imports, jobs and internal APIs. Hiding a button is not authorization. Use individual accounts, not shared credentials.

| Action | Client Editor | Motion Media Approver |
| --- | --- | --- |
| Read live content | Yes | Yes |
| Create/edit draft | Yes, within assigned client scope | Review access; any authored correction is a new draft requiring another eligible approver |
| Upload/link media | Yes, private draft assets only | Review assets and rights evidence |
| Submit for review | Yes | Yes for a draft they authored; cannot self-approve |
| View feedback/history | Yes, scoped to assigned content | Yes, scoped review queue and audit |
| Approve, reject, request revisions | No | Yes, unless a contributor to that revision |
| Publish/unpublish | No | Yes, only through controlled publication actions |
| Restore previous approved publication | No | Yes, through audited release restoration |
| Modify live content in place | No | No; publish a separately approved revision |
| Alter role grants, audit or approval metadata | No | No through editorial permissions |

Server-owned identity/role administration is a separate operational responsibility, not a third editorial approval level. Neither editorial role can grant itself permissions, delete audit evidence or write publication pointers directly. Deployment credentials may activate only a release with valid authorization and cannot approve content.

**Prevent self-approval:** an approver must not be the revision creator, submitter, or any person who changed its substantive content/media/coordinates/categories. Track contributor identities server-side. A later role change does not erase authorship. The publisher must also be independent of those contributors; the same independent Motion Media person may review, approve and publish. If an approver authors a correction, another eligible Motion Media account must approve it. If no independent account exists, publication is blocked, not silently waived. Role revocation and account disablement take effect at action time.

## 3. Proposed content model and isolation

- **Content identity:** stable destination/story ID, client scope, record type, current live revision reference. Identity is separate from mutable editorial fields; an editor cannot silently reassign IDs.
- **Draft workspace:** mutable private work-in-progress with optimistic locking. Editing a published identity clones its live approved payload into this workspace; it never edits the live revision.
- **Revision:** immutable submission snapshot with revision ID, identity ID, base-live revision ID, schema version, canonical payload hash, creator, contributors and submitter. Payload includes prose, practical facts, source evidence, coordinate values and verification status, category references, linked stories, media versions, credits, rights and publication eligibility. Submitted bytes cannot be edited; resubmission creates a new revision.
- **Review decision:** review/revision/hash references, reviewer, decision, feedback and server UTC timestamps. Approval applies only to the exact snapshot and all its dependencies, never to a record's mutable 'latest' state.
- **Media version:** immutable asset key/hash or exact external reference, metadata, rights/credit evidence, verification status and draft/public eligibility. Replacing bytes or changing rights, caption, poster or credit creates a new reviewed version. Never overwrite an already published asset key. External links may change outside our control; review their source/rights, avoid claiming frozen third-party bytes, and withdraw broken or revoked media through controlled publication.
- **Release:** immutable manifest mapping public identities to approved revision IDs and immutable media/category versions, plus checksum, previous release ID, authorization and deployment result. Deletions/unpublishing are explicit manifest removals, not deletion of revision history.
- **Audit event:** append-only event ID, actor ID/role-at-action, action, revision/hash, content/release ID, prior/next state, server UTC time, reason and correlation/idempotency key. Record creation, edit/contribution, submission, review start/feedback, request-revisions, rejection, approval, publication request, success/failure, unpublish and rollback. Preserve who submitted, reviewed, approved and published, and when; deployment completion is distinct from a human publication request.

Private assets remain in private storage with authenticated, short-lived preview access; a guessable public upload URL is not draft isolation. Copy only approved asset versions to public immutable paths during release preparation. Draft/rejected originals, source notes, feedback, audit and credentials never enter public builds, JSON feeds, search, sitemaps or logs. Restrict version/history APIs and relational expansion as well as ordinary read endpoints. Public-facing responses are allowlisted projections, not serializations of whole CMS documents.

Shared categories, coordinates and media are part of the approval boundary. Changing a category label, video association or shared asset must not mutate current public references. A release pins the exact reviewed dependent versions and includes all affected consumers; changes require a new release. Approval cannot bypass existing factual-verification and media-rights gates. Do not invent missing assets or treat a prototype placeholder or 05C.1 draft as approved content.

## 4. Revision and publication state machine

Content lifecycle and deployment lifecycle are distinct:

1. **Draft → Submitted:** editor submits; server validates scope, captures contributors, freezes payload/dependencies/hash and records submitter/time. Live pointer remains unchanged, or absent for a never-published record.
2. **Submitted → In review:** eligible Motion Media reviewer claims/opens review; log actor/time and present differences against the base live revision, including coordinate/category/media changes.
3. **In review → Revisions requested / Rejected:** require feedback and actor/time. Neither state is publishable. Client sees feedback and may create an amended draft/new submission; prior decisions remain intact.
4. **In review → Approved:** independent approver validates required content, facts/rights, dependency versions and exact hash; record decision/time. Approved does not mean public.
5. **Approved → Publication requested:** independent Motion Media publisher selects the exact approved revision. Recheck current permissions, decision validity, hash/dependencies and base-live compare-and-swap. If live has changed since submission, block, rebase into a new revision and re-review; no last-writer-wins publication.
6. **Preparing → Ready → Active release:** authorized worker builds a complete approved-only snapshot and public outputs, checks cross-surface consistency, then atomically activates the release. Success records the actual deployment time and release pointer. A failed build/upload/activation leaves the previous complete release live and records failure/retry; approval is not silently revoked or converted into publication.
7. **Published → new Draft:** editing forks a new workspace/revision. The prior approved release stays public through draft, review, rejection and approval until another successful publication.

Any substantive change after submission/approval requires a new snapshot and fresh approval. Approval fields, status and live pointers cannot be supplied by clients. Deny arbitrary `_status: published`, direct revision restore, bulk-update, scheduled-job and privileged-local-API bypasses. Imports and migrations must use the same policy or remain quarantined. Scheduling is out of initial scope.

Publication must be idempotent, serialize conflicting activations, verify release freshness immediately before switching, and persist release authorization/audit with a transactional outbox or equivalent recovery mechanism. Reconciliation must recover activation/audit failures without inventing a human decision or activating an unapproved release. Operational DB credentials are restricted; tamper-resistant audit export/backups supplement application-level append-only rules. Retention, access and recovery targets must be agreed before rollout; never prune a revision/asset needed by an active or retained rollback release.

## 5. Consistency, unpublish and rollback

**One release, three consumers:** the iMap marker and detail payload, destination route and video-category membership all use the same destination IDs and release manifest. Generate all outputs before activation; verify coordinates/categories/media agree and reject dangling links or unapproved dependencies. No public CMS token or draft parameter is shipped to a browser. Public APIs, if later added, read only the active snapshot and ignore/reject preview parameters.

An active release pointer is the consistency boundary for new requests. Pin any runtime fetches to the page's release ID so an open page never combines old HTML with new data. Existing open pages can remain on a prior internally consistent release; reload obtains the new one. Use release-specific asset/data URLs and a verified atomic host deployment/cache strategy. If the selected host cannot provide this boundary, do not claim cross-surface atomicity; resolve the hosting design before implementation approval.

**Unpublish:** only Motion Media can request an audited release removing the identity and updating every affected list/map/link. Preserve its approved history; handle its destination route with the agreed unavailable/404 policy. An editor's rejection or draft deletion must never unpublish a live revision. Previously downloaded/browser-cached content and third-party embedded media cannot be recalled; define CDN invalidation and urgent rights-takedown procedures before launch.

**Rollback:** Motion Media chooses the last approved published version (or another retained approved published version), sees a release diff, and confirms a reason. Restore the complete prior approved release where possible. For a single-record restore, create a new approved-only manifest using that exact previously published revision and validated dependencies; regenerate all affected outputs together. Record original approval provenance, restoring actor/time and the new release event; never rewrite old approval or publication timestamps. A changed payload needs fresh independent review. Block restore of withdrawn/invalid rights or broken dependencies and use unpublish until corrected; do not automatically resurrect unsafe media. Keep current content serving until the restore succeeds.

## 6. CMS alternatives and fit

| Option | Fit and trade-off | Decision |
| --- | --- | --- |
| Current local records plus protected Git review | Simplest vendor footprint and version history; manual media and feedback are awkward. Branch protection alone does not provide client-friendly CMS review, private assets or automatic cross-surface publication guarantees. | Retain during design; not the completed required workflow. |
| Payload plus explicit revision/review/release service | Draft/version and granular access foundations with customizable authoring. Requires backend/database/private storage, secure operations, custom independent approval and immutable audit/release logic. | Provisional preferred candidate; prove the invariants before adoption. |
| Managed headless CMS with native review tooling | May reduce CMS operations and offer review UI, but approval/workflow/audit/history retention may depend on paid tiers. Public/draft isolation and release consistency still need integration and proof. | Obtain current suitable-plan quote/eligibility and compare total cost before selection; no unnamed plan assumed compliant. |

Primary technical sources read **October 20, 2026**:

- [Payload Drafts](https://payloadcms.com/docs/versions/drafts): documents unpublished versions alongside published content, but also explicitly states that `_status: published` can publish even with `draft: true`. Its basic editor query-constraint example blocks editing already published records; it is not this revision workflow. A server-controlled revision/publication boundary is mandatory.
- [Payload Access Control](https://payloadcms.com/docs/access-control/overview): supports operation, collection and field restrictions. This is a framework capability, not evidence that our self-approval, audit or snapshot rules already exist.

No paid pricing, license entitlement, geography, SLA, quota or built-in immutable-audit claim is made here. The attempted repository LICENSE link did not establish commercial terms; license/version verification remains unresolved. A managed product or self-hosted product must pass the same acceptance criteria, not merely advertise 'drafts' or 'roles'.

## 7. Implementation plan — only after approval

1. **Scope and procurement design:** confirm content types/fields, assigned client scope, contributor rule, at least two independent people when Motion Media authors content, account administration, media rights checks, retention, recovery objectives, urgent unpublish expectations and host atomicity. Verify current license/provider terms, pricing, quotas and commercial/geographic eligibility; obtain an itemized vendor/effort estimate. No purchase by default.
2. **Isolated workflow proof:** in a separate non-public environment, prove server-side role enforcement, fork-on-edit, immutable submission/hash, contributor-based self-approval denial, private preview/assets and every API bypass path. Confirm framework-version and Local API behavior; do not rely on UI behavior.
3. **Authoring and review:** model stable identities, versioned categories/media, editable workspaces, immutable submissions, diff/feedback queue, independent decision endpoints and audit/outbox. Provide Client Editor upload/link/submit/feedback screens and Motion Media review/revisions/reject/approve actions.
4. **Publication adapter:** expose only approved projections to a build credential; create versioned manifest, validate dependency closure and consistency, prepare all Astro consumers and atomic release activation. Add approver-only publish/unpublish and auditable restore; retries cannot change the selected revision.
5. **Controlled migration:** inventory existing live/prototype records and 05C.1 drafts separately. Preserve IDs and provenance. Import prototype/unapproved material as private drafts; obtain explicit Motion Media approval for each proposed baseline. Do not fabricate historical reviewer names/timestamps; log migration provenance and new sign-off. Keep the current site untouched until an approved release is ready.
6. **Acceptance and handover:** run the matrix below on an authorized capable environment, verify costs/limits and audit recovery, rehearse rollback/unpublish, train both roles and obtain written launch approval. Only then authorize production cutover; retain old release and documented fallback.

## 8. Required acceptance evidence

These are future checks, **not tests run or passed in this sprint**.

| Requirement | Evidence required before rollout |
| --- | --- |
| 1. Published edits stay pending | Publish A, edit every field into B, submit/request revisions/reject B; public snapshot, API and all surfaces still show A. |
| 2. Approved-only publication | Deny draft/submitted/rejected/changed-after-approval publication through UI, direct API, bulk/import/job and internal-call paths; publish only the exact approved hash. |
| 3. Complete audit | Reconstruct each submission, review decision, approval, publication request/success/failure and restore with authenticated actors and server times; deny editorial tampering. |
| 4. No rejected public content | Probe anonymous IDs, lists, search, history/version, GraphQL relations, preview flags, build artifacts and asset URLs; no rejected payload or private metadata leaks. |
| 5. All material changes reviewed | Change only a coordinate, category label/membership, media file/link/poster/credit or rights evidence; old public versions remain, and new versions require independent approval. |
| 6. Consistent consumers | Activate release B; iMap, destination page and video-category lists agree on IDs/revisions/dependencies. Test partial build/activation failure and old browser caches; never mix releases. |
| 7. Approved rollback | Restore last approved publication across all consumers, retain current pending drafts/audit, block unsafe dependencies, and prove failure leaves current release intact. |
| 8. Permissions/no self-approval | Editor can draft/upload/link/submit/read feedback but cannot approve/publish/unpublish/restore/write live; approver contributor/submitter is denied own approval/publication, including after role changes. |
| Concurrency and recovery | Stale submissions, simultaneous publish/unpublish, role revocation, duplicate jobs, activation/audit interruption and retry cannot skip review or advance stale pointers. |

## 9. Billing, validation and stop point

Design-only incremental configured application vendor fees: **USD $0/month before applicable tax**, assuming no deployed service, new public asset or runtime call. This is not a forecast of the implemented CMS cost. CMS hosting/compute, database, private/public asset storage, media transfer/processing, backups/audit retention, authentication/email, publishing jobs, support/seats and staff effort require a separate estimate; details and low/expected/heavy planning units are in `docs/billing.md`.

Source reasoning and manual document review only. No application code, dependencies, server, tests, build, migrations, CMS configuration or public content changed. Executable validation and PDF generation/layout inspection are deferred under the instance resource policy. After authorization on a capable machine, regenerate the billing PDF using `uv run --with reportlab python scripts/build-billing-brief.py`, render using `pdftoppm -png -r 100 output/pdf/ha-long-billing-brief.pdf /tmp/ha-long-billing-brief`, and visually inspect every page. No CMS test command exists yet; define exact workflow test commands with the implementation rather than claim an unimplemented suite passed.

**STOP: await explicit architecture approval. Do not install, implement, migrate, deploy or publish.**
