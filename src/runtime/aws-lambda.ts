import { Buffer } from 'node:buffer';
import type { JoorPlugin } from '../context/plugin.js';
import type { JoorManifest } from '../manifest.js';
import type {
  HandlerOptions,
  HandlerOptionsArgs,
  HandlerOptionsFor,
  RpcManifestBody,
  RpcManifestRequiredRuntimeRequest,
  RpcManifestRouteStreamHandlerOptionsArgs,
  RpcManifestRouteStreamHandlerOptionsFor,
  RpcManifestRouteStreamBody,
  RpcManifestRouteStreamRequiredRuntimeRequest,
  RpcManifestRouteUnaryHandlerOptionsArgs,
  RpcManifestRouteUnaryHandlerOptionsFor,
  RpcManifestRouteUnaryBody,
  RpcManifestRouteUnaryRequiredRuntimeRequest,
  RpcPath,
} from '../rpc/dispatcher.js';
import {
  createJoorHandler,
  createRouteStreamJoorHandler,
  createRouteUnaryJoorHandler,
} from './fetch.js';

export interface AwsLambdaHttpEventV2 {
  readonly version?: string;
  readonly rawPath?: RpcPath;
  readonly rawQueryString?: string;
  readonly headers?: Readonly<Record<string, string | undefined>>;
  readonly cookies?: readonly string[];
  readonly body?: string | null;
  readonly isBase64Encoded?: boolean;
  readonly requestContext?: {
    readonly domainName?: string;
    readonly http?: {
      readonly method?: string;
      readonly protocol?: string;
      readonly sourceIp?: string;
    };
  };
}

export interface AwsLambdaHttpResponseV2 {
  readonly statusCode: number;
  readonly headers?: Readonly<Record<string, string>>;
  readonly cookies?: readonly string[];
  readonly body?: string;
  readonly isBase64Encoded?: boolean;
}

export interface AwsLambdaRestApiEventV1 {
  readonly path?: RpcPath;
  readonly httpMethod?: string;
  readonly headers?: Readonly<Record<string, string | undefined>>;
  readonly multiValueHeaders?: Readonly<
    Record<string, readonly (string | undefined)[] | undefined>
  >;
  readonly queryStringParameters?: Readonly<
    Record<string, string | undefined>
  > | null;
  readonly multiValueQueryStringParameters?: Readonly<
    Record<string, readonly (string | undefined)[] | undefined>
  > | null;
  readonly body?: string | null;
  readonly isBase64Encoded?: boolean;
  readonly requestContext?: {
    readonly domainName?: string;
    readonly path?: RpcPath;
    readonly protocol?: string;
    readonly identity?: {
      readonly sourceIp?: string;
    };
  };
}

export interface AwsLambdaRestApiResponseV1 {
  readonly statusCode: number;
  readonly headers?: Readonly<Record<string, string>>;
  readonly multiValueHeaders?: Readonly<Record<string, readonly string[]>>;
  readonly body?: string;
  readonly isBase64Encoded?: boolean;
}

export type AwsLambdaHandler<
  TEvent extends AwsLambdaHttpEventV2 = AwsLambdaHttpEventV2,
> = (
  event: TEvent
) => AwsLambdaHttpResponseV2 | Promise<AwsLambdaHttpResponseV2>;

export type AwsLambdaHttpApiHandler<
  TEvent extends AwsLambdaHttpEventV2 = AwsLambdaHttpEventV2,
> = AwsLambdaHandler<TEvent>;

export type AwsLambdaRestApiHandler<
  TEvent extends AwsLambdaRestApiEventV1 = AwsLambdaRestApiEventV1,
> = (
  event: TEvent
) => AwsLambdaRestApiResponseV1 | Promise<AwsLambdaRestApiResponseV1>;

export type AwsLambdaHandlerOptionsFor<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestBody<TManifest> = RpcManifestBody<TManifest>,
  TRequest extends Request = RpcManifestRequiredRuntimeRequest<TManifest>,
> = HandlerOptionsFor<TManifest, TPlugins, TBody, TRequest>;

export type AwsLambdaHttpApiHandlerOptionsFor<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestBody<TManifest> = RpcManifestBody<TManifest>,
  TRequest extends Request = RpcManifestRequiredRuntimeRequest<TManifest>,
> = AwsLambdaHandlerOptionsFor<TManifest, TPlugins, TBody, TRequest>;

export type AwsLambdaHttpApiRouteUnaryHandlerOptionsFor<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteUnaryBody<TManifest> =
    RpcManifestRouteUnaryBody<TManifest>,
  TRequest extends Request =
    RpcManifestRouteUnaryRequiredRuntimeRequest<TManifest>,
> = RpcManifestRouteUnaryHandlerOptionsFor<
  TManifest,
  TPlugins,
  TBody,
  TRequest
>;

export type AwsLambdaHttpApiUnaryRouteHandlerOptionsFor<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteUnaryBody<TManifest> =
    RpcManifestRouteUnaryBody<TManifest>,
  TRequest extends Request =
    RpcManifestRouteUnaryRequiredRuntimeRequest<TManifest>,
> = AwsLambdaHttpApiRouteUnaryHandlerOptionsFor<
  TManifest,
  TPlugins,
  TBody,
  TRequest
>;

export type AwsLambdaHttpApiUnaryHandlerOptionsFor<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteUnaryBody<TManifest> =
    RpcManifestRouteUnaryBody<TManifest>,
  TRequest extends Request =
    RpcManifestRouteUnaryRequiredRuntimeRequest<TManifest>,
> = AwsLambdaHttpApiRouteUnaryHandlerOptionsFor<
  TManifest,
  TPlugins,
  TBody,
  TRequest
>;

export type AwsLambdaHttpApiRouteStreamHandlerOptionsFor<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteStreamBody<TManifest> =
    RpcManifestRouteStreamBody<TManifest>,
  TRequest extends Request =
    RpcManifestRouteStreamRequiredRuntimeRequest<TManifest>,
> = RpcManifestRouteStreamHandlerOptionsFor<
  TManifest,
  TPlugins,
  TBody,
  TRequest
>;

export type AwsLambdaHttpApiStreamRouteHandlerOptionsFor<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteStreamBody<TManifest> =
    RpcManifestRouteStreamBody<TManifest>,
  TRequest extends Request =
    RpcManifestRouteStreamRequiredRuntimeRequest<TManifest>,
> = AwsLambdaHttpApiRouteStreamHandlerOptionsFor<
  TManifest,
  TPlugins,
  TBody,
  TRequest
>;

export type AwsLambdaHttpApiStreamHandlerOptionsFor<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteStreamBody<TManifest> =
    RpcManifestRouteStreamBody<TManifest>,
  TRequest extends Request =
    RpcManifestRouteStreamRequiredRuntimeRequest<TManifest>,
> = AwsLambdaHttpApiRouteStreamHandlerOptionsFor<
  TManifest,
  TPlugins,
  TBody,
  TRequest
>;

export type AwsLambdaRouteUnaryHandlerOptionsFor<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteUnaryBody<TManifest> =
    RpcManifestRouteUnaryBody<TManifest>,
  TRequest extends Request =
    RpcManifestRouteUnaryRequiredRuntimeRequest<TManifest>,
> = RpcManifestRouteUnaryHandlerOptionsFor<
  TManifest,
  TPlugins,
  TBody,
  TRequest
>;

export type AwsLambdaUnaryRouteHandlerOptionsFor<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteUnaryBody<TManifest> =
    RpcManifestRouteUnaryBody<TManifest>,
  TRequest extends Request =
    RpcManifestRouteUnaryRequiredRuntimeRequest<TManifest>,
> = AwsLambdaRouteUnaryHandlerOptionsFor<TManifest, TPlugins, TBody, TRequest>;

export type AwsLambdaUnaryHandlerOptionsFor<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteUnaryBody<TManifest> =
    RpcManifestRouteUnaryBody<TManifest>,
  TRequest extends Request =
    RpcManifestRouteUnaryRequiredRuntimeRequest<TManifest>,
> = AwsLambdaRouteUnaryHandlerOptionsFor<TManifest, TPlugins, TBody, TRequest>;

export type AwsLambdaRouteStreamHandlerOptionsFor<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteStreamBody<TManifest> =
    RpcManifestRouteStreamBody<TManifest>,
  TRequest extends Request =
    RpcManifestRouteStreamRequiredRuntimeRequest<TManifest>,
> = RpcManifestRouteStreamHandlerOptionsFor<
  TManifest,
  TPlugins,
  TBody,
  TRequest
>;

export type AwsLambdaStreamRouteHandlerOptionsFor<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteStreamBody<TManifest> =
    RpcManifestRouteStreamBody<TManifest>,
  TRequest extends Request =
    RpcManifestRouteStreamRequiredRuntimeRequest<TManifest>,
> = AwsLambdaRouteStreamHandlerOptionsFor<TManifest, TPlugins, TBody, TRequest>;

export type AwsLambdaStreamHandlerOptionsFor<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteStreamBody<TManifest> =
    RpcManifestRouteStreamBody<TManifest>,
  TRequest extends Request =
    RpcManifestRouteStreamRequiredRuntimeRequest<TManifest>,
> = AwsLambdaRouteStreamHandlerOptionsFor<TManifest, TPlugins, TBody, TRequest>;

export type AwsLambdaHandlerOptionsArgs<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestBody<TManifest> = RpcManifestBody<TManifest>,
  TRequest extends Request = RpcManifestRequiredRuntimeRequest<TManifest>,
> = HandlerOptionsArgs<TManifest, TPlugins, TBody, TRequest>;

export type AwsLambdaHttpApiHandlerOptionsArgs<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestBody<TManifest> = RpcManifestBody<TManifest>,
  TRequest extends Request = RpcManifestRequiredRuntimeRequest<TManifest>,
> = AwsLambdaHandlerOptionsArgs<TManifest, TPlugins, TBody, TRequest>;

export type AwsLambdaHttpApiRouteUnaryHandlerOptionsArgs<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteUnaryBody<TManifest> =
    RpcManifestRouteUnaryBody<TManifest>,
  TRequest extends Request =
    RpcManifestRouteUnaryRequiredRuntimeRequest<TManifest>,
> = RpcManifestRouteUnaryHandlerOptionsArgs<
  TManifest,
  TPlugins,
  TBody,
  TRequest
>;

export type AwsLambdaHttpApiUnaryRouteHandlerOptionsArgs<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteUnaryBody<TManifest> =
    RpcManifestRouteUnaryBody<TManifest>,
  TRequest extends Request =
    RpcManifestRouteUnaryRequiredRuntimeRequest<TManifest>,
> = AwsLambdaHttpApiRouteUnaryHandlerOptionsArgs<
  TManifest,
  TPlugins,
  TBody,
  TRequest
>;

export type AwsLambdaHttpApiUnaryHandlerOptionsArgs<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteUnaryBody<TManifest> =
    RpcManifestRouteUnaryBody<TManifest>,
  TRequest extends Request =
    RpcManifestRouteUnaryRequiredRuntimeRequest<TManifest>,
> = AwsLambdaHttpApiRouteUnaryHandlerOptionsArgs<
  TManifest,
  TPlugins,
  TBody,
  TRequest
>;

export type AwsLambdaHttpApiRouteStreamHandlerOptionsArgs<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteStreamBody<TManifest> =
    RpcManifestRouteStreamBody<TManifest>,
  TRequest extends Request =
    RpcManifestRouteStreamRequiredRuntimeRequest<TManifest>,
> = RpcManifestRouteStreamHandlerOptionsArgs<
  TManifest,
  TPlugins,
  TBody,
  TRequest
>;

export type AwsLambdaHttpApiStreamRouteHandlerOptionsArgs<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteStreamBody<TManifest> =
    RpcManifestRouteStreamBody<TManifest>,
  TRequest extends Request =
    RpcManifestRouteStreamRequiredRuntimeRequest<TManifest>,
> = AwsLambdaHttpApiRouteStreamHandlerOptionsArgs<
  TManifest,
  TPlugins,
  TBody,
  TRequest
>;

export type AwsLambdaHttpApiStreamHandlerOptionsArgs<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteStreamBody<TManifest> =
    RpcManifestRouteStreamBody<TManifest>,
  TRequest extends Request =
    RpcManifestRouteStreamRequiredRuntimeRequest<TManifest>,
> = AwsLambdaHttpApiRouteStreamHandlerOptionsArgs<
  TManifest,
  TPlugins,
  TBody,
  TRequest
>;

export type AwsLambdaRouteUnaryHandlerOptionsArgs<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteUnaryBody<TManifest> =
    RpcManifestRouteUnaryBody<TManifest>,
  TRequest extends Request =
    RpcManifestRouteUnaryRequiredRuntimeRequest<TManifest>,
> = RpcManifestRouteUnaryHandlerOptionsArgs<
  TManifest,
  TPlugins,
  TBody,
  TRequest
>;

export type AwsLambdaUnaryRouteHandlerOptionsArgs<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteUnaryBody<TManifest> =
    RpcManifestRouteUnaryBody<TManifest>,
  TRequest extends Request =
    RpcManifestRouteUnaryRequiredRuntimeRequest<TManifest>,
> = AwsLambdaRouteUnaryHandlerOptionsArgs<TManifest, TPlugins, TBody, TRequest>;

export type AwsLambdaUnaryHandlerOptionsArgs<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteUnaryBody<TManifest> =
    RpcManifestRouteUnaryBody<TManifest>,
  TRequest extends Request =
    RpcManifestRouteUnaryRequiredRuntimeRequest<TManifest>,
> = AwsLambdaRouteUnaryHandlerOptionsArgs<TManifest, TPlugins, TBody, TRequest>;

export type AwsLambdaRouteStreamHandlerOptionsArgs<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteStreamBody<TManifest> =
    RpcManifestRouteStreamBody<TManifest>,
  TRequest extends Request =
    RpcManifestRouteStreamRequiredRuntimeRequest<TManifest>,
> = RpcManifestRouteStreamHandlerOptionsArgs<
  TManifest,
  TPlugins,
  TBody,
  TRequest
>;

export type AwsLambdaStreamRouteHandlerOptionsArgs<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteStreamBody<TManifest> =
    RpcManifestRouteStreamBody<TManifest>,
  TRequest extends Request =
    RpcManifestRouteStreamRequiredRuntimeRequest<TManifest>,
> = AwsLambdaRouteStreamHandlerOptionsArgs<
  TManifest,
  TPlugins,
  TBody,
  TRequest
>;

export type AwsLambdaStreamHandlerOptionsArgs<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteStreamBody<TManifest> =
    RpcManifestRouteStreamBody<TManifest>,
  TRequest extends Request =
    RpcManifestRouteStreamRequiredRuntimeRequest<TManifest>,
> = AwsLambdaRouteStreamHandlerOptionsArgs<
  TManifest,
  TPlugins,
  TBody,
  TRequest
>;

export type AwsLambdaRestApiHandlerOptionsFor<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestBody<TManifest> = RpcManifestBody<TManifest>,
  TRequest extends Request = RpcManifestRequiredRuntimeRequest<TManifest>,
> = HandlerOptionsFor<TManifest, TPlugins, TBody, TRequest>;

export type AwsLambdaRestApiRouteUnaryHandlerOptionsFor<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteUnaryBody<TManifest> =
    RpcManifestRouteUnaryBody<TManifest>,
  TRequest extends Request =
    RpcManifestRouteUnaryRequiredRuntimeRequest<TManifest>,
> = RpcManifestRouteUnaryHandlerOptionsFor<
  TManifest,
  TPlugins,
  TBody,
  TRequest
>;

export type AwsLambdaRestApiUnaryRouteHandlerOptionsFor<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteUnaryBody<TManifest> =
    RpcManifestRouteUnaryBody<TManifest>,
  TRequest extends Request =
    RpcManifestRouteUnaryRequiredRuntimeRequest<TManifest>,
> = AwsLambdaRestApiRouteUnaryHandlerOptionsFor<
  TManifest,
  TPlugins,
  TBody,
  TRequest
>;

export type AwsLambdaRestApiUnaryHandlerOptionsFor<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteUnaryBody<TManifest> =
    RpcManifestRouteUnaryBody<TManifest>,
  TRequest extends Request =
    RpcManifestRouteUnaryRequiredRuntimeRequest<TManifest>,
> = AwsLambdaRestApiRouteUnaryHandlerOptionsFor<
  TManifest,
  TPlugins,
  TBody,
  TRequest
>;

export type AwsLambdaRestApiRouteStreamHandlerOptionsFor<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteStreamBody<TManifest> =
    RpcManifestRouteStreamBody<TManifest>,
  TRequest extends Request =
    RpcManifestRouteStreamRequiredRuntimeRequest<TManifest>,
> = RpcManifestRouteStreamHandlerOptionsFor<
  TManifest,
  TPlugins,
  TBody,
  TRequest
>;

export type AwsLambdaRestApiStreamRouteHandlerOptionsFor<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteStreamBody<TManifest> =
    RpcManifestRouteStreamBody<TManifest>,
  TRequest extends Request =
    RpcManifestRouteStreamRequiredRuntimeRequest<TManifest>,
> = AwsLambdaRestApiRouteStreamHandlerOptionsFor<
  TManifest,
  TPlugins,
  TBody,
  TRequest
>;

export type AwsLambdaRestApiStreamHandlerOptionsFor<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteStreamBody<TManifest> =
    RpcManifestRouteStreamBody<TManifest>,
  TRequest extends Request =
    RpcManifestRouteStreamRequiredRuntimeRequest<TManifest>,
> = AwsLambdaRestApiRouteStreamHandlerOptionsFor<
  TManifest,
  TPlugins,
  TBody,
  TRequest
>;

export type AwsLambdaRestApiHandlerOptionsArgs<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestBody<TManifest> = RpcManifestBody<TManifest>,
  TRequest extends Request = RpcManifestRequiredRuntimeRequest<TManifest>,
> = HandlerOptionsArgs<TManifest, TPlugins, TBody, TRequest>;

export type AwsLambdaRestApiRouteUnaryHandlerOptionsArgs<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteUnaryBody<TManifest> =
    RpcManifestRouteUnaryBody<TManifest>,
  TRequest extends Request =
    RpcManifestRouteUnaryRequiredRuntimeRequest<TManifest>,
> = RpcManifestRouteUnaryHandlerOptionsArgs<
  TManifest,
  TPlugins,
  TBody,
  TRequest
>;

export type AwsLambdaRestApiUnaryRouteHandlerOptionsArgs<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteUnaryBody<TManifest> =
    RpcManifestRouteUnaryBody<TManifest>,
  TRequest extends Request =
    RpcManifestRouteUnaryRequiredRuntimeRequest<TManifest>,
> = AwsLambdaRestApiRouteUnaryHandlerOptionsArgs<
  TManifest,
  TPlugins,
  TBody,
  TRequest
>;

export type AwsLambdaRestApiUnaryHandlerOptionsArgs<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteUnaryBody<TManifest> =
    RpcManifestRouteUnaryBody<TManifest>,
  TRequest extends Request =
    RpcManifestRouteUnaryRequiredRuntimeRequest<TManifest>,
> = AwsLambdaRestApiRouteUnaryHandlerOptionsArgs<
  TManifest,
  TPlugins,
  TBody,
  TRequest
>;

export type AwsLambdaRestApiRouteStreamHandlerOptionsArgs<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteStreamBody<TManifest> =
    RpcManifestRouteStreamBody<TManifest>,
  TRequest extends Request =
    RpcManifestRouteStreamRequiredRuntimeRequest<TManifest>,
> = RpcManifestRouteStreamHandlerOptionsArgs<
  TManifest,
  TPlugins,
  TBody,
  TRequest
>;

export type AwsLambdaRestApiStreamRouteHandlerOptionsArgs<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteStreamBody<TManifest> =
    RpcManifestRouteStreamBody<TManifest>,
  TRequest extends Request =
    RpcManifestRouteStreamRequiredRuntimeRequest<TManifest>,
> = AwsLambdaRestApiRouteStreamHandlerOptionsArgs<
  TManifest,
  TPlugins,
  TBody,
  TRequest
>;

export type AwsLambdaRestApiStreamHandlerOptionsArgs<
  TManifest extends JoorManifest,
  TPlugins extends readonly JoorPlugin<object>[] =
    readonly JoorPlugin<object>[],
  TBody extends RpcManifestRouteStreamBody<TManifest> =
    RpcManifestRouteStreamBody<TManifest>,
  TRequest extends Request =
    RpcManifestRouteStreamRequiredRuntimeRequest<TManifest>,
> = AwsLambdaRestApiRouteStreamHandlerOptionsArgs<
  TManifest,
  TPlugins,
  TBody,
  TRequest
>;

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

const createFetch = <
  TManifest extends JoorManifest,
  TBody extends RpcManifestBody<TManifest> = RpcManifestBody<TManifest>,
>(
  manifest: TManifest,
  options?: HandlerOptions
) =>
  createJoorHandler(
    manifest,
    (options ?? {}) as unknown as HandlerOptionsFor<
      TManifest,
      readonly JoorPlugin<object>[],
      TBody,
      Request
    >
  );

const createRouteUnaryFetch = <TManifest extends JoorManifest>(
  manifest: TManifest,
  options?: HandlerOptions
) =>
  createRouteUnaryJoorHandler(
    manifest,
    (options ?? {}) as unknown as RpcManifestRouteUnaryHandlerOptionsFor<
      TManifest,
      readonly JoorPlugin<object>[],
      RpcManifestRouteUnaryBody<TManifest>,
      Request
    >
  );

const createRouteStreamFetch = <TManifest extends JoorManifest>(
  manifest: TManifest,
  options?: HandlerOptions
) =>
  createRouteStreamJoorHandler(
    manifest,
    (options ?? {}) as unknown as RpcManifestRouteStreamHandlerOptionsFor<
      TManifest,
      readonly JoorPlugin<object>[],
      RpcManifestRouteStreamBody<TManifest>,
      Request
    >
  );

export function createAwsLambdaHandler<
  TManifest extends JoorManifest,
  const TPlugins extends readonly JoorPlugin<object>[] = readonly [],
  TRequest extends Request = RpcManifestRequiredRuntimeRequest<TManifest>,
>(
  manifest: TManifest,
  ...args: HandlerOptionsArgs<
    TManifest,
    TPlugins,
    RpcManifestBody<TManifest>,
    TRequest
  >
): AwsLambdaHandler;
export function createAwsLambdaHandler<TManifest extends JoorManifest>(
  manifest: TManifest,
  options?: HandlerOptions
): AwsLambdaHandler {
  const fetch = createFetch(manifest, options);
  return async (event) => responseToLambda(await fetch(eventToRequest(event)));
}

export function createRouteUnaryAwsLambdaHandler<
  TManifest extends JoorManifest,
  const TPlugins extends readonly JoorPlugin<object>[] = readonly [],
  TRequest extends Request =
    RpcManifestRouteUnaryRequiredRuntimeRequest<TManifest>,
>(
  manifest: TManifest,
  ...args: AwsLambdaRouteUnaryHandlerOptionsArgs<
    TManifest,
    TPlugins,
    RpcManifestRouteUnaryBody<TManifest>,
    TRequest
  >
): AwsLambdaHandler;
export function createRouteUnaryAwsLambdaHandler<
  TManifest extends JoorManifest,
>(manifest: TManifest, options?: HandlerOptions): AwsLambdaHandler {
  const fetch = createRouteUnaryFetch(manifest, options);
  return async (event) => responseToLambda(await fetch(eventToRequest(event)));
}

export const createUnaryRouteAwsLambdaHandler: typeof createRouteUnaryAwsLambdaHandler =
  createRouteUnaryAwsLambdaHandler;

export const createUnaryAwsLambdaHandler: typeof createRouteUnaryAwsLambdaHandler =
  createRouteUnaryAwsLambdaHandler;

export function createRouteStreamAwsLambdaHandler<
  TManifest extends JoorManifest,
  const TPlugins extends readonly JoorPlugin<object>[] = readonly [],
  TRequest extends Request =
    RpcManifestRouteStreamRequiredRuntimeRequest<TManifest>,
>(
  manifest: TManifest,
  ...args: AwsLambdaRouteStreamHandlerOptionsArgs<
    TManifest,
    TPlugins,
    RpcManifestRouteStreamBody<TManifest>,
    TRequest
  >
): AwsLambdaHandler;
export function createRouteStreamAwsLambdaHandler<
  TManifest extends JoorManifest,
>(manifest: TManifest, options?: HandlerOptions): AwsLambdaHandler {
  const fetch = createRouteStreamFetch(manifest, options);
  return async (event) => responseToLambda(await fetch(eventToRequest(event)));
}

export const createStreamRouteAwsLambdaHandler: typeof createRouteStreamAwsLambdaHandler =
  createRouteStreamAwsLambdaHandler;

export const createStreamAwsLambdaHandler: typeof createRouteStreamAwsLambdaHandler =
  createRouteStreamAwsLambdaHandler;

export const createAwsLambdaHandlerFor =
  <TEvent extends AwsLambdaHttpEventV2>() =>
  <
    TManifest extends JoorManifest,
    const TPlugins extends readonly JoorPlugin<object>[] = readonly [],
    TRequest extends Request = RpcManifestRequiredRuntimeRequest<TManifest>,
  >(
    manifest: TManifest,
    ...args: AwsLambdaHandlerOptionsArgs<
      TManifest,
      TPlugins,
      RpcManifestBody<TManifest>,
      TRequest
    >
  ): AwsLambdaHandler<TEvent> => {
    const fetch = createFetch(manifest, (args[0] ?? {}) as HandlerOptions);
    return async (event) =>
      responseToLambda(await fetch(eventToRequest(event)));
  };

export const createRouteUnaryAwsLambdaHandlerFor =
  <TEvent extends AwsLambdaHttpEventV2>() =>
  <
    TManifest extends JoorManifest,
    const TPlugins extends readonly JoorPlugin<object>[] = readonly [],
    TRequest extends Request =
      RpcManifestRouteUnaryRequiredRuntimeRequest<TManifest>,
  >(
    manifest: TManifest,
    ...args: AwsLambdaRouteUnaryHandlerOptionsArgs<
      TManifest,
      TPlugins,
      RpcManifestRouteUnaryBody<TManifest>,
      TRequest
    >
  ): AwsLambdaHandler<TEvent> => {
    const fetch = createRouteUnaryFetch(
      manifest,
      (args[0] ?? {}) as HandlerOptions
    );
    return async (event) =>
      responseToLambda(await fetch(eventToRequest(event)));
  };

export const createUnaryRouteAwsLambdaHandlerFor: typeof createRouteUnaryAwsLambdaHandlerFor =
  createRouteUnaryAwsLambdaHandlerFor;

export const createUnaryAwsLambdaHandlerFor: typeof createRouteUnaryAwsLambdaHandlerFor =
  createRouteUnaryAwsLambdaHandlerFor;

export const createRouteStreamAwsLambdaHandlerFor =
  <TEvent extends AwsLambdaHttpEventV2>() =>
  <
    TManifest extends JoorManifest,
    const TPlugins extends readonly JoorPlugin<object>[] = readonly [],
    TRequest extends Request =
      RpcManifestRouteStreamRequiredRuntimeRequest<TManifest>,
  >(
    manifest: TManifest,
    ...args: AwsLambdaRouteStreamHandlerOptionsArgs<
      TManifest,
      TPlugins,
      RpcManifestRouteStreamBody<TManifest>,
      TRequest
    >
  ): AwsLambdaHandler<TEvent> => {
    const fetch = createRouteStreamFetch(
      manifest,
      (args[0] ?? {}) as HandlerOptions
    );
    return async (event) =>
      responseToLambda(await fetch(eventToRequest(event)));
  };

export const createStreamRouteAwsLambdaHandlerFor: typeof createRouteStreamAwsLambdaHandlerFor =
  createRouteStreamAwsLambdaHandlerFor;

export const createStreamAwsLambdaHandlerFor: typeof createRouteStreamAwsLambdaHandlerFor =
  createRouteStreamAwsLambdaHandlerFor;

export function createAwsLambdaHttpApiHandler<
  TManifest extends JoorManifest,
  const TPlugins extends readonly JoorPlugin<object>[] = readonly [],
  TRequest extends Request = RpcManifestRequiredRuntimeRequest<TManifest>,
>(
  manifest: TManifest,
  ...args: HandlerOptionsArgs<
    TManifest,
    TPlugins,
    RpcManifestBody<TManifest>,
    TRequest
  >
): AwsLambdaHttpApiHandler;
export function createAwsLambdaHttpApiHandler<TManifest extends JoorManifest>(
  manifest: TManifest,
  options?: HandlerOptions
): AwsLambdaHttpApiHandler {
  const fetch = createFetch(manifest, options);
  return async (event) => responseToLambda(await fetch(eventToRequest(event)));
}

export function createRouteUnaryAwsLambdaHttpApiHandler<
  TManifest extends JoorManifest,
  const TPlugins extends readonly JoorPlugin<object>[] = readonly [],
  TRequest extends Request =
    RpcManifestRouteUnaryRequiredRuntimeRequest<TManifest>,
>(
  manifest: TManifest,
  ...args: AwsLambdaHttpApiRouteUnaryHandlerOptionsArgs<
    TManifest,
    TPlugins,
    RpcManifestRouteUnaryBody<TManifest>,
    TRequest
  >
): AwsLambdaHttpApiHandler;
export function createRouteUnaryAwsLambdaHttpApiHandler<
  TManifest extends JoorManifest,
>(manifest: TManifest, options?: HandlerOptions): AwsLambdaHttpApiHandler {
  const fetch = createRouteUnaryFetch(manifest, options);
  return async (event) => responseToLambda(await fetch(eventToRequest(event)));
}

export const createUnaryRouteAwsLambdaHttpApiHandler: typeof createRouteUnaryAwsLambdaHttpApiHandler =
  createRouteUnaryAwsLambdaHttpApiHandler;

export const createUnaryAwsLambdaHttpApiHandler: typeof createRouteUnaryAwsLambdaHttpApiHandler =
  createRouteUnaryAwsLambdaHttpApiHandler;

export function createRouteStreamAwsLambdaHttpApiHandler<
  TManifest extends JoorManifest,
  const TPlugins extends readonly JoorPlugin<object>[] = readonly [],
  TRequest extends Request =
    RpcManifestRouteStreamRequiredRuntimeRequest<TManifest>,
>(
  manifest: TManifest,
  ...args: AwsLambdaHttpApiRouteStreamHandlerOptionsArgs<
    TManifest,
    TPlugins,
    RpcManifestRouteStreamBody<TManifest>,
    TRequest
  >
): AwsLambdaHttpApiHandler;
export function createRouteStreamAwsLambdaHttpApiHandler<
  TManifest extends JoorManifest,
>(manifest: TManifest, options?: HandlerOptions): AwsLambdaHttpApiHandler {
  const fetch = createRouteStreamFetch(manifest, options);
  return async (event) => responseToLambda(await fetch(eventToRequest(event)));
}

export const createStreamRouteAwsLambdaHttpApiHandler: typeof createRouteStreamAwsLambdaHttpApiHandler =
  createRouteStreamAwsLambdaHttpApiHandler;

export const createStreamAwsLambdaHttpApiHandler: typeof createRouteStreamAwsLambdaHttpApiHandler =
  createRouteStreamAwsLambdaHttpApiHandler;

export const createAwsLambdaHttpApiHandlerFor =
  <TEvent extends AwsLambdaHttpEventV2>() =>
  <
    TManifest extends JoorManifest,
    const TPlugins extends readonly JoorPlugin<object>[] = readonly [],
    TRequest extends Request = RpcManifestRequiredRuntimeRequest<TManifest>,
  >(
    manifest: TManifest,
    ...args: AwsLambdaHttpApiHandlerOptionsArgs<
      TManifest,
      TPlugins,
      RpcManifestBody<TManifest>,
      TRequest
    >
  ): AwsLambdaHttpApiHandler<TEvent> => {
    const fetch = createFetch(manifest, (args[0] ?? {}) as HandlerOptions);
    return async (event) =>
      responseToLambda(await fetch(eventToRequest(event)));
  };

export const createRouteUnaryAwsLambdaHttpApiHandlerFor =
  <TEvent extends AwsLambdaHttpEventV2>() =>
  <
    TManifest extends JoorManifest,
    const TPlugins extends readonly JoorPlugin<object>[] = readonly [],
    TRequest extends Request =
      RpcManifestRouteUnaryRequiredRuntimeRequest<TManifest>,
  >(
    manifest: TManifest,
    ...args: AwsLambdaHttpApiRouteUnaryHandlerOptionsArgs<
      TManifest,
      TPlugins,
      RpcManifestRouteUnaryBody<TManifest>,
      TRequest
    >
  ): AwsLambdaHttpApiHandler<TEvent> => {
    const fetch = createRouteUnaryFetch(
      manifest,
      (args[0] ?? {}) as HandlerOptions
    );
    return async (event) =>
      responseToLambda(await fetch(eventToRequest(event)));
  };

export const createUnaryRouteAwsLambdaHttpApiHandlerFor: typeof createRouteUnaryAwsLambdaHttpApiHandlerFor =
  createRouteUnaryAwsLambdaHttpApiHandlerFor;

export const createUnaryAwsLambdaHttpApiHandlerFor: typeof createRouteUnaryAwsLambdaHttpApiHandlerFor =
  createRouteUnaryAwsLambdaHttpApiHandlerFor;

export const createRouteStreamAwsLambdaHttpApiHandlerFor =
  <TEvent extends AwsLambdaHttpEventV2>() =>
  <
    TManifest extends JoorManifest,
    const TPlugins extends readonly JoorPlugin<object>[] = readonly [],
    TRequest extends Request =
      RpcManifestRouteStreamRequiredRuntimeRequest<TManifest>,
  >(
    manifest: TManifest,
    ...args: AwsLambdaHttpApiRouteStreamHandlerOptionsArgs<
      TManifest,
      TPlugins,
      RpcManifestRouteStreamBody<TManifest>,
      TRequest
    >
  ): AwsLambdaHttpApiHandler<TEvent> => {
    const fetch = createRouteStreamFetch(
      manifest,
      (args[0] ?? {}) as HandlerOptions
    );
    return async (event) =>
      responseToLambda(await fetch(eventToRequest(event)));
  };

export const createStreamRouteAwsLambdaHttpApiHandlerFor: typeof createRouteStreamAwsLambdaHttpApiHandlerFor =
  createRouteStreamAwsLambdaHttpApiHandlerFor;

export const createStreamAwsLambdaHttpApiHandlerFor: typeof createRouteStreamAwsLambdaHttpApiHandlerFor =
  createRouteStreamAwsLambdaHttpApiHandlerFor;

export function createAwsLambdaRestApiHandler<
  TManifest extends JoorManifest,
  const TPlugins extends readonly JoorPlugin<object>[] = readonly [],
  TRequest extends Request = RpcManifestRequiredRuntimeRequest<TManifest>,
>(
  manifest: TManifest,
  ...args: HandlerOptionsArgs<
    TManifest,
    TPlugins,
    RpcManifestBody<TManifest>,
    TRequest
  >
): AwsLambdaRestApiHandler;
export function createAwsLambdaRestApiHandler<TManifest extends JoorManifest>(
  manifest: TManifest,
  options?: HandlerOptions
): AwsLambdaRestApiHandler {
  const fetch = createFetch(manifest, options);
  return async (event) =>
    responseToRestApiLambda(await fetch(restApiEventToRequest(event)));
}

export function createRouteUnaryAwsLambdaRestApiHandler<
  TManifest extends JoorManifest,
  const TPlugins extends readonly JoorPlugin<object>[] = readonly [],
  TRequest extends Request =
    RpcManifestRouteUnaryRequiredRuntimeRequest<TManifest>,
>(
  manifest: TManifest,
  ...args: AwsLambdaRestApiRouteUnaryHandlerOptionsArgs<
    TManifest,
    TPlugins,
    RpcManifestRouteUnaryBody<TManifest>,
    TRequest
  >
): AwsLambdaRestApiHandler;
export function createRouteUnaryAwsLambdaRestApiHandler<
  TManifest extends JoorManifest,
>(manifest: TManifest, options?: HandlerOptions): AwsLambdaRestApiHandler {
  const fetch = createRouteUnaryFetch(manifest, options);
  return async (event) =>
    responseToRestApiLambda(await fetch(restApiEventToRequest(event)));
}

export const createUnaryRouteAwsLambdaRestApiHandler: typeof createRouteUnaryAwsLambdaRestApiHandler =
  createRouteUnaryAwsLambdaRestApiHandler;

export const createUnaryAwsLambdaRestApiHandler: typeof createRouteUnaryAwsLambdaRestApiHandler =
  createRouteUnaryAwsLambdaRestApiHandler;

export function createRouteStreamAwsLambdaRestApiHandler<
  TManifest extends JoorManifest,
  const TPlugins extends readonly JoorPlugin<object>[] = readonly [],
  TRequest extends Request =
    RpcManifestRouteStreamRequiredRuntimeRequest<TManifest>,
>(
  manifest: TManifest,
  ...args: AwsLambdaRestApiRouteStreamHandlerOptionsArgs<
    TManifest,
    TPlugins,
    RpcManifestRouteStreamBody<TManifest>,
    TRequest
  >
): AwsLambdaRestApiHandler;
export function createRouteStreamAwsLambdaRestApiHandler<
  TManifest extends JoorManifest,
>(manifest: TManifest, options?: HandlerOptions): AwsLambdaRestApiHandler {
  const fetch = createRouteStreamFetch(manifest, options);
  return async (event) =>
    responseToRestApiLambda(await fetch(restApiEventToRequest(event)));
}

export const createStreamRouteAwsLambdaRestApiHandler: typeof createRouteStreamAwsLambdaRestApiHandler =
  createRouteStreamAwsLambdaRestApiHandler;

export const createStreamAwsLambdaRestApiHandler: typeof createRouteStreamAwsLambdaRestApiHandler =
  createRouteStreamAwsLambdaRestApiHandler;

export const createAwsLambdaRestApiHandlerFor =
  <TEvent extends AwsLambdaRestApiEventV1>() =>
  <
    TManifest extends JoorManifest,
    const TPlugins extends readonly JoorPlugin<object>[] = readonly [],
    TRequest extends Request = RpcManifestRequiredRuntimeRequest<TManifest>,
  >(
    manifest: TManifest,
    ...args: AwsLambdaRestApiHandlerOptionsArgs<
      TManifest,
      TPlugins,
      RpcManifestBody<TManifest>,
      TRequest
    >
  ): AwsLambdaRestApiHandler<TEvent> => {
    const fetch = createFetch(manifest, (args[0] ?? {}) as HandlerOptions);
    return async (event) =>
      responseToRestApiLambda(await fetch(restApiEventToRequest(event)));
  };

export const createRouteUnaryAwsLambdaRestApiHandlerFor =
  <TEvent extends AwsLambdaRestApiEventV1>() =>
  <
    TManifest extends JoorManifest,
    const TPlugins extends readonly JoorPlugin<object>[] = readonly [],
    TRequest extends Request =
      RpcManifestRouteUnaryRequiredRuntimeRequest<TManifest>,
  >(
    manifest: TManifest,
    ...args: AwsLambdaRestApiRouteUnaryHandlerOptionsArgs<
      TManifest,
      TPlugins,
      RpcManifestRouteUnaryBody<TManifest>,
      TRequest
    >
  ): AwsLambdaRestApiHandler<TEvent> => {
    const fetch = createRouteUnaryFetch(
      manifest,
      (args[0] ?? {}) as HandlerOptions
    );
    return async (event) =>
      responseToRestApiLambda(await fetch(restApiEventToRequest(event)));
  };

export const createUnaryRouteAwsLambdaRestApiHandlerFor: typeof createRouteUnaryAwsLambdaRestApiHandlerFor =
  createRouteUnaryAwsLambdaRestApiHandlerFor;

export const createUnaryAwsLambdaRestApiHandlerFor: typeof createRouteUnaryAwsLambdaRestApiHandlerFor =
  createRouteUnaryAwsLambdaRestApiHandlerFor;

export const createRouteStreamAwsLambdaRestApiHandlerFor =
  <TEvent extends AwsLambdaRestApiEventV1>() =>
  <
    TManifest extends JoorManifest,
    const TPlugins extends readonly JoorPlugin<object>[] = readonly [],
    TRequest extends Request =
      RpcManifestRouteStreamRequiredRuntimeRequest<TManifest>,
  >(
    manifest: TManifest,
    ...args: AwsLambdaRestApiRouteStreamHandlerOptionsArgs<
      TManifest,
      TPlugins,
      RpcManifestRouteStreamBody<TManifest>,
      TRequest
    >
  ): AwsLambdaRestApiHandler<TEvent> => {
    const fetch = createRouteStreamFetch(
      manifest,
      (args[0] ?? {}) as HandlerOptions
    );
    return async (event) =>
      responseToRestApiLambda(await fetch(restApiEventToRequest(event)));
  };

export const createStreamRouteAwsLambdaRestApiHandlerFor: typeof createRouteStreamAwsLambdaRestApiHandlerFor =
  createRouteStreamAwsLambdaRestApiHandlerFor;

export const createStreamAwsLambdaRestApiHandlerFor: typeof createRouteStreamAwsLambdaRestApiHandlerFor =
  createRouteStreamAwsLambdaRestApiHandlerFor;
