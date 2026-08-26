import { StorybookGalleryTable } from "../../../../../storybook/components/StorybookGalleryTable/StorybookGalleryTable";
import { StorybookGalleryTableCell } from "../../../../../storybook/components/StorybookGalleryTable/StorybookGalleryTableCell/StorybookGalleryTableCell";
import { StorybookGalleryTableHeader } from "../../../../../storybook/components/StorybookGalleryTable/StorybookGalleryTableHeader/StorybookGalleryTableHeader";
import { StorybookGalleryWrapper } from "../../../../../storybook/components/StorybookGalleryWrapper/StorybookGalleryWrapper";
import {
  NumberInput,
  numberInputDensities,
  numberInputSizes,
} from "../../NumberInput";

export const NumberInputGallery = () => {
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
            {numberInputSizes.map((size) => (
              <StorybookGalleryTableHeader key={size} className={cellWidth}>
                {`size: ${size}`}
              </StorybookGalleryTableHeader>
            ))}
          </tr>
        </thead>
        <tbody>
          {numberInputDensities.map((density) => (
            <tr key={density}>
              <StorybookGalleryTableCell className={labelCell}>
                {density}
              </StorybookGalleryTableCell>
              {numberInputSizes.map((size) => (
                <StorybookGalleryTableCell
                  key={size}
                  align="left"
                  className={cellWidth}
                >
                  <NumberInput
                    label="Quantity"
                    defaultValue="40000"
                    suffix="kg"
                    size={size}
                    density={density}
                  />
                </StorybookGalleryTableCell>
              ))}
            </tr>
          ))}
        </tbody>
      </StorybookGalleryTable>

      <StorybookGalleryTable title="formatting — shown at rest, raw once focused">
        <thead>
          <tr>
            <StorybookGalleryTableHeader className="min-w-[10rem]">
              {"case"}
            </StorybookGalleryTableHeader>
            <StorybookGalleryTableHeader className={stateWidth}>
              {"rendered"}
            </StorybookGalleryTableHeader>
          </tr>
        </thead>
        <tbody>
          <tr>
            <StorybookGalleryTableCell className={labelCell}>
              {"grouped"}
            </StorybookGalleryTableCell>
            <StorybookGalleryTableCell align="left" className={stateWidth}>
              <NumberInput
                label="Quantity"
                defaultValue="1234567"
                suffix="kg"
              />
            </StorybookGalleryTableCell>
          </tr>
          <tr>
            <StorybookGalleryTableCell className={labelCell}>
              {"two decimals"}
            </StorybookGalleryTableCell>
            <StorybookGalleryTableCell align="left" className={stateWidth}>
              <NumberInput
                label="Unit price"
                defaultValue="1234.5"
                decimals={2}
                suffix="CAD"
              />
            </StorybookGalleryTableCell>
          </tr>
          <tr>
            <StorybookGalleryTableCell className={labelCell}>
              {"ungrouped integer"}
            </StorybookGalleryTableCell>
            <StorybookGalleryTableCell align="left" className={stateWidth}>
              <NumberInput
                label="Container count"
                defaultValue="1204"
                grouping={false}
                decimals={0}
              />
            </StorybookGalleryTableCell>
          </tr>
          <tr>
            <StorybookGalleryTableCell className={labelCell}>
              {"negative"}
            </StorybookGalleryTableCell>
            <StorybookGalleryTableCell align="left" className={stateWidth}>
              <NumberInput
                label="Adjustment"
                defaultValue="-1234.5"
                decimals={2}
                suffix="CAD"
              />
            </StorybookGalleryTableCell>
          </tr>
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
              {"required + hint"}
            </StorybookGalleryTableCell>
            <StorybookGalleryTableCell align="left" className={stateWidth}>
              <NumberInput
                label="Quantity"
                hint="Metric tonnes, to three decimals."
                defaultValue="40"
                decimals={3}
                required
              />
            </StorybookGalleryTableCell>
          </tr>
          <tr>
            <StorybookGalleryTableCell className={labelCell}>
              {"error"}
            </StorybookGalleryTableCell>
            <StorybookGalleryTableCell align="left" className={stateWidth}>
              <NumberInput
                label="Quantity"
                error="Exceeds the remaining allocation."
                defaultValue="40000"
                suffix="kg"
              />
            </StorybookGalleryTableCell>
          </tr>
          <tr>
            <StorybookGalleryTableCell className={labelCell}>
              {"disabled"}
            </StorybookGalleryTableCell>
            <StorybookGalleryTableCell align="left" className={stateWidth}>
              <NumberInput
                label="Settled quantity"
                defaultValue="40000"
                suffix="kg"
                disabled
              />
            </StorybookGalleryTableCell>
          </tr>
        </tbody>
      </StorybookGalleryTable>
    </StorybookGalleryWrapper>
  );
};
