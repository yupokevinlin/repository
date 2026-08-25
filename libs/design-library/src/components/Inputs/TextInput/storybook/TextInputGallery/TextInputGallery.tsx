import { StorybookGalleryTable } from "../../../../../storybook/components/StorybookGalleryTable/StorybookGalleryTable";
import { StorybookGalleryTableCell } from "../../../../../storybook/components/StorybookGalleryTable/StorybookGalleryTableCell/StorybookGalleryTableCell";
import { StorybookGalleryTableHeader } from "../../../../../storybook/components/StorybookGalleryTable/StorybookGalleryTableHeader/StorybookGalleryTableHeader";
import { StorybookGalleryWrapper } from "../../../../../storybook/components/StorybookGalleryWrapper/StorybookGalleryWrapper";
import { TextInput, textInputSizes, textInputVariants } from "../../TextInput";
import type { TextInputStorybookState } from "../../TextInputStyles";

const textInputStates: Array<{
  label: string;
  state?: TextInputStorybookState;
  disabled?: boolean;
  value?: string;
}> = [
  { label: "rest" },
  { label: "hover", state: "hover" },
  { label: "focus", state: "focus" },
  { label: "filled", value: "Input value" },
  { label: "disabled", disabled: true },
];

export const TextInputGallery = () => {
  const tableCellWidth = "min-w-[10rem]";
  return (
    <StorybookGalleryWrapper>
      {[...textInputSizes].reverse().map((size) => (
        <StorybookGalleryTable key={size} title={`size: ${size}`}>
          <thead>
            <tr>
              <StorybookGalleryTableHeader className={tableCellWidth}>
                {"variant"}
              </StorybookGalleryTableHeader>
              {textInputVariants.map((variant) => (
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
            {textInputStates.map(({ label, state, disabled, value }) => (
              <tr key={label}>
                <StorybookGalleryTableCell className="bg-bg-hover text-fg-default text-[1rem] font-bold text-center whitespace-nowrap min-w-[10rem]">
                  {label}
                </StorybookGalleryTableCell>
                {textInputVariants.map((variant) => (
                  <StorybookGalleryTableCell
                    key={variant}
                    className={tableCellWidth}
                  >
                    <TextInput
                      variant={variant}
                      size={size}
                      disabled={disabled}
                      placeholder="Placeholder"
                      defaultValue={value}
                      _storybookState={state}
                    />
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
