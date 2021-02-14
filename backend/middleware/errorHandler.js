import { ErrorResponse } from '../utils/errorResponse.js'

const error = (err, req, res, next) => {
  let error = { ...err }

  error.message = err.message

  if (err.code === 11000) {
    const message = 'Duplicate field value entered'
    error = new ErrorResponse(message, 400)
  }

  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map((val) => val.message)
    error = new ErrorResponse(message, 400)
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'Server error',
  })
}

const notFound = (req, res, next) => {
  const error = new Error(`Not found - ${req.originalUrl}`)
  res.status(404)
  next(error)
}

const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode == 200 ? 500 : res.statusCode

  res.status(statusCode)
  res.json({
    message: err.message,
    stack_trace: process.env.NODE_ENV == 'production' ? null : err.stack,
  })
}

export { error, notFound, errorHandler }
