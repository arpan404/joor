import { describe, expect, it } from 'vitest';
import getUser from './fixtures/basic-app/rpc/users/get.rpc.js';
import watchUser from './fixtures/basic-app/rpc/users/watch.rpc.js';
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
    {
      id: 'users.watch',
      importPath: '/tmp/users/watch.rpc.ts',
      exportName: 'users_watch',
      procedure: watchUser,
    },
  ],
};

describe('openapi and ai docs', () => {
  it('generates openapi', () => {
    const document = createOpenApiDocument(manifest);

    expect(document['openapi']).toBe('3.1.0');
    expect(document['components']).toBeTypeOf('object');
    expect(document).toMatchObject({
      components: {
        schemas: {
          RpcRequest: {
            oneOf: [
              { $ref: '#/components/schemas/UsersGetRequest' },
              { $ref: '#/components/schemas/UsersWatchRequest' },
            ],
          },
          RpcResponse: {
            oneOf: [
              { $ref: '#/components/schemas/UsersGetResponse' },
              { $ref: '#/components/schemas/UsersWatchResponse' },
            ],
          },
          UsersGetRequest: {
            required: ['id', 'input'],
            properties: {
              id: { const: 'users.get' },
              input: { $ref: '#/components/schemas/UsersGetInput' },
            },
          },
          UsersWatchRequest: {
            properties: {
              id: { const: 'users.watch' },
              input: { $ref: '#/components/schemas/UsersWatchInput' },
            },
          },
          UsersGetSuccess: {
            required: ['ok', 'id', 'data', 'traceId', 'headers'],
            properties: {
              ok: { const: true },
              id: { const: 'users.get' },
              data: { $ref: '#/components/schemas/UsersGetOutput' },
              headers: { $ref: '#/components/schemas/UsersGetResponseHeaders' },
            },
          },
          UsersGetFailure: {
            properties: {
              ok: { const: false },
              id: { const: 'users.get' },
              error: { $ref: '#/components/schemas/UsersGetError' },
            },
          },
          UsersGetError: {
            oneOf: expect.arrayContaining([
              expect.objectContaining({
                properties: expect.objectContaining({
                  code: { const: 'NOT_FOUND' },
                  details: expect.objectContaining({
                    properties: expect.objectContaining({
                      message: { type: 'string' },
                    }),
                  }),
                }),
              }),
              { $ref: '#/components/schemas/RpcFrameworkError' },
            ]),
          },
          UsersGetResponse: {
            oneOf: [
              { $ref: '#/components/schemas/UsersGetSuccess' },
              { $ref: '#/components/schemas/UsersGetFailure' },
            ],
          },
          UsersWatchSuccess: {
            properties: {
              ok: { const: true },
              id: { const: 'users.watch' },
            },
          },
          UsersWatchResponse: {
            oneOf: [
              { $ref: '#/components/schemas/UsersWatchSuccess' },
              { $ref: '#/components/schemas/UsersWatchFailure' },
            ],
          },
        },
      },
      paths: {
        '/rpc': {
          post: {
            requestBody: {
              content: {
                'application/json': {
                  schema: {
                    oneOf: [
                      { $ref: '#/components/schemas/RpcRequest' },
                      {
                        type: 'array',
                        items: { $ref: '#/components/schemas/RpcRequest' },
                      },
                    ],
                  },
                },
              },
            },
            responses: {
              200: {
                content: {
                  'application/json': {
                    schema: {
                      oneOf: [
                        { $ref: '#/components/schemas/RpcResponse' },
                        {
                          type: 'array',
                          items: { $ref: '#/components/schemas/RpcResponse' },
                        },
                      ],
                    },
                  },
                },
              },
            },
            'x-joor-procedures': expect.arrayContaining([
              expect.objectContaining({
                id: 'users.get',
                requestRef: '#/components/schemas/UsersGetRequest',
                responseRef: '#/components/schemas/UsersGetResponse',
                successRef: '#/components/schemas/UsersGetSuccess',
                failureRef: '#/components/schemas/UsersGetFailure',
                errorRef: '#/components/schemas/UsersGetError',
              }),
              expect.objectContaining({
                id: 'users.watch',
                requestRef: '#/components/schemas/UsersWatchRequest',
                responseRef: '#/components/schemas/UsersWatchResponse',
              }),
            ]),
          },
        },
      },
    });
  });

  it('generates ai docs', () => {
    const document = createAiDocs(manifest);

    expect(document['framework']).toBe('joor');
    expect(document['schemaVersion']).toBe('0.1.0');
  });
});
