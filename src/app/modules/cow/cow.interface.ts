import { Model, Schema, Types } from 'mongoose'
import { IUser } from '../users/users.interface'

export type ICow = {
  name: string
  age: number
  price: number
  location: string
  breed: string
  weight: number
  label: string
  category: string
  seller: Types.ObjectId | IUser | string
}

export type CowModel = Model<ICow, Record<string, unknown>>
export type ICowFilters = {
  searchTerm?: string
  name?: string
  age?: number
  price?: number
  location?: string
  breed?: string
  weight?: number
  label?: string
  category?: string
  minPrice?: number
  maxPrice?: number
}
