import type { JSX, KeyboardEvent, ReactNode } from "react";
import { useId } from "react";

import { useControllableState } from "../../../hooks/useControllableState";
import { cn } from "../../../tailwind/tailwindMerge/tailwindMerge";
import { AccordionStyles } from "./accordionStyles";

/**
 * `1` is missing on purpose. A page has one `<h1>`, and it is the page's title
 * — never a section that folds away.
 */
export type AccordionHeadingLevel = 2 | 3 | 4 | 5 | 6;

export const accordionHeadingLevels = [
  2, 3, 4, 5, 6,
] as const satisfies Array<AccordionHeadingLevel>;

export interface AccordionSection {
  /** Identifies the section in `expanded`. */
  value: string;
  /** The header's text. Also the trigger's accessible name. */
  label: ReactNode;
  /** What the section reveals. */
  content: ReactNode;
  /** Visible but not openable. Arrow keys skip it. */
  disabled?: boolean;
}

export interface AccordionProps {
  /** The sections, in the order they appear. */
  sections: Array<AccordionSection>;
  /**
   * Which heading level the headers sit at. **Required, with no default** —
   * the right level depends on what surrounds the accordion, which only the
   * page knows, and a wrong guess breaks the document outline a screen-reader
   * user navigates by. There is no `as` prop: the element is always a heading
   * (§11), only its level is a decision.
   */
  headingLevel: AccordionHeadingLevel;
  /** Values of the open sections. Controlled — pair with `onExpandedChange`. */
  expanded?: Array<string>;
  /** Open on first render when uncontrolled. Defaults to none. */
  defaultExpanded?: Array<string>;
  onExpandedChange?: (expanded: Array<string>) => void;
  /**
   * Whether more than one may be open. Defaults to `false` — opening one
   * closes the rest, which is what keeps a long accordion readable.
   */
  allowMultiple?: boolean;
  className?: string;
}

const chevron = (open: boolean): ReactNode => (
  <svg
    data-slot="accordion-indicator"
    className={AccordionStyles.indicatorStyle({ open })}
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
);

/**
 * A stack of sections that fold away, each headed by a real heading.
 *
 * Built on the same wiring as `Collapsible` — a `<button>` carrying
 * `aria-expanded` and `aria-controls`, content kept mounted and hidden with
 * the `hidden` attribute so what is inside survives a close and reopen. What
 * it adds is the part `Collapsible` cannot do alone: the header is a `<button>`
 * **inside a heading element**, which is what puts these sections into the
 * document outline, and one section closing when another opens.
 *
 * `headingLevel` is required. An accordion under an `<h2>` needs `<h3>`
 * headers, and the component cannot see what is above it.
 *
 * Uncontrolled by default. Down and Up move between headers, Home and End jump
 * to the ends — Tab still steps through them one at a time, as the APG asks.
 *
 * @client
 *
 * @example One section at a time
 * ```tsx
 * <Accordion
 *   headingLevel={3}
 *   sections={[
 *     { value: "terms", label: "Shipping terms", content: <Terms /> },
 *     { value: "items", label: "Line items", content: <LineItems /> },
 *   ]}
 * />
 * ```
 *
 * @example Several open, one of them on arrival
 * ```tsx
 * <Accordion
 *   headingLevel={2}
 *   allowMultiple
 *   defaultExpanded={["terms"]}
 *   sections={sections}
 * />
 * ```
 *
 * @example Controlled, so a deep link can open a section
 * ```tsx
 * <Accordion
 *   headingLevel={3}
 *   expanded={open}
 *   onExpandedChange={setOpen}
 *   sections={sections}
 * />
 * ```
 */
export const Accordion = ({
  sections,
  headingLevel,
  expanded: expandedProp,
  defaultExpanded,
  onExpandedChange,
  allowMultiple,
  className,
}: AccordionProps) => {
  const [expanded, setExpanded] = useControllableState<Array<string>>(
    expandedProp,
    defaultExpanded ?? [],
    onExpandedChange,
  );

  const id: string = useId();
  const Heading = `h${String(headingLevel)}` as keyof JSX.IntrinsicElements;

  const triggerId = (value: string): string => `${id}-trigger-${value}`;
  const contentId = (value: string): string => `${id}-content-${value}`;

  const toggle = (value: string): void => {
    const isOpen: boolean = expanded.includes(value);
    if (isOpen) {
      setExpanded(expanded.filter((entry: string) => entry !== value));
      return;
    }
    setExpanded(allowMultiple === true ? [...expanded, value] : [value]);
  };

  const focusHeader = (index: number): void => {
    const openable: Array<AccordionSection> = sections.filter(
      (section: AccordionSection) => section.disabled !== true,
    );
    if (openable.length === 0) {
      return;
    }
    const wrapped: number = (index + openable.length) % openable.length;
    document.getElementById(triggerId(openable[wrapped].value))?.focus();
  };

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>): void => {
    const openable: Array<AccordionSection> = sections.filter(
      (section: AccordionSection) => section.disabled !== true,
    );
    const current: number = openable.findIndex(
      (section: AccordionSection) =>
        triggerId(section.value) === event.currentTarget.id,
    );

    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        focusHeader(current + 1);
        return;
      case "ArrowUp":
        event.preventDefault();
        focusHeader(current - 1);
        return;
      case "Home":
        event.preventDefault();
        focusHeader(0);
        return;
      case "End":
        event.preventDefault();
        focusHeader(openable.length - 1);
        return;
      default:
    }
  };

  return (
    <div
      data-slot="accordion"
      className={cn(AccordionStyles.rootStyle(), className)}
    >
      {sections.map((section: AccordionSection) => {
        const open: boolean = expanded.includes(section.value);
        const disabled: boolean = section.disabled === true;

        return (
          <div
            key={section.value}
            data-slot="accordion-section"
            data-state={open ? "open" : "closed"}
          >
            <Heading className={AccordionStyles.headingStyle()}>
              <button
                data-slot="accordion-trigger"
                type="button"
                id={triggerId(section.value)}
                aria-expanded={open}
                aria-controls={contentId(section.value)}
                disabled={disabled}
                className={AccordionStyles.triggerStyle({ open })}
                onClick={() => {
                  toggle(section.value);
                }}
                onKeyDown={onKeyDown}
              >
                {chevron(open)}
                <span data-slot="accordion-label" className="min-w-0 flex-1">
                  {section.label}
                </span>
              </button>
            </Heading>
            <div
              data-slot="accordion-content"
              id={contentId(section.value)}
              role="region"
              aria-labelledby={triggerId(section.value)}
              // Hidden rather than unmounted, so a half-filled form inside a
              // section the user closed is still there when they reopen it.
              hidden={!open}
              className={AccordionStyles.contentStyle()}
            >
              {section.content}
            </div>
          </div>
        );
      })}
    </div>
  );
};
