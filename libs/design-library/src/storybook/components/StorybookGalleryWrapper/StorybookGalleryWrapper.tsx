import type { ComponentPropsWithRef } from "react";

export const StorybookGalleryWrapper = ({
  children,
  ...props
}: ComponentPropsWithRef<"div">) => (
  <div className="theme-light flex flex-col gap-[2rem]" {...props}>
    {children}
  </div>
);
