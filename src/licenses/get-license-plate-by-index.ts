import { CHARS_PER_LICENSE, LETTERS } from "./constants";
import { toLetterBase } from "./to-letter-base";

function getLicense(index: number, blockStartIndex: number, numberOfDigits: number) {
    const totalLetters = CHARS_PER_LICENSE - numberOfDigits;
    const licensesPerLetterGroup = 10 ** numberOfDigits;
    const offset = index - blockStartIndex;

    const remainder = offset % licensesPerLetterGroup;
    const letterIndex = Math.floor(offset / licensesPerLetterGroup);

    const letterPart = toLetterBase(letterIndex, totalLetters)
    const numericPart = numberOfDigits ? remainder.toString().padStart(numberOfDigits, "0") : '';

    return numericPart + letterPart;
}

export function getLicensePlateByIndex(licenseIndex: number): string {
    const index = Math.floor(licenseIndex);

    if (index < 0) {
        return "N/A";
    }

    let blockStartIndex = 0;
    for (let i = 0; i <= CHARS_PER_LICENSE; i++) {
        const digitCount = CHARS_PER_LICENSE - i;
        const blockSize = 10 ** digitCount * LETTERS ** i;
        const blockEndIndex = blockStartIndex + blockSize;

        if (index < blockEndIndex) {
            return getLicense(index, blockStartIndex, (CHARS_PER_LICENSE - i));
        }

        blockStartIndex = blockEndIndex;
    }
    return "N/A";
}