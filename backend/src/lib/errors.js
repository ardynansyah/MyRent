export class ApiError extends Error {
  constructor(status, code, message, details) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.code = code
    this.details = details
  }
}

export const validationFailed = (details) =>
  new ApiError(422, 'VALIDATION_ERROR', 'Data yang dikirim tidak valid', details)
