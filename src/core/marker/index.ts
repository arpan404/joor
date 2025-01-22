import {
  ColorSupportLevel,
  ChalkInstance,
  Options,
  AnsiStyles,
  CSPair,
  ColorBase,
} from '@/types/marker';

import ansiStyles from '@/core/marker/ansi';
import supportsColor from '@/core/marker/color';
import {
  stringReplaceAll,
  stringEncaseCRLFWithFirstIndex,
} from '@/core/marker/utilities';

// Symbol declarations
const GENERATOR = Symbol('GENERATOR');
const STYLER = Symbol('STYLER');
const IS_EMPTY = Symbol('IS_EMPTY');

// Internal interfaces
interface StylerType {
  open: string;
  close: string;
  openAll: string;
  closeAll: string;
  parent?: StylerType;
}

interface InternalChalkInstance extends ChalkInstance {
  [GENERATOR]: InternalChalkInstance;
  [STYLER]?: StylerType;
  [IS_EMPTY]: boolean;
}

type StyleEntry = CSPair | ColorBase;

// Level mapping
const levelMapping = ['ansi', 'ansi', 'ansi256', 'ansi16m'] as const;

type LevelMappingType = (typeof levelMapping)[number];

// Get stdout and stderr color support
const { stdout: stdoutColor, stderr: stderrColor } = supportsColor;

// Helper functions
const applyOptions = (
  object: InternalChalkInstance,
  options: Options = {}
): void => {
  if (
    options.level !== undefined &&
    !(
      Number.isInteger(options.level) &&
      options.level >= 0 &&
      options.level <= 3
    )
  ) {
    throw new Error('The level option should be an integer from 0 to 3');
  }

  const colorLevel = stdoutColor ? stdoutColor.level : 0;
  object.level = options.level ?? colorLevel;
};

const createStyler = (
  open: string,
  close: string,
  parent?: StylerType
): StylerType => {
  const openAll = parent ? parent.openAll + open : open;
  const closeAll = close + (parent?.closeAll ?? '');

  return {
    open,
    close,
    openAll,
    closeAll,
    parent,
  };
};

const getModelAnsi = (
  model: string,
  level: LevelMappingType,
  type: keyof Pick<AnsiStyles, 'color' | 'bgColor'>,
  ...args: [number, number, number]
): string => {
  if (model === 'rgb') {
    if (level === 'ansi16m') {
      return (ansiStyles[type] as ColorBase).ansi16m(...args);
    }

    if (level === 'ansi256') {
      return (ansiStyles[type] as ColorBase).ansi256(
        ansiStyles.rgbToAnsi256(...args)
      );
    }

    return (ansiStyles[type] as ColorBase).ansi(ansiStyles.rgbToAnsi(...args));
  }

  if (model === 'hex') {
    return getModelAnsi(
      'rgb',
      level,
      type,
      ...ansiStyles.hexToRgb(args[0].toString())
    );
  }

  return (ansiStyles[type] as ColorBase)[
    model as 'ansi' | 'ansi256' | 'ansi16m'
  ](...args);
};

const applyStyle = (self: InternalChalkInstance, string: string): string => {
  if (self.level <= 0 || !string) {
    return self[IS_EMPTY] ? '' : string;
  }

  let styler = self[STYLER];

  if (styler === undefined) {
    return string;
  }

  const { openAll, closeAll } = styler;
  if (string.includes('\u001B')) {
    while (styler !== undefined) {
      string = stringReplaceAll(string, styler.close, styler.open);
      styler = styler.parent;
    }
  }

  const lfIndex = string.indexOf('\n');
  if (lfIndex !== -1) {
    string = stringEncaseCRLFWithFirstIndex(string, closeAll, openAll, lfIndex);
  }

  return openAll + string + closeAll;
};

// Chalk class and factory
export class Chalk {
  constructor(options?: Options) {
    return chalkFactory(options);
  }
}

const createBuilder = (
  self: InternalChalkInstance,
  _styler: StylerType | undefined,
  _isEmpty: boolean
): InternalChalkInstance => {
  const builder = ((...args: unknown[]): string =>
    applyStyle(
      builder,
      args.length === 1 ? String(args[0]) : args.join(' ')
    )) as InternalChalkInstance;

  Object.setPrototypeOf(builder, proto);

  builder[GENERATOR] = self;
  builder[STYLER] = _styler;
  builder[IS_EMPTY] = _isEmpty;

  return builder;
};

const chalkFactory = (options?: Options): InternalChalkInstance => {
  const chalk = ((...strings: unknown[]): string =>
    strings.join(' ')) as InternalChalkInstance;

  applyOptions(chalk, options);
  Object.setPrototypeOf(chalk, createChalk.prototype);

  return chalk;
};

function createChalk(options?: Options): InternalChalkInstance {
  return chalkFactory(options);
}

Object.setPrototypeOf(createChalk.prototype, Function.prototype);

// Create styles
const styles: Record<string, PropertyDescriptor> = {};

for (const [styleName, style] of Object.entries(
  ansiStyles as unknown as Record<string, StyleEntry>
)) {
  if (typeof style === 'object' && 'open' in style && 'close' in style) {
    const stylePair = style as CSPair;
    styles[styleName] = {
      get() {
        const builder = createBuilder(
          this as InternalChalkInstance,
          createStyler(
            stylePair.open,
            stylePair.close,
            (this as InternalChalkInstance)[STYLER]
          ),
          (this as InternalChalkInstance)[IS_EMPTY]
        );
        Object.defineProperty(this, styleName, { value: builder });
        return builder;
      },
    };
  }
}

// Add color models
const usedModels = ['rgb', 'hex', 'ansi256'] as const;

for (const model of usedModels) {
  styles[model] = {
    get(this: InternalChalkInstance) {
      const { level } = this;
      return (...args: [number, number, number]): InternalChalkInstance => {
        const styler = createStyler(
          getModelAnsi(model, levelMapping[level], 'color', ...args),
          (ansiStyles.color as ColorBase).close,
          this[STYLER]
        );
        return createBuilder(this, styler, this[IS_EMPTY]);
      };
    },
  };
}

// Create prototype
const proto = Object.defineProperties(() => {}, {
  ...styles,
  level: {
    enumerable: true,
    get() {
      return (this as InternalChalkInstance)[GENERATOR].level;
    },
    set(level: ColorSupportLevel) {
      (this as InternalChalkInstance)[GENERATOR].level = level;
    },
  },
});

// Create default instances
const chalk = createChalk();
export const chalkStderr = createChalk({
  level: stderrColor ? stderrColor.level : 0,
});

export default chalk;
