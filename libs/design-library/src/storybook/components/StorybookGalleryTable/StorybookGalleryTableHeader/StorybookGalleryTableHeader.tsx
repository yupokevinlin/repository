import type { ComponentPropsWithRef } from "react";

import { cn } from "../../../../tailwind/tailwindMerge/tailwindMerge";

export const StorybookGalleryTableHeader = ({
  className,
  ...props
}: ComponentPropsWithRef<"th">) => (
  <th
    className={cn(
      "px-4 h-12 text-center text-[1rem] font-bold text-fg-default whitespace-nowrap",
      "bg-bg-hover border border-border-default",
      className,
    )}
    {...props}
  />
);
