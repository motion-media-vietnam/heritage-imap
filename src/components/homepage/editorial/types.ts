/** Contracts shared by server-rendered editorial components and their controller. */
export type ExperienceCategory = 'nature' | 'culture' | 'night';
export type ExperienceFilter = 'all' | ExperienceCategory;
export type EditorialLayout = 'experiences' | 'food' | 'attractions' | 'tips';

export interface EditorialImage {
  readonly src: string;
  readonly alt: string;
  readonly width: number;
  readonly height: number;
  readonly position: string;
}

export interface EditorialCardData {
  /** Stable identity: copy changes must not disconnect a card from its photo. */
  readonly id: string;
  readonly title: string;
  readonly category: string;
  readonly description: string;
  readonly image?: EditorialImage;
  readonly href?: string;
  readonly pending?: string;
  readonly experienceCategory?: ExperienceCategory;
}

export interface EditorialSectionData {
  readonly id: string;
  readonly headingId: string;
  readonly title: string;
  readonly intro: string;
  readonly kicker: string;
  readonly kind: EditorialLayout;
  readonly cards: readonly EditorialCardData[];
  readonly collectionId?: string;
  readonly allLink?: { readonly href: string; readonly label: string };
}
