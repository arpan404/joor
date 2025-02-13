/**
 * Utility for generating One-Time Passwords (OTPs).
 */
function generate(length: number, charSet: string): string {
  return Array.from({ length }, () => charSet.charAt(Math.floor(Math.random() * charSet.length))).join('');
}

export const otp = {
  /**
   * Generates an alphanumeric OTP consisting of uppercase letters, lowercase letters, and numbers.
   * @param length - The length of the OTP.
   * @returns A string representing the generated OTP.
   * @example
   * const otpCode = otp.alphanumeric.generate(6);
   * console.log(otpCode); // Example output: "A1bC3d"
   */
  alphanumeric: {
      generate: (length: number) => generate(length, '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz')
  },

  /**
   * Generates a numeric OTP consisting only of digits (0-9).
   * @param length - The length of the OTP.
   * @returns A string representing the generated OTP.
   * @example
   * const otpCode = otp.numeric.generate(6);
   * console.log(otpCode); // Example output: "123456"
   */
  numeric: {
      generate: (length: number) => generate(length, '0123456789')
  },

  /**
   * Generates an alphabetic OTP consisting of uppercase and lowercase letters.
   * @param length - The length of the OTP.
   * @returns A string representing the generated OTP.
   * @example
   * const otpCode = otp.alphabetic.generate(6);
   * console.log(otpCode); // Example output: "AbCdEf"
   */
  alphabetic: {
      generate: (length: number) => generate(length, 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz')
  },

  /**
   * Generates a custom OTP using a provided set of characters.
   * @param length - The length of the OTP.
   * @param charSet - A string containing the characters to use in the OTP.
   * @returns A string representing the generated OTP.
   * @example
   * const otpCode = otp.custom.generate(6, '0123456789!@#$%^&*');
   * console.log(otpCode); // Example output: "4!5@6#"
   */
  custom: {
      generate: (length: number, charSet: string) => generate(length, charSet)
  }
};
