import type { Map as LeafletMap, Marker, Polyline, CircleMarker } from 'leaflet';
import { landmarkOffsets } from '../lib/national-map-selection';

const root = document.querySelector<HTMLElement>('[data-national-map]');
if (root) {
  const canvas = root.querySelector<HTMLElement>('[data-map-canvas]')!;
  const cards = root.querySelector<HTMLElement>('[data-map-cards]')!;
  const directory = root.querySelector<HTMLElement>('.n-map-directory')!;
  const pending = root.querySelector<HTMLElement>('[data-map-pending]')!;
  const load = root.querySelector<HTMLButtonElement>('[data-map-load]')!;
  const reset = root.querySelector<HTMLButtonElement>('[data-map-reset]')!;
  const restore = root.querySelector<HTMLButtonElement>('[data-map-spotlight-reset]')!;
  const slotLabel = root.querySelector<HTMLElement>('[data-map-spotlight-label]')!;
  const touch = root.querySelector<HTMLButtonElement>('[data-map-touch]')!;
  const error = root.querySelector<HTMLElement>('[data-map-error]')!;
  const links = [...root.querySelectorAll<HTMLAnchorElement>('[data-map-destination]')];
  const panels = [...cards.querySelectorAll<HTMLElement>('[data-map-card]')];
  const markers = new Map<string, Marker>();
  const guides = new Map<string, { line: Polyline; anchor: CircleMarker }>();
  const mobile = matchMedia('(max-width: 780px), (pointer: coarse)');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const initial = root.dataset.initialDestination ?? panels[0]!.dataset.mapCard!;
  let active = initial;
  let map: LeafletMap | undefined;
  let loading = false;
  let focusOnLoad = false;
  let touchEnabled = false;
  let resetView: (() => void) | undefined;

  function select(id: string) {
    const selected = panels.find(panel => panel.dataset.mapCard === id);
    if (!selected) return false;
    active = id;
    root!.dataset.selectedDestination = id;
    for (const panel of panels) panel.hidden = panel !== selected;
    for (const link of links) {
      if (link.dataset.mapDestination === (selected.dataset.province ?? id)) {
        link.setAttribute('aria-current', 'true');
        const details = link.closest('details');
        if (details) details.open = true;
        requestAnimationFrame(() => {
          const row = link.getBoundingClientRect();
          const frame = directory.getBoundingClientRect();
          if (row.top < frame.top || row.bottom > frame.bottom) directory.scrollTop += row.top - frame.top - 8;
        });
      } else link.removeAttribute('aria-current');
    }
    slotLabel.textContent = id === initial ? root!.dataset.initialLabel! : root!.dataset.selectedLabel!;
    restore.hidden = id === initial;
    for (const [key, marker] of markers) {
      const element = marker.getElement();
      element?.classList.toggle('is-selected', key === id);
      element?.setAttribute('aria-pressed', String(key === id));
      marker.setZIndexOffset(key === id ? 3500 : panels.find(panel => panel.dataset.mapCard === key)?.dataset.featured ? 1500 : 0);
    }
    return true;
  }

  function applyHash() {
    return location.hash.startsWith('#destination-') && select(location.hash.slice('#destination-'.length));
  }

  function centerOnSelection() {
    const marker = markers.get(active);
    if (!map || !marker) return;
    map.stop();
    if (!map.hasLayer(marker)) marker.addTo(map);
    map.flyTo(marker.getLatLng(), Math.max(7, Math.min(map.getZoom(), 9)), { animate: !reducedMotion.matches, duration: .65 });
  }

  function focusCardOnMobile() {
    if (mobile.matches) cards.scrollIntoView({ block: 'nearest', behavior: reducedMotion.matches ? 'instant' : 'smooth' });
  }

  function applyGestures() {
    if (!map) return;
    touch.hidden = !mobile.matches;
    if (!mobile.matches || touchEnabled) map.dragging.enable(); else map.dragging.disable();
    if (touchEnabled && mobile.matches) map.touchZoom.enable(); else map.touchZoom.disable();
    touch.setAttribute('aria-pressed', String(touchEnabled));
    touch.textContent = (touchEnabled ? touch.dataset.disable : touch.dataset.enable) ?? '';
  }

  function updateLandmarks() {
    if (!map) return;
    const featured = panels.filter(panel => panel.dataset.featured);
    const points = featured.map(panel => {
      const point = map!.latLngToContainerPoint(markers.get(panel.dataset.mapCard!)!.getLatLng());
      return { id: panel.dataset.mapCard!, x: point.x, y: point.y };
    });
    const size = map.getSize();
    const offsets = landmarkOffsets(points, size.x, size.y, map.getZoom() < 7);
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
    for (const panel of panels.filter(panel => panel.dataset.localPlace)) {
      const marker = markers.get(panel.dataset.mapCard!)!;
      const visible = map.getZoom() >= 7 || active === panel.dataset.mapCard;
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
    try {
      const [L] = await Promise.all([import('leaflet'), import('leaflet/dist/leaflet.css')]);
      const instance = L.map(canvas, { zoomSnap: .25, zoomControl: false, scrollWheelZoom: false, touchZoom: false, dragging: !mobile.matches, minZoom: 4, maxZoom: 17 });
      map = instance;
      resetView = () => { instance.stop(); instance.fitBounds([[8.55, 102.1], [23.45, 110.1]], { padding: [42, 64], animate: false }); updateLandmarks(); };
      instance.fitBounds([[8.55, 102.1], [23.45, 110.1]], { padding: [42, 64], animate: false });
      const layer = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { referrerPolicy: 'strict-origin-when-cross-origin', attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' });
      let hasTiles = false;
      layer.on('tileload', () => { hasTiles = true; error.hidden = true; });
      layer.on('tileerror', () => { if (!hasTiles) error.hidden = false; }); layer.addTo(instance);
      L.control.zoom({ position: 'bottomleft', zoomInTitle: root!.dataset.zoomIn, zoomOutTitle: root!.dataset.zoomOut }).addTo(instance);
      for (const panel of panels) {
        const { mapCard: id, lat, lng, name, featured, contentReady, localPlace } = panel.dataset;
        if (!id) continue;
        const marker = L.marker([Number(lat), Number(lng)], {
          title: name, alt: name, keyboard: true,
          icon: L.divIcon({ className: 'n-map-pin ' + (featured ? 'n-map-pin--featured' : 'n-map-pin--secondary') + (contentReady ? ' has-content' : ''),
            iconSize: featured ? [52, 64] : [30, 30], iconAnchor: featured ? [26, 64] : [15, 15], html: iconContent(panel) }),
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
      select(active); updateLandmarks();
      if (focusOnLoad) { centerOnSelection(); focusOnLoad = false; }
      pending.hidden = true; reset.hidden = false; applyGestures();
      let observedWidth = canvas.clientWidth;
      let observedHeight = canvas.clientHeight;
      new ResizeObserver(() => {
        if (canvas.clientWidth === observedWidth && canvas.clientHeight === observedHeight) return;
        observedWidth = canvas.clientWidth; observedHeight = canvas.clientHeight;
        const overview = instance.getZoom() < 7;
        instance.invalidateSize({ animate: false, pan: false });
        if (overview) instance.fitBounds([[8.55, 102.1], [23.45, 110.1]], { padding: [42, 64], animate: false });
        updateLandmarks();
      }).observe(canvas);
    } catch {
      map?.remove(); map = undefined; markers.clear(); guides.clear(); error.hidden = false;
    } finally { load.disabled = false; loading = false; }
  }

  cards.dataset.enhanced = '';
  if (applyHash()) focusOnLoad = true; else select(initial);
  window.addEventListener('hashchange', () => {
    if (!applyHash()) return;
    if (map) centerOnSelection(); else { focusOnLoad = true; void initMap(); }
    cards.scrollIntoView({ block: 'nearest', behavior: reducedMotion.matches ? 'instant' : 'smooth' });
  });
  links.forEach(link => link.addEventListener('click', event => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const id = link.dataset.mapDestination;
    if (!id || !select(id)) return;
    event.preventDefault();
    if (map) centerOnSelection(); else { focusOnLoad = true; void initMap(); }
    focusCardOnMobile();
  }));
  restore.addEventListener('click', () => {
    select(initial); directory.scrollTop = 0;
    const more = root.querySelector<HTMLDetailsElement>('[data-map-directory-more]');
    if (more) more.open = false;
    centerOnSelection();
  });
  load.hidden = false; load.addEventListener('click', () => void initMap());
  reset.addEventListener('click', () => resetView?.());
  touch.addEventListener('click', () => { touchEnabled = !touchEnabled; applyGestures(); });
  mobile.addEventListener('change', applyGestures);
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => { if (entries.some(entry => entry.isIntersecting)) { observer.disconnect(); void initMap(); } }, { rootMargin: '250px' });
    observer.observe(canvas);
  }
}
