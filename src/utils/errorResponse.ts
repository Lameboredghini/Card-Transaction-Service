import { ErrorResponse } from '../interface/error';

export function formatErrorResponse(err: unknown): ErrorResponse {
  const error = err as Partial<Error> & { details?: any };

  return {
    error: error.name || 'UnknownError',
    message: error.message || 'An unexpected error occurred.',
    details: error.details || {},
  };
}
