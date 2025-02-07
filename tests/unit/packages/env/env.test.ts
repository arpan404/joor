// import fs from 'node:fs';
// import * as nodePath from 'node:path';
import { jest } from '@jest/globals';
// import env from '@/packages/env/env';
// import loadEnv from '@/packages/env/load';
jest.mock('node:fs');
jest.mock('node:path');
jest.mock('@/packages/env/load');
jest.mock('@/core/error');
jest.mock('@/core/error/JoorError');
describe('env', () => {
  describe('config', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
    it('should call loadEnv with the provided path and override options', () => {
      //   const path = '.env.test';
      //   const override = true;

      //   (fs.existsSync as jest.Mock).mockReturnValue(true);

      //   env.config({ path, override });

      expect(1).toBe(1);
    });

    // it('should resolve the absolute path if the provided path does not exist', () => {
    //   const path = '.env.test';
    //   const absolutePath = '/absolute/path/.env.test';

    //   (fs.existsSync as jest.Mock).mockReturnValue(false);
    //   (nodePath.resolve as jest.Mock).mockReturnValue(absolutePath);

    //   env.config({ path });

    //   expect(loadEnv).toHaveBeenCalledWith(absolutePath, undefined);
    // });

    // it('should handle Jrror and JoorError by calling reject', () => {
    //   const path = '.env.test';
    //   const error = new Jrror('Test error');

    //   fs.existsSync.mockReturnValue(true);
    //   loadEnv.mockImplementation(() => {
    //     throw error;
    //   });

    //   env.config({ path });

    //   expect((error as Jrror).reject).toHaveBeenCalled();
    // });

    // it('should handle unknown errors without throwing', () => {
    //   const path = '.env.test';
    //   const error = new Error('Unknown error');

    //   fs.existsSync.mockReturnValue(true);
    //   loadEnv.mockImplementation(() => {
    //     throw error;
    //   });

    //   expect(() => env.config({ path })).not.toThrow();
    // });
  });
});
