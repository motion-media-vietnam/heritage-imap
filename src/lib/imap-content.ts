import type {
  DestinationCover, DestinationVideo, MediaApproval, MediaState, PublicationStatus, Verified,
} from './destination-content.ts';

export type ContentMode = 'published' | 'prototype';
export type StoryMediaState = 'approved' | 'draft' | 'missing' | 'unverified';
export type StoryVideo = DestinationVideo<string, string>;
export type StoryCover = DestinationCover<string, string>;
const text = (value: unknown): value is string => typeof value === 'string' && value.trim().length > 0;
const today = () => new Date().toISOString().slice(0, 10);
function validDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const parsed = new Date(value);
  return Number.isFinite(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value;
}
function httpsUrl(value: unknown) {
  if (!text(value)) return false;
  try { return new URL(value).protocol === 'https:'; } catch { return false; }
}
function assetUrl(value: unknown) {
  return text(value) && ((value.startsWith('/') && !value.startsWith('//') && !value.includes('\\')) || httpsUrl(value));
}
function approved(approval: MediaApproval, on: string) {
  return approval && text(approval.approvedBy) && text(approval.sourceReference) && text(approval.rightsReference)
    && validDate(approval.checkedOn) && approval.checkedOn <= on
    && (!approval.rightsExpireOn || (validDate(approval.rightsExpireOn) && approval.rightsExpireOn >= on));
}
function sameDestination(asset: { destinationId: string; cityId: string }, id: string, city: string) {
  return asset && asset.destinationId === id && asset.cityId === city;
}

/** Fail closed: neither draft nor unverified candidates reach a video src/poster. */
export function publishableVideo(state: MediaState<StoryVideo> | undefined, publication: PublicationStatus,
  id: string, city: string, on = today()): StoryVideo | undefined {
  if (publication !== 'approved' || state?.status !== 'verified' || !approved(state.approval, on)) return;
  const video = state.asset;
  if (!sameDestination(video, id, city) || video.scope !== 'destination-specific'
    || video.source?.kind !== 'original-file' || !assetUrl(video.source.src)
    || !['video/mp4', 'video/webm'].includes(video.source.mimeType)
    || video.aspectRatio?.[0] !== 16 || video.aspectRatio?.[1] !== 9
    || !Number.isInteger(video.width) || !Number.isInteger(video.height)
    || video.width < 1280 || video.height < 720 || video.width * 9 !== video.height * 16
    || !Number.isFinite(video.durationSeconds) || video.durationSeconds <= 0
    || !Number.isInteger(video.byteSize) || video.byteSize <= 0) return;
  return video;
}
export function publishableCover(state: MediaState<StoryCover> | undefined, publication: PublicationStatus,
  id: string, city: string, on = today()): StoryCover | undefined {
  if (publication !== 'approved' || state?.status !== 'verified' || !approved(state.approval, on)) return;
  const image = state.asset;
  if (!sameDestination(image, id, city) || !assetUrl(image.src) || !text(image.alt) || !text(image.credit?.text)
    || (image.credit.url && !httpsUrl(image.credit.url)) || !Number.isInteger(image.width) || image.width <= 0
    || !Number.isInteger(image.height) || image.height <= 0 || !Number.isInteger(image.byteSize) || image.byteSize <= 0) return;
  return image;
}
export function publishablePractical(state: Verified<string> | undefined, publication: PublicationStatus, on = today()) {
  const evidence = state?.verification;
  if (publication !== 'approved' || state?.status !== 'verified' || !text(state.value) || !evidence
    || !text(evidence.checkedBy) || !validDate(evidence.checkedOn) || evidence.checkedOn > on
    || (evidence.reviewAfter && (!validDate(evidence.reviewAfter) || evidence.reviewAfter < on))
    || !evidence.sources?.length || !evidence.sources.every(source => source.kind === 'official-document'
      ? text(source.reference) : source.kind === 'official-url' && httpsUrl(source.url))) return;
  return state;
}
export function storyMediaState(state: MediaState<StoryVideo> | undefined, publication: PublicationStatus,
  id: string, city: string, on = today()): StoryMediaState {
  if (!state || state.status === 'missing') return 'missing';
  if (publication === 'draft' || state.status === 'draft') return 'draft';
  return publishableVideo(state, publication, id, city, on) ? 'approved' : 'unverified';
}
