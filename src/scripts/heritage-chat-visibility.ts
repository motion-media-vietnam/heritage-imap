import { centerDock, chooseHeritageDock, dockBounds, overlapsDock, type Dock, type DockViewport } from '../lib/heritage-chat-dock';

const immersiveSelector = '[data-heritage-chat-zone="immersive"]';
const contentSelector = '[data-heritage-chat-zone="content"]';
const controlsSelector = ':is(main, footer) :is(a[href], button, input, select, textarea, summary, iframe, video[controls], [role="button"], h1, h2, h3, p), .leaflet-control';

export function setupHeritageChatVisibility(options: {
  root: HTMLElement;
  tab: HTMLButtonElement;
  drawer: HTMLDialogElement;
  headerBottom: () => number;
  sizeDrawer: () => void;
  focusFallback: () => void;
}) {
  const { root, tab, drawer, headerBottom, sizeDrawer, focusFallback } = options;
  const mobile = matchMedia('(max-width: 767px)');
  const openMenus = 'dialog[open], .mobile-menu[open], .n-menu[open]';
  const regions = new Set<Element>();
  const nearby = new Set<Element>();
  let immersive: Element[] = [];
  let observer: IntersectionObserver | undefined;
  let frame = 0;
  let dock: Dock | undefined;
  let bannerHidden = false;
  let ready = false;

  function showTab(next: Dock | undefined) {
    if (!next && document.activeElement === tab) focusFallback();
    if (next && (dock?.mode !== next.mode || dock.position !== next.position)) {
      dock = next;
      tab.dataset.heritageDock = next.mode;
      tab.style.setProperty('--heritage-dock-y', `${next.position * 100}%`);
    }
    const visibility = next ? 'visible' : 'hidden';
    if (tab.dataset.heritageVisibility !== visibility) {
      tab.inert = !next;
      tab.dataset.heritageVisibility = visibility;
    }
  }

  function placeTab() {
    if (drawer.open) sizeDrawer();
    if (!ready || drawer.open || document.querySelector(openMenus)) {
      showTab(undefined);
      return;
    }
    const css = getComputedStyle(tab);
    const height = window.innerHeight;
    const viewport: DockViewport = {
      right: document.documentElement.clientWidth - (parseFloat(css.right) || 0),
      top: Math.max(headerBottom(), parseFloat(css.getPropertyValue('--heritage-safe-top')) || 0),
      bottom: height - Math.max(16, parseFloat(css.getPropertyValue('--heritage-safe-bottom')) || 0),
      height,
      verticalWidth: parseFloat(css.getPropertyValue('--heritage-tab-width')),
      verticalHeight: parseFloat(css.getPropertyValue('--heritage-tab-height')),
      compactSize: parseFloat(css.getPropertyValue('--heritage-compact-size')),
      compactOnly: mobile.matches,
    };
    const naturalDock = viewport.compactOnly ? { ...centerDock, mode: 'compact' as const } : centerDock;
    const margin = bannerHidden ? 20 : 6;
    const bannerRects = immersive.map(element => element.getBoundingClientRect()).filter(rect => rect.width && rect.height);
    const touchesBanner = (placement: Dock) => bannerRects.some(rect => overlapsDock(dockBounds(placement, viewport), rect, 0, margin));
    bannerHidden = touchesBanner(naturalDock) || (dock !== undefined && touchesBanner(dock));
    if (bannerHidden) {
      showTab(undefined);
      return;
    }
    const blockers = [...nearby].filter(element => !element.matches(immersiveSelector))
      .map(element => element.getBoundingClientRect()).filter(rect => rect.width && rect.height);
    const next = chooseHeritageDock(viewport, [...blockers, ...bannerRects], dock);
    showTab(next);
  }

  function schedulePosition() {
    if (frame) return;
    frame = requestAnimationFrame(() => { frame = 0; placeTab(); });
  }

  function observeRegions() {
    immersive = [...document.querySelectorAll(immersiveSelector)];
    const content = [...document.querySelectorAll(`${contentSelector}, ${controlsSelector}`)].filter(element =>
      element.matches(contentSelector) || !element.closest(`${contentSelector}, ${immersiveSelector}`),
    );
    const next = new Set([...immersive, ...content]);
    for (const element of regions) {
      if (next.has(element)) continue;
      observer?.unobserve(element);
      nearby.delete(element);
      regions.delete(element);
    }
    for (const element of next) {
      if (regions.has(element)) continue;
      regions.add(element);
      if (observer) observer.observe(element);
      else nearby.add(element);
    }
  }

  function observeEdge() {
    observer?.disconnect();
    observer = undefined;
    nearby.clear();
    if ('IntersectionObserver' in window) {
      // Observe the right rail, including space for a safe-area inset.
      const rail = Math.max(0, document.documentElement.clientWidth - 100 - (parseFloat(getComputedStyle(tab).right) || 0));
      observer = new IntersectionObserver(entries => {
        for (const entry of entries) {
          if (entry.isIntersecting && regions.has(entry.target)) nearby.add(entry.target);
          else nearby.delete(entry.target);
        }
        ready = true;
        tab.hidden = false;
        schedulePosition();
      }, { rootMargin: `16px 0px 16px -${rail}px` });
      for (const element of regions) observer.observe(element);
    } else {
      for (const element of regions) nearby.add(element);
    }
    if (!observer || regions.size === 0) {
      ready = true;
      tab.hidden = false;
    }
    schedulePosition();
  }

  if (typeof drawer.showModal !== 'function') return () => {};
  observeRegions();
  // Keep the button measurable even when its slot is unavailable.
  observeEdge();
  window.addEventListener('resize', observeEdge, { passive: true });
  window.visualViewport?.addEventListener('resize', schedulePosition, { passive: true });
  window.visualViewport?.addEventListener('scroll', schedulePosition, { passive: true });
  document.addEventListener('scroll', schedulePosition, { passive: true, capture: true });
  document.addEventListener('toggle', schedulePosition, true);
  window.addEventListener('pageshow', schedulePosition);
  new MutationObserver(records => {
    const selector = `${immersiveSelector}, ${contentSelector}, ${controlsSelector}`;
    const changed = records.some(record => !root.contains(record.target)
      && [...record.addedNodes, ...record.removedNodes].some(node => node instanceof Element && (node.matches(selector) || node.querySelector(selector))));
    if (changed) { observeRegions(); schedulePosition(); }
  }).observe(document.body, { subtree: true, childList: true });
  return placeTab;
}
