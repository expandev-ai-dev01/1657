export interface ISuccessResponse<T> {
  success: true;
  data: T;
  metadata?: {
    timestamp: string;
    [key: string]: any;
  };
}

export interface IErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: any;
  };
  timestamp: string;
}

/**
 * @summary Creates a standardized success response object.
 * @param {T} data - The payload to be returned.
 * @param {object} [metadata] - Optional metadata (e.g., for pagination).
 * @returns {ISuccessResponse<T>} The success response object.
 */
export function successResponse<T>(data: T, metadata?: object): ISuccessResponse<T> {
  return {
    success: true,
    data,
    metadata: {
      ...metadata,
      timestamp: new Date().toISOString(),
    },
  };
}

/**
 * @summary Creates a standardized error response object.
 * @param {string} message - The error message.
 * @param {string} [code='GENERAL_ERROR'] - A machine-readable error code.
 * @param {any} [details] - Additional error details.
 * @returns {IErrorResponse} The error response object.
 */
export function errorResponse(
  message: string,
  code = 'GENERAL_ERROR',
  details?: any
): IErrorResponse {
  return {
    success: false,
    error: {
      code,
      message,
      details,
    },
    timestamp: new Date().toISOString(),
  };
}
