import type { ComponentPropsWithRef } from "react";

import { cn } from "../../../../tailwind/tailwindMerge/tailwindMerge";

export type StorybookGalleryTableCellAlign = "center" | "left";

export type StorybookGalleryTableCellProps = ComponentPropsWithRef<"td"> & {
  /**
   * How the cell's contents sit.
   *
   * `"center"` suits an inline component — a Badge, a Kbd, a Button — which is
   * smaller than its cell and reads best centred.
   *
   * `"left"` is required for anything block-level that carries prose. An Alert
   * or a Card centred in a gallery misrepresents how it actually renders, and
   * a gallery that lies about a component is worse than no gallery at all.
   *
   * Defaults to `"center"`.
   */
  align?: StorybookGalleryTableCellAlign;
};

export const StorybookGalleryTableCell = ({
  align = "center",
  className,
  ...props
}: StorybookGalleryTableCellProps) => (
  <td
    className={cn(
      "px-4 h-24 align-middle text-fg-default border border-border-default",
      align === "center" ? "text-center" : "text-left",
      className,
    )}
    {...props}
  />
);
