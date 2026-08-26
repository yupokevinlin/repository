import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import { HoverCard } from "./HoverCard";

const trigger = (): HTMLElement => screen.getByRole("link");

const card = (): HTMLElement => screen.getByRole("note");

afterEach(() => {
  vi.useRealTimers();
});

const Basic = ({
  openDelay = 0,
  closeDelay = 0,
  onOpenChange,
}: {
  openDelay?: number;
  closeDelay?: number;
  onOpenChange?: (open: boolean) => void;
}) => (
  <HoverCard
    aria-label="Counterparty"
    openDelay={openDelay}
    closeDelay={closeDelay}
    onOpenChange={onOpenChange}
    content={<span>{"Osaka · credit CAD 250,000"}</span>}
  >
    <a href="/app/parties/1">{"Kanto Polymer KK"}</a>
  </HoverCard>
);

describe("HoverCard", () => {
  it("stays closed until something asks for it", () => {
    render(<Basic />);
    expect(screen.queryByRole("note")).not.toBeInTheDocument();
  });

  it("opens on focus, which is what makes it reachable at all", async () => {
    const user = userEvent.setup();
    render(<Basic />);
    await user.tab();
    expect(await screen.findByRole("note")).toBeInTheDocument();
  });

  it("opens without delay on focus even when hover waits", async () => {
    const user = userEvent.setup();
    render(<Basic openDelay={5000} />);
    await user.tab();
    expect(screen.getByRole("note")).toBeInTheDocument();
  });

  it("opens on hover", async () => {
    const user = userEvent.setup();
    render(<Basic />);
    await user.hover(trigger());
    expect(await screen.findByRole("note")).toBeInTheDocument();
  });

  it("waits out the open delay", async () => {
    const user = userEvent.setup();
    render(<Basic openDelay={500} />);
    await user.hover(trigger());
    expect(screen.queryByRole("note")).not.toBeInTheDocument();
    expect(
      await screen.findByRole("note", {}, { timeout: 3000 }),
    ).toBeInTheDocument();
  });

  it("closes when the pointer leaves", async () => {
    const user = userEvent.setup();
    render(<Basic />);
    await user.hover(trigger());
    await screen.findByRole("note");
    await user.unhover(trigger());
    expect(screen.queryByRole("note")).not.toBeInTheDocument();
  });

  it("survives the pointer moving onto the card, unlike a Tooltip", async () => {
    const user = userEvent.setup();
    render(<Basic closeDelay={1000} />);
    await user.hover(trigger());
    await screen.findByRole("note");

    await user.unhover(trigger());
    await user.hover(card());
    expect(card()).toBeInTheDocument();
  });

  it("accepts the pointer rather than being pointer-events-none", async () => {
    const user = userEvent.setup();
    render(<Basic />);
    await user.tab();
    expect(card().className).not.toContain("pointer-events-none");
  });

  it("dismisses on Escape", async () => {
    const user = userEvent.setup();
    render(<Basic />);
    await user.tab();
    await screen.findByRole("note");
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("note")).not.toBeInTheDocument();
  });

  it("describes its trigger", async () => {
    const user = userEvent.setup();
    render(<Basic />);
    await user.tab();
    expect(trigger()).toHaveAccessibleDescription("Osaka · credit CAD 250,000");
  });

  it("names the card", async () => {
    const user = userEvent.setup();
    render(<Basic />);
    await user.tab();
    expect(
      screen.getByRole("note", { name: "Counterparty" }),
    ).toBeInTheDocument();
  });

  it("renders into a portal", async () => {
    const user = userEvent.setup();
    const { container } = render(
      <div style={{ overflow: "hidden" }}>
        <Basic />
      </div>,
    );
    await user.tab();
    expect(container.contains(await screen.findByRole("note"))).toBe(false);
  });

  it("reports opening", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(<Basic onOpenChange={onOpenChange} />);
    await user.tab();
    expect(onOpenChange).toHaveBeenCalledWith(true);
  });

  it("can be driven from outside", () => {
    render(
      <HoverCard
        aria-label="Counterparty"
        open
        content={<span>{"Osaka"}</span>}
      >
        <a href="/app/parties/1">{"Kanto Polymer KK"}</a>
      </HoverCard>,
    );
    expect(card()).toBeInTheDocument();
  });
});
