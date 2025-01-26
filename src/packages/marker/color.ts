import os from 'node:os';
import process from 'node:process';
import tty from 'node:tty';
import type { WriteStream } from 'node:tty';

import { ColorInfo, ColorSupportLevel, Options } from '@/types/marker';

/**
 * Utility function to check if a flag exists in the arguments.
 * @param {string} flag - The flag to check.
 * @param {string[]} [argv=process.argv] - The argument array to check in.
 * @returns {boolean} - Returns true if the flag is found, otherwise false.
 */
const hasFlag = (
  flag: string,
  argv: string[] = (globalThis as unknown as { Deno?: { args: string[] } }).Deno
    ? (globalThis as unknown as { Deno: { args: string[] } }).Deno.args
    : process.argv
): boolean => {
  const prefix = flag.startsWith('-') ? '' : flag.length === 1 ? '-' : '--';

  const position = argv.indexOf(prefix + flag);

  const terminatorPosition = argv.indexOf('--');

  return (
    position !== -1 &&
    (terminatorPosition === -1 || position < terminatorPosition)
  );
};

// Environment variables
const { env } = process;

let flagForceColor: number | undefined;

// Checking for flags related to color settings in command line arguments
if (
  hasFlag('no-color') ||
  hasFlag('no-colors') ||
  hasFlag('color=false') ||
  hasFlag('color=never')
) {
  flagForceColor = 0; // No color
} else if (
  hasFlag('color') ||
  hasFlag('colors') ||
  hasFlag('color=true') ||
  hasFlag('color=always')
) {
  flagForceColor = 1; // Force color
}

/**
 * Function to check the FORCE_COLOR environment variable to determine color support.
 * @returns {number | undefined} - Returns color support level or undefined if not set.
 */
function envForceColor(): number | undefined {
  const forceColor = env.FORCE_COLOR;

  if (forceColor !== undefined) {
    if (forceColor === 'true') {
      return 1;
    }

    if (forceColor === 'false') {
      return 0;
    }

    return forceColor.length === 0
      ? 1
      : Math.min(Number.parseInt(forceColor, 10), 3);
  }

  return undefined;
}

/**
 * Translates the color support level to a more detailed object.
 * @param {ColorSupportLevel} level - The level of color support.
 * @returns {ColorInfo} - Returns an object representing color support details.
 */
function translateLevel(level: ColorSupportLevel): ColorInfo {
  if (level === 0) {
    return false;
  }

  return {
    level,
    hasBasic: true,
    has256: level >= 2,
    has16m: level >= 3,
  };
}

/**
 * Main function to determine color support for a given stream.
 * @param {WriteStream} haveStream - The stream for which color support is determined.
 * @param {Object} options - Additional options to control behavior.
 * @param {boolean} [options.streamIsTTY] - Whether the stream is TTY.
 * @param {boolean} [options.sniffFlags=true] - Whether to sniff the flags for color support.
 * @returns {number} - Returns the level of color support (0 - no color, 1 - basic, 2 - 256 colors, 3 - 16 million colors).
 */
function _supportsColor(
  haveStream: WriteStream,
  {
    streamIsTTY,
    sniffFlags = true,
  }: { streamIsTTY?: boolean; sniffFlags?: boolean } = {}
): number {
  const noFlagForceColor = envForceColor();

  if (noFlagForceColor !== undefined) {
    flagForceColor = noFlagForceColor;
  }

  const forceColor = sniffFlags ? flagForceColor : noFlagForceColor;

  if (forceColor === 0) {
    return 0; // No color
  }

  if (sniffFlags) {
    // Checking flags for specific color settings
    if (
      hasFlag('color=16m') ||
      hasFlag('color=full') ||
      hasFlag('color=truecolor')
    ) {
      return 3; // 16 million colors (true color)
    }

    if (hasFlag('color=256')) {
      return 2; // 256 colors
    }
  }

  // Check for Azure DevOps pipelines
  if ('TF_BUILD' in env && 'AGENT_NAME' in env) {
    return 1; // Basic color support
  }

  if (haveStream && !streamIsTTY && forceColor === undefined) {
    return 0; // No color for non-TTY streams
  }

  const min = forceColor ?? 0;

  if (env.TERM === 'dumb') {
    return min; // No color for dumb terminal
  }

  if (process.platform === 'win32') {
    const osRelease = os.release().split('.');

    if (Number(osRelease[0]) >= 10 && Number(osRelease[2]) >= 10_586) {
      return Number(osRelease[2]) >= 14_931 ? 3 : 2; // 16 million or 256 colors on Windows
    }

    return 1; // Basic color support on older Windows
  }

  if ('CI' in env) {
    if (
      ['GITHUB_ACTIONS', 'GITEA_ACTIONS', 'CIRCLECI'].some((key) => key in env)
    ) {
      return 3; // Full color in CI environments
    }

    if (
      ['TRAVIS', 'APPVEYOR', 'GITLAB_CI', 'BUILDKITE', 'DRONE'].some(
        (sign) => sign in env
      ) ||
      env.CI_NAME === 'codeship'
    ) {
      return 1; // Basic color support in other CI environments
    }

    return min; // Default color support
  }

  if ('TEAMCITY_VERSION' in env && env.TEAMCITY_VERSION) {
    return /^(9\.(0*[1-9]\d*)\.|\d{2,}\.)/.test(env.TEAMCITY_VERSION) ? 1 : 0; // Color support for TeamCity
  }

  if (env.COLORTERM === 'truecolor') {
    return 3; // True color support
  }

  if (env.TERM === 'xterm-kitty') {
    return 3; // True color support for xterm-kitty
  }

  if ('TERM_PROGRAM' in env) {
    const version = Number.parseInt(
      (env.TERM_PROGRAM_VERSION ?? '').split('.')[0],
      10
    );

    switch (env.TERM_PROGRAM) {
      case 'iTerm.app': {
        return version >= 3 ? 3 : 2; // True color or 256 colors for iTerm
      }

      case 'Apple_Terminal': {
        return 2; // 256 colors for Apple Terminal
      }
    }
  }

  if ('TERM' in env && env.TERM) {
    if (/-256(color)?$/i.test(env.TERM)) {
      return 2; // 256 colors support
    }

    if (
      /^screen|^xterm|^vt100|^vt220|^rxvt|color|ansi|cygwin|linux/i.test(
        env.TERM
      )
    ) {
      return 1; // Basic color support for various terminals
    }
  }

  if ('COLORTERM' in env) {
    return 1; // Basic color support for COLORTERM
  }

  return min; // Default color support
}

/**
 * Creates and returns a color support object based on the stream and options provided.
 * @param {WriteStream | { isTTY: boolean }} [stream] - The stream to check for color support (stdout, stderr).
 * @param {Options} [options] - Options to modify behavior.
 * @returns {ColorInfo} - Returns an object representing the level of color support.
 */
export function createSupportsColor(
  stream?: WriteStream | { isTTY: boolean },
  options: Options = {}
): ColorInfo {
  const level = _supportsColor(stream as WriteStream, {
    streamIsTTY: stream?.isTTY,
    ...options,
  });

  return translateLevel(level as ColorSupportLevel);
}

// Default color support for stdout and stderr
const supportsColor = {
  stdout: createSupportsColor({ isTTY: tty.isatty(1) }),
  stderr: createSupportsColor({ isTTY: tty.isatty(2) }),
};

export default supportsColor;
