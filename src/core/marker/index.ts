import {
  ColorSupportLevel,
  MarkerInstance,
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
/**
 * Represents a styler object with open, close, and parent properties.
 */
interface StylerType {
  open: string;
  close: string;
  openAll: string;
  closeAll: string;
  parent?: StylerType;
}

/**
 * Represents the internal marker instance which extends MarkerInstance.
 */
interface InternalMarkerInstance extends MarkerInstance {
  [GENERATOR]: InternalMarkerInstance;
  [STYLER]?: StylerType;
  [IS_EMPTY]: boolean;
}

/**
 * Represents a style entry which can either be a CSPair or ColorBase.
 */
type StyleEntry = CSPair | ColorBase;

// Level mapping
const levelMapping = ['ansi', 'ansi', 'ansi256', 'ansi16m'] as const;

type LevelMappingType = (typeof levelMapping)[number];

// Get stdout and stderr color support
const { stdout: stdoutColor, stderr: stderrColor } = supportsColor;

/**
 * Applies the provided options to the marker instance.
 *
 * @param {InternalMarkerInstance} object - The marker instance to apply options to.
 * @param {Options} options - Options to configure the marker instance.
 * @throws {Error} Throws error if level is not a valid integer between 0 and 3.
 */
const applyOptions = (
  object: InternalMarkerInstance,
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

/**
 * Creates a new styler with open and close strings, optionally inheriting from a parent styler.
 *
 * @param {string} open - The opening string for the style.
 * @param {string} close - The closing string for the style.
 * @param {StylerType} [parent] - The parent styler to inherit from.
 * @returns {StylerType} The created styler.
 */
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

/**
 * Gets the ANSI color string based on the specified model, level, and type.
 *
 * @param {string} model - The color model (rgb, hex, etc.).
 * @param {LevelMappingType} level - The color level (ansi, ansi256, ansi16m).
 * @param {keyof Pick<AnsiStyles, 'color' | 'bgColor'>} type - The type of style (color or background color).
 * @param {...[number, number, number]} args - The color values (RGB or HEX).
 * @returns {string} The corresponding ANSI color string.
 */
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

/**
 * Applies the style to the given string based on the current instance.
 *
 * @param {InternalMarkerInstance} self - The current marker instance.
 * @param {string} string - The string to which the style will be applied.
 * @returns {string} The styled string.
 */
const applyStyle = (self: InternalMarkerInstance, string: string): string => {
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

// Marker class and factory
/**
 * Marker class that creates instances of markers that can style text.
 */
export class Marker {
  constructor(options?: Options) {
    return markerFactory(options);
  }
}

/**
 * Creates a new builder for the marker instance.
 *
 * @param {InternalMarkerInstance} self - The current marker instance.
 * @param {StylerType | undefined} _styler - The styler to apply.
 * @param {boolean} _isEmpty - Whether the marker instance is empty.
 * @returns {InternalMarkerInstance} The new marker instance.
 */
const createBuilder = (
  self: InternalMarkerInstance,
  _styler: StylerType | undefined,
  _isEmpty: boolean
): InternalMarkerInstance => {
  const builder = ((...args: unknown[]): string =>
    applyStyle(
      builder,
      args.length === 1 ? String(args[0]) : args.join(' ')
    )) as InternalMarkerInstance;

  Object.setPrototypeOf(builder, proto);

  builder[GENERATOR] = self;
  builder[STYLER] = _styler;
  builder[IS_EMPTY] = _isEmpty;

  return builder;
};

/**
 * Factory function to create a marker instance.
 *
 * @param {Options} [options] - Optional configuration options for the marker.
 * @returns {InternalMarkerInstance} The created marker instance.
 */
const markerFactory = (options?: Options): InternalMarkerInstance => {
  const Marker = ((...strings: unknown[]): string =>
    strings.join(' ')) as InternalMarkerInstance;

  applyOptions(Marker, options);
  Object.setPrototypeOf(Marker, createMarker.prototype);

  return Marker;
};

/**
 * Creates a marker with the given options.
 *
 * @param {Options} [options] - Optional configuration options for the marker.
 * @returns {InternalMarkerInstance} The created marker instance.
 */
function createMarker(options?: Options): InternalMarkerInstance {
  return markerFactory(options);
}

Object.setPrototypeOf(createMarker.prototype, Function.prototype);

// Create styles
const styles: Record<string, PropertyDescriptor> = {};

// Iterate over available ANSI styles and create properties for each one.
for (const [styleName, style] of Object.entries(
  ansiStyles as unknown as Record<string, StyleEntry>
)) {
  if (typeof style === 'object' && 'open' in style && 'close' in style) {
    const stylePair = style as CSPair;
    styles[styleName] = {
      get() {
        const builder = createBuilder(
          this as InternalMarkerInstance,
          createStyler(
            stylePair.open,
            stylePair.close,
            (this as InternalMarkerInstance)[STYLER]
          ),
          (this as InternalMarkerInstance)[IS_EMPTY]
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
    get(this: InternalMarkerInstance) {
      const { level } = this;
      return (...args: [number, number, number]): InternalMarkerInstance => {
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
      return (this as InternalMarkerInstance)[GENERATOR].level;
    },
    set(level: ColorSupportLevel) {
      (this as InternalMarkerInstance)[GENERATOR].level = level;
    },
  },
});

// Create default instances
const marker = createMarker();
export const MarkerStderr = createMarker({
  level: stderrColor ? stderrColor.level : 0,
});

export default marker;
