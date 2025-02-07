import Logger from '@/packages/logger';
import marker from '@/packages/marker';
// Mock the `fs.promises.appendFile` and `console` methods
jest.mock('node:fs', () => ({
  promises: {
    appendFile: jest.fn().mockResolvedValue(undefined),
    createDirectory: jest.fn().mockResolvedValue(undefined),
  },
  existsSync: jest.fn().mockReturnValue(false),
  stat: jest.fn().mockResolvedValue({ size: 10485 }),
}));
jest.spyOn(console, 'info').mockImplementation(() => {});
jest.spyOn(console, 'warn').mockImplementation(() => {});
jest.spyOn(console, 'error').mockImplementation(() => {});
jest.spyOn(console, 'debug').mockImplementation(() => {});
jest.spyOn(console, 'log').mockImplementation(() => {});
describe('Logger', () => {
  const logger = new Logger({
    name: 'test.logger',
    path: 'test.log',
    formatCallBack: (timestamp, message) => `${timestamp} - ${message}`,
  });

  const mockMessage = 'This is a test message';
  beforeEach(() => {
    process.env.JOOR_LOGGER_ENABLE_FILE_LOGGING = 'true';
    process.env.JOOR_LOGGER_ENABLE_CONSOLE_LOGGING = 'true';
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('should log INFO messages to console', () => {
    logger.info(mockMessage);
    expect(console.info).toHaveBeenCalled();
  });
  it('should log WARN messages to console', () => {
    logger.warn(mockMessage);
    expect(console.warn).toHaveBeenCalled();
  });
  it('should log ERROR messages to console', () => {
    logger.error(mockMessage);
    expect(console.error).toHaveBeenCalledWith(
      expect.stringContaining(mockMessage)
    );
  });
  it('should log DEBUG messages to console', () => {
    logger.debug(mockMessage);
    expect(console.debug).toHaveBeenCalled();
  });
  it('should use default formatting if no callback is provided', () => {
    const defaultLogger = new Logger({
      name: 'default.logger',
      path: 'default.log',
    });
    defaultLogger.info(mockMessage);
    expect(console.info).toHaveBeenCalledWith(expect.stringContaining('INFO'));
  });
  it('should not log messages to file if file logging is disabled', async () => {
    process.env.JOOR_LOGGER_ENABLE_FILE_LOGGING = 'false';
    const fs = require('node:fs');
    logger.info(mockMessage);
    expect(fs.promises.appendFile).not.toHaveBeenCalled();
  });
  it('should log messages with custom format callback', () => {
    const customLogger = new Logger({
      name: 'custom.logger',
      path: 'custom.log',
      formatCallBack: (timestamp, message) => {
        const dayDate = new Date(timestamp).toLocaleDateString('default', {
          month: 'long',
          day: 'numeric',
        });

        return `Custom Format: ${dayDate} - ${message}`;
      },
    });
    const mockTimeStamp = new Date().toLocaleDateString('default', {
      month: 'long',
      day: 'numeric',
    });
    customLogger.info(mockMessage);
    expect(console.info).toHaveBeenCalledWith(
      `${marker.bgGreenBright.bold(' INFO ')} 'custom.logger' - Custom Format: ${mockTimeStamp} - ${mockMessage}`
    );
  });
});
