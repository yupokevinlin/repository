import { StorybookGalleryTable } from "../../../../../storybook/components/StorybookGalleryTable/StorybookGalleryTable";
import { StorybookGalleryTableCell } from "../../../../../storybook/components/StorybookGalleryTable/StorybookGalleryTableCell/StorybookGalleryTableCell";
import { StorybookGalleryTableHeader } from "../../../../../storybook/components/StorybookGalleryTable/StorybookGalleryTableHeader/StorybookGalleryTableHeader";
import { StorybookGalleryWrapper } from "../../../../../storybook/components/StorybookGalleryWrapper/StorybookGalleryWrapper";
import { TextInput, textInputDensities, textInputSizes } from "../../TextInput";

const searchIcon = (
  <svg
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    aria-hidden="true"
    className="size-full"
  >
    <circle cx="7" cy="7" r="4.5" />
    <path d="M10.5 10.5L14 14" />
  </svg>
);

export const TextInputGallery = () => {
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
            {textInputSizes.map((size) => (
              <StorybookGalleryTableHeader key={size} className={cellWidth}>
                {`size: ${size}`}
              </StorybookGalleryTableHeader>
            ))}
          </tr>
        </thead>
        <tbody>
          {textInputDensities.map((density) => (
            <tr key={density}>
              <StorybookGalleryTableCell className={labelCell}>
                {density}
              </StorybookGalleryTableCell>
              {textInputSizes.map((size) => (
                <StorybookGalleryTableCell
                  key={size}
                  align="left"
                  className={cellWidth}
                >
                  <TextInput
                    label="Deal number"
                    defaultValue="NPM-1042"
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
              {"rest"}
            </StorybookGalleryTableCell>
            <StorybookGalleryTableCell align="left" className={stateWidth}>
              <TextInput label="Deal number" defaultValue="NPM-1042" />
            </StorybookGalleryTableCell>
          </tr>
          <tr>
            <StorybookGalleryTableCell className={labelCell}>
              {"required + hint"}
            </StorybookGalleryTableCell>
            <StorybookGalleryTableCell align="left" className={stateWidth}>
              <TextInput
                label="Counterparty"
                hint="Legal entity name, as on the contract."
                defaultValue="Kanto Polymer KK"
                required
              />
            </StorybookGalleryTableCell>
          </tr>
          <tr>
            <StorybookGalleryTableCell className={labelCell}>
              {"error"}
            </StorybookGalleryTableCell>
            <StorybookGalleryTableCell align="left" className={stateWidth}>
              <TextInput
                label="Deal number"
                error="That deal number is already in use."
                defaultValue="NPM-1042"
              />
            </StorybookGalleryTableCell>
          </tr>
          <tr>
            <StorybookGalleryTableCell className={labelCell}>
              {"hint + error"}
            </StorybookGalleryTableCell>
            <StorybookGalleryTableCell align="left" className={stateWidth}>
              <TextInput
                label="Deal number"
                hint="Format: NPM-0000."
                error="That deal number is already in use."
                defaultValue="NPM-1042"
              />
            </StorybookGalleryTableCell>
          </tr>
          <tr>
            <StorybookGalleryTableCell className={labelCell}>
              {"disabled"}
            </StorybookGalleryTableCell>
            <StorybookGalleryTableCell align="left" className={stateWidth}>
              <TextInput
                label="Settled at"
                defaultValue="2026-08-19"
                disabled
              />
            </StorybookGalleryTableCell>
          </tr>
          <tr>
            <StorybookGalleryTableCell className={labelCell}>
              {"with an icon"}
            </StorybookGalleryTableCell>
            <StorybookGalleryTableCell align="left" className={stateWidth}>
              <TextInput
                label="Counterparty"
                startIcon={searchIcon}
                placeholder="Search counterparties"
              />
            </StorybookGalleryTableCell>
          </tr>
          <tr>
            <StorybookGalleryTableCell className={labelCell}>
              {"no visible label"}
            </StorybookGalleryTableCell>
            <StorybookGalleryTableCell align="left" className={stateWidth}>
              <TextInput
                aria-label="Quantity"
                size="8"
                density="compact"
                defaultValue="40,000"
              />
            </StorybookGalleryTableCell>
          </tr>
        </tbody>
      </StorybookGalleryTable>
    </StorybookGalleryWrapper>
  );
};
