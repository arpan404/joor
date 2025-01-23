// Marker : Rewritten version of chalk library in TypeScript
import {
  ColorSupportLevel,
  MarkerInstance,
  Options,
  AnsiStyles,
  CSPair,
  ColorBase,
} from '@/types/marker';

import ansiStyles from '@/packages/marker/ansi';
import supportsColor from '@/packages/marker/color';
import {
  stringReplaceAll,
  stringEncaseCRLFWithFirstIndex,
} from '@/packages/marker/utilities';

// Symbol declarations to define private properties.
const GENERATOR = Symbol('GENERATOR');
const STYLER = Symbol('STYLER');
const IS_EMPTY = Symbol('IS_EMPTY');

/**
 * Internal interface for the Styler type, which represents the ANSI styling metadata.
 * @typedef {Object} StylerType
 * @property {string} open - The opening ANSI escape code.
 * @property {string} close - The closing ANSI escape code.
 * @property {string} openAll - All parent opening escape codes concatenated.
 * @property {string} closeAll - All parent closing escape codes concatenated.
 * @property {StylerType} [parent] - Reference to the parent Styler, if any.
 */
interface StylerType {
  open: string;
  close: string;
  openAll: string;
  closeAll: string;
  parent?: StylerType;
}

/**
 * Internal interface for the Marker instance with extended functionality.
 */
interface InternalMarkerInstance extends MarkerInstance {
  [GENERATOR]: InternalMarkerInstance;
  [STYLER]?: StylerType;
  [IS_EMPTY]: boolean;
}

/**
 * Type representing supported styles.
 */
type StyleEntry = CSPair | ColorBase;

// Mapping color support levels to their corresponding ANSI styling.
const levelMapping = ['ansi', 'ansi', 'ansi256', 'ansi16m'] as const;
type LevelMappingType = (typeof levelMapping)[number];

// Extracting terminal color support levels.
const { stdout: stdoutColor, stderr: stderrColor } = supportsColor;

/**
 * Apply options to an InternalMarkerInstance object.
 *
 * @param {InternalMarkerInstance} object - The marker instance.
 * @param {Options} [options={}] - Options for the marker.
 * @throws {Error} If the level option is not an integer between 0 and 3.
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
 * Create a new Styler object.
 *
 * @param {string} open - Opening ANSI escape code.
 * @param {string} close - Closing ANSI escape code.
 * @param {StylerType} [parent] - Parent Styler object.
 * @returns {StylerType} The created Styler object.
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
 * Generate ANSI escape codes for a given color model and level.
 *
 * @param {string} model - Color model (`rgb` or `hex`).
 * @param {LevelMappingType} level - The color support level.
 * @param {'color' | 'bgColor'} type - Type of ANSI code (foreground or background color).
 * @param {number[]} args - Arguments representing the color values.
 * @returns {string} The generated ANSI escape code.
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
 * Apply styling to a string using an InternalMarkerInstance.
 *
 * @param {InternalMarkerInstance} self - The marker instance.
 * @param {string} string - The string to style.
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
      // eslint-disable-next-line no-param-reassign
      string = stringReplaceAll(string, styler.close, styler.open);
      styler = styler.parent;
    }
  }

  const lfIndex = string.indexOf('\n');
  if (lfIndex !== -1) {
    // eslint-disable-next-line no-param-reassign
    string = stringEncaseCRLFWithFirstIndex(string, closeAll, openAll, lfIndex);
  }

  return openAll + string + closeAll;
};

/**
 * Marker class constructor for creating styled text.
 */
export class Marker {
  constructor(options?: Options) {
    return markerFactory(options);
  }
}

/**
 * Create a builder function with the specified styler.
 *
 * @param {InternalMarkerInstance} self - The marker instance.
 * @param {StylerType} _styler - The styler object.
 * @param {boolean} _isEmpty - Flag indicating if the builder is empty.
 * @returns {InternalMarkerInstance} The created builder function.
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
 * Factory function to create a new marker instance.
 *
 * @param {Options} [options] - Marker options.
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
 * Create a new marker instance.
 *
 * @param {Options} [options] - Marker options.
 * @returns {InternalMarkerInstance} The created marker instance.
 */
function createMarker(options?: Options): InternalMarkerInstance {
  return markerFactory(options);
}

Object.setPrototypeOf(createMarker.prototype, Function.prototype);

// Define styles dynamically based on ansiStyles.
const styles: Record<string, PropertyDescriptor> = {};

for (const [styleName, style] of Object.entries(
  ansiStyles as unknown as Record<string, StyleEntry>
)) {
  if (typeof style === 'object' && 'open' in style && 'close' in style) {
    const stylePair = style;
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

// Add color model methods.
const usedModels = ['rgb', 'hex', 'ansi256'] as const;

for (const model of usedModels) {
  styles[model] = {
    // eslint-disable-next-line no-unused-vars
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

// Define properties for the marker prototype.
const properties = Object.entries(styles).reduce(
  (acc, [key, value]) => {
    acc[key] = {
      ...value,
      enumerable: true,
      configurable: true,
    };
    return acc;
  },
  {} as Record<string, PropertyDescriptor>
);

// Add `level` getter and setter to properties.
properties.level = {
  enumerable: true,
  configurable: true,
  // eslint-disable-next-line no-unused-vars
  get(this: InternalMarkerInstance) {
    return this[GENERATOR].level;
  },
  set(this: InternalMarkerInstance, level: ColorSupportLevel) {
    this[GENERATOR].level = level;
  },
};

// Define the prototype for marker instances.
const proto = Object.defineProperties(
  Object.create(Function.prototype),
  properties
);

// Create the default marker instance.
const marker = createMarker();
Object.setPrototypeOf(marker, proto);

/**
 * Exported marker instance for styled text output to `stdout`.
 */
export default marker;

/**
 * Exported marker instance for styled text output to `stderr`.
 */
export const MarkerStderr = createMarker({
  level: stderrColor ? stderrColor.level : 0,
});
