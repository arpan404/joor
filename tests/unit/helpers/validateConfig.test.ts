import logger from '@/helpers/joorLogger';
import validateConfig from '@/helpers/validateConfig';
// Mock the logger
jest.mock('@/helpers/joorLogger', () => ({
  warn: jest.fn(),
}));
describe('validateConfig', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  describe('Server Configuration', () => {
    test('accepts valid server configuration', () => {
      const config = {
        server: {
          port: 3000,
          host: 'example.com',
          mode: 'http' as const,
          ssl: {
            key: 'key-content',
            cert: 'cert-content',
          },
        },
      };

      const validated = validateConfig(config);
      expect(validated.server).toEqual(config.server);
      expect(logger.warn).not.toHaveBeenCalled();
    });
    test('validates port number range', () => {
      const invalidPorts = [-1, 0, 65536, 70000];
      invalidPorts.forEach((port) => {
        const con = { server: { port } };
        const validated = validateConfig(con);
        expect(validated.server.port).toBe(8080);
        expect(logger.warn).toHaveBeenCalledWith(
          expect.stringContaining("Invalid 'server.port'")
        );
        jest.clearAllMocks();
      });
    });
    test('validates host string', () => {
      const invalidHosts = ['', null, undefined, 123];
      invalidHosts.forEach((host) => {
        const config = { server: { host } as any };
        const validated = validateConfig(config);
        expect(validated.server.host).toBe('localhost');
        expect(logger.warn).toHaveBeenCalledWith(
          expect.stringContaining("Invalid 'server.host'")
        );
        jest.clearAllMocks();
      });
    });
    test('validates server mode', () => {
      const invalidModes = ['https', 'tcp', '', null, 123];
      invalidModes.forEach((mode) => {
        const config = { server: { mode } as any };
        const validated = validateConfig(config);
        expect(validated.server.mode).toBe('http');
        expect(logger.warn).toHaveBeenCalledWith(
          expect.stringContaining("Invalid 'server.mode'")
        );
        jest.clearAllMocks();
      });
    });
    test('validates SSL configuration', () => {
      const invalidSSLConfigs = [
        { key: 123, cert: 'cert' },
        { key: 'key', cert: null },
        { key: '', cert: '' },
        { cert: 'cert' },
        { key: 'key' },
      ];
      invalidSSLConfigs.forEach((ssl) => {
        const config = { server: { ssl } as any };
        const validated = validateConfig(config);
        expect(validated.server.ssl).toBeUndefined();
        expect(logger.warn).toHaveBeenCalledWith(
          expect.stringContaining("Invalid 'server.ssl'")
        );
        jest.clearAllMocks();
      });
    });
  });
  describe('Socket Configuration', () => {
    test('accepts valid socket configuration', () => {
      const config = {
        socket: {
          options: {
            path: '/socket.io',
            cors: { origin: '*' },
          },
        },
      };

      const validated = validateConfig(config as any);
      expect(validated.socket).toEqual(config.socket);
      expect(logger.warn).not.toHaveBeenCalled();
    });
    test('validates socket options', () => {
      const invalidOptions = [null, undefined, '', 123, true];
      invalidOptions.forEach((options) => {
        const config = { socket: { options } as any };
        const validated = validateConfig(config);
        expect(validated.socket).toBeUndefined();
        expect(logger.warn).toHaveBeenCalledWith(
          expect.stringContaining("Invalid 'socket.options'")
        );
        jest.clearAllMocks();
      });
    });
  });
  describe('Logger Configuration', () => {
    test('accepts valid logger configuration', () => {
      const config = {
        logger: {
          enable: {
            file: true,
            console: false,
          },
          maxFileSize: 5242880,
        },
      };

      const validated = validateConfig(config);
      expect(validated.logger).toEqual(config.logger);
      expect(logger.warn).not.toHaveBeenCalled();
    });
    test('validates logger enable flags', () => {
      const invalidEnableConfigs = [
        { file: 'true', console: true },
        { file: true, console: 'false' },
        { file: true },
        { console: true },
        null,
        undefined,
        123,
        'invalid',
      ];
      invalidEnableConfigs.forEach((enable) => {
        const config = { logger: { enable } as any };
        const validated = validateConfig(config);
        expect(validated.logger?.enable).toEqual({
          file: true,
          console: true,
        });
        expect(logger.warn).toHaveBeenCalledWith(
          expect.stringContaining("Invalid 'logger.enable'")
        );
        jest.clearAllMocks();
      });
    });
    test('validates maxFileSize', () => {
      const invalidSizes = [-1, 0, null, undefined, 'invalid', true];
      invalidSizes.forEach((maxFileSize) => {
        const config = { logger: { maxFileSize } as any };
        const validated = validateConfig(config);
        expect(validated.logger?.maxFileSize).toBe(10485760);
        expect(logger.warn).toHaveBeenCalledWith(
          expect.stringContaining("Invalid 'logger.maxFileSize'")
        );
        jest.clearAllMocks();
      });
    });
  });
  describe('Mode Configuration', () => {
    test('accepts valid modes', () => {
      const validModes = [
        'development',
        'production',
        'testing',
        'staging',
      ] as const;
      validModes.forEach((mode) => {
        const config = { mode };
        const validated = validateConfig(config);
        expect(validated.mode).toBe(mode);
        expect(logger.warn).not.toHaveBeenCalled();
      });
    });
    test('validates mode value', () => {
      const invalidModes = ['dev', 'prod', '', null, undefined, 123, true];
      invalidModes.forEach((mode) => {
        const config = { mode } as any;
        const validated = validateConfig(config);
        expect(validated.mode).toBe('development');
        expect(logger.warn).toHaveBeenCalledWith(
          expect.stringContaining("Invalid 'mode'")
        );
        jest.clearAllMocks();
      });
    });
  });
  describe('Environment Configuration', () => {
    test('accepts valid environment configuration', () => {
      const config = {
        env: {
          values: {
            NODE_ENV: 'development',
            API_KEY: 'secret',
          },
          defaults: {
            enable: true,
            file: '.env',
          },
        },
      };

      const validated = validateConfig(config);
      expect(validated.env).toEqual(config.env);
      expect(logger.warn).not.toHaveBeenCalled();
    });
    test('validates env values', () => {
      const invalidValues = [{}, null, undefined, 123, true, ''];
      invalidValues.forEach((values) => {
        const config = { env: { values } as any };
        const validated = validateConfig(config);
        expect(validated.env?.values).toBeUndefined();
        expect(logger.warn).toHaveBeenCalledWith(
          expect.stringContaining("Invalid 'env.values'")
        );
        jest.clearAllMocks();
      });
    });
    test('validates env defaults', () => {
      const invalidDefaults = [
        { enable: 'true' },
        { enable: 1 },
        { file: 123 },
        null,
        undefined,
        123,
        '',
      ];
      invalidDefaults.forEach((defaults) => {
        const config = { env: { defaults } as any };
        const validated = validateConfig(config);
        expect(validated.env?.defaults).toEqual({
          enable: true,
        });
        expect(logger.warn).toHaveBeenCalledWith(
          expect.stringContaining("Invalid 'env.defaults'")
        );
        jest.clearAllMocks();
      });
    });
  });
  describe('Default Values and Edge Cases', () => {
    test('returns complete default configuration for empty input', () => {
      const validated = validateConfig({});
      expect(validated).toEqual({
        server: {
          port: 8080,
          host: 'localhost',
          mode: 'http',
          ssl: undefined,
        },
        socket: undefined,
        logger: {
          enable: {
            file: true,
            console: true,
          },
          maxFileSize: 10485760,
        },
        mode: 'development',
        env: {
          values: undefined,
          defaults: {
            enable: true,
          },
        },
      });
      expect(logger.warn).not.toHaveBeenCalled();
    });
    test('handles null values', () => {
      const config = {
        server: null,
        socket: null,
        logger: null,
        env: null,
      } as any;

      const validated = validateConfig(config);
      expect(validated).toEqual(
        expect.objectContaining({
          server: {
            port: 8080,
            host: 'localhost',
            mode: 'http',
            ssl: undefined,
          },
        })
      );
    });
    test('handles partial configuration', () => {
      const config = {
        server: {
          port: 3000,
        },
        mode: 'production' as const,
      };

      const validated = validateConfig(config);
      expect(validated.server.port).toBe(3000);
      expect(validated.server.host).toBe('localhost');
      expect(validated.mode).toBe('production');
      expect(logger.warn).not.toHaveBeenCalled();
    });
  });
});
