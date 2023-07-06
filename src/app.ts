import express, { Application, Request, Response, NextFunction } from 'express'
import cors from 'cors'

import globalErrorHandler from './app/middlewares/globalErrorHandlers'
import { UserRouter } from './app/modules/users/users.routes'
import routes from './app/routes'
import httpStatus from 'http-status'
// const cookieParser = require('cookie-parser')
import cookieParser from 'cookie-parser'
const app: Application = express()
app.use(cookieParser())
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// app.use('/api/v1/users', UserRouter)
// app.use('/api/v1/academic-semesters', AcademicSemesterRoutes)
app.use('/api/v1', routes)
app.get('/', (req, res, next) => {
  throw new Error('Testing error logger')
  //   next('Hello error')
  // Promise.reject(new Error('Unhandle rejection'))
})
// global error handler
app.use(globalErrorHandler)

app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(httpStatus.NOT_FOUND).json({
    success: false,
    message: 'NOT FOUND',
    errorMessages: [
      {
        path: req.originalUrl,
        message: 'API not FOUND',
      },
    ],
  })
  next()
})

export default app
