import type { ComponentPropsWithRef } from "react";

import { cn } from "../../../../tailwind/tailwindMerge/tailwindMerge";

export const StorybookGalleryTableCell = ({
  className,
  ...props
}: ComponentPropsWithRef<"td">) => (
  <td
    className={cn(
      "px-4 h-24 text-center align-middle text-fg-default border border-border-default",
      className,
    )}
    {...props}
  />
);
