class Marker {
  // Color methods
  static red(text: string): string {
    return `\x1b[31m${text}\x1b[0m`; // Red color
  }

  static redBright(text: string): string {
    return `\x1b[91m${text}\x1b[0m`; // Bright red color
  }

  static green(text: string): string {
    return `\x1b[32m${text}\x1b[0m`; // Green color
  }

  static greenBright(text: string): string {
    return `\x1b[92m${text}\x1b[0m`; // Bright green color
  }

  static blue(text: string): string {
    return `\x1b[34m${text}\x1b[0m`; // Blue color
  }

  static blueBright(text: string): string {
    return `\x1b[94m${text}\x1b[0m`; // Bright blue color
  }

  static yellow(text: string): string {
    return `\x1b[33m${text}\x1b[0m`; // Yellow color
  }

  static magenta(text: string): string {
    return `\x1b[35m${text}\x1b[0m`; // Magenta color
  }

  static cyan(text: string): string {
    return `\x1b[36m${text}\x1b[0m`; // Cyan color
  }

  static bgGreen(text: string): string {
    return `\x1b[42m${text}\x1b[0m`; // Text with green background
  }
  static bgBlue(text: string): string {
    return `\x1b[44m${text}\x1b[0m`; // Text with blue background
}

  // Text style methods
  static bold(text: string): string {
    return `\x1b[1m${text}\x1b[0m`; // Bold text
  }

  static underline(text: string): string {
    return `\x1b[4m${text}\x1b[0m`; // Underlined text
  }
  static bgGreenBoldBlueBright(text: string): string {
    // Combining bgGreen, bold, and blueBright styles
    return `\x1b[42m\x1b[1m\x1b[94m${text}\x1b[0m\x1b[0m\x1b[0m`;
  }
  static boldGreenBright(text: string): string {
    // Combining bold and greenBright styles
    return `\x1b[1m\x1b[92m${text}\x1b[0m\x1b[0m`;
  }
}
export default Marker;
