import { destinationSearchIndex, type DestinationSearchEntry } from '../data/destinations/search-index';
import { searchDestinations } from '../lib/destination-search';

export function bindMapSearch(root: HTMLElement, onSelect: (entry: DestinationSearchEntry) => void) {
  const input = root.querySelector<HTMLInputElement>('input')!;
  const dropdown = root.querySelector<HTMLElement>('[data-map-suggestions]')!;
  const list = root.querySelector<HTMLUListElement>('ul')!;
  const empty = root.querySelector<HTMLElement>('[data-map-search-empty]')!;
  const status = root.querySelector<HTMLElement>('[data-map-search-status]')!;
  const english = root.dataset.lang === 'en';
  const languageIndex = english ? 1 : 0;
  const name = (entry: DestinationSearchEntry) => english ? entry.nameEn : entry.nameVi;
  let results: DestinationSearchEntry[] = [];
  let highlighted = -1;

  function close() {
    dropdown.hidden = true;
    input.setAttribute('aria-expanded', 'false');
    input.removeAttribute('aria-activedescendant');
    highlighted = -1;
  }

  function choose(index: number) {
    const entry = results[index];
    if (!entry) return;
    input.value = name(entry);
    close();
    status.textContent = root.dataset.chosenLabel + ' ' + name(entry);
    onSelect(entry);
  }

  function showResults() {
    results = searchDestinations(destinationSearchIndex, input.value);
    highlighted = -1;
    input.removeAttribute('aria-activedescendant');
    list.replaceChildren();
    if (!input.value.trim()) {
      close();
      status.textContent = '';
      return;
    }
    for (const [index, entry] of results.entries()) {
      const option = document.createElement('li');
      option.id = list.id + '-' + index;
      option.setAttribute('role', 'option');
      option.setAttribute('aria-selected', 'false');
      const title = document.createElement('span');
      title.textContent = name(entry);
      const detail = document.createElement('small');
      const province = destinationSearchIndex.find(item => item.id === entry.provinceId);
      detail.textContent = entry.type === 'destination' ? entry.description[languageIndex]
        : [entry.area?.[languageIndex] ?? (province && name(province)), entry.category?.[languageIndex]].filter(Boolean).join(' · ');
      option.append(title, detail);
      option.addEventListener('mousedown', event => event.preventDefault());
      option.addEventListener('click', () => choose(index));
      list.append(option);
    }
    empty.hidden = results.length > 0;
    dropdown.hidden = false;
    input.setAttribute('aria-expanded', 'true');
    status.textContent = results.length ? results.length + ' ' + root.dataset.resultLabel : root.dataset.noResults ?? '';
  }

  input.addEventListener('input', showResults);
  input.addEventListener('keydown', event => {
    if (event.isComposing) return;
    if (event.key === 'Tab') { close(); return; }
    if (event.key === 'Escape' && !dropdown.hidden) {
      event.preventDefault();
      close();
      return;
    }
    if (event.key === 'Enter' && !dropdown.hidden && results.length) {
      event.preventDefault();
      choose(Math.max(0, highlighted));
      return;
    }
    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
    if (dropdown.hidden) showResults();
    if (!results.length) return;
    event.preventDefault();
    const direction = event.key === 'ArrowDown' ? 1 : -1;
    highlighted = highlighted < 0 ? (direction === 1 ? 0 : results.length - 1)
      : (highlighted + direction + results.length) % results.length;
    for (const [index, option] of [...list.children].entries()) option.setAttribute('aria-selected', String(index === highlighted));
    const option = list.children[highlighted]!;
    input.setAttribute('aria-activedescendant', option.id);
    option.scrollIntoView({ block: 'nearest' });
  });
  const closeOutside = (event: Event) => {
    if (event.target instanceof Node && !root.contains(event.target)) close();
  };
  document.addEventListener('pointerdown', closeOutside);
  document.addEventListener('focusin', closeOutside);
  if (input.value.trim() && document.activeElement === input) showResults();
}
