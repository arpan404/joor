import type { ErrorCode, ValidationError } from './types.js';

/**
 * HttpError represents an HTTP error with a status code, 
 */
export class HttpError extends Error {
    readonly status: number;
    readonly code: ErrorCode
    readonly headers?: Record<string, string>;
    readonly details?: unknown;

    constructor(status: number, code: ErrorCode, message: string, opts?: { headers?: Record<string, string>; details?: unknown; cause?: unknown }) {
        super(message, opts?.cause ? { cause: opts.cause } : undefined);
        this.status = status;
        this.code = code;
        this.headers = opts?.headers;
        this.details = opts?.details;
    }

    toResponse(): Response {
        const body: Record<string, unknown> = {
            error: this.code,
            message: this.message,
        };
        if (this.details !== undefined) {
            body.details = this.details;
        }
        return new Response(JSON.stringify(body), {
            status: this.status,
            headers: {
                'content-type': 'application/json',
                ...this.headers,
            },
        });

    }


    static validationError(errors: ValidationError[]): HttpError {
        return new HttpError(400, 'VALIDATION_ERROR', 'Validation failed', { details: errors });
    }

}


// Helper functions to create common HTTP errors with appropriate status codes and error codes.

/**
 * Creates a 404 Not Found error.
 * @param message Optional custom error message.
 * @param details Optional additional details about the error.
 * @returns An instance of HttpError representing a 404 Not Found error.
 * 
 * @example
 * throw notFound('The requested resource was not found', { resourceId: '123' });
 */
export const notFound = (
    message?: string,
    details?: unknown,
): HttpError => new HttpError(404, 'NOT_FOUND', message ?? 'Not Found', { details });


/**
 * Creates a 400 Bad Request error.
 * @param message Optional custom error message.
 * @param details Optional additional details about the error, such as validation errors or request payload issues.
 * @returns An instance of HttpError representing a 400 Bad Request error.
 * 
 * @example
 * throw badRequest('Invalid request payload', { expected: 'JSON', received: 'XML' });
 */
export const badRequest = (
    message?: string,
    details?: unknown,
): HttpError => new HttpError(400, 'BAD_REQUEST', message ?? 'Bad Request', { details });

/**
 * Creates a 401 Unauthorized error.
 * @param message Optional custom error message.
 * @param details Optional additional details about the error.
 * @returns An instance of HttpError representing a 401 Unauthorized error.
 */
export const unauthorized = (
    message?: string,
    details?: unknown,
): HttpError => new HttpError(401, 'UNAUTHORIZED', message ?? 'Unauthorized', { details });

/**
 * Creates a 403 Forbidden error.
 * @param message Optional custom error message.
 * @param details Optional additional details about the error.
 * @returns An instance of HttpError representing a 403 Forbidden error.
 */
export const forbidden = (
    message?: string,
    details?: unknown,
): HttpError => new HttpError(403, 'FORBIDDEN', message ?? 'Forbidden', { details });

/**
 * Creates a 500 Internal Server Error.
 * @param message Optional custom error message.
 * @param details Optional additional details about the error.
 * @returns An instance of HttpError representing a 500 Internal Server Error.
 */
export const internalError = (
    message?: string,
    details?: unknown,
): HttpError => new HttpError(500, 'INTERNAL_ERROR', message ?? 'Internal Server Error', { details });

/**
 * Creates a 503 Service Unavailable error.
 * @param message Optional custom error message.
 * @param details Optional additional details about the error.
 * @returns An instance of HttpError representing a 503 Service Unavailable error.
 */
export const serviceUnavailable = (
    message?: string,
    details?: unknown,
): HttpError => new HttpError(503, 'SERVICE_UNAVAILABLE', message ?? 'Service Unavailable', { details });

/**
 * Creates a 504 Gateway Timeout error.
 * @param message Optional custom error message.
 * @param details Optional additional details about the error.
 * @returns An instance of HttpError representing a 504 Gateway Timeout error.
 */
export const gatewayTimeout = (
    message?: string,
    details?: unknown,
): HttpError => new HttpError(504, 'GATEWAY_TIMEOUT', message ?? 'Gateway Timeout', { details });

/**
 * Creates a 405 Method Not Allowed error.
 * @param message Optional custom error message.
 * @param details Optional additional details about the error.
 * @returns An instance of HttpError representing a 405 Method Not Allowed error.
 */
export const methodNotAllowed = (
    message?: string,
    details?: unknown,
): HttpError => new HttpError(405, 'METHOD_NOT_ALLOWED', message ?? 'Method Not Allowed', { details });

/**
 * Creates a 409 Conflict error.
 * @param message Optional custom error message.
 * @param details Optional additional details about the error.
 * @returns An instance of HttpError representing a 409 Conflict error.
 */
export const conflict = (
    message?: string,
    details?: unknown,
): HttpError => new HttpError(409, 'CONFLICT', message ?? 'Conflict', { details });


/**
 * Creates a 422 Unprocessable Entity error.
 * @param message Optional custom error message.
 * @param details Optional additional details about the error.
 * @returns An instance of HttpError representing a 422 Unprocessable Entity error.
 */
export const unprocessableEntity = (
    message?: string,
    details?: unknown,
): HttpError => new HttpError(422, 'UNPROCESSABLE_ENTITY', message ?? 'Unprocessable Entity', { details });

/**
 * Creates a 415 Unsupported Media Type error.
 * @param message Optional custom error message.
 * @param details Optional additional details about the error.
 * @returns An instance of HttpError representing a 415 Unsupported Media Type error.
 */
export const unsupportedMediaType = (
    message?: string,
    details?: unknown,
): HttpError => new HttpError(415, 'UNSUPPORTED_MEDIA_TYPE', message ?? 'Unsupported Media Type', { details });

/**
 * Creates a 429 Too Many Requests (Rate Limited) error.
 * @param message Optional custom error message.
 * @param details Optional additional details about the error.
 * @returns An instance of HttpError representing a 429 Too Many Requests error.
 */
export const rateLimited = (
    message?: string,
    details?: unknown,
): HttpError => new HttpError(429, 'RATE_LIMITED', message ?? 'Too Many Requests', { details });

/**
 * Creates a 403 Policy Denied error.
 * @param message Optional custom error message.
 * @param details Optional additional details about the error.
 * @returns An instance of HttpError representing a 403 Policy Denied error.
 */
export const policyDenied = (
    message?: string,
    details?: unknown,
): HttpError => new HttpError(403, 'POLICY_DENIED', message ?? 'Policy Denied', { details });

/**
 * Creates a 400 Parse Error.
 * @param message Optional custom error message.
 * @param details Optional additional details about the error.
 * @returns An instance of HttpError representing a 400 Parse Error.
 */
export const parseError = (
    message?: string,
    details?: unknown,
): HttpError => new HttpError(400, 'PARSE_ERROR', message ?? 'Parse Error', { details });

/**
 * Alias for creating a 500 Internal Server Error.
 * @param message Optional custom error message.
 * @param details Optional additional details about the error.
 * @returns An instance of HttpError representing a 500 Internal Server Error.
 */
export const internalServerError = (
    message?: string,
    details?: unknown,
): HttpError => new HttpError(500, 'INTERNAL_ERROR', message ?? 'Internal Server Error', { details });

/**
 * Alias for creating a 503 Service Unavailable error.
 * @param message Optional custom error message.
 * @param details Optional additional details about the error.
 * @returns An instance of HttpError representing a 503 Service Unavailable error.
 */
export const serviceUnavailableError = (
    message?: string,
    details?: unknown,
): HttpError => new HttpError(503, 'SERVICE_UNAVAILABLE', message ?? 'Service Unavailable', { details });

/**
 * Alias for creating a 504 Gateway Timeout error.
 * @param message Optional custom error message.
 * @param details Optional additional details about the error.
 * @returns An instance of HttpError representing a 504 Gateway Timeout error.
 */
export const gatewayTimeoutError = (
    message?: string,
    details?: unknown,
): HttpError => new HttpError(504, 'GATEWAY_TIMEOUT', message ?? 'Gateway Timeout', { details });

/**
 * Creates a 400 Validation Error with details about input validation failures.
 * @param errors Array of validation error objects giving field-specific issues.
 * @returns An instance of HttpError representing a 400 Validation Error.
 */
export const validationError = (
    errors: ValidationError[],
): HttpError => new HttpError(400, 'VALIDATION_ERROR', 'Validation failed', { details: errors });
