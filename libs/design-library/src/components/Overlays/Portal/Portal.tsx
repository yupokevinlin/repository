import type { ReactNode } from "react";
import { useSyncExternalStore } from "react";
import { createPortal } from "react-dom";

export interface PortalProps {
  /** What to render outside the normal tree. */
  children: ReactNode;
  /**
   * Where to render it. Defaults to `document.body`, which is what every
   * overlay in the library wants — the point is to escape ancestor
   * `overflow`, `transform` and `z-index`.
   */
  container?: HTMLElement;
  /**
   * Renders in place instead of portalling. Useful when a consumer already
   * controls stacking and wants the overlay to stay inside their tree.
   */
  disabled?: boolean;
}

/**
 * Renders its children into `document.body` rather than where it sits in the
 * tree — the escape hatch every overlay needs.
 *
 * A popover inside a `overflow: hidden` panel gets clipped; one inside a
 * `transform`ed ancestor has its `position: fixed` silently re-anchored to
 * that ancestor rather than the viewport. Neither is fixable from the
 * overlay's own styles, so overlays leave the tree instead.
 *
 * Nothing is rendered on the first client pass. `document` does not exist on
 * the server, and rendering the portal during hydration would produce markup
 * the server never sent. Overlays are closed on first paint anyway, so there
 * is nothing to lose by waiting a tick.
 *
 * This is an explicit §2 exception: no styles file and no gallery, because it
 * renders nothing of its own.
 *
 * @client
 *
 * @example An overlay escaping a clipping panel
 * ```tsx
 * {open && (
 *   <Portal>
 *     <div style={{ position: "fixed", top, left }}>{content}</div>
 *   </Portal>
 * )}
 * ```
 *
 * @example Into a specific container
 * ```tsx
 * <Portal container={dialogElement}>{content}</Portal>
 * ```
 *
 * @example Leaving it in place
 * ```tsx
 * <Portal disabled={renderInline}>{content}</Portal>
 * ```
 */
/** Nothing ever changes, so the subscribe callback never fires. */
const subscribe = (): (() => void) => () => undefined;
const getClientSnapshot = (): boolean => true;
const getServerSnapshot = (): boolean => false;

export const Portal = ({ children, container, disabled }: PortalProps) => {
  // useSyncExternalStore rather than setState-in-an-effect: it reports false
  // on the server pass *and* during hydration, then true once the client is
  // live, which is exactly the boundary that matters here — and it does it
  // without a cascading render.
  const mounted: boolean = useSyncExternalStore(
    subscribe,
    getClientSnapshot,
    getServerSnapshot,
  );
  if (disabled === true) {
    return children;
  }

  if (!mounted) {
    return null;
  }

  return createPortal(children, container ?? document.body);
};
