import type { JsonObject } from '../schema/json.js';
import type { CompilerManifest } from './manifest.js';

const propertyAccessSegmentPattern = /^[A-Za-z_$][A-Za-z0-9_$]*$/;

const createGeneratedClientExpression = (routeId: string): string =>
  routeId
    .split('.')
    .reduce(
      (expression, segment) =>
        propertyAccessSegmentPattern.test(segment)
          ? `${expression}.${segment}`
          : `${expression}[${JSON.stringify(segment)}]`,
      'client'
    );

export const createClientDocs = (
  id: string,
  stream: CompilerManifest['procedures'][number]['procedure']['stream']
): JsonObject => {
  const path = id.split('.');
  const leaf = createGeneratedClientExpression(id);
  const quotedId = JSON.stringify(id);

  if (stream === undefined) {
    return {
      kind: 'unary',
      routeId: id,
      path,
      callable: {
        result: `${leaf}(input, options?)`,
        call: `${leaf}.call(input, options?)`,
        request: `${leaf}.request(input, options?)`,
        protocolRequest: `${leaf}.protocolRequest(input, options?)`,
      },
      transport: {
        result: `transport.call(${quotedId}, input, options?)`,
        request: `transport.request(${quotedId}, input, options?)`,
        batch: 'transport.batch([request], options?)',
      },
    };
  }

  return {
    kind: 'stream',
    routeId: id,
    path,
    callable: {
      data: `${leaf}(input, options?)`,
      stream: `${leaf}.stream(input, options?)`,
      events: `${leaf}.events(input, options?)`,
      protocolRequest: `${leaf}.protocolRequest(input, options?)`,
    },
    transport: {
      data: `transport.stream(${quotedId}, input, options?)`,
      events: `transport.streamEvents(${quotedId}, input, options?)`,
    },
  };
};
