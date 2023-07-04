import { Model, Schema, Types } from 'mongoose'
import { IUser } from '../users/users.interface'
import { ICow } from '../cow/cow.interface'

export type IOrder = {
  cow?: Types.ObjectId | ICow
  buyer?: Types.ObjectId | IUser
}

export type OrderModel = Model<IOrder, Record<string, unknown>>
