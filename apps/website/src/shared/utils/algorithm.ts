const bound =
  (cmp: (a: number, b: number) => boolean) =>
  <T>(array: T[], keyFn: (val: T) => number, searchkey: number) => {
    let lo = 0;
    let hi = array.length;
    while (lo < hi) {
      const mid = ((lo + hi) / 2) | 0;
      if (cmp(keyFn(array[mid]!), searchkey)) {
        lo = mid + 1;
      } else {
        hi = mid;
      }
    }
    return lo;
  };

export const upperbound = bound((a, b) => a <= b);
export const lowerbound = bound((a, b) => a < b);
