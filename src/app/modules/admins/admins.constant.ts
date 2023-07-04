import { ObjectId } from 'mongoose'
import { ENUM_USER_ROLE } from '../../../enums/user'

export type ILoginUser = {
  _id: ObjectId
  phoneNumber: string
  password: string
}

export type ILoginUserResponse = {
  accessToken: string
  refreshToken?: string
}

export type IRefreshTokenResponse = {
  accessToken: string
}

export type IVerifiedLoginUser = {
  userId: string
  role: ENUM_USER_ROLE
}
