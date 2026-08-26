import type { ComponentPropsWithRef, ReactNode } from "react";

import { cn } from "../../../tailwind/tailwindMerge/tailwindMerge";
import {
  type ButtonSize,
  ButtonStyles,
  type ButtonVariant,
} from "../Button/ButtonStyles";
import { type LinkAppearance, LinkStyles } from "./LinkStyles";

export const linkAppearances = [
  "inline",
  "standalone",
  "button",
] as const satisfies Array<LinkAppearance>;

export type { LinkAppearance };

type LinkBaseProps = Omit<ComponentPropsWithRef<"a">, "href"> & {
  /**
   * Where it goes. Required — an anchor without an `href` is not a link, is
   * not focusable, and does not respond to Enter.
   */
  href: string;
  /** The link text. */
  children: ReactNode;
  /**
   * Opens in a new tab, with `rel="noopener noreferrer"` and an outbound
   * arrow. Warn the user before you take them off the page.
   */
  external?: boolean;
  /**
   * What `external` means, for a screen reader. Defaults to
   * `"(opens in a new tab)"` — the arrow alone says nothing.
   */
  externalLabel?: string;
  /**
   * Marks the link unavailable. Rendered with `aria-disabled` and no `href`,
   * because a disabled anchor has no native state to switch off.
   */
  disabled?: boolean;
};

export type LinkProps = LinkBaseProps &
  (
    | {
        /** Defaults to `"inline"`. */
        appearance?: "inline" | "standalone";
        variant?: never;
        size?: never;
      }
    | {
        appearance: "button";
        /** Only with `appearance="button"`. Defaults to `"primary-solid"`. */
        variant?: ButtonVariant;
        /** Only with `appearance="button"`. Defaults to `"10"`. */
        size?: ButtonSize;
      }
  );

/**
 * Navigation. Always an `<a>`, never a `<button>` — the two are not
 * interchangeable: only Enter follows a link, Space and Enter both press a
 * button, and only a link offers "open in new tab" on the context menu.
 *
 * `appearance="button"` borrows `Button`'s own cva rather than restating it,
 * so a call-to-action link and the button beside it cannot drift apart. It
 * changes how the link looks and nothing about what it is.
 *
 * This is a plain anchor and does not do client-side routing. Inside the Next
 * app, wrap it or reach for `next/link` where a full page load would be wrong.
 *
 * @server-safe
 *
 * @example In a sentence
 * ```tsx
 * <Typography as="p">
 *   See the <Link href="/app/deals/1042">deal record</Link> for terms.
 * </Typography>
 * ```
 *
 * @example On its own line
 * ```tsx
 * <Link href="/app/deals" appearance="standalone">All deals</Link>
 * ```
 *
 * @example Leaving the app
 * ```tsx
 * <Link href="https://www.bankofcanada.ca/rates/" external>
 *   Bank of Canada rates
 * </Link>
 * ```
 *
 * @example A call to action, styled as a button but still a link
 * ```tsx
 * <Link href="/app/deals/new" appearance="button" variant="primary-solid">
 *   New deal
 * </Link>
 * ```
 */
export const Link = ({
  href,
  children,
  external,
  externalLabel: externalLabelProp,
  disabled,
  appearance: appearanceProp,
  variant: variantProp,
  size: sizeProp,
  className: classNameProp,
  ...remainingProps
}: LinkProps) => {
  const appearance: LinkAppearance = appearanceProp ?? "inline";
  const externalLabel: string = externalLabelProp ?? "(opens in a new tab)";

  const appearanceClassName: string =
    appearance === "button"
      ? ButtonStyles.buttonStyle({
          variant: variantProp ?? "primary-solid",
          size: sizeProp ?? "10",
        })
      : LinkStyles.linkStyle({ appearance });

  return (
    <a
      data-slot="link"
      // A disabled anchor is not a native state. Dropping the href is what
      // actually removes it from the tab order and stops it navigating;
      // aria-disabled is what tells a screen reader why.
      href={disabled === true ? undefined : href}
      aria-disabled={disabled === true ? true : undefined}
      target={external === true ? "_blank" : undefined}
      rel={external === true ? "noopener noreferrer" : undefined}
      className={cn(appearanceClassName, classNameProp)}
      {...remainingProps}
    >
      {children}
      {external === true && (
        <>
          <svg
            data-slot="link-external-icon"
            className={LinkStyles.externalIconStyle()}
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M6 3h7v7" />
            <path d="M13 3L3 13" />
          </svg>
          <span data-slot="link-external-label" className="sr-only">
            {externalLabel}
          </span>
        </>
      )}
    </a>
  );
};
