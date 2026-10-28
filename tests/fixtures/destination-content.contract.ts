/** Compile-only tests for the proposed contract. No destination/media records. */
import type {
  DestinationCatalog,
  DestinationRecord,
  DestinationVideo,
  DestinationCover,
  CityRecord,
  MediaState,
  PublishedDestination,
  Verified,
} from '../../docs/architecture/destination-content.schema.ts';

declare const draft: DestinationRecord<'van-mieu'>;
declare const catalog: DestinationCatalog;
declare const video: DestinationVideo<'van-mieu'>;
declare const pending: Extract<MediaState<typeof video>, { status: 'pending-verification' }>;
declare const published: PublishedDestination<'van-mieu'>;

// @ts-expect-error draft media is not automatically eligible for publication
const cannotPublishDraft: PublishedDestination<'van-mieu'> = draft;
// @ts-expect-error a missing asset cannot acquire playable metadata
const noPlayableMissingAsset: MediaState<typeof video> = { status: 'missing', asset: video };
// @ts-expect-error pending candidates cannot be treated as verified playable assets
const cannotPlayCandidate: typeof video = pending.asset;
// @ts-expect-error a generic Hanoi overview is not an accepted destination-video scope
const noOverview: typeof video.scope = 'city-overview';
// @ts-expect-error portrait media is not accepted for this landscape contract
const noPortrait: typeof video.aspectRatio = [9, 16];
// @ts-expect-error the catalog's media ID must match its destination key
const noCrossDestinationVideo: typeof catalog['ho-tay']['video'] = { status: 'verified', asset: video, approval: published.video.approval };
// @ts-expect-error optional practical facts must carry evidence, not bare copy
const noUnverifiedAddress: NonNullable<typeof draft.practical>['address'] = 'unverified';
// @ts-expect-error verified facts require a non-empty official evidence list
const noEmptyEvidence: Verified<string> = { status: 'verified', value: '', verification: { checkedOn: '2026-10-19', checkedBy: '', sources: [] } };
// @ts-expect-error a video-first published record cannot expose prototype notes
void published.prototypeNotes;

// Type-only future-city examples: no geographic facts or content records.
declare const future: DestinationCatalog<'future-site' | 'other-site', 'future-city'>;
declare const futureCity: CityRecord<'future-city'>;
const futureCityId: 'future-city' = future['future-site'].cityId;
const related: typeof future['future-site']['relatedDestinationIds'] = ['other-site'];
// @ts-expect-error city association cannot be silently changed
const wrongCity: typeof futureCity.id = 'hanoi';
// @ts-expect-error related destinations must belong to the declared catalog IDs
const wrongRelated: typeof future['future-site']['relatedDestinationIds'] = ['unknown-site'];
// @ts-expect-error covers and video posters require a reviewed credit
const noCredit: DestinationCover = { destinationId: 'van-mieu', cityId: 'hanoi', src: '', alt: '', width: 1, height: 1, byteSize: 1 };
// @ts-expect-error draft editorial status cannot be published
const draftPublication: PublishedDestination['publicationStatus'] = 'draft';
void [futureCityId, related, wrongCity, wrongRelated, noCredit, draftPublication];

const playable: DestinationVideo<'van-mieu'> = published.video.asset;
const sameId: 'van-mieu' = catalog['van-mieu'].id;
void [cannotPublishDraft, noPlayableMissingAsset, cannotPlayCandidate, noOverview, noPortrait,
  noCrossDestinationVideo, noUnverifiedAddress, noEmptyEvidence, playable, sameId];
