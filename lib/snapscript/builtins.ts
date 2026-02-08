import { SnapContext } from "./types";

export function buildStats(data: Array<{ label: string; value: number; sortOrder: number }>) {
  const values = data.map((d) => d.value);
  const count = values.length || 0;
  const sum = values.reduce((a, b) => a + b, 0);
  const min = count ? Math.min(...values) : 0;
  const max = count ? Math.max(...values) : 0;
  const avg = count ? sum / count : 0;
  const last = count ? values[count - 1] : 0;
  const prev = count >= 2 ? values[count - 2] : last;
  const delta = last - prev;
  const deltaPct = prev === 0 ? (last === 0 ? 0 : 100) : (delta / Math.abs(prev)) * 100;
  return { count, sum, min, max, avg, last, prev, delta, deltaPct };
}

export function makeBuiltins(ctx: SnapContext) {
  const dataByLabel = new Map(ctx.data.map((d) => [d.label, d.value]));

  return {
    min: () => ctx.stats.min,
    max: () => ctx.stats.max,
    sum: () => ctx.stats.sum,
    avg: () => ctx.stats.avg,
    count: () => ctx.stats.count,
    last: () => ctx.stats.last,
    prev: () => ctx.stats.prev,
    delta: () => ctx.stats.delta,
    deltaPct: () => ctx.stats.deltaPct,
    round: (x: number, n = 0) => {
      const p = Math.pow(10, n);
      return Math.round(x * p) / p;
    },
    value: (label: string) => dataByLabel.get(label) ?? 0,
  };
}
