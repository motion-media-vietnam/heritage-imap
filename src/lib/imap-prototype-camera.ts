import type * as Leaflet from 'leaflet';

/** Geometry for the isolated prototype; no geographic records or UI styling. */
export interface PrototypeFitOptions {
  paddingTopLeft: [number, number];
  paddingBottomRight: [number, number];
  maxZoom: number;
  animate: false;
}
export interface PrototypeViewport {
  width: number;
  height: number;
  sheetHeight?: number;
  toolbarBottom?: number;
  bottomOverlayHeight?: number;
  clippedTop?: number;
  clippedBottom?: number;
  clippedLeft?: number;
  clippedRight?: number;
}
const positive = (value = 0) => Number.isFinite(value) ? Math.max(0, value) : 0;

/** 24px marker half-size + 12px breathing room, plus attribution above the sheet. */
export function prototypeFitPadding(view: PrototypeViewport, margin = 36): PrototypeFitOptions | undefined {
  if (!Number.isFinite(view.width) || !Number.isFinite(view.height) || view.width <= 0 || view.height <= 0) return;
  const left = positive(view.clippedLeft) + margin;
  const right = positive(view.clippedRight) + margin;
  const top = Math.max(positive(view.clippedTop), positive(view.toolbarBottom)) + margin;
  const bottom = Math.max(positive(view.clippedBottom),
    positive(view.sheetHeight) + positive(view.bottomOverlayHeight ?? 20)) + margin;
  // Do not issue an invalid fit/pan when almost the entire map is obstructed.
  if (view.width - left - right < 2 || view.height - top - bottom < 2) return;
  return { paddingTopLeft: [left, top], paddingBottomRight: [right, bottom], maxZoom: 16, animate: false };
}

/** Independent of rendered Circle pixels/current zoom/marker membership. */
export function prototypeRadiusCamera(map: Leaflet.Map, L: typeof Leaflet,
  center: { lat: number; lng: number }, radius: number, padding: PrototypeFitOptions) {
  const focus = L.latLng(center);
  // Derive angular distance from Leaflet's spherical Earth model (also used by Circle).
  const latitude = radius / L.CRS.Earth.distance(L.latLng(0, 0), L.latLng(1, 0));
  const radians = Math.PI / 180;
  const longitude = Math.abs(center.lat) + latitude >= 90 ? 180
    : Math.asin(Math.sin(latitude * radians) / Math.cos(center.lat * radians)) / radians;
  const bounds = L.latLngBounds([center.lat - latitude, center.lng - longitude],
    [center.lat + latitude, center.lng + longitude]);
  const topLeft = L.point(padding.paddingTopLeft); const bottomRight = L.point(padding.paddingBottomRight);
  const usable = map.getSize().subtract(topLeft).subtract(bottomRight);
  // 10% on each side => circle diameter ~80% of the limiting unobstructed dimension.
  const inset = usable.multiplyBy(.1);
  const zoom = map.getBoundsZoom(bounds, false, topLeft.add(bottomRight).add(inset.multiplyBy(2)));
  // Geographic focus is EXACTLY at the usable rectangle's center, not its bounding-box midpoint.
  const cameraCenter = map.unproject(map.project(focus, zoom).add(bottomRight.subtract(topLeft).divideBy(2)), zoom);
  return { bounds, center: cameraCenter, zoom };
}

/** Minimal pixel pan, without changing zoom; undefined means already visible/impractical. */
export function prototypeMarkerPan(point: { x: number; y: number }, size: { x: number; y: number }, padding: PrototypeFitOptions | undefined): [number, number] | undefined {
  if (!padding || !Number.isFinite(point.x) || !Number.isFinite(point.y)) return;
  const [left, top] = padding.paddingTopLeft;
  const right = size.x - padding.paddingBottomRight[0];
  const bottom = size.y - padding.paddingBottomRight[1];
  if (right < left || bottom < top) return;
  const dx = point.x - Math.max(left, Math.min(right, point.x));
  const dy = point.y - Math.max(top, Math.min(bottom, point.y));
  if (Math.abs(dx) < .01 && Math.abs(dy) < .01) return;
  const outward = (value: number) => value > 0 ? Math.ceil(value) : Math.floor(value);
  return [outward(dx), outward(dy)];
}

/** Frame bottom is measured from the scroller top, including its scroll offset. */
export function prototypeStoryHeight(handle: number, frameBottom: number, contentBottomPadding: number, sheetBorder: number) {
  return Math.ceil(positive(handle) + positive(frameBottom) + positive(contentBottomPadding) + positive(sheetBorder)) + 2;
}
