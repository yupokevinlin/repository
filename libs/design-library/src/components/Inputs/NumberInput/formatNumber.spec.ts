import { describe, expect, it } from "vitest";

import {
  clampValue,
  formatNumber,
  isCompleteNumber,
  isEditableNumber,
  stepValue,
  toRawValue,
} from "./formatNumber";

describe("isEditableNumber", () => {
  it("accepts a whole number", () => {
    expect(isEditableNumber("1234")).toBe(true);
  });

  it("accepts a decimal", () => {
    expect(isEditableNumber("12.34")).toBe(true);
  });

  it("accepts a trailing dot, which is mid-typing", () => {
    expect(isEditableNumber("12.")).toBe(true);
  });

  it("accepts a lone minus, which is also mid-typing", () => {
    expect(isEditableNumber("-")).toBe(true);
  });

  it("accepts empty", () => {
    expect(isEditableNumber("")).toBe(true);
  });

  it("rejects letters", () => {
    expect(isEditableNumber("12a")).toBe(false);
  });

  it("rejects two dots", () => {
    expect(isEditableNumber("1.2.3")).toBe(false);
  });

  it("rejects a minus in the middle", () => {
    expect(isEditableNumber("1-2")).toBe(false);
  });
});

describe("isCompleteNumber", () => {
  it("accepts a finished number", () => {
    expect(isCompleteNumber("12.34")).toBe(true);
  });

  it("rejects a trailing dot", () => {
    expect(isCompleteNumber("12.")).toBe(false);
  });

  it("rejects a lone minus", () => {
    expect(isCompleteNumber("-")).toBe(false);
  });

  it("rejects empty", () => {
    expect(isCompleteNumber("")).toBe(false);
  });
});

describe("toRawValue", () => {
  it("strips grouping separators", () => {
    expect(toRawValue("1,234,567.89")).toBe("1234567.89");
  });

  it("leaves a plain number alone", () => {
    expect(toRawValue("1234")).toBe("1234");
  });

  it("keeps a leading minus", () => {
    expect(toRawValue("-1,200")).toBe("-1200");
  });
});

describe("formatNumber", () => {
  it("groups thousands", () => {
    expect(formatNumber("1234567", { locale: "en-CA" })).toBe("1,234,567");
  });

  it("pads to a fixed number of decimals", () => {
    expect(formatNumber("1234567.5", { locale: "en-CA", decimals: 2 })).toBe(
      "1,234,567.50",
    );
  });

  it("rounds to the fixed number of decimals", () => {
    expect(formatNumber("1.005", { locale: "en-CA", decimals: 2 })).toBe(
      "1.01",
    );
  });

  it("keeps whatever decimals were typed when none is fixed", () => {
    expect(formatNumber("1.5", { locale: "en-CA" })).toBe("1.5");
  });

  it("can be told not to group", () => {
    expect(formatNumber("1234567", { locale: "en-CA", grouping: false })).toBe(
      "1234567",
    );
  });

  it("leaves a half-typed value untouched, so the cursor is not disturbed", () => {
    expect(formatNumber("1.", { locale: "en-CA" })).toBe("1.");
  });

  it("leaves a lone minus untouched", () => {
    expect(formatNumber("-", { locale: "en-CA" })).toBe("-");
  });

  it("leaves an empty value untouched", () => {
    expect(formatNumber("", { locale: "en-CA" })).toBe("");
  });

  it("re-formats an already formatted value without doubling separators", () => {
    expect(formatNumber("1,234,567", { locale: "en-CA" })).toBe("1,234,567");
  });

  it("handles negatives", () => {
    expect(formatNumber("-1234.5", { locale: "en-CA", decimals: 2 })).toBe(
      "-1,234.50",
    );
  });
});

describe("stepValue", () => {
  it("adds a whole step", () => {
    expect(stepValue("10", 1)).toBe("11");
  });

  it("subtracts", () => {
    expect(stepValue("10", -1)).toBe("9");
  });

  it("treats an empty value as zero", () => {
    expect(stepValue("", 1)).toBe("1");
  });

  it("steps a formatted value", () => {
    expect(stepValue("1,234", 1)).toBe("1235");
  });

  it("keeps the field's precision rather than floating-point dust", () => {
    expect(stepValue("0.1", 0.2, 2)).toBe("0.30");
  });

  it("infers precision from the operands when none is fixed", () => {
    expect(stepValue("0.1", 0.2)).toBe("0.3");
  });
});

describe("clampValue", () => {
  it("raises a value below the minimum", () => {
    expect(clampValue("-5", 0)).toBe("0");
  });

  it("lowers a value above the maximum", () => {
    expect(clampValue("150", 0, 100)).toBe("100");
  });

  it("leaves a value in range alone", () => {
    expect(clampValue("50", 0, 100)).toBe("50");
  });

  it("strips separators from a value in range", () => {
    expect(clampValue("1,500", 0)).toBe("1500");
  });

  it("leaves a half-typed value alone rather than clamping it to a bound", () => {
    expect(clampValue("-", 0)).toBe("-");
  });

  it("leaves an empty value alone", () => {
    expect(clampValue("", 0, 100)).toBe("");
  });
});
