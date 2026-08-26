import type { ReactNode } from "react";
import { useEffect, useId } from "react";

import { useFocusTrap } from "../../../hooks/useFocusTrap";
import { useScrollLock } from "../../../hooks/useScrollLock";
import { cn } from "../../../tailwind/tailwindMerge/tailwindMerge";
import { IconButton } from "../../Buttons/IconButton";
import { Heading } from "../../Typography/Heading";
import { Portal } from "../Portal";
import {
  type DrawerSide,
  drawerSides,
  type DrawerSize,
  drawerSizes,
  DrawerStyles,
} from "./drawerStyles";

export { drawerSides, drawerSizes };
export type { DrawerSide, DrawerSize };

export interface DrawerProps {
  /** Controlled only — there is no `defaultOpen`, as on `Modal`. */
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** The heading. Also the sheet's accessible name. */
  title: ReactNode;
  /** The body. The only part that scrolls. */
  children: ReactNode;
  /** Actions, pinned to the bottom. */
  footer?: ReactNode;
  /** Which edge it comes in from. Defaults to `"right"`. */
  side?: DrawerSide;
  /**
   * Width on the left and right edges, height on the top and bottom ones.
   * Defaults to `"md"`.
   */
  size?: DrawerSize;
  /**
   * Whether the page behind is blocked. Defaults to `true`.
   *
   * A non-modal sheet has no scrim, does not trap focus and does not lock
   * scrolling: it sits alongside the page rather than over it, for a filter
   * panel or a detail pane the user reads while working the table behind.
   */
  modal?: boolean;
  /** Whether clicking the scrim closes it. Modal only. Defaults to `true`. */
  dismissOnScrimClick?: boolean;
  /** The close button's name. Defaults to `"Close"`. */
  closeLabel?: string;
  className?: string;
}

const closeIcon = (
  <svg
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    aria-hidden="true"
    className="size-full"
  >
    <path d="M4 4l8 8M12 4l-8 8" />
  </svg>
);

/**
 * A sheet that slides in from an edge.
 *
 * The modal variant behaves exactly like `Modal` — scrim, focus trap, scroll
 * lock, focus returned to the trigger — and is the default. Reach for it over
 * `Modal` when the content is a long form or a list that wants the full height
 * of the screen rather than a centred box.
 *
 * `modal={false}` is the interesting one, and the reason this is not a `Modal`
 * prop. A non-modal sheet **does not trap focus**, has no scrim and does not
 * lock scrolling: the user is meant to keep working the page behind it, so
 * Tab must be able to leave. Trapping focus in a sheet the user can still see
 * past is the worst of both — it looks dismissible and is not.
 *
 * Escape closes either variant.
 *
 * @client
 *
 * @example A filter panel over a table
 * ```tsx
 * <Drawer open={open} onOpenChange={setOpen} title="Filters">
 *   <FilterForm />
 * </Drawer>
 * ```
 *
 * @example A detail pane the user reads while working the table
 * ```tsx
 * <Drawer open={open} onOpenChange={setOpen} title="NPM-1042" modal={false}>
 *   <DealSummary deal={deal} />
 * </Drawer>
 * ```
 *
 * @example From the bottom, for a short sheet on a narrow screen
 * ```tsx
 * <Drawer open={open} onOpenChange={setOpen} title="Sort" side="bottom" size="sm">
 *   <SortOptions />
 * </Drawer>
 * ```
 */
export const Drawer = ({
  open,
  onOpenChange,
  title,
  children,
  footer,
  side,
  size,
  modal,
  dismissOnScrimClick,
  closeLabel,
  className,
}: DrawerProps) => {
  const titleId: string = useId();
  const isModal: boolean = modal !== false;

  const { containerRef } = useFocusTrap<HTMLDivElement>({
    active: open && isModal,
  });

  useScrollLock(open && isModal);

  useEffect(() => {
    if (!open) {
      return;
    }
    const onKeyDown = (event: KeyboardEvent): void => {
      if (event.key === "Escape") {
        event.stopPropagation();
        onOpenChange(false);
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onOpenChange]);

  if (!open) {
    return null;
  }

  return (
    <Portal>
      {isModal && (
        /* Presentational, as on Modal: the scrim is a pointer shortcut for the
           close button, and Escape is the keyboard route. */
        <div
          data-slot="drawer-scrim"
          role="presentation"
          className={DrawerStyles.scrimStyle()}
          onClick={() => {
            if (dismissOnScrimClick !== false) {
              onOpenChange(false);
            }
          }}
        />
      )}
      <div
        data-slot="drawer"
        role="dialog"
        // Only claimed by the modal variant. Saying aria-modal on a sheet the
        // user can still reach past would tell a screen reader the rest of the
        // page is unavailable when it is not.
        aria-modal={isModal ? "true" : undefined}
        aria-labelledby={titleId}
        ref={containerRef}
        className={cn(DrawerStyles.panelStyle({ side, size }), className)}
      >
        <div data-slot="drawer-header" className={DrawerStyles.headerStyle()}>
          <Heading
            as="h2"
            size="title-sm"
            id={titleId}
            className="min-w-0 flex-1"
          >
            {title}
          </Heading>
          <IconButton
            icon={closeIcon}
            aria-label={closeLabel ?? "Close"}
            size="8"
            variant="default-soft"
            onClick={() => {
              onOpenChange(false);
            }}
          />
        </div>
        <div data-slot="drawer-body" className={DrawerStyles.bodyStyle()}>
          {children}
        </div>
        {footer !== undefined && (
          <div data-slot="drawer-footer" className={DrawerStyles.footerStyle()}>
            {footer}
          </div>
        )}
      </div>
    </Portal>
  );
};
