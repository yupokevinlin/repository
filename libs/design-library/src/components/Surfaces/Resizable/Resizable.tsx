import type {
  KeyboardEvent,
  PointerEvent,
  ReactElement,
  ReactNode,
} from "react";
import { Children, isValidElement, useId, useRef, useState } from "react";

import { useControllableState } from "../../../hooks/useControllableState";
import { cn } from "../../../tailwind/tailwindMerge/tailwindMerge";
import {
  ResizablePanel,
  type ResizablePanelProps,
} from "./ResizablePanel/ResizablePanel";
import {
  initialSizes,
  type PanelConstraint,
  resize,
  toggleCollapse,
} from "./resizableSizes";
import {
  type ResizableOrientation,
  resizableOrientations,
  ResizableStyles,
} from "./resizableStyles";

export { resizableOrientations };
export type { ResizableOrientation };

export interface ResizableProps {
  /** `ResizablePanel` elements. A splitter goes between each pair. */
  children: ReactNode;
  /**
   * Which way the panes sit. `"horizontal"` puts them side by side, with
   * splitters that move left and right. Defaults to `"horizontal"`.
   */
  orientation?: ResizableOrientation;
  /** Panel sizes as percentages. Controlled — pair with `onSizesChange`. */
  sizes?: Array<number>;
  onSizesChange?: (sizes: Array<number>) => void;
  /** How far an arrow key moves a splitter, in percentage points. Defaults to 5. */
  step?: number;
  /**
   * Names each splitter — "Resize {label}". Defaults to `"panel"`, which makes
   * "Resize panel"; give something better where the page has more than one
   * group.
   */
  handleLabel?: string;
  className?: string;
}

/**
 * Panes the user can resize by dragging the line between them.
 *
 * Each splitter is an APG **window splitter**: `role="separator"`, focusable,
 * carrying `aria-valuenow` / `valuemin` / `valuemax` for the pane it controls
 * and `aria-controls` pointing at it. Arrow keys move it by `step`, Home and
 * End take it to its limits, and Enter collapses or reopens a `collapsible`
 * pane. All of which matters because a drag target is the one control a
 * keyboard user cannot improvise.
 *
 * A splitter moves **one boundary**: the two panes either side of it change
 * and their total is preserved exactly, so the panes further along do not
 * drift while the user drags, and dragging out and back lands where it
 * started.
 *
 * There is no `ResizableHandle` component. A handle carries no data of its
 * own — where the boundaries are is a consequence of where the panels are, and
 * `Resizable` already knows that (§9.1). Constraints live on the panel they
 * constrain.
 *
 * @client
 *
 * @example A list beside a detail pane
 * ```tsx
 * <Resizable handleLabel="the deal list">
 *   <ResizablePanel defaultSize={30} minSize={20} aria-label="Deals">
 *     <DealList />
 *   </ResizablePanel>
 *   <ResizablePanel aria-label="Deal">
 *     <DealDetail />
 *   </ResizablePanel>
 * </Resizable>
 * ```
 *
 * @example A pane the user can shut away
 * ```tsx
 * <Resizable>
 *   <ResizablePanel defaultSize={25} minSize={15} collapsible>
 *     <Filters />
 *   </ResizablePanel>
 *   <ResizablePanel>
 *     <Results />
 *   </ResizablePanel>
 * </Resizable>
 * ```
 *
 * @example Stacked, and driven from outside so the layout can be saved
 * ```tsx
 * <Resizable orientation="vertical" sizes={sizes} onSizesChange={persist}>
 *   <ResizablePanel><Chart /></ResizablePanel>
 *   <ResizablePanel><Table /></ResizablePanel>
 * </Resizable>
 * ```
 */
export const Resizable = ({
  children,
  orientation,
  sizes: sizesProp,
  onSizesChange,
  step,
  handleLabel,
  className,
}: ResizableProps) => {
  const id: string = useId();
  const groupRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState<number | null>(null);

  const panels: Array<ReactElement<ResizablePanelProps>> = Children.toArray(
    children,
  ).filter(
    (child): child is ReactElement<ResizablePanelProps> =>
      isValidElement(child) && child.type === ResizablePanel,
  );

  const constraints: Array<PanelConstraint> = panels.map(
    (panel: ReactElement<ResizablePanelProps>) => ({
      minSize: panel.props.minSize,
      maxSize: panel.props.maxSize,
      collapsible: panel.props.collapsible,
    }),
  );

  const [sizes, setSizes] = useControllableState<Array<number>>(
    sizesProp,
    initialSizes(
      panels.map(
        (panel: ReactElement<ResizablePanelProps>) => panel.props.defaultSize,
      ),
    ),
    onSizesChange,
  );

  const isVertical: boolean = orientation === "vertical";
  const stepSize: number = step ?? 5;
  const panelId = (index: number): string => `${id}-panel-${String(index)}`;

  const move = (handle: number, delta: number): void => {
    setSizes(resize({ sizes, handle, delta, constraints }));
  };

  const onKeyDown = (
    event: KeyboardEvent<HTMLDivElement>,
    handle: number,
  ): void => {
    const grow: string = isVertical ? "ArrowDown" : "ArrowRight";
    const shrink: string = isVertical ? "ArrowUp" : "ArrowLeft";

    switch (event.key) {
      case grow:
        event.preventDefault();
        move(handle, stepSize);
        return;
      case shrink:
        event.preventDefault();
        move(handle, -stepSize);
        return;
      case "Home":
        event.preventDefault();
        move(handle, -100);
        return;
      case "End":
        event.preventDefault();
        move(handle, 100);
        return;
      case "Enter":
        if (constraints[handle]?.collapsible === true) {
          event.preventDefault();
          setSizes(toggleCollapse({ sizes, handle, constraints }));
        }
        return;
      default:
    }
  };

  const onPointerMove = (
    event: PointerEvent<HTMLDivElement>,
    handle: number,
  ): void => {
    if (dragging !== handle) {
      return;
    }
    const group: HTMLDivElement | null = groupRef.current;
    if (group === null) {
      return;
    }

    const rect: DOMRect = group.getBoundingClientRect();
    const extent: number = isVertical ? rect.height : rect.width;
    if (extent === 0) {
      return;
    }

    // Measured from where the boundary is now rather than accumulated from the
    // pointer's own movement, so a drag that outruns the panel's limits does
    // not build up a debt the user has to drag back through.
    const pointer: number = isVertical
      ? event.clientY - rect.top
      : event.clientX - rect.left;
    const before: number = sizes
      .slice(0, handle)
      .reduce((total: number, size: number) => total + size, 0);
    const wanted: number = (pointer / extent) * 100 - before;

    move(handle, wanted - (sizes[handle] ?? 0));
  };

  return (
    <div
      data-slot="resizable"
      ref={groupRef}
      className={cn(ResizableStyles.groupStyle({ orientation }), className)}
    >
      {panels.map(
        (
          panel: ReactElement<ResizablePanelProps>,
          index: number,
        ): ReactNode => {
          const size: number = sizes[index] ?? 0;
          const isLast: boolean = index === panels.length - 1;
          const constraint: PanelConstraint | undefined = constraints[index];

          return (
            <div
              key={panelId(index)}
              className="contents"
              data-slot="resizable-pair"
            >
              <div
                data-slot="resizable-panel"
                id={panelId(index)}
                // A label needs something to attach to: a bare div is
                // not in the accessibility tree, so aria-label on it says
                // nothing at all.
                role={
                  panel.props["aria-label"] === undefined ? undefined : "group"
                }
                aria-label={panel.props["aria-label"]}
                data-collapsed={size === 0 ? "true" : undefined}
                // Grow rather than basis: the splitters take their own width
                // out of the container first, and the panes then share what is
                // actually left in proportion. A percentage basis would add up
                // to 100% plus the splitters and overflow by exactly that much.
                style={{ flexGrow: size, flexBasis: 0 }}
                className={cn(
                  ResizableStyles.panelStyle(),
                  panel.props.className,
                )}
              >
                {panel.props.children}
              </div>

              {!isLast && (
                <div
                  data-slot="resizable-handle"
                  role="separator"
                  tabIndex={0}
                  aria-orientation={isVertical ? "horizontal" : "vertical"}
                  aria-label={`Resize ${handleLabel ?? "panel"}`}
                  aria-controls={panelId(index)}
                  aria-valuenow={Math.round(size)}
                  aria-valuemin={Math.round(constraint?.minSize ?? 0)}
                  aria-valuemax={Math.round(constraint?.maxSize ?? 100)}
                  className={ResizableStyles.handleStyle({
                    orientation,
                    dragging: dragging === index,
                  })}
                  onKeyDown={(event) => {
                    onKeyDown(event, index);
                  }}
                  onPointerDown={(event) => {
                    // Captured, so a fast drag that leaves the 1px line still
                    // sends its moves here rather than to whatever is under it.
                    event.currentTarget.setPointerCapture(event.pointerId);
                    setDragging(index);
                  }}
                  onPointerMove={(event) => {
                    onPointerMove(event, index);
                  }}
                  onPointerUp={(event) => {
                    event.currentTarget.releasePointerCapture(event.pointerId);
                    setDragging(null);
                  }}
                  onPointerCancel={() => {
                    setDragging(null);
                  }}
                >
                  <span
                    data-slot="resizable-handle-grab"
                    aria-hidden="true"
                    className={ResizableStyles.handleGrabStyle({ orientation })}
                  />
                </div>
              )}
            </div>
          );
        },
      )}
    </div>
  );
};
