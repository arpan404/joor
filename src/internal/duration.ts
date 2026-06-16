const durationMsCache = new Map<string, number>();

export const parseDurationMs = (duration: string): number => {
  const cached = durationMsCache.get(duration);
  if (cached !== undefined) return cached;
  const match = /^(\d+)(ms|s|m|h)$/.exec(duration);
  if (match === null) {
    durationMsCache.set(duration, 60_000);
    return 60_000;
  }
  const amount = Number(match[1]);
  const unit = match[2];
  const value =
    unit === 'ms'
      ? amount
      : unit === 's'
        ? amount * 1_000
        : unit === 'm'
          ? amount * 60_000
          : amount * 3_600_000;
  durationMsCache.set(duration, value);
  return value;
};
