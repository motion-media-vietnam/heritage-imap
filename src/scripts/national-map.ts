import type { Map as LeafletMap, Marker, Polyline, CircleMarker } from 'leaflet';
import { landmarkOffsets } from '../lib/national-map-selection';
import { destinationSearchIndex, type DestinationSearchEntry } from '../data/destinations/search-index';
import { bindMapSearch } from './national-map-search';

const root = document.querySelector<HTMLElement>('[data-national-map]');
if (root) {
  const canvas = root.querySelector<HTMLElement>('[data-map-canvas]')!;
  const directory = root.querySelector<HTMLElement>('.n-map-directory')!;
  const more = root.querySelector<HTMLDetailsElement>('[data-map-directory-more]')!;
  const viewport = root.querySelector<HTMLElement>('.n-map-viewport')!;
  const graphic = root.querySelector<HTMLElement>('[data-map-graphic]')!;
  const overview = root.querySelector<HTMLButtonElement>('[data-map-overview]')!;
  const legend = root.querySelector<HTMLElement>('[data-map-legend]')!;
  const help = root.querySelector<HTMLElement>('[data-map-help]')!;
  const load = root.querySelector<HTMLButtonElement>('[data-map-load]')!;
  const reset = root.querySelector<HTMLButtonElement>('[data-map-reset]')!;
  const selection = root.querySelector<HTMLElement>('[data-map-selection]')!;
  const selectionName = selection.querySelector<HTMLElement>('[data-map-selection-name]')!;
  const selectionHub = selection.querySelector<HTMLAnchorElement>('[data-map-selection-hub]')!;
  const selectionState = selection.querySelector<HTMLElement>('[data-map-selection-state]')!;
  const touch = root.querySelector<HTMLButtonElement>('[data-map-touch]')!;
  const error = root.querySelector<HTMLElement>('[data-map-error]')!;
  const search = root.querySelector<HTMLElement>('[data-map-search]')!;
  const links = [...root.querySelectorAll<HTMLAnchorElement>('[data-map-destination]')];
  const graphicLinks = [...root.querySelectorAll<HTMLAnchorElement>('[data-map-graphic-destination]')];
  const points = new Map([...root.querySelectorAll<HTMLElement>('[data-map-point]')].map(point => [point.dataset.mapPoint!, point]));
  const markers = new Map<string, Marker>();
  const guides = new Map<string, { line: Polyline; anchor: CircleMarker }>();
  const mobile = matchMedia('(max-width: 780px), (pointer: coarse)');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  let active: string | undefined;
  let map: LeafletMap | undefined;
  let leaflet: typeof import('leaflet') | undefined;
  let activePlace: DestinationSearchEntry | undefined;
  let placeMarker: Marker | undefined;
  let loading = false;
  let interactiveRequested = false;
  let focusOnLoad = false;
  let keyboardMapFocus = false;
  let touchEnabled = false;
  let resetView: (() => void) | undefined;

  function focusMapFromKeyboard() {
    if (!keyboardMapFocus) return;
    requestAnimationFrame(() => {
      if (root!.dataset.mapState === 'interactiveMap') canvas.focus({ preventScroll: true });
    });
  }

  function setMode(mode: 'defaultGraphicMap' | 'interactiveMap') {
    const interactive = mode === 'interactiveMap';
    root!.dataset.mapState = mode;
    graphic.inert = interactive;
    graphic.setAttribute('aria-hidden', String(interactive));
    canvas.inert = !interactive;
    canvas.setAttribute('aria-hidden', String(!interactive));
    load.hidden = interactive;
    load.setAttribute('aria-expanded', String(interactive));
    overview.hidden = !interactive;
    legend.hidden = !interactive;
    reset.hidden = !interactive;
    help.textContent = (interactive ? help.dataset.interactiveHelp : help.dataset.discoveryHelp) ?? '';
    applyGestures();
  }

  function explore(id?: string, keyboard = false, place?: DestinationSearchEntry) {
    if (!select(id, place, true)) return;
    interactiveRequested = true;
    focusOnLoad = Boolean(id);
    keyboardMapFocus = keyboard;
    if (loading) return;
    if (!map) { void initMap(); return; }
    setMode('interactiveMap');
    map.invalidateSize({ animate: false, pan: false });
    if (id) centerOnSelection(); else resetView?.();
    focusMapFromKeyboard();
  }

  function clearPlace() {
    placeMarker?.remove();
    placeMarker = undefined;
    activePlace = undefined;
  }

  function select(id?: string, place?: DestinationSearchEntry, revealInDirectory = root!.dataset.mapState === 'interactiveMap') {
    const selected = id ? points.get(id) : undefined;
    if (id && !selected) return false;
    clearPlace();
    activePlace = place;
    active = id;
    if (id) root!.dataset.selectedDestination = id;
    else delete root!.dataset.selectedDestination;
    const hub = selected?.dataset.hub;
    const name = selected?.dataset.name ?? '';
    selectionName.textContent = name;
    selectionName.hidden = Boolean(hub);
    selectionHub.textContent = name;
    selectionHub.hidden = !hub;
    if (hub) selectionHub.href = hub;
    else selectionHub.removeAttribute('href');
    selectionState.textContent = hub ? '' : selection.dataset.upcoming ?? '';
    selectionState.hidden = Boolean(hub);
    selection.hidden = !selected || Boolean(place);
    for (const link of graphicLinks) {
      const current = link.dataset.mapGraphicDestination === id;
      link.classList.toggle('is-selected', current);
      if (current) link.setAttribute('aria-current', 'location'); else link.removeAttribute('aria-current');
    }
    for (const link of links) {
      if (link.dataset.mapDestination === (selected?.dataset.province ?? id)) {
        link.setAttribute('aria-current', 'true');
        if (!revealInDirectory) continue;
        const details = link.closest('details');
        if (details) details.open = true;
        requestAnimationFrame(() => {
          if (active !== id) return;
          const row = link.getBoundingClientRect();
          const frame = directory.getBoundingClientRect();
          if (row.top < frame.top || row.bottom > frame.bottom) directory.scrollTop += row.top - frame.top - 8;
        });
      } else link.removeAttribute('aria-current');
    }
    for (const [key, marker] of markers) {
      const element = marker.getElement();
      element?.classList.toggle('is-selected', key === id);
      element?.setAttribute('aria-pressed', String(key === id));
      marker.setZIndexOffset(key === id ? 3500 : points.get(key)?.dataset.featured ? 1500 : 0);
    }
    return true;
  }

  function mapHashTarget() {
    if (location.hash.startsWith('#place-')) {
      const id = location.hash.slice('#place-'.length);
      const place = destinationSearchIndex.find(item => item.type !== 'destination' && item.id === id);
      if (place) return { id: place.provinceId, place };
    } else if (location.hash.startsWith('#destination-')) {
      const id = location.hash.slice('#destination-'.length);
      if (points.has(id)) return { id, place: undefined };
    }
  }

  function showPlace(place: DestinationSearchEntry) {
    if (!map || !leaflet) return;
    const english = search.dataset.lang === 'en';
    const langIndex = english ? 1 : 0;
    const name = english ? place.nameEn : place.nameVi;
    const province = destinationSearchIndex.find(item => item.id === place.provinceId);
    const content = document.createElement('div');
    const title = document.createElement('strong');
    title.textContent = name;
    const detail = document.createElement('small');
    detail.textContent = place.area?.[langIndex] ?? (english ? province?.nameEn : province?.nameVi) ?? '';
    const description = document.createElement('p');
    description.textContent = place.description[langIndex];
    content.append(title, detail, description);
    if (place.existingContentUrl) {
      const link = document.createElement('a');
      link.href = place.existingContentUrl;
      link.textContent = english ? 'Read on Heritage' : 'Đọc trên Heritage';
      content.append(link);
    }
    const [lat, lng] = place.coordinates;
    map.stop().setView([lat, lng], place.zoom ?? 14, { animate: false });
    placeMarker?.remove();
    placeMarker = leaflet.marker([lat, lng], {
      title: name, alt: name, zIndexOffset: 4500,
      icon: leaflet.divIcon({ className: 'n-map-place-pin', iconSize: [22, 22], iconAnchor: [11, 11], popupAnchor: [0, -13] }),
    }).addTo(map);
    placeMarker.getElement()?.setAttribute('data-map-place-marker', place.id);
    placeMarker.bindPopup(content, { className: 'n-map-place-popup', maxWidth: 235, minWidth: 145, autoPan: false }).openPopup();
  }

  function centerOnSelection() {
    if (activePlace) { showPlace(activePlace); return; }
    const marker = active ? markers.get(active) : undefined;
    if (!map || !marker) return;
    map.stop();
    if (!map.hasLayer(marker)) marker.addTo(map);
    map.flyTo(marker.getLatLng(), Math.max(7, Math.min(map.getZoom(), 9)), { animate: !reducedMotion.matches, duration: .65 });
  }

  function bringMapIntoView() {
    viewport.scrollIntoView({ block: 'start', behavior: reducedMotion.matches ? 'instant' : 'smooth' });
  }

  function applyGestures() {
    const interactive = root!.dataset.mapState === 'interactiveMap';
    touch.hidden = !interactive || !mobile.matches;
    if (!map) return;
    if (!mobile.matches || touchEnabled) map.dragging.enable(); else map.dragging.disable();
    if (touchEnabled && mobile.matches) map.touchZoom.enable(); else map.touchZoom.disable();
    touch.setAttribute('aria-pressed', String(touchEnabled));
    touch.textContent = (touchEnabled ? touch.dataset.disable : touch.dataset.enable) ?? '';
  }

  function updateLandmarks() {
    if (!map) return;
    const featured = [...points].filter(([, point]) => point.dataset.featured);
    const projected = featured.map(([id]) => {
      const position = map!.latLngToContainerPoint(markers.get(id)!.getLatLng());
      return { id, x: position.x, y: position.y };
    });
    const size = map.getSize();
    const offsets = landmarkOffsets(projected, size.x, size.y, map.getZoom() < 7);
    for (const [id, offset] of offsets) {
      const marker = markers.get(id)!;
      const body = marker.getElement()?.querySelector<HTMLElement>('.n-pin-body');
      body?.style.setProperty('--pin-x', offset[0] + 'px');
      body?.style.setProperty('--pin-y', offset[1] + 'px');
      const guide = guides.get(id)!;
      const point = map.latLngToContainerPoint(marker.getLatLng());
      const displaced = map.containerPointToLatLng([point.x + offset[0], point.y + offset[1]]);
      guide.line.setLatLngs([marker.getLatLng(), displaced]);
      guide.line.setStyle({ opacity: offset[0] || offset[1] ? .65 : 0 });
      guide.anchor.setStyle({ opacity: offset[0] || offset[1] ? .8 : 0, fillOpacity: offset[0] || offset[1] ? 1 : 0 });
    }
    for (const [id, point] of points) {
      if (!point.dataset.localPlace) continue;
      const marker = markers.get(id)!;
      const visible = map.getZoom() >= 7 || active === id;
      if (visible && !map.hasLayer(marker)) marker.addTo(map);
      else if (!visible && map.hasLayer(marker)) marker.remove();
    }
  }

  function iconContent(panel: HTMLElement) {
    const body = document.createElement('span');
    if (!panel.dataset.featured) {
      body.className = 'n-map-dot';
      body.setAttribute('aria-hidden', 'true');
      return body;
    }
    body.className = 'n-pin-body';
    const head = document.createElement('span'); head.className = 'n-pin-head';
    const initial = document.createElement('span'); initial.className = 'n-pin-initial'; initial.textContent = panel.dataset.name?.slice(0, 1) ?? 'H';
    head.append(initial);
    const image = document.createElement('img'); image.src = panel.dataset.pinImage!; image.alt = ''; image.width = 48; image.height = 48; image.decoding = 'async';
    image.addEventListener('error', () => image.remove(), { once: true });
    head.append(image);
    const tail = document.createElement('span'); tail.className = 'n-pin-tail';
    const name = document.createElement('span'); name.className = 'n-pin-name'; name.textContent = panel.dataset.name!;
    body.append(head, tail, name); body.setAttribute('aria-hidden', 'true');
    return body;
  }

  async function initMap() {
    if (map || loading) return;
    loading = true; load.disabled = true; error.hidden = true;
    root!.setAttribute('aria-busy', 'true');
    load.querySelector('span')!.textContent = load.dataset.loadingLabel!;
    try {
      const [L] = await Promise.all([import('leaflet'), import('leaflet/dist/leaflet.css')]);
      leaflet = L;
      const instance = L.map(canvas, { zoomSnap: .25, zoomControl: false, scrollWheelZoom: false, touchZoom: false, dragging: !mobile.matches, minZoom: 4, maxZoom: 17 });
      map = instance;
      resetView = () => { instance.closePopup(); instance.stop(); instance.fitBounds([[8.55, 102.1], [23.45, 110.1]], { padding: [42, 64], animate: false }); updateLandmarks(); };
      instance.fitBounds([[8.55, 102.1], [23.45, 110.1]], { padding: [42, 64], animate: false });
      const layer = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { referrerPolicy: 'strict-origin-when-cross-origin', attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' });
      const firstTile = new Promise<void>(resolve => {
        const timeout = window.setTimeout(resolve, 1200);
        layer.once('tileload tileerror', () => { clearTimeout(timeout); resolve(); });
      });
      let hasTiles = false;
      layer.on('tileload', () => { hasTiles = true; error.hidden = true; });
      layer.on('tileerror', () => { if (!hasTiles) error.hidden = false; }); layer.addTo(instance);
      L.control.zoom({ position: 'bottomleft', zoomInTitle: root!.dataset.zoomIn, zoomOutTitle: root!.dataset.zoomOut }).addTo(instance);
      for (const [id, point] of points) {
        const { lat, lng, name, featured, contentReady, localPlace } = point.dataset;
        const marker = L.marker([Number(lat), Number(lng)], {
          title: name, alt: name, keyboard: true,
          icon: L.divIcon({ className: 'n-map-pin ' + (featured ? 'n-map-pin--featured' : 'n-map-pin--secondary') + (contentReady ? ' has-content' : ''),
            iconSize: featured ? [52, 64] : [30, 30], iconAnchor: featured ? [26, 64] : [15, 15], html: iconContent(point) }),
        });
        if (!localPlace) marker.addTo(instance);
        if (!featured) marker.bindTooltip(name ?? '', { direction: 'top', offset: [0, -8], className: 'n-map-tooltip' });
        const bindMarker = () => {
          const element = marker.getElement();
          if (!element) return;
          element.setAttribute('aria-label', name ?? ''); element.setAttribute('data-map-marker', id);
          element.setAttribute('aria-pressed', String(id === active));
          element.classList.toggle('is-selected', id === active);
          marker.setZIndexOffset(id === active ? 3500 : featured ? 1500 : 0);
          if (element.dataset.mapKeyboard) return;
          element.dataset.mapKeyboard = 'true';
          element.addEventListener('keydown', event => {
            if (event.key !== 'Enter' && event.key !== ' ') return;
            event.preventDefault(); event.stopPropagation(); select(id); centerOnSelection();
          });
        };
        marker.on('add', bindMarker); bindMarker();
        marker.on('click', () => { select(id); centerOnSelection(); });
        markers.set(id, marker);
        if (featured) guides.set(id, {
          line: L.polyline([], { color: '#a9905c', weight: 1, opacity: 0, interactive: false }).addTo(instance),
          anchor: L.circleMarker(marker.getLatLng(), { radius: 2, color: '#8e7a50', weight: 1, fillColor: '#fffdf2', fillOpacity: 0, opacity: 0, interactive: false }).addTo(instance),
        });
      }
      instance.on('zoomend moveend', updateLandmarks);
      let landmarkFrame = 0;
      instance.on('zoom move', () => {
        if (landmarkFrame) return;
        landmarkFrame = requestAnimationFrame(() => { landmarkFrame = 0; updateLandmarks(); });
      });
      select(active, activePlace); updateLandmarks();
      await firstTile;
      if (interactiveRequested) {
        setMode('interactiveMap');
        if (focusOnLoad) { centerOnSelection(); focusOnLoad = false; }
        focusMapFromKeyboard();
      }
      let observedWidth = canvas.clientWidth;
      let observedHeight = canvas.clientHeight;
      new ResizeObserver(() => {
        if (root!.dataset.mapState !== 'interactiveMap') return;
        if (canvas.clientWidth === observedWidth && canvas.clientHeight === observedHeight) return;
        observedWidth = canvas.clientWidth; observedHeight = canvas.clientHeight;
        const overview = instance.getZoom() < 7;
        instance.invalidateSize({ animate: false, pan: false });
        if (overview) instance.fitBounds([[8.55, 102.1], [23.45, 110.1]], { padding: [42, 64], animate: false });
        updateLandmarks();
      }).observe(canvas);
    } catch {
      map?.remove(); map = undefined; leaflet = undefined; placeMarker = undefined;
      markers.clear(); guides.clear(); error.hidden = false;
    } finally {
      load.disabled = false; loading = false; root!.removeAttribute('aria-busy');
      load.querySelector('span')!.textContent = load.dataset.label!;
    }
  }

  const resetSearch = bindMapSearch(search, entry => {
    if (entry.type === 'destination') explore(entry.id);
    else explore(entry.provinceId, false, entry);
  });
  function resetForVisit() {
    interactiveRequested = false;
    focusOnLoad = false;
    keyboardMapFocus = false;
    touchEnabled = false;
    map?.stop().closePopup();
    select();
    setMode('defaultGraphicMap');
    resetSearch();
    directory.scrollTop = 0;
    more.open = false;
    error.hidden = true;
  }
  resetForVisit();
  // Old fragments may still locate the map, but never select a point on entry.
  if (mapHashTarget()) root.scrollIntoView({ block: 'start', behavior: 'instant' });
  window.addEventListener('pageshow', event => { if (event.persisted) resetForVisit(); });

  function onMapHash() {
    const target = mapHashTarget();
    if (!target) return;
    explore(target.id, false, target.place);
    bringMapIntoView();
  }
  window.addEventListener('hashchange', onMapHash);
  document.addEventListener('click', event => {
    if (event.defaultPrevented || event.button || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const link = event.target instanceof Element ? event.target.closest('a') : null;
    if (link && link.pathname === location.pathname && link.search === location.search && link.hash === location.hash && mapHashTarget()) {
      event.preventDefault();
      onMapHash();
    }
  });
  links.forEach(link => link.addEventListener('click', event => {
    if (link.dataset.mapHub || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const id = link.dataset.mapDestination;
    if (!id || !points.has(id)) return;
    event.preventDefault();
    explore(id);
    if (mobile.matches) bringMapIntoView();
  }));
  graphicLinks.forEach(link => {
    link.addEventListener('click', event => {
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      select(link.dataset.mapGraphicDestination);
    });
    link.addEventListener('keydown', event => {
      if (event.key !== ' ') return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      select(link.dataset.mapGraphicDestination);
    });
  });
  load.addEventListener('click', event => explore(active, event.detail === 0, activePlace));
  overview.addEventListener('click', () => {
    interactiveRequested = false;
    map?.stop(); touchEnabled = false; error.hidden = true;
    setMode('defaultGraphicMap');
    load.focus({ preventScroll: true });
  });
  reset.addEventListener('click', () => resetView?.());
  touch.addEventListener('click', () => { touchEnabled = !touchEnabled; applyGestures(); });
  mobile.addEventListener('change', applyGestures);
}
