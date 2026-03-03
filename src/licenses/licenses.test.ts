import { describe, expect, test } from 'vitest'
import { LETTERS, CHARS_PER_LICENSE } from './constants'
import { getLicensePlateByIndex } from './get-license-plate-by-index'

describe('License plate', () => {
    test('returns first license', () => {
        expect(getLicensePlateByIndex(0)).toBe("000000")
    })

    test('returns second license', () => {
        expect(getLicensePlateByIndex(1)).toBe("000001")
    })

    test('returns numeric license', () => {
        expect(getLicensePlateByIndex(123456)).toBe("123456")
    })

    test('returns license at 999999 (last numberic)', () => {
        expect(getLicensePlateByIndex(999_999)).toBe("999999")
    })

    test('returns first license with 1 letter', () => {
        expect(getLicensePlateByIndex(1_000_000)).toBe("00000A")
    })

    test('returns second license with 1 letter', () => {
        expect(getLicensePlateByIndex(1_000_001)).toBe("00001A")
    })

    test('returns license 99999A', () => {
        expect(getLicensePlateByIndex(1_000_000 + 99_999)).toBe("99999A")
    })

    test('returns first license with 1 letter B', () => {
        expect(getLicensePlateByIndex(1_100_000)).toBe("00000B")
    })

    test('returns first license with 2 letters', () => {
        expect(getLicensePlateByIndex(1_000_000 + LETTERS * 100_000)).toBe("0000AA")
    })

    test('returns license 9999AA', () => {
        expect(getLicensePlateByIndex(1_000_000 + LETTERS * 100_000 + 9_999)).toBe("9999AA")
    })

    test('returns first license with third letter position', () => {
        expect(getLicensePlateByIndex(1_000_000 + LETTERS * 100_000 + 10_000)).toBe("0000AB")
    })

    test('returns license with all letters', () => {
        // i just binary-searched this number by hand for the fun of it
        expect(getLicensePlateByIndex(192_941_625)).toBe("ABCDEF")
    })

    test('returns N/A for range negative', () => {
        expect(getLicensePlateByIndex(-1)).toBe("N/A")
    })

    test('returns last valid license', () => {
        expect(getLicensePlateByIndex(501_363_136 - 1)).toBe("ZZZZZZ")
    })

    test('returns N/A for range over max', () => {
        expect(getLicensePlateByIndex(501_363_136)).toBe("N/A")
    })

    test('handles floating point by flooring', () => {
        expect(getLicensePlateByIndex(1.9)).toBe("000001")
    })

    test('all licences have 6 characters', () => {
        // picking a collection of previous cases
        expect(getLicensePlateByIndex(0)).toHaveLength(CHARS_PER_LICENSE);
        expect(getLicensePlateByIndex(123456)).toHaveLength(CHARS_PER_LICENSE);
        expect(getLicensePlateByIndex(1_000_000 + LETTERS * 100_000 + 9_999)).toHaveLength(CHARS_PER_LICENSE);
        expect(getLicensePlateByIndex(501_363_136 - 1)).toHaveLength(CHARS_PER_LICENSE);
    })
})
