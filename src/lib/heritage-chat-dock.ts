export type DockRect = Pick<DOMRectReadOnly, 'left' | 'right' | 'top' | 'bottom'>;
export type Dock = { mode: 'vertical' | 'compact'; position: number };
export type DockViewport = {
  right: number;
  top: number;
  bottom: number;
  height: number;
  verticalWidth: number;
  verticalHeight: number;
  compactSize: number;
  compactOnly: boolean;
};

export const centerDock = { mode: 'vertical', position: 0.5 } as const;
const positions = [centerDock.position, 0.68, 0.32];

export function dockBounds(dock: Dock, viewport: DockViewport): DockRect {
  const width = dock.mode === 'compact' ? viewport.compactSize : viewport.verticalWidth;
  const height = dock.mode === 'compact' ? viewport.compactSize : viewport.verticalHeight;
  const center = viewport.height * dock.position;
  return { left: viewport.right - width, right: viewport.right, top: center - height / 2, bottom: center + height / 2 };
}

export function overlapsDock(dock: DockRect, region: DockRect, xGap = 0, yGap = 0) {
  return dock.left - xGap < region.right && dock.right + xGap > region.left
    && dock.top - yGap < region.bottom && dock.bottom + yGap > region.top;
}

export function chooseHeritageDock(viewport: DockViewport, blockers: DockRect[], previous?: Dock): Dock | undefined {
  const modes = viewport.compactOnly ? ['compact'] as const : ['vertical', 'compact'] as const;
  for (const mode of modes) {
    const order = previous?.mode === mode
      ? [previous.position, ...positions.filter(position => position !== previous.position)]
      : positions;
    for (const position of order) {
      const dock = { mode, position };
      const bounds = dockBounds(dock, viewport);
      if (bounds.top < viewport.top + 8 || bounds.bottom > viewport.bottom) continue;
      // Leave extra room to enter a new vertical position before abandoning an existing one.
      const yGap = previous?.mode === mode && previous.position === position ? 3 : 10;
      if (!blockers.some(rect => overlapsDock(bounds, rect, 1, yGap))) return dock;
    }
  }
}
