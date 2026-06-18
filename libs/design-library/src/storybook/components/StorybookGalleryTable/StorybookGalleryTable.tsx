import type { ComponentPropsWithRef } from "react";

import { cn } from "../../../tailwind/tailwindMerge/tailwindMerge";

type StorybookGalleryTableProps = ComponentPropsWithRef<"table"> & {
  title?: string;
};

export const StorybookGalleryTable = ({
  className,
  title,
  ...props
}: StorybookGalleryTableProps) => (
  <div className="sb-unstyled w-fit pr-5">
    {title && <p className="mb-2 text-[1.5rem] font-semibold">{title}</p>}
    <table className={cn("border-collapse text-sm", className)} {...props} />
  </div>
);
