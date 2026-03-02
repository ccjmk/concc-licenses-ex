import { A_CODE, LETTERS } from "./constants";

export function toLetterBase(letterIndex: number, minLength: number) {
    let result = '';
    let index = Math.floor(letterIndex);
    const length = Math.floor(minLength);
    if (index < 0 || length < 1) return '';

    while (index > 0) {
        const remainder = index % LETTERS;
        index = Math.floor(index / LETTERS);

        const nextChar = String.fromCharCode(A_CODE + remainder);
        result = nextChar + result;
    }

    return result.padStart(length, "A");
}