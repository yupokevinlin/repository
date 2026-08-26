import { StorybookGalleryTable } from "../../../../../storybook/components/StorybookGalleryTable/StorybookGalleryTable";
import { StorybookGalleryTableCell } from "../../../../../storybook/components/StorybookGalleryTable/StorybookGalleryTableCell/StorybookGalleryTableCell";
import { StorybookGalleryTableHeader } from "../../../../../storybook/components/StorybookGalleryTable/StorybookGalleryTableHeader/StorybookGalleryTableHeader";
import { StorybookGalleryWrapper } from "../../../../../storybook/components/StorybookGalleryWrapper/StorybookGalleryWrapper";
import { Checkbox, checkboxSizes } from "../../Checkbox";

export const CheckboxGallery = () => {
  const cellWidth = "min-w-[16rem]";
  const labelCell =
    "bg-bg-hover text-fg-default text-[1rem] font-bold text-center whitespace-nowrap min-w-[10rem]";

  const states: Array<{
    label: string;
    checked?: boolean;
    indeterminate?: boolean;
    disabled?: boolean;
  }> = [
    { label: "unchecked" },
    { label: "checked", checked: true },
    { label: "indeterminate", indeterminate: true },
    { label: "disabled", disabled: true },
    { label: "disabled + checked", checked: true, disabled: true },
  ];

  return (
    <StorybookGalleryWrapper>
      <StorybookGalleryTable title="state × size">
        <thead>
          <tr>
            <StorybookGalleryTableHeader className="min-w-[10rem]">
              {"state"}
            </StorybookGalleryTableHeader>
            {checkboxSizes.map((size) => (
              <StorybookGalleryTableHeader key={size} className={cellWidth}>
                {`size: ${size}`}
              </StorybookGalleryTableHeader>
            ))}
          </tr>
        </thead>
        <tbody>
          {states.map(({ label, checked, indeterminate, disabled }) => (
            <tr key={label}>
              <StorybookGalleryTableCell className={labelCell}>
                {label}
              </StorybookGalleryTableCell>
              {checkboxSizes.map((size) => (
                <StorybookGalleryTableCell
                  key={size}
                  align="left"
                  className={cellWidth}
                >
                  <Checkbox
                    label="Include settled deals"
                    size={size}
                    defaultChecked={checked}
                    indeterminate={indeterminate}
                    disabled={disabled}
                  />
                </StorybookGalleryTableCell>
              ))}
            </tr>
          ))}
        </tbody>
      </StorybookGalleryTable>

      <StorybookGalleryTable title="with hint and error">
        <thead>
          <tr>
            <StorybookGalleryTableHeader className="min-w-[10rem]">
              {"case"}
            </StorybookGalleryTableHeader>
            <StorybookGalleryTableHeader className="min-w-[22rem]">
              {"rendered"}
            </StorybookGalleryTableHeader>
          </tr>
        </thead>
        <tbody>
          <tr>
            <StorybookGalleryTableCell className={labelCell}>
              {"hint"}
            </StorybookGalleryTableCell>
            <StorybookGalleryTableCell align="left" className="min-w-[22rem]">
              <Checkbox
                label="Include settled deals"
                hint="Slows the search on large date ranges."
              />
            </StorybookGalleryTableCell>
          </tr>
          <tr>
            <StorybookGalleryTableCell className={labelCell}>
              {"required + error"}
            </StorybookGalleryTableCell>
            <StorybookGalleryTableCell align="left" className="min-w-[22rem]">
              <Checkbox
                label="I confirm the terms"
                required
                error="You must confirm before booking."
              />
            </StorybookGalleryTableCell>
          </tr>
          <tr>
            <StorybookGalleryTableCell className={labelCell}>
              {"select-all"}
            </StorybookGalleryTableCell>
            <StorybookGalleryTableCell align="left" className="min-w-[22rem]">
              <div className="flex flex-col gap-2">
                <Checkbox label="Select all" indeterminate />
                <div className="ml-6 flex flex-col gap-2">
                  <Checkbox label="NPM-1042" defaultChecked />
                  <Checkbox label="NPM-1043" />
                </div>
              </div>
            </StorybookGalleryTableCell>
          </tr>
        </tbody>
      </StorybookGalleryTable>
    </StorybookGalleryWrapper>
  );
};
