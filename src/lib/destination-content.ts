/** Shared content contract only. No sample catalog is migrated by these types.
 * Runtime publication guards remain separate from records and presentation.
 */
import type { Category, Coordinates } from '../data/places.ts';

/** Existing Hanoi IDs stay unchanged. Future catalogs supply their own ID union. */
export type DestinationId =
  | 'ho-hoan-kiem' | 'pho-co' | 'van-mieu'
  | 'hoang-thanh-thang-long' | 'ho-tay' | 'cau-long-bien';
export type CityId = string;
export type ISODate = `${number}-${number}-${number}`;
export type HttpsUrl = `https://${string}`;
export type NonEmpty<T> = readonly [T, ...T[]];
export type PublicationStatus = 'draft' | 'approved';

export interface CityRecord<Id extends CityId = CityId> {
  readonly id: Id;
  readonly name: string;
  readonly englishName?: string;
  readonly countryCode: string;
  /** IANA timezone; validate against the city rather than assuming Hanoi. */
  readonly timeZone: string;
}

export type PrimarySource =
  | Readonly<{ kind: 'official-url'; url: HttpsUrl }>
  | Readonly<{ kind: 'official-document'; reference: string }>;
export interface Verification {
  readonly checkedOn: ISODate;
  readonly checkedBy: string;
  readonly sources: NonEmpty<PrimarySource>;
  readonly reviewAfter?: ISODate;
}
export interface Verified<T> {
  readonly status: 'verified';
  readonly value: T;
  readonly verification: Verification;
}
export interface MediaApproval {
  readonly checkedOn: ISODate;
  readonly approvedBy: string;
  readonly sourceReference: string;
  readonly rightsReference: string;
  readonly usageConditions?: string;
  readonly rightsExpireOn?: ISODate;
}
export type MediaState<T> =
  | Readonly<{ status: 'missing' }>
  | Readonly<{ status: 'draft'; candidate: Partial<T> }>
  | Readonly<{ status: 'pending-verification'; candidate: Partial<T> }>
  | Readonly<{ status: 'verified'; asset: T; approval: MediaApproval }>;

export interface ImageCredit {
  readonly text: string;
  readonly url?: HttpsUrl;
}
export interface DestinationCover<Id extends string = DestinationId, City extends CityId = 'hanoi'> {
  readonly destinationId: Id;
  readonly cityId: City;
  readonly src: string;
  readonly alt: string;
  readonly width: number;
  readonly height: number;
  readonly byteSize: number;
  readonly credit: ImageCredit;
  readonly objectPosition?: string;
}
export interface DestinationVideo<Id extends string = DestinationId, City extends CityId = 'hanoi'> {
  readonly destinationId: Id;
  readonly cityId: City;
  readonly scope: 'destination-specific';
  readonly source: Readonly<{
    kind: 'original-file';
    src: string;
    mimeType: 'video/mp4' | 'video/webm';
  }>;
  readonly aspectRatio: readonly [16, 9];
  /** Real encoded dimensions, >=1280×720, not HTML sizing or inferred HD. */
  readonly width: number;
  readonly height: number;
  readonly durationSeconds: number;
  readonly byteSize: number;
  /** A poster has its own approval/rights/credit; never reuse an unapproved image. */
  readonly poster?: MediaState<DestinationCover<Id, City>>;
}
export type TicketPrice =
  | Readonly<{ kind: 'free'; conditions?: string }>
  | Readonly<{ kind: 'priced'; amount: number; currency: string; unit: string;
      taxTreatment: 'included' | 'excluded' | 'not-stated'; conditions?: string }>
  | Readonly<{ kind: 'check-official-source'; note: string }>;
export interface DestinationPracticalInformation {
  readonly address?: Verified<string>;
  readonly openingHours?: Verified<Readonly<{ timeZone: string; summary: string; exceptions?: string }>>;
  readonly ticketPrice?: Verified<TicketPrice>;
  readonly recommendedVisitDuration?: Verified<Readonly<{ minMinutes: number; maxMinutes?: number }>>;
  readonly bestTimeToVisit?: Verified<string>;
  readonly accessibility?: Verified<string>;
  readonly transportAdvice?: Verified<string>;
  readonly officialWebsite?: Verified<HttpsUrl>;
  readonly directionsLink?: Verified<HttpsUrl>;
}
export interface DestinationRecord<Id extends string = DestinationId, City extends CityId = 'hanoi', RelatedIds extends string = DestinationId> {
  readonly id: Id;
  readonly cityId: City;
  readonly publicationStatus: PublicationStatus;
  readonly slug: string;
  readonly name: string;
  readonly englishName?: string;
  readonly aliases?: readonly string[];
  readonly category: Category;
  readonly coordinates: Readonly<Coordinates>;
  readonly coordinateMeaning: 'approximate-editorial-pin';
  readonly introduction: string;
  readonly cover: MediaState<DestinationCover<Id, City>>;
  readonly video: MediaState<DestinationVideo<Id, City>>;
  readonly practical?: DestinationPracticalInformation;
  /** Same-city IDs by default; cross-city discovery is not implemented. */
  readonly relatedDestinationIds?: readonly RelatedIds[];
  readonly lastVerifiedOn?: ISODate;
  readonly prototypeNotes?: readonly string[];
}
export type DestinationCatalog<Ids extends string = DestinationId, City extends CityId = 'hanoi'> = {
  readonly [Id in Ids]: DestinationRecord<Id, City, Ids>;
};
export type PublishedDestination<Id extends string = DestinationId, City extends CityId = 'hanoi', RelatedIds extends string = DestinationId> =
  Omit<DestinationRecord<Id, City, RelatedIds>, 'cover' | 'video' | 'prototypeNotes' | 'publicationStatus'> & {
    readonly publicationStatus: 'approved';
    readonly cover: Extract<MediaState<DestinationCover<Id, City>>, { status: 'verified' }>;
    readonly video: Extract<MediaState<DestinationVideo<Id, City>>, { status: 'verified' }>;
  };
