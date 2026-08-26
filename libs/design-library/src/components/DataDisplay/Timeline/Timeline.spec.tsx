import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Timeline } from "./Timeline";
import { TimelineItem } from "./TimelineItem/TimelineItem";

const booked = new Date(2026, 1, 2, 9, 14);
const sailed = new Date(2026, 1, 3, 6, 0);
const filed = new Date(2026, 1, 5, 11, 40);

const entries = [
  <TimelineItem key="booked" title="Deal booked" eventAt={booked} />,
  <TimelineItem
    key="sailed"
    title="Vessel sailed"
    eventAt={sailed}
    recordedAt={filed}
    severity="info"
  >
    {"MV Kanto Maru, Vancouver → Osaka"}
  </TimelineItem>,
  <TimelineItem
    key="rejected"
    title="Documents rejected"
    eventAt={new Date(2026, 1, 6, 15, 22)}
    severity="error"
  >
    {"Bill of lading missing the consignee."}
  </TimelineItem>,
];

describe("Timeline", () => {
  it("is an ordered list, because the order is the meaning", () => {
    const { container } = render(<Timeline>{entries}</Timeline>);
    expect(container.querySelector("ol")).not.toBeNull();
    expect(screen.getAllByRole("listitem")).toHaveLength(3);
  });

  it("keeps the caller's order", () => {
    render(<Timeline>{entries}</Timeline>);
    const titles = screen
      .getAllByRole("listitem")
      .map(
        (item: HTMLElement) =>
          item.querySelector("[data-slot='timeline-title']")?.textContent,
      );
    expect(titles).toEqual([
      "Deal booked",
      "Vessel sailed",
      "Documents rejected",
    ]);
  });

  it("ignores children that are not items", () => {
    render(
      <Timeline>
        <TimelineItem title="Deal booked" eventAt={booked} />
        <span>{"Stray"}</span>
      </Timeline>,
    );
    expect(screen.queryByText("Stray")).not.toBeInTheDocument();
  });

  it("renders whatever else the entry carries", () => {
    render(<Timeline>{entries}</Timeline>);
    expect(
      screen.getByText("MV Kanto Maru, Vancouver → Osaka"),
    ).toBeInTheDocument();
  });

  describe("the two timestamps", () => {
    it("shows when it happened", () => {
      const { container } = render(
        <Timeline locale="en-GB">{entries}</Timeline>,
      );
      const times = container.querySelectorAll("time");
      expect(times[0]).toHaveAttribute(
        "datetime",
        expect.stringContaining("2026-02-02T09:14"),
      );
    });

    it("shows when the system was told, as text and not only a tooltip", () => {
      render(<Timeline locale="en-GB">{entries}</Timeline>);
      const recorded = screen
        .getAllByRole("listitem")[1]
        .querySelector("[data-slot='timeline-recorded']");
      expect(recorded).not.toBeNull();
      expect(recorded?.textContent).toContain("recorded");
      expect(recorded?.querySelector("time")).toHaveAttribute(
        "datetime",
        expect.stringContaining("2026-02-05T11:40"),
      );
    });

    it("puts both into the entry's text, so a screen reader reaches them", () => {
      render(<Timeline locale="en-GB">{entries}</Timeline>);
      const sailedItem = screen.getAllByRole("listitem")[1];
      expect(sailedItem.textContent).toContain("3 Feb 2026");
      expect(sailedItem.textContent).toContain("5 Feb 2026");
    });

    it("says nothing about recording when there is nothing to say", () => {
      render(<Timeline>{entries}</Timeline>);
      const bookedItem = screen.getAllByRole("listitem")[0];
      expect(
        bookedItem.querySelector("[data-slot='timeline-recorded']"),
      ).toBeNull();
    });

    it("treats a filing seconds later as the same moment", () => {
      render(
        <Timeline>
          <TimelineItem
            title="Deal booked"
            eventAt={booked}
            recordedAt={new Date(2026, 1, 2, 9, 14, 30)}
          />
        </Timeline>,
      );
      expect(
        screen
          .getByRole("listitem")
          .querySelector("[data-slot='timeline-recorded']"),
      ).toBeNull();
    });

    it("uses local time in the datetime attribute, not UTC", () => {
      const { container } = render(
        <Timeline>
          <TimelineItem title="Vessel sailed" eventAt={sailed} />
        </Timeline>,
      );
      // 06:00 local stays 06:00 with an offset, rather than shifting a day
      // either way as toISOString would.
      expect(container.querySelector("time")).toHaveAttribute(
        "datetime",
        expect.stringContaining("2026-02-03T06:00:00"),
      );
    });

    it("takes a caller-supplied word for the recorded time", () => {
      render(
        <Timeline recordedLabel="filed" locale="en-GB">
          {entries}
        </Timeline>,
      );
      expect(screen.getAllByRole("listitem")[1].textContent).toContain("filed");
    });
  });

  describe("the rail", () => {
    it("marks each entry with its severity", () => {
      render(<Timeline>{entries}</Timeline>);
      const items = screen.getAllByRole("listitem");
      expect(items[1]).toHaveAttribute("data-severity", "info");
      expect(items[2]).toHaveAttribute("data-severity", "error");
    });

    it("defaults to neutral", () => {
      render(<Timeline>{entries}</Timeline>);
      expect(screen.getAllByRole("listitem")[0]).toHaveAttribute(
        "data-severity",
        "neutral",
      );
    });

    it("draws the line between entries and stops at the last", () => {
      const { container } = render(<Timeline>{entries}</Timeline>);
      expect(
        container.querySelectorAll("[data-slot='timeline-connector']"),
      ).toHaveLength(2);
    });

    it("hides the decoration from screen readers", () => {
      const { container } = render(<Timeline>{entries}</Timeline>);
      expect(
        container.querySelector("[data-slot='timeline-marker']"),
      ).toHaveAttribute("aria-hidden", "true");
    });
  });

  describe("density", () => {
    it("is comfortable by default", () => {
      render(<Timeline>{entries}</Timeline>);
      const content = screen
        .getAllByRole("listitem")[0]
        .querySelector("[data-slot='timeline-content']");
      expect(content?.className).toContain("pb-5");
    });

    it("tightens when compact", () => {
      render(<Timeline density="compact">{entries}</Timeline>);
      const content = screen
        .getAllByRole("listitem")[0]
        .querySelector("[data-slot='timeline-content']");
      expect(content?.className).toContain("pb-3");
    });
  });
});

describe("TimelineItem", () => {
  it("renders nothing on its own", () => {
    const { container } = render(
      <TimelineItem title="Deal booked" eventAt={booked} />,
    );
    expect(container).toBeEmptyDOMElement();
  });
});
