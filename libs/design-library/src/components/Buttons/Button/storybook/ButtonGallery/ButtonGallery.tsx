import { StorybookGalleryTable } from "../../../../../storybook/components/StorybookGalleryTable/StorybookGalleryTable";
import { StorybookGalleryTableCell } from "../../../../../storybook/components/StorybookGalleryTable/StorybookGalleryTableCell/StorybookGalleryTableCell";
import { StorybookGalleryTableHeader } from "../../../../../storybook/components/StorybookGalleryTable/StorybookGalleryTableHeader/StorybookGalleryTableHeader";
import { StorybookGalleryWrapper } from "../../../../../storybook/components/StorybookGalleryWrapper/StorybookGalleryWrapper";
import { Button, buttonSizes, buttonVariants } from "../../Button";
import type { ButtonStorybookState } from "../../ButtonStyles";

const buttonStates: {
  label: string;
  state?: ButtonStorybookState;
  disabled?: boolean;
}[] = [
  { label: "rest" },
  { label: "hover", state: "hover" },
  { label: "active", state: "active" },
  { label: "disabled", disabled: true },
  { label: "focus", state: "focus" },
];

export const ButtonGallery = () => {
  const tableCellWidth = "min-w-[10rem]";
  return (
    <StorybookGalleryWrapper>
      {[...buttonSizes].reverse().map((size) => (
        <StorybookGalleryTable key={size} title={`size: ${size}`}>
          <thead>
            <tr>
              <StorybookGalleryTableHeader className={tableCellWidth}>
                {"variant"}
              </StorybookGalleryTableHeader>
              {buttonVariants.map((variant) => (
                <StorybookGalleryTableHeader
                  key={variant}
                  className={tableCellWidth}
                >
                  {variant}
                </StorybookGalleryTableHeader>
              ))}
            </tr>
          </thead>
          <tbody>
            {buttonStates.map(({ label, state, disabled }) => (
              <tr key={label}>
                <StorybookGalleryTableCell className="bg-bg-hover text-fg-default text-sm font-bold text-center whitespace-nowrap min-w-[10rem]">
                  {label}
                </StorybookGalleryTableCell>
                {buttonVariants.map((variant) => (
                  <StorybookGalleryTableCell
                    key={variant}
                    className={tableCellWidth}
                  >
                    <Button
                      variant={variant}
                      size={size}
                      disabled={disabled}
                      _storybookState={state}
                    >
                      Button
                    </Button>
                  </StorybookGalleryTableCell>
                ))}
              </tr>
            ))}
          </tbody>
        </StorybookGalleryTable>
      ))}
    </StorybookGalleryWrapper>
  );
};
