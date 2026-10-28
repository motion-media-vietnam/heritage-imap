// Controlled runtime diagnostic, NOT a browser or a rendered-map test.
// Runs real Leaflet Map layer/readiness and Circle projection/bounds methods;
// substitutes only DOM feature detection, drawing, controls and tile delivery.
import { readFileSync, writeFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import { places } from '../../../src/data/places.ts';
import { createNeighborhoodState, filterNeighborhoodPlaces } from '../../../src/lib/imap-neighborhood.ts';

const node = () => ({ style: {}, firstChild: { namespaceURI: 'http://www.w3.org/2000/svg' }, getContext() {}, createSVGRect() {} });
const document = { documentElement: { style: {} }, createElement: node, createElementNS: node, addEventListener() {}, removeEventListener() {} };
const exports = {};
runInNewContext(readFileSync('node_modules/leaflet/dist/leaflet-src.js', 'utf8'), {
  exports, module: { exports }, document,
  navigator: { userAgent: 'MyHanoi controlled Leaflet lifecycle test', platform: 'Linux' },
  window: { document, screen: {}, devicePixelRatio: 1, addEventListener() {}, removeEventListener() {} },
  setTimeout, clearTimeout, console,
});
const real = exports;
const controller = readFileSync('src/scripts/imap-prototype.ts', 'utf8');
const portion = (start, end) => controller.slice(controller.indexOf(start), controller.indexOf(end));
const functions = portion('function updateCircle()', 'function resetView()')
  + portion('async function connect()', "on(retry, 'click'").replace("await import('leaflet')", 'await loadLeaflet()');
const evidence = { leafletVersion: real.version, browserVerified: false, errors: [], tileLayerAdds: 0, markerCandidates: [], fitCalls: 0, viewCalls: 0 };
let testMap;
const renderer = { options: { tolerance: 0 }, _initPath() {}, _addPath() {}, _updateCircle() {}, _removePath() {} };
function makeMap() {
  const map = Object.create(real.Map.prototype);
  Object.assign(map, {
    options: { crs: real.CRS.EPSG3857 }, _layers: {}, _zoomBoundLayers: {}, _loaded: false,
    _container: { clientWidth: 960, clientHeight: 640 }, _mapPane: { _leaflet_pos: real.point(0, 0) },
    getRenderer() { return renderer; },
    setView(center, zoom) {
      evidence.viewCalls++; this._zoom = zoom; this._loaded = true;
      this._pixelOrigin = this.project(center).subtract(this.getSize().divideBy(2)).round();
      this.fire('load'); return this;
    },
    fitBounds(bounds) {
      evidence.fitCalls++; evidence.fittedBounds = [bounds.getSouthWest(), bounds.getNorthEast()]; return this;
    },
    remove() { this._layers = {}; this._loaded = false; return this; },
  });
  return map;
}
const context = {
  lifetime: { disposed: false }, connecting: false, map: undefined, L: undefined,
  radiusCircle: undefined, tiles: undefined, loadingTimeout: undefined,
  state: createNeighborhoodState(), allowAreaOffer: false, exploreArea: { hidden: true },
  retry: { hidden: true }, status: { textContent: '' },
  setTimeout, clearTimeout,
  console: { error: (...args) => evidence.errors.push(String(args[1]?.stack || args[1] || args[0])) },
  clearMarkers() {}, renderMarkers() {}, updateAreaOffer() {},
  filter() { evidence.markerCandidates = filterNeighborhoodPlaces(places, context.state).map(place => place.slug); },
  async loadLeaflet() {
    return { ...real, map() { testMap = makeMap(); evidence.container = testMap.getSize(); return testMap; },
      control: { zoom: () => ({ addTo() {} }) },
      tileLayer: () => ({ on() {}, off() {}, addTo() { evidence.tileLayerAdds++; } }),
    };
  },
};
await runInNewContext(`${functions}\nconnect();`, context, { timeout: 3000 });
evidence.status = context.status.textContent;
evidence.retryOffered = !context.retry.hidden;
evidence.initializationCompleted = evidence.tileLayerAdds === 1 && evidence.markerCandidates.length === 2 && evidence.errors.length === 0;
const destination = process.argv[2] || 'output/sprint-04a/repair/runtime-before.json';
writeFileSync(destination, JSON.stringify(evidence, null, 2) + '\n');
console.log(JSON.stringify(evidence, null, 2));
