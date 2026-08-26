/** Every size in this module is a percentage of the container. */
export interface PanelConstraint {
  /** Smallest the panel may be dragged to. Defaults to 0. */
  minSize?: number;
  /** Largest it may be dragged to. Defaults to 100. */
  maxSize?: number;
  /**
   * Whether dragging past `minSize` snaps it shut instead of stopping there.
   * A collapsed panel is 0, and Enter on its handle toggles it.
   */
  collapsible?: boolean;
}

const clamp = (value: number, low: number, high: number): number =>
  Math.min(Math.max(value, low), high);

const lowerBound = (constraint: PanelConstraint | undefined): number =>
  constraint?.minSize ?? 0;

const upperBound = (constraint: PanelConstraint | undefined): number =>
  constraint?.maxSize ?? 100;

/**
 * Spreads `count` panels evenly, for a group where nobody said otherwise.
 *
 * @server-safe
 */
export const evenSizes = (count: number): Array<number> =>
  count <= 0 ? [] : Array.from({ length: count }, () => 100 / count);

/**
 * Fills in the sizes a group starts at: whatever `defaultSize` each panel
 * asked for, with the rest sharing what is left.
 *
 * @server-safe
 */
export const initialSizes = (
  requested: Array<number | undefined>,
): Array<number> => {
  const count: number = requested.length;
  if (count === 0) {
    return [];
  }

  const given: number = requested.reduce<number>(
    (total: number, size: number | undefined) => total + (size ?? 0),
    0,
  );
  const unset: number = requested.filter(
    (size: number | undefined) => size === undefined,
  ).length;

  if (unset === 0) {
    // Everything was specified. Normalise, so sizes that do not add to 100 are
    // still a valid layout rather than a gap or an overflow.
    return requested.map((size: number | undefined) =>
      given === 0 ? 100 / count : ((size ?? 0) / given) * 100,
    );
  }

  const share: number = Math.max(0, (100 - given) / unset);
  return requested.map((size: number | undefined) => size ?? share);
};

export interface ResizeArgs {
  sizes: Array<number>;
  /** The handle between panel `handle` and panel `handle + 1`. */
  handle: number;
  /** How far to move it, in percentage points. Negative moves it back. */
  delta: number;
  constraints: Array<PanelConstraint | undefined>;
}

/**
 * Moves one boundary and returns the new sizes.
 *
 * Only the two panels either side of the handle change, and their total is
 * preserved exactly — a splitter moves a boundary, it does not redistribute
 * the group. That is what keeps the panels further along from drifting as the
 * user drags, and what makes a drag reversible: drag out and back and you are
 * where you started.
 *
 * The movement is clamped by whichever of the two runs into a limit first, so
 * the boundary stops rather than one panel eating into the other's minimum.
 * A `collapsible` panel snaps shut instead when dragged past halfway to its
 * minimum.
 *
 * @server-safe
 *
 * @example
 * ```ts
 * resize({ sizes: [50, 50], handle: 0, delta: 10, constraints: [] });
 * // [60, 40]
 * ```
 */
export const resize = ({
  sizes,
  handle,
  delta,
  constraints,
}: ResizeArgs): Array<number> => {
  const before: number | undefined = sizes[handle];
  const after: number | undefined = sizes[handle + 1];
  if (before === undefined || after === undefined) {
    return sizes;
  }

  const total: number = before + after;
  const beforeConstraint: PanelConstraint | undefined = constraints[handle];
  const afterConstraint: PanelConstraint | undefined = constraints[handle + 1];

  const beforeMin: number = lowerBound(beforeConstraint);
  const beforeMax: number = upperBound(beforeConstraint);
  const afterMin: number = lowerBound(afterConstraint);
  const afterMax: number = upperBound(afterConstraint);

  // The first panel's range, once the second panel's limits are folded in:
  // whatever it takes, the other one has to be able to take the remainder.
  const low: number = Math.max(beforeMin, total - afterMax);
  const high: number = Math.min(beforeMax, total - afterMin);

  const wanted: number = before + delta;

  // Past halfway to its minimum, a collapsible panel snaps shut rather than
  // stopping at a minimum the user is clearly trying to get under.
  if (
    beforeConstraint?.collapsible === true &&
    wanted < beforeMin &&
    wanted <= beforeMin / 2 &&
    total <= afterMax
  ) {
    return sizes.map((size: number, index: number) =>
      index === handle ? 0 : index === handle + 1 ? total : size,
    );
  }

  if (
    afterConstraint?.collapsible === true &&
    total - wanted < afterMin &&
    total - wanted <= afterMin / 2 &&
    total <= beforeMax
  ) {
    return sizes.map((size: number, index: number) =>
      index === handle ? total : index === handle + 1 ? 0 : size,
    );
  }

  if (low > high) {
    return sizes;
  }

  const next: number = clamp(wanted, low, high);

  return sizes.map((size: number, index: number) =>
    index === handle ? next : index === handle + 1 ? total - next : size,
  );
};

/**
 * Shuts the panel before the handle, or reopens it at the size it would have
 * had. Enter on a splitter does this (APG).
 *
 * @server-safe
 */
export const toggleCollapse = ({
  sizes,
  handle,
  constraints,
}: Omit<ResizeArgs, "delta">): Array<number> => {
  const before: number | undefined = sizes[handle];
  const after: number | undefined = sizes[handle + 1];
  if (before === undefined || after === undefined) {
    return sizes;
  }

  const total: number = before + after;
  const constraint: PanelConstraint | undefined = constraints[handle];

  if (before === 0) {
    // Reopening lands on the minimum, which is the size the panel itself said
    // it needs to be useful.
    const restored: number = Math.min(
      Math.max(lowerBound(constraint), total / 2),
      upperBound(constraint),
    );
    return sizes.map((size: number, index: number) =>
      index === handle
        ? restored
        : index === handle + 1
          ? total - restored
          : size,
    );
  }

  return sizes.map((size: number, index: number) =>
    index === handle ? 0 : index === handle + 1 ? total : size,
  );
};
