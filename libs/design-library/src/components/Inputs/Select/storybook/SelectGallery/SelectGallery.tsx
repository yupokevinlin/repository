import { StorybookGalleryTable } from "../../../../../storybook/components/StorybookGalleryTable/StorybookGalleryTable";
import { StorybookGalleryTableCell } from "../../../../../storybook/components/StorybookGalleryTable/StorybookGalleryTableCell/StorybookGalleryTableCell";
import { StorybookGalleryTableHeader } from "../../../../../storybook/components/StorybookGalleryTable/StorybookGalleryTableHeader/StorybookGalleryTableHeader";
import { StorybookGalleryWrapper } from "../../../../../storybook/components/StorybookGalleryWrapper/StorybookGalleryWrapper";
import {
  Select,
  selectDensities,
  type SelectOption,
  selectSizes,
} from "../../Select";

const options: Array<SelectOption> = [
  { value: "net30", label: "Net 30" },
  { value: "net60", label: "Net 60" },
  { value: "prepaid", label: "Prepaid" },
  { value: "cod", label: "Cash on delivery", disabled: true },
];

export const SelectGallery = () => {
  const cellWidth = "min-w-[16rem]";
  const stateWidth = "min-w-[20rem]";
  const labelCell =
    "bg-bg-hover text-fg-default text-[1rem] font-bold text-center whitespace-nowrap min-w-[10rem]";

  return (
    <StorybookGalleryWrapper>
      <StorybookGalleryTable title="size × density">
        <thead>
          <tr>
            <StorybookGalleryTableHeader className="min-w-[10rem]">
              {"density"}
            </StorybookGalleryTableHeader>
            {selectSizes.map((size) => (
              <StorybookGalleryTableHeader key={size} className={cellWidth}>
                {`size: ${size}`}
              </StorybookGalleryTableHeader>
            ))}
          </tr>
        </thead>
        <tbody>
          {selectDensities.map((density) => (
            <tr key={density}>
              <StorybookGalleryTableCell className={labelCell}>
                {density}
              </StorybookGalleryTableCell>
              {selectSizes.map((size) => (
                <StorybookGalleryTableCell
                  key={size}
                  align="left"
                  className={cellWidth}
                >
                  <Select
                    label="Payment terms"
                    options={options}
                    defaultValue="net30"
                    size={size}
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
            <StorybookGalleryTableHeader className={stateWidth}>
              {"rendered"}
            </StorybookGalleryTableHeader>
          </tr>
        </thead>
        <tbody>
          <tr>
            <StorybookGalleryTableCell className={labelCell}>
              {"placeholder"}
            </StorybookGalleryTableCell>
            <StorybookGalleryTableCell align="left" className={stateWidth}>
              <Select
                label="Payment terms"
                options={options}
                placeholder="Choose terms"
              />
            </StorybookGalleryTableCell>
          </tr>
          <tr>
            <StorybookGalleryTableCell className={labelCell}>
              {"required + hint"}
            </StorybookGalleryTableCell>
            <StorybookGalleryTableCell align="left" className={stateWidth}>
              <Select
                label="Incoterm"
                hint="Applies to this shipment only."
                options={[
                  { value: "fob", label: "FOB" },
                  { value: "cif", label: "CIF" },
                ]}
                placeholder="Choose an incoterm"
                required
              />
            </StorybookGalleryTableCell>
          </tr>
          <tr>
            <StorybookGalleryTableCell className={labelCell}>
              {"error"}
            </StorybookGalleryTableCell>
            <StorybookGalleryTableCell align="left" className={stateWidth}>
              <Select
                label="Payment terms"
                options={options}
                placeholder="Choose terms"
                error="Choose terms before booking."
              />
            </StorybookGalleryTableCell>
          </tr>
          <tr>
            <StorybookGalleryTableCell className={labelCell}>
              {"disabled"}
            </StorybookGalleryTableCell>
            <StorybookGalleryTableCell align="left" className={stateWidth}>
              <Select
                label="Payment terms"
                options={options}
                defaultValue="net30"
                disabled
              />
            </StorybookGalleryTableCell>
          </tr>
          <tr>
            <StorybookGalleryTableCell className={labelCell}>
              {"open"}
            </StorybookGalleryTableCell>
            <StorybookGalleryTableCell align="left" className={stateWidth}>
              <Select
                label="Payment terms"
                options={options}
                defaultValue="net60"
                defaultOpen
              />
            </StorybookGalleryTableCell>
          </tr>
        </tbody>
      </StorybookGalleryTable>
    </StorybookGalleryWrapper>
  );
};
