class Marker {
    // Color methods
    static red(text) {
        return `\x1b[31m${text}\x1b[0m`; // Red color
    }
    static redBright(text) {
        return `\x1b[91m${text}\x1b[0m`; // Bright red color
    }
    static green(text) {
        return `\x1b[32m${text}\x1b[0m`; // Green color
    }
    static greenBright(text) {
        return `\x1b[92m${text}\x1b[0m`; // Bright green color
    }
    static blue(text) {
        return `\x1b[34m${text}\x1b[0m`; // Blue color
    }
    static blueBright(text) {
        return `\x1b[94m${text}\x1b[0m`; // Bright blue color
    }
    static yellow(text) {
        return `\x1b[33m${text}\x1b[0m`; // Yellow color
    }
    static magenta(text) {
        return `\x1b[35m${text}\x1b[0m`; // Magenta color
    }
    static cyan(text) {
        return `\x1b[36m${text}\x1b[0m`; // Cyan color
    }
    static bgGreen(text) {
        return `\x1b[42m${text}\x1b[0m`; // Text with green background
    }
    static bgBlue(text) {
        return `\x1b[44m${text}\x1b[0m`; // Text with blue background
    }
    // Text style methods
    static bold(text) {
        return `\x1b[1m${text}\x1b[0m`; // Bold text
    }
    static underline(text) {
        return `\x1b[4m${text}\x1b[0m`; // Underlined text
    }
    static bgGreenBoldBlueBright(text) {
        // Combining bgGreen, bold, and blueBright styles
        return `\x1b[42m\x1b[1m\x1b[94m${text}\x1b[0m\x1b[0m\x1b[0m`;
    }
    static boldGreenBright(text) {
        // Combining bold and greenBright styles
        return `\x1b[1m\x1b[92m${text}\x1b[0m\x1b[0m`;
    }
}
export default Marker;
//# sourceMappingURL=marker.js.map