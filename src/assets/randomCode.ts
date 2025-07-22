const usedCodes = new Set<string>();

export function generateUniqueCode(): string {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const getRandomLetter = () => letters[Math.floor(Math.random() * letters.length)];
    const getRandomDigit = () => Math.floor(Math.random() * 10).toString();

    let code: string;

    do {
        const randomLetters = getRandomLetter() + getRandomLetter();
        const randomNumbers = Array.from({ length: 4 }, getRandomDigit).join('');
        code = randomLetters + randomNumbers;
    } while (usedCodes.has(code));

    usedCodes.add(code);
    return code;
}
