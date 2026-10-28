import { places, demoLocation } from '../data/places';
import { districtPlaceSlugs } from '../data/districts';
import { createInstanceLifetime } from '../lib/imap';
import { selectDestination, sheetStates, type SheetState } from '../lib/imap-prototype';
import { mobileSheetHeight, nearestMobileSheetState } from '../lib/imap-mobile';
import { prototypeFitPadding, prototypeMarkerPan, prototypeStoryHeight, prototypeRadiusCamera } from '../lib/imap-prototype-camera';
import { categoryIconPath, clusterProjectedPoints, createNeighborhoodState, discoveryCategories,
  filterNeighborhoodPlaces, markerCategory, offerDiscoveryArea, parseDiscoveryRadius, resolveDiscoveryLocation,
  type DiscoveryCategory } from '../lib/imap-neighborhood';
import type * as Leaflet from 'leaflet';

const lifetime = createInstanceLifetime();
const on = (target: EventTarget, event: string, callback: EventListener) => target.addEventListener(event, callback, { signal: lifetime.signal });
const explorer = document.querySelector<HTMLElement>('#prototype-explorer')!;
const search = document.querySelector<HTMLInputElement>('#prototype-search')!;
const categorySelect = document.querySelector<HTMLSelectElement>('#prototype-category')!;
const districtSelect = document.querySelector<HTMLSelectElement>('#prototype-district')!;
const radiusSelect = document.querySelector<HTMLSelectElement>('#prototype-radius')!;
const sheet = document.querySelector<HTMLElement>('#prototype-sheet')!;
const story = document.querySelector<HTMLElement>('#prototype-story')!;
const storyLabel = document.querySelector<HTMLElement>('#prototype-story-label')!;
const content = document.querySelector<HTMLElement>('#prototype-story-content')!;
const status = document.querySelector<HTMLElement>('#prototype-map-status')!;
const reopen = document.querySelector<HTMLButtonElement>('#prototype-reopen')!;
const handle = document.querySelector<HTMLElement>('#sheet-handle')!;
const discovery = document.querySelector<HTMLButtonElement>('#prototype-discovery')!;
const exploreArea = document.querySelector<HTMLButtonElement>('#prototype-explore-area')!;
const locate = document.querySelector<HTMLButtonElement>('#prototype-locate')!;
const locationMessage = document.querySelector<HTMLElement>('#prototype-location-message')!;
const centerLabel = document.querySelector<HTMLElement>('#prototype-center-label')!;
const retry = document.querySelector<HTMLButtonElement>('#prototype-retry')!;
const directoryAll = document.querySelector<HTMLButtonElement>('#prototype-directory-all')!;
const mapElement = document.querySelector<HTMLElement>('#prototype-map')!;
const stateButtons = Array.from(document.querySelectorAll<HTMLButtonElement>('button[data-sheet-state]'));
const districtOptions = Array.from(districtSelect.querySelectorAll<HTMLOptionElement>('[data-district-option]'));
const categoryOptions = Array.from(categorySelect.querySelectorAll<HTMLOptionElement>('[data-category-option]'));
const templates = new Map(Array.from(document.querySelectorAll<HTMLTemplateElement>('[data-prototype-story]')).map(template => [template.dataset.prototypeStory!, template]));
const directory = Array.from(document.querySelectorAll<HTMLButtonElement>('[data-select-place]'));
const mobile = window.matchMedia('(max-width: 960px)');
let state = createNeighborhoodState();
let map: Leaflet.Map | undefined;
let L: typeof Leaflet | undefined;
let radiusCircle: Leaflet.Circle | undefined;
let tiles: Leaflet.TileLayer | undefined;
let markers: Leaflet.Marker[] = [];
let connecting = false;
let selected: string | undefined;
let visible = new Set(filterNeighborhoodPlaces(places, state).map(place => place.slug));
let clusterIds: Set<string> | undefined;
let previousFocus: HTMLElement | null = null;
let sheetState: SheetState = 'collapsed';
let videoHeight = 0;
let allowAreaOffer = false;
let cameraIntent: 'discovery' | 'selection' | 'manual' = 'discovery';
let framingCamera = false;
let cameraFlight = false;
let cameraReady = false;
let suppressDiscoveryClick = false;
let loadingTimeout: ReturnType<typeof setTimeout> | undefined;
let drag: { id: number; startY: number; height: number; target: HTMLElement } | undefined;

function measureStoryFrame() {
  const frame = content.querySelector<HTMLElement>('[data-destination-video]');
  if (!frame || story.hidden) return 0;
  const scroller = getComputedStyle(content); const border = getComputedStyle(sheet);
  return prototypeStoryHeight(handle.getBoundingClientRect().height,
    frame.getBoundingClientRect().bottom - content.getBoundingClientRect().top + content.scrollTop,
    parseFloat(scroller.paddingBottom) || 0,
    (parseFloat(border.borderTopWidth) || 0) + (parseFloat(border.borderBottomWidth) || 0));
}
function availableHeight() { return explorer.getBoundingClientRect().height; }
function safeArea() { return parseFloat(getComputedStyle(sheet).paddingBottom) || 0; }
function resizeMap() {
  if (!map || !cameraReady || cameraFlight) return;
  // Preserve center/zoom without replaying a captured (possibly mid-animation) view.
  map.invalidateSize({ pan: true, animate: false });
  renderMarkers();
}
function paintSheetHeight(height: number) {
  sheet.style.setProperty('--sheet-height', `${height}px`);
  explorer.style.setProperty('--sheet-overlay-height', `${height}px`);
}
function setSheetState(next: SheetState) {
  sheetState = next;
  sheet.dataset.sheetState = next;
  explorer.dataset.sheetState = next;
  sheet.classList.remove('is-dragging');
  paintSheetHeight(mobileSheetHeight(next, availableHeight(), videoHeight, safeArea()));
  content.inert = mobile.matches && next === 'collapsed';
  document.querySelector<HTMLElement>('#prototype-directory')!.inert = mobile.matches && (next === 'collapsed' || !story.hidden);
  story.inert = mobile.matches && next === 'collapsed';
  discovery.setAttribute('aria-expanded', String(next !== 'collapsed' && story.hidden));
  for (const button of stateButtons) button.setAttribute('aria-pressed', String(button.dataset.sheetState === next));
}
function syncSelection() {
  for (const button of directory) button.setAttribute('aria-pressed', String(button.dataset.selectPlace === selected));
  renderMarkers();
}
function stopVideo() {
  content.querySelectorAll('video').forEach(video => { video.pause(); video.removeAttribute('src'); video.load(); });
  content.replaceChildren();
}
function openPlace(slug: string, trigger?: HTMLElement) {
  const next = selectDestination(selected, slug, visible);
  const place = places.find(candidate => candidate.slug === slug);
  if (next !== slug || !place || !templates.has(slug)) return;
  if (cameraFlight) { cameraFlight = false; map?.stop(); }
  if (story.hidden) previousFocus = trigger ?? (document.activeElement instanceof HTMLElement ? document.activeElement : null);
  stopVideo(); selected = slug;
  content.append(templates.get(slug)!.content.cloneNode(true));
  content.querySelectorAll('video').forEach(video => { video.autoplay = false; });
  storyLabel.textContent = place.name;
  story.hidden = false; explorer.classList.add('has-story'); reopen.hidden = true; content.scrollTop = 0;
  filter(false);
  videoHeight = 0;
  // Unhide before measuring the title and original landscape frame.
  setSheetState('half');
  videoHeight = measureStoryFrame();
  setSheetState('half');
  cameraIntent = 'selection';
  resizeMap(); keepSelectedVisible();
  content.querySelector<HTMLElement>('h2')?.focus({ preventScroll: true });
}
function closeStory(restoreFocus = true) {
  stopVideo(); story.hidden = true; explorer.classList.remove('has-story'); reopen.hidden = !selected;
  // Selected pin and geographic camera survive closing; no recenter here.
  setSheetState('collapsed');
  if (restoreFocus) {
    const target = previousFocus?.isConnected && previousFocus.getClientRects().length ? previousFocus
      : !reopen.hidden ? reopen : discovery;
    target.focus({ preventScroll: true });
  }
}
function openDirectory(ids?: string[]) {
  closeStory(false); videoHeight = 0;
  clusterIds = ids ? new Set(ids) : undefined;
  filter(false); setSheetState('expanded');
  document.querySelector<HTMLElement>('#prototype-directory')!.focus({ preventScroll: true });
}
function filter(resetCluster = true) {
  if (resetCluster) clusterIds = undefined;
  state.query = search.value; state.category = categorySelect.value as DiscoveryCategory | 'All'; state.district = districtSelect.value;
  const districtCandidates = filterNeighborhoodPlaces(places, { ...state, district: 'All' });
  for (const option of districtOptions) {
    const count = districtCandidates.filter(place => (districtPlaceSlugs[option.value] ?? []).includes(place.slug)).length;
    option.hidden = count === 0 && districtSelect.value !== option.value;
    option.textContent = `${option.value} · ${count}`;
  }
  const categoryCandidates = filterNeighborhoodPlaces(places, { ...state, category: 'All' });
  for (const option of categoryOptions) {
    const metadata = discoveryCategories.find(category => category.id === option.value)!;
    option.textContent = `${metadata.label} · ${categoryCandidates.filter(place => markerCategory(place) === option.value).length}`;
  }
  visible = new Set(filterNeighborhoodPlaces(places, state).map(place => place.slug));
  if (clusterIds && !Array.from(clusterIds).some(id => visible.has(id))) clusterIds = undefined;
  let listed = 0;
  for (const button of directory) {
    const shown = visible.has(button.dataset.selectPlace!) && (!clusterIds || clusterIds.has(button.dataset.selectPlace!));
    button.closest<HTMLElement>('li')!.hidden = !shown;
    if (shown) listed++;
  }
  if (selected && !visible.has(selected)) { closeStory(false); selected = undefined; reopen.hidden = true; }
  document.querySelector('#prototype-count')!.textContent = `${visible.size} địa điểm`;
  discovery.textContent = `Khám phá ${visible.size} địa điểm`;
  document.querySelector('#directory-heading')!.textContent = clusterIds ? `${listed} địa điểm trong cụm` : 'Chọn câu chuyện';
  directoryAll.hidden = !clusterIds;
  document.querySelector<HTMLElement>('#prototype-empty')!.hidden = listed !== 0;
  content.querySelectorAll<HTMLButtonElement>('[data-nearby-place]').forEach(button => {
    button.disabled = !visible.has(button.dataset.nearbyPlace!);
    button.title = button.disabled ? 'Địa điểm ngoài bộ lọc hiện tại' : '';
  });
  syncSelection();
}
function createCategoryIcon(category: DiscoveryCategory) {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  for (const [key, value] of Object.entries({ width: '20', height: '20', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '1.6', 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'aria-hidden': 'true', focusable: 'false' })) svg.setAttribute(key, value);
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute('d', categoryIconPath(category)); svg.append(path);
  return svg;
}
function clearMarkers() {
  for (const marker of markers) { const element = marker.getElement(); if (element) element.onkeydown = null; marker.off(); marker.remove(); }
  markers = [];
}
function renderMarkers() {
  if (!map || !L) return;
  clearMarkers();
  const candidates = places.filter(place => visible.has(place.slug));
  const groups = clusterProjectedPoints(candidates.map(place => ({ id: place.slug, ...map!.latLngToContainerPoint([place.coordinates.lat, place.coordinates.lng]) })));
  for (const group of groups) {
    const ids = group.map(point => point.id);
    const selectedInGroup = selected !== undefined && ids.includes(selected);
    const place = places.find(place => place.slug === (selectedInGroup ? selected : ids[0]))!;
    const clustered = group.length > 1;
    const pin = document.createElement('span'); pin.className = 'curated-pin'; pin.dataset.category = clustered ? 'cluster' : markerCategory(place);
    pin.append(createCategoryIcon(markerCategory(place)));
    if (clustered) { const count = document.createElement('span'); count.className = 'cluster-count'; count.textContent = String(group.length); pin.append(count); }
    const label = document.createElement('span'); label.textContent = selectedInGroup ? place.name : clustered ? `${group.length} địa điểm gần nhau` : place.name;
    const marker = L.marker([place.coordinates.lat, place.coordinates.lng], {
      title: clustered ? `${group.length} địa điểm · Mở danh sách cụm` : place.name,
      icon: L.divIcon({ className: `curated-icon${selectedInGroup ? ' is-selected' : ''}`, html: pin, iconSize: [48, 48], iconAnchor: [24, 24] }),
      zIndexOffset: selectedInGroup ? 500 : 0,
    }).bindTooltip(label, { direction: 'top', permanent: selectedInGroup });
    marker.on('click', () => clustered ? openDirectory(ids) : openPlace(place.slug, marker.getElement()));
    marker.on('add', () => {
      const element = marker.getElement();
      element?.setAttribute('role', 'button');
      element?.setAttribute('aria-label', clustered ? `${group.length} địa điểm gần nhau. Mở danh sách cụm${selectedInGroup ? `. Đang chọn ${place.name}` : ''}` : `Mở câu chuyện ${place.name} · ${discoveryCategories.find(category => category.id === markerCategory(place))!.label}`);
      element?.setAttribute('aria-pressed', String(selectedInGroup));
      if (element) element.onkeydown = event => { if (event.key === ' ') { event.preventDefault(); marker.fire('click'); } };
    });
    marker.addTo(map); markers.push(marker);
  }
}
function cameraFitOptions(marker = false) {
  if (!map) return;
  const size = map.getSize(); const rect = mapElement.getBoundingClientRect();
  const viewport = window.visualViewport;
  const top = viewport?.offsetTop ?? 0; const left = viewport?.offsetLeft ?? 0;
  const toolbar = document.querySelector<HTMLElement>('.map-toolbar');
  const zoom = document.querySelector<HTMLElement>('.map-column .leaflet-control-zoom');
  const toolbarBottom = Math.max(0,
    toolbar && getComputedStyle(toolbar).visibility !== 'hidden' ? toolbar.getBoundingClientRect().bottom - rect.top : 0,
    zoom ? zoom.getBoundingClientRect().bottom - rect.top : 0);
  const bottomOverlayHeight = getComputedStyle(status).visibility !== 'hidden'
    ? Math.max(20, 28 + status.getBoundingClientRect().height) : 20;
  return prototypeFitPadding({ width: size.x, height: size.y, toolbarBottom, bottomOverlayHeight,
    sheetHeight: mobile.matches ? mobileSheetHeight(sheetState, availableHeight(), videoHeight, safeArea()) : 0,
    clippedTop: Math.max(0, top - rect.top), clippedLeft: Math.max(0, left - rect.left),
    clippedBottom: Math.max(0, rect.bottom - top - (viewport?.height ?? window.innerHeight)),
    clippedRight: Math.max(0, rect.right - left - (viewport?.width ?? window.innerWidth)) },
    marker || state.radius === 'All' ? 36 : 0);
}
function keepSelectedVisible() {
  if (!map || cameraFlight || !selected || story.hidden || cameraIntent !== 'selection') return;
  const place = places.find(place => place.slug === selected);
  if (!place) return;
  const offset = prototypeMarkerPan(map.latLngToContainerPoint(place.coordinates), map.getSize(), cameraFitOptions(true));
  if (offset) map.panBy(offset, { animate: false });
}
function updateCircle() {
  radiusCircle?.remove(); radiusCircle = undefined;
  if (map && L && state.radius !== 'All') radiusCircle = L.circle([state.center.lat, state.center.lng], {
    radius: state.radius, color: '#687367', weight: 1, dashArray: '4 6', fillOpacity: .025, interactive: false,
  }).addTo(map);
}
function focusDiscovery(animate = false) {
  if (!map || !L) return;
  allowAreaOffer = false; exploreArea.hidden = true;
  if (cameraFlight) {
    cameraFlight = false; framingCamera = true; map.stop(); framingCamera = false;
    resizeMap();
  }
  const options = cameraFitOptions();
  if (!options) return;
  cameraIntent = 'discovery'; framingCamera = true;
  try {
    // flyTo uses a cancellable RAF, not Leaflet's queued CSS zoom transition.
    const motion = animate && !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (state.radius === 'All') {
      const eligible = places.filter(place => visible.has(place.slug));
      if (!eligible.length) return; // Empty All leaves the existing camera alone.
      const bounds = L.latLngBounds(eligible.map(place => place.coordinates));
      cameraFlight = motion;
      if (motion) map.flyToBounds(bounds, { ...options, animate: true, duration: .4 });
      else map.fitBounds(bounds, options);
    } else {
      const target = prototypeRadiusCamera(map, L, state.center, state.radius, options);
      cameraFlight = motion;
      if (motion) map.flyTo(target.center, target.zoom, { animate: true, duration: .4 });
      else map.setView(target.center, target.zoom, { animate: false });
    }
    cameraReady = true;
  } finally { framingCamera = false; }
}
function manualCamera() {
  allowAreaOffer = true; cameraIntent = 'manual';
  if (cameraFlight) { cameraFlight = false; map?.stop(); }
}
function resetView() {
  state = { ...state, center: { ...demoLocation }, radius: 1000 }; radiusSelect.value = '1000';
  centerLabel.textContent = 'Trung tâm: Hồ Hoàn Kiếm'; locationMessage.textContent = '';
  updateCircle(); filter(); focusDiscovery();
}
function updateAreaOffer() {
  if (!map || !allowAreaOffer) return;
  exploreArea.hidden = !offerDiscoveryArea(state.center, map.getCenter());
}
function resize() {
  document.documentElement.style.setProperty('--prototype-viewport-height', `${window.visualViewport?.height ?? window.innerHeight}px`);
  if (!story.hidden) videoHeight = measureStoryFrame();
  setSheetState(sheetState); resizeMap();
  // Layout events never refit a radius or overwrite a chosen zoom.
  keepSelectedVisible();
}

for (const button of directory) on(button, 'click', () => openPlace(button.dataset.selectPlace!, button));
on(content, 'click', event => {
  const button = event.target instanceof Element ? event.target.closest<HTMLButtonElement>('[data-nearby-place]') : null;
  if (button && !button.disabled) openPlace(button.dataset.nearbyPlace!);
});
on(document.querySelector('#prototype-close')!, 'click', () => closeStory());
on(reopen, 'click', () => { if (selected) openPlace(selected, reopen); });
on(directoryAll, 'click', () => {
  clusterIds = undefined; filter(false);
  document.querySelector<HTMLElement>('#prototype-directory')!.focus({ preventScroll: true });
});
on(discovery, 'click', () => { if (suppressDiscoveryClick) { suppressDiscoveryClick = false; return; } openDirectory(); });
on(document, 'keydown', event => {
  if (!(event instanceof KeyboardEvent) || event.key !== 'Escape') return;
  const fullscreenVideo = content.querySelector<HTMLVideoElement & { webkitDisplayingFullscreen?: boolean }>('video');
  if (document.fullscreenElement || fullscreenVideo?.webkitDisplayingFullscreen) return;
  if (!story.hidden) closeStory();
  else if (mobile.matches && sheetState !== 'collapsed') { setSheetState('collapsed'); discovery.focus({ preventScroll: true }); }
});
on(document.querySelector('.skip')!, 'click', event => { event.preventDefault(); openDirectory(); });
on(search, 'input', () => filter()); on(categorySelect, 'change', () => filter()); on(districtSelect, 'change', () => filter());
on(radiusSelect, 'change', () => {
  state.radius = parseDiscoveryRadius(radiusSelect.value);
  closeStory(false); // An explicit radius choice returns to compact map exploration.
  updateCircle(); filter(); resizeMap(); focusDiscovery(true);
});
for (const button of stateButtons) on(button, 'click', () => {
  const next = button.dataset.sheetState as SheetState;
  if (next === 'collapsed') { closeStory(false); discovery.focus({ preventScroll: true }); }
  else if (sheetStates.includes(next)) { setSheetState(next); keepSelectedVisible(); }
});
on(handle, 'pointerdown', event => {
  if (!(event instanceof PointerEvent) || !mobile.matches || event.button !== 0) return;
  const button = event.target instanceof Element ? event.target.closest('button') : null;
  if (button && button !== discovery) return;
  suppressDiscoveryClick = false;
  const target = button === discovery ? discovery : handle;
  drag = { id: event.pointerId, startY: event.clientY, height: sheet.getBoundingClientRect().height, target };
  target.setPointerCapture(event.pointerId); sheet.classList.add('is-dragging');
});
on(handle, 'pointermove', event => {
  if (!(event instanceof PointerEvent) || !drag || drag.id !== event.pointerId) return;
  paintSheetHeight(Math.max(mobileSheetHeight('collapsed', availableHeight(), videoHeight, safeArea()), Math.min(mobileSheetHeight('expanded', availableHeight(), videoHeight, safeArea()), drag.height + drag.startY - event.clientY)));
});
function endDrag(event: Event) {
  if (!(event instanceof PointerEvent) || !drag || event.pointerId !== drag.id) return;
  const delta = drag.startY - event.clientY;
  if (drag.target.hasPointerCapture(event.pointerId)) drag.target.releasePointerCapture(event.pointerId);
  drag = undefined; suppressDiscoveryClick = Math.abs(delta) > 8;
  if (event.type === 'pointercancel') { setSheetState(sheetState); return; }
  if (sheetState === 'collapsed' && delta > 16) { openDirectory(); return; }
  const next = nearestMobileSheetState(sheet.getBoundingClientRect().height, availableHeight(), videoHeight, safeArea());
  if (next === 'collapsed') closeStory(false);
  else { setSheetState(next); keepSelectedVisible(); }
}
on(handle, 'pointerup', endDrag); on(handle, 'pointercancel', endDrag);
on(window, 'resize', resize); on(mobile, 'change', resize);
if (window.visualViewport) on(window.visualViewport, 'resize', resize);
on(sheet, 'transitionend', event => {
  if (event.target === sheet) { resizeMap(); keepSelectedVisible(); }
});
on(document.querySelector('#prototype-reset')!, 'click', resetView);
// Leaflet stops a flight on pointer-down even if no drag follows. Clear our
// flight guard first, so a simple tap cannot leave layout updates suspended.
for (const event of ['pointerdown', 'mousedown', 'touchstart']) on(mapElement, event, () => {
  if (cameraFlight) manualCamera();
});
on(mapElement, 'keydown', event => {
  if (event instanceof KeyboardEvent && ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
    manualCamera();
  }
});
on(exploreArea, 'click', () => {
  if (!map) return;
  state = resolveDiscoveryLocation(state, { kind: 'success', center: map.getCenter() });
  if (state.radius === 'All') { state.radius = 1000; radiusSelect.value = '1000'; }
  centerLabel.textContent = 'Trung tâm: khu vực đang khám phá'; allowAreaOffer = false; exploreArea.hidden = true;
  cameraIntent = 'manual';
  updateCircle(); filter(); // Explicitly accept this center without moving the camera.
});
on(locate, 'click', () => {
  if (!navigator.geolocation || !window.isSecureContext) { locationMessage.textContent = 'Định vị cần HTTPS hoặc localhost. Bạn vẫn có thể kéo bản đồ và chọn khu vực.'; return; }
  locate.disabled = true; locationMessage.textContent = 'Đang xác định vị trí… Bạn vẫn có thể khám phá thủ công.';
  navigator.geolocation.getCurrentPosition(position => {
    if (lifetime.disposed) return;
    const next = resolveDiscoveryLocation(state, { kind: 'success', center: { lat: position.coords.latitude, lng: position.coords.longitude } });
    locate.disabled = false;
    if (next === state) { locationMessage.textContent = 'Chưa xác định được vị trí hợp lệ. Khu vực hiện tại được giữ nguyên.'; return; }
    state = next; centerLabel.textContent = 'Trung tâm: vị trí gần đúng của bạn';
    locationMessage.textContent = 'Đã đổi trung tâm khám phá. Vị trí không được lưu.';
    updateCircle(); filter(); focusDiscovery();
  }, error => {
    if (lifetime.disposed) return;
    state = resolveDiscoveryLocation(state, { kind: error.code === 1 ? 'denied' : 'error' });
    locate.disabled = false; locationMessage.textContent = 'Chưa có quyền hoặc chưa xác định được vị trí. Khu vực hiện tại được giữ nguyên; tiếp tục kéo bản đồ hoặc dùng bộ lọc.';
  }, { enableHighAccuracy: false, timeout: 10000, maximumAge: 60000 });
});

async function connect() {
  if (lifetime.disposed || connecting || map) return;
  connecting = true; retry.hidden = true; status.textContent = 'Đang tải bản đồ…';
  try {
    L = await import('leaflet');
    if (lifetime.disposed) return;
    map = L.map('prototype-map', { scrollWheelZoom: false, zoomControl: false, zoomSnap: 0, zoomAnimation: false });
    // Establish the geographic view before projecting the circle or requesting tiles.
    // No arbitrary seed zoom and no second initialization/resize fit.
    L.control.zoom({ position: 'topright', zoomInTitle: 'Phóng to', zoomOutTitle: 'Thu nhỏ' }).addTo(map);
    tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      referrerPolicy: 'strict-origin-when-cross-origin',
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>',
    });
    let failures = 0;
    tiles.on('loading', () => { failures = 0; clearTimeout(loadingTimeout); loadingTimeout = setTimeout(() => { status.textContent = 'Bản đồ tải quá lâu. Danh sách vẫn dùng được.'; }, 12000); });
    tiles.on('tileerror', () => { failures++; status.textContent = 'Một phần nền bản đồ chưa tải được. Ghim và danh sách vẫn hoạt động.'; });
    tiles.on('load', () => { clearTimeout(loadingTimeout); status.textContent = failures ? 'Một phần nền bản đồ chưa tải được. Ghim và danh sách vẫn hoạt động.' : 'Chọn ghim để mở câu chuyện · Kéo để khám phá'; });
    map.on('dragstart', manualCamera);
    map.on('zoomstart', () => { if (!framingCamera) manualCamera(); });
    map.on('moveend', () => {
      if (cameraFlight) { cameraFlight = false; resizeMap(); }
      renderMarkers(); updateAreaOffer();
    });
    focusDiscovery();
    if (!cameraReady) {
      // No eligible All results / wholly obstructed initial viewport still needs a valid base map.
      const size = map.getSize();
      const padding = prototypeFitPadding({ width: size.x, height: size.y, bottomOverlayHeight: 0 }, 0);
      if (!padding) throw new Error('Map has no usable initial dimensions');
      const target = prototypeRadiusCamera(map, L, state.center, 1000, padding);
      map.setView(target.center, target.zoom, { animate: false }); cameraReady = true;
    }
    updateCircle(); tiles.addTo(map); filter();
  } catch (error) {
    console.error('[prototype] map initialization failed', error);
    clearTimeout(loadingTimeout); clearMarkers(); map?.remove(); map?.off(); tiles?.off(); map = undefined; cameraReady = false; cameraFlight = false; tiles = undefined; radiusCircle = undefined;
    status.textContent = 'Không tải được bản đồ. Chọn địa điểm trong danh sách để tiếp tục.'; retry.hidden = false;
  } finally { connecting = false; }
}
on(retry, 'click', () => { void connect(); });
const observer = new ResizeObserver(resize);
observer.observe(mapElement); observer.observe(document.querySelector('.tools')!);
on(window, 'pageshow', resize);
on(window, 'pagehide', event => {
  content.querySelectorAll('video').forEach(video => video.pause());
  if (event instanceof PageTransitionEvent && !event.persisted) lifetime.dispose();
});
lifetime.onCleanup(() => {
  observer.disconnect(); clearTimeout(loadingTimeout);
  if (drag?.target.hasPointerCapture(drag.id)) drag.target.releasePointerCapture(drag.id);
  drag = undefined; stopVideo(); clearMarkers(); map?.remove(); map?.off(); tiles?.off(); map = undefined;
});
filter(); resize(); void connect();
