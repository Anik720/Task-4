import express, { ErrorRequestHandler } from 'express'
import config from '../../config'
import { IGenericMessage } from '../../interfaces/error'
import handleValidationError from '../../errors/handleValidationError'
import ApiError from '../../errors/ApiErrors'
import { errorLogger } from '../../shared/logger'
import { ZodError } from 'zod'
import handleZodError from '../../errors/handleZodError'
import handleCastError from '../../errors/handleCastError'
import handleDuplicateFieldsDB from '../../errors/handleDuplicateFieldsDB'
const globalErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  let statusCode = 500
  let message = 'something went wrong!'
  let errorMessages: IGenericMessage[] = []
  // config.env === 'development'
  //   ? console.log('GlobalErrorHandler', err)
  //   : errorLogger.error('GlobalErrorHandler', err)
  if (err?.name === 'ValidationError') {
    let simplifiedErrorMessage = handleValidationError(err)
    statusCode = simplifiedErrorMessage.statusCode
    message = simplifiedErrorMessage.message
    errorMessages = simplifiedErrorMessage.errorMessages
  } else if (err instanceof ZodError) {
    const simlifiedError = handleZodError(err)
    statusCode = simlifiedError.statusCode
    message = simlifiedError.message
    errorMessages = simlifiedError.errorMessages
  } else if (err.code === 11000) {
    const simlifiedError = handleDuplicateFieldsDB(err)
    statusCode = simlifiedError.statusCode
    message = simlifiedError.message
    errorMessages = simlifiedError.errorMessages
  } else if (err?.name === 'CastError') {
    const simplifiedError = handleCastError(err)
    statusCode = simplifiedError.statusCode
    message = simplifiedError.message
    errorMessages = simplifiedError.errorMessages
  } else if (err instanceof ApiError) {
    statusCode = err.statusCode
    message = err.message
    errorMessages = err.message
      ? [
          {
            path: '',
            message: err?.message,
          },
        ]
      : []
  } else if (err instanceof Error) {
    message = err.message
    errorMessages = err.message
      ? [
          {
            path: '',
            message: err?.message,
          },
        ]
      : []
  }
  console.log('GlobalErrorHandler', message, errorMessages)
  res.status(statusCode).json({
    success: false,
    message,
    errorMessages,
    stack: config.env !== 'production' ? err.stack : undefined,
  })
}

export default globalErrorHandler
