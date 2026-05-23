import { Buffer } from 'node:buffer';
import type { JoorManifest } from '../manifest.js';
import type {
  HandlerOptions,
  HandlerOptionsArgs,
  HandlerOptionsFor,
  RpcManifestBody,
  RpcManifestRouteStreamBody,
  RpcManifestRouteUnaryBody,
} from '../rpc/dispatcher.js';
import type { JoorPlugin } from '../context/plugin.js';
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

export type AwsLambdaHandler = (
  event: AwsLambdaHttpEventV2
) => Promise<AwsLambdaHttpResponseV2>;

export type AwsLambdaHandlerOptionsFor<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestBody<TManifest> = RpcManifestBody<TManifest>,
> = HandlerOptionsFor<TManifest, TPlugins, TBody>;

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

const eventHeader = (
  event: AwsLambdaHttpEventV2,
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

const eventBody = (event: AwsLambdaHttpEventV2): BodyInit | undefined => {
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

const eventToRequest = (event: AwsLambdaHttpEventV2): Request => {
  const body = eventBody(event);
  return new Request(eventUrl(event), {
    method: event.requestContext?.http?.method ?? 'GET',
    headers: eventHeaders(event),
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
  const fetch = createJoorHandler(
    manifest,
    (options ?? {}) as HandlerOptionsFor<TManifest>
  );
  return async (event) => responseToLambda(await fetch(eventToRequest(event)));
}
