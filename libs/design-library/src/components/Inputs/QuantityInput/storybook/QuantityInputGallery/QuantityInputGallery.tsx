import { StorybookGalleryTable } from "../../../../../storybook/components/StorybookGalleryTable/StorybookGalleryTable";
import { StorybookGalleryTableCell } from "../../../../../storybook/components/StorybookGalleryTable/StorybookGalleryTableCell/StorybookGalleryTableCell";
import { StorybookGalleryTableHeader } from "../../../../../storybook/components/StorybookGalleryTable/StorybookGalleryTableHeader/StorybookGalleryTableHeader";
import { StorybookGalleryWrapper } from "../../../../../storybook/components/StorybookGalleryWrapper/StorybookGalleryWrapper";
import type { SelectOption } from "../../../Select";
import { QuantityInput, quantityInputSizes } from "../../QuantityInput";

const units: Array<SelectOption> = [
  { value: "MT", label: "MT" },
  { value: "kg", label: "kg" },
  { value: "lb", label: "lb" },
];

export const QuantityInputGallery = () => {
  const cellWidth = "min-w-[22rem]";
  const labelCell =
    "bg-bg-hover text-fg-default text-[1rem] font-bold text-center whitespace-nowrap min-w-[10rem]";

  return (
    <StorybookGalleryWrapper>
      <StorybookGalleryTable title="size">
        <thead>
          <tr>
            <StorybookGalleryTableHeader className="min-w-[10rem]">
              {"size"}
            </StorybookGalleryTableHeader>
            <StorybookGalleryTableHeader className={cellWidth}>
              {"rendered"}
            </StorybookGalleryTableHeader>
          </tr>
        </thead>
        <tbody>
          {quantityInputSizes.map((size) => (
            <tr key={size}>
              <StorybookGalleryTableCell className={labelCell}>
                {size}
              </StorybookGalleryTableCell>
              <StorybookGalleryTableCell align="left" className={cellWidth}>
                <QuantityInput
                  label="Quantity"
                  units={units}
                  defaultValue={{ amount: "40", unit: "MT" }}
                  size={size}
                  locale="en-CA"
                />
              </StorybookGalleryTableCell>
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
              {"with the frozen factor"}
            </StorybookGalleryTableCell>
            <StorybookGalleryTableCell align="left" className={cellWidth}>
              <QuantityInput
                label="Quantity"
                units={units}
                defaultValue={{ amount: "40", unit: "MT" }}
                conversionFactor={{ factor: "1,000", toUnit: "kg" }}
                locale="en-CA"
              />
            </StorybookGalleryTableCell>
          </tr>
          <tr>
            <StorybookGalleryTableCell className={labelCell}>
              {"factor plus a hint"}
            </StorybookGalleryTableCell>
            <StorybookGalleryTableCell align="left" className={cellWidth}>
              <QuantityInput
                label="Quantity"
                units={units}
                hint="Gross weight."
                defaultValue={{ amount: "40", unit: "MT" }}
                conversionFactor={{ factor: "1,000", toUnit: "kg" }}
                required
                locale="en-CA"
              />
            </StorybookGalleryTableCell>
          </tr>
          <tr>
            <StorybookGalleryTableCell className={labelCell}>
              {"error"}
            </StorybookGalleryTableCell>
            <StorybookGalleryTableCell align="left" className={cellWidth}>
              <QuantityInput
                label="Quantity"
                units={units}
                defaultValue={{ amount: "40000", unit: "MT" }}
                error="Exceeds the remaining allocation."
                locale="en-CA"
              />
            </StorybookGalleryTableCell>
          </tr>
          <tr>
            <StorybookGalleryTableCell className={labelCell}>
              {"disabled"}
            </StorybookGalleryTableCell>
            <StorybookGalleryTableCell align="left" className={cellWidth}>
              <QuantityInput
                label="Settled quantity"
                units={units}
                defaultValue={{ amount: "40", unit: "MT" }}
                disabled
                locale="en-CA"
              />
            </StorybookGalleryTableCell>
          </tr>
        </tbody>
      </StorybookGalleryTable>
    </StorybookGalleryWrapper>
  );
};
