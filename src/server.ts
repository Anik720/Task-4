import mongoose from 'mongoose'
import app from './app'
import config from './config/index'
import { logger, errorLogger } from './shared/logger'
import { Server } from 'http'

process.on('uncaughtException', error => {
  errorLogger.error(
    'uncaught exception detected. We are closing the server.',
    error
  )
  process.exit(1)
})
let server: Server
async function main() {
  try {
    await mongoose.connect(config.database_url as string)
    logger.info('Database connected successfully')

    server = app.listen(config.port, () => {
      logger.info(`app listening on port ${config.port}`)
    })
  } catch (err) {
    errorLogger.error('Failed', err)
  }
  process.on('unhandledRejection', error => {
    console.log('UnhandleRejection is detected, we are closing server.')
    if (server) {
      server.close(() => {
        errorLogger.error(error)
        process.exit(1)
      })
    } else {
      process.exit(1)
    }
  })
  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}

main()

process.on('SIGTERM', () => {
  logger.info('SIGTERM recieved')
  if (server) {
    server.close()
  }
})
