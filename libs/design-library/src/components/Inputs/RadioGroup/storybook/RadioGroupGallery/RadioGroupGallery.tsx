import { StorybookGalleryTable } from "../../../../../storybook/components/StorybookGalleryTable/StorybookGalleryTable";
import { StorybookGalleryTableCell } from "../../../../../storybook/components/StorybookGalleryTable/StorybookGalleryTableCell/StorybookGalleryTableCell";
import { StorybookGalleryTableHeader } from "../../../../../storybook/components/StorybookGalleryTable/StorybookGalleryTableHeader/StorybookGalleryTableHeader";
import { StorybookGalleryWrapper } from "../../../../../storybook/components/StorybookGalleryWrapper/StorybookGalleryWrapper";
import {
  RadioGroup,
  radioGroupDensities,
  type RadioGroupOption,
} from "../../RadioGroup";

const options: Array<RadioGroupOption> = [
  { value: "net30", label: "Net 30" },
  { value: "net60", label: "Net 60" },
  { value: "prepaid", label: "Prepaid" },
];

export const RadioGroupGallery = () => {
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
            {radioGroupDensities.map((density) => (
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
              {radioGroupDensities.map((density) => (
                <StorybookGalleryTableCell
                  key={density}
                  align="left"
                  className={cellWidth}
                >
                  <RadioGroup
                    legend="Payment terms"
                    options={options}
                    defaultValue="net30"
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
              <RadioGroup
                legend="Payment terms"
                hint="Applies to this deal only."
                options={[
                  {
                    value: "net30",
                    label: "Net 30",
                    hint: "Standard for this counterparty.",
                  },
                  { value: "prepaid", label: "Prepaid" },
                ]}
                defaultValue="net30"
              />
            </StorybookGalleryTableCell>
          </tr>
          <tr>
            <StorybookGalleryTableCell className={labelCell}>
              {"required + error"}
            </StorybookGalleryTableCell>
            <StorybookGalleryTableCell align="left" className={cellWidth}>
              <RadioGroup
                legend="Incoterm"
                options={[
                  { value: "fob", label: "FOB" },
                  { value: "cif", label: "CIF" },
                ]}
                required
                error="Choose an incoterm before booking."
              />
            </StorybookGalleryTableCell>
          </tr>
          <tr>
            <StorybookGalleryTableCell className={labelCell}>
              {"one option locked"}
            </StorybookGalleryTableCell>
            <StorybookGalleryTableCell align="left" className={cellWidth}>
              <RadioGroup
                legend="Payment terms"
                options={[
                  ...options,
                  { value: "cod", label: "Cash on delivery", disabled: true },
                ]}
                defaultValue="net30"
              />
            </StorybookGalleryTableCell>
          </tr>
          <tr>
            <StorybookGalleryTableCell className={labelCell}>
              {"disabled"}
            </StorybookGalleryTableCell>
            <StorybookGalleryTableCell align="left" className={cellWidth}>
              <RadioGroup
                legend="Payment terms"
                options={options}
                defaultValue="net30"
                disabled
              />
            </StorybookGalleryTableCell>
          </tr>
        </tbody>
      </StorybookGalleryTable>
    </StorybookGalleryWrapper>
  );
};
