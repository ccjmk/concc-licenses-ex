import { CHARS_PER_LICENSE, LETTERS } from "./constants";
import { toLetterBase } from "./to-letter-base";

function getLicense(index: number, first: number, qDigits: number) {
    const qLetters = CHARS_PER_LICENSE - qDigits;
    const qLicensesPerLetter = 10 ** qDigits;
    const offset = index - first;

    const r = offset % qLicensesPerLetter;
    const l = (offset - r) / qLicensesPerLetter;
    const letterPart = toLetterBase(l, qLetters)
    const numericPart = qDigits ? r.toString().padStart(qDigits, "0") : '';

    return numericPart + letterPart;
}

export function getLicensePlateByIndex(num: number): string {
    num = Math.floor(num);

    if (num < 0) {
        return "N/A";
    }

    let lastMax = 0;
    for (let i = 0; i <= CHARS_PER_LICENSE; i++) {
        const newMax = lastMax + 10 ** (CHARS_PER_LICENSE - i) * LETTERS ** i;
        if (num < newMax) {
            return getLicense(num, lastMax, (CHARS_PER_LICENSE - i));
        }
        lastMax = newMax;
    }
    return "N/A";
}