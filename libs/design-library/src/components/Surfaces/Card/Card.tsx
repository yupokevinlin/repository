import type { ComponentPropsWithRef, ReactNode } from "react";

import { cn } from "../../../tailwind/tailwindMerge/tailwindMerge";
import {
  type CardElevation,
  type CardPadding,
  type CardSeverity,
  CardStyles,
} from "./CardStyles";

export const cardElevations = [
  "flat",
  "raised",
] as const satisfies Array<CardElevation>;

export const cardPaddings = [
  "none",
  "4",
  "6",
] as const satisfies Array<CardPadding>;

export const cardSeverities = [
  "info",
  "success",
  "warning",
  "error",
] as const satisfies Array<CardSeverity>;

export type { CardElevation, CardPadding, CardSeverity };

type CardBaseProps = Omit<
  ComponentPropsWithRef<"div">,
  "onClick" | "children"
> & {
  /** Defaults to `"flat"`. `"raised"` lifts the card off the page ground. */
  elevation?: CardElevation;
  /** Inner padding. `"4"` = 1rem, `"6"` = 1.5rem. Defaults to `"4"`. */
  padding?: CardPadding;
  /**
   * Adds an accent edge naming a state — an over-limit account, a shipment on
   * hold. Omit it for no accent; there is no `neutral` value.
   */
  severity?: CardSeverity;
  /** The card's contents. */
  children: ReactNode;
};

/**
 * `selectable` and `onClick` are required together. A card that looks
 * pressable but does nothing, or one that responds to clicks without looking
 * like it should, are both bugs — so neither is expressible.
 */
export type CardProps = CardBaseProps &
  (
    | { selectable?: never; onClick?: never; disabled?: never }
    | {
        selectable: true;
        onClick: ComponentPropsWithRef<"button">["onClick"];
        disabled?: boolean;
      }
  );

/**
 * The elevation and border primitive — a bordered surface with padding and an
 * optional accent edge.
 *
 * It does not prescribe a header or footer arrangement. That is `Panel`, which
 * lives in the composite layer: the moment a component's job is to *arrange*
 * other components, it stops being a primitive (§0).
 *
 * **A selectable card is a real `<button>`, and there is no `href`.** If it
 * navigates it is a link; if it performs an action it is a button (§11). To
 * navigate from a card, call `router.push()` in the handler, or put a link in
 * the content and stretch it (§11.2).
 *
 * @server-safe
 *
 * @example A plain surface
 * ```tsx
 * <Card>
 *   <Heading as="h3" size="title-md">Kanto Polymer KK</Heading>
 *   <Typography as="p" size="body-sm">Osaka · credit CAD 250,000</Typography>
 * </Card>
 * ```
 *
 * @example Selectable, in a list of deals
 * ```tsx
 * <Card selectable onClick={() => select(deal.id)} elevation="raised">
 *   <Heading as="h3" size="title-sm">{deal.number}</Heading>
 * </Card>
 * ```
 *
 * @example Accented, because the record is in trouble
 * ```tsx
 * <Card severity="error" padding="6">
 *   <Heading as="h3" size="title-md">AR overdue</Heading>
 *   <Typography as="p" size="body-sm">4 invoices past 30 days.</Typography>
 * </Card>
 * ```
 */
export const Card = ({
  elevation: elevationProp,
  padding: paddingProp,
  severity,
  selectable,
  onClick,
  disabled,
  className: classNameProp,
  children,
  ...remainingProps
}: CardProps) => {
  const elevation: CardElevation = elevationProp ?? "flat";
  const padding: CardPadding = paddingProp ?? "4";
  const className: string = classNameProp ?? "";

  const style: string = cn(
    CardStyles.cardStyle({
      elevation,
      padding,
      severity: severity ?? "none",
      selectable: selectable === true,
    }),
    className,
  );

  if (selectable === true) {
    return (
      <button
        type="button"
        data-slot="card"
        data-selectable="true"
        onClick={onClick}
        disabled={disabled}
        className={style}
        {...(remainingProps as ComponentPropsWithRef<"button">)}
      >
        {children}
      </button>
    );
  }

  return (
    <div data-slot="card" className={style} {...remainingProps}>
      {children}
    </div>
  );
};
