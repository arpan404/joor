export type ErrorLevel =
    "warn" |
    "error" |
    "panic";

export type ErrorCode =
    | "BAD_REQUEST"
    | "VALIDATION_ERROR"
    | "UNAUTHORIZED"
    | "FORBIDDEN"
    | "NOT_FOUND"
    | "METHOD_NOT_ALLOWED"
    | "CONFLICT"
    | "UNPROCESSABLE_ENTITY"
    | "UNSUPPORTED_MEDIA_TYPE"
    | "RATE_LIMITED"
    | "POLICY_DENIED"
    | "PARSE_ERROR"
    | "SERVICE_UNAVAILABLE"
    | "GATEWAY_TIMEOUT"
    | "INTERNAL_ERROR";

export interface ValidationError {
    path: string;
    message: string;
    expected: string;
    received: string;
}

export interface JoorError {
    code: ErrorCode;
    message: string;
    level: ErrorLevel;
    cause?: unknown;
}