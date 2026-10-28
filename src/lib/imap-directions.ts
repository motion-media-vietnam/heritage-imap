/** Outbound Google Maps URL only. No API key, geolocation call or routing SDK. */
export function googleWalkingDirections(coordinates?: { lat: number; lng: number } | null): string | undefined {
  if (!coordinates) return;
  const { lat, lng } = coordinates;
  if (!Number.isFinite(lat) || !Number.isFinite(lng) || Math.abs(lat) > 90 || Math.abs(lng) > 180) return;
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${lat},${lng}`)}&travelmode=walking`;
}
