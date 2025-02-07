import { describe, it, expect } from '@jest/globals';

import parseEnv from '@/packages/env/parse';
describe('Environment File Parser', () => {
  it('should parse environment content correctly', () => {
    const envContent = `
        # Comment
        KEY1=value1
        KEY2=value2
        KEY3=value=with=equals
      `;

    const parsed = parseEnv(envContent);
    expect(parsed).toEqual({
      KEY1: 'value1',
      KEY2: 'value2',
      KEY3: 'value=with=equals',
    });
  });
  it('should handle invalid environment content gracefully', () => {
    const envContent = `
        KEY1=value1
        INVALID_LINE
        KEY2=value2
        Key3=value3 #comment
        # comment
      `;

    const parsed = parseEnv(envContent);
    expect(parsed).toEqual({
      KEY1: 'value1',
      KEY2: 'value2',
      INVALID_LINE: '',
      Key3: 'value3 #comment',
    });
  });
});
