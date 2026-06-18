import type { ComponentPropsWithRef } from "react";

import { cn } from "../../../tailwind/tailwindMerge/tailwindMerge";

const Table = ({ className, ...props }: ComponentPropsWithRef<"table">) => (
  <div className="overflow-x-auto rounded-md border border-border-default">
    <table
      className={cn("w-full border-collapse text-sm", className)}
      {...props}
    />
  </div>
);

const Th = ({ className, ...props }: ComponentPropsWithRef<"th">) => (
  <th
    className={cn(
      "px-4 py-2.5 text-left text-xs font-medium text-fg-subtle whitespace-nowrap",
      "bg-bg-hover border-b border-border-default",
      className,
    )}
    {...props}
  />
);

const Td = ({ className, ...props }: ComponentPropsWithRef<"td">) => (
  <td
    className={cn(
      "px-4 py-3 text-fg-default border-b border-border-default last:border-b-0",
      className,
    )}
    {...props}
  />
);

export const StorybookGalleryTable = Object.assign(Table, { Th, Td });
