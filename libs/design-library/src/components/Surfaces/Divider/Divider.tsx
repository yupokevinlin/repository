import type { ComponentPropsWithRef, ReactNode } from "react";

import { cn } from "../../../tailwind/tailwindMerge/tailwindMerge";
import {
  type DividerEmphasis,
  type DividerOrientation,
  DividerStyles,
} from "./DividerStyles";

export const dividerOrientations = [
  "horizontal",
  "vertical",
] as const satisfies Array<DividerOrientation>;

export const dividerEmphases = [
  "subtle",
  "default",
  "strong",
] as const satisfies Array<DividerEmphasis>;

export type { DividerEmphasis, DividerOrientation };

export type DividerProps = Omit<ComponentPropsWithRef<"hr">, "children"> & {
  /** Defaults to `"horizontal"`. A vertical divider needs a parent that gives it height. */
  orientation?: DividerOrientation;
  /** Prominence, mapped onto the three border tokens. Defaults to `"default"`. */
  emphasis?: DividerEmphasis;
  /**
   * Centred text with a rule either side. Horizontal only — a vertical divider
   * ignores it.
   */
  label?: ReactNode;
  /**
   * Set when the rule is pure decoration and the layout already communicates
   * the break. It is then hidden from assistive technology entirely, rather
   * than announcing a separator that means nothing.
   *
   * Defaults to `false`, because a divider usually *is* separating something —
   * nav sections, a card header from its body.
   */
  decorative?: boolean;
};

/**
 * A keyline between groups.
 *
 * Reach for it to separate nav sections, a card header from its body, or two
 * columns of a split row. It is trivial, and that is the point: without it you
 * get eleven ad-hoc `border-t` variations that drift apart.
 *
 * Renders a real `<hr>`, which carries `role="separator"` implicitly. The
 * labelled form is different: it is a text row with a decorative rule on each
 * side, and it deliberately has **no** separator role — `separator` does not
 * support name-from-content, so a labelled separator would announce the role
 * and swallow the label.
 *
 * @server-safe
 *
 * @example Between nav sections
 * ```tsx
 * <Divider />
 * ```
 *
 * @example Labelled, to head a group
 * ```tsx
 * <Divider label="Logistics" />
 * ```
 *
 * @example Between two inline figures
 * ```tsx
 * <div className="flex items-center gap-3">
 *   <Typography>Sell side</Typography>
 *   <Divider orientation="vertical" />
 *   <Typography>Buy side</Typography>
 * </div>
 * ```
 */
export const Divider = ({
  orientation: orientationProp,
  emphasis: emphasisProp,
  label,
  decorative,
  className: classNameProp,
  ...remainingProps
}: DividerProps) => {
  const orientation: DividerOrientation = orientationProp ?? "horizontal";
  const emphasis: DividerEmphasis = emphasisProp ?? "default";
  const className: string = classNameProp ?? "";
  const isDecorative: boolean = decorative ?? false;

  const rule = (
    <hr
      data-slot="divider"
      data-orientation={orientation}
      aria-orientation={
        isDecorative || orientation === "horizontal" ? undefined : "vertical"
      }
      aria-hidden={isDecorative ? "true" : undefined}
      className={cn(
        DividerStyles.ruleStyle({ orientation, emphasis }),
        label === undefined ? className : "",
      )}
      {...(label === undefined ? remainingProps : {})}
    />
  );

  if (label === undefined || orientation === "vertical") {
    return rule;
  }

  return (
    <div
      data-slot="divider-labelled"
      className={cn(DividerStyles.labelledStyle(), className)}
      {...remainingProps}
    >
      <hr
        data-slot="divider"
        aria-hidden="true"
        className={DividerStyles.ruleStyle({
          orientation,
          emphasis,
          flexible: true,
        })}
      />
      <span data-slot="divider-label" className={DividerStyles.labelStyle()}>
        {label}
      </span>
      <hr
        data-slot="divider"
        aria-hidden="true"
        className={DividerStyles.ruleStyle({
          orientation,
          emphasis,
          flexible: true,
        })}
      />
    </div>
  );
};
