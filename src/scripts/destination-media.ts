import { galleryIndex, gallerySupportIndices, gallerySwipeStep, type DestinationImage } from '../lib/destination-media';

// Delegation works for stories cloned from inert templates, without per-story
// listeners, autoplay timers or observers. Removing the story also removes its
// native dialog; the existing stopVideo path still unloads every old player.
const lifetime = new AbortController();
const imagesFor = (root: HTMLElement): DestinationImage[] => {
  try { return JSON.parse(root.dataset.galleryImages ?? '[]'); } catch { return []; }
};
const rootFor = (target: EventTarget | null) => target instanceof Element
  ? target.closest<HTMLElement>('[data-destination-media="gallery"][data-gallery-images]') : null;

function setImage(element: HTMLImageElement, image: DestinationImage, full = false, thumbnail = false) {
  element.alt = image.alt;
  element.width = image.width; element.height = image.height;
  element.src = (full ? image.fullSrc : thumbnail ? image.thumbnailSrc : undefined) ?? image.src;
  if (!full && !thumbnail && image.srcSet) element.srcset = image.srcSet;
  else element.removeAttribute('srcset');
}

function render(root: HTMLElement, requested: number) {
  const images = imagesFor(root);
  if (!images.length) return;
  const index = galleryIndex(requested, images.length);
  const image = images[index]!;
  root.dataset.galleryIndex = String(index);
  setImage(root.querySelector<HTMLImageElement>('[data-gallery-feature]')!, image);
  root.querySelector('[data-gallery-enlarge]')?.setAttribute('aria-label', `Phóng to ảnh: ${image.alt}`);
  const supports = gallerySupportIndices(index, images.length);
  for (const button of root.querySelectorAll<HTMLButtonElement>('[data-gallery-support]')) {
    const other = supports[Number(button.dataset.gallerySupport)]!;
    button.dataset.gallerySelect = String(other);
    button.setAttribute('aria-label', `Chọn ảnh ${other + 1}: ${images[other]!.alt}`);
    setImage(button.querySelector<HTMLImageElement>('img')!, images[other]!, false, true);
  }
  const dialog = root.querySelector<HTMLDialogElement>('[data-gallery-dialog]');
  if (dialog?.open) setImage(dialog.querySelector<HTMLImageElement>('[data-gallery-full]')!, image, true);
  for (const counter of root.querySelectorAll('[data-gallery-counter]')) counter.textContent = `${index + 1} / ${images.length}`;
}

function step(root: HTMLElement, delta: number) {
  render(root, Number(root.dataset.galleryIndex ?? 0) + delta);
}

document.addEventListener('click', event => {
  const root = rootFor(event.target);
  if (!root || !(event.target instanceof Element)) return;
  if (performance.now() < Number(root.dataset.galleryIgnoreClickUntil ?? 0)) { event.preventDefault(); return; }
  const button = event.target.closest<HTMLButtonElement>('button');
  if (!button || button.disabled) return;
  if (button.hasAttribute('data-gallery-step')) step(root, Number(button.dataset.galleryStep));
  else if (button.hasAttribute('data-gallery-select')) render(root, Number(button.dataset.gallerySelect));
  else if (button.hasAttribute('data-gallery-enlarge')) {
    const dialog = root.querySelector<HTMLDialogElement>('[data-gallery-dialog]')!;
    const image = imagesFor(root)[Number(root.dataset.galleryIndex ?? 0)];
    if (!image) return;
    setImage(dialog.querySelector<HTMLImageElement>('[data-gallery-full]')!, image, true);
    dialog.showModal();
  } else if (button.hasAttribute('data-gallery-close')) root.querySelector<HTMLDialogElement>('[data-gallery-dialog]')?.close();
}, { signal: lifetime.signal });

// Capture prevents Escape from also reaching the existing story-close handler.
// Do not prevent its default action: the browser closes just the native dialog.
document.addEventListener('keydown', event => {
  const root = rootFor(event.target);
  if (!root) return;
  if (event.key === 'Escape' && root.querySelector<HTMLDialogElement>('[data-gallery-dialog]')?.open) {
    event.stopPropagation(); return;
  }
  if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
    event.preventDefault(); event.stopPropagation(); step(root, event.key === 'ArrowRight' ? 1 : -1);
  }
}, { capture: true, signal: lifetime.signal });

let gesture: { root: HTMLElement; id: number; x: number; y: number } | undefined;
document.addEventListener('pointerdown', event => {
  if (!event.isPrimary) { gesture = undefined; return; }
  const root = rootFor(event.target);
  const surface = event.target instanceof Element && event.target.closest('.gallery-feature, .gallery-dialog-image');
  if (!root || !surface || event.pointerType === 'mouse') return;
  gesture = { root, id: event.pointerId, x: event.clientX, y: event.clientY };
}, { signal: lifetime.signal });
document.addEventListener('pointerup', event => {
  const start = gesture; gesture = undefined;
  if (!start || start.id !== event.pointerId || !start.root.isConnected) return;
  const delta = gallerySwipeStep(event.clientX - start.x, event.clientY - start.y);
  if (delta && imagesFor(start.root).length > 1) {
    step(start.root, delta);
    // A swipe must not synthesize a click that immediately opens enlargement.
    start.root.dataset.galleryIgnoreClickUntil = String(performance.now() + 400);
  }
}, { signal: lifetime.signal });
document.addEventListener('pointercancel', () => { gesture = undefined; }, { signal: lifetime.signal });
window.addEventListener('pagehide', event => {
  gesture = undefined;
  if (!event.persisted) lifetime.abort();
}, { signal: lifetime.signal });
