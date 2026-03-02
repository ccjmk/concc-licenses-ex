import { describe, expect, test } from 'vitest'

const A = "A".charCodeAt(0);
const CHARS = 6;
const LETTERS = 26;

function toLetterBase(num: number, qLetters: number) {
    let letters = '';

    while (num > 0) {
        let r = num % LETTERS;
        let c = (num - r) / LETTERS;
        letters = String.fromCharCode(A + r) + letters;
        num = c;
    }

    return letters.padStart(qLetters, "A");
}

function getLicense(index: number, first: number, qDigits: number) {
    const qLetters = CHARS - qDigits;
    const qLicensesPerLetter = 10 ** qDigits;
    const offset = index - first;

    const r = offset % qLicensesPerLetter;
    const l = (offset - r) / qLicensesPerLetter;
    const letterPart = toLetterBase(l, qLetters)
    const numericPart = r.toString().padStart(qDigits, "0");

    return numericPart + letterPart;
}

export function getLicensePlateByIndex(num: number): string {
    num = Math.floor(num);

    if (num < 0) {
        return "N/A";
    }

    let lastMax = 0;
    for (let i = 0; i <= CHARS; i++) {
        const newMax = lastMax + 10 ** (CHARS - i) * LETTERS ** i;
        if (num < newMax) {
            return getLicense(num, lastMax, (CHARS - i));
        }
        lastMax = newMax;
    }
    return "N/A";
}

// TEST
describe('License plate', () => {
    test('returns first license', () => {
        expect(getLicensePlateByIndex(0)).toBe("000000")
    })

    test('returns second license', () => {
        expect(getLicensePlateByIndex(1)).toBe("000001")
    })

    test('returns license at 999999 (last pure number)', () => {
        expect(getLicensePlateByIndex(999_999)).toBe("999999")
    })

    test('returns first license with 1 letter', () => {
        expect(getLicensePlateByIndex(1_000_000)).toBe("00000A")
    })

    test('returns second license with 1 letter', () => {
        expect(getLicensePlateByIndex(1_000_001)).toBe("00001A")
    })

    test('returns license 99999A', () => {
        expect(getLicensePlateByIndex(1_099_999)).toBe("99999A")
    })

    test('returns first license with 1 letter B', () => {
        expect(getLicensePlateByIndex(1_100_000)).toBe("00000B")
    })

    test('returns first license with 2 letters', () => {
        expect(getLicensePlateByIndex(1_000_000 + 26 * 100_000)).toBe("0000AA")
    })

    test('returns license 9999AA', () => {
        expect(getLicensePlateByIndex(1_000_000 + 26 * 100_000 + 9_999)).toBe("9999AA")
    })

    test('returns first license with third letter position', () => {
        expect(getLicensePlateByIndex(1_000_000 + 26 * 100_000 + 10_000)).toBe("0000AB")
    })

    test('returns out of range negative', () => {
        expect(getLicensePlateByIndex(-1)).toBe("N/A")
    })

    test('returns out of range over max', () => {
        expect(getLicensePlateByIndex(501_363_136 + 1)).toBe("N/A")
    })

    test('returns last valid license', () => {
        expect(getLicensePlateByIndex(501_363_136 - 1)).not.toBe("N/A")
    })

    test('handles floating point by flooring', () => {
        expect(getLicensePlateByIndex(1.9)).toBe("000001")
    })

    test('returns 100k boundary (00000B starts)', () => {
        expect(getLicensePlateByIndex(1_100_000)).toBe("00000B")
    })

    test('returns position in middle range', () => {
        expect(getLicensePlateByIndex(500_000)).toBe("500000")
    })
})

describe('Letter matching', () => {
    test('returns 7th letter', () => {
        expect(toLetterBase(7, 1)).toBe("H")
    })

    test('returns 8th letter', () => {
        expect(toLetterBase(8, 1)).toBe("I")
    })

    test('returns 26th letters', () => {
        expect(toLetterBase(1, 2)).toBe("AB")
    })

    test('returns 27th letter', () => {
        expect(toLetterBase(26, 2)).toBe("BA")
    })

    test('returns 27th letter', () => {
        expect(toLetterBase(27, 2)).toBe("BB")
    })

    test('returns 2th 6-letter', () => {
        expect(toLetterBase(1, 6)).toBe("AAAAAB")
    })

    test('returns 2th 6-letter', () => {
        expect(toLetterBase(1406, 6)).toBe("AAACCC")
    })
});