import type { ReactNode } from "react";

import { StorybookGalleryTable } from "../../../../../storybook/components/StorybookGalleryTable/StorybookGalleryTable";
import { StorybookGalleryTableCell } from "../../../../../storybook/components/StorybookGalleryTable/StorybookGalleryTableCell/StorybookGalleryTableCell";
import { StorybookGalleryTableHeader } from "../../../../../storybook/components/StorybookGalleryTable/StorybookGalleryTableHeader/StorybookGalleryTableHeader";
import { StorybookGalleryWrapper } from "../../../../../storybook/components/StorybookGalleryWrapper/StorybookGalleryWrapper";
import { buttonSizes, buttonVariants } from "../../../Button/Button";
import { IconButton } from "../../IconButton";

/** A close X, drawn inline so the gallery pulls in no icon dependency. */
const closeIcon: ReactNode = (
  <svg
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    aria-hidden="true"
    className="size-full"
  >
    <path d="M4 4l8 8M12 4l-8 8" />
  </svg>
);

export const IconButtonGallery = () => {
  const cellWidth = "min-w-[8rem]";
  const labelCell =
    "bg-bg-hover text-fg-default text-[1rem] font-bold text-center whitespace-nowrap min-w-[10rem]";

  return (
    <StorybookGalleryWrapper>
      <StorybookGalleryTable title="variant × size">
        <thead>
          <tr>
            <StorybookGalleryTableHeader className="min-w-[10rem]">
              {"variant"}
            </StorybookGalleryTableHeader>
            {buttonSizes.map((size) => (
              <StorybookGalleryTableHeader key={size} className={cellWidth}>
                {`size: ${size}`}
              </StorybookGalleryTableHeader>
            ))}
          </tr>
        </thead>
        <tbody>
          {buttonVariants.map((variant) => (
            <tr key={variant}>
              <StorybookGalleryTableCell className={labelCell}>
                {variant}
              </StorybookGalleryTableCell>
              {buttonSizes.map((size) => (
                <StorybookGalleryTableCell key={size} className={cellWidth}>
                  <IconButton
                    icon={closeIcon}
                    aria-label="Close"
                    variant={variant}
                    size={size}
                  />
                </StorybookGalleryTableCell>
              ))}
            </tr>
          ))}
        </tbody>
      </StorybookGalleryTable>

      <StorybookGalleryTable title="state">
        <thead>
          <tr>
            <StorybookGalleryTableHeader className="min-w-[10rem]">
              {"state"}
            </StorybookGalleryTableHeader>
            {buttonSizes.map((size) => (
              <StorybookGalleryTableHeader key={size} className={cellWidth}>
                {`size: ${size}`}
              </StorybookGalleryTableHeader>
            ))}
          </tr>
        </thead>
        <tbody>
          {[
            { label: "rest" },
            { label: "loading", loading: true },
            { label: "disabled", disabled: true },
          ].map(({ label, loading, disabled }) => (
            <tr key={label}>
              <StorybookGalleryTableCell className={labelCell}>
                {label}
              </StorybookGalleryTableCell>
              {buttonSizes.map((size) => (
                <StorybookGalleryTableCell key={size} className={cellWidth}>
                  <IconButton
                    icon={closeIcon}
                    aria-label="Close"
                    size={size}
                    loading={loading}
                    disabled={disabled}
                  />
                </StorybookGalleryTableCell>
              ))}
            </tr>
          ))}
        </tbody>
      </StorybookGalleryTable>
    </StorybookGalleryWrapper>
  );
};
