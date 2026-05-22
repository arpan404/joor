import {
  createPlugin,
  createAuthPolicy,
  defineConfig,
  defineManifest,
  defineProcedure,
  t,
  type JoorConfigContext,
  type JoorManifestRoutes,
  type ProcedureInput,
  type ProcedureAuth,
  type ProcedureOutput,
  type ProcedureResponseHeaders,
  type RpcRouteError,
  type RpcRouteEnvelope,
  type RpcRouteRequest,
  type RpcRouteRequestUnion,
  type RpcRouteResponseHeaders,
  type RpcStreamProcedure,
  type RpcStreamRouteId,
  type RpcUnaryProcedure,
  type RpcUnaryRouteId,
  type JsonValue,
} from '../src/index.js';
import { createClient } from '../src/rpc/client.js';

const usersPlugin = createPlugin({
  name: 'users',
  setup() {
    return {
      users: {
        findById(id: string) {
          return { id, name: 'Ada' };
        },
      },
    };
  },
});

const config = defineConfig({ plugins: [usersPlugin] as const });
type Services = JoorConfigContext<typeof config>;

const procedure = defineProcedure.withContext<Services>()({
  input: t.object({ id: t.string() }),
  headers: t.object({
    authorization: t.optional(t.string()),
    'x-tenant-id': t.string(),
  }),
  output: t.object({ id: t.string(), name: t.string() }),
  responseHeaders: t.object({
    'cache-control': t.string(),
  }),
  errors: {
    NOT_FOUND: t.object({ message: t.string() }),
  },
  async handler(ctx, input) {
    ctx.headers['x-tenant-id'].toUpperCase();
    ctx.headers.authorization?.toUpperCase();
    // @ts-expect-error ctx.error details must match the declared error schema.
    ctx.error('NOT_FOUND', { missing: 'message' });
    // @ts-expect-error ctx.error code must be declared by the procedure.
    ctx.error('UNDECLARED', { message: 'Nope' });
    const user = ctx.services.users.findById(input.id);
    return ctx.ok(user, { 'cache-control': 'private' });
  },
});

const authPolicy = createAuthPolicy<
  Services,
  Record<string, never>,
  { userId: string }
>({
  name: 'session',
  authenticate(ctx) {
    ctx.services.users.findById('1');
    return { userId: '1' };
  },
});

const authenticatedProcedure = defineProcedure.withContext<Services>()({
  input: t.object({ ok: t.boolean() }),
  output: t.object({ userId: t.string() }),
  auth: authPolicy,
  async handler(ctx) {
    ctx.auth.userId.toUpperCase();
    return ctx.ok({ userId: ctx.auth.userId });
  },
});

const streamProcedure = defineProcedure({
  input: t.object({ userId: t.string() }),
  stream: t.object({
    type: t.literal('user.updated'),
    userId: t.string(),
  }),
  async *handler(_ctx, input) {
    yield { type: 'user.updated' as const, userId: input.userId };
  },
});

const authShape: ProcedureAuth<typeof authenticatedProcedure> = {
  userId: '1',
};
authShape.userId.toUpperCase();

const validInput: ProcedureInput<typeof procedure> = { id: '1' };
validInput.id.toUpperCase();

// @ts-expect-error id is required and must be a string.
const _invalidInput: ProcedureInput<typeof procedure> = { id: 1 };
_invalidInput;

const validOutput: ProcedureOutput<typeof procedure> = {
  id: '1',
  name: 'Ada',
};
validOutput.name.toUpperCase();

const responseHeaders: ProcedureResponseHeaders<typeof procedure> = {
  'cache-control': 'private',
};
responseHeaders['cache-control'].toUpperCase();

const client = createClient({ url: '/rpc' });
client.call<typeof procedure>(
  'users.get',
  { id: '1' },
  { headers: { 'x-tenant-id': 'tenant-1' } }
);
// @ts-expect-error x-tenant-id is required by the procedure header schema.
client.call<typeof procedure>('users.get', { id: '1' });

const legacyUnaryProcedure: RpcUnaryProcedure<typeof procedure> = procedure;
legacyUnaryProcedure.output;
const legacyStreamProcedure: RpcStreamProcedure<typeof streamProcedure> =
  streamProcedure;
legacyStreamProcedure.stream;
client.stream<typeof streamProcedure>('users.watch', { userId: '1' });

// @ts-expect-error legacy call rejects stream procedures.
client.call<typeof streamProcedure>('users.watch', { userId: '1' });

// @ts-expect-error legacy request rejects stream procedures.
client.request<typeof streamProcedure>('users.watch', { userId: '1' });

// @ts-expect-error legacy stream rejects unary procedures.
client.stream<typeof procedure>('users.get', { id: '1' });

type Routes = {
  'users.get': typeof procedure;
  'users.authenticated': typeof authenticatedProcedure;
  'users.watch': typeof streamProcedure;
};

const manifest = defineManifest({
  procedures: {
    'users.get': procedure,
    'users.authenticated': authenticatedProcedure,
    'users.watch': streamProcedure,
  },
});
type ManifestRoutes = JoorManifestRoutes<typeof manifest>;
const manifestRouteClient = createClient<ManifestRoutes>({ url: '/rpc' });
manifestRouteClient.call(
  'users.get',
  { id: '1' },
  { headers: { 'x-tenant-id': 'tenant-1' } }
);

// @ts-expect-error manifest-derived clients reject unknown route ids.
manifestRouteClient.call('users.missing', { id: '1' });

// @ts-expect-error manifests only accept procedure runtimes.
defineManifest({ procedures: { broken: { input: t.string() } } });

const routeResponseHeaders: RpcRouteResponseHeaders<Routes, 'users.get'> = {
  'cache-control': 'private',
};
routeResponseHeaders['cache-control'].toUpperCase();

const routeNotFoundError: RpcRouteError<Routes, 'users.get'> = {
  code: 'NOT_FOUND',
  message: 'Not found',
  status: 404,
  details: { message: 'User not found' },
};
if (routeNotFoundError.code === 'NOT_FOUND') {
  routeNotFoundError.details?.message.toUpperCase();
}

const routeClient = createClient<Routes>({ url: '/rpc' });
const unaryRouteId: RpcUnaryRouteId<Routes> = 'users.get';
unaryRouteId.toUpperCase();
const streamRouteId: RpcStreamRouteId<Routes> = 'users.watch';
streamRouteId.toUpperCase();

// @ts-expect-error stream routes are not unary route ids.
const _wrongUnaryRouteId: RpcUnaryRouteId<Routes> = 'users.watch';

// @ts-expect-error unary routes are not stream route ids.
const _wrongStreamRouteId: RpcStreamRouteId<Routes> = 'users.get';

routeClient.call(
  'users.get',
  { id: '1' },
  { headers: { 'x-tenant-id': 'tenant-1' } }
);
routeClient.call('users.authenticated', { ok: true });
routeClient.stream('users.watch', { userId: '1' });

async function consumeRouteStream() {
  for await (const event of routeClient.stream('users.watch', {
    userId: '1',
  })) {
    const eventType: 'user.updated' = event.type;
    eventType.toUpperCase();
    event.userId.toUpperCase();
  }
}
consumeRouteStream();

const routeRequest = routeClient.request(
  'users.get',
  { id: '1' },
  { headers: { 'x-tenant-id': 'tenant-1' } }
);
const typedRouteRequest: RpcRouteRequest<Routes, 'users.get'> = routeRequest;
typedRouteRequest.input.id.toUpperCase();
typedRouteRequest.headers['x-tenant-id'].toUpperCase();
const routeRequestId: 'users.get' = routeRequest.id;
routeRequestId.toUpperCase();

const unionRouteRequest: RpcRouteRequestUnion<Routes> = routeRequest;
unionRouteRequest.id.toUpperCase();

// @ts-expect-error request ids preserve the selected route literal.
const _wrongRouteRequestId: 'users.authenticated' = routeRequest.id;

routeClient
  .call('users.get', { id: '1' }, { headers: { 'x-tenant-id': 'tenant-1' } })
  .then((result) => {
    const routeResultId: 'users.get' = result.id;
    routeResultId.toUpperCase();
    if (result.ok) {
      result.data.name.toUpperCase();
      result.headers?.['cache-control'].toUpperCase();

      // @ts-expect-error route response headers preserve the declared shape.
      result.headers?.missing;
    }
    if (!result.ok && result.error.code === 'NOT_FOUND') {
      result.error.details?.message.toUpperCase();

      // @ts-expect-error route errors preserve declared detail schemas.
      result.error.details?.missing;
    }
    if (!result.ok && result.error.code === 'VALIDATION_ERROR') {
      const _runtimeDetails: JsonValue | undefined = result.error.details;
      _runtimeDetails;
    }

    // @ts-expect-error envelopes preserve the selected route literal.
    const _wrongRouteResultId: 'users.authenticated' = result.id;
    _wrongRouteResultId;
  });

routeClient
  .batch([
    routeRequest,
    routeClient.request('users.authenticated', { ok: true }),
  ] as const)
  .then((results) => {
    const firstRouteId: 'users.get' = results[0].id;
    const secondRouteId: 'users.authenticated' = results[1].id;
    firstRouteId.toUpperCase();
    secondRouteId.toUpperCase();
  });

routeClient.batch([
  {
    id: 'users.get',
    input: { id: '1' },
    headers: { 'x-tenant-id': 'tenant-1' },
  },
  {
    id: 'users.authenticated',
    input: { ok: true },
  },
] as const);

routeClient
  .batch([
    {
      id: 'users.get',
      input: { id: '1' },
      headers: { 'x-tenant-id': 'tenant-1' },
    },
  ] as const)
  .then((results) => {
    const directBatchRouteId: 'users.get' = results[0].id;
    directBatchRouteId.toUpperCase();
  });

// @ts-expect-error route client batches reject unknown route ids.
routeClient.batch([{ id: 'users.missing', input: { id: '1' } }] as const);

// @ts-expect-error route client batches validate direct request input by id.
routeClient.batch([{ id: 'users.authenticated', input: { id: '1' } }] as const);

routeClient.batch([
  // @ts-expect-error route client batches require headers for protected routes.
  { id: 'users.get', input: { id: '1' } },
] as const);

const routeEnvelope: RpcRouteEnvelope<Routes, 'users.get'> = {
  ok: true,
  id: 'users.get',
  data: { id: '1', name: 'Ada' },
  headers: { 'cache-control': 'private' },
  traceId: 'trace-1',
};
routeEnvelope.id.toUpperCase();
if (routeEnvelope.ok) {
  routeEnvelope.headers?.['cache-control'].toUpperCase();

  // @ts-expect-error typed route envelopes reject unknown response headers.
  routeEnvelope.headers?.missing;
}

const routeErrorEnvelope: RpcRouteEnvelope<Routes, 'users.get'> = {
  ok: false,
  id: 'users.get',
  traceId: 'trace-1',
  error: {
    code: 'NOT_FOUND',
    message: 'Not found',
    status: 404,
    details: { message: 'User not found' },
  },
};
if (!routeErrorEnvelope.ok && routeErrorEnvelope.error.code === 'NOT_FOUND') {
  routeErrorEnvelope.error.details?.message.toUpperCase();
}

// @ts-expect-error typed route envelopes require the matching route id.
const _wrongRouteEnvelopeId: RpcRouteEnvelope<
  Routes,
  'users.get'
>['id'] = 'users.authenticated';

// @ts-expect-error typed route errors reject invalid declared details.
const _wrongRouteErrorEnvelope: RpcRouteEnvelope<Routes, 'users.get'> = {
  ok: false,
  id: 'users.get',
  traceId: 'trace-1',
  error: {
    code: 'NOT_FOUND',
    message: 'Not found',
    status: 404,
    details: { reason: 'missing' },
  },
};

// @ts-expect-error route-map clients only accept known procedure ids.
routeClient.call('users.missing', { id: '1' });

// @ts-expect-error stream routes cannot be called through unary call.
routeClient.call('users.watch', { userId: '1' });

// @ts-expect-error stream routes cannot create unary batch requests.
routeClient.request('users.watch', { userId: '1' });

// @ts-expect-error stream routes cannot be included in unary batches.
routeClient.batch([{ id: 'users.watch', input: { userId: '1' } }] as const);

routeClient.stream(
  // @ts-expect-error unary routes cannot be consumed through streaming transport.
  'users.get',
  { id: '1' },
  { headers: { 'x-tenant-id': 'tenant-1' } }
);

// @ts-expect-error procedure id controls the input type.
routeClient.call('users.authenticated', { id: '1' });

// @ts-expect-error procedure id controls required headers.
routeClient.call('users.get', { id: '1' });

defineProcedure.withContext<Services>()({
  input: t.object({ id: t.string() }),
  output: t.object({ id: t.string() }),
  // @ts-expect-error handler output must match the declared output schema.
  async handler(ctx, input) {
    ctx.services.users.findById(input.id);
    return ctx.ok({ missing: 'id' });
  },
});

defineProcedure({
  input: t.object({ id: t.string() }),
  output: t.object({ id: t.string() }),
  async handler(ctx, input) {
    input.id.toUpperCase();
    // @ts-expect-error no plugin context is available without withContext().
    ctx.services.users.findById(input.id);
    // @ts-expect-error no typed headers are available unless declared.
    ctx.headers.authorization.toUpperCase();
    // @ts-expect-error ctx.error is unavailable without declared errors.
    ctx.error('UNDECLARED', { message: 'Nope' });
    return ctx.ok({ id: input.id });
  },
});
