import { describe, expect, it } from 'vitest';
import getUser from './fixtures/basic-app/rpc/users/get.rpc.js';
import { createAiDocs } from '../src/compiler/ai-docs.js';
import { createOpenApiDocument } from '../src/compiler/openapi.js';

const manifest = {
  procedures: [
    {
      id: 'users.get',
      importPath: '/tmp/users/get.rpc.ts',
      exportName: 'users_get',
      procedure: getUser,
    },
  ],
};

describe('openapi and ai docs', () => {
  it('generates openapi', () => {
    const document = createOpenApiDocument(manifest);

    expect(document['openapi']).toBe('3.1.0');
    expect(document['components']).toBeTypeOf('object');
  });

  it('generates ai docs', () => {
    const document = createAiDocs(manifest);

    expect(document['framework']).toBe('joor');
    expect(document['schemaVersion']).toBe('0.1.0');
  });
});
