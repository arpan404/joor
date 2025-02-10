/**
 * Configuration options for OTP generation.
 */
interface OTPConfig {
  length: number;
  characters?: 'numeric' | 'alphabetic' | 'alphanumeric' | string;
}

/**
 * Generates an OTP based on the specified configuration.
 * @param config - The configuration options for OTP generation.
 * @returns A string representing the generated OTP.
 */
export function OTP({ length, characters = 'numeric' }: OTPConfig): string {
  let charSet: string;

  if (
    typeof characters === 'string' &&
    !['numeric', 'alphabetic', 'alphanumeric'].includes(characters)
  ) {
    charSet = characters; // Custom characters
  } else {
    switch (characters) {
      case 'alphabetic':
        charSet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
        break;
      case 'alphanumeric':
        charSet =
          '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
        break;
      case 'numeric':
      default:
        charSet = '0123456789';
        break;
    }
  }

  let otp = '';

  for (let i = 0; i < length; i++) {
    otp += charSet.charAt(Math.floor(Math.random() * charSet.length));
  }

  return otp;
}

/**
 * Generates an OTP based on the specified configuration.
 * @param length - The length of the OTP.
 * @param charSet - Optional custom character set for OTP generation.
 * @returns A string representing the generated OTP.
 */
function generate(length: number, charSet: string): string {
  let otp = '';

  for (let i = 0; i < length; i++) {
    otp += charSet.charAt(Math.floor(Math.random() * charSet.length));
  }

  return otp;
}

export const otp = {
  alphanumeric: {
    generate: (length: number) =>
      generate(
        length,
        '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
      ),
  },
  numeric: {
    generate: (length: number) => generate(length, '0123456789'),
  },
  alphabetic: {
    generate: (length: number) =>
      generate(length, 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'),
  },
  custom: {
    generate: (length: number, charSet: string) => generate(length, charSet),
  },
};
