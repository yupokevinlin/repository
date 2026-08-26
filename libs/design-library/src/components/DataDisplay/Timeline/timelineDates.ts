/**
 * The value of a `datetime` attribute — the machine-readable half of `<time>`.
 *
 * Local time with an offset rather than `toISOString`, which converts to UTC
 * and would say a shipment sailed on the 3rd when it sailed on the 2nd (§4.3).
 *
 * @server-safe
 */
export const toDateTimeAttribute = (value: Date): string => {
  const pad = (part: number, length = 2): string =>
    String(part).padStart(length, "0");

  const offset: number = -value.getTimezoneOffset();
  const sign: string = offset < 0 ? "-" : "+";
  const absolute: number = Math.abs(offset);

  return [
    `${pad(value.getFullYear(), 4)}-${pad(value.getMonth() + 1)}-${pad(value.getDate())}`,
    "T",
    `${pad(value.getHours())}:${pad(value.getMinutes())}:${pad(value.getSeconds())}`,
    `${sign}${pad(Math.floor(absolute / 60))}:${pad(absolute % 60)}`,
  ].join("");
};

/**
 * How a timestamp reads to a person. Localised, following `Calendar`.
 *
 * @server-safe
 */
export const timestampLabel = (value: Date, locale?: string): string =>
  new Intl.DateTimeFormat(locale, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(value);

/**
 * Whether the two timestamps are far enough apart to be worth showing
 * separately.
 *
 * Compared to the minute, not the millisecond: a record written a few hundred
 * milliseconds after the event it describes is the same moment as far as
 * anyone reading it is concerned, and showing both would be noise.
 *
 * @server-safe
 */
export const differsInTime = (left: Date, right: Date): boolean =>
  Math.abs(left.getTime() - right.getTime()) >= 60_000;
