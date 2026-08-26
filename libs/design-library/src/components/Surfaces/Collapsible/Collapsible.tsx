import type { ComponentPropsWithRef, ReactNode } from "react";
import { useId } from "react";

import { useControllableState } from "../../../hooks/useControllableState";
import { cn } from "../../../tailwind/tailwindMerge/tailwindMerge";
import { CollapsibleStyles } from "./CollapsibleStyles";

export type CollapsibleProps = Omit<
  ComponentPropsWithRef<"div">,
  "children" | "onChange"
> & {
  /**
   * The trigger's content. A plain string in almost every case — this is what
   * the disclosure is called, so it is the button's accessible name.
   */
  label: ReactNode;
  /** What is revealed. */
  children: ReactNode;
  /** Controlled open state. Pair with `onOpenChange`. */
  open?: boolean;
  /** Initial open state when uncontrolled. Defaults to `false`. */
  defaultOpen?: boolean;
  /** Fires on every open/close, in both controlled and uncontrolled mode. */
  onOpenChange?: (open: boolean) => void;
  /** Locks the disclosure at its current state. */
  disabled?: boolean;
};

/**
 * A labelled section that opens and closes — the disclosure primitive.
 *
 * `Accordion` and `Sidebar` are both built from this, so the ARIA wiring lives
 * here once: a real `<button>` carrying `aria-expanded` and pointing at the
 * content through `aria-controls`.
 *
 * The content stays mounted and is hidden with the `hidden` attribute, which
 * keeps it out of the accessibility tree and out of the tab order while
 * preserving whatever state lives inside it across a close and reopen.
 *
 * Uncontrolled by default; pass `open` to drive it yourself.
 *
 * @client
 *
 * @example Uncontrolled
 * ```tsx
 * <Collapsible label="Shipping terms">
 *   <Typography>FOB Vancouver, 30 days.</Typography>
 * </Collapsible>
 * ```
 *
 * @example Open on first render
 * ```tsx
 * <Collapsible label="Line items" defaultOpen>
 *   <LineItemTable items={items} />
 * </Collapsible>
 * ```
 *
 * @example Controlled — one section at a time
 * ```tsx
 * const [openSection, setOpenSection] = useState<string>("terms");
 *
 * <Collapsible
 *   label="Shipping terms"
 *   open={openSection === "terms"}
 *   onOpenChange={(open) => setOpenSection(open ? "terms" : "")}
 * >
 *   <Typography>FOB Vancouver, 30 days.</Typography>
 * </Collapsible>
 * ```
 */
export const Collapsible = ({
  label,
  children,
  open: openProp,
  defaultOpen,
  onOpenChange,
  disabled,
  id: idProp,
  className: classNameProp,
  ...remainingProps
}: CollapsibleProps) => {
  const [open, setOpen] = useControllableState<boolean>(
    openProp,
    defaultOpen ?? false,
    onOpenChange,
  );

  const generatedId: string = useId();
  const id: string = idProp ?? generatedId;
  const triggerId = `${id}-trigger`;
  const contentId = `${id}-content`;

  return (
    <div
      data-slot="collapsible"
      data-state={open ? "open" : "closed"}
      id={id}
      className={cn(CollapsibleStyles.rootStyle(), classNameProp)}
      {...remainingProps}
    >
      <button
        data-slot="collapsible-trigger"
        type="button"
        id={triggerId}
        aria-expanded={open}
        aria-controls={contentId}
        disabled={disabled}
        onClick={() => {
          setOpen(!open);
        }}
        className={CollapsibleStyles.triggerStyle()}
      >
        <svg
          data-slot="collapsible-indicator"
          className={CollapsibleStyles.indicatorStyle({ open })}
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M6 3l5 5-5 5" />
        </svg>
        {label}
      </button>
      <div
        data-slot="collapsible-content"
        id={contentId}
        role="region"
        aria-labelledby={triggerId}
        hidden={!open}
        className={CollapsibleStyles.contentStyle()}
      >
        {children}
      </div>
    </div>
  );
};
