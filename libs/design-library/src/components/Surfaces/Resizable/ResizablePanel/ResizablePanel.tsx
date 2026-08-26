import type { ReactNode } from "react";

export interface ResizablePanelProps {
  children: ReactNode;
  /** Percentage of the group it starts at. The rest share what is left. */
  defaultSize?: number;
  /** Smallest it may be dragged to, as a percentage. Defaults to 0. */
  minSize?: number;
  /** Largest it may be dragged to. Defaults to 100. */
  maxSize?: number;
  /**
   * Whether dragging past `minSize` snaps it shut rather than stopping there,
   * and whether Enter on its handle toggles it.
   */
  collapsible?: boolean;
  /** Names the panel. Worth giving where the group has more than two. */
  "aria-label"?: string;
  className?: string;
}

/**
 * One pane inside a `Resizable`.
 *
 * Declarative data only — **this component never renders** (§9.2). `Resizable`
 * reads these props and renders the panes and the splitters between them,
 * because only it knows where the boundaries fall, what each splitter
 * controls, and how a drag on one affects its neighbour.
 *
 * @server-safe
 */
export const ResizablePanel = (_props: ResizablePanelProps): null => null;
