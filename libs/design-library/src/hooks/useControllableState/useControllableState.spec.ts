import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { useControllableState } from "./useControllableState";

describe("useControllableState", () => {
  it("starts at the default value when uncontrolled", () => {
    const { result } = renderHook(() =>
      useControllableState<boolean>(undefined, false),
    );
    expect(result.current[0]).toBe(false);
  });

  it("updates itself when uncontrolled", () => {
    const { result } = renderHook(() =>
      useControllableState<boolean>(undefined, false),
    );
    act(() => {
      result.current[1](true);
    });
    expect(result.current[0]).toBe(true);
  });

  it("reports changes when uncontrolled", () => {
    const onChange = vi.fn();
    const { result } = renderHook(() =>
      useControllableState<boolean>(undefined, false, onChange),
    );
    act(() => {
      result.current[1](true);
    });
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it("takes its value from the prop when controlled", () => {
    const { result } = renderHook(() =>
      useControllableState<boolean>(true, false),
    );
    expect(result.current[0]).toBe(true);
  });

  it("does not update itself when controlled — the owner decides", () => {
    const { result } = renderHook(() =>
      useControllableState<boolean>(true, false),
    );
    act(() => {
      result.current[1](false);
    });
    expect(result.current[0]).toBe(true);
  });

  it("still reports changes when controlled", () => {
    const onChange = vi.fn();
    const { result } = renderHook(() =>
      useControllableState<boolean>(true, false, onChange),
    );
    act(() => {
      result.current[1](false);
    });
    expect(onChange).toHaveBeenCalledWith(false);
  });

  it("follows the prop when the owner changes it", () => {
    const { result, rerender } = renderHook(
      ({ value }: { value: boolean }) =>
        useControllableState<boolean>(value, false),
      { initialProps: { value: false } },
    );
    rerender({ value: true });
    expect(result.current[0]).toBe(true);
  });

  it("keeps the setter stable across renders", () => {
    const { result, rerender } = renderHook(() =>
      useControllableState<boolean>(undefined, false),
    );
    const first = result.current[1];
    rerender();
    expect(result.current[1]).toBe(first);
  });

  it("calls the latest onChange, not the one from first render", () => {
    const first = vi.fn();
    const second = vi.fn();
    const { result, rerender } = renderHook(
      ({ onChange }: { onChange: (value: boolean) => void }) =>
        useControllableState<boolean>(undefined, false, onChange),
      { initialProps: { onChange: first } },
    );
    rerender({ onChange: second });
    act(() => {
      result.current[1](true);
    });
    expect(first).not.toHaveBeenCalled();
    expect(second).toHaveBeenCalledWith(true);
  });

  it("treats null as controlled — only undefined means uncontrolled", () => {
    const { result } = renderHook(() =>
      useControllableState<string | null>(null, "overview"),
    );
    expect(result.current[0]).toBeNull();
    act(() => {
      result.current[1]("documents");
    });
    expect(result.current[0]).toBeNull();
  });

  it("works for non-boolean values", () => {
    const { result } = renderHook(() =>
      useControllableState<string>(undefined, "overview"),
    );
    act(() => {
      result.current[1]("documents");
    });
    expect(result.current[0]).toBe("documents");
  });
});
