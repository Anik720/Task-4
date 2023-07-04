import mongoose from 'mongoose'
import { IGenericMessage } from '../interfaces/error'

const handleDuplicateFieldsDB = (error: any) => {
  const value = error.errmsg.match(/(["'])(\\?.)*?\1/)[0]
  console.log(value)

  const message = `Duplicate field value: ${value}. Please use another value!`
  const errors: IGenericMessage[] = [
    {
      path: error.path,
      message: message,
    },
  ]

  const statusCode = 400
  return {
    statusCode,
    message: error.errmsg,
    errorMessages: errors,
  }
}

export default handleDuplicateFieldsDB
