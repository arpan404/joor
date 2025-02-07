import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

import { jest, describe, it, expect } from '@jest/globals';

import JoorError from '@/core/error/JoorError';
import loadEnv from '@/packages/env/load';
jest.mock('node:fs');
jest.mock('node:path');
jest.mock('@/packages/logger');
describe('loadEnv', () => {
  const mockReadFileSync = fs.readFileSync as jest.Mock;

  const mockExistsSync = fs.existsSync as jest.Mock;

  const mockResolve = path.resolve as jest.Mock;
  beforeEach(() => {
    jest.clearAllMocks();
    mockExistsSync.mockReturnValue(true);
    mockResolve.mockImplementation(
      (_p: unknown) => '/resolved/path/.env' as any
    );
  });
  it('should load environment variables from file', () => {
    mockReadFileSync.mockReturnValue('KEY1=value1\nKEY2=value2');
    loadEnv('.env');
    expect(mockReadFileSync).toHaveBeenCalledWith(
      '/resolved/path/.env',
      'utf-8'
    );
    expect(process.env.KEY1).toBe('value1');
    expect(process.env.KEY2).toBe('value2');
  });
  it('should skip if file does not exist', () => {
    mockExistsSync.mockReturnValue(false);
    loadEnv('.env');
    expect(mockReadFileSync).not.toHaveBeenCalled();
  });
  it('should not override existing variables by default', () => {
    process.env.KEY1 = 'original';
    mockReadFileSync.mockReturnValue('KEY1=newValue');
    loadEnv('.env');
    expect(process.env.KEY1).toBe('original');
  });
  it('should override existing variables when specified', () => {
    process.env.KEY1 = 'original';
    mockReadFileSync.mockReturnValue('KEY1=newValue');
    loadEnv('.env', true);
    expect(process.env.KEY1).toBe('newValue');
  });
  it('should throw a Jrror if reading fails', () => {
    mockReadFileSync.mockImplementation(() => {
      throw new Error('Read error');
    });
    expect(() => loadEnv('.env')).toThrow(JoorError);
  });
});
