import type { ComponentPropsWithRef } from "react";

export const StorybookGalleryWrapper = ({
  children,
  ...props
}: ComponentPropsWithRef<"div">) => (
  <div className="theme-light" {...props}>
    {children}
  </div>
);
