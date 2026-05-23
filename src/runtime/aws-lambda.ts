import { Buffer } from 'node:buffer';
import type { JoorPlugin } from '../context/plugin.js';
import type { JoorManifest } from '../manifest.js';
import type {
  HandlerOptions,
  HandlerOptionsArgs,
  HandlerOptionsFor,
  RpcManifestBody,
  RpcManifestRouteStreamBody,
  RpcManifestRouteUnaryBody,
} from '../rpc/dispatcher.js';
import { createJoorHandler } from './fetch.js';

export interface AwsLambdaHttpEventV2 {
  version?: string;
  rawPath?: string;
  rawQueryString?: string;
  headers?: Record<string, string | undefined>;
  cookies?: string[];
  body?: string | null;
  isBase64Encoded?: boolean;
  requestContext?: {
    domainName?: string;
    http?: {
      method?: string;
      protocol?: string;
      sourceIp?: string;
    };
  };
}

export interface AwsLambdaHttpResponseV2 {
  statusCode: number;
  headers?: Record<string, string>;
  cookies?: string[];
  body?: string;
  isBase64Encoded?: boolean;
}

export interface AwsLambdaRestApiEventV1 {
  path?: string;
  httpMethod?: string;
  headers?: Record<string, string | undefined>;
  multiValueHeaders?: Record<
    string,
    readonly (string | undefined)[] | undefined
  >;
  queryStringParameters?: Record<string, string | undefined> | null;
  multiValueQueryStringParameters?: Record<
    string,
    readonly (string | undefined)[] | undefined
  > | null;
  body?: string | null;
  isBase64Encoded?: boolean;
  requestContext?: {
    domainName?: string;
    path?: string;
    protocol?: string;
    identity?: {
      sourceIp?: string;
    };
  };
}

export interface AwsLambdaRestApiResponseV1 {
  statusCode: number;
  headers?: Record<string, string>;
  multiValueHeaders?: Record<string, string[]>;
  body?: string;
  isBase64Encoded?: boolean;
}

export type AwsLambdaHandler = (
  event: AwsLambdaHttpEventV2
) => AwsLambdaHttpResponseV2 | Promise<AwsLambdaHttpResponseV2>;

export type AwsLambdaHttpApiHandler = AwsLambdaHandler;

export type AwsLambdaRestApiHandler = (
  event: AwsLambdaRestApiEventV1
) => AwsLambdaRestApiResponseV1 | Promise<AwsLambdaRestApiResponseV1>;

export type AwsLambdaHandlerOptionsFor<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestBody<TManifest> = RpcManifestBody<TManifest>,
> = HandlerOptionsFor<TManifest, TPlugins, TBody>;

export type AwsLambdaHttpApiHandlerOptionsFor<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestBody<TManifest> = RpcManifestBody<TManifest>,
> = AwsLambdaHandlerOptionsFor<TManifest, TPlugins, TBody>;

export type AwsLambdaHttpApiRouteUnaryHandlerOptionsFor<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteUnaryBody<TManifest> =
    RpcManifestRouteUnaryBody<TManifest>,
> = AwsLambdaHttpApiHandlerOptionsFor<TManifest, TPlugins, TBody>;

export type AwsLambdaHttpApiUnaryRouteHandlerOptionsFor<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteUnaryBody<TManifest> =
    RpcManifestRouteUnaryBody<TManifest>,
> = AwsLambdaHttpApiRouteUnaryHandlerOptionsFor<
  TManifest,
  TPlugins,
  TBody
>;

export type AwsLambdaHttpApiRouteStreamHandlerOptionsFor<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteStreamBody<TManifest> =
    RpcManifestRouteStreamBody<TManifest>,
> = AwsLambdaHttpApiHandlerOptionsFor<TManifest, TPlugins, TBody>;

export type AwsLambdaHttpApiStreamRouteHandlerOptionsFor<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteStreamBody<TManifest> =
    RpcManifestRouteStreamBody<TManifest>,
> = AwsLambdaHttpApiRouteStreamHandlerOptionsFor<
  TManifest,
  TPlugins,
  TBody
>;

export type AwsLambdaRouteUnaryHandlerOptionsFor<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteUnaryBody<TManifest> =
    RpcManifestRouteUnaryBody<TManifest>,
> = AwsLambdaHandlerOptionsFor<TManifest, TPlugins, TBody>;

export type AwsLambdaUnaryRouteHandlerOptionsFor<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteUnaryBody<TManifest> =
    RpcManifestRouteUnaryBody<TManifest>,
> = AwsLambdaRouteUnaryHandlerOptionsFor<TManifest, TPlugins, TBody>;

export type AwsLambdaRouteStreamHandlerOptionsFor<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteStreamBody<TManifest> =
    RpcManifestRouteStreamBody<TManifest>,
> = AwsLambdaHandlerOptionsFor<TManifest, TPlugins, TBody>;

export type AwsLambdaStreamRouteHandlerOptionsFor<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteStreamBody<TManifest> =
    RpcManifestRouteStreamBody<TManifest>,
> = AwsLambdaRouteStreamHandlerOptionsFor<TManifest, TPlugins, TBody>;

export type AwsLambdaHandlerOptionsArgs<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestBody<TManifest> = RpcManifestBody<TManifest>,
> = HandlerOptionsArgs<TManifest, TPlugins, TBody>;

export type AwsLambdaHttpApiHandlerOptionsArgs<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestBody<TManifest> = RpcManifestBody<TManifest>,
> = AwsLambdaHandlerOptionsArgs<TManifest, TPlugins, TBody>;

export type AwsLambdaHttpApiRouteUnaryHandlerOptionsArgs<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteUnaryBody<TManifest> =
    RpcManifestRouteUnaryBody<TManifest>,
> = AwsLambdaHttpApiHandlerOptionsArgs<TManifest, TPlugins, TBody>;

export type AwsLambdaHttpApiUnaryRouteHandlerOptionsArgs<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteUnaryBody<TManifest> =
    RpcManifestRouteUnaryBody<TManifest>,
> = AwsLambdaHttpApiRouteUnaryHandlerOptionsArgs<
  TManifest,
  TPlugins,
  TBody
>;

export type AwsLambdaHttpApiRouteStreamHandlerOptionsArgs<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteStreamBody<TManifest> =
    RpcManifestRouteStreamBody<TManifest>,
> = AwsLambdaHttpApiHandlerOptionsArgs<TManifest, TPlugins, TBody>;

export type AwsLambdaHttpApiStreamRouteHandlerOptionsArgs<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteStreamBody<TManifest> =
    RpcManifestRouteStreamBody<TManifest>,
> = AwsLambdaHttpApiRouteStreamHandlerOptionsArgs<
  TManifest,
  TPlugins,
  TBody
>;

export type AwsLambdaRouteUnaryHandlerOptionsArgs<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteUnaryBody<TManifest> =
    RpcManifestRouteUnaryBody<TManifest>,
> = AwsLambdaHandlerOptionsArgs<TManifest, TPlugins, TBody>;

export type AwsLambdaUnaryRouteHandlerOptionsArgs<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteUnaryBody<TManifest> =
    RpcManifestRouteUnaryBody<TManifest>,
> = AwsLambdaRouteUnaryHandlerOptionsArgs<TManifest, TPlugins, TBody>;

export type AwsLambdaRouteStreamHandlerOptionsArgs<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteStreamBody<TManifest> =
    RpcManifestRouteStreamBody<TManifest>,
> = AwsLambdaHandlerOptionsArgs<TManifest, TPlugins, TBody>;

export type AwsLambdaStreamRouteHandlerOptionsArgs<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteStreamBody<TManifest> =
    RpcManifestRouteStreamBody<TManifest>,
> = AwsLambdaRouteStreamHandlerOptionsArgs<TManifest, TPlugins, TBody>;

export type AwsLambdaRestApiHandlerOptionsFor<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestBody<TManifest> = RpcManifestBody<TManifest>,
> = HandlerOptionsFor<TManifest, TPlugins, TBody>;

export type AwsLambdaRestApiRouteUnaryHandlerOptionsFor<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteUnaryBody<TManifest> =
    RpcManifestRouteUnaryBody<TManifest>,
> = AwsLambdaRestApiHandlerOptionsFor<TManifest, TPlugins, TBody>;

export type AwsLambdaRestApiUnaryRouteHandlerOptionsFor<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteUnaryBody<TManifest> =
    RpcManifestRouteUnaryBody<TManifest>,
> = AwsLambdaRestApiRouteUnaryHandlerOptionsFor<TManifest, TPlugins, TBody>;

export type AwsLambdaRestApiRouteStreamHandlerOptionsFor<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteStreamBody<TManifest> =
    RpcManifestRouteStreamBody<TManifest>,
> = AwsLambdaRestApiHandlerOptionsFor<TManifest, TPlugins, TBody>;

export type AwsLambdaRestApiStreamRouteHandlerOptionsFor<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteStreamBody<TManifest> =
    RpcManifestRouteStreamBody<TManifest>,
> = AwsLambdaRestApiRouteStreamHandlerOptionsFor<TManifest, TPlugins, TBody>;

export type AwsLambdaRestApiHandlerOptionsArgs<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestBody<TManifest> = RpcManifestBody<TManifest>,
> = HandlerOptionsArgs<TManifest, TPlugins, TBody>;

export type AwsLambdaRestApiRouteUnaryHandlerOptionsArgs<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteUnaryBody<TManifest> =
    RpcManifestRouteUnaryBody<TManifest>,
> = AwsLambdaRestApiHandlerOptionsArgs<TManifest, TPlugins, TBody>;

export type AwsLambdaRestApiUnaryRouteHandlerOptionsArgs<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteUnaryBody<TManifest> =
    RpcManifestRouteUnaryBody<TManifest>,
> = AwsLambdaRestApiRouteUnaryHandlerOptionsArgs<TManifest, TPlugins, TBody>;

export type AwsLambdaRestApiRouteStreamHandlerOptionsArgs<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteStreamBody<TManifest> =
    RpcManifestRouteStreamBody<TManifest>,
> = AwsLambdaRestApiHandlerOptionsArgs<TManifest, TPlugins, TBody>;

export type AwsLambdaRestApiStreamRouteHandlerOptionsArgs<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteStreamBody<TManifest> =
    RpcManifestRouteStreamBody<TManifest>,
> = AwsLambdaRestApiRouteStreamHandlerOptionsArgs<TManifest, TPlugins, TBody>;

const queryString = (
  single?: Record<string, string | undefined> | null,
  multi?: Record<string, readonly (string | undefined)[] | undefined> | null
): string => {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(single ?? {})) {
    if (value !== undefined) params.append(key, value);
  }
  for (const [key, values] of Object.entries(multi ?? {})) {
    if (values === undefined) continue;
    params.delete(key);
    for (const value of values) {
      if (value !== undefined) params.append(key, value);
    }
  }
  return params.toString();
};

const eventHeader = (
  event: Pick<AwsLambdaHttpEventV2 | AwsLambdaRestApiEventV1, 'headers'>,
  name: string
): string | undefined => {
  const wanted = name.toLowerCase();
  for (const [key, value] of Object.entries(event.headers ?? {})) {
    if (key.toLowerCase() === wanted) return value;
  }
  return undefined;
};

const eventUrl = (event: AwsLambdaHttpEventV2): string => {
  const protocol = eventHeader(event, 'x-forwarded-proto') ?? 'https';
  const host =
    eventHeader(event, 'host') ??
    event.requestContext?.domainName ??
    'localhost';
  const path = event.rawPath ?? '/';
  const query = event.rawQueryString;
  return `${protocol}://${host}${path}${query === undefined || query === '' ? '' : `?${query}`}`;
};

const restApiEventUrl = (event: AwsLambdaRestApiEventV1): string => {
  const protocol = eventHeader(event, 'x-forwarded-proto') ?? 'https';
  const host =
    eventHeader(event, 'host') ??
    event.requestContext?.domainName ??
    'localhost';
  const path = event.path ?? event.requestContext?.path ?? '/';
  const query = queryString(
    event.queryStringParameters,
    event.multiValueQueryStringParameters
  );
  return `${protocol}://${host}${path}${query === '' ? '' : `?${query}`}`;
};

const eventBody = (
  event: Pick<
    AwsLambdaHttpEventV2 | AwsLambdaRestApiEventV1,
    'body' | 'isBase64Encoded'
  >
): BodyInit | undefined => {
  if (event.body === undefined || event.body === null) return undefined;
  return event.isBase64Encoded ? Buffer.from(event.body, 'base64') : event.body;
};

const eventHeaders = (event: AwsLambdaHttpEventV2): Headers => {
  const headers = new Headers();
  for (const [key, value] of Object.entries(event.headers ?? {})) {
    if (value !== undefined) headers.set(key, value);
  }
  if (event.cookies !== undefined && !headers.has('cookie')) {
    headers.set('cookie', event.cookies.join('; '));
  }
  return headers;
};

const restApiEventHeaders = (event: AwsLambdaRestApiEventV1): Headers => {
  const headers = new Headers();
  for (const [key, value] of Object.entries(event.headers ?? {})) {
    if (value !== undefined) headers.set(key, value);
  }
  for (const [key, values] of Object.entries(event.multiValueHeaders ?? {})) {
    if (values === undefined) continue;
    const normalizedValues = values.filter(
      (value): value is string => value !== undefined
    );
    if (normalizedValues.length === 0) continue;
    headers.set(
      key,
      key.toLowerCase() === 'cookie'
        ? normalizedValues.join('; ')
        : normalizedValues.join(', ')
    );
  }
  return headers;
};

const eventToRequest = (event: AwsLambdaHttpEventV2): Request => {
  const body = eventBody(event);
  return new Request(eventUrl(event), {
    method: event.requestContext?.http?.method ?? 'GET',
    headers: eventHeaders(event),
    ...(body === undefined ? {} : { body }),
  });
};

const restApiEventToRequest = (event: AwsLambdaRestApiEventV1): Request => {
  const body = eventBody(event);
  return new Request(restApiEventUrl(event), {
    method: event.httpMethod ?? 'GET',
    headers: restApiEventHeaders(event),
    ...(body === undefined ? {} : { body }),
  });
};

const getSetCookies = (headers: Headers): string[] => {
  const withSetCookie = headers as Headers & {
    getSetCookie?: () => string[];
  };
  return withSetCookie.getSetCookie?.() ?? [];
};

const responseHeaders = (response: Response): Record<string, string> => {
  const headers: Record<string, string> = {};
  response.headers.forEach((value, key) => {
    if (key !== 'set-cookie') headers[key] = value;
  });
  return headers;
};

const responseToLambda = async (
  response: Response
): Promise<AwsLambdaHttpResponseV2> => {
  const cookies = getSetCookies(response.headers);
  return {
    statusCode: response.status,
    headers: responseHeaders(response),
    ...(cookies.length === 0 ? {} : { cookies }),
    body: await response.text(),
    isBase64Encoded: false,
  };
};

const responseToRestApiLambda = async (
  response: Response
): Promise<AwsLambdaRestApiResponseV1> => {
  const cookies = getSetCookies(response.headers);
  return {
    statusCode: response.status,
    headers: responseHeaders(response),
    ...(cookies.length === 0
      ? {}
      : { multiValueHeaders: { 'set-cookie': cookies } }),
    body: await response.text(),
    isBase64Encoded: false,
  };
};

const createFetch = <TManifest extends JoorManifest>(
  manifest: TManifest,
  options?: HandlerOptions
) =>
  createJoorHandler(manifest, (options ?? {}) as HandlerOptionsFor<TManifest>);

export function createAwsLambdaHandler<
  TManifest extends JoorManifest,
  const TPlugins extends readonly JoorPlugin<object>[] = readonly [],
>(
  manifest: TManifest,
  ...args: HandlerOptionsArgs<TManifest, TPlugins>
): AwsLambdaHandler;
export function createAwsLambdaHandler<TManifest extends JoorManifest>(
  manifest: TManifest,
  options?: HandlerOptions
): AwsLambdaHandler {
  const fetch = createFetch(manifest, options);
  return async (event) => responseToLambda(await fetch(eventToRequest(event)));
}

export function createAwsLambdaHttpApiHandler<
  TManifest extends JoorManifest,
  const TPlugins extends readonly JoorPlugin<object>[] = readonly [],
>(
  manifest: TManifest,
  ...args: HandlerOptionsArgs<TManifest, TPlugins>
): AwsLambdaHttpApiHandler;
export function createAwsLambdaHttpApiHandler<TManifest extends JoorManifest>(
  manifest: TManifest,
  options?: HandlerOptions
): AwsLambdaHttpApiHandler {
  const fetch = createFetch(manifest, options);
  return async (event) => responseToLambda(await fetch(eventToRequest(event)));
}

export function createAwsLambdaRestApiHandler<
  TManifest extends JoorManifest,
  const TPlugins extends readonly JoorPlugin<object>[] = readonly [],
>(
  manifest: TManifest,
  ...args: HandlerOptionsArgs<TManifest, TPlugins>
): AwsLambdaRestApiHandler;
export function createAwsLambdaRestApiHandler<TManifest extends JoorManifest>(
  manifest: TManifest,
  options?: HandlerOptions
): AwsLambdaRestApiHandler {
  const fetch = createFetch(manifest, options);
  return async (event) =>
    responseToRestApiLambda(await fetch(restApiEventToRequest(event)));
}
