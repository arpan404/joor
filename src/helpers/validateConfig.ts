import defaultConfig from '@/data/defaultConfig';
import logger from '@/helpers/joorLogger';
import JOOR_CONFIG from '@/types/config';

interface ValidationRule<T> {
  isValid: (value: unknown) => value is T;
  errorMessage: (_received: unknown) => string;
}

const createValidator =
  <T>(rule: ValidationRule<T>) =>
  (value: unknown, _path: string): value is T => {
    if (!rule.isValid(value)) {
      logger.warn(rule.errorMessage(value));
      return false;
    }

    return true;
  };

const validators = {
  port: createValidator<JOOR_CONFIG['server']['port']>({
    isValid: (value): value is JOOR_CONFIG['server']['port'] =>
      typeof value === 'number' && value > 0 && value < 65536,
    errorMessage: (received) =>
      `Invalid 'server.port': expected a number between 1-65535, received ${typeof received}. Using default: 8080`,
  }),

  host: createValidator<JOOR_CONFIG['server']['host']>({
    isValid: (value): value is JOOR_CONFIG['server']['host'] =>
      typeof value === 'string' && value.length > 0,
    errorMessage: (received) =>
      `Invalid 'server.host': expected non-empty string, received ${typeof received}. Using default: localhost`,
  }),

  serverMode: createValidator<JOOR_CONFIG['server']['mode']>({
    isValid: (value): value is 'tls' | 'http' =>
      typeof value === 'string' && ['tls', 'http'].includes(value),
    errorMessage: (received) =>
      `Invalid 'server.mode': expected 'tls' or 'http', received ${received}. Using default: http`,
  }),

  ssl: createValidator<JOOR_CONFIG['server']['ssl']>({
    isValid: (value): value is JOOR_CONFIG['server']['ssl'] =>
      typeof value === 'object' &&
      value !== null &&
      typeof (value as JOOR_CONFIG['server']['ssl'])?.key === 'string' &&
      typeof (value as JOOR_CONFIG['server']['ssl'])?.cert === 'string' &&
      (value as JOOR_CONFIG['server']['ssl'])?.key !== '' &&
      (value as JOOR_CONFIG['server']['ssl'])?.cert !== '',
    errorMessage: () =>
      `Invalid 'server.ssl': expected object with 'key' and 'cert' strings. SSL disabled`,
  }),

  socketOptions: createValidator<object>({
    isValid: (value): value is object =>
      typeof value === 'object' && value !== null,
    errorMessage: (received) =>
      `Invalid 'socket.options': expected object, received ${typeof received}`,
  }),

  loggerEnable: createValidator<{ file: boolean; console: boolean }>({
    isValid: (value): value is { file: boolean; console: boolean } =>
      value !== undefined &&
      typeof value === 'object' &&
      value !== null &&
      typeof (value as { file: boolean; console: boolean }).file ===
        'boolean' &&
      typeof (value as { file: boolean; console: boolean }).console ===
        'boolean',
    errorMessage: () =>
      `Invalid 'logger.enable': expected object with 'file' and 'console' booleans`,
  }),

  maxFileSize: createValidator<number>({
    isValid: (value): value is number => typeof value === 'number' && value > 0,
    errorMessage: (received) =>
      `Invalid 'logger.maxFileSize': expected positive number, received ${typeof received}. Using default: 10MB`,
  }),

  mode: createValidator<JOOR_CONFIG['mode']>({
    isValid: (value): value is JOOR_CONFIG['mode'] =>
      typeof value === 'string' &&
      ['development', 'production', 'testing', 'staging'].includes(value),
    errorMessage: (received) =>
      `Invalid 'mode': expected 'development'/'production'/'testing'/'staging', received ${received}. Using default: development`,
  }),

  envValues: createValidator<Record<string, string>>({
    isValid: (value): value is Record<string, string> => {
      if (typeof value !== 'object' || value === null) return false;
      const entries = Object.entries(value);
      if (entries.length === 0) return false;

      return entries.every(([, val]) => typeof val === 'string');
    },
    errorMessage: (received) =>
      `Invalid 'env.values': expected non-empty object with string values, received ${typeof received}`,
  }),

  envDefaults: createValidator<{ enable?: boolean; file?: string }>({
    isValid: (value): value is { enable?: boolean; file?: string } =>
      typeof value === 'object' &&
      value !== null &&
      (!('enable' in value) ||
        typeof (value as { enable?: boolean }).enable === 'boolean') &&
      (!('file' in value) ||
        typeof (value as { file?: string }).file === 'string'),
    errorMessage: () =>
      `Invalid 'env.defaults': expected object with optional 'enable' (boolean) and 'file' (string)`,
  }),
};

const validateConfig = (config: Partial<JOOR_CONFIG>): JOOR_CONFIG => {
  const validatedConfig = JSON.parse(JSON.stringify(defaultConfig));

  // Server validation
  if (config.server) {
    if (
      config.server.port &&
      validators.port(config.server.port, 'server.port')
    ) {
      validatedConfig.server.port = config.server.port;
    }

    if (
      config.server.host &&
      validators.host(config.server.host, 'server.host')
    ) {
      validatedConfig.server.host = config.server.host;
    }

    if (
      config.server.mode &&
      validators.serverMode(config.server.mode, 'server.mode')
    ) {
      validatedConfig.server.mode = config.server.mode;
    }

    if (config.server.ssl && validators.ssl(config.server.ssl, 'server.ssl')) {
      validatedConfig.server.ssl = config.server.ssl;
    }
  }

  // Socket validation
  if (
    config.socket?.options &&
    validators.socketOptions(config.socket.options, 'socket.options')
  ) {
    validatedConfig.socket = config.socket;
  }

  // Logger validation
  if (config.logger) {
    let isLoggerValid = true;

    if ('enable' in config.logger) {
      isLoggerValid = validators.loggerEnable(
        config.logger.enable,
        'logger.enable'
      );
    }

    if ('maxFileSize' in config.logger) {
      isLoggerValid = validators.maxFileSize(
        config.logger.maxFileSize,
        'logger.maxFileSize'
      );
    }

    if (isLoggerValid) {
      validatedConfig.logger = config.logger;
    }
  }

  // Mode validation
  if (config.mode && validators.mode(config.mode, 'mode')) {
    validatedConfig.mode = config.mode;
  }

  // Environment validation
  if (config.env) {
    validatedConfig.env = { ...defaultConfig.env };
    if (
      config.env.values &&
      validators.envValues(config.env.values, 'env.values')
    ) {
      validatedConfig.env.values = config.env.values;
    }

    if (
      config.env.defaults &&
      validators.envDefaults(config.env.defaults, 'env.defaults')
    ) {
      validatedConfig.env.defaults = config.env.defaults;
    }
  }

  return validatedConfig;
};

export default validateConfig;
