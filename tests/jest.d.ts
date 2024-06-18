declare namespace jest {
  interface Matchers<R> {
    toBeApproxEqual(expected: number|CharacterStats, tolerancePercent: number = 1): R;
  }
}