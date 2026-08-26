import { StorybookGalleryTable } from "../../../../../storybook/components/StorybookGalleryTable/StorybookGalleryTable";
import { StorybookGalleryTableCell } from "../../../../../storybook/components/StorybookGalleryTable/StorybookGalleryTableCell/StorybookGalleryTableCell";
import { StorybookGalleryTableHeader } from "../../../../../storybook/components/StorybookGalleryTable/StorybookGalleryTableHeader/StorybookGalleryTableHeader";
import { StorybookGalleryWrapper } from "../../../../../storybook/components/StorybookGalleryWrapper/StorybookGalleryWrapper";
import { Toggle, toggleSizes } from "../../Toggle";

const shownVariants = [
  "default-outline",
  "default-soft",
  "primary-outline",
] as const;

export const ToggleGallery = () => {
  const cellWidth = "min-w-[12rem]";
  const labelCell =
    "bg-bg-hover text-fg-default text-[1rem] font-bold text-center whitespace-nowrap min-w-[10rem]";

  return (
    <StorybookGalleryWrapper>
      <StorybookGalleryTable title="state × size">
        <thead>
          <tr>
            <StorybookGalleryTableHeader className="min-w-[10rem]">
              {"state"}
            </StorybookGalleryTableHeader>
            {toggleSizes.map((size) => (
              <StorybookGalleryTableHeader key={size} className={cellWidth}>
                {`size: ${size}`}
              </StorybookGalleryTableHeader>
            ))}
          </tr>
        </thead>
        <tbody>
          {[
            { label: "up", pressed: false },
            { label: "down", pressed: true },
            { label: "disabled", pressed: false, disabled: true },
            { label: "disabled + down", pressed: true, disabled: true },
          ].map(({ label, pressed, disabled }) => (
            <tr key={label}>
              <StorybookGalleryTableCell className={labelCell}>
                {label}
              </StorybookGalleryTableCell>
              {toggleSizes.map((size) => (
                <StorybookGalleryTableCell key={size} className={cellWidth}>
                  <Toggle size={size} pressed={pressed} disabled={disabled}>
                    {"My deals"}
                  </Toggle>
                </StorybookGalleryTableCell>
              ))}
            </tr>
          ))}
        </tbody>
      </StorybookGalleryTable>

      <StorybookGalleryTable title="variant — the unpressed appearance">
        <thead>
          <tr>
            <StorybookGalleryTableHeader className="min-w-[10rem]">
              {"variant"}
            </StorybookGalleryTableHeader>
            <StorybookGalleryTableHeader className={cellWidth}>
              {"up"}
            </StorybookGalleryTableHeader>
            <StorybookGalleryTableHeader className={cellWidth}>
              {"down"}
            </StorybookGalleryTableHeader>
          </tr>
        </thead>
        <tbody>
          {shownVariants.map((variant) => (
            <tr key={variant}>
              <StorybookGalleryTableCell className={labelCell}>
                {variant}
              </StorybookGalleryTableCell>
              <StorybookGalleryTableCell className={cellWidth}>
                <Toggle variant={variant} pressed={false}>
                  {"My deals"}
                </Toggle>
              </StorybookGalleryTableCell>
              <StorybookGalleryTableCell className={cellWidth}>
                <Toggle variant={variant} pressed>
                  {"My deals"}
                </Toggle>
              </StorybookGalleryTableCell>
            </tr>
          ))}
        </tbody>
      </StorybookGalleryTable>
    </StorybookGalleryWrapper>
  );
};
