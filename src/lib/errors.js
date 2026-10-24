/**
 * Errors with an HTTP status and a stable machine-readable code.
 * The API turns them into: { "error": { "code": "...", "message": "..." } }
 */
class AppError extends Error {
  constructor(status, code, message, details) {
    super(message);
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

const badRequest = (message, details) => new AppError(400, 'BAD_REQUEST', message, details);
const unauthorized = (message = 'Authentication required') => new AppError(401, 'UNAUTHORIZED', message);
const notFound = (message = 'Not found') => new AppError(404, 'NOT_FOUND', message);
const conflict = (message) => new AppError(409, 'CONFLICT', message);

module.exports = { AppError, badRequest, unauthorized, notFound, conflict };
