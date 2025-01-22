import {
  AnsiStyles,
  BackgroundColorName,
  ColorName,
  ForegroundColorName,
  ModifierName,
} from '@/types/chalk';

// Offset used for background ANSI escape codes
const ANSI_BACKGROUND_OFFSET = 10;

/**
 * Creates a function to generate ANSI escape sequences for 16-color formatting
 * @param offset - Optional offset to adjust the code (default: 0)
 * @returns Function generating ANSI sequences
 */
const wrapAnsi16 = (offset = 0) => {
  return (code: number): string => `\u001B[${code + offset}m`;
};

/**
 * Creates a function to generate ANSI escape sequences for 256-color formatting
 * @param offset - Optional offset to adjust the code (default: 0)
 * @returns Function generating ANSI sequences
 */
const wrapAnsi256 = (offset = 0) => {
  return (code: number): string => `\u001B[${38 + offset};5;${code}m`;
};

/**
 * Creates a function to generate ANSI escape sequences for true color (RGB) formatting
 * @param offset - Optional offset to adjust the code (default: 0)
 * @returns Function generating ANSI sequences
 */
const wrapAnsi16m = (offset = 0) => {
  return (red: number, green: number, blue: number): string =>
    `\u001B[${38 + offset};2;${red};${green};${blue}m`;
};

/**
 * ANSI escape codes for modifiers, foreground colors, and background colors
 */
const styleCodes: {
  modifier: Record<ModifierName, [number, number]>;
  color: Record<ForegroundColorName, [number, number]>;
  bgColor: Record<BackgroundColorName, [number, number]>;
} = {
  // Text style modifiers (activate, deactivate)
  modifier: {
    reset: [0, 0],
    bold: [1, 22],
    dim: [2, 22],
    italic: [3, 23],
    underline: [4, 24],
    overline: [53, 55],
    inverse: [7, 27],
    hidden: [8, 28],
    strikethrough: [9, 29],
  },
  // Foreground colors
  color: {
    black: [30, 39],
    red: [31, 39],
    green: [32, 39],
    yellow: [33, 39],
    blue: [34, 39],
    magenta: [35, 39],
    cyan: [36, 39],
    white: [37, 39],
    blackBright: [90, 39],
    gray: [90, 39], // Alias
    grey: [90, 39], // Alias
    redBright: [91, 39],
    greenBright: [92, 39],
    yellowBright: [93, 39],
    blueBright: [94, 39],
    magentaBright: [95, 39],
    cyanBright: [96, 39],
    whiteBright: [97, 39],
  },
  // Background colors
  bgColor: {
    bgBlack: [40, 49],
    bgRed: [41, 49],
    bgGreen: [42, 49],
    bgYellow: [43, 49],
    bgBlue: [44, 49],
    bgMagenta: [45, 49],
    bgCyan: [46, 49],
    bgWhite: [47, 49],
    bgBlackBright: [100, 49],
    bgGray: [100, 49], // Alias
    bgGrey: [100, 49], // Alias
    bgRedBright: [101, 49],
    bgGreenBright: [102, 49],
    bgYellowBright: [103, 49],
    bgBlueBright: [104, 49],
    bgMagentaBright: [105, 49],
    bgCyanBright: [106, 49],
    bgWhiteBright: [107, 49],
  },
};

// Exports arrays of modifier, foreground, and background names
export const modifierNames: ModifierName[] = Object.keys(
  styleCodes.modifier
) as ModifierName[];
export const foregroundColorNames: ForegroundColorName[] = Object.keys(
  styleCodes.color
) as ForegroundColorName[];
export const backgroundColorNames: BackgroundColorName[] = Object.keys(
  styleCodes.bgColor
) as BackgroundColorName[];
export const colorNames: ColorName[] = [
  ...foregroundColorNames,
  ...backgroundColorNames,
];

/**
 * Assembles and returns ANSI styles with helper functions and mappings
 */
const assembleStyles = (): AnsiStyles => {
  const codes = new Map<number, number>();
  const styles: any = { ...styleCodes };

  // Wraps style codes for easy access
  for (const [groupName, group] of Object.entries(styleCodes)) {
    for (const [styleName, style] of Object.entries(group)) {
      styles[styleName] = {
        open: `\u001B[${style[0]}m`,
        close: `\u001B[${style[1]}m`,
      };
      styles[groupName][styleName] = styles[styleName];
      codes.set(style[0], style[1]);
    }
    Object.defineProperty(styles, groupName, {
      value: group,
      enumerable: false,
    });
  }

  // Defines common close sequences
  styles.color.close = '\u001B[39m';
  styles.bgColor.close = '\u001B[49m';

  // Adds wrapper functions for colors
  styles.color.ansi = wrapAnsi16();
  styles.color.ansi256 = wrapAnsi256();
  styles.color.ansi16m = wrapAnsi16m();
  styles.bgColor.ansi = wrapAnsi16(ANSI_BACKGROUND_OFFSET);
  styles.bgColor.ansi256 = wrapAnsi256(ANSI_BACKGROUND_OFFSET);
  styles.bgColor.ansi16m = wrapAnsi16m(ANSI_BACKGROUND_OFFSET);

  // Utility functions for color conversions
  Object.defineProperties(styles, {
    rgbToAnsi256: {
      value(red: number, green: number, blue: number) {
        if (red === green && green === blue) {
          if (red < 8) return 16;
          if (red > 248) return 231;
          return Math.round(((red - 8) / 247) * 24) + 232;
        }
        return (
          16 +
          36 * Math.round((red / 255) * 5) +
          6 * Math.round((green / 255) * 5) +
          Math.round((blue / 255) * 5)
        );
      },
      enumerable: false,
    },
    hexToRgb: {
      value(hex: number) {
        const matches = /[a-f\d]{6}|[a-f\d]{3}/i.exec(hex.toString(16));
        if (!matches) return [0, 0, 0];
        let [colorString] = matches;
        if (colorString.length === 3) {
          colorString = [...colorString]
            .map((character) => character + character)
            .join('');
        }
        const integer = Number.parseInt(colorString, 16);
        return [(integer >> 16) & 0xff, (integer >> 8) & 0xff, integer & 0xff];
      },
      enumerable: false,
    },
    hexToAnsi256: {
      value: (hex: number) => styles.rgbToAnsi256(...styles.hexToRgb(hex)),
      enumerable: false,
    },
    ansi256ToAnsi: {
      value(code: number) {
        if (code < 8) return 30 + code;
        if (code < 16) return 90 + (code - 8);
        return code >= 232
          ? Math.round(((code - 232) * 10 + 8) / 255) * 2
            ? 90
            : 30
          : 30;
      },
      enumerable: false,
    },
    rgbToAnsi: {
      value: (red: number, green: number, blue: number) =>
        styles.ansi256ToAnsi(styles.rgbToAnsi256(red, green, blue)),
      enumerable: false,
    },
    hexToAnsi: {
      value: (hex: number) => styles.ansi256ToAnsi(styles.hexToAnsi256(hex)),
      enumerable: false,
    },
  });
  return styles as AnsiStyles;
};

// Generate ANSI styles
const ansiStyles = assembleStyles();
export default ansiStyles;
