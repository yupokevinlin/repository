import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";

import { toDateString } from "../../Overlays/Calendar/calendarDates";
import { DatePicker } from "./DatePicker";

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

const trigger = (): HTMLElement => screen.getByRole("button", { name: /ETA/ });

const day = (label: string): HTMLElement =>
  screen.getByRole("gridcell", { name: new RegExp(label) });

describe("DatePicker", () => {
  it("renders its own label, tied to the trigger", () => {
    render(<DatePicker label="ETA" locale="en-CA" />);
    expect(trigger()).toBeInTheDocument();
  });

  it("shows a placeholder when empty", () => {
    render(<DatePicker label="ETA" locale="en-CA" />);
    expect(screen.getByText("Choose a date")).toBeInTheDocument();
  });

  it("shows the date unambiguously, as YYYY-MM-DD", () => {
    render(
      <DatePicker
        label="ETA"
        defaultValue={new Date(2026, 7, 18)}
        locale="en-CA"
      />,
    );
    expect(screen.getByText("2026-08-18")).toBeInTheDocument();
  });

  it("stays closed until the trigger is used", () => {
    render(<DatePicker label="ETA" locale="en-CA" />);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("opens a dialog holding a calendar", async () => {
    const user = userEvent.setup();
    render(<DatePicker label="ETA" locale="en-CA" />);
    await user.click(trigger());
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByRole("grid")).toBeInTheDocument();
  });

  it("says the trigger opens a dialog", () => {
    render(<DatePicker label="ETA" locale="en-CA" />);
    expect(trigger()).toHaveAttribute("aria-haspopup", "dialog");
    expect(trigger()).toHaveAttribute("aria-expanded", "false");
  });

  it("reports the date at local midnight and closes", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <DatePicker
        label="ETA"
        defaultValue={new Date(2026, 7, 1)}
        onValueChange={onValueChange}
        locale="en-CA"
      />,
    );
    await user.click(trigger());
    await user.click(day("August 18, 2026"));

    const chosen = asDate(onValueChange.mock.calls[0]?.[0] as Date | undefined);
    expect(toDateString(chosen)).toBe("2026-08-18");
    expect(chosen.getHours()).toBe(0);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("returns focus to the field after choosing", async () => {
    const user = userEvent.setup();
    render(
      <DatePicker
        label="ETA"
        defaultValue={new Date(2026, 7, 1)}
        locale="en-CA"
      />,
    );
    await user.click(trigger());
    await user.click(day("August 18, 2026"));
    expect(trigger()).toHaveFocus();
  });

  it("closes on Escape and returns focus", async () => {
    const user = userEvent.setup();
    render(<DatePicker label="ETA" locale="en-CA" />);
    await user.click(trigger());
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(trigger()).toHaveFocus();
  });

  it("closes on a click outside", async () => {
    const user = userEvent.setup();
    render(
      <>
        <DatePicker label="ETA" locale="en-CA" />
        <button>{"Outside"}</button>
      </>,
    );
    await user.click(trigger());
    await user.click(screen.getByRole("button", { name: "Outside" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("passes bounds through to the calendar", async () => {
    const user = userEvent.setup();
    render(
      <DatePicker
        label="ETA"
        defaultValue={new Date(2026, 7, 15)}
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
      const [value, setValue] = useState<Date | null>(new Date(2026, 7, 1));
      return (
        <DatePicker
          label="ETA"
          value={value}
          onValueChange={setValue}
          locale="en-CA"
        />
      );
    };
    render(<Controlled />);
    await user.click(trigger());
    await user.click(day("August 18, 2026"));
    expect(screen.getByText("2026-08-18")).toBeInTheDocument();
  });

  it("renders the dialog in a portal", async () => {
    const user = userEvent.setup();
    const { container } = render(
      <div style={{ overflow: "hidden" }}>
        <DatePicker label="ETA" locale="en-CA" />
      </div>,
    );
    await user.click(trigger());
    expect(container.contains(screen.getByRole("dialog"))).toBe(false);
  });

  it("describes the field with its hint", () => {
    render(
      <DatePicker label="ETA" hint="Local time at the port." locale="en-CA" />,
    );
    expect(trigger()).toHaveAccessibleDescription("Local time at the port.");
  });

  it("marks the field invalid from its error", () => {
    render(<DatePicker label="ETA" error="ETA is required." locale="en-CA" />);
    expect(trigger()).toHaveAttribute("aria-invalid", "true");
  });

  it("disables the control", () => {
    render(<DatePicker label="ETA" disabled locale="en-CA" />);
    expect(trigger()).toBeDisabled();
  });
});
