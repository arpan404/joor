// Options for controlling color detection and settings
export type Options = {
  /**
   * Automatically detect color support via command-line flags (e.g., '--color' or '--no-color').
   * @default true
   */
  readonly sniffFlags?: boolean;

  /**
   * Indicates if the output stream is a TTY (interactive terminal).
   */
  streamIsTTY?: boolean;

  /**
   * Color support level for Chalk.
   * Levels:
   * - 0: No colors
   * - 1: Basic 16 colors
   * - 2: 256 colors
   * - 3: Truecolor (16 million colors)
   */
  readonly level?: ColorSupportLevel;
};

// Levels for terminal color support
export type ColorSupportLevel = 0 | 1 | 2 | 3;

// Terminal color capabilities (e.g., 256 colors, truecolor)
export type ColorSupport = {
  level: ColorSupportLevel;
  hasBasic: boolean;
  has256: boolean;
  has16m: boolean;
};

// Represents color support info or false if unsupported
export type ColorInfo = ColorSupport | false;

// ANSI control sequences for text color formatting
export interface CSPair {
  open: string;
  close: string;
}

// Base interface for color functionality (e.g., applying color codes)
export interface ColorBase {
  close: string;
  ansi(code: number): string;
  ansi256(code: number): string;
  ansi16m(red: number, green: number, blue: number): string;
}

// Terminal text style modifiers (e.g., bold, underline)
export interface Modifier {
  readonly reset: CSPair;
  readonly bold: CSPair;
  readonly dim: CSPair;
  readonly italic: CSPair;
  readonly underline: CSPair;
  readonly overline: CSPair;
  readonly inverse: CSPair;
  readonly hidden: CSPair;
  readonly strikethrough: CSPair;
}

// Foreground colors for terminal text (e.g., red, green)
export interface ForegroundColor {
  readonly black: CSPair;
  readonly red: CSPair;
  readonly green: CSPair;
  readonly yellow: CSPair;
  readonly blue: CSPair;
  readonly cyan: CSPair;
  readonly magenta: CSPair;
  readonly white: CSPair;
  readonly gray: CSPair;
  readonly grey: CSPair;
  readonly blackBright: CSPair;
  readonly redBright: CSPair;
  readonly greenBright: CSPair;
  readonly yellowBright: CSPair;
  readonly blueBright: CSPair;
  readonly cyanBright: CSPair;
  readonly magentaBright: CSPair;
  readonly whiteBright: CSPair;
}

// Background colors for terminal text (e.g., bgRed, bgBlue)
export interface BackgroundColor {
  readonly bgBlack: CSPair;
  readonly bgRed: CSPair;
  readonly bgGreen: CSPair;
  readonly bgYellow: CSPair;
  readonly bgBlue: CSPair;
  readonly bgCyan: CSPair;
  readonly bgMagenta: CSPair;
  readonly bgWhite: CSPair;
  readonly bgGray: CSPair;
  readonly bgGrey: CSPair;
  readonly bgBlackBright: CSPair;
  readonly bgRedBright: CSPair;
  readonly bgGreenBright: CSPair;
  readonly bgYellowBright: CSPair;
  readonly bgBlueBright: CSPair;
  readonly bgCyanBright: CSPair;
  readonly bgMagentaBright: CSPair;
  readonly bgWhiteBright: CSPair;
}

// Color conversion utilities (e.g., RGB to ANSI)
export interface ConvertColor {
  rgbToAnsi256(red: number, green: number, blue: number): number;
  hexToRgb(hex: string): [red: number, green: number, blue: number];
  hexToAnsi256(hex: string): number;
  ansi256ToAnsi(code: number): number;
  rgbToAnsi(red: number, green: number, blue: number): number;
  hexToAnsi(hex: string): number;
}

// Type aliases for color and style names
export type ModifierName = keyof Modifier;
export type ForegroundColorName = keyof ForegroundColor;
export type BackgroundColorName = keyof BackgroundColor;
export type ColorName = ForegroundColorName | BackgroundColorName;

// Comprehensive interface for all color and style functionality
export type AnsiStyles = {
  readonly modifier: Modifier;
  readonly color: ColorBase & ForegroundColor;
  readonly bgColor: ColorBase & BackgroundColor;
  readonly codes: ReadonlyMap<number, number>;
} & ForegroundColor &
  BackgroundColor &
  Modifier &
  ConvertColor;

// Marker instance with methods to apply colors and styles
export interface MarkerInstance {
  (...text: unknown[]): string;
  level: ColorSupportLevel;
  rgb(red: number, green: number, blue: number): MarkerInstance;
  hex(color: string): MarkerInstance;
  ansi256(index: number): MarkerInstance;
  bgRgb(red: number, green: number, blue: number): MarkerInstance;
  bgHex(color: string): MarkerInstance;
  bgAnsi256(index: number): MarkerInstance;

  // Modifier methods (e.g., bold, underline)
  reset: MarkerInstance;
  bold: MarkerInstance;
  dim: MarkerInstance;
  italic: MarkerInstance;
  underline: MarkerInstance;
  overline: MarkerInstance;
  inverse: MarkerInstance;
  hidden: MarkerInstance;
  strikethrough: MarkerInstance;
  visible: MarkerInstance;

  // Foreground color methods (e.g., red, blue)
  black: MarkerInstance;
  red: MarkerInstance;
  green: MarkerInstance;
  yellow: MarkerInstance;
  blue: MarkerInstance;
  magenta: MarkerInstance;
  cyan: MarkerInstance;
  white: MarkerInstance;
  gray: MarkerInstance;
  grey: MarkerInstance;
  blackBright: MarkerInstance;
  redBright: MarkerInstance;
  greenBright: MarkerInstance;
  yellowBright: MarkerInstance;
  blueBright: MarkerInstance;
  magentaBright: MarkerInstance;
  cyanBright: MarkerInstance;
  whiteBright: MarkerInstance;

  // Background color methods (e.g., bgRed, bgBlue)
  bgBlack: MarkerInstance;
  bgRed: MarkerInstance;
  bgGreen: MarkerInstance;
  bgYellow: MarkerInstance;
  bgBlue: MarkerInstance;
  bgMagenta: MarkerInstance;
  bgCyan: MarkerInstance;
  bgWhite: MarkerInstance;
  bgGray: MarkerInstance;
  bgGrey: MarkerInstance;
  bgBlackBright: MarkerInstance;
  bgRedBright: MarkerInstance;
  bgGreenBright: MarkerInstance;
  bgYellowBright: MarkerInstance;
  bgBlueBright: MarkerInstance;
  bgMagentaBright: MarkerInstance;
  bgCyanBright: MarkerInstance;
  bgWhiteBright: MarkerInstance;
}
