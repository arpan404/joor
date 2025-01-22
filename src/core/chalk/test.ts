import {
  BackgroundColorName,
  ColorName,
  ForegroundColorName,
  ModifierName,
} from '@/types/chalk';

const ANSI_BACKGROUND_OFFSET = 10;

/**
 * Creates a function that wraps ANSI escape codes for 16-color formatting
 * @param offset - The offset to add to the ANSI code (default: 0)
 * @returns A function that generates ANSI escape sequences
 */
const wrapAnsi16 = (offset = 0) => {
  return (code: number): string => {
    return `\u001B[${code + offset}m`;
  };
};

/**
 * Creates a function that wraps ANSI escape codes for 256-color formatting
 * @param offset - The offset to add to the ANSI code (default: 0)
 * @returns A function that generates ANSI escape sequences
 */
const wrapAnsi256 = (offset = 0) => {
  return (code: number): string => {
    return `\u001B[${38 + offset};5;${code}m`;
  };
};
/**
 * Creates a function that wraps ANSI escape codes for true color (RGB) formatting
 * @param offset - The offset to add to the ANSI code (default: 0)
 * @returns A function that generates ANSI escape sequences
 */
const wrapAnsi16m = (offset = 0) => {
  return (red: number, green: number, blue: number): string => {
    return `\u001B[${38 + offset};2;${red};${green};${blue}m`;
  };
};

/**
 * Object containing ANSI escape codes for text styling
 * Contains codes for modifiers (bold, italic, etc.), colors, and background colors
 */
const styleCodes: {
  modifier: Record<ModifierName, [number, number]>;
  color: Record<ForegroundColorName, [number, number]>;
  bgColor: Record<BackgroundColorName, [number, number]>;
} = {
  // Modifier codes: [activate code, deactivate code]
  modifier: {
    reset: [0, 0],
    // 21 isn't widely supported and 22 does the same thing
    bold: [1, 22],
    dim: [2, 22],
    italic: [3, 23],
    underline: [4, 24],
    overline: [53, 55],
    inverse: [7, 27],
    hidden: [8, 28],
    strikethrough: [9, 29],
  },
  // Foreground color codes: [color code, reset code]
  color: {
    black: [30, 39],
    red: [31, 39],
    green: [32, 39],
    yellow: [33, 39],
    blue: [34, 39],
    magenta: [35, 39],
    cyan: [36, 39],
    white: [37, 39],

    // Bright color variations
    blackBright: [90, 39],
    gray: [90, 39], // Alias of `blackBright`
    grey: [90, 39], // Alias of `blackBright`
    redBright: [91, 39],
    greenBright: [92, 39],
    yellowBright: [93, 39],
    blueBright: [94, 39],
    magentaBright: [95, 39],
    cyanBright: [96, 39],
    whiteBright: [97, 39],
  },
  // Background color codes: [color code, reset code]
  bgColor: {
    bgBlack: [40, 49],
    bgRed: [41, 49],
    bgGreen: [42, 49],
    bgYellow: [43, 49],
    bgBlue: [44, 49],
    bgMagenta: [45, 49],
    bgCyan: [46, 49],
    bgWhite: [47, 49],

    // Bright background color variations
    bgBlackBright: [100, 49],
    bgGray: [100, 49], // Alias of `bgBlackBright`
    bgGrey: [100, 49], // Alias of `bgBlackBright`
    bgRedBright: [101, 49],
    bgGreenBright: [102, 49],
    bgYellowBright: [103, 49],
    bgBlueBright: [104, 49],
    bgMagentaBright: [105, 49],
    bgCyanBright: [106, 49],
    bgWhiteBright: [107, 49],
  },
};

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

const assembleStyles = () => {
  const codes = new Map<number, number>();
  const styles: any = { ...styleCodes };

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
  Object.defineProperty(styles, 'codes', {
    value: codes,
    enumerable: false,
  });

  styles.color.close = '\u001B[39m';
  styles.bgColor.close = '\u001B[49m';

  styles.color.ansi = wrapAnsi16();
  styles.color.ansi256 = wrapAnsi256();
  styles.color.ansi16m = wrapAnsi16m();
  styles.bgColor.ansi = wrapAnsi16(ANSI_BACKGROUND_OFFSET);
  styles.bgColor.ansi256 = wrapAnsi256(ANSI_BACKGROUND_OFFSET);
  styles.bgColor.ansi16m = wrapAnsi16m(ANSI_BACKGROUND_OFFSET);
  Object.defineProperties(styles, {
    rgbToAnsi256: {
      value(red: number, green: number, blue: number) {},
      enumerable: false,
    },
    hexToRgb: {
      value(hex: number) {},
      enumerable: false,
    },
    hexToAnsi256: {
      value: (hex: number) => styles.rgbToAnsi256(...styles.hexToRgb(hex)),
      enumerable: false,
    },
    ansi256ToAnsi: {
      value(code: number) {
        if (code < 8) {
          return 30 + code;
        }

        if (code < 16) {
          return 90 + (code - 8);
        }

        let red;
        let green;
        let blue;

        if (code >= 232) {
          red = ((code - 232) * 10 + 8) / 255;
          green = red;
          blue = red;
        } else {
          code -= 16;

          const remainder = code % 36;

          red = Math.floor(code / 36) / 5;
          green = Math.floor(remainder / 6) / 5;
          blue = (remainder % 6) / 5;
        }

        const value = Math.max(red, green, blue) * 2;

        if (value === 0) {
          return 30;
        }

        // eslint-disable-next-line no-bitwise
        let result =
          30 +
          ((Math.round(blue) << 2) |
            (Math.round(green) << 1) |
            Math.round(red));

        if (value === 2) {
          result += 60;
        }

        return result;
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
  return styles;
};

const ansiStyles = assembleStyles();
export default ansiStyles;
