import { StorybookGalleryTable } from "../../../../../storybook/components/StorybookGalleryTable/StorybookGalleryTable";
import { StorybookGalleryTableCell } from "../../../../../storybook/components/StorybookGalleryTable/StorybookGalleryTableCell/StorybookGalleryTableCell";
import { StorybookGalleryTableHeader } from "../../../../../storybook/components/StorybookGalleryTable/StorybookGalleryTableHeader/StorybookGalleryTableHeader";
import { StorybookGalleryWrapper } from "../../../../../storybook/components/StorybookGalleryWrapper/StorybookGalleryWrapper";
import type { SelectOption } from "../../../Select";
import { MoneyInput, moneyInputSizes } from "../../MoneyInput";

const currencies: Array<SelectOption> = [
  { value: "CAD", label: "CAD" },
  { value: "USD", label: "USD" },
  { value: "JPY", label: "JPY" },
];

export const MoneyInputGallery = () => {
  const cellWidth = "min-w-[20rem]";
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
          {moneyInputSizes.map((size) => (
            <tr key={size}>
              <StorybookGalleryTableCell className={labelCell}>
                {size}
              </StorybookGalleryTableCell>
              <StorybookGalleryTableCell align="left" className={cellWidth}>
                <MoneyInput
                  label="Unit price"
                  currencies={currencies}
                  defaultValue={{ amount: "1234.5", currency: "CAD" }}
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
              {"empty"}
            </StorybookGalleryTableCell>
            <StorybookGalleryTableCell align="left" className={cellWidth}>
              <MoneyInput
                label="Unit price"
                currencies={currencies}
                locale="en-CA"
              />
            </StorybookGalleryTableCell>
          </tr>
          <tr>
            <StorybookGalleryTableCell className={labelCell}>
              {"required + hint"}
            </StorybookGalleryTableCell>
            <StorybookGalleryTableCell align="left" className={cellWidth}>
              <MoneyInput
                label="Freight"
                currencies={currencies}
                hint="Excludes demurrage."
                defaultValue={{ amount: "18500", currency: "USD" }}
                required
                locale="en-CA"
              />
            </StorybookGalleryTableCell>
          </tr>
          <tr>
            <StorybookGalleryTableCell className={labelCell}>
              {"no decimals"}
            </StorybookGalleryTableCell>
            <StorybookGalleryTableCell align="left" className={cellWidth}>
              <MoneyInput
                label="Unit price"
                currencies={currencies}
                defaultValue={{ amount: "132000", currency: "JPY" }}
                decimals={0}
                locale="en-CA"
              />
            </StorybookGalleryTableCell>
          </tr>
          <tr>
            <StorybookGalleryTableCell className={labelCell}>
              {"error"}
            </StorybookGalleryTableCell>
            <StorybookGalleryTableCell align="left" className={cellWidth}>
              <MoneyInput
                label="Unit price"
                currencies={currencies}
                error="A price is required before booking."
                locale="en-CA"
              />
            </StorybookGalleryTableCell>
          </tr>
          <tr>
            <StorybookGalleryTableCell className={labelCell}>
              {"disabled"}
            </StorybookGalleryTableCell>
            <StorybookGalleryTableCell align="left" className={cellWidth}>
              <MoneyInput
                label="Settled price"
                currencies={currencies}
                defaultValue={{ amount: "1234.5", currency: "CAD" }}
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
