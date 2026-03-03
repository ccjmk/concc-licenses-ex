import { describe, test, expect } from "vitest";
import { toLetterBase } from "./to-letter-base";

describe('Letter matching', () => {
    test('returns 1st letter', () => {
        expect(toLetterBase(0, 1)).toBe("A")
    })

    test('returns 7th letter', () => {
        expect(toLetterBase(7, 1)).toBe("H")
    })

    test('returns 8th letter', () => {
        expect(toLetterBase(8, 1)).toBe("I")
    })

    test('returns index 1 of two letters', () => {
        expect(toLetterBase(1, 2)).toBe("AB")
    })

    test('returns index 26 of two letters (first one over one-letter limit)', () => {
        expect(toLetterBase(26, 2)).toBe("BA")
    })

    test('returns index 1 of 6-letter', () => {
        expect(toLetterBase(1, 6)).toBe("AAAAAB")
    })

    test('returns three C', () => {
        expect(toLetterBase(1406, 6)).toBe("AAACCC")
    })

    // edge cases for toLetterBase
    test('zero returns all A', () => {
        expect(toLetterBase(0, 3)).toBe("AAA")
    })

    test('negative index returns empty', () => {
        expect(toLetterBase(-5, 3)).toBe("")
    })

    test('zero/negative qLetters returns empty', () => {
        expect(toLetterBase(0, 0)).toBe("");
        expect(toLetterBase(0, -1)).toBe("");
    })

    test('zero qLetter with index returns value', () => {
        expect(toLetterBase(2, 0)).toBe("");
    })
});