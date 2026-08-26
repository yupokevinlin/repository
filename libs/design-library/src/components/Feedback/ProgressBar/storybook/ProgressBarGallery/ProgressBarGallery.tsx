import { StorybookGalleryTable } from "../../../../../storybook/components/StorybookGalleryTable/StorybookGalleryTable";
import { StorybookGalleryTableCell } from "../../../../../storybook/components/StorybookGalleryTable/StorybookGalleryTableCell/StorybookGalleryTableCell";
import { StorybookGalleryTableHeader } from "../../../../../storybook/components/StorybookGalleryTable/StorybookGalleryTableHeader/StorybookGalleryTableHeader";
import { StorybookGalleryWrapper } from "../../../../../storybook/components/StorybookGalleryWrapper/StorybookGalleryWrapper";
import {
  ProgressBar,
  progressBarSeverities,
  progressBarSizes,
} from "../../ProgressBar";

const thresholds = { warning: 0.6, error: 0.85 };

/** The §07 clocks, at the three points where the colour changes. */
const clocks: Array<{
  label: string;
  value: number;
  max: number;
  text: string;
}> = [
  { label: "Demurrage free time", value: 2, max: 7, text: "2 / 7 days" },
  { label: "Detention", value: 5, max: 7, text: "5 / 7 days" },
  { label: "L/C presentation", value: 19, max: 21, text: "19 / 21 days" },
];

export const ProgressBarGallery = () => {
  const cellWidth = "min-w-[18rem]";
  const labelCell =
    "bg-bg-hover text-fg-default text-[1rem] font-bold text-center whitespace-nowrap min-w-[10rem]";

  return (
    <StorybookGalleryWrapper>
      <StorybookGalleryTable title="severity × size">
        <thead>
          <tr>
            <StorybookGalleryTableHeader className="min-w-[10rem]">
              {"severity"}
            </StorybookGalleryTableHeader>
            {progressBarSizes.map((size) => (
              <StorybookGalleryTableHeader key={size} className={cellWidth}>
                {`size: ${size}`}
              </StorybookGalleryTableHeader>
            ))}
          </tr>
        </thead>
        <tbody>
          {progressBarSeverities.map((severity) => (
            <tr key={severity}>
              <StorybookGalleryTableCell className={labelCell}>
                {severity}
              </StorybookGalleryTableCell>
              {progressBarSizes.map((size) => (
                <StorybookGalleryTableCell key={size} className={cellWidth}>
                  <ProgressBar
                    label="Upload"
                    labelHidden
                    value={62}
                    severity={severity}
                    size={size}
                    valueLabel="62%"
                  />
                </StorybookGalleryTableCell>
              ))}
            </tr>
          ))}
        </tbody>
      </StorybookGalleryTable>

      <StorybookGalleryTable title="thresholds — the colour shifts as the clock runs">
        <thead>
          <tr>
            <StorybookGalleryTableHeader className="min-w-[10rem]">
              {"clock"}
            </StorybookGalleryTableHeader>
            <StorybookGalleryTableHeader className="min-w-[24rem]">
              {"thresholds={{ warning: 0.6, error: 0.85 }}"}
            </StorybookGalleryTableHeader>
          </tr>
        </thead>
        <tbody>
          {clocks.map(({ label, value, max, text }) => (
            <tr key={label}>
              <StorybookGalleryTableCell className={labelCell}>
                {label}
              </StorybookGalleryTableCell>
              <StorybookGalleryTableCell className="min-w-[24rem]">
                <ProgressBar
                  label={label}
                  value={value}
                  max={max}
                  valueLabel={text}
                  thresholds={thresholds}
                />
              </StorybookGalleryTableCell>
            </tr>
          ))}
        </tbody>
      </StorybookGalleryTable>

      <StorybookGalleryTable title="other states">
        <thead>
          <tr>
            <StorybookGalleryTableHeader className="min-w-[10rem]">
              {"state"}
            </StorybookGalleryTableHeader>
            <StorybookGalleryTableHeader className="min-w-[24rem]">
              {"rendered"}
            </StorybookGalleryTableHeader>
          </tr>
        </thead>
        <tbody>
          <tr>
            <StorybookGalleryTableCell className={labelCell}>
              {"indeterminate"}
            </StorybookGalleryTableCell>
            <StorybookGalleryTableCell className="min-w-[24rem]">
              <ProgressBar
                label="Applying FX rates to 18 deals"
                indeterminate
              />
            </StorybookGalleryTableCell>
          </tr>
          <tr>
            <StorybookGalleryTableCell className={labelCell}>
              {"labelHidden"}
            </StorybookGalleryTableCell>
            <StorybookGalleryTableCell className="min-w-[24rem]">
              <ProgressBar label="Upload" labelHidden value={40} />
            </StorybookGalleryTableCell>
          </tr>
          <tr>
            <StorybookGalleryTableCell className={labelCell}>
              {"empty and full"}
            </StorybookGalleryTableCell>
            <StorybookGalleryTableCell className="min-w-[24rem]">
              <div className="flex w-full flex-col gap-[0.75rem]">
                <ProgressBar label="Empty" value={0} valueLabel="0%" />
                <ProgressBar label="Full" value={100} valueLabel="100%" />
              </div>
            </StorybookGalleryTableCell>
          </tr>
        </tbody>
      </StorybookGalleryTable>
    </StorybookGalleryWrapper>
  );
};
