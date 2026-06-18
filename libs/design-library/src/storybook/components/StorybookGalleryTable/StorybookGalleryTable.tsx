import type { ComponentPropsWithRef } from "react";

import { cn } from "../../../tailwind/tailwindMerge/tailwindMerge";

export const StorybookGalleryTable = ({
  className,
  ...props
}: ComponentPropsWithRef<"table">) => (
  <div className="sb-unstyled w-fit pr-5">
    <table className={cn("border-collapse text-sm", className)} {...props} />
  </div>
);
