// Controlled real-Leaflet geometry/lifecycle/RAF fixture, NOT a DOM renderer or tile scan.
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import { places } from '../../src/data/places.ts';
import { createNeighborhoodState, filterNeighborhoodPlaces } from '../../src/lib/imap-neighborhood.ts';
import { prototypeFitPadding, prototypeRadiusCamera } from '../../src/lib/imap-prototype-camera.ts';

let clock = 0; let nextFrame = 0;
const frames = new Map();
class Clock extends Date { static now() { return clock; } }
const node = () => ({ style: { transform: '', MozPerspective: '' }, firstChild: { namespaceURI: 'http://www.w3.org/2000/svg' }, getContext() {}, createSVGRect() {} });
const document = { documentElement: node(), createElement: node, createElementNS: node, addEventListener() {}, removeEventListener() {} };
const exports = {};
runInNewContext(readFileSync(new URL('../../node_modules/leaflet/dist/leaflet-src.js', import.meta.url), 'utf8'), {
  exports, module: { exports }, document, Date: Clock,
  navigator: { userAgent: 'MyHanoi controlled Leaflet lifecycle test', platform: 'Linux' },
  window: { document, screen: {}, devicePixelRatio: 1, addEventListener() {}, removeEventListener() {},
    requestAnimationFrame(callback) { frames.set(++nextFrame, callback); return nextFrame; },
    cancelAnimationFrame(id) { frames.delete(id); } },
  setTimeout, clearTimeout, console,
});
const real = exports;

/**
 * @param {string} controller
 * @param {{width?: number, height?: number, radius?: import('../../src/lib/imap-neighborhood.ts').DiscoveryRadius, query?: string, mobile?: boolean, sheetHeight?: number, toolbarBottom?: number, bottomOverlayHeight?: number, exercise?: (context: any) => void | Promise<void>}} [options]
 */
export async function probePrototypeInitialization(controller, options = {}) {
  frames.clear(); clock = 0;
  const width = options.width ?? 960; const height = options.height ?? 640;
  const portion = (start, end) => { const begin = controller.indexOf(start); return controller.slice(begin, controller.indexOf(end, begin)); };
  const functions = portion('function resizeMap()', 'function paintSheetHeight(')
    + portion('function updateCircle()', 'function resetView()')
    + portion('function resize()', 'for (const button of directory)')
    + portion('async function connect()', "on(retry, 'click'").replace("await import('leaflet')", 'await loadLeaflet()');
  const evidence = { leafletVersion: real.version, browserVerified: false, errors: /** @type {string[]} */ ([]), tileLayerAdds: 0,
    markerCandidates: /** @type {string[]} */ ([]), filterCalls: 0, fitCalls: 0, viewCalls: 0, flightCalls: 0, container: { x: width, y: height },
    fittedBounds: /** @type {Array<{lat: number, lng: number}>} */ ([]),
    fitOptions: /** @type {import('../../src/lib/imap-prototype-camera.ts').PrototypeFitOptions | undefined} */ (undefined),
    fittedPixels: { minX: 0, maxX: 0, minY: 0, maxY: 0 }, fittedZoom: 0,
    focusPixel: { x: 0, y: 0 }, cameraCenter: { lat: 0, lng: 0 },
    status: '', retryOffered: false, initializationCompleted: false };
  const renderer = { options: { tolerance: 0 }, _initPath() {}, _addPath() {}, _updateCircle() {}, _removePath() {} };
  function makeMap(_id, mapOptions) {
    const map = Object.create(real.Map.prototype);
    Object.assign(map, {
      options: { crs: real.CRS.EPSG3857, minZoom: 0, maxZoom: 19, ...mapOptions }, _layers: {}, _zoomBoundLayers: {}, _loaded: false,
      _container: { clientWidth: width, clientHeight: height }, _mapPane: { _leaflet_pos: real.point(0, 0) },
      getRenderer() { return renderer; },
      setView(center, zoom) {
        evidence.viewCalls++; this._stop();
        const first = !this._loaded; const zoomChanged = this._zoom !== zoom;
        this._loaded = true; this._moveStart(zoomChanged); this._move(real.latLng(center), zoom); this._moveEnd(zoomChanged);
        if (first) this.fire('load');
        return this;
      },
      fitBounds(bounds, padding) {
        evidence.fitCalls++; evidence.fittedBounds = [bounds.getSouthWest(), bounds.getNorthEast()]; evidence.fitOptions = padding;
        const target = this._getBoundsCenterZoom(bounds, padding);
        return this.setView(target.center, target.zoom);
      },
      flyTo(center, zoom, motion) { evidence.flightCalls++; return real.Map.prototype.flyTo.call(this, center, zoom, motion); },
      remove() { this._stop(); this._layers = {}; this._loaded = false; return this; },
    });
    return map;
  }
  const state = { ...createNeighborhoodState(), radius: options.radius ?? 1000, query: options.query ?? '' };
  const context = {
    places, visible: new Set(filterNeighborhoodPlaces(places, state).map(place => place.slug)),
    cameraIntent: 'discovery', framingCamera: false, cameraFlight: false, cameraReady: false,
    cameraFitOptions: () => prototypeFitPadding({ width, height, toolbarBottom: options.toolbarBottom ?? 60,
      sheetHeight: options.mobile ? options.sheetHeight ?? 52 : 0, bottomOverlayHeight: options.bottomOverlayHeight ?? 20 }, state.radius === 'All' ? 36 : 0),
    prototypeFitPadding,
    prototypeRadiusCamera(map, L, center, radius, padding) {
      const result = prototypeRadiusCamera(map, L, center, radius, padding);
      evidence.fittedBounds = [result.bounds.getSouthWest(), result.bounds.getNorthEast()]; evidence.fitOptions = padding;
      return result;
    },
    mobile: { matches: options.mobile ?? false },
    window: { matchMedia: () => ({ matches: false }), visualViewport: { height }, innerHeight: height },
    document: { documentElement: { style: { setProperty() {} } } }, story: { hidden: true },
    sheetState: 'collapsed', videoHeight: 0, setSheetState() {}, measureStoryFrame: () => 366, keepSelectedVisible() {},
    lifetime: { disposed: false }, connecting: false, map: /** @type {import('leaflet').Map | undefined} */ (undefined), L: undefined,
    radiusCircle: undefined, tiles: undefined, loadingTimeout: undefined,
    state, allowAreaOffer: false, exploreArea: { hidden: true },
    retry: { hidden: true }, status: { textContent: '' }, setTimeout, clearTimeout,
    console: { error: (...args) => evidence.errors.push(String(args[1]?.stack || args[1] || args[0])) },
    clearMarkers() {}, renderMarkers() {}, updateAreaOffer() {},
    filter() { evidence.filterCalls++; evidence.markerCandidates = filterNeighborhoodPlaces(places, context.state).map(place => place.slug); },
    flushFlights() {
      // Actual Leaflet flyTo/_stop/RAF: advance deterministic time, never sleep or fetch tiles.
      for (let i = 0; frames.size && i < 20; i++) {
        clock += 50; const pending = [...frames.values()]; frames.clear(); pending.forEach(callback => callback(clock));
      }
      if (frames.size) throw new Error('Leaflet flight did not settle');
    },
    run(code) { return runInNewContext(code, context, { timeout: 3000 }); },
    async loadLeaflet() {
      return { ...real, map: makeMap, control: { zoom: () => ({ addTo() {} }) },
        tileLayer: () => ({ on() {}, off() {}, addTo() { evidence.tileLayerAdds++; } }),
      };
    },
  };
  await runInNewContext(`${functions}\nconnect();`, context, { timeout: 3000 });
  evidence.initializationCompleted = evidence.tileLayerAdds === 1 && evidence.filterCalls === 1 && evidence.errors.length === 0;
  await options.exercise?.(context);
  const map = context.map;
  if (map && context.cameraReady) {
    evidence.fittedZoom = map.getZoom(); evidence.cameraCenter = map.getCenter(); evidence.focusPixel = map.latLngToContainerPoint(state.center);
    if (evidence.fittedBounds.length) {
      const sw = map.latLngToContainerPoint(evidence.fittedBounds[0]); const ne = map.latLngToContainerPoint(evidence.fittedBounds[1]);
      evidence.fittedPixels = { minX: sw.x, maxX: ne.x, minY: ne.y, maxY: sw.y };
    }
  }
  evidence.status = context.status.textContent; evidence.retryOffered = !context.retry.hidden;
  return evidence;
}
