import {
  AnsiStyles,
  CSPair,
  Modifier,
  ForegroundColor,
  BackgroundColor,
  ColorBase,
} from '@/types/chalk';

const wrapAnsi16 =
  (offset = 0) =>
  (code: number): string =>
    `\u001B[${code + offset}m`;

const wrapAnsi256 =
  (offset = 0) =>
  (code: number): string =>
    `\u001B[${38 + offset};5;${code}m`;

const wrapAnsi16m =
  (offset = 0) =>
  (red: number, green: number, blue: number): string =>
    `\u001B[${38 + offset};2;${red};${green};${blue}m`;

const assembleStyles = (): AnsiStyles => {
  const codes = new Map<number, number>();

  const addPair = (start: number, end: number): CSPair => {
    codes.set(start, end);
    return {
      open: `\u001B[${start}m`,
      close: `\u001B[${end}m`,
    };
  };

  const modifier: Modifier = {
    bold: addPair(1, 22),
    dim: addPair(2, 22),
    italic: addPair(3, 23),
    underline: addPair(4, 24),
    inverse: addPair(7, 27),
    hidden: addPair(8, 28),
    overline: addPair(53, 55),
    strikethrough: addPair(9, 29),
    reset: addPair(0, 0),
  };

  const color: ForegroundColor & ColorBase = {
    black: addPair(30, 39),
    red: addPair(31, 39),
    green: addPair(32, 39),
    yellow: addPair(33, 39),
    blue: addPair(34, 39),
    magenta: addPair(35, 39),
    cyan: addPair(36, 39),
    white: addPair(37, 39),
    blackBright: addPair(90, 39),
    redBright: addPair(91, 39),
    greenBright: addPair(92, 39),
    yellowBright: addPair(93, 39),
    blueBright: addPair(94, 39),
    magentaBright: addPair(95, 39),
    cyanBright: addPair(96, 39),
    whiteBright: addPair(97, 39),
    gray: addPair(90, 39),
    grey: addPair(90, 39),
    close: '\u001B[39m',
    ansi: wrapAnsi16(),
    ansi256: wrapAnsi256(),
    ansi16m: wrapAnsi16m(),
  };

  const bgColor: BackgroundColor & ColorBase = {
    bgBlack: addPair(40, 49),
    bgRed: addPair(41, 49),
    bgGreen: addPair(42, 49),
    bgYellow: addPair(43, 49),
    bgBlue: addPair(44, 49),
    bgMagenta: addPair(45, 49),
    bgCyan: addPair(46, 49),
    bgWhite: addPair(47, 49),
    bgBlackBright: addPair(100, 49),
    bgRedBright: addPair(101, 49),
    bgGreenBright: addPair(102, 49),
    bgYellowBright: addPair(103, 49),
    bgBlueBright: addPair(104, 49),
    bgMagentaBright: addPair(105, 49),
    bgCyanBright: addPair(106, 49),
    bgWhiteBright: addPair(107, 49),
    bgGray: addPair(100, 49),
    bgGrey: addPair(100, 49),
    close: '\u001B[49m',
    ansi: wrapAnsi16(10),
    ansi256: wrapAnsi256(10),
    ansi16m: wrapAnsi16m(10),
  };

  const styles = {
    ...modifier,
    ...color,
    ...bgColor,
    modifier,
    color,
    bgColor,
    codes,
    rgbToAnsi256: (red: number, green: number, blue: number): number => {
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
    hexToRgb: (hex: number | string): [number, number, number] => {
      const matches = /[a-f\d]{6}|[a-f\d]{3}/i.exec(hex.toString(16));
      if (!matches) return [0, 0, 0];
      let [colorString] = matches;
      if (colorString.length === 3) {
        colorString = [...colorString].map((char) => char + char).join('');
      }
      const integer = parseInt(colorString, 16);
      return [(integer >> 16) & 0xff, (integer >> 8) & 0xff, integer & 0xff];
    },
    hexToAnsi256: function (hex: string): number {
      return this.rgbToAnsi256(...this.hexToRgb(hex));
    },
    ansi256ToAnsi: (code: number): number => {
      if (code < 8) return 30 + code;
      if (code < 16) return 90 + (code - 8);
      return code >= 232 ? 30 : 90;
    },
    rgbToAnsi: function (red: number, green: number, blue: number): number {
      return this.ansi256ToAnsi(this.rgbToAnsi256(red, green, blue));
    },
    hexToAnsi: function (hex: string): number {
      return this.ansi256ToAnsi(this.hexToAnsi256(hex));
    },
  } as AnsiStyles;

  return styles;
};

const ansiStyles = assembleStyles();
export default ansiStyles;

export const modifierNames = Object.keys(ansiStyles.modifier) as Array<
  keyof Modifier
>;
export const foregroundColorNames = Object.keys(ansiStyles.color) as Array<
  keyof ForegroundColor
>;
export const backgroundColorNames = Object.keys(ansiStyles.bgColor) as Array<
  keyof BackgroundColor
>;
