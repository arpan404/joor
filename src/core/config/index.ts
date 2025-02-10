import fs from 'node:fs';
import path from 'node:path';

import Jrror from '@/core/error/index';
import validateConfig from '@/helpers/validateConfig';
import JOOR_CONFIG from '@/types/config';

/**
 * A class responsible for loading and managing the configuration data.
 */
class Configuration {
  /**
   * Static variable to hold the configuration data.
   * @private
   */
  private static configData: JOOR_CONFIG | null = null;

  /**
   * Loads the configuration data from the configuration file (either `joor.config.js` or `joor.config.ts`).
   * Throws an error if the configuration has already been loaded or if loading fails.
   *
   * @throws {Jrror} Throws an error if configuration data is already loaded or if loading fails.
   * @returns {Promise<void>} A promise that resolves when the configuration is successfully loaded.
   * @private
   */
  private async loadConfig(): Promise<void> {
    // Check if the configuration data is already loaded
    if (Configuration.configData !== null) {
      throw new Jrror({
        code: 'config-loaded-already',
        docsPath: '/configuration',
        message:
          'The configuration data is already loaded. Attempting to load it again is not recommended',
        type: 'warn',
      });
    }

    try {
      // Default config file name is joor.config.js or else fallback to joor.config.ts
      let configFile = 'joor.config.js';

      if (!fs.existsSync(path.resolve(process.cwd(), configFile))) {
        configFile = 'joor.config.ts';
      }

      if (!fs.existsSync(path.resolve(process.cwd(), configFile))) {
        throw new Jrror({
          code: 'config-file-missing',
          docsPath: '/configuration',
          message:
            'The configuration file (joor.config.js or joor.config.ts) is missing in the root directory.',
          type: 'error',
        });
      }

      const configPath = path.resolve(process.cwd(), configFile);
      // Dynamically import the configuration file
      const configData = (await import(configPath)).config as JOOR_CONFIG;
      Configuration.configData = validateConfig(configData);
      this.setConfigToEnv();
    } catch (error) {
      throw new Jrror({
        code: 'config-load-failed',
        message: `Error occured while loading the configuration file. ${error}`,
        type: 'panic',
        docsPath: '/configuration',
      });
    }
  }

  private setConfigToEnv(): void {
    // File Size for Logger
    process.env.JOOR_LOGGER_MAX_FILE_SIZE =
      Configuration.configData?.logger?.maxFileSize?.toString() ?? '10485760';
    // Logger File Logging
    process.env.JOOR_LOGGER_ENABLE_FILE_LOGGING =
      Configuration.configData?.logger?.enable?.file?.toString() ?? 'true';
    // Logger Console Logging; only enabled in development mode for performance reasons
    process.env.JOOR_LOGGER_ENABLE_CONSOLE_LOGGING =
      (Configuration.configData?.logger?.enable?.console?.toString() ??
      Configuration.configData?.mode === 'development')
        ? 'true'
        : 'false';
  }
  /**
   * Retrieves the configuration data. If the configuration data is not already loaded, it will load it.
   *
   * @returns {Promise<JOOR_CONFIG>} A promise that resolves with the configuration data.
   * @throws {Jrror} Throws an error if the configuration cannot be loaded.
   */
  public async getConfig(): Promise<JOOR_CONFIG> {
    // Load the configuration data if not already loaded
    if (Configuration.configData === null) {
      await this.loadConfig();
    }

    return Configuration.configData as JOOR_CONFIG;
  }
}

export default Configuration;
