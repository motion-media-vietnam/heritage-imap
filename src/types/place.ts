export type Category = 'Hồ & cảnh quan' | 'Phố & cầu' | 'Di sản';
export type Coordinates = { lat: number; lng: number };
export type Place = {
  slug: string; name: string; vietnamese: string; category: Category;
  coordinates: Coordinates; area: string; description: string; story: string;
  tip: string; visit: string; access: string; art: 'lake' | 'town' | 'temple' | 'citadel' | 'bridge';
};

/** The slug is the stable place ID within its owning destination. */
export type DestinationPlace<City extends string = string> = Place & { readonly cityId: City };
