import { useId } from "react";

import { StorybookGalleryTable } from "../../../../../storybook/components/StorybookGalleryTable/StorybookGalleryTable";
import { StorybookGalleryTableCell } from "../../../../../storybook/components/StorybookGalleryTable/StorybookGalleryTableCell/StorybookGalleryTableCell";
import { StorybookGalleryTableHeader } from "../../../../../storybook/components/StorybookGalleryTable/StorybookGalleryTableHeader/StorybookGalleryTableHeader";
import { StorybookGalleryWrapper } from "../../../../../storybook/components/StorybookGalleryWrapper/StorybookGalleryWrapper";
import { Radio, radioSizes } from "../../Radio";

export const RadioGallery = () => {
  // The wrapper renders this gallery once per theme, and the two frames are
  // separate React roots — so useId() hands both the same value and any
  // shared name puts the two copies in one radio group, where only one can
  // be checked. The static rows below therefore carry no name at all: a radio
  // without one is its own group.
  const instance: string = useId();
  const cellWidth = "min-w-[16rem]";
  const labelCell =
    "bg-bg-hover text-fg-default text-[1rem] font-bold text-center whitespace-nowrap min-w-[10rem]";

  const states: Array<{
    label: string;
    checked?: boolean;
    disabled?: boolean;
  }> = [
    { label: "unselected" },
    { label: "selected", checked: true },
    { label: "disabled", disabled: true },
    { label: "disabled + selected", checked: true, disabled: true },
  ];

  return (
    <StorybookGalleryWrapper>
      <StorybookGalleryTable title="state × size">
        <thead>
          <tr>
            <StorybookGalleryTableHeader className="min-w-[10rem]">
              {"state"}
            </StorybookGalleryTableHeader>
            {radioSizes.map((size) => (
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
              {radioSizes.map((size) => (
                <StorybookGalleryTableCell
                  key={size}
                  align="left"
                  className={cellWidth}
                >
                  <Radio
                    value="FOB"
                    label="FOB"
                    size={size}
                    checked={checked === true}
                    onChange={() => undefined}
                    disabled={disabled}
                  />
                </StorybookGalleryTableCell>
              ))}
            </tr>
          ))}
        </tbody>
      </StorybookGalleryTable>

      <StorybookGalleryTable title="standalone — for a named set, reach for RadioGroup">
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
              {"with a hint"}
            </StorybookGalleryTableCell>
            <StorybookGalleryTableCell align="left" className="min-w-[22rem]">
              <Radio
                name={`${instance}-terms`}
                value="net30"
                label="Net 30"
                hint="Standard terms for this counterparty."
              />
            </StorybookGalleryTableCell>
          </tr>
          <tr>
            <StorybookGalleryTableCell className={labelCell}>
              {"exclusive by name"}
            </StorybookGalleryTableCell>
            <StorybookGalleryTableCell align="left" className="min-w-[22rem]">
              <div className="flex flex-col gap-2">
                <Radio name={`${instance}-incoterm`} value="FOB" label="FOB" />
                <Radio name={`${instance}-incoterm`} value="CIF" label="CIF" />
                <Radio name={`${instance}-incoterm`} value="EXW" label="EXW" />
              </div>
            </StorybookGalleryTableCell>
          </tr>
        </tbody>
      </StorybookGalleryTable>
    </StorybookGalleryWrapper>
  );
};
