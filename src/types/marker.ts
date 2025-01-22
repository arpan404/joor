export type Options = {
  /**
   * Controls whether to automatically detect color support through command-line flags.
   * When true, checks process.argv for '--color' and '--no-color' flags.
   *
   * @default true
   */
  readonly sniffFlags?: boolean;

  /**
   * Indicates whether the output stream is a TTY (interactive terminal).
   * Used to determine color support capability.
   */
  streamIsTTY?: boolean;

  /**
   * Specify the color support for Chalk.
   * By default, color support is automatically detected based on the environment.
   *
   * Levels:
   * - 0 - All colors disabled
   * - 1 - Basic 16 colors support
   * - 2 - ANSI 256 colors support
   * - 3 - Truecolor 16 million colors support
   */
  readonly level?: ColorSupportLevel;
};

/**
 * Represents different levels of color support in terminals
 */
export type ColorSupportLevel = 0 | 1 | 2 | 3;

/**
 * Describes the color capabilities of a terminal environment
 */
export type ColorSupport = {
  level: ColorSupportLevel;
  hasBasic: boolean;
  has256: boolean;
  has16m: boolean;
};

/**
 * Represents either color support information or false if colors are not supported
 */
export type ColorInfo = ColorSupport | false;

/**
 * Represents a pair of ANSI terminal control sequences
 */
export interface CSPair {
  open: string;
  close: string;
}

/**
 * Base interface for color-related functionality
 */
export interface ColorBase {
  close: string;
  ansi(code: number): string;
  ansi256(code: number): string;
  ansi16m(red: number, green: number, blue: number): string;
}

/**
 * Text style modifiers available in the terminal
 */
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

/**
 * Available foreground colors in the terminal
 */
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

/**
 * Available background colors in the terminal
 */
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

/**
 * Color space conversion utilities
 */
export interface ConvertColor {
  rgbToAnsi256(red: number, green: number, blue: number): number;
  hexToRgb(hex: string): [red: number, green: number, blue: number];
  hexToAnsi256(hex: string): number;
  ansi256ToAnsi(code: number): number;
  rgbToAnsi(red: number, green: number, blue: number): number;
  hexToAnsi(hex: string): number;
}

export type ModifierName = keyof Modifier;
export type ForegroundColorName = keyof ForegroundColor;
export type BackgroundColorName = keyof BackgroundColor;
export type ColorName = ForegroundColorName | BackgroundColorName;

/**
 * Comprehensive interface representing all color and style options
 */
export type AnsiStyles = {
  readonly modifier: Modifier;
  readonly color: ColorBase & ForegroundColor;
  readonly bgColor: ColorBase & BackgroundColor;
  readonly codes: ReadonlyMap<number, number>;
} & ForegroundColor &
  BackgroundColor &
  Modifier &
  ConvertColor;

/**
 * Chalk instance interface with all available methods and properties
 */
export interface ChalkInstance {
  (...text: unknown[]): string;
  level: ColorSupportLevel;
  rgb(red: number, green: number, blue: number): ChalkInstance;
  hex(color: string): ChalkInstance;
  ansi256(index: number): ChalkInstance;
  bgRgb(red: number, green: number, blue: number): ChalkInstance;
  bgHex(color: string): ChalkInstance;
  bgAnsi256(index: number): ChalkInstance;

  // Modifiers
  reset: ChalkInstance;
  bold: ChalkInstance;
  dim: ChalkInstance;
  italic: ChalkInstance;
  underline: ChalkInstance;
  overline: ChalkInstance;
  inverse: ChalkInstance;
  hidden: ChalkInstance;
  strikethrough: ChalkInstance;
  visible: ChalkInstance;

  // Foreground colors
  black: ChalkInstance;
  red: ChalkInstance;
  green: ChalkInstance;
  yellow: ChalkInstance;
  blue: ChalkInstance;
  magenta: ChalkInstance;
  cyan: ChalkInstance;
  white: ChalkInstance;
  gray: ChalkInstance;
  grey: ChalkInstance;
  blackBright: ChalkInstance;
  redBright: ChalkInstance;
  greenBright: ChalkInstance;
  yellowBright: ChalkInstance;
  blueBright: ChalkInstance;
  magentaBright: ChalkInstance;
  cyanBright: ChalkInstance;
  whiteBright: ChalkInstance;

  // Background colors
  bgBlack: ChalkInstance;
  bgRed: ChalkInstance;
  bgGreen: ChalkInstance;
  bgYellow: ChalkInstance;
  bgBlue: ChalkInstance;
  bgMagenta: ChalkInstance;
  bgCyan: ChalkInstance;
  bgWhite: ChalkInstance;
  bgGray: ChalkInstance;
  bgGrey: ChalkInstance;
  bgBlackBright: ChalkInstance;
  bgRedBright: ChalkInstance;
  bgGreenBright: ChalkInstance;
  bgYellowBright: ChalkInstance;
  bgBlueBright: ChalkInstance;
  bgMagentaBright: ChalkInstance;
  bgCyanBright: ChalkInstance;
  bgWhiteBright: ChalkInstance;
}
