import { A_CODE, LETTERS } from "./constants";

export function toLetterBase(letterIndex: number, minLength: number) {
    let result = '';
    letterIndex = Math.floor(letterIndex);
    minLength = Math.floor(minLength);
    if (letterIndex < 0 || minLength < 1) return '';

    while (letterIndex > 0) {
        const remainder = letterIndex % LETTERS;
        letterIndex = Math.floor(letterIndex / LETTERS);

        const nextChar = String.fromCharCode(A_CODE + remainder);
        result = nextChar + result;
    }

    return result.padStart(minLength, "A");
}