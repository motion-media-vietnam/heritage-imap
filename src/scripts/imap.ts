import { places, demoLocation } from '../data/places';
import type { ImapCategoryId } from '../lib/imap-categories';
import { categoryIconPath, markerCategory } from '../lib/imap-neighborhood';
import { districtPlaceSlugs } from '../data/districts';
import { distanceKm, formatDistance } from '../lib/explore';
import { createExplorerState, filterExplorerPlaces, createInstanceLifetime } from '../lib/imap';
import { linkedDestination } from '../lib/imap-destination-link';
import { selectDestination, sheetStates, sheetStateHeight, nearestSheetState, videoSelectionSheetState, type SheetState } from '../lib/imap-prototype';
import { mobileSheetHeight, nearestMobileSheetState } from '../lib/imap-mobile';
import type * as Leaflet from 'leaflet';

export function mountIMap(root: HTMLElement): () => void {
  const lifetime = createInstanceLifetime();
  const { signal } = lifetime;
  const state = createExplorerState();
  function get<T extends HTMLElement>(name: string): T {
    const element = root.querySelector<T>(`[data-imap="${name}"]`);
    if (!element) throw new Error(`Missing iMap element: ${name}`);
    return element;
  }
  const external = <T extends HTMLElement>(key: string) => root.dataset[key] ? document.getElementById(root.dataset[key]!) as T | null : null;
  const explorer = get<HTMLElement>('explorer');
  const search = get<HTMLInputElement>('search');
  const category = get<HTMLSelectElement>('category');
  const district = get<HTMLSelectElement>('district');
  const sheet = get<HTMLElement>('sheet');
  const story = get<HTMLElement>('story');
  const content = get<HTMLElement>('content');
  const status = get<HTMLElement>('status');
  const mapElement = get<HTMLElement>('map');
  const reopen = get<HTMLButtonElement>('reopen');
  const retry = get<HTMLButtonElement>('retry');
  const locate = get<HTMLButtonElement>('locate');
  const resetLocation = get<HTMLButtonElement>('reset-location');
  const locationMessage = get<HTMLElement>('location-message');
  const handle = get<HTMLElement>('handle');
  const nearby = external<HTMLInputElement>('nearbyId') ?? root.querySelector<HTMLInputElement>('[data-imap="nearby"]');
  const results = external<HTMLElement>('resultsId');
  const resultCount = external<HTMLElement>('resultCountId');
  const emptyState = external<HTMLElement>('emptyStateId');
  const resetFilters = external<HTMLButtonElement>('resetFiltersId');
  const cards = new Map(Array.from(results?.querySelectorAll<HTMLElement>('[data-card]') ?? []).map(card => [card.dataset.card!, card]));
  const directory = Array.from(root.querySelectorAll<HTMLButtonElement>('[data-imap-place]'));
  const districtOptions = Array.from(district.querySelectorAll<HTMLOptionElement>('[data-imap-district-option]'));
  const stateButtons = Array.from(root.querySelectorAll<HTMLButtonElement>('[data-imap-sheet-state]'));
  const templates = new Map(Array.from(root.querySelectorAll<HTMLTemplateElement>('[data-imap-story]')).map(template => [template.dataset.imapStory!, template]));
  const markers = new Map<string, Leaflet.Marker>();
  const mobile = window.matchMedia('(max-width: 960px)');
  const discovery = root.querySelector<HTMLButtonElement>('[data-imap="discovery"]');
  const directoryClose = root.querySelector<HTMLButtonElement>('[data-imap="directory-close"]');
  const mobileDiscovery = () => mobile.matches && root.dataset.mobileDiscovery === 'true';
  const header = root.dataset.headerSelector ? document.querySelector<HTMLElement>(root.dataset.headerSelector) : null;
  let map: Leaflet.Map | undefined;
  let locationMarker: Leaflet.Marker | undefined;
  let tiles: Leaflet.TileLayer | undefined;
  let ready = false;
  let connecting = false;
  let usingLocation = false;
  let visible = new Set(places.map(place => place.slug));
  let previousFocus: HTMLElement | null = null;
  let timeout: ReturnType<typeof setTimeout> | undefined;
  let drag: { id: number; y: number; height: number; target: HTMLElement } | undefined;
  let suppressDiscoveryClick = false;
  let videoHeight = 0;
  const on = (target: EventTarget, type: string, listener: EventListener) => target.addEventListener(type, listener, { signal });

  function stopVideo() {
    content.querySelectorAll('video').forEach(video => { video.pause(); video.removeAttribute('src'); video.load(); });
    content.replaceChildren();
  }
  function destroyMap() {
    clearTimeout(timeout);
    // Let Leaflet's unload/remove handlers run before detaching residual listeners.
    map?.remove(); map?.off(); tiles?.off();
    for (const marker of markers.values()) marker.off();
    locationMarker?.off(); markers.clear();
    map = undefined; tiles = undefined; locationMarker = undefined; ready = false;
  }
  function sheetHeightFor(next: SheetState) {
    const available = explorer.getBoundingClientRect().height;
    return mobileDiscovery() ? mobileSheetHeight(next, available, videoHeight, parseFloat(getComputedStyle(sheet).paddingBottom) || 0)
      : sheetStateHeight(next, available);
  }
  function invalidateMap() {
    if (map && ready && mapElement.clientWidth && mapElement.clientHeight) {
      const center = map.getCenter(); const zoom = map.getZoom();
      map.invalidateSize({ pan: false }); map.setView(center, zoom, { animate: false });
    }
  }
  function setSheet(next: SheetState) {
    state.sheet = next;
    sheet.dataset.sheetState = next;
    explorer.dataset.sheetState = next;
    sheet.classList.remove('is-dragging');
    const height = sheetHeightFor(next);
    sheet.style.setProperty('--sheet-height', `${height}px`);
    explorer.style.setProperty('--sheet-overlay-height', `${height}px`);
    content.inert = mobile.matches && next === 'collapsed';
    get('directory').inert = mobileDiscovery() && (next === 'collapsed' || !story.hidden);
    story.inert = mobileDiscovery() && next === 'collapsed';
    if (discovery) discovery.setAttribute('aria-expanded', String(next !== 'collapsed' && story.hidden));
    invalidateMap();
    for (const button of stateButtons) button.setAttribute('aria-pressed', String(button.dataset.imapSheetState === next));
  }
  function syncSelection() {
    for (const button of directory) button.setAttribute('aria-pressed', String(button.dataset.imapPlace === state.selected));
    for (const [slug, marker] of markers) {
      marker.getElement()?.classList.toggle('is-selected', state.selected === slug);
      marker.getElement()?.setAttribute('aria-pressed', String(state.selected === slug));
      marker.setZIndexOffset(state.selected === slug ? 500 : 0);
    }
  }
  function closeStory(restoreFocus = true) {
    stopVideo(); story.hidden = true; explorer.classList.remove('has-story');
    reopen.hidden = !state.selected;
    setSheet('collapsed');
    if (restoreFocus) {
      const target = previousFocus?.isConnected && previousFocus.getClientRects().length ? previousFocus : !reopen.hidden ? reopen : category;
      target.focus({ preventScroll: true });
    }
  }
  function openDirectory() {
    closeStory(false);
    videoHeight = 0;
    setSheet('expanded');
    get('directory').focus({ preventScroll: true });
  }
  function filter() {
    state.query = search.value;
    state.category = category.value as ImapCategoryId | 'All';
    state.district = district.value;
    state.nearby = nearby?.checked ?? false;
    const candidates = filterExplorerPlaces(places, state, false);
    for (const option of districtOptions) {
      const count = candidates.filter(place => (districtPlaceSlugs[option.value] ?? []).includes(place.slug)).length;
      option.hidden = count === 0 && option.value !== state.district;
      option.textContent = `${option.value} · ${count}`;
    }
    const filtered = filterExplorerPlaces(places, state);
    visible = new Set(filtered.map(place => place.slug));
    for (const button of directory) button.closest<HTMLElement>('li')!.hidden = !visible.has(button.dataset.imapPlace!);
    for (const [slug, marker] of markers) {
      if (!map) continue;
      if (visible.has(slug) && !map.hasLayer(marker)) marker.addTo(map);
      else if (!visible.has(slug) && map.hasLayer(marker)) marker.remove();
    }
    for (const [slug, card] of cards) card.hidden = !visible.has(slug);
    for (const place of filtered) {
      const card = cards.get(place.slug);
      if (!card) continue;
      const distance = card.querySelector<HTMLElement>('[data-distance]');
      if (distance) distance.textContent = `Cách ${formatDistance(distanceKm(state.origin, place.coordinates))}`;
      results?.append(card);
    }
    if (state.selected && !visible.has(state.selected)) { closeStory(false); state.selected = undefined; reopen.hidden = true; }
    get('count').textContent = `${visible.size} địa điểm`;
    if (discovery) discovery.textContent = `Khám phá ${visible.size} địa điểm`;
    get('empty').hidden = visible.size !== 0;
    if (resultCount) resultCount.textContent = `${visible.size} địa điểm, gần nhất trước`;
    if (emptyState) emptyState.hidden = visible.size !== 0;
    content.querySelectorAll<HTMLButtonElement>('[data-imap-nearby]').forEach(button => {
      button.disabled = !visible.has(button.dataset.imapNearby!);
      button.title = button.disabled ? 'Địa điểm ngoài bộ lọc hiện tại' : '';
    });
    syncSelection();
  }
  function openPlace(slug: string, trigger?: HTMLElement) {
    const next = selectDestination(state.selected, slug, visible);
    const place = places.find(candidate => candidate.slug === slug);
    if (next !== slug || !place || !templates.has(slug)) return;
    if (story.hidden) previousFocus = trigger ?? (document.activeElement instanceof HTMLElement ? document.activeElement : null);
    stopVideo(); state.selected = slug;
    content.append(templates.get(slug)!.content.cloneNode(true));
    content.querySelectorAll('video').forEach(video => { video.autoplay = false; });
    get('story-label').textContent = place.name;
    story.hidden = false; explorer.classList.add('has-story'); reopen.hidden = true; content.scrollTop = 0;
    filter();
    // Unhide the mobile story before measuring; collapsed discovery has display:none panels.
    if (mobileDiscovery()) { videoHeight = 0; setSheet('half'); }
    // A directory's expanded snap must not force the newly selected story full-height.
    let opening: SheetState = mobileDiscovery() ? 'half' : state.sheet === 'expanded' ? 'expanded' : 'half';
    if (mobile.matches && opening !== 'expanded') {
      const frame = content.querySelector<HTMLElement>('[data-destination-video]');
      const toolbar = story.querySelector<HTMLElement>('.imap-story-toolbar');
      if (frame && toolbar) {
        const required = handle.getBoundingClientRect().height + toolbar.getBoundingClientRect().height
          + frame.getBoundingClientRect().bottom - content.getBoundingClientRect().top + 12;
        videoHeight = required;
        if (!mobileDiscovery()) opening = videoSelectionSheetState(required, explorer.getBoundingClientRect().height);
      }
    }
    setSheet(opening);
    content.querySelector<HTMLElement>('h2')?.focus({ preventScroll: true });
  }
  function resetView() {
    if (!map) return;
    map.fitBounds(places.map(place => [place.coordinates.lat, place.coordinates.lng] as Leaflet.LatLngTuple), { padding: [48, 48], maxZoom: 14 });
    ready = true;
  }
  function resize() {
    if (lifetime.disposed) return;
    // Native hidden beats the directory's generic desktop button display rule.
    if (directoryClose) directoryClose.hidden = !mobile.matches;
    const heading = get('heading');
    const headingStyle = getComputedStyle(heading);
    const chrome = (header?.getBoundingClientRect().height ?? 0) + heading.getBoundingClientRect().height
      + parseFloat(headingStyle.marginTop || '0') + parseFloat(headingStyle.marginBottom || '0') + get('tools').getBoundingClientRect().height;
    root.style.setProperty('--imap-chrome-height', `${chrome}px`);
    if (mobileDiscovery()) {
      // Shared discovery geometry; the standalone page also reserves its main padding.
      const container = root.closest<HTMLElement>('[data-imap-viewport-container]');
      const containerStyle = container ? getComputedStyle(container) : null;
      const containerPadding = (parseFloat(containerStyle?.paddingTop ?? '0') || 0)
        + (parseFloat(containerStyle?.paddingBottom ?? '0') || 0);
      const actualChrome = (header?.getBoundingClientRect().height ?? 0) + containerPadding
        + explorer.getBoundingClientRect().top - root.getBoundingClientRect().top;
      root.style.setProperty('--imap-mobile-available', `${Math.max(280, (window.visualViewport?.height ?? window.innerHeight) - actualChrome)}px`);
      const frame = content.querySelector<HTMLElement>('[data-destination-video]');
      if (frame && !story.hidden) videoHeight = handle.getBoundingClientRect().height
        + frame.getBoundingClientRect().bottom - content.getBoundingClientRect().top + content.scrollTop + 12;
    }
    setSheet(state.sheet);
    if (!connecting && !map && mapElement.clientWidth && mapElement.clientHeight) void connect();
  }
  function updateLocation() {
    const label = usingLocation ? 'Vị trí gần đúng của bạn' : 'Điểm xuất phát mẫu: Hồ Hoàn Kiếm';
    get('origin-label').textContent = label;
    locationMarker?.setLatLng([state.origin.lat, state.origin.lng]).setTooltipContent(label);
    locationMarker?.getElement()?.setAttribute('title', label);
  }
  on(get('tools'), 'submit', event => { event.preventDefault(); filter(); });
  for (const input of [search, category, district]) on(input, input === search ? 'input' : 'change', filter);
  if (nearby) on(nearby, 'change', filter);
  if (resetFilters) on(resetFilters, 'click', () => { search.value = ''; category.value = 'All'; district.value = 'All'; if (nearby) nearby.checked = false; filter(); search.focus(); });
  for (const button of directory) on(button, 'click', () => openPlace(button.dataset.imapPlace!, button));
  on(content, 'click', event => {
    const button = event.target instanceof Element ? event.target.closest<HTMLButtonElement>('[data-imap-nearby]') : null;
    if (button && content.contains(button) && !button.disabled) openPlace(button.dataset.imapNearby!);
  });
  on(get('close'), 'click', () => closeStory());
  on(reopen, 'click', () => { if (state.selected) openPlace(state.selected, reopen); });
  on(get('reset-view'), 'click', resetView);
  if (discovery) on(discovery, 'click', () => {
    if (suppressDiscoveryClick) { suppressDiscoveryClick = false; return; }
    openDirectory();
  });
  if (directoryClose) on(directoryClose, 'click', () => { setSheet('collapsed'); discovery?.focus({ preventScroll: true }); });
  on(sheet, 'transitionend', event => { if (event.target === sheet) invalidateMap(); });
  on(get('skip'), 'click', event => { event.preventDefault(); if (mobileDiscovery()) openDirectory(); else if (mobile.matches) { closeStory(false); setSheet('half'); } get('directory').focus({ preventScroll: true }); });
  for (const button of stateButtons) on(button, 'click', () => {
    const next = button.dataset.imapSheetState as SheetState;
    if (mobileDiscovery() && next === 'collapsed') closeStory(false);
    else if (sheetStates.includes(next)) setSheet(next);
    if (mobileDiscovery() && next === 'collapsed') discovery?.focus({ preventScroll: true });
  });
  on(root, 'keydown', event => {
    if (!(event instanceof KeyboardEvent) || event.key !== 'Escape') return;
    const video = content.querySelector<HTMLVideoElement & { webkitDisplayingFullscreen?: boolean }>('video');
    if (document.fullscreenElement || video?.webkitDisplayingFullscreen) return;
    if (!story.hidden) closeStory();
    else if (mobile.matches && state.sheet !== 'collapsed') { setSheet('collapsed'); (mobileDiscovery() ? discovery : stateButtons[0])?.focus({ preventScroll: true }); }
  });
  on(handle, 'pointerdown', event => {
    if (!(event instanceof PointerEvent) || !mobile.matches || event.button !== 0) return;
    const button = event.target instanceof Element ? event.target.closest('button') : null;
    if (button && button !== discovery) return;
    suppressDiscoveryClick = false;
    const target = button === discovery ? discovery! : handle;
    drag = { id: event.pointerId, y: event.clientY, height: sheet.getBoundingClientRect().height, target };
    target.setPointerCapture(event.pointerId); sheet.classList.add('is-dragging');
    if (!mobileDiscovery()) content.inert = false;
  });
  on(handle, 'pointermove', event => {
    if (!(event instanceof PointerEvent) || !drag || drag.id !== event.pointerId) return;
    const height = Math.max(sheetHeightFor('collapsed'), Math.min(sheetHeightFor('expanded'), drag.height + drag.y - event.clientY));
    sheet.style.setProperty('--sheet-height', `${height}px`); explorer.style.setProperty('--sheet-overlay-height', `${height}px`);
  });
  const endDrag = (event: Event) => {
    if (!(event instanceof PointerEvent) || !drag || drag.id !== event.pointerId) return;
    const delta = drag.y - event.clientY;
    if (drag.target.hasPointerCapture(event.pointerId)) drag.target.releasePointerCapture(event.pointerId);
    drag = undefined;
    if (mobileDiscovery()) {
      suppressDiscoveryClick = Math.abs(delta) > 8;
      if (event.type === 'pointercancel') { setSheet(state.sheet); return; }
      if (state.sheet === 'collapsed' && delta > 16) { openDirectory(); return; }
      const next = nearestMobileSheetState(sheet.getBoundingClientRect().height, explorer.getBoundingClientRect().height, videoHeight, parseFloat(getComputedStyle(sheet).paddingBottom) || 0);
      if (next === 'collapsed') { closeStory(false); discovery?.focus({ preventScroll: true }); }
      else setSheet(next);
    } else setSheet(nearestSheetState(sheet.getBoundingClientRect().height, explorer.getBoundingClientRect().height));
  };
  on(handle, 'pointerup', endDrag); on(handle, 'pointercancel', endDrag);
  on(locate, 'click', () => {
    if (!navigator.geolocation || !window.isSecureContext) { locationMessage.textContent = 'Định vị cần trình duyệt hỗ trợ và kết nối HTTPS hoặc localhost.'; return; }
    locate.disabled = true; locationMessage.textContent = 'Đang xác định vị trí… Bạn có thể tiếp tục khám phá bản đồ.';
    navigator.geolocation.getCurrentPosition(position => {
      if (lifetime.disposed) return;
      state.origin = { lat: position.coords.latitude, lng: position.coords.longitude }; usingLocation = true; resetLocation.hidden = false;
      updateLocation(); filter();
      if (map && ready) map.setView([state.origin.lat, state.origin.lng], 13);
      locationMessage.textContent = distanceKm(state.origin, demoLocation) > 50 ? 'Bạn đang ở xa trung tâm Hà Nội. Khoảng cách là đường chim bay.' : 'Đã cập nhật vị trí gần đúng. Khoảng cách là đường chim bay.';
      locate.disabled = false;
    }, error => {
      if (lifetime.disposed) return;
      locationMessage.textContent = error.code === 1 ? 'Bạn chưa cho phép truy cập vị trí. Điểm xuất phát hiện tại được giữ nguyên.' : 'Chưa thể xác định vị trí. Bạn vẫn có thể khám phá từ điểm xuất phát hiện tại.';
      locate.disabled = false;
    }, { enableHighAccuracy: false, timeout: 10000, maximumAge: 60000 });
  });
  on(resetLocation, 'click', () => { state.origin = { ...demoLocation }; usingLocation = false; resetLocation.hidden = true; locationMessage.textContent = ''; updateLocation(); filter(); resetView(); });
  on(window, 'resize', resize); on(mobile, 'change', resize);
  if (window.visualViewport) on(window.visualViewport, 'resize', resize);
  on(window, 'pageshow', resize);
  on(window, 'pagehide', event => {
    content.querySelectorAll('video').forEach(video => video.pause());
    if (event instanceof PageTransitionEvent && !event.persisted) lifetime.dispose();
  });

  async function connect() {
    if (lifetime.disposed || connecting || map) return;
    connecting = true; retry.hidden = true; status.textContent = 'Đang tải bản đồ…';
    try {
      const L = await import('leaflet');
      if (lifetime.disposed) return;
      if (!mapElement.clientWidth || !mapElement.clientHeight) { status.textContent = 'Bản đồ đang chờ vùng hiển thị.'; return; }
      map = L.map(mapElement, { scrollWheelZoom: false, zoomControl: false });
      L.control.zoom({ position: 'topright', zoomInTitle: 'Phóng to', zoomOutTitle: 'Thu nhỏ' }).addTo(map);
      tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        referrerPolicy: 'strict-origin-when-cross-origin',
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>',
      });
      let failures = 0;
      tiles.on('loading', () => {
        failures = 0; clearTimeout(timeout);
        timeout = setTimeout(() => { if (!lifetime.disposed) status.textContent = 'Bản đồ tải quá lâu. Danh sách và câu chuyện vẫn dùng được.'; }, 12000);
      });
      tiles.on('tileerror', () => { failures++; status.textContent = 'Một phần nền bản đồ chưa tải được. Ghim và danh sách vẫn hoạt động.'; });
      tiles.on('load', () => { clearTimeout(timeout); status.textContent = failures ? 'Một phần nền bản đồ chưa tải được. Ghim và danh sách vẫn hoạt động.' : 'Chọn ghim để mở câu chuyện · Kéo để khám phá'; });
      map.invalidateSize({ pan: false }); resetView();
      places.forEach(place => {
        const pin = document.createElement('span'); pin.className = 'imap-curated-pin';
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        for (const [name, value] of Object.entries({ width: '20', height: '20', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '1.6', 'aria-hidden': 'true' })) svg.setAttribute(name, value);
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', categoryIconPath(markerCategory(place)));
        svg.append(path); pin.append(svg);
        const label = document.createElement('span'); label.textContent = place.name;
        const marker = L.marker([place.coordinates.lat, place.coordinates.lng], {
          title: place.name, icon: L.divIcon({ className: 'imap-curated-icon', html: pin, iconSize: [42, 42], iconAnchor: [21, 21] }),
        }).bindTooltip(label, { direction: 'top' });
        marker.on('click', () => openPlace(place.slug, marker.getElement()));
        marker.on('add', () => { marker.getElement()?.setAttribute('aria-label', `Mở câu chuyện ${place.name}`); syncSelection(); });
        markers.set(place.slug, marker);
      });
      const dot = document.createElement('span'); dot.className = 'imap-origin-dot';
      locationMarker = L.marker([state.origin.lat, state.origin.lng], { keyboard: false, interactive: false, zIndexOffset: 1000, icon: L.divIcon({ className: 'imap-origin-icon', html: dot, iconSize: [19, 19], iconAnchor: [9.5, 9.5] }) }).bindTooltip('Điểm xuất phát mẫu: Hồ Hoàn Kiếm').addTo(map);
      updateLocation(); tiles.addTo(map); filter();
    } catch (error) {
      console.error('[iMap] initialization failed', error);
      destroyMap();
      status.textContent = 'Không tải được bản đồ. Chọn địa điểm trong danh sách để tiếp tục.'; retry.hidden = false;
    } finally { connecting = false; }
  }
  on(retry, 'click', () => { void connect(); });
  const observer = new ResizeObserver(resize);
  observer.observe(mapElement); observer.observe(get('tools')); observer.observe(get('heading')); if (header) observer.observe(header);
  lifetime.onCleanup(() => {
    observer.disconnect(); clearTimeout(timeout);
    if (drag?.target.hasPointerCapture(drag.id)) drag.target.releasePointerCapture(drag.id);
    drag = undefined; stopVideo(); destroyMap();
  });
  filter(); resize();
  // Standalone entry only: reuse the same selection/template/sheet path as a pin.
  // No filter reset, second map, or URL writes; unknown IDs retain the default view.
  if (root.id === 'full-imap') {
    const destination = linkedDestination(window.location.search, places.map(place => place.slug));
    if (destination) openPlace(destination);
  }
  return () => lifetime.dispose();
}

class HanoiIMap extends HTMLElement {
  private cleanup?: () => void;
  private frame?: number;
  connectedCallback() {
    if (this.cleanup || this.frame !== undefined) return;
    this.frame = requestAnimationFrame(() => { this.frame = undefined; if (this.isConnected) this.cleanup = mountIMap(this); });
  }
  disconnectedCallback() {
    if (this.frame !== undefined) cancelAnimationFrame(this.frame);
    this.frame = undefined; this.cleanup?.(); this.cleanup = undefined;
  }
}
if (!customElements.get('hanoi-imap')) customElements.define('hanoi-imap', HanoiIMap);
