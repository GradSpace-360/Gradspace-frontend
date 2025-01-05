// utils/onboard/index.ts

/**
 * URL Validation Utility
 *
 * Provides a function to validate URLs, ensuring they match a standard format
 * and do not exceed the maximum allowed length.
 *
 * @param {string} url - The URL string to validate.
 * @returns {string | null} - Returns an error message if invalid, otherwise null.
 */

export const validateUrl = (url: string): string | null => {
    const URL_REGEX = /^(https?:\/\/)?[\w.-]+\.[a-z]{2,}(\/\S*)?$/i
    const MAX_URL_LENGTH = 2048

    if (url.length > MAX_URL_LENGTH) {
        return `URL is too long (max ${MAX_URL_LENGTH} characters)`
    }
    if (url && !URL_REGEX.test(url)) {
        return "Please enter a valid URL"
    }
    return null // Return null if the URL is valid
}
