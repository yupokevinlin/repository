import { StorybookGalleryTable } from "../../../../../storybook/components/StorybookGalleryTable/StorybookGalleryTable";
import { StorybookGalleryTableCell } from "../../../../../storybook/components/StorybookGalleryTable/StorybookGalleryTableCell/StorybookGalleryTableCell";
import { StorybookGalleryTableHeader } from "../../../../../storybook/components/StorybookGalleryTable/StorybookGalleryTableHeader/StorybookGalleryTableHeader";
import { StorybookGalleryWrapper } from "../../../../../storybook/components/StorybookGalleryWrapper/StorybookGalleryWrapper";
import {
  CheckboxGroup,
  checkboxGroupDensities,
  type CheckboxGroupOption,
} from "../../CheckboxGroup";

const options: Array<CheckboxGroupOption> = [
  { value: "contract", label: "Contract" },
  { value: "invoice", label: "Invoice" },
  { value: "bol", label: "Bill of lading" },
];

export const CheckboxGroupGallery = () => {
  const cellWidth = "min-w-[20rem]";
  const labelCell =
    "bg-bg-hover text-fg-default text-[1rem] font-bold text-center whitespace-nowrap min-w-[10rem]";

  return (
    <StorybookGalleryWrapper>
      <StorybookGalleryTable title="orientation × density">
        <thead>
          <tr>
            <StorybookGalleryTableHeader className="min-w-[10rem]">
              {"orientation"}
            </StorybookGalleryTableHeader>
            {checkboxGroupDensities.map((density) => (
              <StorybookGalleryTableHeader key={density} className={cellWidth}>
                {density}
              </StorybookGalleryTableHeader>
            ))}
          </tr>
        </thead>
        <tbody>
          {(["vertical", "horizontal"] as const).map((orientation) => (
            <tr key={orientation}>
              <StorybookGalleryTableCell className={labelCell}>
                {orientation}
              </StorybookGalleryTableCell>
              {checkboxGroupDensities.map((density) => (
                <StorybookGalleryTableCell
                  key={density}
                  align="left"
                  className={cellWidth}
                >
                  <CheckboxGroup
                    legend="Attach"
                    options={options}
                    defaultValue={["contract"]}
                    orientation={orientation}
                    density={density}
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
            <StorybookGalleryTableHeader className={cellWidth}>
              {"rendered"}
            </StorybookGalleryTableHeader>
          </tr>
        </thead>
        <tbody>
          <tr>
            <StorybookGalleryTableCell className={labelCell}>
              {"hint + per-option hint"}
            </StorybookGalleryTableCell>
            <StorybookGalleryTableCell align="left" className={cellWidth}>
              <CheckboxGroup
                legend="Attach"
                hint="Attached to the confirmation on booking."
                options={[
                  {
                    value: "contract",
                    label: "Contract",
                    hint: "Signed copy only.",
                  },
                  { value: "invoice", label: "Invoice" },
                ]}
              />
            </StorybookGalleryTableCell>
          </tr>
          <tr>
            <StorybookGalleryTableCell className={labelCell}>
              {"required + error"}
            </StorybookGalleryTableCell>
            <StorybookGalleryTableCell align="left" className={cellWidth}>
              <CheckboxGroup
                legend="Confirmations"
                options={options}
                required
                error="Confirm at least one before booking."
              />
            </StorybookGalleryTableCell>
          </tr>
          <tr>
            <StorybookGalleryTableCell className={labelCell}>
              {"disabled"}
            </StorybookGalleryTableCell>
            <StorybookGalleryTableCell align="left" className={cellWidth}>
              <CheckboxGroup
                legend="Attach"
                options={options}
                defaultValue={["contract"]}
                disabled
              />
            </StorybookGalleryTableCell>
          </tr>
          <tr>
            <StorybookGalleryTableCell className={labelCell}>
              {"one option locked"}
            </StorybookGalleryTableCell>
            <StorybookGalleryTableCell align="left" className={cellWidth}>
              <CheckboxGroup
                legend="Attach"
                options={[
                  ...options,
                  { value: "audit", label: "Audit trail", disabled: true },
                ]}
              />
            </StorybookGalleryTableCell>
          </tr>
        </tbody>
      </StorybookGalleryTable>
    </StorybookGalleryWrapper>
  );
};
