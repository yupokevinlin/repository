import { StorybookGalleryTable } from "../../../../../storybook/components/StorybookGalleryTable/StorybookGalleryTable";
import { StorybookGalleryTableCell } from "../../../../../storybook/components/StorybookGalleryTable/StorybookGalleryTableCell/StorybookGalleryTableCell";
import { StorybookGalleryTableHeader } from "../../../../../storybook/components/StorybookGalleryTable/StorybookGalleryTableHeader/StorybookGalleryTableHeader";
import { StorybookGalleryWrapper } from "../../../../../storybook/components/StorybookGalleryWrapper/StorybookGalleryWrapper";
import { Switch, switchSizes } from "../../Switch";

export const SwitchGallery = () => {
  const cellWidth = "min-w-[16rem]";
  const labelCell =
    "bg-bg-hover text-fg-default text-[1rem] font-bold text-center whitespace-nowrap min-w-[10rem]";

  const states: Array<{
    label: string;
    checked?: boolean;
    disabled?: boolean;
  }> = [
    { label: "off", checked: false },
    { label: "on", checked: true },
    { label: "disabled", checked: false, disabled: true },
    { label: "disabled + on", checked: true, disabled: true },
  ];

  return (
    <StorybookGalleryWrapper>
      <StorybookGalleryTable title="state × size">
        <thead>
          <tr>
            <StorybookGalleryTableHeader className="min-w-[10rem]">
              {"state"}
            </StorybookGalleryTableHeader>
            {switchSizes.map((size) => (
              <StorybookGalleryTableHeader key={size} className={cellWidth}>
                {`size: ${size}`}
              </StorybookGalleryTableHeader>
            ))}
          </tr>
        </thead>
        <tbody>
          {states.map(({ label, checked, disabled }) => (
            <tr key={label}>
              <StorybookGalleryTableCell className={labelCell}>
                {label}
              </StorybookGalleryTableCell>
              {switchSizes.map((size) => (
                <StorybookGalleryTableCell
                  key={size}
                  align="left"
                  className={cellWidth}
                >
                  <Switch
                    label="Auto-hedge"
                    size={size}
                    checked={checked}
                    disabled={disabled}
                  />
                </StorybookGalleryTableCell>
              ))}
            </tr>
          ))}
        </tbody>
      </StorybookGalleryTable>

      <StorybookGalleryTable title="in a settings list">
        <thead>
          <tr>
            <StorybookGalleryTableHeader className="min-w-[10rem]">
              {"case"}
            </StorybookGalleryTableHeader>
            <StorybookGalleryTableHeader className="min-w-[24rem]">
              {"rendered"}
            </StorybookGalleryTableHeader>
          </tr>
        </thead>
        <tbody>
          <tr>
            <StorybookGalleryTableCell className={labelCell}>
              {"with hints"}
            </StorybookGalleryTableCell>
            <StorybookGalleryTableCell align="left" className="min-w-[24rem]">
              <div className="flex flex-col gap-3">
                <Switch
                  label="Auto-hedge"
                  defaultChecked
                  hint="Places the offsetting trade as soon as the deal is booked."
                />
                <Switch
                  label="Email me on settlement"
                  hint="Sent to the address on your profile."
                />
              </div>
            </StorybookGalleryTableCell>
          </tr>
        </tbody>
      </StorybookGalleryTable>
    </StorybookGalleryWrapper>
  );
};
