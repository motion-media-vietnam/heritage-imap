import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { publishableVideo, publishableCover, publishablePractical, storyMediaState, type StoryVideo, type StoryCover } from '../src/lib/imap-content.ts';
import type { MediaState, MediaApproval, Verified } from '../src/lib/destination-content.ts';

// Synthetic policy fixtures only. These are NOT real files, facts or client approvals.
const now = '2026-10-19';
const approval: MediaApproval = { checkedOn: '2026-10-19', approvedBy: 'test-only',
  sourceReference: 'synthetic-test-only', rightsReference: 'synthetic-test-only' };
const video: StoryVideo = { destinationId: 'van-mieu', cityId: 'hanoi', scope: 'destination-specific',
  source: { kind: 'original-file', src: '/videos/qa-nonexistent.mp4', mimeType: 'video/mp4' },
  aspectRatio: [16, 9], width: 1920, height: 1080, durationSeconds: 60, byteSize: 1000 };
const verified: MediaState<StoryVideo> = { status: 'verified', asset: video, approval };
const image: StoryCover = { destinationId: 'van-mieu', cityId: 'hanoi', src: '/images/qa-nonexistent.webp',
  alt: 'Synthetic test image', width: 1600, height: 900, byteSize: 1000, credit: { text: 'Synthetic test credit' } };

test('only approved destination media is eligible; missing/draft/unverified candidates never become playable', () => {
  assert.equal(publishableVideo(verified, 'approved', 'van-mieu', 'hanoi', now), video);
  assert.equal(publishableVideo(verified, 'draft', 'van-mieu', 'hanoi', now), undefined);
  for (const state of [undefined, { status: 'missing' }, { status: 'draft', candidate: video },
    { status: 'pending-verification', candidate: video }] as Array<MediaState<StoryVideo> | undefined>) {
    assert.equal(publishableVideo(state, 'approved', 'van-mieu', 'hanoi', now), undefined);
  }
  assert.equal(storyMediaState(undefined, 'draft', 'van-mieu', 'hanoi', now), 'missing');
  assert.equal(storyMediaState(verified, 'draft', 'van-mieu', 'hanoi', now), 'draft');
  assert.equal(storyMediaState({ status: 'pending-verification', candidate: video }, 'approved', 'van-mieu', 'hanoi', now), 'unverified');
  assert.equal(storyMediaState(verified, 'approved', 'van-mieu', 'hanoi', now), 'approved');
});

test('media gates reject city/destination mismatch, non-HD formats, unsafe sources and missing rights', () => {
  assert.equal(publishableVideo(verified, 'approved', 'ho-tay', 'hanoi', now), undefined);
  assert.equal(publishableVideo(verified, 'approved', 'van-mieu', 'another-city', now), undefined);
  for (const asset of [
    { ...video, width: 640, height: 360 }, { ...video, width: 1080, height: 1920 },
    { ...video, durationSeconds: 0 }, { ...video, byteSize: 0 },
    { ...video, source: { ...video.source, src: 'javascript:alert(1)' } },
    { ...video, source: { ...video.source, src: '//unapproved.invalid/video.mp4' } },
  ]) assert.equal(publishableVideo({ status: 'verified', asset, approval }, 'approved', 'van-mieu', 'hanoi', now), undefined);
  for (const invalid of [
    { ...approval, rightsReference: '' }, { ...approval, approvedBy: '' },
    { ...approval, checkedOn: '2026-02-30' as const }, { ...approval, checkedOn: '2026-10-20' as const },
    { ...approval, rightsExpireOn: '2026-10-18' as const },
  ]) assert.equal(publishableVideo({ ...verified, approval: invalid }, 'approved', 'van-mieu', 'hanoi', now), undefined);
});

test('poster/cover approval and credits are independent of the video approval', () => {
  const approvedImage: MediaState<StoryCover> = { status: 'verified', asset: image, approval };
  assert.equal(publishableCover(approvedImage, 'approved', 'van-mieu', 'hanoi', now), image);
  assert.equal(publishableCover({ status: 'draft', candidate: image }, 'approved', 'van-mieu', 'hanoi', now), undefined);
  assert.equal(publishableCover({ ...approvedImage, asset: { ...image, credit: { text: '' } } }, 'approved', 'van-mieu', 'hanoi', now), undefined);
  assert.equal(publishableCover(approvedImage, 'approved', 'ho-tay', 'hanoi', now), undefined);
  const withDraftPoster = { ...video, poster: { status: 'pending-verification', candidate: image } as const };
  const playable = publishableVideo({ status: 'verified', asset: withDraftPoster, approval }, 'approved', 'van-mieu', 'hanoi', now);
  assert(playable);
  assert.equal(publishableCover(playable.poster, 'approved', 'van-mieu', 'hanoi', now), undefined);
});

test('optional practical copy needs current, non-empty evidence and explicit publication approval', () => {
  const fact: Verified<string> = { status: 'verified', value: 'Synthetic test, not a travel fact', verification: {
    checkedOn: '2026-10-19', checkedBy: 'test-only', sources: [{ kind: 'official-document', reference: 'synthetic-test-only' }],
  } };
  assert.equal(publishablePractical(fact, 'approved', now), fact);
  assert.equal(publishablePractical(fact, 'draft', now), undefined);
  assert.equal(publishablePractical(undefined, 'approved', now), undefined);
  assert.equal(publishablePractical({ ...fact, verification: { ...fact.verification, reviewAfter: '2026-10-18' } }, 'approved', now), undefined);
});

test('published templates keep the approved landscape frame but gate prototype copy and player sources', () => {
  const story = readFileSync(new URL('../src/components/imap/IMapStory.astro', import.meta.url), 'utf8');
  assert(story.includes("contentMode = 'published'") && story.includes("publicationStatus = 'draft'"));
  assert(story.includes("const prototype = contentMode === 'prototype'"));
  assert(story.includes('publishableVideo(videoContent') && story.includes('publishablePractical(practicalContent'));
  assert(story.includes('prototype && <div><strong>VIDEO ĐIỂM ĐẾN'));
  assert(story.includes('data-destination-video') && story.includes('role={!video ? \'img\' : undefined}'));
  assert(story.includes('video ? <video src={video.source.src}'));
  assert(!story.includes('dedicatedVideos') && !story.includes('URLSearchParams'));
});
