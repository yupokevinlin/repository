import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";

import { toDateString } from "../../Overlays/Calendar/calendarDates";
import { type DateRange, DateRangePicker } from "./DateRangePicker";

const trigger = (): HTMLElement =>
  screen.getByRole("button", { name: /Shipment window/ });

const day = (label: string): HTMLElement =>
  screen.getByRole("gridcell", { name: new RegExp(label) });

/**
 * Narrows away null without an assertion: no-non-null-assertion forbids `!`
 * and non-nullable-type-assertion-style forbids the cast, so a guard that
 * fails the test loudly is the only thing both rules accept.
 */
const asDate = (value: Date | null | undefined): Date => {
  if (value === null || value === undefined) {
    throw new Error("expected a date");
  }
  return value;
};

const august = { from: new Date(2026, 7, 1), to: null };

describe("DateRangePicker", () => {
  it("shows a placeholder when nothing is chosen", () => {
    render(<DateRangePicker label="Shipment window" locale="en-CA" />);
    expect(screen.getByText("Choose a range")).toBeInTheDocument();
  });

  it("shows both ends unambiguously once complete", () => {
    render(
      <DateRangePicker
        label="Shipment window"
        defaultValue={{
          from: new Date(2026, 7, 10),
          to: new Date(2026, 7, 20),
        }}
        locale="en-CA"
      />,
    );
    expect(screen.getByText("2026-08-10 – 2026-08-20")).toBeInTheDocument();
  });

  it("shows a half-open range while picking", () => {
    render(
      <DateRangePicker
        label="Shipment window"
        defaultValue={{ from: new Date(2026, 7, 10), to: null }}
        locale="en-CA"
      />,
    );
    expect(screen.getByText("2026-08-10 – …")).toBeInTheDocument();
  });

  it("opens a dialog holding a calendar", async () => {
    const user = userEvent.setup();
    render(<DateRangePicker label="Shipment window" locale="en-CA" />);
    await user.click(trigger());
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByRole("grid")).toBeInTheDocument();
  });

  it("says which end it is collecting", async () => {
    const user = userEvent.setup();
    render(
      <DateRangePicker
        label="Shipment window"
        defaultValue={august}
        locale="en-CA"
      />,
    );
    await user.click(trigger());
    expect(screen.getByText("Choose the start")).toBeInTheDocument();
    await user.click(day("August 10, 2026"));
    expect(screen.getByText("Choose the end")).toBeInTheDocument();
  });

  describe("two-step picking", () => {
    it("sets the start first and clears the end", async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();
      render(
        <DateRangePicker
          label="Shipment window"
          defaultValue={august}
          onValueChange={onValueChange}
          locale="en-CA"
        />,
      );
      await user.click(trigger());
      await user.click(day("August 10, 2026"));

      const range = onValueChange.mock.calls[0]?.[0] as DateRange;
      expect(toDateString(asDate(range.from))).toBe("2026-08-10");
      expect(range.to).toBeNull();
    });

    it("sets the end on the second click and closes", async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();
      render(
        <DateRangePicker
          label="Shipment window"
          defaultValue={august}
          onValueChange={onValueChange}
          locale="en-CA"
        />,
      );
      await user.click(trigger());
      await user.click(day("August 10, 2026"));
      await user.click(day("August 20, 2026"));

      const range = onValueChange.mock.lastCall?.[0] as DateRange;
      expect(toDateString(asDate(range.from))).toBe("2026-08-10");
      expect(toDateString(asDate(range.to))).toBe("2026-08-20");
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });

    it("restarts rather than producing a backwards range", async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();
      render(
        <DateRangePicker
          label="Shipment window"
          defaultValue={august}
          onValueChange={onValueChange}
          locale="en-CA"
        />,
      );
      await user.click(trigger());
      await user.click(day("August 20, 2026"));
      await user.click(day("August 10, 2026"));

      const range = onValueChange.mock.lastCall?.[0] as DateRange;
      expect(toDateString(asDate(range.from))).toBe("2026-08-10");
      expect(range.to).toBeNull();
    });

    it("starts again from the beginning each time it opens", async () => {
      const user = userEvent.setup();
      render(
        <DateRangePicker
          label="Shipment window"
          defaultValue={august}
          locale="en-CA"
        />,
      );
      await user.click(trigger());
      await user.click(day("August 10, 2026"));
      await user.keyboard("{Escape}");
      await user.click(trigger());
      expect(screen.getByText("Choose the start")).toBeInTheDocument();
    });
  });

  it("returns dates at local midnight", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <DateRangePicker
        label="Shipment window"
        defaultValue={august}
        onValueChange={onValueChange}
        locale="en-CA"
      />,
    );
    await user.click(trigger());
    await user.click(day("August 10, 2026"));

    const range = onValueChange.mock.calls[0]?.[0] as DateRange;
    expect(asDate(range.from).getHours()).toBe(0);
  });

  it("closes on Escape and returns focus", async () => {
    const user = userEvent.setup();
    render(<DateRangePicker label="Shipment window" locale="en-CA" />);
    await user.click(trigger());
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(trigger()).toHaveFocus();
  });

  it("passes bounds through to the calendar", async () => {
    const user = userEvent.setup();
    render(
      <DateRangePicker
        label="Shipment window"
        defaultValue={august}
        minDate={new Date(2026, 7, 10)}
        locale="en-CA"
      />,
    );
    await user.click(trigger());
    expect(day("August 9, 2026")).toBeDisabled();
  });

  it("follows its owner when controlled", async () => {
    const user = userEvent.setup();
    const Controlled = () => {
      const [range, setRange] = useState<DateRange>(august);
      return (
        <DateRangePicker
          label="Shipment window"
          value={range}
          onValueChange={setRange}
          locale="en-CA"
        />
      );
    };
    render(<Controlled />);
    await user.click(trigger());
    await user.click(day("August 10, 2026"));
    expect(screen.getByText("2026-08-10 – …")).toBeInTheDocument();
  });

  it("marks the field invalid from its error", () => {
    render(
      <DateRangePicker
        label="Shipment window"
        error="A window is required."
        locale="en-CA"
      />,
    );
    expect(trigger()).toHaveAttribute("aria-invalid", "true");
  });

  it("disables the control", () => {
    render(<DateRangePicker label="Shipment window" disabled locale="en-CA" />);
    expect(trigger()).toBeDisabled();
  });
});
