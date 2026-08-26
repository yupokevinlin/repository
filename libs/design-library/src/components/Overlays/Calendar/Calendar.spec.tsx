import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";

import { Calendar } from "./Calendar";
import { toDateString } from "./calendarDates";

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

const august2026 = new Date(2026, 7, 1);

const grid = (): HTMLElement => screen.getByRole("grid");

const day = (label: string): HTMLElement =>
  screen.getByRole("gridcell", { name: new RegExp(label) });

const focusedDay = (): HTMLElement | null =>
  grid().querySelector<HTMLElement>('[tabindex="0"]');

describe("Calendar", () => {
  it("renders a grid", () => {
    render(<Calendar defaultMonth={august2026} locale="en-CA" />);
    expect(grid()).toBeInTheDocument();
  });

  it("shows the month and year", () => {
    render(<Calendar defaultMonth={august2026} locale="en-CA" />);
    expect(screen.getByText(/August 2026/)).toBeInTheDocument();
  });

  it("is always six weeks tall, so paging does not move the buttons", () => {
    const { rerender } = render(
      <Calendar defaultMonth={august2026} locale="en-CA" />,
    );
    const august: number = screen.getAllByRole("gridcell").length;
    rerender(<Calendar defaultMonth={new Date(2026, 1, 1)} locale="en-CA" />);
    expect(screen.getAllByRole("gridcell")).toHaveLength(august);
    expect(august).toBe(42);
  });

  it("renders seven weekday headings", () => {
    render(<Calendar defaultMonth={august2026} locale="en-CA" />);
    expect(screen.getAllByRole("columnheader")).toHaveLength(7);
  });

  describe("paging", () => {
    it("goes back a month", async () => {
      const user = userEvent.setup();
      render(<Calendar defaultMonth={august2026} locale="en-CA" />);
      await user.click(screen.getByRole("button", { name: "Previous month" }));
      expect(screen.getByText(/July 2026/)).toBeInTheDocument();
    });

    it("goes forward a month", async () => {
      const user = userEvent.setup();
      render(<Calendar defaultMonth={august2026} locale="en-CA" />);
      await user.click(screen.getByRole("button", { name: "Next month" }));
      expect(screen.getByText(/September 2026/)).toBeInTheDocument();
    });

    it("reports the month change", async () => {
      const user = userEvent.setup();
      const onMonthChange = vi.fn();
      render(
        <Calendar
          defaultMonth={august2026}
          locale="en-CA"
          onMonthChange={onMonthChange}
        />,
      );
      await user.click(screen.getByRole("button", { name: "Next month" }));
      expect(onMonthChange).toHaveBeenCalled();
    });
  });

  describe("choosing", () => {
    it("reports the date at local midnight", async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();
      render(
        <Calendar
          defaultMonth={august2026}
          locale="en-CA"
          onValueChange={onValueChange}
        />,
      );
      await user.click(day("August 18, 2026"));

      const chosen = asDate(
        onValueChange.mock.calls[0]?.[0] as Date | undefined,
      );
      expect(toDateString(chosen)).toBe("2026-08-18");
      expect(chosen.getHours()).toBe(0);
    });

    it("marks the chosen day selected", () => {
      render(
        <Calendar
          defaultMonth={august2026}
          defaultValue={new Date(2026, 7, 18)}
          locale="en-CA"
        />,
      );
      expect(day("August 18, 2026")).toHaveAttribute("aria-selected", "true");
    });

    it("follows its owner when controlled", async () => {
      const user = userEvent.setup();
      const Controlled = () => {
        const [value, setValue] = useState<Date | null>(null);
        return (
          <Calendar
            value={value}
            onValueChange={setValue}
            defaultMonth={august2026}
            locale="en-CA"
          />
        );
      };
      render(<Controlled />);
      await user.click(day("August 18, 2026"));
      expect(day("August 18, 2026")).toHaveAttribute("aria-selected", "true");
    });
  });

  describe("bounds", () => {
    it("disables a day before minDate", () => {
      render(
        <Calendar
          defaultMonth={august2026}
          minDate={new Date(2026, 7, 10)}
          locale="en-CA"
        />,
      );
      expect(day("August 9, 2026")).toBeDisabled();
      expect(day("August 10, 2026")).toBeEnabled();
    });

    it("disables a day after maxDate", () => {
      render(
        <Calendar
          defaultMonth={august2026}
          maxDate={new Date(2026, 7, 20)}
          locale="en-CA"
        />,
      );
      expect(day("August 21, 2026")).toBeDisabled();
      expect(day("August 20, 2026")).toBeEnabled();
    });

    it("refuses to choose a disabled day", async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();
      render(
        <Calendar
          defaultMonth={august2026}
          minDate={new Date(2026, 7, 10)}
          onValueChange={onValueChange}
          locale="en-CA"
        />,
      );
      await user.click(day("August 9, 2026"));
      expect(onValueChange).not.toHaveBeenCalled();
    });
  });

  describe("keyboard", () => {
    it("is a single tab stop", () => {
      render(
        <Calendar
          defaultMonth={august2026}
          defaultValue={new Date(2026, 7, 18)}
          locale="en-CA"
        />,
      );
      const tabbable = grid().querySelectorAll('[tabindex="0"]');
      expect(tabbable).toHaveLength(1);
    });

    it("moves by a day with the arrows", async () => {
      const user = userEvent.setup();
      render(
        <Calendar
          defaultMonth={august2026}
          defaultValue={new Date(2026, 7, 18)}
          locale="en-CA"
        />,
      );
      day("August 18, 2026").focus();
      await user.keyboard("{ArrowRight}");
      expect(focusedDay()).toHaveAttribute("data-date", "2026-7-19");
    });

    it("moves by a week with ArrowDown", async () => {
      const user = userEvent.setup();
      render(
        <Calendar
          defaultMonth={august2026}
          defaultValue={new Date(2026, 7, 18)}
          locale="en-CA"
        />,
      );
      day("August 18, 2026").focus();
      await user.keyboard("{ArrowDown}");
      expect(focusedDay()).toHaveAttribute("data-date", "2026-7-25");
    });

    it("moves by a month with PageDown", async () => {
      const user = userEvent.setup();
      render(
        <Calendar
          defaultMonth={august2026}
          defaultValue={new Date(2026, 7, 18)}
          locale="en-CA"
        />,
      );
      day("August 18, 2026").focus();
      await user.keyboard("{PageDown}");
      expect(screen.getByText(/September 2026/)).toBeInTheDocument();
    });

    it("moves by a year with Shift+PageDown", async () => {
      const user = userEvent.setup();
      render(
        <Calendar
          defaultMonth={august2026}
          defaultValue={new Date(2026, 7, 18)}
          locale="en-CA"
        />,
      );
      day("August 18, 2026").focus();
      await user.keyboard("{Shift>}{PageDown}{/Shift}");
      expect(screen.getByText(/August 2027/)).toBeInTheDocument();
    });

    it("pages the month when the arrows cross its edge", async () => {
      const user = userEvent.setup();
      render(
        <Calendar
          defaultMonth={august2026}
          defaultValue={new Date(2026, 7, 31)}
          locale="en-CA"
        />,
      );
      day("August 31, 2026").focus();
      await user.keyboard("{ArrowRight}");
      expect(screen.getByText(/September 2026/)).toBeInTheDocument();
    });
  });

  it("marks today", () => {
    render(<Calendar locale="en-CA" />);
    expect(grid().querySelector('[aria-current="date"]')).toBeInTheDocument();
  });

  it("takes an explicit week start", () => {
    render(
      <Calendar defaultMonth={august2026} locale="en-CA" weekStartsOn={0} />,
    );
    expect(screen.getAllByRole("columnheader")[0]?.textContent).toMatch(/^Sun/);
  });

  it("takes caller-supplied button names", () => {
    render(
      <Calendar
        defaultMonth={august2026}
        locale="en-CA"
        previousMonthLabel="Mois précédent"
        nextMonthLabel="Mois suivant"
      />,
    );
    expect(
      screen.getByRole("button", { name: "Mois précédent" }),
    ).toBeInTheDocument();
  });
});
