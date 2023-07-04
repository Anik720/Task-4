import { Model, ObjectId, Schema, Types } from 'mongoose'

export type UserName = {
  firstName: string
  lastName: string
  middleName: string
}
export type IUser = {
  _id?: ObjectId
  phoneNumber?: string
  role?: string
  name?: UserName
  password?: string
  address?: string
  budget?: number
  income?: number
}

// export type UserModel = Model<IUser, Record<string, unknown>>
export type UserModel = {
  isUserExist(
    id: string
  ): Promise<
    Pick<
      IUser,
      '_id' | 'password' | 'role' | 'phoneNumber' | 'name' | 'address'
    >
  >
  isPasswordMatched(
    givenPassword: string,
    savedPassword: string
  ): Promise<boolean>
} & Model<IUser>
export type IUserFilters = {
  searchTerm?: string
  phoneNumber?: string
  address?: string
  budget?: number
  income?: number
}
