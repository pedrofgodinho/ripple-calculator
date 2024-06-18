import { CharacterStats } from "../src";

expect.extend({
    toBeApproxEqual(received: number|CharacterStats, expected: number|CharacterStats, tolerancePercent: number = 1, toleranceAtZero: number = 0.001) { // Default tolerance of 1%
        if (received instanceof CharacterStats && expected instanceof CharacterStats) {
            return approxSameStats(received, expected, tolerancePercent, toleranceAtZero);
        } else if (typeof received === 'number' && typeof expected === 'number') {
            if (approxSameNumber(received, expected, tolerancePercent, toleranceAtZero)) {
                return {
                    message: () => `expected ${received} not to be approximately equal to ${expected} (within ${tolerancePercent}%)`,
                    pass: true,
                };
            } else {
                return {
                    message: () => `expected ${received} to be approximately equal to ${expected} (within ${tolerancePercent}%)`,
                    pass: false,
                };
            }
        } else {
            return {
                message: () => `expected ${received} and ${expected} to be either both numbers or both CharacterStats`,
                pass: false,
            };
        }
    }
});


function approxSameNumber(left: number, right: number, tolerancePercent: number = 1, toleranceAtZero: number = 0.001): boolean {
    if (right === 0) {
        return Math.abs(left - right) <= toleranceAtZero;
    } else {
        return Math.abs((left - right) / right) * 100 <= tolerancePercent; 
    }
}

function approxSameStats(left: CharacterStats, right: CharacterStats, tolerancePercent: number = 1, toleranceAtZero: number = 0.001): {message: () => string, pass: boolean} {
    for (const key in left) {
        let k = key as keyof CharacterStats;
        let leftVal = left[k];
        let rightVal = right[k];
        if (leftVal instanceof Array && rightVal instanceof Array) {
            for (let i = 0; i < leftVal.length; i++) {
                if (!approxSameNumber(leftVal[i], rightVal[i], tolerancePercent, toleranceAtZero)) {
                    return {message: () => `expected ${leftVal[i]} to be approximately equal to ${rightVal[i]} (within ${tolerancePercent}%) (key ${key}, index ${i})`, pass: false};
                }
            }
        } else {
            if (!approxSameNumber(leftVal as number, rightVal as number, tolerancePercent, toleranceAtZero)) {
                return {message: () => `expected ${leftVal} to be approximately equal to ${rightVal} (within ${tolerancePercent}%) (key ${key})`, pass: false};
            }
        }
    }
    return {message: () => `expected ${left} not to be approximately equal to ${right} (within ${tolerancePercent}%)`, pass: true};
}