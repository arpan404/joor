/**
* Generates an OTP based on the specified configuration.
* @param config - The configuration options for OTP generation.
* @returns A string representing the generated OTP.
*/
function generate(length: number, charSet: string): string {
  return Array.from({ length }, () => charSet.charAt(Math.floor(Math.random() * charSet.length))).join('');
}

export const otp = {
  alphanumeric: {
      generate: (length: number) => generate(length, '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz')
  },
  numeric: {
      generate: (length: number) => generate(length, '0123456789')
  },
  alphabetic: {
      generate: (length: number) => generate(length, 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz')
  },
  custom: {
      generate: (length: number, charSet: string) => generate(length, charSet)
  }
};
