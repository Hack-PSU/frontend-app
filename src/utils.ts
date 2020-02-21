// File for everything that's useful but too small for its own file / scope.

/**
 * Comparator to use for Array#sort.
 */
export function compare(a: number, b: number): -1 | 0 | 1 {
  if (a < b) {
    return -1;
  }

  if (a > b) {
    return 1;
  }

  // a must be equal to b
  return 0;
}