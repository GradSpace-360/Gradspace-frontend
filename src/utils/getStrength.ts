/**
 * Calculates the strength of a given password based on certain criteria.
 *
 * @param pass - The password string to evaluate.
 * @returns The strength of the password as a number. The strength is calculated based on the following criteria:
 * - Length of at least 6 characters: +1 strength
 * - Contains both lowercase and uppercase letters: +1 strength
 * - Contains at least one digit: +1 strength
 * - Contains at least one special character (non-alphanumeric): +1 strength
 */
export const getStrength = (pass: string): number => {
    let strength = 0
    if (pass.length >= 6) strength++
    if (pass.match(/[a-z]/) && pass.match(/[A-Z]/)) strength++
    if (pass.match(/\d/)) strength++
    if (pass.match(/[^a-zA-Z\d]/)) strength++
    return strength
}
