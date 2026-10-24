// Same shape the catalog has always built. Inches in, feet out. No prices.
const ft = (i) => Math.round((i / 12) * 1000) / 1000;
export function product(order, id, cat, name, wIn, dIn, hIn, shape, o = {}) {
  return { order, id, cat, name, w: ft(wIn), d: ft(dIn), h: ft(hIn), shape, snapsTo: [], ...o, top: o.topIn ? ft(o.topIn) : undefined };
}
