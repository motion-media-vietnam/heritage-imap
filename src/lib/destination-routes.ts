export interface DestinationRoutes {
  readonly home: string;
  readonly map: string;
}

export function destinationRoutes(destinationId: string): DestinationRoutes {
  return { home: `/${destinationId}/`, map: `/${destinationId}/map/` };
}
