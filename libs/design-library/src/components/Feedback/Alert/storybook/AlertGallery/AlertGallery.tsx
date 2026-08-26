import type { ReactNode } from "react";

import { StorybookGalleryTable } from "../../../../../storybook/components/StorybookGalleryTable/StorybookGalleryTable";
import { StorybookGalleryTableCell } from "../../../../../storybook/components/StorybookGalleryTable/StorybookGalleryTableCell/StorybookGalleryTableCell";
import { StorybookGalleryTableHeader } from "../../../../../storybook/components/StorybookGalleryTable/StorybookGalleryTableHeader/StorybookGalleryTableHeader";
import { StorybookGalleryWrapper } from "../../../../../storybook/components/StorybookGalleryWrapper/StorybookGalleryWrapper";
import { Button } from "../../../../Buttons/Button";
import { Alert, alertSeverities, type AlertSeverity } from "../../Alert";

/** A stand-in for a real icon set, which the library does not ship (§12 open). */
const InfoGlyph = () => (
  <svg viewBox="0 0 16 16" fill="none" className="size-4">
    <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
    <path
      d="M8 7.5v4M8 4.75v.5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

const forms: Array<{
  label: string;
  render: (severity: AlertSeverity) => ReactNode;
}> = [
  {
    label: "title only",
    render: (severity) => (
      <Alert severity={severity} title="CIF is invalid for air freight" />
    ),
  },
  {
    label: "title + body",
    render: (severity) => (
      <Alert severity={severity} title="SDS expires before ETA">
        {
          "The safety data sheet lapses 02 Sep; arrival is 04 Sep. The carrier will refuse the DG booking."
        }
      </Alert>
    ),
  },
  {
    label: "body only",
    render: (severity) => (
      <Alert severity={severity}>
        {"Rate is 6 days old — refresh before quoting."}
      </Alert>
    ),
  },
  {
    label: "with icon",
    render: (severity) => (
      <Alert
        severity={severity}
        icon={<InfoGlyph />}
        title="SDS expires before ETA"
      >
        {"Arrival is 04 Sep."}
      </Alert>
    ),
  },
  {
    label: "with actions",
    render: (severity) => (
      <Alert
        severity={severity}
        title="Credit limit exceeded"
        actions={
          <Button size="8" variant="default-outline">
            {"Request override"}
          </Button>
        }
      >
        {"CAD 300,000 against an insured cover of 250,000."}
      </Alert>
    ),
  },
];

export const AlertGallery = () => {
  const cellWidth = "min-w-[22rem]";
  const labelCell =
    "bg-bg-hover text-fg-default text-[1rem] font-bold text-center whitespace-nowrap min-w-[10rem]";

  return (
    <StorybookGalleryWrapper>
      <StorybookGalleryTable title="form × severity">
        <thead>
          <tr>
            <StorybookGalleryTableHeader className="min-w-[10rem]">
              {"form"}
            </StorybookGalleryTableHeader>
            {alertSeverities.map((severity) => (
              <StorybookGalleryTableHeader key={severity} className={cellWidth}>
                {severity}
              </StorybookGalleryTableHeader>
            ))}
          </tr>
        </thead>
        <tbody>
          {forms.map(({ label, render }) => (
            <tr key={label}>
              <StorybookGalleryTableCell className={labelCell}>
                {label}
              </StorybookGalleryTableCell>
              {alertSeverities.map((severity) => (
                <StorybookGalleryTableCell
                  key={severity}
                  align="left"
                  className={cellWidth}
                >
                  {render(severity)}
                </StorybookGalleryTableCell>
              ))}
            </tr>
          ))}
        </tbody>
      </StorybookGalleryTable>
    </StorybookGalleryWrapper>
  );
};
