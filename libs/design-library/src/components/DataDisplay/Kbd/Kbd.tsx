import { type ComponentPropsWithRef, Fragment, type ReactNode } from "react";

import { cn } from "../../../tailwind/tailwindMerge/tailwindMerge";
import { type KbdSize, KbdStyles } from "./KbdStyles";

export const kbdSizes = ["5", "6"] as const satisfies Array<KbdSize>;

export type { KbdSize };

export type KbdProps = Omit<ComponentPropsWithRef<"kbd">, "children"> & {
  /**
   * The keys, in press order. Each renders as its own `<kbd>`.
   *
   * Pass exactly what the user should press — this component does **not**
   * detect the platform. `["⌘", "K"]` on macOS and `["Ctrl", "K"]` elsewhere
   * is the app's decision, made once, not a per-render `navigator` check that
   * would make every `Kbd` client-only and wrong on first paint.
   */
  keys: Array<string>;
  /**
   * Height as a Tailwind size unit (1 unit = 4px). `"5"` = 20px, `"6"` = 24px.
   * Defaults to `"6"`.
   */
  size?: KbdSize;
  /**
   * Rendered between keys and hidden from assistive technology, so the
   * accessible name stays “Ctrl K” rather than “Ctrl plus K”. Omit it and the
   * keys are simply spaced apart.
   */
  separator?: ReactNode;
};

/**
 * A key hint — the palette's Ctrl-K, a shortcut shown beside a menu item.
 *
 * Renders nested `<kbd>` elements, which is how HTML represents a key
 * combination: an outer `<kbd>` for the chord, one inner `<kbd>` per key.
 *
 * This is presentation only. **The shortcut must also exist in the accessible
 * name of the thing it triggers** (§15) — a `Kbd` beside a button does not
 * tell a screen reader user that the button has a shortcut, so give the button
 * an `aria-keyshortcuts` or say it in its label.
 *
 * @server-safe
 *
 * @example A chord
 * ```tsx
 * <Kbd keys={["Ctrl", "K"]} separator="+" />
 * ```
 *
 * @example A single key
 * ```tsx
 * <Kbd keys={["Esc"]} />
 * ```
 *
 * @example Inside a search field, at the smaller step
 * ```tsx
 * <SearchInput
 *   placeholder="Search deals, containers, invoices…"
 *   shortcutHint={<Kbd size="5" keys={["Ctrl", "K"]} />}
 * />
 * ```
 */
export const Kbd = ({
  keys,
  size: sizeProp,
  separator,
  className: classNameProp,
  ...remainingProps
}: KbdProps) => {
  const size: KbdSize = sizeProp ?? "6";
  const className: string = classNameProp ?? "";

  return (
    <kbd
      data-slot="kbd"
      className={cn(
        KbdStyles.wrapperStyle(),
        separator === undefined ? KbdStyles.gapStyle({ size }) : "",
        className,
      )}
      {...remainingProps}
    >
      {keys.map((key, index) => (
        <Fragment key={`${key}-${String(index)}`}>
          {index > 0 && separator !== undefined && (
            <span
              data-slot="kbd-separator"
              aria-hidden="true"
              className={KbdStyles.separatorStyle({ size })}
            >
              {separator}
            </span>
          )}
          <kbd data-slot="kbd-key" className={KbdStyles.keyStyle({ size })}>
            {key}
          </kbd>
        </Fragment>
      ))}
    </kbd>
  );
};
