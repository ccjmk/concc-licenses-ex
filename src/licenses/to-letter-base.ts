import { A_CODE, LETTERS } from "./constants";

export function toLetterBase(num: number, qLetters: number) {
    let letters = '';
    if (num < 0 || qLetters < 1) return '';

    while (num > 0) {
        let r = num % LETTERS;
        let c = (num - r) / LETTERS;
        letters = String.fromCharCode(A_CODE + r) + letters;
        num = c;
    }

    return letters.padStart(qLetters, "A");
}