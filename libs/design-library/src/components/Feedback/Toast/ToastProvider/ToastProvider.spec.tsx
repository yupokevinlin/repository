import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useRef } from "react";
import { describe, expect, it, vi } from "vitest";

import type { ToastOptions } from "../toastContext";
import { useToast } from "../useToast/useToast";
import { ToastProvider, type ToastProviderProps } from "./ToastProvider";

const Raiser = ({
  options,
  label,
}: {
  options: ToastOptions;
  label?: string;
}) => {
  const { toast } = useToast();
  return (
    <button
      onClick={() => {
        toast(options);
      }}
    >
      {label ?? "Raise"}
    </button>
  );
};

const renderWithProvider = (
  children: React.ReactNode,
  props: Partial<ToastProviderProps> = {},
): ReturnType<typeof userEvent.setup> => {
  const user = userEvent.setup();
  render(<ToastProvider {...props}>{children}</ToastProvider>);
  return user;
};

const raise = (): HTMLElement => screen.getByRole("button", { name: "Raise" });

describe("ToastProvider", () => {
  it("renders its children", () => {
    render(
      <ToastProvider>
        <span>{"The app"}</span>
      </ToastProvider>,
    );
    expect(screen.getByText("The app")).toBeInTheDocument();
  });

  it("shows nothing until something raises a toast", () => {
    render(
      <ToastProvider>
        <span>{"The app"}</span>
      </ToastProvider>,
    );
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });

  it("shows one when asked", async () => {
    const user = renderWithProvider(
      <Raiser options={{ title: "Deal saved", duration: null }} />,
    );
    await user.click(raise());
    expect(screen.getByText("Deal saved")).toBeInTheDocument();
  });

  it("puts them in a landmark, so they can be navigated back to", () => {
    render(
      <ToastProvider>
        <span>{"The app"}</span>
      </ToastProvider>,
    );
    expect(
      screen.getByRole("region", { name: "Notifications" }),
    ).toBeInTheDocument();
  });

  it("takes a caller-supplied landmark name", () => {
    render(
      <ToastProvider label="Messages">
        <span>{"The app"}</span>
      </ToastProvider>,
    );
    expect(
      screen.getByRole("region", { name: "Messages" }),
    ).toBeInTheDocument();
  });

  it("renders the viewport into a portal", () => {
    const { container } = render(
      <div style={{ overflow: "hidden" }}>
        <ToastProvider>
          <span>{"The app"}</span>
        </ToastProvider>
      </div>,
    );
    expect(container.contains(screen.getByRole("region"))).toBe(false);
  });

  it("stacks several", async () => {
    const user = renderWithProvider(
      <Raiser options={{ title: "Deal saved", duration: null }} />,
    );
    await user.click(raise());
    await user.click(raise());
    expect(screen.getAllByText("Deal saved")).toHaveLength(2);
  });

  it("drops the oldest past the limit, rather than covering the page", async () => {
    const Counter = () => {
      const { toast } = useToast();
      const count = useRef<number>(0);
      return (
        <button
          onClick={() => {
            count.current += 1;
            toast({ title: `Toast ${String(count.current)}`, duration: null });
          }}
        >
          {"Raise"}
        </button>
      );
    };
    const user = renderWithProvider(<Counter />, { max: 2 });
    await user.click(raise());
    await user.click(raise());
    await user.click(raise());

    expect(screen.queryByText("Toast 1")).not.toBeInTheDocument();
    expect(screen.getByText("Toast 2")).toBeInTheDocument();
    expect(screen.getByText("Toast 3")).toBeInTheDocument();
  });

  it("takes one away when the user dismisses it", async () => {
    const user = renderWithProvider(
      <Raiser options={{ title: "Deal saved", duration: null }} />,
    );
    await user.click(raise());
    await user.click(screen.getByRole("button", { name: "Dismiss" }));
    expect(screen.queryByText("Deal saved")).not.toBeInTheDocument();
  });

  it("takes one away when its timer runs out", async () => {
    const user = renderWithProvider(
      <Raiser options={{ title: "Deal saved", duration: 20 }} />,
    );
    await user.click(raise());
    await waitFor(() => {
      expect(screen.queryByText("Deal saved")).not.toBeInTheDocument();
    });
  });

  describe("duration", () => {
    it("applies the provider's default", async () => {
      const user = renderWithProvider(
        <Raiser options={{ title: "Deal saved" }} />,
        { duration: 20 },
      );
      await user.click(raise());
      await waitFor(() => {
        expect(screen.queryByText("Deal saved")).not.toBeInTheDocument();
      });
    });

    it("lets a null from the caller beat that default, rather than falling through it", async () => {
      const user = renderWithProvider(
        <Raiser options={{ title: "Could not save", duration: null }} />,
        { duration: 20 },
      );
      await user.click(raise());
      await new Promise((resolve) => setTimeout(resolve, 60));
      expect(screen.getByText("Could not save")).toBeInTheDocument();
    });
  });

  describe("the api", () => {
    it("hands back an id that dismisses the right one", async () => {
      const Uploader = () => {
        const { toast, dismiss } = useToast();
        const id = useRef<string>("");
        return (
          <>
            <button
              onClick={() => {
                id.current = toast({ title: "Uploading", duration: null });
              }}
            >
              {"Raise"}
            </button>
            <button
              onClick={() => {
                dismiss(id.current);
              }}
            >
              {"Finish"}
            </button>
          </>
        );
      };
      const user = renderWithProvider(<Uploader />);
      await user.click(raise());
      expect(screen.getByText("Uploading")).toBeInTheDocument();
      await user.click(screen.getByRole("button", { name: "Finish" }));
      expect(screen.queryByText("Uploading")).not.toBeInTheDocument();
    });

    it("clears the lot", async () => {
      const Clearer = () => {
        const { toast, dismissAll } = useToast();
        return (
          <>
            <button
              onClick={() => {
                toast({ title: "Deal saved", duration: null });
              }}
            >
              {"Raise"}
            </button>
            <button onClick={dismissAll}>{"Navigate away"}</button>
          </>
        );
      };
      const user = renderWithProvider(<Clearer />);
      await user.click(raise());
      await user.click(raise());
      await user.click(screen.getByRole("button", { name: "Navigate away" }));
      expect(screen.queryByText("Deal saved")).not.toBeInTheDocument();
    });

    it("keeps the same api across renders, so raising one re-renders nobody", async () => {
      const seen: Array<unknown> = [];
      const Watcher = () => {
        const api = useToast();
        seen.push(api);
        return (
          <button
            onClick={() => {
              api.toast({ title: "Deal saved", duration: null });
            }}
          >
            {"Raise"}
          </button>
        );
      };
      const user = renderWithProvider(<Watcher />);
      await user.click(raise());
      expect(new Set(seen).size).toBe(1);
    });
  });

  describe("without a provider", () => {
    it("throws, rather than silently swallowing the notification", () => {
      const Orphan = () => {
        useToast();
        return null;
      };
      const consoleError = vi
        .spyOn(console, "error")
        .mockImplementation(() => undefined);

      expect(() => {
        render(<Orphan />);
      }).toThrow(/ToastProvider/);

      consoleError.mockRestore();
    });
  });
});
