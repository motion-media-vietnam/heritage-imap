export interface DestinationIdentity {
  readonly id: string;
  readonly name: string;
  readonly language: string;
}

export interface DestinationNavItem {
  readonly path: string;
  readonly label: string;
  readonly header?: { readonly path: string; readonly label?: string };
  readonly highlight?: boolean;
}

export interface DestinationPartner {
  readonly name: string;
  readonly logo?: { readonly src: string; readonly width: number; readonly height: number };
}

export interface DestinationHub extends DestinationIdentity {
  readonly status: 'published';
  readonly languageLabel: string;
  readonly locationLabel: string;
  readonly brand: {
    readonly name: string;
    readonly wordmark: string;
    readonly palette?: Readonly<Partial<Record<'--rice-paper' | '--deep-ink' | '--vermilion' | '--moss' | '--old-gold', string>>>;
    readonly logo: { readonly src: string; readonly width: number; readonly height: number; readonly viewBox: string };
  };
  readonly partners: readonly DestinationPartner[];
  readonly seo: { readonly title: string; readonly description: string };
  readonly navigation: readonly DestinationNavItem[];
  readonly search: { readonly path: string; readonly label: string };
  readonly footer: { readonly eyebrow: string; readonly headline: readonly [string, string]; readonly byline: string };
  readonly placeArtCaption: string;
}

export interface DraftDestination extends DestinationIdentity {
  readonly status: 'draft';
}
