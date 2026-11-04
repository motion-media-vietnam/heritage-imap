import type { Map as LeafletMap, Marker } from 'leaflet';

const root = document.querySelector<HTMLElement>('[data-national-map]');
if (root) {
  const canvas = root.querySelector<HTMLElement>('[data-map-canvas]')!;
  const cards = root.querySelector<HTMLElement>('[data-map-cards]')!;
  const pending = root.querySelector<HTMLElement>('[data-map-pending]')!;
  const load = root.querySelector<HTMLButtonElement>('[data-map-load]')!;
  const reset = root.querySelector<HTMLButtonElement>('[data-map-reset]')!;
  const touch = root.querySelector<HTMLButtonElement>('[data-map-touch]')!;
  const error = root.querySelector<HTMLElement>('[data-map-error]')!;
  const links = [...root.querySelectorAll<HTMLAnchorElement>('[data-map-destination]')];
  const panels = [...cards.querySelectorAll<HTMLElement>('[data-map-card]')];
  const markers = new Map<string, Marker>();
  const mobile = matchMedia('(max-width: 780px), (pointer: coarse)');
  let map: LeafletMap | undefined;
  let loading = false;
  let active = links[0]?.dataset.mapDestination ?? '';
  let touchEnabled = false;
  let resetView: (() => void) | undefined;

  function select(id: string) {
    if (!links.some(link => link.dataset.mapDestination === id)) return false;
    active = id;
    for (const panel of panels) panel.hidden = panel.dataset.mapCard !== id;
    for (const link of links) {
      if (link.dataset.mapDestination === id) link.setAttribute('aria-current', 'true');
      else link.removeAttribute('aria-current');
    }
    for (const [key, marker] of markers) {
      marker.getElement()?.classList.toggle('is-selected', key === id);
      marker.setZIndexOffset(key === id ? 500 : 0);
    }
    return true;
  }

  function applyHash() {
    if (!location.hash.startsWith('#destination-')) return false;
    return select(location.hash.slice('#destination-'.length));
  }

  function focusCardOnMobile() {
    if (mobile.matches) cards.scrollIntoView({ block: 'nearest' });
  }

  function applyGestures() {
    if (!map) return;
    touch.hidden = !mobile.matches;
    if (!mobile.matches || touchEnabled) map.dragging.enable();
    else map.dragging.disable();
    if (touchEnabled && mobile.matches) map.touchZoom.enable();
    else map.touchZoom.disable();
    touch.setAttribute('aria-pressed', String(touchEnabled));
    touch.textContent = (touchEnabled ? touch.dataset.disable : touch.dataset.enable) ?? '';
  }

  async function initMap() {
    if (map || loading) return;
    loading = true;
    load.disabled = true;
    error.hidden = true;
    try {
      const [L] = await Promise.all([import('leaflet'), import('leaflet/dist/leaflet.css')]);
      const instance = L.map(canvas, {
        zoomSnap: 0.25, zoomControl: false, scrollWheelZoom: false, touchZoom: false,
        dragging: !mobile.matches, minZoom: 4, maxZoom: 17,
      });
      map = instance;
      resetView = () => instance.fitBounds([[9.45, 102.25], [23.4, 109.85]], { padding: [18, 18] });
      resetView();
      const layer = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        referrerPolicy: 'strict-origin-when-cross-origin',
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      });
      let hasTiles = false;
      layer.on('tileload', () => { hasTiles = true; error.hidden = true; });
      layer.on('tileerror', () => { if (!hasTiles) error.hidden = false; });
      layer.addTo(instance);
      L.control.zoom({ position: 'bottomleft', zoomInTitle: root!.dataset.zoomIn, zoomOutTitle: root!.dataset.zoomOut }).addTo(instance);
      for (const link of links) {
        const { mapDestination: id, lat, lng, name } = link.dataset;
        if (!id) continue;
        const marker = L.marker([Number(lat), Number(lng)], {
          title: name, alt: name,
          icon: L.divIcon({ className: 'n-map-pin', iconSize: [44, 44], iconAnchor: [22, 22], html: '<span></span>' }),
        }).addTo(instance);
        marker.on('click', () => {
          select(id);
          const point = instance.latLngToLayerPoint(marker.getLatLng());
          const overlaps = [...markers.values()].some(other => other !== marker && point.distanceTo(instance.latLngToLayerPoint(other.getLatLng())) < 23);
          if (overlaps && instance.getZoom() < 9) instance.setView(marker.getLatLng(), instance.getZoom() + 2, { animate: false });
        });
        markers.set(id, marker);
      }
      select(active);
      pending.hidden = true;
      reset.hidden = false;
      applyGestures();
    } catch {
      map?.remove();
      map = undefined;
      markers.clear();
      error.hidden = false;
    } finally {
      load.disabled = false;
      loading = false;
    }
  }

  cards.dataset.enhanced = '';
  if (!applyHash()) select(active);
  window.addEventListener('hashchange', () => {
    if (applyHash()) cards.scrollIntoView({ block: 'nearest' });
  });
  links.forEach(link => link.addEventListener('click', event => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const id = link.dataset.mapDestination;
    if (id && select(id)) {
      event.preventDefault();
      focusCardOnMobile();
    }
  }));
  load.hidden = false;
  load.addEventListener('click', () => void initMap());
  reset.addEventListener('click', () => resetView?.());
  touch.addEventListener('click', () => { touchEnabled = !touchEnabled; applyGestures(); });
  mobile.addEventListener('change', applyGestures);

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      if (!entries.some(entry => entry.isIntersecting)) return;
      observer.disconnect();
      void initMap();
    }, { rootMargin: '250px' });
    observer.observe(canvas);
  }
}
