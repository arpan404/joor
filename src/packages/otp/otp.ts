import logger from '@/helpers/joorLogger';

/**
 * Utility function to generate an OTP of a given length and character set.
 * @param length - The desired length of the OTP.
 * @param charSet - A string containing characters to be used in the OTP.
 * @returns A randomly generated OTP as a string.
 */
function generate(length: number, charSet: string): string {
  return Array.from({ length }, () =>
    charSet.charAt(Math.floor(Math.random() * charSet.length))
  ).join('');
}

/**
 * Validates the length of the OTP.
 * Ensures it is an integer between 4 and 30. Defaults to 8 if invalid.
 * @param length - The requested length of the OTP.
 * @returns The validated length.
 */
function validateLength(length: number): number {
  if (!Number.isInteger(length) || length < 4 || length > 30) {
    logger.warn(`Invalid OTP length: ${length}. Using default length: 8.`);
    return 8; // Default length
  }

  return length;
}

export const otp = {
  /**
   * Generates an alphanumeric OTP consisting of uppercase letters, lowercase letters, and numbers.
   * @param length - The length of the OTP.
   * @returns A string representing the generated OTP.
   */
  alphanumeric: {
    generate: (length: number) =>
      generate(
        validateLength(length),
        '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
      ),
  },

  /**
   * Generates a numeric OTP consisting only of digits (0-9).
   * @param length - The length of the OTP.
   * @returns A string representing the generated OTP.
   */
  numeric: {
    generate: (length: number) =>
      generate(validateLength(length), '0123456789'),
  },

  /**
   * Generates an alphabetic OTP consisting of uppercase and lowercase letters.
   * @param length - The length of the OTP.
   * @returns A string representing the generated OTP.
   */
  alphabetic: {
    generate: (length: number) =>
      generate(
        validateLength(length),
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
      ),
  },

  /**
   * Generates a custom OTP using a provided set of characters.
   * @param length - The length of the OTP.
   * @param charSet - A string containing the characters to use in the OTP.
   * @returns A string representing the generated OTP.
   */
  custom: {
    generate: (length: number, charSet: string) => {
      // Validate length
      const validatedLength = validateLength(length);

      // Validate charSet (must be a string of at least 10 characters)
      const validCharSet =
        typeof charSet === 'string' && charSet.length >= 10
          ? charSet
          : '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

      if (validCharSet !== charSet) {
        logger.warn(
          `Invalid character set: "${charSet}". Using default character set.`
        );
      }

      return generate(validatedLength, validCharSet);
    },
  },
};
