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
};

/**
 * Represents different levels of color support in terminals:
 * - Level 0: No color support
 * - Level 1: Basic 16 colors
 * - Level 2: Extended ANSI 256 colors
 * - Level 3: Full Truecolor (16 million colors)
 */
export type ColorSupportLevel = 0 | 1 | 2 | 3;

/**
 * Describes the color capabilities of a terminal environment
 */
export type ColorSupport = {
  /**
   * The current color support level (0-3)
   */
  level: ColorSupportLevel;

  /**
   * Indicates support for basic 16 colors
   * Includes both foreground and background colors
   */
  hasBasic: boolean;

  /**
   * Indicates support for extended ANSI 256 colors
   * Provides a broader color palette than basic colors
   */
  has256: boolean;

  /**
   * Indicates support for 24-bit Truecolor (RGB)
   * Allows usage of 16 million distinct colors
   */
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
  /**
   * The ANSI terminal control sequence for starting a style
   */
  open: string;

  /**
   * The ANSI terminal control sequence for ending a style
   */
  close: string;
}

/**
 * Base interface for color-related functionality
 */
export interface ColorBase {
  /**
   * The ANSI terminal control sequence for ending this color
   */
  close: string;

  /**
   * Generates ANSI color code for basic 16 colors
   * @param code - ANSI color code (0-15)
   */
  ansi(code: number): string;

  /**
   * Generates ANSI color code for extended 256 colors
   * @param code - ANSI color code (0-255)
   */
  ansi256(code: number): string;

  /**
   * Generates ANSI color code for true color (RGB)
   * @param red - Red component (0-255)
   * @param green - Green component (0-255)
   * @param blue - Blue component (0-255)
   */
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

  /**
   * Alias for `blackBright`
   */
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

  /**
   * Alias for `bgBlackBright`
   */
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

/**
 * Names of available text style modifiers
 */
export type ModifierName = keyof Modifier;

/**
 * Names of available foreground colors
 */
export type ForegroundColorName = keyof ForegroundColor;

/**
 * Names of available background colors
 */
export type BackgroundColorName = keyof BackgroundColor;

/**
 * Combined type of all available color names
 */
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
