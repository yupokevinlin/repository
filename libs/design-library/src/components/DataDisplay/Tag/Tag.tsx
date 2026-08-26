import type { ComponentPropsWithRef, ReactNode } from "react";

import { cn } from "../../../tailwind/tailwindMerge/tailwindMerge";
import { type TagAppearance, type TagSize, TagStyles } from "./TagStyles";

export const tagAppearances = [
  "solid",
  "soft",
  "outline",
] as const satisfies Array<TagAppearance>;

export const tagSizes = ["5", "6"] as const satisfies Array<TagSize>;

export type { TagAppearance, TagSize };

type TagBaseProps = ComponentPropsWithRef<"span"> & {
  /** Fill style. Defaults to `"soft"`. */
  appearance?: TagAppearance;
  /**
   * Height as a Tailwind size unit (1 unit = 4px). `"5"` = 20px, `"6"` = 24px.
   * Defaults to `"6"`.
   */
  size?: TagSize;
  /** Icon rendered before the label. Sized to match `size`. */
  icon?: ReactNode;
  /** Greys the tag out and disables removal. */
  disabled?: boolean;
  /** The label. */
  children: ReactNode;
};

/**
 * `onRemove` and `removeLabel` are required together, so a remove button can
 * never ship without an accessible name that says what it removes (§15).
 */
export type TagProps = TagBaseProps &
  (
    | { onRemove?: never; removeLabel?: never }
    | { onRemove: () => void; removeLabel: string }
  );

/**
 * A user-applied, removable label — trade lanes, product categories, the
 * filters behind a saved view.
 *
 * Reach for it when the value came from a person and they can take it away
 * again. For a record's state or a count, use `Badge`: it carries severity,
 * and it is not interactive.
 *
 * **Tag has no `severity` on purpose.** A tag labels user data, so colouring
 * it would be decoration — and §15.2 reserves semantic colour for state.
 * `appearance` changes the fill, never the meaning.
 *
 * The tag itself is not interactive. Only the remove button is focusable, and
 * it is a real `<button>`, so Enter and Space both work.
 *
 * @server-safe
 *
 * @example A plain label
 * ```tsx
 * <Tag>JP/CN lane</Tag>
 * ```
 *
 * @example Removable, with a name that says what goes away
 * ```tsx
 * <Tag onRemove={() => dropFilter("chemicals")} removeLabel="Remove Chemicals filter">
 *   Chemicals
 * </Tag>
 * ```
 *
 * @example A row of saved-view filters
 * ```tsx
 * {filters.map((filter) => (
 *   <Tag
 *     key={filter.id}
 *     size="5"
 *     appearance="outline"
 *     onRemove={() => dropFilter(filter.id)}
 *     removeLabel={`Remove ${filter.label} filter`}
 *   >
 *     {filter.label}
 *   </Tag>
 * ))}
 * ```
 */
export const Tag = ({
  appearance: appearanceProp,
  size: sizeProp,
  icon,
  disabled,
  onRemove,
  removeLabel,
  className: classNameProp,
  children,
  ...remainingProps
}: TagProps) => {
  const appearance: TagAppearance = appearanceProp ?? "soft";
  const size: TagSize = sizeProp ?? "6";
  const className: string = classNameProp ?? "";
  const removable: boolean = onRemove !== undefined;

  return (
    <span
      data-slot="tag"
      className={cn(
        TagStyles.tagStyle({
          appearance,
          size,
          removable,
          disabled: disabled ?? false,
        }),
        className,
      )}
      {...remainingProps}
    >
      {icon && (
        <span
          data-slot="tag-icon"
          aria-hidden="true"
          className={TagStyles.iconStyle({ size })}
        >
          {icon}
        </span>
      )}
      <span data-slot="tag-label">{children}</span>
      {removable && (
        <button
          type="button"
          data-slot="tag-remove"
          aria-label={removeLabel}
          disabled={disabled}
          onClick={onRemove}
          className={TagStyles.removeStyle({ size })}
        >
          <svg
            viewBox="0 0 16 16"
            fill="none"
            aria-hidden="true"
            className="size-3"
          >
            <path
              d="M4 4l8 8M12 4l-8 8"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>
      )}
    </span>
  );
};
